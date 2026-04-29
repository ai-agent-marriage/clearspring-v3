# P0 问题清单（必须修复）

**文档版本**: V1.0  
**创建日期**: 2026-04-16 21:42 UTC  
**优先级**: P0（阻塞性问题，开发前必须修复）  
**状态**: 待修复  

---

## 📋 问题总览

| 模块 | P0 问题数量 | 预计修复工时 | 负责人 |
|--------|-----------|------------|--------|
| 小程序端 | 3 | 2 小时 | 小程序开发-Agent |
| 后端 API | 4 | 3 小时 | 后端 API 开发-Agent |
| 数据库设计 | 2 | 1 小时 | 数据库设计-Agent |
| **合计** | **9** | **6 小时** | - |

---

## 📱 一、小程序端 P0 问题

### P0-MINI-01: 缺少错误处理

**问题描述**: `audio-player.js` 的 `recordEffectiveListen()` 方法中，`wx.request` 没有 `fail` 回调，网络错误时用户无感知

**位置**: `clearspring-v3/miniprogram/pages/van-audio/audio-player/audio-player.js:167-175`

**影响范围**: 
- 用户收听记录无法同步到后端
- 收听统计数据不准确
- 用户体验差（失败无提示）

**当前代码**:
```javascript
wx.request({
  url: `${app.globalData.apiBaseUrl}/audio/record`,
  method: 'POST',
  data: {
    audio_id: this.data.audioId,
    duration: this.data.totalTime,
    is_valid: this.data.totalTime > 0
  }
});
```

**修复方案**:
```javascript
wx.request({
  url: `${app.globalData.apiBaseUrl}/audio/record`,
  method: 'POST',
  data: {
    audio_id: this.data.audioId,
    duration: this.data.totalTime,
    is_valid: this.data.totalTime > 0
  },
  success: (res) => {
    if (res.statusCode === 200 && res.data.code === 200) {
      console.log('记录成功');
    } else {
      wx.showToast({
        title: '记录失败',
        icon: 'none'
      });
    }
  },
  fail: (err) => {
    console.error('记录失败', err);
    wx.showToast({
      title: '网络异常，请重试',
      icon: 'none'
    });
  }
});
```

**验收标准**:
- [ ] 添加 success 回调处理业务错误
- [ ] 添加 fail 回调处理网络错误
- [ ] 用户友好的错误提示
- [ ] 测试网络异常情况

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

### P0-MINI-02: 硬编码 API 地址

**问题描述**: `app.js` 的 `globalData.apiBaseUrl` 使用硬编码的 `http://localhost:3000/api/v1`，未使用环境变量或配置文件

**位置**: `clearspring-v3/miniprogram/app.js:16`

**影响范围**: 
- 生产环境无法切换 API 地址
- 存在安全风险（HTTP 明文传输）
- 部署困难

**当前代码**:
```javascript
globalData: {
  apiBaseUrl: 'http://localhost:3000/api/v1',
  // ...
}
```

**修复方案**:
```javascript
// 方案 1: 创建 config.js
// config/config.js
const config = {
  apiBaseUrl: process.env.NODE_ENV === 'production'
    ? 'https://api.qingru.com/api/v1'
    : 'http://localhost:3000/api/v1'
};

module.exports = config;

// app.js
const config = require('./config/config');

App({
  globalData: {
    apiBaseUrl: config.apiBaseUrl,
    // ...
  }
});

// 方案 2: 使用小程序云开发环境变量
// project.config.json
{
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": true  // 强制 HTTPS
  }
}
```

**验收标准**:
- [ ] 创建配置文件区分开发/生产环境
- [ ] 生产环境使用 HTTPS
- [ ] 敏感配置不提交到代码库
- [ ] 测试环境切换正常

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

### P0-MINI-03: 缺少页面配置文件

**问题描述**: `van-audio/audio-player/` 目录缺少 `audio-player.json` 配置文件

**位置**: `clearspring-v3/miniprogram/pages/van-audio/audio-player/`

**影响范围**: 
- 页面无法正确加载
- 导航栏标题缺失
- 可能无法使用某些页面特性

**当前状态**: 目录中只有 `.js`, `.wxml`, `.wxss` 文件，缺少 `.json` 文件

**修复方案**:
```json
// audio-player.json
{
  "usingComponents": {},
  "navigationBarTitleText": "梵音播放",
  "navigationBarBackgroundColor": "#4A5D4E",
  "navigationBarTextStyle": "white",
  "enablePullDownRefresh": false,
  "backgroundTextStyle": "dark"
}
```

