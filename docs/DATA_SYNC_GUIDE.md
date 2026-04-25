# 数据同步实现指南

**文档版本**: V1.0  
**创建时间**: 2026-04-16  
**关联问题**: P0-TS-01: 数据同步机制不明确

---

## 📋 目录

1. [架构设计](#架构设计)
2. [同步策略](#同步策略)
3. [实现方案](#实现方案)
4. [数据一致性保障](#数据一致性保障)
5. [配置与部署](#配置与部署)
6. [故障排查](#故障排查)

---

## 架构设计

### 数据流向

```
小程序端 → 微信云数据库（实时读写）
           ↓
      云函数（数据同步）
           ↓
    火山云 MySQL（主数据库）
```

### 组件说明

| 组件 | 位置 | 职责 |
|------|------|------|
| 微信云数据库 | 微信云开发 | 小程序端实时读写，免鉴权访问 |
| 同步云函数 | 微信云开发 | 监听云数据库变更，同步到 MySQL |
| MySQL | 火山云服务器 | 主数据库，复杂查询、事务处理 |
| 定时同步任务 | 火山云服务器 | 兜底全量比对，防止数据丢失 |

---

## 同步策略

### 推荐方案：实时同步 + 定时兜底

**正常流程**：云函数实时同步（毫秒级延迟）  
**兜底流程**：定时任务每 30 分钟全量比对一次  
**告警机制**：同步失败超过 10 次，发送飞书告警

---

## 实现方案

### 方案 A：云函数实时同步（推荐）

#### 1. 云函数代码

```javascript
// cloudfunctions/sync-to-mysql/index.js
const mysql = require('mysql2/promise');
const cloud = require('wx-server-sdk');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

// 重试配置
const MAX_RETRY = 3;
const RETRY_DELAY = 1000; // 1 秒

/**
 * 云函数入口
 * 触发条件：云数据库数据变更（通过云开发触发器）
 */
exports.main = async (event, context) => {
  const { data, table, operation } = event;
  
  try {
    // 1. 连接 MySQL
    const connection = await getMySQLConnection();
    
    try {
      // 2. 根据表名路由到对应同步逻辑
      switch (table) {
        case 'protect_life_record':
          await syncProtectLifeRecord(connection, data, operation);
          break;
        case 'entrust_order':
          await syncOrder(connection, data, operation);
          break;
        case 'user_info':
          await syncUserInfo(connection, data, operation);
          break;
        // ... 其他表
        default:
          console.warn(`未知表名：${table}`);
      }
      
      // 3. 记录同步日志（成功）
      await logSync(connection, event, 'success');
      
      return {
        success: true,
        message: '同步成功'
      };
    } finally {
      await connection.end();
    }
  } catch (error) {
    console.error('同步失败:', error);
    
    // 记录同步日志（失败）
    try {
      await logSync(null, event, 'failed', error.message);
    } catch (logError) {
      console.error('记录日志失败:', logError);
    }
    
    // 重试机制
    if (event.retryCount < MAX_RETRY) {
      // 延迟重试
      await sleep(RETRY_DELAY * (event.retryCount + 1));
      
      // 重新调用自己（带重试计数）
      return await exports.main({
        ...event,
        retryCount: (event.retryCount || 0) + 1
      }, context);
    }
    
    // 超过重试次数，进入死信队列
    await addToDeadLetterQueue(event, error.message);
    
    return {
      success: false,
      message: `同步失败：${error.message}`,
      retryCount: event.retryCount
    };
  }
};

/**
 * 获取 MySQL 连接
 */
async function getMySQLConnection() {
  return await mysql.connect({
    host: process.env.MYSQL_HOST || '101.96.192.63',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clearspring',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
}

/**
 * 同步护生记录
 */
async function syncProtectLifeRecord(connection, data, operation) {
  const { id, user_id, species_id, amount, time, created_at, updated_at } = data;
  
  if (operation === 'INSERT' || operation === 'UPDATE') {
    await connection.execute(`
      INSERT INTO protect_life_record 
      (id, user_id, species_id, amount, time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        species_id = VALUES(species_id),
        amount = VALUES(amount),
        time = VALUES(time),
        updated_at = VALUES(updated_at)
    `, [id, user_id, species_id, amount, time, created_at, updated_at]);
  } else if (operation === 'DELETE') {
    await connection.execute(
      'DELETE FROM protect_life_record WHERE id = ?',
      [id]
    );
  }
}

/**
 * 同步订单
 */
async function syncOrder(connection, data, operation) {
  const { id, user_id, order_no, amount, status, paid_at, created_at, updated_at } = data;
  
  if (operation === 'INSERT' || operation === 'UPDATE') {
    await connection.execute(`
      INSERT INTO entrust_order 
      (id, user_id, order_no, amount, status, paid_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        user_id = VALUES(user_id),
        amount = VALUES(amount),
        status = VALUES(status),
        paid_at = VALUES(paid_at),
        updated_at = VALUES(updated_at)
    `, [id, user_id, order_no, amount, status, paid_at, created_at, updated_at]);
  } else if (operation === 'DELETE') {
    await connection.execute(
      'DELETE FROM entrust_order WHERE id = ?',
      [id]
    );
  }
}

/**
 * 同步用户信息
 */
async function syncUserInfo(connection, data, operation) {
  const { id, openid, nickname, avatar, phone, created_at, updated_at } = data;
  
  if (operation === 'INSERT' || operation === 'UPDATE') {
    await connection.execute(`
      INSERT INTO user_info 
      (id, openid, nickname, avatar, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        nickname = VALUES(nickname),
        avatar = VALUES(avatar),
        phone = VALUES(phone),
        updated_at = VALUES(updated_at)
    `, [id, openid, nickname, avatar, phone, created_at, updated_at]);
  } else if (operation === 'DELETE') {
    await connection.execute(
      'DELETE FROM user_info WHERE id = ?',
      [id]
    );
  }
}

/**
 * 记录同步日志
 */
async function logSync(connection, event, status, errorMessage = null) {
  const logData = {
    table: event.table,
    record_id: event.data?.id,
    operation: event.operation,
    status: status,
    error_message: errorMessage,
    retry_count: event.retryCount || 0,
    created_at: new Date().toISOString()
  };
  
  if (connection) {
    // 记录到 MySQL 日志表
    await connection.execute(`
      INSERT INTO sync_log 
      (table_name, record_id, operation, status, error_message, retry_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      logData.table,
      logData.record_id,
      logData.operation,
      logData.status,
      logData.error_message,
      logData.retry_count,
      logData.created_at
    ]);
  } else {
    // 连接失败时，记录到云数据库
    const db = cloud.database();
    await db.collection('sync_log').add({
      data: logData
    });
  }
}

/**
 * 添加到死信队列
 */
async function addToDeadLetterQueue(event, errorMessage) {
  const db = cloud.database();
  await db.collection('dead_letter_queue').add({
    data: {
      event: event,
      error: errorMessage,
      failed_at: new Date().toISOString(),
      status: 'pending'
    }
  });
  
  // 发送飞书告警
  await sendFeishuAlert(`数据同步失败（死信队列）\n表：${event.table}\n错误：${errorMessage}`);
}

/**
 * 发送飞书告警
 */
async function sendFeishuAlert(message) {
  const axios = require('axios');
  const webhook = process.env.FEISHU_WEBHOOK;
  
  if (!webhook) {
    console.warn('未配置飞书 Webhook');
    return;
  }
  
  try {
    await axios.post(webhook, {
      msg_type: 'text',
      content: {
        text: `🚨 数据同步告警\n\n${message}\n\n时间：${new Date().toISOString()}`
      }
    });
  } catch (error) {
    console.error('发送飞书告警失败:', error);
  }
}

/**
 * 延迟函数
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
```

#### 2. 云函数配置

```json
// cloudfunctions/sync-to-mysql/config.json
{
  "permissions": {
    "openapi": []
  },
  "triggers": [
    {
      "name": "syncTrigger",
      "type": "dbchange",
      "config": {
        "collection": "protect_life_record,entrust_order,user_info",
        "operation": "INSERT,UPDATE,DELETE"
      }
    }
  ]
}
```

#### 3. 环境变量配置

```bash
# .env 文件（云函数环境变量）
MYSQL_HOST=101.96.192.63
MYSQL_USER=clearspring_user
MYSQL_PASSWORD=your_password_here
MYSQL_DATABASE=clearspring
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
```

---

### 方案 B：定时任务批量同步（兜底）

#### 1. 定时任务代码

```javascript
// backend/scripts/sync-batch.js
const mysql = require('mysql2/promise');
const axios = require('axios');
const cron = require('node-cron');

// 配置
const CONFIG = {
  mysql: {
    host: process.env.MYSQL_HOST || '101.96.192.63',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: 'clearspring'
  },
  cloudDB: {
    env: 'cloud1-7ga68ls3',
    collections: ['protect_life_record', 'entrust_order', 'user_info']
  },
  syncInterval: '*/30 * * * *', // 每 30 分钟执行一次
  batchSize: 500 // 每次同步最大记录数
};

let lastSyncTime = new Date(Date.now() - 30 * 60 * 1000); // 默认从 30 分钟前开始

/**
 * 主同步任务
 */
async function runSync() {
  console.log(`[${new Date().toISOString()}] 开始定时同步任务`);
  
  const currentTime = new Date();
  
  try {
    // 1. 连接 MySQL
    const mysqlConn = await mysql.createConnection(CONFIG.mysql);
    
    try {
      // 2. 遍历所有集合同步
      for (const collection of CONFIG.cloudDB.collections) {
        console.log(`同步集合：${collection}`);
        await syncCollection(mysqlConn, collection, lastSyncTime);
      }
      
      // 3. 更新最后同步时间
      lastSyncTime = currentTime;
      console.log(`[${new Date().toISOString()}] 同步完成`);
    } finally {
      await mysqlConn.end();
    }
  } catch (error) {
    console.error('同步失败:', error);
    await sendFeishuAlert(`定时同步失败：${error.message}`);
  }
}

/**
 * 同步单个集合
 */
async function syncCollection(mysqlConn, collection, sinceTime) {
  // 1. 从云数据库查询变更数据
  const cloudDBUrl = `https://${CONFIG.cloudDB.env}.api.lcloudbase.com/api/v1/query`;
  
  const response = await axios.post(cloudDBUrl, {
    collection: collection,
    query: {
      updated_at: {
        $gt: sinceTime.toISOString()
      }
    },
    limit: CONFIG.batchSize
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.CLOUDBASE_TOKEN}`
    }
  });
  
  const changedData = response.data.data;
  
  if (changedData.length === 0) {
    console.log(`  无变更数据`);
    return;
  }
  
  console.log(`  发现 ${changedData.length} 条变更`);
  
  // 2. 批量写入 MySQL
  for (const record of changedData) {
    await upsertRecord(mysqlConn, collection, record);
  }
  
  console.log(`  同步完成`);
}

/**
 * UPSERT 记录到 MySQL
 */
async function upsertRecord(mysqlConn, table, record) {
  // 根据表名生成 SQL
  const sqlMap = {
    'protect_life_record': `
      INSERT INTO protect_life_record 
      (id, user_id, species_id, amount, time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at)
    `,
    'entrust_order': `
      INSERT INTO entrust_order 
      (id, user_id, order_no, amount, status, paid_at, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at)
    `,
    'user_info': `
      INSERT INTO user_info 
      (id, openid, nickname, avatar, phone, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE updated_at = VALUES(updated_at)
    `
  };
  
  const sql = sqlMap[table];
  if (!sql) {
    console.warn(`未知表：${table}`);
    return;
  }
  
  // 提取字段值（根据实际结构调整）
  const values = extractValues(table, record);
  
  await mysqlConn.execute(sql, values);
}

/**
 * 提取字段值
 */
function extractValues(table, record) {
  // 根据表结构提取字段
  // 这里需要根据实际字段顺序调整
  switch (table) {
    case 'protect_life_record':
      return [
        record._id,
        record.user_id,
        record.species_id,
        record.amount,
        record.time,
        record.created_at,
        record.updated_at
      ];
    case 'entrust_order':
      return [
        record._id,
        record.user_id,
        record.order_no,
        record.amount,
        record.status,
        record.paid_at,
        record.created_at,
        record.updated_at
      ];
    case 'user_info':
      return [
        record._id,
        record.openid,
        record.nickname,
        record.avatar,
        record.phone,
        record.created_at,
        record.updated_at
      ];
    default:
      return [];
  }
}

/**
 * 发送飞书告警
 */
async function sendFeishuAlert(message) {
  const webhook = process.env.FEISHU_WEBHOOK;
  if (!webhook) return;
  
  try {
    await axios.post(webhook, {
      msg_type: 'text',
      content: {
        text: `🚨 定时同步告警\n\n${message}\n\n时间：${new Date().toISOString()}`
      }
    });
  } catch (error) {
    console.error('发送告警失败:', error);
  }
}

// 启动定时任务
cron.schedule(CONFIG.syncInterval, runSync, {
  timezone: 'Asia/Shanghai'
});

console.log(`定时同步任务已启动，间隔：${CONFIG.syncInterval}`);

// 立即执行一次
runSync();
```

#### 2. 部署到服务器

```bash
# 1. 安装依赖
cd /home/admin/clearspring-v3/backend
npm install node-cron axios mysql2

# 2. 配置环境变量
cat >> .env << EOF
MYSQL_HOST=101.96.192.63
MYSQL_USER=clearspring_user
MYSQL_PASSWORD=your_password
CLOUDBASE_TOKEN=your_cloudbase_token
FEISHU_WEBHOOK=https://open.feishu.cn/open-apis/bot/v2/hook/xxx
EOF

# 3. 使用 PM2 管理
pm2 start scripts/sync-batch.js --name sync-batch
pm2 save
```

---

## 数据一致性保障

### 1. 唯一索引防重

在 MySQL 端设置唯一索引，防止重复插入：

```sql
-- 护生记录表
ALTER TABLE protect_life_record 
ADD UNIQUE INDEX idx_id (id);

-- 订单表
ALTER TABLE entrust_order 
ADD UNIQUE INDEX idx_id (id);

-- 用户信息表
ALTER TABLE user_info 
ADD UNIQUE INDEX idx_id (id);
```

### 2. 乐观锁

使用 `updated_at` 字段检测冲突：

```sql
UPDATE protect_life_record 
SET amount = ?, updated_at = ?
WHERE id = ? AND updated_at < ?;
```

### 3. 重试机制

- 自动重试：最多 3 次，每次延迟递增（1s, 2s, 3s）
- 重试失败：进入死信队列，人工处理

### 4. 死信队列

```javascript
// 死信队列集合：dead_letter_queue
{
  _id: "xxx",
  event: { /* 原始事件 */ },
  error: "错误信息",
  failed_at: "2026-04-16T12:00:00Z",
  status: "pending", // pending, processing, resolved
  resolved_at: null,
  resolved_by: null
}
```

### 5. 数据一致性校验

```sql
-- 校验脚本：每天凌晨执行
SELECT 
  'protect_life_record' as table_name,
  (SELECT COUNT(*) FROM protect_life_record) as mysql_count,
  (SELECT COUNT(*) FROM cloud_protect_life_record) as cloud_count,
  (SELECT COUNT(*) FROM protect_life_record) - 
  (SELECT COUNT(*) FROM cloud_protect_life_record) as diff;
```

---

## 配置与部署

### 云函数部署

```bash
# 1. 上传云函数
cd cloudfunctions/sync-to-mysql
npm install
cloud-functions deploy sync-to-mysql

# 2. 配置触发器
cloud-functions trigger-config sync-to-mysql --config config.json

# 3. 设置环境变量
cloud-functions env set sync-to-mysql MYSQL_HOST=101.96.192.63
cloud-functions env set sync-to-mysql MYSQL_USER=clearspring_user
cloud-functions env set sync-to-mysql MYSQL_PASSWORD=xxx
cloud-functions env set sync-to-mysql FEISHU_WEBHOOK=https://xxx
```

### 定时任务部署

```bash
# 1. 上传脚本到服务器
scp scripts/sync-batch.js admin@101.96.192.63:/home/admin/clearspring-v3/backend/scripts/

# 2. 在服务器上安装依赖
ssh admin@101.96.192.63
cd /home/admin/clearspring-v3/backend
npm install node-cron axios mysql2

# 3. 使用 PM2 启动
pm2 start scripts/sync-batch.js --name sync-batch
pm2 save
```

---

## 故障排查

### 常见问题

#### 1. 同步失败率高

**排查步骤**：
1. 检查 MySQL 连接是否正常
2. 检查云函数日志：`cloud-functions logs sync-to-mysql`
3. 检查网络连通性：云函数到 MySQL 的网络

**解决方案**：
- 增加重试次数
- 优化 MySQL 连接池配置
- 检查防火墙规则

#### 2. 数据不一致

**排查步骤**：
1. 运行数据一致性校验脚本
2. 检查死信队列是否有未处理记录
3. 检查同步日志表

**解决方案**：
- 手动执行一次全量同步
- 修复死信队列中的记录
- 检查唯一索引是否冲突

#### 3. 同步延迟高

**排查步骤**：
1. 检查云函数执行时间
2. 检查 MySQL 写入性能
3. 检查网络延迟

**解决方案**：
- 优化 SQL 语句，增加索引
- 批量写入改为并发写入
- 考虑增加云函数并发数

---

## 监控指标

| 指标 | 阈值 | 告警级别 |
|------|------|---------|
| 同步失败率 | > 5% | P1 |
| 同步延迟 | > 10 秒 | P2 |
| 死信队列积压 | > 100 条 | P1 |
| MySQL 连接失败 | > 3 次/分钟 | P0 |

---

*文档创建时间*: 2026-04-16 11:56 UTC  
*最后更新*: 2026-04-16 11:56 UTC
