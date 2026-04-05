# 支付系统部署指南

## 部署步骤

### 1. 数据库建表（已完成✅）

```bash
# 执行建表脚本
mysql -h localhost -u root -p qingru_app < cloud/database-pay-schema.sql
```

验证表是否创建成功：
```sql
USE qingru_app;
DESCRIBE pay_log;
DESCRIBE order_protect;
```

### 2. 部署云函数

#### 方式一：使用微信开发者工具
1. 打开微信开发者工具
2. 导入项目（根目录：`/root/.openclaw/workspace`）
3. 右键点击 `cloud/functions/pay` 目录
4. 选择「上传并部署：云端安装依赖」

#### 方式二：使用命令行部署
```bash
# 进入云函数目录
cd cloud/functions/pay

# 部署每个云函数
wx cloud deploy createPay
wx cloud deploy payCallback
wx cloud deploy syncOrderStatus
wx cloud deploy refund
wx cloud deploy queryOrderStatus
```

#### 方式三：使用部署脚本
```bash
# 执行部署脚本
./deploy-functions.sh pay
```

### 3. 配置定时触发器

#### 在微信开发者工具中配置：
1. 打开「云开发」控制台
2. 进入「云函数」页面
3. 找到 `pay/syncOrderStatus` 函数
4. 点击「触发器」标签
5. 点击「添加触发器」
6. 配置 Cron 表达式：`0 */10 * * * * *`（每 10 分钟执行）
7. 保存

#### 或使用命令行配置：
```bash
wx cloud trigger create \
  --function-name pay/syncOrderStatus \
  --name syncOrderStatusTimer \
  --cron "0 */10 * * * * *"
```

### 4. 配置环境变量

在微信开发者工具云开发控制台中，为以下云函数配置环境变量：

**createPay, payCallback, refund:**
- `WX_APP_ID`: 微信小程序 AppID
- `WX_MCH_ID`: 微信支付商户号
- `WX_API_KEY`: 微信支付 API 密钥
- `WX_NOTIFY_URL`: 支付回调 URL
- `WX_REFUND_NOTIFY_URL`: 退款回调 URL

### 5. 配置支付回调 URL

在微信支付商户平台配置回调 URL：
- 支付回调：`https://your-domain.com/pay/callback`
- 退款回调：`https://your-domain.com/pay/refund/callback`

## 验收测试

### 1. 数据库验证
```sql
-- 检查 pay_log 表
SELECT COUNT(*) FROM pay_log;

-- 检查 order_protect 表
SELECT COUNT(*) FROM order_protect;
```

### 2. 幂等性测试

**测试场景 1：重复调用 createPay**
```javascript
// 第一次调用
const result1 = await wx.cloud.callFunction({
  name: 'pay/createPay',
  data: { orderNo: 'TEST001', amount: 0.01 }
});

// 第二次调用（相同订单号）
const result2 = await wx.cloud.callFunction({
  name: 'pay/createPay',
  data: { orderNo: 'TEST001', amount: 0.01 }
});

// 验证：result2 应该返回 isExisting: true
```

**测试场景 2：重复回调 payCallback**
```javascript
// 第一次回调
await wx.cloud.callFunction({
  name: 'pay/payCallback',
  data: {
    transaction_id: 'TEST_TXN_001',
    out_trade_no: 'TEST001',
    total_fee: 1,
    return_code: 'SUCCESS',
    result_code: 'SUCCESS'
  }
});

// 第二次回调（相同 transaction_id）
await wx.cloud.callFunction({
  name: 'pay/payCallback',
  data: {
    transaction_id: 'TEST_TXN_001',
    out_trade_no: 'TEST001',
    total_fee: 1,
    return_code: 'SUCCESS',
    result_code: 'SUCCESS'
  }
});

// 验证：pay_log 表中只有一条成功记录
```

### 3. 支付流程测试

1. 创建测试订单
2. 调用支付接口
3. 模拟支付成功
4. 验证订单状态更新
5. 验证支付日志记录

### 4. 超时取消测试

1. 创建测试订单（不支付）
2. 等待 15 分钟（或修改 expire_time 为过去时间）
3. 触发 syncOrderStatus 函数
4. 验证订单状态变为「已取消」

### 5. 退款测试

1. 创建已支付订单
2. 调用退款接口
3. 验证退款日志记录
4. 验证订单状态更新

## 监控与告警

### 关键指标监控
- 支付成功率：≥99.9%
- 支付状态同步延迟：≤1 分钟
- 重复支付次数：0
- 超时订单取消率：100%

### 日志查询
```javascript
// 查询支付成功日志
db.collection('pay_log').where({
  status: 1,
  type: 1
}).get()

// 查询失败日志
db.collection('pay_log').where({
  status: 2
}).get()
```

## 常见问题

### Q1: 支付回调收不到？
A: 检查微信支付商户平台的回调 URL 配置，确保外网可访问。

### Q2: 幂等性失效？
A: 检查 transaction_id 是否唯一，检查 pay_log 表索引是否正确。

### Q3: 定时触发器不执行？
A: 检查触发器配置，确保云函数已部署且触发器已启用。

## 回滚方案

如需回滚，执行以下步骤：
1. 恢复数据库备份
2. 重新部署旧版本云函数
3. 禁用新触发器
