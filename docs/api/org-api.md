# 机构端 API 接口文档

本文档描述机构端小程序与云函数之间的数据交互接口。

## 接口列表

| 云函数名称 | 功能描述 | 调用页面 |
|-----------|---------|---------|
| `org-data` | 获取机构工作台数据 | 机构首页 |
| `order-list` | 获取订单列表 | 订单管理页 |
| `volunteer-list` | 获取志愿者列表 | 志愿者管理页 |
| `settlement-list` | 获取结算数据 | 结算管理页 |
| `log-error` | 记录错误日志 | 全局 |

---

## 1. org-data - 机构数据

### 接口说明
获取机构工作台的核心数据，包括机构信息、订单统计、待办事项等。

### 请求参数

```javascript
{
  orgId: String,      // 机构 ID（必填）
  timestamp: Number   // 时间戳，用于防缓存（必填）
}
```

### 响应格式

**成功响应：**
```javascript
{
  code: 0,
  msg: 'success',
  data: {
    orgId: String,           // 机构 ID
    orgName: String,         // 机构名称
    identity: String,        // 机构身份
    status: String,          // 认证状态：已认证/未认证
    orderCount: Number,      // 总订单数
    pendingOrders: Number,   // 待承接订单数
    completedOrders: Number, // 已完成订单数
    todayTasks: Number,      // 今日任务数
    pendingConfirm: Number,  // 待确认订单数
    todos: Array             // 待办事项列表
  }
}
```

**待办事项结构：**
```javascript
{
  type: String,      // 类型：audit/settle/dispute
  title: String,     // 待办标题
  count: Number,     // 数量
  action: String     // 操作按钮文本
}
```

**错误响应：**
```javascript
{
  code: 400,    // 错误码
  msg: String,  // 错误信息
  error: String // 错误堆栈（仅开发环境）
}
```

### 错误码

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 404 | 机构不存在 |
| 500 | 服务器错误 |

---

## 2. order-list - 订单列表

### 接口说明
获取机构订单列表，支持按状态筛选和分页。

### 请求参数

```javascript
{
  orgId: String,      // 机构 ID（必填）
  status: Number,     // 订单状态：0-全部，1-待承接，2-待执行，3-执行中，4-待确认，5-已完成，6-已取消
  timestamp: Number,  // 时间戳
  page: Number,       // 页码，默认 1
  pageSize: Number    // 每页数量，默认 20
}
```

### 响应格式

**成功响应：**
```javascript
{
  code: 0,
  msg: 'success',
  data: {
    orders: Array,     // 订单列表
    total: Number,     // 总记录数
    page: Number,      // 当前页码
    pageSize: Number,  // 每页数量
    hasMore: Boolean   // 是否有更多数据
  }
}
```

**订单结构：**
```javascript
{
  orderNo: String,      // 订单号
  status: Number,       // 订单状态
  statusName: String,   // 状态名称
  executeDate: String,  // 执行日期（YYYY-MM-DD）
  speciesName: String,  // 鱼苗品种
  waterArea: String,    // 放流水域
  volunteerName: String,// 志愿者姓名
  amount: Number,       // 订单金额
  createTime: String    // 创建时间（YYYY-MM-DD）
}
```

### 错误码

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 500 | 服务器错误 |

---

## 3. volunteer-list - 志愿者列表

### 接口说明
获取机构志愿者列表，支持地区和合规率筛选。

### 请求参数

```javascript
{
  orgId: String,          // 机构 ID（必填）
  filterRegion: String,   // 地区筛选（可选）
  filterCompliance: String,// 合规率筛选（可选，百分比数值）
  timestamp: Number,      // 时间戳
  page: Number,           // 页码，默认 1
  pageSize: Number        // 每页数量，默认 20
}
```

### 响应格式

**成功响应：**
```javascript
{
  code: 0,
  msg: 'success',
  data: {
    volunteers: Array,   // 志愿者列表
    stats: Object,       // 统计数据
    total: Number,       // 总记录数
    page: Number,        // 当前页码
    pageSize: Number,    // 每页数量
    hasMore: Boolean     // 是否有更多数据
  }
}
```

**志愿者结构：**
```javascript
{
  id: String,           // 志愿者 ID
  name: String,         // 姓名
  certified: Boolean,   // 是否已认证
  region: String,       // 地区
  totalTasks: Number,   // 累计任务数
  complianceRate: Number,// 合规率（0-100）
  actions: Array        // 可操作项：详情/分配/解绑
}
```

**统计数据：**
```javascript
{
  total: Number,        // 志愿者总数
  active: Number,       // 活跃志愿者数（近 30 天有任务）
  totalTasks: Number    // 累计任务数
}
```

### 错误码

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 500 | 服务器错误 |

---

