# 小程序公共组件和工具函数

本目录包含符合 Stitch V3.0 规范的自定义组件和工具函数。

## 📁 目录结构

```
/workspace
├── custom-tab-bar/        # 自定义 TabBar 组件
│   ├── index.wxml
│   ├── index.wxss
│   ├── index.js
│   └── index.json
├── components/            # 公共组件
│   ├── card/             # 卡片组件
│   ├── button/           # 按钮组件
│   └── navbar/           # 导航栏组件
└── utils/
    └── app-util.js       # 全局工具函数
```

## 🎯 组件说明

### 1. 自定义 TabBar (`/custom-tab-bar/`)

**特点：**
- 3 个导航项：梵音/禅理/我的
- 背景色：#EFEEE9
- 选中色：#4A5D4E
- 未选中：#718096
- 高度：112rpx
- z-index: 1000

**使用方式：**
在 `app.json` 中配置：
```json
{
  "tabBar": {
    "custom": true,
    "list": [...]
  }
}
```

在 TabBar 页面中调用：
```javascript
this.getTabBar().setCurrent(0); // 设置选中项
```

---

### 2. 卡片组件 (`/components/card/`)

**属性：**
- `title`: 卡片标题
- `subtitle`: 副标题
- `variant`: 变体 (default, borderless, shadow-lg, compact)
- `customClass`: 自定义类名
- `customStyle`: 自定义样式

**插槽：**
- `header`: 头部自定义内容
- `default`: 内容区域
- `footer`: 底部自定义内容

**使用示例：**
```xml
<card title="标题" subtitle="副标题" variant="shadow-lg">
  <text>卡片内容</text>
</card>
```

---

### 3. 按钮组件 (`/components/button/`)

**属性：**
- `text`: 按钮文字
- `type`: 类型 (primary, success, warning, danger, default, ghost, text)
- `size`: 尺寸 (small, medium, large)
- `shape`: 形状 (default, round, square)
- `icon`: 图标
- `disabled`: 禁用状态
- `loading`: 加载状态
- `block`: 块级按钮

**事件：**
- `bindtap`: 点击事件

**使用示例：**
```xml
<button type="primary" size="large" shape="round" bindtap="onSubmit">
  提交
</button>
```

---

### 4. 导航栏组件 (`/components/navbar/`)

**属性：**
- `title`: 标题
- `showBack`: 显示返回按钮
- `backText`: 返回文字
- `rightText`: 右侧文字
- `border`: 显示底部边框
- `variant`: 变体 (default, dark, transparent)

**插槽：**
- `left`: 左侧自定义内容
- `center`: 中间自定义内容
- `right`: 右侧自定义内容

**事件：**
- `bindlefttap`: 左侧点击
- `bindtitletap`: 标题点击
- `bindrighttap`: 右侧点击

**使用示例：**
```xml
<navbar title="页面标题" showBack="{{true}}" bindrighttap="onRightTap">
  <view slot="right">完成</view>
</navbar>
```

---

## 🛠️ 工具函数 (`/utils/app-util.js`)

### 日期格式化
```javascript
const { formatDate } = require('../../utils/app-util');
formatDate(new Date(), 'YYYY-MM-DD'); // "2026-04-14"
```

### 农历转换
```javascript
const { formatLunar } = require('../../utils/app-util');
formatLunar(new Date()); // { year: '丙午', month: '三月', day: '初七', full: '...' }
```

### 加载提示
```javascript
const { showLoading, showToast } = require('../../utils/app-util');
showLoading('加载中...');
// 业务逻辑...
wx.hideLoading();
showToast('操作成功');
```

### 错误提示
```javascript
const { showError } = require('../../utils/app-util');
showError('网络错误');
```

### 操作菜单
```javascript
const { showActionSheet } = require('../../utils/app-util');
showActionSheet(['编辑', '删除'], (res) => {
  if (res.index === 0) {
    // 编辑操作
  }
});
```

### 防抖函数
```javascript
const { debounce } = require('../../utils/app-util');
const searchHandler = debounce((keyword) => {
  // 搜索逻辑
}, 500);
```

### 节流函数
```javascript
const { throttle } = require('../../utils/app-util');
const scrollHandler = throttle(() => {
  // 滚动处理
}, 200);
```

### 深拷贝
```javascript
const { deepClone } = require('../../utils/app-util');
const newObj = deepClone(oldObj);
```

### 格式化数字
```javascript
const { formatNumber } = require('../../utils/app-util');
formatNumber(1234567.89); // "1,234,567.89"
```

---

## 📋 使用指南

### 1. 全局注册组件

在 `app.json` 中配置：
```json
{
  "usingComponents": {
    "card": "/components/card/index",
    "button": "/components/button/index",
    "navbar": "/components/navbar/index"
  }
}
```

### 2. 页面级注册

在页面的 `.json` 文件中配置：
```json
{
  "usingComponents": {
    "card": "/components/card/index",
    "button": "/components/button/index"
  }
}
```

### 3. 引入工具函数

在页面或组件中：
```javascript
const appUtil = require('../../utils/app-util');

// 使用
appUtil.showLoading();
appUtil.formatDate(new Date());
```

---

## 🎨 设计规范

所有组件遵循 Stitch V3.0 设计规范：

- **颜色体系：**
  - 主色：#4A5D4E
  - 背景色：#EFEEE9
  - 文字色：#718096, #1a202c
  
- **圆角：** 12rpx - 16rpx
- **阴影：** 0 2rpx 12rpx rgba(0, 0, 0, 0.08)
- **动画：** transition 0.3s ease
- **间距：** 24rpx, 32rpx, 40rpx

---

## 📝 更新日志

- **2026-04-14:** 初始版本，包含 TabBar、Card、Button、Navbar 组件和工具函数库
