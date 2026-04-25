# 监控告警配置指南

**文档版本**: V1.0  
**创建时间**: 2026-04-16  
**关联问题**: P0-TS-03: 监控告警细节缺失

---

## 📋 目录

1. [监控架构](#监控架构)
2. [服务器监控](#服务器监控)
3. [业务监控](#业务监控)
4. [数据库监控](#数据库监控)
5. [告警配置](#告警配置)
6. [监控面板](#监控面板)
7. [运维手册](#运维手册)

---

## 监控架构

### 整体架构

```
┌──────────────────────────────────────────────────┐
│              清如 ClearSpring V2.0                │
│                  监控告警架构                      │
└──────────────────────────────────────────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  服务器监控  │    │  业务监控    │    │  数据库监控  │
│  PM2 + Node │    │  应用层      │    │  MySQL      │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       └──────────────────┼──────────────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   Prometheus    │
                 │   (指标收集)     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │    Grafana      │
                 │   (可视化面板)   │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │  Alertmanager   │
                 │   (告警路由)     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   飞书机器人     │
                 │   (告警通知)     │
                 └─────────────────┘
```

### 监控组件

| 组件 | 用途 | 部署位置 |
|------|------|---------|
| PM2 | Node.js 进程管理、基础监控 | 火山云服务器 |
| Prometheus | 指标收集、存储 | 火山云服务器 |
| Grafana | 可视化面板 | 火山云服务器 |
| Alertmanager | 告警路由、分组 | 火山云服务器 |
| 飞书机器人 | 告警通知 | 云端 |

---

## 服务器监控

### 1. PM2 监控

#### 安装 PM2 监控模块

```bash
# 在服务器上安装
npm install pm2 -g
pm2 install pm2-logrotate
pm2 install pm2-prometheus
```

#### PM2 配置

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'clearspring-api',
    script: './backend/server.js',
    instances: 4,
    exec_mode: 'cluster',
    
    // 环境变量
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // 日志配置
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    
    // 重启策略
    max_memory_restart: '512M',
    max_restarts: 10,
    min_uptime: '10s',
    
    // 监控配置
    watch: false,
    ignore_watch: ['logs', 'node_modules'],
    
    // Prometheus 指标
    metric: {
      enabled: true,
      port: 9600
    }
  }]
};
```

#### PM2 监控脚本

```javascript
// backend/scripts/monitor.js
const pm2 = require('pm2');
const axios = require('axios');

// 告警阈值
const THRESHOLDS = {
  cpu: 80,              // CPU 使用率超过 80% 告警
  memory: 80,           // 内存使用率超过 80% 告警
  responseTime: 2000,   // 响应时间超过 2 秒告警
  errorRate: 5,         // 错误率超过 5% 告警
  restartCount: 5       // 1 小时内重启超过 5 次告警
};

// 告警冷却时间（避免重复告警）
const ALERT_COOLDOWN = 300000; // 5 分钟
const lastAlertTime = {};

/**
 * 主监控循环
 */
async function startMonitoring() {
  console.log('启动 PM2 监控...');
  
  // 每分钟检查一次
  setInterval(async () => {
    await checkPM2Metrics();
    await checkApplicationMetrics();
  }, 60000);
  
  // 立即执行一次
  await checkPM2Metrics();
  await checkApplicationMetrics();
}

/**
 * 检查 PM2 指标
 */
async function checkPM2Metrics() {
  try {
    const stats = await getPM2SystemInfo();
    
    // 检查 CPU
    if (stats.cpu > THRESHOLDS.cpu) {
      await sendAlert('HighCPU', `CPU 使用率过高：${stats.cpu.toFixed(2)}%`);
    }
    
    // 检查内存
    if (stats.memory > THRESHOLDS.memory) {
      await sendAlert('HighMemory', `内存使用率过高：${stats.memory.toFixed(2)}%`);
    }
    
    // 检查进程状态
    const processes = await getPM2Processes();
    for (const proc of processes) {
      // 检查重启次数
      if (proc.monit.restart_time > THRESHOLDS.restartCount) {
        await sendAlert('HighRestart', `进程 ${proc.name} 重启次数过多：${proc.monit.restart_time}次`);
      }
      
      // 检查进程状态
      if (proc.pm2_env.status !== 'online') {
        await sendAlert('ProcessDown', `进程 ${proc.name} 状态异常：${proc.pm2_env.status}`);
      }
    }
  } catch (error) {
    console.error('PM2 监控失败:', error);
  }
}

/**
 * 检查应用指标
 */
async function checkApplicationMetrics() {
  try {
    // 检查 API 响应时间
    const responseTime = await checkResponseTime();
    if (responseTime > THRESHOLDS.responseTime) {
      await sendAlert('SlowResponse', `API 响应时间过长：${responseTime}ms`);
    }
    
    // 检查错误率
    const errorRate = await getErrorRate();
    if (errorRate > THRESHOLDS.errorRate) {
      await sendAlert('HighErrorRate', `API 错误率过高：${errorRate.toFixed(2)}%`);
    }
  } catch (error) {
    console.error('应用监控失败:', error);
  }
}

/**
 * 获取 PM2 系统信息
 */
async function getPM2SystemInfo() {
  return new Promise((resolve, reject) => {
    pm2.systemInfo((err, systemInfo) => {
      if (err) reject(err);
      else resolve(systemInfo);
    });
  });
}

/**
 * 获取 PM2 进程列表
 */
async function getPM2Processes() {
  return new Promise((resolve, reject) => {
    pm2.list((err, processes) => {
      if (err) reject(err);
      else resolve(processes);
    });
  });
}

/**
 * 检查 API 响应时间
 */
async function checkResponseTime() {
  const startTime = Date.now();
  
  try {
    await axios.get('http://localhost:3000/api/v1/health', {
      timeout: 5000
    });
    
    return Date.now() - startTime;
  } catch (error) {
    return 9999; // 请求失败，返回最大值
  }
}

/**
 * 获取错误率（从日志中统计）
 */
async function getErrorRate() {
  // 简化实现：检查最近 1 分钟的错误日志数量
  const fs = require('fs');
  const path = require('path');
  
  const logFile = path.join(__dirname, '../logs/error.log');
  
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n');
    
    // 统计最近 1 分钟的日志
    const oneMinuteAgo = Date.now() - 60000;
    let errorCount = 0;
    let totalCount = 0;
    
    for (const line of lines.slice(-1000)) { // 只检查最近 1000 行
      if (line.match(/\d{4}-\d{2}-\d{2}/)) {
        totalCount++;
        if (line.includes('ERROR') || line.includes('Error')) {
          errorCount++;
        }
      }
    }
    
    return totalCount > 0 ? (errorCount / totalCount) * 100 : 0;
  } catch (error) {
    return 0;
  }
}

/**
 * 发送告警
 */
async function sendAlert(alertType, message) {
  const now = Date.now();
  
  // 检查冷却时间
  if (lastAlertTime[alertType] && (now - lastAlertTime[alertType]) < ALERT_COOLDOWN) {
    console.log(`告警冷却中：${alertType}`);
    return;
  }
  
  lastAlertTime[alertType] = now;
  
  console.log(`发送告警：${alertType} - ${message}`);
  
  // 发送飞书告警
  await sendFeishuAlert(alertType, message);
  
  // 发送到 Prometheus Alertmanager（可选）
  // await sendToAlertmanager(alertType, message);
}

/**
 * 发送飞书告警
 */
async function sendFeishuAlert(alertType, message) {
  const webhook = process.env.FEISHU_WEBHOOK;
  
  if (!webhook) {
    console.warn('未配置飞书 Webhook');
    return;
  }
  
  const alertEmojis = {
    HighCPU: '🔴',
    HighMemory: '🔴',
    SlowResponse: '🟠',
    HighErrorRate: '🔴',
    HighRestart: '🟠',
    ProcessDown: '🔴'
  };
  
  const emoji = alertEmojis[alertType] || '⚠️';
  
  try {
    await axios.post(webhook, {
      msg_type: 'text',
      content: {
        text: `${emoji} 清如 V2.0 告警\n\n` +
              `类型：${alertType}\n` +
              `详情：${message}\n\n` +
              `时间：${new Date().toISOString()}\n` +
              `服务器：101.96.192.63`
      }
    });
  } catch (error) {
    console.error('发送飞书告警失败:', error);
  }
}

// 启动监控
startMonitoring().catch(console.error);
```

---

## 业务监控

### 1. 业务指标监控脚本

```javascript
// backend/scripts/business-monitor.js
const mysql = require('mysql2/promise');
const axios = require('axios');

// 告警阈值
const THRESHOLDS = {
  orderInterval: 2,           // 2 小时无订单告警（营业时间）
  paymentFailRate: 10,        // 支付失败率超过 10% 告警
  uploadFailRate: 10,         // 上传失败率超过 10% 告警
  contentFailRate: 20,        // 内容审核失败率超过 20% 告警
  zeroOrderTime: 2            // 0 点 -2 点不告警（非营业时间）
};

/**
 * 主监控循环
 */
async function startBusinessMonitoring() {
  console.log('启动业务监控...');
  
  // 每 5 分钟检查一次
  setInterval(async () => {
    await checkBusinessMetrics();
  }, 300000);
  
  // 立即执行一次
  await checkBusinessMetrics();
}

/**
 * 检查业务指标
 */
async function checkBusinessMetrics() {
  const connection = await getMySQLConnection();
  
  try {
    // 1. 检查订单间隔
    await checkOrderInterval(connection);
    
    // 2. 检查支付失败率
    await checkPaymentFailRate(connection);
    
    // 3. 检查上传失败率
    await checkUploadFailRate(connection);
    
    // 4. 检查内容审核失败率
    await checkContentFailRate(connection);
  } finally {
    await connection.end();
  }
}

/**
 * 检查订单间隔
 */
async function checkOrderInterval(connection) {
  const now = new Date();
  const hour = now.getHours();
  
  // 非营业时间不检查（0 点 -6 点）
  if (hour >= 0 && hour < 6) {
    return;
  }
  
  const [rows] = await connection.execute(`
    SELECT TIMESTAMPDIFF(MINUTE, MAX(created_at), NOW()) as minutes_ago
    FROM entrust_order
    WHERE status != 'cancelled'
  `);
  
  const minutesAgo = rows[0]?.minutes_ago || 9999;
  
  if (minutesAgo > THRESHOLDS.orderInterval * 60) {
    await sendAlert('NoOrder', `${THRESHOLDS.orderInterval}小时无新订单`);
  }
}

/**
 * 检查支付失败率
 */
async function checkPaymentFailRate(connection) {
  const [rows] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN status = 'payment_failed' THEN 1 ELSE 0 END) as failed
    FROM entrust_order
    WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
  `);
  
  const total = rows[0]?.total || 0;
  const failed = rows[0]?.failed || 0;
  
  if (total > 10) { // 样本数大于 10 才计算
    const failRate = (failed / total) * 100;
    
    if (failRate > THRESHOLDS.paymentFailRate) {
      await sendAlert('HighPaymentFail', 
        `支付失败率过高：${failRate.toFixed(2)}% (${failed}/${total})`);
    }
  }
}

/**
 * 检查上传失败率
 */
async function checkUploadFailRate(connection) {
  // 从日志中统计上传失败率
  const fs = require('fs');
  const path = require('path');
  
  const logFile = path.join(__dirname, '../logs/upload.log');
  
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n').slice(-1000);
    
    let total = 0;
    let failed = 0;
    
    for (const line of lines) {
      if (line.includes('upload')) {
        total++;
        if (line.includes('ERROR') || line.includes('failed')) {
          failed++;
        }
      }
    }
    
    if (total > 10) {
      const failRate = (failed / total) * 100;
      
      if (failRate > THRESHOLDS.uploadFailRate) {
        await sendAlert('HighUploadFail', 
          `上传失败率过高：${failRate.toFixed(2)}% (${failed}/${total})`);
      }
    }
  } catch (error) {
    // 忽略错误
  }
}

/**
 * 检查内容审核失败率
 */
async function checkContentFailRate(connection) {
  const [rows] = await connection.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN audit_status = 'rejected' THEN 1 ELSE 0 END) as rejected
    FROM content_audit_log
    WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
  `);
  
  const total = rows[0]?.total || 0;
  const rejected = rows[0]?.rejected || 0;
  
  if (total > 10) {
    const failRate = (rejected / total) * 100;
    
    if (failRate > THRESHOLDS.contentFailRate) {
      await sendAlert('HighContentFail', 
        `内容审核失败率过高：${failRate.toFixed(2)}% (${rejected}/${total})`);
    }
  }
}

/**
 * 获取 MySQL 连接
 */
async function getMySQLConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clearspring'
  });
}