## 4. settlement-list - 结算数据

### 接口说明
获取机构结算管理数据，包括待结算订单、结算记录、发票信息等。

### 请求参数

```javascript
{
  orgId: String,      // 机构 ID（必填）
  tabType: Number,    // Tab 类型：0-待结算订单，1-结算记录，2-发票管理
  timestamp: Number   // 时间戳
}
```

### 响应格式

**成功响应：**
```javascript
{
  code: 0,
  msg: 'success',
  data: {
    stats: Object,            // 统计数据
    pendingSettlements: Array,// 待结算订单列表
    settlementRecords: Array, // 结算记录列表
    invoiceInfo: Object,      // 发票信息
    invoiceHistory: Array     // 历史发票记录
  }
}
```

**统计数据：**
```javascript
{
  totalSettled: Number,    // 累计结算金额
  pendingSettle: Number,   // 待结算金额
  settledOrders: Number    // 已结算订单数
}
```

**待结算订单结构：**
```javascript
{
  orderNo: String,        // 订单号
  completeTime: String,   // 完成时间（YYYY-MM-DD HH:mm）
  amount: Number,         // 结算金额
  settleDeadline: String  // 结算截止日期（YYYY-MM-DD）
}
```

**结算记录结构：**
```javascript
{
  settleNo: String,       // 结算单号
  settleTime: String,     // 结算时间（YYYY-MM-DD）
  amount: Number,         // 结算金额
  invoiceStatus: String,  // 发票状态：已开票/未开票
  transferStatus: String  // 转账状态：已转账/未转账
}
```

**发票信息结构：**
```javascript
{
  company: String,        // 公司名称
  taxNo: String,          // 税号
  address: String,        // 地址
  phone: String,          // 电话
  bank: String,           // 开户行
  bankAccount: String,    // 银行账号
  status: String          // 状态：未提交/审核中/审核通过
}
```

**历史发票结构：**
```javascript
{
  invoiceNo: String,      // 发票号
  invoiceTime: String,    // 开票时间（YYYY-MM-DD）
  amount: Number,         // 发票金额
  status: String          // 状态：审核中/审核通过/已驳回
}
```

### 错误码

| 错误码 | 说明 |
|-------|------|
| 0 | 成功 |
| 400 | 参数错误 |
| 500 | 服务器错误 |

---

## 5. log-error - 错误日志

### 接口说明
记录客户端错误日志，便于问题排查和监控。

### 请求参数

```javascript
{
  error: String,      // 错误信息（必填）
  page: String,       // 页面标识（必填）
  timestamp: Number,  // 时间戳
  userInfo: Object,   // 用户信息（可选）
  extra: Object       // 额外信息（可选）
}
```

### 响应格式

**成功响应：**
```javascript
{
  code: 0,
  msg: '日志记录成功',
  data: {
    logId: Number     // 日志 ID
  }
}
```

**错误响应：**
```javascript
{
  code: 500,
  msg: '日志记录失败',
  error: String
}
```

---

## 数据字典

### 订单状态

| 状态值 | 状态名称 | 说明 |
|-------|---------|------|
| 0 | 全部 | 筛选用 |
| 1 | 待承接 | 订单已发布，等待机构承接 |
| 2 | 待执行 | 机构已承接，等待分配志愿者 |
| 3 | 执行中 | 志愿者已接受任务，待执行 |
| 4 | 待确认 | 执行完成，等待祈福者确认 |
| 5 | 已完成 | 祈福者已确认，待结算 |
| 6 | 已取消 | 订单已取消 |

### 志愿者操作

| 操作 | 说明 | 权限要求 |
|-----|------|---------|
| 详情 | 查看志愿者详细信息 | 所有志愿者 |
| 分配 | 分配任务给志愿者 | 所有志愿者 |
| 解绑 | 解除与志愿者的绑定 | 仅已认证志愿者 |
| 拉黑 | 将志愿者加入黑名单 | 所有志愿者 |

---

## 最佳实践

### 1. 错误处理
- 所有云函数调用必须使用 try-catch 包裹
- 错误必须上报到 `log-error` 云函数
- 用户提示要友好，避免暴露技术细节

### 2. 加载状态
- 数据加载前调用 `wx.showLoading()`
- 数据加载后调用 `wx.hideLoading()`
- 加载时间超过 3 秒要有超时处理

### 3. 数据验证
- 验证云函数返回的 `code` 是否为 0
- 验证 `data` 是否存在且结构正确
- 空数据要显示空状态界面

### 4. 性能优化
- 使用分页避免一次性加载大量数据
- 利用 `timestamp` 参数避免缓存
- 下拉刷新时复用加载逻辑

---

## 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 1.0.0 | 2026-04-12 | 初始版本，包含 5 个云函数接口 |
