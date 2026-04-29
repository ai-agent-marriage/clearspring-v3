# 清如 ClearSpring V2.0 - 代码规范

**文档版本**: V1.0  
**创建时间**: 2026-04-16  
**适用范围**: 小程序端、WEB 后台、后端 API

---

## 📝 目录命名规范

### 目录结构
```
✅ 正确：
miniprogram/pages/audio-player/
admin-vue3/src/components/UserCard/
api/src/controllers/

❌ 错误：
miniprogram/pages/AudioPlayer/        # 禁止大驼峰
miniprogram/pages/audio_player/       # 禁止下划线
miniprogram/pages/q-04-audio-player/  # 禁止设计稿编号命名
```

### 命名原则
- ✅ **功能命名**: 使用功能名称（如 `audio-player/`）
- ✅ **全项目统一**: 所有目录使用小写 + 连字符
- ❌ **禁止混用**: 不允许功能命名与设计稿编号混用

---

## 📄 文件命名规范

### JavaScript/TypeScript 文件

```javascript
// ✅ 正确：
userService.js          // 服务层（小驼峰）
userController.js       // 控制器（小驼峰）
UserCard.vue            // Vue 组件（大驼峰）
util.js                 // 工具函数（小写）
app.config.js           // 配置文件（小写）

// ❌ 错误：
UserService.js          // 服务层不应大驼峰
user-service.js         // 禁止连字符
USER.js                 // 禁止全大写
```

### 样式文件

```css
/* ✅ 正确： */
variables.wxss          // 变量文件（小写）
theme.wxss              // 主题文件（小写）
global.scss             // 全局样式（小写）

/* ❌ 错误： */
Variables.wxss          // 禁止大写
```

### 页面文件（小程序）

```
// ✅ 正确：
pages/
  audio-player/
    audio-player.js
    audio-player.json
    audio-player.wxml
    audio-player.wxss

// ❌ 错误：
pages/
  audio-player/
    index.js            // 文件名应与目录名一致
    Index.wxml          // 禁止大写
```

---

## 💻 代码格式规范

### 缩进与空格

```javascript
// ✅ 正确：2 空格缩进
function getUserInfo() {
  const user = {
    name: '张三',
    age: 25
  };
  return user;
}

// ❌ 错误：Tab 缩进
function getUserInfo() {
	const user = {    // Tab 缩进
		name: '张三'
	};
}
```

### 行尾与分号

```javascript
// ✅ 正确：使用分号
const name = '张三';
const age = 25;

// ❌ 错误：缺少分号
const name = '张三'  // 缺少分号
const age = 25
```

### 行尾换行符

```
// ✅ 正确：LF (\n)
// 所有文件统一使用 LF 换行符

// ❌ 错误：CRLF (\r\n)
// Windows 系统默认 CRLF，需转换为 LF
```

**VSCode 配置**:
```json
{
  "files.eol": "\n",
  "editor.insertSpaces": true,
  "editor.tabSize": 2,
  "editor.formatOnSave": true
}
```

---

## 🔤 变量与常量命名

### 变量命名

```javascript
// ✅ 正确：
let userName = '张三';      // 小驼峰
const MAX_COUNT = 100;      // 常量（全大写 + 下划线）
let $element = null;        // DOM 元素（$ 前缀）
let user_ = null;           // 私有变量（_ 后缀）

// ❌ 错误：
let UserName = '张三';      // 禁止大驼峰
let max_count = 100;        // 常量应全大写
let userName1 = '李四';     // 禁止数字后缀
```

### 函数命名

```javascript
// ✅ 正确：
function getUserInfo() {}        // 普通函数（小驼峰）
function calculateTotalPrice() {} // 动词 + 名词
const handleClick = () => {}     // 事件处理（handle + 事件）
const fetchData = async () => {} // 异步函数（动词 + 数据）

// ❌ 错误：
function getUserInfo() {}        // 正确
function userInfo() {}           // 缺少动词
function USER_INFO() {}          // 禁止全大写
```

### 类命名