/**
 * 发送告警
 */
async function sendAlert(alertType, message) {
  console.log(`业务告警：${alertType} - ${message}`);
  await sendFeishuAlert(alertType, message);
}

/**
 * 发送飞书告警
 */
async function sendFeishuAlert(alertType, message) {
  const webhook = process.env.FEISHU_WEBHOOK;
  if (!webhook) return;
  
  try {
    await axios.post(webhook, {
      msg_type: 'text',
      content: {
        text: `📊 清如 V2.0 业务告警\n\n` +
              `类型：${alertType}\n` +
              `详情：${message}\n\n` +
              `时间：${new Date().toISOString()}`
      }
    });
  } catch (error) {
    console.error('发送告警失败:', error);
  }
}

// 启动监控
startBusinessMonitoring().catch(console.error);
```

---

## 数据库监控

### 1. MySQL 监控配置

#### 开启慢查询日志

```sql
-- 查看当前配置
SHOW VARIABLES LIKE 'slow_query_log';
SHOW VARIABLES LIKE 'long_query_time';

-- 开启慢查询日志
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 2;  -- 超过 2 秒的查询记录为慢查询

-- 永久配置（写入 /etc/mysql/mysql.conf.d/mysqld.cnf）
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/mysql-slow.log
long_query_time = 2
log_queries_not_using_indexes = 1
```

#### 监控连接数

```sql
-- 查看当前连接数
SHOW STATUS LIKE 'Threads_connected';

