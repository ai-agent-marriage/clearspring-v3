# 清如 ClearSpring V3 小程序代码审查报告

**审查日期**: 2026-04-15  
**审查范围**: 核心业务逻辑、新增/修改文件、安全隐患、性能问题  
**审查工具**: quack-code-review + 人工审计  
**审查状态**: ✅ 完成

---

## 📊 综合质量评分

| 维度 | 得分 | 评级 |
|------|------|------|
| 代码质量 | 72/100 | ⚠️ 中等 |
| 性能优化 | 65/100 | ⚠️ 需改进 |
| 安全性 | 58/100 | ❌ 高风险 |
| 最佳实践 | 70/100 | ⚠️ 中等 |
| **综合评分** | **66/100** | **⚠️ 需改进** |

---

## 🔴 P0 严重问题（必须立即修复）

### 1. 安全隐患 - 敏感信息硬编码

**位置**: `app.js`, `utils/cloud.js`, `utils/request.js`

**问题描述**:
```javascript
// app.js:46
cloudEnv: 'clearspring-prod'

// app.js:48
apiBase: 'https://api.clearspring.com'

// utils/request.js:5
const BASE_URL = getApp().globalData.apiBase || 'https://api.clearspring.com'
```

**风险**: 
- 生产环境配置硬编码在代码中
- API 地址暴露，可能被恶意利用
- 无环境隔离（开发/测试/生产）

**修复建议**:
```javascript
// 使用环境变量或配置文件
const config = require('../config/environment');
cloudEnv: config.cloudEnv,
apiBase: config.apiBase
```

**优先级**: 🔥 P0  
**影响范围**: 全应用安全

---

### 2. 支付安全 - 缺少金额校验

**位置**: `utils/pay/payment.js`, `pages/pay/pay.js`

**问题描述**:
```javascript
// payment.js:46 - 创建支付订单
async function createPayOrder({ orderNo, amount, body = '清如 ClearSpring - 订单支付' }) {
  // ❌ 未验证 amount 是否为正数、是否超限
  // ❌ 未验证 orderNo 格式
}

// pages/pay/pay.js:57
const { orderNo, amount } = options;
// ❌ 仅检查是否存在，未校验金额合法性
if (!orderNo || !amount) {
```

**风险**:
- 用户可能传入负数金额进行攻击
- 金额可能被篡改（前端修改）
- 无最大金额限制

**修复建议**:
```javascript
// 添加严格校验
if (!orderNo || typeof amount !== 'number' || amount <= 0 || amount > 100000) {
  return {
    success: false,
    message: '订单金额无效'
  };
}

// 服务端二次校验金额（必须）
const serverAmount = await getOrderAmountFromServer(orderNo);
if (serverAmount !== amount) {
  throw new Error('金额不匹配');
}
```

**优先级**: 🔥 P0  
**影响范围**: 支付安全

---

### 3. XSS 风险 - 用户输入未过滤

**位置**: `pages/executor-evidence/executor-evidence.js`

**问题描述**:
```javascript
// 证据提交页:153
onDescriptionInput(e) {
  this.setData({
    description: e.detail.value  // ❌ 直接使用用户输入
  });
}

// 提交时未进行任何过滤
const submitData = {
  description: this.data.description,  // ❌ 可能包含恶意脚本
  // ...
};
```

**风险**:
- 用户可提交恶意脚本
- 可能在其他页面执行 XSS 攻击
- 数据库存储污染

**修复建议**:
```javascript
// 添加输入过滤
function sanitizeInput(input) {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim();
}

onDescriptionInput(e) {
  const sanitized = sanitizeInput(e.detail.value);
  this.setData({ description: sanitized });
}
```

**优先级**: 🔥 P0  
**影响范围**: 用户输入处理

---

### 4. SQL 注入风险 - 云函数调用未验证

**位置**: `utils/cloud.js`, `pages/executor-order-hall/executor-order-hall.js`

**问题描述**:
```javascript
// executor-order-hall.js:64
wx.cloud.callFunction({
  name: 'getAvailableOrders',
  data: {
    page: this.data.page,
    pageSize: this.data.pageSize,
    type: this.data.filterType,  // ❌ 直接传入用户选择
    sortBy: this.data.filterDistance  // ❌ 可能被注入
  }
});
```

**风险**:
- 云函数内部可能直接拼接 SQL
- 用户可构造恶意参数
- 数据泄露风险

**修复建议**:
```javascript
// 白名单验证
const VALID_TYPES = ['心理咨询', '法律援助', '职业规划', '情感疏导', '健康指导'];
const VALID_SORT = ['距离优先', '时间优先', '价格优先'];

if (!VALID_TYPES.includes(filterType) || !VALID_SORT.includes(sortBy)) {
  throw new Error('无效参数');
}

// 云函数内部使用参数化查询
```

**优先级**: 🔥 P0  
**影响范围**: 数据库安全

---

## 🟠 P1 高优先级问题

### 5. 错误处理不完整 - 支付流程

**位置**: `utils/pay/payment.js`