**验收标准**:
- [ ] 创建页面配置文件
- [ ] 配置导航栏标题
- [ ] 配置导航栏样式（使用 Stitch 设计系统颜色）
- [ ] 测试页面正常加载

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

## 🔌 二、后端 API P0 问题

### P0-API-01: 缺少 JWT 认证

**问题描述**: `audio.js` 的所有路由未使用 `auth.js` 中间件验证 Token，任何用户都可以调用接口

**位置**: `clearspring-v3/api/src/routes/audio.js`

**影响范围**: 
- 未登录用户可以提交收听记录
- 数据可能被恶意篡改
- 无法追踪用户行为

**当前代码**:
```javascript
// 所有路由都没有认证中间件
router.get('/list', async (req, res) => { ... });
router.post('/record', async (req, res) => { ... });
```

**修复方案**:
```javascript
const { verifyToken } = require('../middleware/auth');

// 公开接口（不需要认证）
router.get('/list', async (req, res) => { ... });
router.get('/:id', async (req, res) => { ... });

// 需要认证的接口
router.post('/record', verifyToken, async (req, res) => {
  // 可以直接使用 req.userId
  const userId = req.userId;
  const { audio_id, duration, is_valid } = req.body;
  
  // 插入收听记录时关联用户
  await db.pool.query(
    'INSERT INTO audio_record (user_id, audio_id, duration, is_valid, ...)',
    [userId, audio_id, duration, is_valid ? 1 : 0, ...]
  );
});

router.get('/stats', verifyToken, async (req, res) => {
  // 使用 req.userId 查询当前用户统计
  const userId = req.userId;
  // ...
});
```

**验收标准**:
- [ ] 写操作接口添加 `verifyToken` 中间件
- [ ] 读操作接口根据需要添加认证
- [ ] 测试未认证请求被拒绝（返回 401）
- [ ] 测试已认证请求正常通过

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

### P0-API-02: 缺少请求参数验证

**问题描述**: `/record` 接口未验证 `duration` 的有效性（应为正数），可能导致无效数据

**位置**: `clearspring-v3/api/src/routes/audio.js:67-77`

**影响范围**: 
- 数据库可能存储无效数据
- 统计数据不准确
- 可能被恶意利用

**当前代码**:
```javascript
router.post('/record', async (req, res) => {
  try {
    const { audio_id, duration, is_valid } = req.body;
    
    if (!audio_id || !duration) {
      return res.status(400).json({
        code: 400,
        message: '参数错误',
        data: null
      });
    }
    // ...
  }
});
```

**修复方案**:
```javascript
router.post('/record', verifyToken, async (req, res) => {
  try {
    const { audio_id, duration, start_time, end_time } = req.body;
    
    // 完整参数验证
    if (!audio_id) {
      return res.status(400).json({
        code: 400,
        message: '音频 ID 不能为空',
        data: null
      });
    }
    
    if (!duration || duration <= 0 || duration > 7200) {
      return res.status(400).json({
        code: 400,
        message: '收听时长必须在 1-7200 秒之间',
        data: null
      });
    }
    
    if (typeof audio_id !== 'number') {
      return res.status(400).json({
        code: 400,
        message: '音频 ID 必须为数字',
        data: null
      });
    }
    
    // 验证音频是否存在
    const [audioRows] = await db.pool.query(
      'SELECT id FROM audio WHERE id = ? AND deleted_at IS NULL',
      [audio_id]
    );
    
    if (audioRows.length === 0) {
      return res.status(404).json({
        code: 2001,
        message: '音频不存在',
        data: null
      });
    }
    
    // ... 继续处理
  } catch (error) {
    res.status(500).json({
      code: 500,
      message: error.message,
      data: null
    });
  }
});
```

**验收标准**:
- [ ] 验证所有必填参数
- [ ] 验证参数类型和范围
- [ ] 验证关联数据存在性
- [ ] 返回明确的错误信息
- [ ] 使用业务错误码（如 2001）

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

### P0-API-03: 缺少限流保护

**问题描述**: 所有接口未实现请求限流，易被恶意调用导致服务不可用

**位置**: `clearspring-v3/api/src/app.js`（全局中间件缺失）

**影响范围**: 
- DDoS 攻击风险
- 服务器资源耗尽
- 正常用户无法访问

**当前状态**: 未使用任何限流中间件