```javascript
// ✅ 正确：
class UserService {}             // 大驼峰
class AudioPlayer {}             // 大驼峰

// ❌ 错误：
class userService {}             // 禁止小驼峰
class USER_SERVICE {}            // 禁止全大写
```

---

## 🎨 样式规范（Stitch 设计系统）

### CSS 变量定义

```css
/* ✅ 正确： */
/* file: styles/variables.wxss */
page {
  /* 主色 */
  --color-primary: #4A5D4E;      /* 岱绿 */
  --color-primary-light: #5A6D5E;
  --color-primary-dark: #3A4D3E;
  
  /* 辅助色 */
  --color-secondary: #C9B037;    /* 哑光金 */
  --color-tertiary: #A68966;     /* 暖棕褐 */
  
  /* 中性色 */
  --color-bg: #EFEEE9;           /* 宣纸底 */
  --color-text: #2D3748;         /* 文本主色 */
  --color-text-secondary: #718096;
  
  /* 圆角 */
  --border-radius-sm: 4rpx;
  --border-radius-md: 8rpx;
  --border-radius-lg: 24rpx;
  
  /* 间距 */
  --spacing-xs: 8rpx;
  --spacing-sm: 16rpx;
  --spacing-md: 24rpx;
  --spacing-lg: 32rpx;
}

/* ❌ 错误： */
page {
  --color-primary: green;        // 禁止使用颜色名
  --border-radius: 10px;         // 禁止硬编码数值
}
```

### 类名命名

```css
/* ✅ 正确：BEM 命名 */
.audio-card {}                   /* Block */
.audio-card__title {}            /* Element */
.audio-card--active {}           /* Modifier */

/* ❌ 错误： */
.audioCard {}                    // 禁止驼峰
.audio_card {}                   // 禁止下划线
.active {}                       // 禁止无上下文修饰符
```

### 样式书写顺序

```css
/* ✅ 正确：按属性分组 */
.audio-card {
  /* 定位 */
  position: relative;
  z-index: 1;
  
  /* 盒模型 */
  display: flex;
  width: 100%;
  padding: 24rpx;
  margin: 16rpx 0;
  
  /* 外观 */
  background-color: #FFFFFF;
  border-radius: 8rpx;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  
  /* 文本 */
  font-size: 28rpx;
  color: #2D3748;
  line-height: 1.5;
}

/* ❌ 错误：属性顺序混乱 */
.audio-card {
  color: #2D3748;
  position: relative;
  background-color: #FFFFFF;
  display: flex;
}
```

---

## 📦 组件规范

### 小程序组件

```javascript
// ✅ 正确：
// file: components/audio-card/index.js
Component({
  properties: {
    audioInfo: {
      type: Object,
      value: null
    },
    playCount: {
      type: Number,
      value: 0
    }
  },
  
  data: {
    isPlaying: false
  },
  
  methods: {
    handlePlay() {
      this.setData({ isPlaying: true });
      this.triggerEvent('play', this.data.audioInfo);
    }
  }
});

// ❌ 错误：
Component({
  properties: {
    audioinfo: Object,  // 命名不规范
    playcount: Number   // 命名不规范
  },
  // 缺少默认值
})
```

### Vue 3 组件

```vue
<!-- ✅ 正确： -->
<!-- file: src/components/UserCard.vue -->
<template>
  <div class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  user: {
    type: Object,
    required: true,
    validator: (value) => {
      return 'name' in value && 'email' in value;
    }
  }
});

const emit = defineEmits(['click', 'delete']);

const handleClick = () => {
  emit('click', props.user);
};
</script>

<style scoped>
.user-card {
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
}
</style>

<!-- ❌ 错误： -->
<template>
  <div class="userCard">  <!-- 类名驼峰 -->
    <h3>{{ user.userName }}</h3>
  </div>
</template>

<script>
export default {
  props: ['user']  // 缺少类型定义
}
</script>
```

---

## 🔌 API 接口规范

### 请求格式