**问题描述**:
```javascript
// payment.js:128 - 轮询支付结果
async function pollPayResult(orderNo, onStatusChange) {
  // ❌ 网络错误时继续轮询，可能导致无限循环
  } catch (error) {
    console.error('轮询支付结果失败:', error);
    // 发生错误时继续轮询  // ❌ 应限制重试次数
    setTimeout(poll, PAY_CONFIG.POLL_INTERVAL);
  }
}
```

**风险**: 网络异常时可能无限轮询，消耗资源

**修复建议**:
```javascript
let retryCount = 0;
const MAX_RETRY = 5;

} catch (error) {
  retryCount++;
  if (retryCount >= MAX_RETRY) {
    resolve({
      success: false,
      status: PAY_STATUS.FAILED,
      message: '网络异常，请稍后重试'
    });
    return;
  }
  setTimeout(poll, PAY_CONFIG.POLL_INTERVAL);
}
```

**优先级**: 🟠 P1

---

### 6. 内存泄漏风险 - 定时器未清理

**位置**: `pages/pay/pay.js`, `pages/executor-evidence/executor-evidence.js`

**问题描述**:
```javascript
// pay.js:72
startCountdown() {
  this.countdownTimer = setInterval(() => {
    // ...
  }, 1000);
}

onUnload() {
  // ✅ 有清理，但仅在当前页面
  if (this.countdownTimer) {
    clearInterval(this.countdownTimer);
  }
}

// executor-evidence.js:142 - 视频上传进度
const timer = setInterval(() => {
  progress += 10;
  if (progress >= 100) {
    clearInterval(timer);
  }
}, 500);
// ❌ 页面卸载时未清理
```

**修复建议**:
```javascript
// 保存所有定时器引用
this.uploadTimers = [];

// 页面卸载时统一清理
onUnload() {
  if (this.countdownTimer) clearInterval(this.countdownTimer);
  this.uploadTimers.forEach(timer => clearInterval(timer));
}
```

**优先级**: 🟠 P1

---

### 7. 重复代码 - 订单状态映射

**位置**: `pages/order/order.js`, `pages/q-16-order-detail/q-16-order-detail.js`

**问题描述**:
```javascript
// order.js:55
statusColors: {
  1: '#FF9800',  // 待承接
  2: '#2196F3',  // 待执行
  3: '#9C27B0',  // 执行中
  4: '#FF5722',  // 待确认
  5: '#4CAF50',  // 已完成
  6: '#9E9E9E'   // 已取消
}

// q-16-order-detail.js - 重复定义类似逻辑
```

**风险**: 代码重复，维护困难

**修复建议**:
```javascript
// 提取为公共配置
// utils/order-config.js
export const ORDER_STATUS = {
  PENDING_ACCEPT: { id: 1, name: '待承接', color: '#FF9800' },
  PENDING_EXECUTE: { id: 2, name: '待执行', color: '#2196F3' },
  // ...
};

// 页面中引用
import { ORDER_STATUS } from '../../utils/order-config';
```

**优先级**: 🟠 P1

---

### 8. 未处理边界情况 - 图片上传

**位置**: `pages/executor-evidence/executor-evidence.js`

**问题描述**:
```javascript
// executor-evidence.js:67
onAddPhoto() {
  if (this.data.photos.length >= 9) {
    // ✅ 有数量限制
  }

  wx.chooseMedia({
    count: 9 - this.data.photos.length,
    // ❌ 未处理用户取消选择
    // ❌ 未处理图片大小限制
    // ❌ 未处理图片格式验证
  });
}
```

**修复建议**:
```javascript
wx.chooseMedia({
  count: Math.min(9 - this.data.photos.length, 9),
  mediaType: ['image'],
  sizeType: ['compressed'],
  max_size: 10 * 1024 * 1024, // 10MB 限制
  success: (res) => {
    // 验证图片格式
    const validFormats = ['jpg', 'jpeg', 'png', 'gif'];
    const invalidFiles = res.tempFiles.filter(f => {
      const ext = f.tempFilePath.split('.').pop().toLowerCase();
      return !validFormats.includes(ext);
    });
    
    if (invalidFiles.length > 0) {
      wx.showToast({ title: '仅支持 JPG/PNG/GIF 格式', icon: 'none' });
      return;
    }
  }
});
```

**优先级**: 🟠 P1

---

## 🟡 P2 中优先级问题

### 9. 代码注释不足

**位置**: 多处关键业务逻辑

**问题描述**:
- 复杂业务逻辑缺少注释
- 函数参数无类型说明
- 缺少使用示例

**修复建议**: 使用 JSDoc 规范
```javascript
/**
 * 发起微信支付
 * @param {object} payParams - 支付参数
 * @param {string} payParams.timeStamp - 时间戳
 * @param {string} payParams.nonceStr - 随机字符串
 * @param {string} payParams.package - 订单详情
 * @returns {Promise<{success: boolean, status: string}>}
 */
async function initiateWechatPay(payParams) {
  // ...
}
```

**优先级**: 🟡 P2

---

### 10. 性能问题 - 列表渲染未优化

