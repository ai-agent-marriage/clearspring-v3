# 故障切换操作手册

**文档版本**: V1.0  
**创建时间**: 2026-04-16  
**关联问题**: P0-TS-02: 故障切换方案缺失

---

## 📋 目录

1. [架构设计](#架构设计)
2. [故障检测](#故障检测)
3. [切换流程](#切换流程)
4. [备用节点部署](#备用节点部署)
5. [降级策略](#降级策略)
6. [恢复流程](#恢复流程)
7. [演练计划](#演练计划)

---

## 架构设计

### 高可用架构

```
用户请求
  ↓
Nginx（负载均衡 + 健康检查）
  ↓
┌─────────────────────────────────┐
│         后端节点池               │
├─────────────────────────────────┤
│ 主节点：火山云服务器             │
│ 101.96.192.63:3000              │
│ 状态：ACTIVE                    │
├─────────────────────────────────┤
│ 备用节点：微信云函数             │
│ 状态：STANDBY（自动接管）        │
└─────────────────────────────────┘
```

### 组件说明

| 组件 | 位置 | 职责 | 切换时间 |
|------|------|------|---------|
| Nginx | 火山云 | 负载均衡、健康检查、自动切换 | < 30 秒 |
| 主节点 | 火山云服务器 | 处理所有 API 请求 | - |
| 备用节点 | 微信云函数 | 故障时接管只读请求 | < 1 分钟 |
| 监控脚本 | 火山云服务器 | 心跳检测、告警 | 实时 |

---

## 故障检测

### 方案 A：Nginx 健康检查（推荐）

#### 1. Nginx 配置

```nginx
# /etc/nginx/conf.d/upstream.conf

upstream backend {
    # 主节点
    server 101.96.192.63:3000 max_fails=3 fail_timeout=30s;
    
    # 备用节点（云函数 HTTP 触发器）
    # 注意：云函数需要配置 HTTP 触发器
    server backup-clearspring.ap-shanghai.tcb-api.tencentcloudapi.com backup;
    
    # 健康检查参数
    keepalive 32;
}

server {
    listen 80;
    server_name api.clearspring.org;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        
        # 超时配置
        proxy_connect_timeout 5s;
        proxy_send_timeout 10s;
        proxy_read_timeout 30s;
        
        # 健康检查（Nginx Plus 功能，开源版需用第三方模块）
        # health_check interval=10s fails=3 passes=2 uri=/api/v1/health;
    }
    
    # 健康检查接口
    location /api/v1/health {
        proxy_pass http://backend;
        access_log off;
    }
}
```

#### 2. 健康检查接口

```javascript
// backend/routes/health.js
const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');

/**
 * 健康检查接口
 * GET /api/v1/health
 */
router.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    checks: {}
  };
  
  let allHealthy = true;
  
  try {
    // 1. 检查 MySQL 连接
    const mysqlCheck = await checkMySQL();
    healthStatus.checks.mysql = mysqlCheck;
    if (!mysqlCheck.healthy) allHealthy = false;
    
    // 2. 检查内存使用
    const memoryCheck = checkMemory();
    healthStatus.checks.memory = memoryCheck;
    if (!memoryCheck.healthy) allHealthy = false;
    
    // 3. 检查磁盘空间
    const diskCheck = await checkDisk();
    healthStatus.checks.disk = diskCheck;
    if (!diskCheck.healthy) allHealthy = false;
    
    // 4. 检查云函数连通性
    const cloudCheck = await checkCloudFunction();
    healthStatus.checks.cloud = cloudCheck;
    
    healthStatus.status = allHealthy ? 'healthy' : 'degraded';
    healthStatus.uptime = process.uptime();
    
    res.json(healthStatus);
  } catch (error) {
    healthStatus.status = 'unhealthy';
    healthStatus.error = error.message;
    res.status(503).json(healthStatus);
  }
});

/**
 * 检查 MySQL 连接
 */
async function checkMySQL() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: 'clearspring',
      connectTimeout: 2000
    });
    
    await connection.ping();
    await connection.end();
    
    return {
      healthy: true,
      responseTime: Date.now()
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * 检查内存使用
 */
function checkMemory() {
  const usage = process.memoryUsage();
  const memoryLimit = 512 * 1024 * 1024; // 512MB
  const memoryUsed = usage.heapUsed;
  const memoryPercent = (memoryUsed / memoryLimit) * 100;
  
  return {
    healthy: memoryPercent < 80,
    used: Math.round(memoryUsed / 1024 / 1024) + 'MB',
    percent: memoryPercent.toFixed(2) + '%'
  };
}

/**
 * 检查磁盘空间
 */
async function checkDisk() {
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    const { stdout } = await execPromise('df -h / | tail -1');
    const parts = stdout.trim().split(/\s+/);
    const usePercent = parseInt(parts[4]);
    
    return {
      healthy: usePercent < 80,
      used: parts[2],
      available: parts[3],
      percent: parts[4]
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

/**
 * 检查云函数连通性
 */
async function checkCloudFunction() {
  const axios = require('axios');
  
  try {
    const response = await axios.get(
      'https://backup-clearspring.ap-shanghai.tcb-api.tencentcloudapi.com/api/v1/health',
      { timeout: 3000 }
    );
    
    return {
      healthy: response.status === 200,
      responseTime: response.headers['x-response-time']
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

module.exports = router;
```

---

### 方案 B：应用层心跳检测

#### 1. 监控脚本

```javascript
// backend/scripts/health-monitor.js
const axios = require('axios');
const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  mainNode: 'http://101.96.192.63:3000',
  backupNode: 'https://backup-clearspring.ap-shanghai.tcb-api.tencentcloudapi.com',
  checkInterval: 30000, // 30 秒
  failureThreshold: 3, // 连续失败 3 次判定为故障
  alertWebhook: process.env.FEISHU_WEBHOOK,
  logFile: path.join(__dirname, '../logs/health-monitor.log')
};

let failureCount = 0;
let isFailover = false;

/**
 * 主监控循环
 */
async function startMonitoring() {
  log('启动健康监控...');
  
  setInterval(async () => {
    await checkHealth();
  }, CONFIG.checkInterval);
  
  // 立即执行一次
  await checkHealth();
}

/**
 * 检查主节点健康状态
 */
async function checkHealth() {
  try {
    const response = await axios.get(`${CONFIG.mainNode}/api/v1/health`, {
      timeout: 5000
    });
    
    if (response.data.status === 'healthy') {
      // 主节点健康
      if (failureCount > 0) {
        log(`主节点恢复健康（连续失败次数：${failureCount}）`);
        failureCount = 0;
      }
      
      // 如果已切换，记录恢复状态
      if (isFailover) {
        log('主节点已恢复，可以手动切换回主节点');
        await sendFeishuAlert('✅ 主节点已恢复健康，可以手动切换回主节点');
      }
    } else {
      handleDegraded(response.data);
    }
  } catch (error) {
    failureCount++;
    log(`主节点检查失败（${failureCount}/${CONFIG.failureThreshold}）: ${error.message}`);
    
    if (failureCount >= CONFIG.failureThreshold && !isFailover) {
      await handleFailover();
    }
  }
}

/**
 * 处理降级状态
 */
async function handleDegraded(healthData) {
  log(`主节点降级：${JSON.stringify(healthData)}`);
  
  const issues = [];
  if (!healthData.checks.mysql?.healthy) issues.push('MySQL 连接异常');
  if (!healthData.checks.memory?.healthy) issues.push('内存使用过高');
  if (!healthData.checks.disk?.healthy) issues.push('磁盘空间不足');
  
  if (issues.length > 0) {
    await sendFeishuAlert(`⚠️ 主节点降级\n\n问题：${issues.join(', ')}\n\n详情：${JSON.stringify(healthData)}`);
  }
}

/**
 * 处理故障切换
 */
async function handleFailover() {
  isFailover = true;
  
  log('🚨 检测到主节点故障，开始故障切换流程');
  
  try {
    // 1. 发送飞书告警
    await sendFeishuAlert(
      '🚨 主节点故障告警\n\n' +
      '服务器：101.96.192.63:3000\n' +
      '连续失败次数：' + failureCount + '\n' +
      '切换时间：' + new Date().toISOString() + '\n\n' +
      '备用节点已自动接管服务（只读模式）\n' +
      '请立即检查服务器状态！'
    );
    
    // 2. 自动切换 DNS（需要 DNS API 支持）
    // await switchDNS(CONFIG.backupNode);
    
    // 3. 更新 Nginx 配置（可选，如果 Nginx 没有自动切换）
    // await updateNginxConfig('backup');
    
    log('故障切换完成，备用节点已接管服务');
  } catch (error) {
    log('故障切换失败：' + error.message);
    await sendFeishuAlert('❌ 故障切换失败：' + error.message);
  }
}

/**
 * 发送飞书告警
 */
async function sendFeishuAlert(message) {
  if (!CONFIG.alertWebhook) {
    log('未配置飞书 Webhook，跳过告警');
    return;
  }
  
  try {
    await axios.post(CONFIG.alertWebhook, {
      msg_type: 'text',
      content: {
        text: message
      }
    });
    log('飞书告警发送成功');
  } catch (error) {
    log('飞书告警发送失败：' + error.message);
  }
}

/**
 * 切换 DNS（示例，需要实际 DNS API）
 */
async function switchDNS(backupDomain) {
  // 这里需要接入 DNS 服务商的 API
  // 例如：阿里云 DNS、腾讯云 DNSPod 等
  log(`切换 DNS 到备用节点：${backupDomain}`);
  // 实现 DNS 切换逻辑
}

/**
 * 日志记录
 */
function log(message) {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}\n`;
  
  console.log(logMessage.trim());
  
  // 写入日志文件
  fs.appendFileSync(CONFIG.logFile, logMessage);
}

// 启动监控
startMonitoring().catch(console.error);
```

#### 2. 部署监控脚本

```bash
# 1. 上传脚本
scp scripts/health-monitor.js admin@101.96.192.63:/home/admin/clearspring-v3/backend/scripts/

# 2. 在服务器上安装依赖
ssh admin@101.96.192.63
cd /home/admin/clearspring-v3/backend
npm install axios

# 3. 配置环境变量
cat >> .env << EOF
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
EOF

# 4. 使用 PM2 启动
pm2 start scripts/health-monitor.js --name health-monitor
pm2 save
```

---

## 切换流程

### 自动切换流程

```
1. 监控脚本检测到主节点故障（连续 3 次失败）
   ↓
2. 发送飞书告警（立即）
   ↓
3. Nginx 自动路由到备用节点（30 秒内）
   ↓
4. 备用节点（云函数）接管服务
   ↓
5. 运维人员收到告警，修复主节点
   ↓
6. 主节点恢复后，手动切换回主节点
```

### 手动切换流程

#### 切换到备用节点

```bash
# 1. 登录服务器
ssh admin@101.96.192.63

# 2. 停止主节点服务
cd /home/admin/clearspring-v3
pm2 stop clearspring-api

# 3. 更新 Nginx 配置（强制使用备用节点）
sudo vim /etc/nginx/conf.d/upstream.conf
# 注释掉主节点，只保留备用节点

# 4. 重载 Nginx
sudo nginx -t && sudo nginx -s reload

# 5. 发送告警确认
# 在飞书群中确认切换完成
```

#### 切换回主节点

```bash
# 1. 确认主节点已恢复
curl http://101.96.192.63:3000/api/v1/health

# 2. 恢复 Nginx 配置
sudo vim /etc/nginx/conf.d/upstream.conf
# 取消主节点注释

# 3. 重载 Nginx
sudo nginx -t && sudo nginx -s reload

# 4. 启动主节点服务
cd /home/admin/clearspring-v3
pm2 start clearspring-api

# 5. 发送恢复通知
# 在飞书群中确认服务恢复
```

---

## 备用节点部署

### 微信云函数部署清单

#### 1. 部署只读 API 接口

```javascript
// cloudfunctions/backup-api/index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

/**
 * 备用节点 API（只读）
 * 仅支持查询接口，不支持写入
 */
exports.main = async (event, context) => {
  const { action, data } = event;
  
  // 只读接口白名单
  const readOnlyActions = [
    'getOrderList',
    'getOrderDetail',
    'getProtectRecord',
    'getUserInfo',
    'getSpeciesList',
    'getZenContent'
  ];
  
  if (!readOnlyActions.includes(action)) {
    return {
      success: false,
      message: '故障期间仅支持查询操作',
      code: 'READ_ONLY_MODE'
    };
  }
  
  try {
    switch (action) {
      case 'getOrderList':
        return await getOrderList(data);
      case 'getOrderDetail':
        return await getOrderDetail(data);
      case 'getProtectRecord':
        return await getProtectRecord(data);
      case 'getUserInfo':
        return await getUserInfo(data);
      default:
        return { success: false, message: '未知操作' };
    }
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
};

/**
 * 获取订单列表
 */
async function getOrderList(data) {
  const { userId, page = 1, pageSize = 10 } = data;
  
  const result = await db.collection('entrust_order')
    .where({ user_id: userId })
    .orderBy('created_at', 'desc')
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .get();
  
  return {
    success: true,
    data: result.data,
    total: result.data.length
  };
}

/**
 * 获取订单详情
 */
async function getOrderDetail(data) {
  const { orderId } = data;
  
  const result = await db.collection('entrust_order')
    .doc(orderId)
    .get();
  
  return {
    success: true,
    data: result.data
  };
}

/**
 * 获取护生记录
 */
async function getProtectRecord(data) {
  const { userId, date } = data;
  
  const query = { user_id: userId };
  if (date) {
    query.time = date;
  }
  
  const result = await db.collection('protect_life_record')
    .where(query)
    .orderBy('time', 'desc')
    .get();
  
  return {
    success: true,
    data: result.data
  };
}

/**
 * 获取用户信息
 */
async function getUserInfo(data) {
  const { userId } = data;
  
  const result = await db.collection('user_info')
    .doc(userId)
    .get();
  
  return {
    success: true,
    data: result.data
  };
}
```

#### 2. 配置 HTTP 触发器

```json
// cloudfunctions/backup-api/config.json
{
  "permissions": {
    "openapi": []
  },
  "triggers": [
    {
      "name": "httpTrigger",
      "type": "http",
      "config": {
        "auth": false
      }
    }
  ]
}
```

#### 3. 部署云函数

```bash
# 1. 上传云函数
cd cloudfunctions/backup-api
npm install
cloud-functions deploy backup-api

# 2. 配置 HTTP 触发器
cloud-functions trigger-config backup-api --config config.json

# 3. 获取触发器 URL
cloud-functions trigger-url backup-api
# 输出：https://backup-clearspring.ap-shanghai.tcb-api.tencentcloudapi.com
```

#### 4. 配置 CDN 静态资源

```javascript
// 小程序端配置
// app.js
const API_CONFIG = {
  // 正常情况
  normal: {
    baseUrl: 'https://api.clearspring.org'
  },
  // 故障期间
  backup: {
    baseUrl: 'https://backup-clearspring.ap-shanghai.tcb-api.tencentcloudapi.com'
  }
};

// 自动检测并切换
async function getApiBaseUrl() {
  try {
    // 尝试访问主节点
    await wx.request({
      url: `${API_CONFIG.normal.baseUrl}/api/v1/health`,
      timeout: 5000
    });
    return API_CONFIG.normal.baseUrl;
  } catch (error) {
    // 主节点不可用，切换到备用节点
    wx.showToast({
      title: '系统维护中',
      icon: 'none'
    });
    return API_CONFIG.backup.baseUrl;
  }
}
```

---

## 降级策略

### 故障期间服务降级

| 功能模块 | 降级策略 | 用户提示 |
|---------|---------|---------|
| 查看订单 | ✅ 正常（只读） | - |
| 查看护生记录 | ✅ 正常（只读） | - |
| 查看证书 | ✅ 正常（只读） | - |
| 下单购买 | ❌ 暂停 | "系统维护中，请稍后再试" |
| 护生登记 | ❌ 暂停 | "系统维护中，请稍后再试" |
| 图片上传 | ❌ 暂停 | "系统维护中，请稍后再试" |
| 梵音播放 | ✅ 正常（本地缓存） | - |
| 禅理阅读 | ✅ 正常（本地缓存） | - |

### 小程序端降级处理

```javascript
// utils/api.js
const API_BASE_URL = 'https://api.clearspring.org';
const BACKUP_BASE_URL = 'https://backup-clearspring.ap-shanghai.tcb-api.tencentcloudapi.com';

let useBackup = false;

/**
 * 封装请求，自动降级
 */
function request(options) {
  const baseUrl = useBackup ? BACKUP_BASE_URL : API_BASE_URL;
  
  return new Promise((resolve, reject) => {
    wx.request({
      ...options,
      url: baseUrl + options.url,
      fail: async (error) => {
        // 主节点失败，尝试切换到备用节点
        if (!useBackup) {
          console.log('主节点失败，切换到备用节点');
          useBackup = true;
          
          // 重试一次
          try {
            const result = await request(options);
            resolve(result);
          } catch (retryError) {
            reject(retryError);
          }
        } else {
          // 备用节点也失败
          wx.showToast({
            title: '网络连接失败',
            icon: 'none'
          });
          reject(error);
        }
      }
    });
  });
}

/**
 * 写操作（故障期间禁止）
 */
function postWrite(options) {
  if (useBackup) {
    wx.showToast({
      title: '系统维护中',
      icon: 'none'
    });
    return Promise.reject(new Error('READ_ONLY_MODE'));
  }
  
  return request({
    ...options,
    method: 'POST'
  });
}

module.exports = {
  request,
  postWrite
};
```

---

## 恢复流程

### 主节点恢复检查清单

- [ ] 服务器可以正常 SSH 登录
- [ ] Node.js 进程正常运行（`pm2 status`）
- [ ] MySQL 数据库可以连接
- [ ] 健康检查接口返回 healthy
- [ ] 日志无异常报错

### 恢复步骤

```bash
# 1. 检查服务器状态
ssh admin@101.96.192.63

# 2. 检查 PM2 状态
pm2 status

# 3. 检查 MySQL 连接
mysql -h 127.0.0.1 -u clearspring_user -p -e "SELECT 1"

# 4. 检查健康接口
curl http://localhost:3000/api/v1/health

# 5. 查看日志
pm2 logs clearspring-api --lines 50

# 6. 如果一切正常，恢复 Nginx 配置
sudo vim /etc/nginx/conf.d/upstream.conf
# 取消主节点注释

# 7. 重载 Nginx
sudo nginx -t && sudo nginx -s reload

# 8. 发送恢复通知
# 在飞书群中确认服务完全恢复
```

---

## 演练计划

### 定期演练

**频率**：每季度一次  
**时间**：选择业务低峰期（凌晨 2-4 点）

### 演练步骤

1. **准备阶段**（演练前 1 天）
   - [ ] 通知相关人员
   - [ ] 备份当前数据
   - [ ] 确认备用节点可用

2. **执行阶段**（演练当天）
   - [ ] 手动停止主节点服务
   - [ ] 验证备用节点自动接管
   - [ ] 测试只读接口功能
   - [ ] 验证告警通知正常

3. **恢复阶段**（演练结束后）
   - [ ] 启动主节点服务
   - [ ] 验证服务恢复正常
   - [ ] 检查数据一致性

4. **总结阶段**（演练后 1 天内）
   - [ ] 编写演练报告
   - [ ] 记录问题和改进点
   - [ ] 更新故障切换文档

### 演练报告模板

```markdown
# 故障切换演练报告

**演练时间**: 2026-04-16 02:00-04:00  
**参与人员**: XXX, XXX  
**演练场景**: 主节点宕机，备用节点接管

## 演练结果

- [x] 主节点停止后，备用节点在 30 秒内接管
- [x] 只读接口功能正常
- [x] 飞书告警正常发送
- [x] 主节点恢复后，服务正常切换回

## 问题与改进

1. 问题：XXX
   改进：XXX

## 结论

故障切换方案有效，可以应对生产环境故障。
```

---

*文档创建时间*: 2026-04-16 11:56 UTC  
*最后更新*: 2026-04-16 11:56 UTC
