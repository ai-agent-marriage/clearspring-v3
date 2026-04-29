# Vant Weapp 集成学习笔记

## 概述

Vant Weapp 是有赞前端团队开源的小程序 UI 组件库，提供了丰富的基础组件，可以帮助开发者快速构建美观的小程序界面。

## 安装步骤

### 1. 初始化 npm

```bash
cd miniprogram
npm init -y
```

### 2. 安装 Vant Weapp

```bash
npm i @vant/weapp -S --production
```

### 3. 构建 npm

在微信开发者工具中：
1. 点击「详情」
2. 勾选「使用 npm 模块」
3. 点击「工具」→「构建 npm」

## 组件使用

### 在 app.json 中配置

```json
{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index",
    "van-card": "@vant/weapp/card/index",
    "van-dialog": "@vant/weapp/dialog/index",
    "van-field": "@vant/weapp/field/index",
    "van-tag": "@vant/weapp/tag/index"
  }
}
```

### 在页面中使用

```xml
<!-- WXML -->
<van-button type="primary" bind:click="onClick">按钮</van-button>
<van-tag type="success">成功</van-tag>
```

## 主题定制

### 方式一：全局 CSS 变量

在 `app.wxss` 中定义：

```css
page {
  --van-primary-color: #4A5D4E;
  --van-radius: 8rpx;
  --van-background-color: #EFEEE9;
}
```

### 方式二：按需覆盖组件样式

```css
/* 覆盖按钮样式 */
.van-button--primary {
  background-color: #4A5D4E;
  border-color: #4A5D4E;
}
```

## 常用组件

### Button 按钮

```xml
<van-button type="primary" size="large" block>主要按钮</van-button>
<van-button type="default" size="normal">默认按钮</van-button>
<van-button type="warning" loading loading-text="加载中">加载中</van-button>
```

### Tag 标签

```xml
<van-tag type="success">成功</van-tag>
<van-tag type="danger">危险</van-tag>
<van-tag type="warning">警告</van-tag>
<van-tag plain type="primary">空心标签</van-tag>
```

### Dialog 对话框

```javascript
// 在 JS 中调用
wx.vant.Dialog.alert({
  title: '标题',
  message: '内容',
}).then(() => {
  // 关闭
});
```

### Field 输入框

```xml
<van-field
  value="{{ value }}"
  placeholder="请输入"
  bind:change="onChange"
/>
```

## 注意事项

### 1. 路径问题

- Vant Weapp 组件路径使用 `@vant/weapp/组件名/index`
- 确保 npm 构建成功，node_modules 目录存在

### 2. 样式覆盖

- 使用 CSS 变量进行主题定制
- 避免直接修改组件源码
- 使用 `!important` 谨慎

### 3. 事件绑定

- 使用 `bind:` 前缀（如 `bind:click`）
- 原生事件使用 `bind` 前缀（如 `bindtap`）

### 4. 数据传递

- 使用 `wx:for` 遍历列表
- 使用 `wx:key` 优化渲染性能
- 使用 `data-*` 传递参数

## 性能优化

### 1. 按需引入

只引入需要的组件，减少包体积：

```json
{
  "usingComponents": {
    "van-button": "@vant/weapp/button/index"
  }
}
```

### 2. 分包加载

将不常用的页面放入分包：

```json
{
  "subPackages": [
    {
      "root": "pages/sub",
      "pages": ["page1/index", "page2/index"]
    }
  ]
}
```

### 3. 图片优化

- 使用 WebP 格式
- 压缩图片大小
- 使用 CDN 加载

## 常见问题

### Q: 构建 npm 后找不到组件？

A: 检查以下几点：
1. 确认已勾选「使用 npm 模块」
2. 确认已执行「构建 npm」
3. 检查组件路径是否正确

### Q: 样式不生效？

A: 检查：
1. CSS 变量是否正确定义
2. 选择器优先级是否足够
3. 是否需要添加 `!important`

### Q: 组件不更新？

A: 尝试：
1. 重新构建 npm
2. 清除缓存
3. 重启微信开发者工具

## 参考资料

- [Vant Weapp 官方文档](https://youzan.github.io/vant-weapp/)
- [微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [GitHub 仓库](https://github.com/youzan/vant-weapp)

## 总结

Vant Weapp 是一个成熟稳定的小程序 UI 组件库，通过合理的主题定制和按需引入，可以快速构建符合设计规范的精美小程序界面。在集成过程中需要注意路径配置、样式覆盖和性能优化等问题。
