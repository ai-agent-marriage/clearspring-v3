# 云函数开发计划

**创建时间**: 2026-04-05  
**状态**: 开发中

---

## 📊 云函数完成情况

### ✅ 已完成（4/8）

| 云函数 | 状态 | 位置 | 说明 |
|--------|------|------|------|
| login | ✅ | cloud/functions/login | 用户登录/注册 |
| createOrder | ✅ | cloud/functions/createOrder | 创建订单 |
| grabOrder | ✅ | cloud/functions/grabOrder | 抢单（分布式锁） |
| uploadEvidence | ✅ | cloud/functions/uploadEvidence | 证据上传（断点续传） |

### ⏳ 待完成（4/8）

| 云函数 | 优先级 | 预计时间 | 说明 |
|--------|--------|---------|------|
| generateCertificate | P1 | 2 小时 | 证书生成 |
| processPayment | P0 | 3 小时 | 支付分账 |
| sendNotification | P1 | 1 小时 | 通知推送 |
| synthesizeWatermark | P2 | 2 小时 | 视频水印 |

---

## 🚀 开发计划

### 1. generateCertificate（证书生成）- P1

**功能**: 自动生成放生功德证书

**输入**:
```javascript
{
  orderId: "order_123",
  userId: "user_456",
  meritData: {
    itemName: "放生鲫鱼",
    quantity: "100 条",
    amount: 50000,  // 功德金（分）
    date: "2026-04-05",
    location: "西湖水域"
  }
}
```

**输出**:
```javascript
{
  certificateUrl: "https://.../certificates/cert_789.pdf",
  certificateId: "cert_789",
  shareImageUrl: "https://.../certificates/cert_789_share.jpg"
}
```

**实现步骤**:
1. 创建云函数目录
2. 安装 pdfkit（PDF 生成库）
3. 设计证书模板
4. 生成 PDF 证书
5. 生成分享图片
6. 上传到云存储
7. 返回证书 URL

---

### 2. processPayment（支付分账）- P0

**功能**: 处理支付和分账

**输入**:
```javascript
{
  orderId: "order_123",
  userId: "user_456",
  executorId: "executor_789",
  amount: 50000,  // 总金额（分）
  platformRate: 0.05  // 平台费率 5%
}
```

**输出**:
```javascript
{
  transactionId: "trans_xxx",
  platformFee: 2500,  // 平台分账
  executorFee: 47500,  // 执行者分账
  status: "success"
}
```

**实现步骤**:
1. 调用微信支付 API
2. 验证支付结果
3. 计算分账金额
4. 调用分账 API
5. 更新订单状态
6. 记录交易流水
7. 发送通知

---

### 3. sendNotification（通知推送）- P1

**功能**: 推送通知（飞书 + 微信模板消息）

**输入**:
```javascript
{
  userId: "user_123",
  type: "order_status",  // 通知类型
  data: {
    orderId: "order_456",
    status: "completed",
    message: "订单已完成"
  }
}
```

**输出**:
```javascript
{
  feishuResult: "success",
  wechatResult: "success"
}
```

**实现步骤**:
1. 创建通知模板
2. 调用飞书机器人 API
3. 调用微信模板消息 API
4. 记录通知日志
5. 返回结果

---

### 4. synthesizeWatermark（视频水印）- P2

**功能**: 为视频添加水印

**输入**:
```javascript
{
  videoUrl: "https://.../video.mp4",
  watermarkText: "放生时间：2026-04-05",
  userId: "user_123"
}
```

**输出**:
```javascript
{
  watermarkedUrl: "https://.../video_watermarked.mp4",
  duration: 15.5,
  size: 1024000
}
```

**实现步骤**:
1. 下载原视频
2. 使用 ffmpeg 添加水印
3. 上传到云存储
4. 删除临时文件
5. 返回新视频 URL

---

## 📁 目录结构

```
cloud/functions/
├── login/              ✅ 已完成
├── createOrder/        ✅ 已完成
├── grabOrder/          ✅ 已完成
├── uploadEvidence/     ✅ 已完成
├── generateCertificate/ ⏳ 待开发
├── processPayment/     ⏳ 待开发
├── sendNotification/   ⏳ 待开发
└── synthesizeWatermark/ ⏳ 待开发
```

---

## 🚀 开发顺序

**推荐顺序**:
1. **processPayment** (P0) - 支付是核心功能
2. **sendNotification** (P1) - 通知是必要功能
3. **generateCertificate** (P1) - 证书是用户体验
4. **synthesizeWatermark** (P2) - 水印是增强功能

---

## 📝 开发规范

### 云函数模板

```javascript
// index.js
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event, context) => {
  try {
    // 1. 参数验证
    const { userId, orderId } = event;
    if (!userId || !orderId) {
      return { success: false, error: '参数错误' };
    }
    
    // 2. 业务逻辑
    // ...
    
    // 3. 返回结果
    return { success: true, data: {} };
  } catch (err) {
    console.error(err);
    return { success: false, error: err.message };
  }
};
```

### package.json 模板

```json
{
  "name": "cloud-function",
  "version": "1.0.0",
  "description": "云函数",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  },
  "devDependencies": {
    "eslint": "^8.0.0"
  }
}
```

---

## ✅ 验收标准

每个云函数必须满足：

- [ ] 功能完整
- [ ] 错误处理
- [ ] 日志记录
- [ ] 单元测试
- [ ] 文档说明
- [ ] 性能优化
- [ ] 安全验证

---

**最后更新**: 2026-04-05  
**维护者**: ClearSpring V3 Team
