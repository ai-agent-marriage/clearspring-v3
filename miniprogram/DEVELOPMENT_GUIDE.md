# ClearSpring V3 小程序开发指南

**创建时间**: 2026-04-05  
**项目版本**: 3.0.0  
**AppID**: wxa914ecc15836bda6

---

## 📁 项目结构

```
miniprogram/
├── pages/              # 页面目录
│   ├── index/         # 首页
│   ├── service/       # 服务页
│   ├── order/         # 订单页
│   ├── profile/       # 个人中心
│   └── ...
├── components/         # 自定义组件
├── utils/             # 工具函数
├── assets/            # 静态资源
├── styles/            # 全局样式
├── app.js             # 小程序入口
├── app.json           # 全局配置
└── package.json       # 依赖配置
```

---

## 🚀 快速开始

### 1. 开发环境准备

```bash
# 安装依赖
cd miniprogram
npm install

# 运行测试
npm test

# 代码检查
npm run lint
```

### 2. 微信开发者工具

1. 下载：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html
2. 导入项目：选择 `miniprogram/` 目录
3. 配置 AppID：`wxa914ecc15836bda6`
4. 开始开发

---

## 📝 开发规范

### 代码风格

- ✅ 使用 ESLint + Prettier
- ✅ 遵循微信小程序开发规范
- ✅ 组件化开发
- ✅ 使用 CSS 变量（禁止硬编码色值）

### 提交规范

```bash
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式
refactor: 重构
test: 测试
chore: 构建/工具
```

示例：
```bash
git commit -m "feat: 添加订单列表页面"
```

---

## 🎨 设计规范

### 配色系统

```css
/* 祈福者端 */
--bg-color: #EFEEE9;      /* 宣纸底 */
--primary-color: #D4B87B; /* 禅意金 */

/* 执行者端 */
--executor-bg: #4A5D4E;   /* 岱绿 */
--executor-primary: #334537;

/* 管理端 */
--admin-bg: #FFFFFF;      /* 纯白 */
--admin-primary: #4A5D4E; /* 岱绿 */
```

### UI 规范

- ✅ 组件圆角统一 24rpx
- ✅ 按钮热区≥88rpx
- ✅ 禁止 1px 实线边框
- ✅ 液态玻璃效果（70% 透明度 + backdrop-blur）
- ✅ 敏感信息脱敏显示

---

## 🔧 常用命令

### 开发

```bash
# 安装依赖
npm install

# 开发环境
npm run dev

# 生产构建
npm run build
```

### 测试

```bash
# 运行测试
npm test

# 代码检查
npm run lint

# 格式化代码
npm run format
```

---

## 📦 页面开发模板

### 新建页面

```bash
# 创建页面目录
mkdir -p pages/new-page

# 创建页面文件
touch pages/new-page/new-page.js
touch pages/new-page/new-page.wxml
touch pages/new-page/new-page.wxss
touch pages/new-page/new-page.json
```

### 页面配置

**pages/new-page/new-page.json**:
```json
{
  "navigationBarTitleText": "新页面",
  "usingComponents": {}
}
```

**pages/new-page/new-page.js**:
```javascript
Page({
  data: {
    // 页面数据
  },
  
  onLoad(options) {
    // 页面加载
  },
  
  onReady() {
    // 页面初次渲染完成
  },
  
  onShow() {
    // 页面显示
  },
  
  // 自定义方法
})
```

---

## 🧩 组件开发

### 创建组件

```javascript
// components/my-component/my-component.js
Component({
  properties: {
    // 外部传入的属性
    title: {
      type: String,
      value: ''
    }
  },
  
  data: {
    // 组件内部数据
  },
  
  methods: {
    // 组件方法
  }
})
```

---

## 📊 数据管理

### 云开发

```javascript
// 初始化云开发
wx.cloud.init({
  env: 'cloud1-7ga68ls3ccebbe5b'
})

// 调用云函数
wx.cloud.callFunction({
  name: 'login',
  data: {}
})
```

### 本地存储

```javascript
// 存储数据
wx.setStorageSync('key', 'value')

// 读取数据
const value = wx.getStorageSync('key')
```

---

## 🚀 部署流程

### 自动部署

```bash
# 开发完成后
git add .
git commit -m "feat: 新功能"
git push origin main

# 自动触发 CI/CD
# 1. 代码质量检查
# 2. 小程序构建
# 3. 后端部署
# 4. 飞书通知
```

### 手动部署

1. 微信开发者工具 → 上传代码
2. 登录微信公众平台
3. 提交审核
4. 发布上线

---

## 📱 页面列表

### 祈福者端（7 个页面）

- ✅ 首页 (index)
- ✅ 服务页 (service)
- ✅ 订单页 (order)
- ✅ 个人中心 (profile)
- ✅ 功德林 (merit-forest)
- ✅ 科普百科 (wiki)
- ✅ 设置页 (settings)

### 执行者端（9 个页面）

- ✅ 资质审核 (executor-qualification)
- ✅ 审核状态 (executor-status)
- ✅ 执行者首页 (executor-home)
- ✅ 抢单大厅 (executor-order-hall)
- ✅ 任务助手 (executor-assistant)
- ✅ 原生拍摄 (executor-camera)
- ✅ 证据提交 (executor-evidence)
- ✅ 收入管理 (executor-income)
- ✅ 个人中心 (executor-profile)

### 管理端（11 个页面）

- ✅ PC 管理后台（9 个页面）
- ✅ 移动应急 H5（2 个页面）

---

## 🔗 相关文档

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [ColorUI 组件库](https://github.com/weilanwl/ColorUI)
- [Vant Weapp 组件库](https://youzan.github.io/vant-weapp/)

---

**最后更新**: 2026-04-05  
**维护者**: ClearSpring V3 Team
