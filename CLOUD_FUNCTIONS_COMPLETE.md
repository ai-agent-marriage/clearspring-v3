# 清如 ClearSpring 小程序 - 云函数开发完成报告

## 📋 任务概述

**开发内容**: 8 个云函数 + 6 个数据库集合设计  
**输出位置**: `/home/admin/.openclaw/workspace/projects/clearspring/cloud/functions/`  
**提交方式**: 每完成 2 个云函数提交一次代码到 GitHub

---

## ✅ 云函数清单（8 个）

### 1. login - 用户登录/注册
- **文件**: `cloud/functions/login/index.js`
- **功能**: 
  - wx.login 登录/注册
  - 用户信息创建/更新
  - 手机号脱敏存储（138****1234）
  - 审计日志记录
- **核心规范**: ✅ 敏感信息脱敏、✅ 审计日志

### 2. createOrder - 创建放生订单
- **文件**: `cloud/functions/createOrder/index.js`
- **功能**:
  - 订单号自动生成（ORD+ 日期 + 序列号）
  - 订单数据验证（物种、位置、数量、价格）
  - 地理位置验证
  - 用户放生次数更新
  - 审计日志记录
- **核心规范**: ✅ 敏感信息脱敏、✅ 审计日志

### 3. grabOrder - 抢单（分布式锁）
- **文件**: `cloud/functions/grabOrder/index.js`
- **功能**:
  - 分布式锁实现（云数据库锁表）
  - 锁过期自动释放（5 秒）
  - 双重检查防止并发
  - 执行者资质验证
  - 接单统计更新
- **核心规范**: ✅ 分布式锁一单一人、✅ 审计日志

### 4. uploadEvidence - 证据上传（断点续传）
- **文件**: `cloud/functions/uploadEvidence/index.js`
- **功能**:
  - 分片上传（1MB/片）
  - 支持 init/upload/complete/progress 四种操作
  - 断点续传支持
  - 元数据记录（GPS、时间、设备）
  - 自动关联订单
- **核心规范**: ✅ 断点续传、✅ 审计日志

### 5. generateCertificate - 证书生成（Canvas 异步）
- **文件**: `cloud/functions/generateCertificate/index.js`
- **功能**:
  - 证书编号自动生成（CERT+ 日期 + 序列号）
  - 农历日期转换
  - 黄历宜忌查询
  - 功德值计算（根据物种和数量）
  - Canvas 图片生成配置
  - 祈福者功德统计更新
- **核心规范**: ✅ 后端 Canvas 生成、✅ 审计日志

### 6. processPayment - 支付分账
- **文件**: `cloud/functions/processPayment/index.js`
- **功能**:
  - 90% 执行者/10% 平台分账规则
  - 交易记录创建
  - 金额精确到分（避免精度问题）
  - 执行者收入累计
  - 手机号脱敏存储
- **核心规范**: ✅ 敏感信息脱敏、✅ 审计日志

### 7. sendNotification - 服务通知推送
- **文件**: `cloud/functions/sendNotification/index.js`
- **功能**:
  - 6 种通知类型（订单状态/抢单/证据/证书/分账/提现）
  - 微信订阅消息集成
  - 自动扣减订阅次数
  - 根据角色自动选择跳转页面
- **核心规范**: ✅ 审计日志

### 8. synthesizeWatermark - 视频水印合成
- **文件**: `cloud/functions/synthesizeWatermark/index.js`
- **功能**:
  - GPS 坐标 + 时间 + 任务 ID 三要素水印
  - 支持视频和图片水印
  - 地理位置验证（与订单位置比对，最大偏差 1000 米）
  - 防止前端伪造水印
  - 水印合成状态标记
- **核心规范**: ✅ 视频水印后端合成、✅ 审计日志

---

## 🗄️ 数据库集合（6 个）

| 集合名 | 描述 | 主要索引 |
|--------|------|----------|
| users | 用户表（祈福者/执行者/管理员） | openid, role, phone |
| orders | 订单表（放生任务） | orderId, prayerId, executorId, status |
| evidence | 证据表（视频/照片） | orderId, executorId, uploadTime |
| certificates | 功德证书表 | orderId, prayerId, generateTime |
| transactions | 交易/分账表 | orderId, transactionId, status |
| audit_logs | 审计日志表 | operatorId, operationType, timestamp |

---

## 🔒 核心规范遵守情况

| 规范 | 实现情况 | 相关云函数 |
|------|----------|------------|
| 视频水印必须后端合成 | ✅ | synthesizeWatermark |
| 抢单必须分布式锁 | ✅ | grabOrder |
| 敏感信息脱敏存储 | ✅ | login, createOrder, processPayment |
| 关键操作记录审计日志 | ✅ | 全部 8 个云函数 |
| 支持断点续传 | ✅ | uploadEvidence |

---

## 📦 Git 提交记录

共 4 次提交（每 2 个云函数提交一次）：

1. `afafdc5` - feat: 添加 login 和 createOrder 云函数
2. `4bf538e` - feat: 添加 grabOrder 和 uploadEvidence 云函数
3. `5fc6a1f` - feat: 添加 generateCertificate 和 processPayment 云函数
4. `77cb73a` - feat: 添加 sendNotification 和 synthesizeWatermark 云函数

**最新提交**: `6e36daf` (已推送到 GitHub)

---

## 📁 文件结构

```
cloud/functions/
├── login/
│   ├── index.js
│   └── package.json
├── createOrder/
│   ├── index.js
│   └── package.json
├── grabOrder/
│   ├── index.js
│   └── package.json
├── uploadEvidence/
│   ├── index.js
│   └── package.json
├── generateCertificate/
│   ├── index.js
│   └── package.json
├── processPayment/
│   ├── index.js
│   └── package.json
├── sendNotification/
│   ├── index.js
│   └── package.json
└── synthesizeWatermark/
    ├── index.js
    └── package.json
```

---

## ⚠️ 注意事项

1. **Canvas 生成**: `generateCertificate` 中的 Canvas 图片生成功能需要 node-canvas 库支持，实际部署时需安装相应依赖或使用云服务商的图片处理功能。

2. **视频水印**: `synthesizeWatermark` 中的视频处理需要 ffmpeg 或云服务商的视频处理插件，实际部署时需配置相应环境。

3. **分布式锁**: `grabOrder` 使用云数据库实现分布式锁，高并发场景下建议考虑使用 Redis 等专用锁服务。

4. **订阅消息**: `sendNotification` 需要用户在小程序端授权订阅消息模板，否则无法发送通知。

5. **加密存储**: 手机号和身份证等敏感信息目前使用简单脱敏，生产环境应使用加密算法（如 AES）进行加密存储。

---

## ✅ 任务完成

**所有 8 个云函数已开发完成并提交到 GitHub。**