**位置**: `pages/order/order.js`, `pages/executor-order-hall/executor-order-hall.js`

**问题描述**:
```javascript
// order.js:103
filterOrdersByTab(tabIndex) {
  let filteredOrders = [...this.data.orders];  // ❌ 全量复制
  if (tabIndex > 0) {
    filteredOrders = filteredOrders.filter(order => order.status === tabIndex);
  }
  this.setData({ orders: filteredOrders });  // ❌ 大数据量时性能差
}
```

**修复建议**:
```javascript
// 使用 wx.createSelectorQuery 优化
// 或分页加载 + 虚拟列表
loadOrders(tabIndex = 0) {
  wx.cloud.callFunction({
    name: 'getOrders',
    data: {
      status: tabIndex > 0 ? tabIndex : null,
      limit: 20,
      offset: this.data.offset
    }
  });
}
```

**优先级**: 🟡 P2

---

### 11. 日志泄露风险

**位置**: 多处

**问题描述**:
```javascript
// 虽然大部分已清理，但仍有残留
console.log('handleRetry called', e);  // pay.js:18
console.log('handleCancel called', e); // pay.js:23

// 可能泄露敏感信息
console.error('[云函数调用失败]', name, error); // cloud.js:24
```

**修复建议**:
```javascript
// 使用日志级别控制
const LOG_LEVEL = process.env.NODE_ENV === 'production' ? 'error' : 'debug';

function log(level, ...args) {
  if (['error', 'warn'].includes(level) || LOG_LEVEL === 'debug') {
    console[level](...args);
  }
}
```

**优先级**: 🟡 P2

---

### 12. 缺少 Loading 状态管理

**位置**: `pages/executor-order-hall/executor-order-hall.js`

**问题描述**:
```javascript
loadOrders(isRefresh = false) {
  if (this.data.loading) return;
  this.setData({ loading: true });
  
  wx.cloud.callFunction({
    // ❌ 未设置超时
    // ❌ 失败时 loading 状态可能不恢复
  });
}
```

**修复建议**:
```javascript
loadOrders(isRefresh = false) {
  if (this.data.loading) return;
  
  const loadingTimer = setTimeout(() => {
    this.setData({ loading: false });
    wx.showToast({ title: '加载超时', icon: 'none' });
  }, 30000);
  
  wx.cloud.callFunction({
    // ...
  }).finally(() => {
    clearTimeout(loadingTimer);
    this.setData({ loading: false });
  });
}
```

**优先级**: 🟡 P2

---

## ✅ 已识别的优点

1. **错误处理封装**: `utils/error-handler.js` 提供了统一的错误处理机制
2. **内容安全**: `utils/security.js` 集成了微信内容安全 API
3. **断点续传**: `utils/cloud.js` 实现了上传断点续传逻辑
4. **请求限流**: `utils/request.js` 包含简单的请求限流实现
5. **Token 注入**: 统一在请求头注入 Authorization
6. **代码清理**: 大部分调试日志已使用 `[CLEANED]` 标记

---

## 📋 修复清单

### 立即修复（P0）
- [ ] 移除硬编码的生产环境配置
- [ ] 添加支付金额严格校验
- [ ] 实现用户输入过滤（XSS 防护）
- [ ] 云函数参数白名单验证

### 本周修复（P1）
- [ ] 完善支付流程错误处理
- [ ] 修复定时器内存泄漏
- [ ] 提取重复代码为公共模块
- [ ] 增强图片上传验证

### 下次迭代（P2）
- [ ] 补充 JSDoc 注释
- [ ] 优化列表渲染性能
- [ ] 实现日志级别控制
- [ ] 完善 Loading 状态管理

---

## 🔍 审查工具输出

使用 quack-code-review 工具分析关键文件:

### payment.js 复杂度分析
- 节点数：18
- 边数：17
- 复杂度评分：0 (需要更详细的复杂度计算)
- 主要函数：createPayOrder, initiateWechatPay, pollPayResult, completePayFlow

### order.js 分析
- 主要问题：Mock 数据、TODO 注释过多
- 缺少实际 API 调用实现

### executor-evidence.js 分析
- 证据提交逻辑完整
- 但缺少实际云存储上传代码（被注释）

---

## 📌 总结建议

### 安全方面
1. **立即**移除所有硬编码配置
2. **必须**在服务端二次校验支付金额
3. **必须**实现输入过滤和参数验证
4. 建议接入 HTTPS 证书锁定

### 性能方面
1. 实现分页加载和虚拟列表
2. 优化图片压缩和缓存策略
3. 减少 setData 调用频率

### 代码质量
1. 统一错误处理规范
2. 补充单元测试（特别是支付流程）
3. 使用 ESLint + Prettier 规范代码风格
4. 建立 Code Review 流程

---

**审查人**: AI Code Reviewer (quack-code-review)  
**审查时间**: 2026-04-15 14:30  
**下次审查建议**: 修复 P0 问题后重新审查

---

## 📞 联系方式

如有疑问或需要进一步审查特定模块，请联系主 Agent。