-- 查看最大连接数
SHOW VARIABLES LIKE 'max_connections';

-- 查看连接数使用率
SELECT 
  (SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_STATUS 
   WHERE VARIABLE_NAME = 'Threads_connected') / 
  (SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_VARIABLES 
   WHERE VARIABLE_NAME = 'max_connections') * 100 as usage_percent;
```

### 2. MySQL 监控脚本

```javascript
// backend/scripts/mysql-monitor.js
const mysql = require('mysql2/promise');
const axios = require('axios');
const fs = require('fs');

// 告警阈值
const THRESHOLDS = {
  connectionUsage: 80,      // 连接数使用率超过 80% 告警
  slowQueryPerMinute: 5,    // 每分钟慢查询超过 5 个告警
  deadlockCount: 1,         // 死锁超过 1 次告警
  replicationDelay: 60      // 主从复制延迟超过 60 秒告警
};

/**
 * 主监控循环
 */
async function startMySQLMonitoring() {
  console.log('启动 MySQL 监控...');
  
  // 每分钟检查一次
  setInterval(async () => {
    await checkMySQLMetrics();
  }, 60000);
  
  // 立即执行一次
  await checkMySQLMetrics();
}

/**
 * 检查 MySQL 指标
 */
async function checkMySQLMetrics() {
  const connection = await getMySQLConnection();
  
  try {
    // 1. 检查连接数
    await checkConnectionCount(connection);
    
    // 2. 检查慢查询
    await checkSlowQueries(connection);
    
    // 3. 检查死锁
    await checkDeadlocks(connection);
    
    // 4. 检查主从复制（如果有）
    await checkReplication(connection);
  } finally {
    await connection.end();
  }
}

