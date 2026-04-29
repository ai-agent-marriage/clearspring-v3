# 图标组件库 - Material Icons

## 使用说明

### 引入方式

在页面的 `.json` 文件中注册图标组件：

```json
{
  "usingComponents": {
    "icon-notification": "/components/icons/notification-icon",
    "icon-money": "/components/icons/money-icon",
    "icon-document": "/components/icons/document-icon",
    "icon-location": "/components/icons/location-icon",
    "icon-task": "/components/icons/task-icon",
    "icon-chart": "/components/icons/chart-icon",
    "icon-people": "/components/icons/people-icon",
    "icon-time": "/components/icons/time-icon",
    "icon-announcement": "/components/icons/announcement-icon",
    "icon-fish": "/components/icons/fish-icon",
    "icon-transport": "/components/icons/transport-icon",
    "icon-package": "/components/icons/package-icon",
    "icon-target": "/components/icons/target-icon",
    "icon-plant": "/components/icons/plant-icon",
    "icon-add": "/components/icons/add-icon",
    "icon-export": "/components/icons/export-icon",
    "icon-check": "/components/icons/check-icon",
    "icon-inbox": "/components/icons/inbox-icon"
  }
}
```

### 使用示例

```xml
<!-- 基础用法 -->
<icon-notification />

<!-- 带尺寸 -->
<icon-notification size="small" />
<icon-notification size="medium" />
<icon-notification size="large" />

<!-- 带颜色 -->
<icon-notification color="gold" />
<icon-notification color="green" />
<icon-notification color="warning" />
<icon-notification color="error" />

<!-- 自定义类名 -->
<icon-notification customClass="my-custom-class" />
```

### 属性说明

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| size | String | 'medium' | 图标尺寸：small/medium/large |
| color | String | 'default' | 图标颜色：default/gold/green/warning/error |
| customClass | String | '' | 自定义 CSS 类名 |

## 图标列表

| 组件名 | 用途 | 替代 Emoji |
|--------|------|-----------|
| icon-notification | 通知 | 🔔 |
| icon-money | 金钱/收入 | 💰 |
| icon-document | 文档/报表 | 📄📑 |
| icon-location | 位置 | 📍 |
| icon-task | 任务/清单 | 📋 |
| icon-chart | 统计/图表 | 📊 |
| icon-people | 用户/团队 | 👥 |
| icon-time | 时间 | ⏰ |
| icon-announcement | 公告 | 📢 |
| icon-fish | 鱼类/物种 | 🐟 |
| icon-transport | 交通 | 🚗 |
| icon-package | 包裹/物料 | 📦 |
| icon-target | 目标 | 🎯 |
| icon-plant | 植物/护生 | 🌿 |
| icon-add | 添加 | ➕ |
| icon-export | 导出 | 📥 |
| icon-check | 成功/完成 | ✅ |
| icon-inbox | 空状态 | 📭 |

## 样式文件

所有图标共享 `/components/icons/icons.wxss` 样式文件。

确保在 `app.wxss` 中引入：

```css
@import "./components/icons/icons.wxss";
```

## 设计规范

- 所有图标采用 Material Design 风格
- 使用 SVG 矢量图形，支持任意缩放
- 颜色通过 CSS 变量控制，支持主题切换
- 尺寸系统：small(20rpx), medium(24rpx), large(40rpx)