**修复方案**:
```javascript
// 安装依赖：npm install express-rate-limit
const rateLimit = require('express-rate-limit');

// 全局限流
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 分钟
  max: 100, // 每个 IP 最多 100 次请求
  message: {
    code: 429,
    message: '请求过于频繁，请稍后再试',
    data: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// 严格限流（针对写操作）
const strictLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30, // 每分钟最多 30 次
  message: {
    code: 429,
    message: '操作过于频繁，请稍后再试',
    data: null
  }
});

app.use('/api/v1/', globalLimiter);

// 针对特定接口使用严格限流
app.use('/api/v1/audio/record', strictLimiter);
app.use('/api/v1/order/create', strictLimiter);
```

**验收标准**:
- [ ] 安装并配置 `express-rate-limit`
- [ ] 全局接口添加限流保护
- [ ] 写操作接口使用更严格的限流
- [ ] 测试限流生效（超过限制返回 429）
- [ ] 限流提示信息友好

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

### P0-API-04: JWT 密钥硬编码

**问题描述**: `auth.js` 使用硬编码的默认密钥 `'default-secret'`，生产环境存在严重安全风险

**位置**: `clearspring-v3/api/src/middleware/auth.js:19`

**影响范围**: 
- Token 可能被伪造
- 用户身份可能被冒用
- 数据泄露风险

**当前代码**:
```javascript
const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET || 'default-secret'  // ❌ 危险！
);
```

**修复方案**:
```javascript
// 方案 1: 强制使用环境变量
const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error('生产环境必须配置 JWT_SECRET 环境变量');
}

const decoded = jwt.verify(token, secret);

// 方案 2: 使用密钥管理系统（推荐）
const crypto = require('crypto');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    // 开发环境可以使用默认值
    if (process.env.NODE_ENV === 'development') {
      return 'dev-secret-key-change-in-production';
    }
    
    // 生产环境必须抛出错误
    throw new Error('JWT_SECRET 环境变量未配置');
  }
  
  // 验证密钥强度（至少 32 字符）
  if (secret.length < 32) {
    throw new Error('JWT_SECRET 长度必须至少 32 字符');
  }
  
  return secret;
}

const decoded = jwt.verify(token, getJwtSecret());
```

**环境变量配置**:
```bash
# .env（不提交到代码库）
JWT_SECRET=your-super-secret-key-at-least-32-characters-long-random-string
NODE_ENV=production

# .env.example（提交到代码库作为模板）
JWT_SECRET=change-this-to-a-random-string-at-least-32-characters
NODE_ENV=development
```

**验收标准**:
- [ ] 移除硬编码的默认密钥
- [ ] 强制使用环境变量
- [ ] 生产环境未配置时抛出错误
- [ ] 添加密钥强度验证
- [ ] `.env` 文件不提交到代码库

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

## 🗄️ 三、数据库设计 P0 问题

### P0-DB-01: 缺少 audio_record 表

**问题描述**: PRD 要求统计有效收听次数、生成里程碑证书，但数据库设计缺少 `audio_record` 表

**位置**: `SCHEMA.sql`

**影响范围**: 
- 无法记录用户收听行为
- 无法统计收听次数
- 无法生成里程碑证书
- 梵音板块功能无法实现

**当前状态**: `SCHEMA.sql` 中无此表定义