/**
 * 检查连接数
 */
async function checkConnectionCount(connection) {
  const [rows] = await connection.execute(`
    SELECT 
      (SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_STATUS 
       WHERE VARIABLE_NAME = 'Threads_connected') as current_connections,
      (SELECT VARIABLE_VALUE FROM information_schema.GLOBAL_VARIABLES 
       WHERE VARIABLE_NAME = 'max_connections') as max_connections
  `);
  
  const current = rows[0]?.current_connections || 0;
  const max = rows[0]?.max_connections || 1;
  const usagePercent = (current / max) * 100;
  
  if (usagePercent > THRESHOLDS.connectionUsage) {
    await sendAlert('HighDBConnections', 
      `数据库连接数过高：${usagePercent.toFixed(2)}% (${current}/${max})`);
  }
}

/**
 * 检查慢查询
 */
async function checkSlowQueries(connection) {
  // 读取慢查询日志
  const logFile = '/var/log/mysql/mysql-slow.log';
  
  try {
    const content = fs.readFileSync(logFile, 'utf8');
    const lines = content.split('\n');
    
    // 统计最近 1 分钟的慢查询数量
    const oneMinuteAgo = Date.now() - 60000;
    let slowQueryCount = 0;
    
    for (const line of lines.slice(-1000)) {
      if (line.includes('Query_time:')) {
        slowQueryCount++;
      }
    }
    
    if (slowQueryCount > THRESHOLDS.slowQueryPerMinute) {
      await sendAlert('HighSlowQueries', 
        `慢查询过多：${slowQueryCount}个/分钟`);
    }
  } catch (error) {
    // 忽略文件读取错误
  }
}

