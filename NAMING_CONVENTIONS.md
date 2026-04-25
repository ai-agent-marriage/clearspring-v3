# 清如 ClearSpring - 命名规范

**版本**: 1.0.0  
**生效日期**: 2026-04-15  
**适用范围**: 所有小程序代码

---

## 1. 文件命名

### 1.1 目录结构
- 使用 **kebab-case**（短横线分隔）
- 小写字母
- 示例：
  ```
  ✅ pages/executor-home/
  ✅ utils/
  ✅ config/
  ❌ pages/executorHome/
  ❌ pages/ExecutorHome/
  ```

### 1.2 文件命名
- JavaScript 文件：**kebab-case** 或 **camelCase**
- 组件文件：**kebab-case**
- 配置文件：**kebab-case**
- 示例：
  ```
  ✅ app-util.js
  ✅ log-cleaner.js
  ✅ request.js
  ❌ app_util.js
  ❌ AppUtil.js
  ```

### 1.3 页面文件
- 页面目录与页面名称一致
- 四个文件同名：
  ```
  pages/order-detail/
    ├── order-detail.js      ✅
    ├── order-detail.json    ✅
    ├── order-detail.wxml    ✅
    └── order-detail.wxss    ✅
  ```

---

## 2. 变量命名

### 2.1 普通变量
- 使用 **camelCase**（驼峰式）
- 名词或名词短语
- 示例：
  ```javascript
  ✅ const userInfo = {}
  ✅ const orderList = []
  ✅ const isLoading = false
  ❌ const user_info = {}
  ❌ const UserInfo = {}
  ```

### 2.2 常量
- 使用 **UPPER_SNAKE_CASE**（大写下划线）
- 全部大写
- 示例：
  ```javascript
  ✅ const MAX_RETRY_COUNT = 3
  ✅ const API_BASE_URL = 'https://api.example.com'
  ✅ const ONE_DAY = 24 * 60 * 60 * 1000
  ❌ const maxRetryCount = 3
  ❌ const MaxRetryCount = 3
  ```

### 2.3 布尔值
- 使用 `is`, `has`, `can`, `should` 等前缀
- 示例：
  ```javascript
  ✅ const isLoggedIn = true
  ✅ const hasPermission = false
  ✅ const canEdit = true
  ✅ const shouldUpdate = false
  ❌ const login = true
  ❌ const permission = false
  ```

### 2.4 数组
- 使用复数名词
- 示例：
  ```javascript
  ✅ const users = []
  ✅ const orders = []
  ✅ const items = []
  ❌ const userList = []  // 也可以，但推荐复数
  ❌ const user = []      // 单数表示数组会误导
  ```

---

## 3. 函数命名

### 3.1 普通函数
- 使用 **camelCase**
- 动词或动词短语
- 示例：
  ```javascript
  ✅ function getUserInfo() {}
  ✅ function createOrder() {}
  ✅ function validateInput() {}
  ❌ function get_user_info() {}
  ❌ function GetUserInfo() {}
  ```

### 3.2 事件处理函数
- 使用 `handle` 或 `on` 前缀
- 示例：
  ```javascript
  ✅ function handleSubmit() {}
  ✅ function onClick() {}
  ✅ function onInputChange() {}
  ❌ function submit() {}  // 事件处理函数
  ```

### 3.3 私有函数
- 使用 `_` 前缀（可选）
- 示例：
  ```javascript
  function _internalHelper() {}
  ```

---

## 4. 类命名

### 4.1 类名
- 使用 **PascalCase**（大驼峰式）
- 名词或名词短语
- 示例：
  ```javascript
  ✅ class UserService {}
  ✅ class OrderManager {}
  ❌ class userService {}
  ❌ class user_service {}
  ```

### 4.2 构造函数
- 与类名一致
- 示例：
  ```javascript
  class UserService {
    constructor() {}
  }
  ```

---

## 5. CSS 类名

### 5.1 类名
- 使用 **kebab-case**
- 小写字母
- 示例：
  ```css
  ✅ .user-info {}
  ✅ .order-list-item {}
  ❌ .userInfo {}
  ❌ .user_info {}
  ```

### 5.2 BEM 规范（推荐）
- 使用 `block__element--modifier` 格式
- 示例：
  ```css
  ✅ .card {}
  ✅ .card__title {}
  ✅ .card__title--large {}
  ```

---

## 6. 常量配置

### 6.1 配置文件
- 所有魔法数字必须提取到 `config/constants.js`
- 添加注释说明用途
- 示例：
  ```javascript
  // config/constants.js
  /** 请求超时时间（30 秒） */
  const REQUEST_TIMEOUT = 30000
  
  // 使用时
  import constants from '../config/constants.js'
  timeout: constants.REQUEST_TIMEOUT
  ```

---

## 7. 注释规范

### 7.1 文件头注释
- 每个文件必须有文件头注释
- 包含模块名、版本、作者
- 示例：
  ```javascript
  /**
   * 清如 ClearSpring - 网络请求封装
   * @module utils/request
   * @version 1.3.0
   * @author ClearSpring Team
   */
  ```

### 7.2 函数注释
- 所有导出函数必须有 JSDoc 注释
- 包含参数说明、返回值说明
- 示例：
  ```javascript
  /**
   * 统一网络请求
   * @param {Object} options - 请求配置
   * @param {string} options.url - 请求 URL
   * @param {string} options.method - 请求方法
   * @returns {Promise} 请求结果
   */
  function request(options) {}
  ```

---

## 8. 导入导出

### 8.1 导入顺序
1. 第三方库
2. 配置文件
3. 工具函数
4. 组件

### 8.2 导出方式
- 优先使用命名导出
- 默认导出放在最后
- 示例：
  ```javascript
  export { foo, bar, baz }
  export default mainFunction
  ```

---

## 9. 检查清单

在提交代码前，请检查：

- [ ] 文件命名使用 kebab-case
- [ ] 变量使用 camelCase
- [ ] 常量使用 UPPER_SNAKE_CASE
- [ ] 函数使用 camelCase（动词开头）
- [ ] 类使用 PascalCase
- [ ] CSS 类使用 kebab-case
- [ ] 所有魔法数字已提取到 constants.js
- [ ] 所有函数有 JSDoc 注释
- [ ] 所有文件有文件头注释

---

## 10. 违规示例与修正

### 示例 1：变量命名
```javascript
// ❌ 错误
const user_info = {}
const UserInfo = {}
const MAX_COUNT = 10  // 不是常量却用大写

// ✅ 正确
const userInfo = {}
const userInfo = {}
const maxCount = 10
```

### 示例 2：函数命名
```javascript
// ❌ 错误
function get_user_info() {}
function GetUserInfo() {}

// ✅ 正确
function getUserInfo() {}
```

### 示例 3：魔法数字
```javascript
// ❌ 错误
setTimeout(() => {}, 30000)
if (count > 100) {}

// ✅ 正确
import constants from '../config/constants.js'
setTimeout(() => {}, constants.REQUEST_TIMEOUT)
if (count > constants.MAX_ERROR_LOGS) {}
```

---

**遵守命名规范，让代码更易读、更易维护！**
