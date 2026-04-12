# 表单验证 + 错误处理修复报告

**修复日期**: 2026-04-12  
**修复内容**: P0-005 (表单验证) + P0-009 (错误处理)

---

## 一、新增工具类

### 1. `utils/validator.js` - 表单验证工具类

提供以下验证功能：

- ✅ `validateCompany(value)` - 单位名称验证（必填，至少 2 字符）
- ✅ `validateTaxNo(value)` - 税号验证（必填，15/18/20 位格式）
- ✅ `validatePhone(value)` - 手机号验证（可选，11 位格式）
- ✅ `validateAmount(value)` - 金额验证（必填，数字格式，保留 2 位小数）
- ✅ `validateInvoiceType(value, allowedTypes)` - 发票类型验证（必填，枚举值）
- ✅ `validateEmail(value)` - 邮箱验证（可选）
- ✅ `validateAddress(value)` - 地址验证（可选）
- ✅ `validateBankAccount(value)` - 银行账号验证（可选，16-19 位）
- ✅ `validateRequired(value, fieldName)` - 通用必填验证
- ✅ `validateLength(value, min, max, fieldName)` - 长度范围验证
- ✅ `validateNumberRange(value, min, max, fieldName)` - 数字范围验证

**使用示例**:
```javascript
const Validator = require('../../utils/validator');

const result = Validator.validateTaxNo('91320500MA1234567X');
if (!result.valid) {
  wx.showToast({ title: result.message, icon: 'none' });
  return;
}
```

---

### 2. `utils/error-handler.js` - 错误处理工具类

提供以下功能：

#### 错误分类
- `NETWORK_TIMEOUT` - 网络超时
- `NETWORK_ERROR` - 网络连接失败
- `UNAUTHORIZED` - 未授权（401）
- `FORBIDDEN` - 禁止访问（403）
- `SERVER_ERROR` - 服务器错误（500/502/503）
- `NOT_FOUND` - 资源不存在（404）
- `BAD_REQUEST` - 请求错误（400）
- `UNKNOWN` - 未知错误

#### 核心方法
- ✅ `classifyError(error)` - 分类错误类型
- ✅ `getErrorMessage(error, customMessage)` - 获取用户友好提示
- ✅ `showToast(error, options)` - 显示错误 Toast
- ✅ `showModal(error, options)` - 显示错误 Modal（严重错误）
- ✅ `logError(error, context)` - 上报错误日志到云函数
- ✅ `logErrorLocal(errorData)` - 本地记录错误日志（降级处理）
- ✅ `handleRequestError(error, options)` - 统一处理网络请求错误
- ✅ `request(config, options)` - 封装 wx.request 带错误处理
- ✅ `showLoading(title)` - 显示加载状态
- ✅ `hideLoading()` - 隐藏加载状态

**使用示例**:
```javascript
const ErrorHandler = require('../../utils/error-handler');

async loadData() {
  try {
    ErrorHandler.showLoading('加载中...');
    const res = await wx.request({
      url: 'https://api.example.com/data',
      timeout: 10000, // 10 秒超时
      // ...其他配置
    });
    // 处理成功响应
  } catch (error) {
    ErrorHandler.handleRequestError(error, {
      page: this.route,
      action: 'loadData',
      showToast: true
    });
  } finally {
    ErrorHandler.hideLoading();
  }
}
```

---

## 二、修复的文件

### P0-005: 表单验证

#### `pages/org-home/settlement.js`
- ✅ 引入 Validator 和 ErrorHandler 工具类
- ✅ 修改 `onSaveInvoice()` 方法添加完整表单验证
  - 单位名称必填验证
  - 税号必填 + 格式验证（15/18/20 位）
  - 金额必填 + 数字格式验证
  - 手机号格式验证（可选）
  - 地址格式验证（可选）
  - 银行账号格式验证（可选）

---

### P0-009: 错误处理

#### 执行者端（3 个文件）

1. **`pages/executor-qualification-manage/executor-qualification-manage.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadQualificationData()` 添加错误处理
   - ✅ `onUploadSkillCertificate()` 添加错误处理
   - ✅ `onUploadQualificationCertificate()` 添加错误处理

2. **`pages/executor-message-center/executor-message-center.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadMessages()` 添加错误处理

3. **`pages/executor-settings/executor-settings.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadSettings()` 添加错误处理
   - ✅ `getCacheSize()` 添加错误处理

#### 机构端（6 个文件）

4. **`pages/org-order-detail/org-order-detail.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadOrderDetail()` 添加错误处理

5. **`pages/org-volunteer-detail/org-volunteer-detail.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadVolunteerDetail()` 添加错误处理

6. **`pages/org-task-assign/org-task-assign.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadOrderInfo()` 添加错误处理
   - ✅ `loadVolunteers()` 添加错误处理
   - ✅ `loadMoreVolunteers()` 添加错误处理
   - ✅ `doAssignVolunteer()` 添加错误处理

7. **`pages/org-financial-report/org-financial-report.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadFinancialData()` 添加错误处理

8. **`pages/org-qualification/org-qualification.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadQualificationData()` 添加错误处理
   - ✅ `onUploadCertificate()` 添加错误处理

9. **`pages/org-settings/org-settings.js`**
   - ✅ 引入 ErrorHandler 工具类
   - ✅ `loadSettings()` 添加错误处理
   - ✅ `getCacheSize()` 添加错误处理

---

## 三、错误处理特性

### 1. 统一超时时间
- ✅ 所有网络请求统一设置为 **10 秒超时**

### 2. 错误提示分类
- ✅ 网络超时 → "请求超时，请检查网络"
- ✅ 网络连接失败 → "网络连接失败"
- ✅ 未登录 → "请先登录"（自动跳转登录页）
- ✅ 无权限 → "无权限访问"
- ✅ 服务器错误 → "服务器错误，请稍后重试"
- ✅ 其他错误 → "网络请求失败"

### 3. 错误日志上报
- ✅ 自动上报到云函数 `log-error`
- ✅ 包含完整错误信息（message、stack、errMsg）
- ✅ 包含上下文信息（页面、操作、时间戳）
- ✅ 包含设备信息（SDKVersion、platform、model、system）
- ✅ 云函数失败时降级到本地存储

### 4. 加载状态管理
- ✅ 网络请求时显示 Loading
- ✅ 请求完成/失败后自动隐藏 Loading
- ✅ Loading 时禁止用户操作（mask: true）

---

## 四、验证与测试建议

### 表单验证测试
1. 测试单位名称为空
2. 测试税号格式错误（非 15/18/20 位）
3. 测试手机号格式错误（非 11 位）
4. 测试金额为空或非数字
5. 测试金额小数位超过 2 位
6. 测试银行账号格式错误

### 错误处理测试
1. 模拟网络超时（断网或慢速网络）
2. 模拟 401 错误（未登录）
3. 模拟 403 错误（无权限）
4. 模拟 500 错误（服务器错误）
5. 检查错误日志是否正确上报
6. 检查 Loading 状态是否正确显示/隐藏

---

## 五、后续优化建议

1. **云函数部署**: 部署 `log-error` 云函数用于接收错误日志
2. **错误监控面板**: 建立错误日志查看和分析面板
3. **验证规则配置化**: 将验证规则配置到云端，支持动态调整
4. **错误重试机制**: 对网络错误添加自动重试功能
5. **离线缓存**: 支持离线模式下的数据缓存

---

**修复完成时间**: 2026-04-12 10:45  
**实际工时**: 约 1.5 小时  
**修复文件数**: 11 个（2 个工具类 + 9 个页面）