/**
 * 检查死锁
 */
async function checkDeadlocks(connection) {
  const [rows] = await connection.execute(`
    SHOW STATUS LIKE 'Innodb_deadlocks'
  `);
  
  const deadlockCount = rows[0]?.Value || 0;
  
  if (deadlockCount > THRESHOLDS.deadlockCount) {
    await sendAlert('DBDeadlock', `数据库死锁：${deadlockCount}次`);
  }
}

/**
 * 检查主从复制
 */
async function checkReplication(connection) {
  const [rows] = await connection.execute('SHOW SLAVE STATUS');
  
  if (rows.length > 0) {
    const slaveStatus = rows[0];
    const secondsBehind = slaveStatus.Seconds_Behind_Master;
    
    if (secondsBehind !== null && secondsBehind > THRESHOLDS.replicationDelay) {
      await sendAlert('ReplicationDelay', 
        `主从复制延迟：${secondsBehind}秒`);
    }
    
    // 检查复制状态
    if (slaveStatus.Slave_IO_Running !== 'Yes' || 
        slaveStatus.Slave_SQL_Running !== 'Yes') {
      await sendAlert('ReplicationStopped', '主从复制已停止');
    }
  }
}

/**
 * 获取 MySQL 连接
 */
async function getMySQLConnection() {
  return await mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clearspring'
  });
}

/**
 * 发送告警
 */
async function sendAlert(alertType, message) {
  console.log(`数据库告警：${alertType} - ${message}`);
  await sendFeishuAlert(alertType, message);
}

/**
 * 发送飞书告警
 */
async function sendFeishuAlert(alertType, message) {
  const webhook = process.env.FEISHU_WEBHOOK;
  if (!webhook) return;
  
  try {
    await axios.post(webhook, {
      msg_type: 'text',
      content: {
        text: `🗄️ 清如 V2.0 数据库告警\n\n` +
              `类型：${alertType}\n` +
              `详情：${message}\n\n` +
              `时间：${new Date().toISOString()}`
      }
    });
  } catch (error) {
    console.error('发送告警失败:', error);
  }
}

// 启动监控
startMySQLMonitoring().catch(console.error);
```

---

## 告警配置

### 告警分级

| 级别 | 通知方式 | 响应时间 | 示例 |
|------|---------|---------|------|
| **P0** | 电话 + 飞书 | 5 分钟内 | 服务器宕机、数据库不可用、支付失败 |
| **P1** | 飞书 | 30 分钟内 | CPU/内存过高、响应时间过长、错误率过高 |
| **P2** | 飞书 | 2 小时内 | 慢查询增多、上传失败、审核失败 |

### 飞书机器人配置

#### 1. 创建飞书机器人

1. 在飞书群中点击「群设置」→「智能助手」→「添加机器人」
2. 选择「自定义机器人」
3. 设置机器人名称：清如监控助手
4. 复制 Webhook 地址

#### 2. 配置环境变量

```bash
# .env 文件
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