```javascript
// ✅ 正确：
// file: services/user.js
import { request } from '../utils/request';

export async function getUserInfo(userId) {
  return request({
    url: '/api/users/${userId}',
    method: 'GET',
  });
}

export async function updateUserProfile(data) {
  return request({
    url: '/api/users/profile',
    method: 'PUT',
    data,
  });
}

// ❌ 错误：
export async function getUserInfo(userId) {
  return wx.request({  // 禁止直接使用 wx.request
    url: '/api/users/' + userId,  // 禁止字符串拼接
  });
}
```

### 响应格式

```javascript
// ✅ 正确：统一响应格式
{
  "code": 200,
  "message": "success",
  "data": {
    "userId": "123",
    "userName": "张三"
  },
  "timestamp": 1713268800000
}

// ❌ 错误：
{
  "status": "ok",  // 不统一的状态码
  "result": {...}  // 不统一的数据字段
}
```

### 错误处理

```javascript
// ✅ 正确：
try {
  const userInfo = await getUserInfo(userId);
} catch (error) {
  if (error.code === 401) {
    // 未授权，跳转登录
    wx.navigateTo({ url: '/pages/login/login' });
  } else if (error.code === 404) {
    // 资源不存在
    wx.showToast({ title: '用户不存在', icon: 'none' });
  } else {
    // 其他错误
    console.error('获取用户信息失败:', error);
    wx.showToast({ title: '网络异常', icon: 'none' });
  }
}

// ❌ 错误：
try {
  const userInfo = await getUserInfo(userId);
} catch (error) {
  console.log(error);  // 仅打印日志，无用户提示
}
```

---

## 🧪 测试规范

### 单元测试

```javascript
// ✅ 正确：
// file: tests/unit/utils/format.test.js
import { describe, it, expect } from 'vitest';
import { formatDate } from '../../../utils/format';

describe('formatDate', () => {
  it('应正确格式化日期', () => {
    const date = new Date('2026-04-16');
    expect(formatDate(date)).toBe('2026-04-16');
  });

  it('应处理无效日期', () => {
    expect(() => formatDate(null)).toThrow('Invalid date');
  });
});

// ❌ 错误：
it('test formatDate', () => {  // 测试用例描述不清晰
  const result = formatDate(new Date());
  console.log(result);  // 无断言
});
```

### E2E 测试

```javascript
// ✅ 正确：
// file: tests/e2e/audio.spec.js
import { test, expect } from '@playwright/test';

test.describe('音频播放功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('应能正常播放音频', async ({ page }) => {
    await page.click('.audio-card:nth-child(1)');
    await expect(page.locator('.audio-player')).toBeVisible();
    await expect(page.locator('.play-button')).toHaveAttribute('data-state', 'playing');
  });

  test('应显示收听次数', async ({ page }) => {
    const countBadge = page.locator('.count-badge');
    const count = await countBadge.textContent();
    expect(parseInt(count)).toBeGreaterThanOrEqual(0);
  });
});

// ❌ 错误：
test('test audio', async ({ page }) => {  // 测试描述不清晰
  await page.click('.audio-card');
  // 无断言
});
```

---

## 📝 Git 提交规范

### Commit Message 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type 类型

```
feat:     新功能
fix:      Bug 修复
docs:     文档更新
style:    代码格式（不影响代码运行）
refactor: 重构（既不是新功能也不是 bug 修复）
test:     测试相关
chore:    构建过程或辅助工具变动
```

### 提交示例

```bash
# ✅ 正确：
feat(audio): 添加音频后台播放功能
- 实现 wx.createInnerAudioContext 后台播放
- 添加锁屏控制支持
- 优化播放状态记忆

fix(order): 修复订单状态同步问题
- 修复云函数与 MySQL 数据不一致
- 添加数据同步重试机制

docs: 更新开发环境配置指南
- 添加 Node.js 18 安装说明
- 补充微信开发者工具配置

# ❌ 错误：
更新代码                    # 描述不清晰
fix bug                     # 缺少 scope
添加新功能                  # 缺少 type
```

### Git 工作流