**修复方案**:
```sql
-- 音频收听记录表
CREATE TABLE `audio_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `audio_id` BIGINT NOT NULL COMMENT '音频 ID',
  `duration` INT NOT NULL COMMENT '收听时长（秒）',
  `is_valid` TINYINT DEFAULT 0 COMMENT '是否有效收听（1: 是，0: 否。收听进度≥80% 为有效）',
  `start_time` DATETIME DEFAULT NULL COMMENT '开始播放时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '结束播放时间',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_audio_id` (`audio_id`),
  INDEX `idx_user_audio` (`user_id`, `audio_id`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_audio_record_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
  CONSTRAINT `fk_audio_record_audio` FOREIGN KEY (`audio_id`) REFERENCES `audio`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='音频收听记录表';
```

**验收标准**:
- [ ] 表结构包含所有必要字段
- [ ] 索引设计合理（包含组合索引）
- [ ] 与 `user`、`audio` 表建立外键关联
- [ ] 支持软删除
- [ ] 建表语句可执行无错误

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

### P0-DB-02: 缺少 checkin_record 表

**问题描述**: PRD 要求晨起/晚间打卡功能，但数据库设计缺少 `checkin_record` 表

**位置**: `SCHEMA.sql`

**影响范围**: 
- 无法记录用户打卡行为
- 无法统计打卡连续天数
- 无法生成打卡证书
- 禅理板块打卡功能无法实现

**当前状态**: `SCHEMA.sql` 中无此表定义

**修复方案**:
```sql
-- 打卡记录表
CREATE TABLE `checkin_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` BIGINT NOT NULL COMMENT '用户 ID',
  `checkin_type` TINYINT NOT NULL COMMENT '打卡类型（1: 晨起，2: 晚间）',
  `checkin_date` DATE NOT NULL COMMENT '打卡日期',
  `audio_id` BIGINT DEFAULT NULL COMMENT '关联音频 ID（可选，晨起打卡可能关联音频）',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `deleted_at` TIMESTAMP NULL COMMENT '删除时间（软删除）',
  INDEX `idx_user_id` (`user_id`),
  INDEX `idx_checkin_date` (`checkin_date`),
  UNIQUE KEY `uk_user_date_type` (`user_id`, `checkin_date`, `checkin_type`) COMMENT '防止同一天同一类型重复打卡',
  CONSTRAINT `fk_checkin_record_user` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`),
  CONSTRAINT `fk_checkin_record_audio` FOREIGN KEY (`audio_id`) REFERENCES `audio`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='打卡记录表';
```

**验收标准**:
- [ ] 支持每日两次打卡（晨起/晚间）
- [ ] 唯一索引防止重复打卡
- [ ] 支持关联音频记录（可选）
- [ ] 支持软删除
- [ ] 建表语句可执行无错误

**优先级**: P0  
**严重程度**: 🔴 高  
**修复时限**: 开发前必须修复

---

## 📊 修复进度跟踪

| 问题编号 | 问题描述 | 模块 | 负责人 | 状态 | 预计完成时间 | 实际完成时间 |
|---------|---------|------|--------|------|------------|------------|
| P0-MINI-01 | 缺少错误处理 | 小程序端 | 小程序开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-MINI-02 | 硬编码 API 地址 | 小程序端 | 小程序开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-MINI-03 | 缺少页面配置文件 | 小程序端 | 小程序开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-API-01 | 缺少 JWT 认证 | 后端 API | 后端 API 开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-API-02 | 缺少请求参数验证 | 后端 API | 后端 API 开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-API-03 | 缺少限流保护 | 后端 API | 后端 API 开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-API-04 | JWT 密钥硬编码 | 后端 API | 后端 API 开发-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-DB-01 | 缺少 audio_record 表 | 数据库设计 | 数据库设计-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |
| P0-DB-02 | 缺少 checkin_record 表 | 数据库设计 | 数据库设计-Agent | ⏳ 待修复 | 2026-04-16 22:30 | - |

---

## ✅ 验收标准

所有 P0 问题修复完成后，需满足以下验收标准：

### 小程序端
- [ ] 所有 `wx.request` 添加 success/fail 回调
- [ ] API 地址使用配置文件管理
- [ ] 所有页面有完整的 `.json` 配置文件
- [ ] 生产环境使用 HTTPS
- [ ] 错误提示用户友好

### 后端 API
- [ ] 所有写操作接口添加 JWT 认证
- [ ] 所有接口添加参数验证
- [ ] 全局添加请求限流保护
- [ ] JWT 密钥使用环境变量
- [ ] 返回业务错误码

### 数据库设计
- [ ] 补充 `audio_record` 表
- [ ] 补充 `checkin_record` 表
- [ ] 建表语句可执行无错误
- [ ] 索引设计合理
- [ ] 外键关联正确

---

## 🚨 风险提示

**如不修复 P0 问题，将面临以下风险**:

1. **安全风险**:
   - JWT 密钥泄露可能导致用户数据被窃取
   - 未认证接口可能被恶意利用
   - 敏感数据明文传输

2. **质量风险**:
   - 无效数据进入数据库
   - 统计数据不准确
   - 用户体验差

3. **运维风险**:
   - DDoS 攻击导致服务不可用
   - 无法追踪用户行为
   - 问题难以排查

**建议**: 在开发前必须修复所有 P0 问题，否则不应进入开发阶段。

---

**文档创建时间**: 2026-04-16 21:42 UTC  
**最后更新**: 2026-04-16 21:42 UTC  
**审查人**: 质量审查-Agent