#### 3. 告警模板

```javascript
// 通用告警发送函数
async function sendFeishuAlert(level, title, message) {
  const webhook = process.env.FEISHU_WEBHOOK;
  
  const levelConfig = {
    P0: { emoji: '🚨', color: 'red', mention: 'all' },
    P1: { emoji: '⚠️', color: 'orange', mention: '' },
    P2: { emoji: '📊', color: 'blue', mention: '' }
  };
  
  const config = levelConfig[level] || levelConfig.P2;
  
  const content = {
    msg_type: 'text',
    content: {
      text: `${config.emoji} 清如 V2.0 ${level}告警\n\n` +
            `标题：${title}\n` +
            `详情：${message}\n\n` +
            `时间：${new Date().toISOString()}\n` +
            `服务器：101.96.192.63`
    }
  };
  
  // P0 级别@所有人
  if (level === 'P0' && config.mention === 'all') {
    content.content.text += '\n\n@所有人';
  }
  
  await axios.post(webhook, content);
}
```

---

## 监控面板

### Grafana 面板配置

#### 1. 安装 Grafana

```bash
# 在服务器上安装
sudo apt-get update
sudo apt-get install -y grafana
sudo systemctl start grafana-server
sudo systemctl enable grafana-server
```

#### 2. 配置 Prometheus 数据源

在 Grafana 中添加 Prometheus 数据源：
- URL: `http://localhost:9090`
- Access: Server (default)

#### 3. 导入监控面板

推荐导入以下面板：

| 面板名称 | ID | 说明 |
|---------|-----|------|
| Node Exporter Full | 1860 | 服务器资源监控 |
| PM2 Dashboard | 10826 | Node.js 进程监控 |
| MySQL Dashboard | 7362 | MySQL 数据库监控 |
| Application Dashboard | 自定义 | 业务指标监控 |

#### 4. 自定义业务面板

```json
{
  "dashboard": {
    "title": "清如 V2.0 业务监控",
    "panels": [
      {
        "title": "订单量趋势",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(entrust_order_total[1h])",
            "legendFormat": "订单/小时"
          }
        ]
      },
      {
        "title": "支付成功率",
        "type": "gauge",
        "targets": [
          {
            "expr": "sum(entrust_order{status='paid'}) / sum(entrust_order) * 100",
            "legendFormat": "成功率 %"
          }
        ]
      },
      {
        "title": "API 响应时间 P95",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(api_response_time_bucket[5m]))",
            "legendFormat": "P95"
          }
        ]
      }
    ]
  }
}
```

---

## 运维手册

### 日常检查清单

#### 每日检查

- [ ] 查看 Grafana 监控面板，确认无红色告警
- [ ] 检查飞书告警群，确认无未处理告警
- [ ] 查看 PM2 日志，确认无异常报错
- [ ] 检查 MySQL 慢查询日志，优化性能问题

#### 每周检查

- [ ] 分析本周告警趋势，识别高频问题
- [ ] 检查服务器磁盘空间，清理旧日志
- [ ] 检查数据库备份是否正常
- [ ] 更新监控阈值（如有必要）

### 告警响应流程

#### P0 告警响应

1. **立即响应**（5 分钟内）
   - 查看告警详情
   - 登录服务器确认问题
   - 评估影响范围

2. **紧急处理**
   - 执行故障切换（如需要）
   - 恢复核心服务
   - 通知相关人员

3. **问题修复**
   - 定位根本原因
   - 实施修复方案
   - 验证服务恢复

4. **事后总结**
   - 编写事故报告
   - 制定改进措施
   - 更新监控规则

#### P1/P2 告警响应

1. **确认告警**（30 分钟内）
   - 查看告警详情
   - 判断是否误报

2. **分析问题**
   - 查看相关日志
   - 分析指标趋势

3. **实施修复**
   - 执行修复方案
   - 验证问题解决

4. **记录归档**
   - 记录处理过程
   - 更新知识库

---

*文档创建时间*: 2026-04-16 11:56 UTC  
*最后更新*: 2026-04-16 11:56 UTC