```bash
# 分支命名
main          # 主分支（生产环境）
dev           # 开发分支
feature/xxx   # 功能分支
fix/xxx       # 修复分支
release/v1.0  # 发布分支

# 提交流程
git checkout dev
git checkout -b feature/audio-player

# 开发完成后
git add .
git commit -m "feat(audio): 添加音频播放功能"
git push origin feature/audio-player

# 创建 Pull Request
# Code Review 通过后合并到 dev
```

---

## 🔒 安全规范

### 敏感信息处理

```javascript
// ✅ 正确：
// 使用环境变量
const appId = process.env.WECHAT_APPID;
const apiSecret = process.env.API_SECRET;

// ❌ 错误：
// 硬编码敏感信息
const appId = 'wxa914ecc15836bda6';
const apiSecret = 'sk_xxxxxxxxxxxx';
```

### 用户输入验证

```javascript
// ✅ 正确：
function validateOrderData(data) {
  if (!data.species || !data.quantity) {
    throw new Error('物种和数量为必填项');
  }
  
  if (data.quantity <= 0 || data.quantity > 10000) {
    throw new Error('数量必须在 1-10000 之间');
  }
  
  return true;
}

// ❌ 错误：
function createOrder(data) {
  // 无验证直接使用
  db.insert('orders', data);
}
```

### SQL 注入防护

```javascript
// ✅ 正确：参数化查询
const userId = req.params.id;
const user = await db.query(
  'SELECT * FROM users WHERE id = ?',
  [userId]
);

// ❌ 错误：字符串拼接
const userId = req.params.id;
const user = await db.query(
  `SELECT * FROM users WHERE id = ${userId}`  // SQL 注入风险
);
```

---

## 📊 代码审查清单

### 小程序端

- [ ] 页面文件完整（.js/.json/.wxml/.wxss）
- [ ] app.json 已声明所有页面
- [ ] 使用 CSS 变量（Stitch 设计系统）
- [ ] 图片使用 webp 格式
- [ ] 无 console.log（生产环境）
- [ ] 错误处理完善
- [ ] 无硬编码 AppID/Secret

### WEB 后台

- [ ] 使用 Vue 3 Composition API
- [ ] 组件使用 `<script setup>`
- [ ] Props 有类型定义和默认值
- [ ] 使用 Pinia 状态管理
- [ ] API 请求统一封装
- [ ] 样式使用 SCSS 变量

### 后端 API

- [ ] 使用 MVC 架构
- [ ] 错误统一处理
- [ ] 日志记录完整
- [ ] 参数验证完善
- [ ] 无 SQL 注入风险
- [ ] 敏感信息使用环境变量

---

## 🛠️ 自动化工具

### ESLint 配置

```javascript
// file: .eslintrc.js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
    'indent': ['error', 2],
  },
};
```

### Prettier 配置

```json
// file: .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "endOfLine": "lf"
}
```

### 提交前检查

```bash
# file: package.json
{
  "scripts": {
    "lint": "eslint . --ext .js,.vue",
    "format": "prettier --write .",
    "test": "vitest",
    "precommit": "lint-staged"
  },
  "lint-staged": {
    "*.{js,vue}": ["eslint --fix", "prettier --write"],
    "*.{css,scss,wxss}": ["prettier --write"]
  }
}
```

---

## 📚 参考资源

### 官方文档
- [微信小程序代码规范](https://developers.weixin.qq.com/miniprogram/dev/framework/custom-component/)
- [Vue 3 风格指南](https://vuejs.org/style-guide/)
- [Element Plus 代码规范](https://element-plus.org/)
- [Airbnb JavaScript 风格指南](https://github.com/airbnb/javascript)

### 项目文档
- 技术选型：`docs/TECH_STACK.md`
- 项目结构：`docs/PROJECT_STRUCTURE.md`
- 开发环境：`docs/SETUP_GUIDE.md`

---

*文档创建时间*: 2026-04-16 10:57 UTC  
*最后更新*: 2026-04-16 10:57 UTC
