# 懒加载图片组件 (Lazy Image)

支持懒加载、占位图、加载动画和错误处理的图片组件。

## 使用场景

- 所有图片展示场景
- 头像列表
- 商品图片
- 相册预览

## 属性

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| src | String | '' | 图片 URL |
| mode | String | 'aspectFill' | 图片裁剪模式 |
| className | String | '' | 自定义类名 |
| placeholderType | String | 'default' | 占位图类型（avatar/image/default） |
| showAnimation | Boolean | true | 是否显示加载动画 |
| borderRadius | String | '8px' | 圆角 |

## 事件

| 事件 | 说明 | 回调参数 |
|------|------|----------|
| bind:load | 图片加载成功 | {detail} |
| bind:error | 图片加载失败 | {detail} |
| bind:tap | 点击图片 | {src} |

## 使用方法

### 1. 在页面 JSON 中引入组件

```json
{
  "usingComponents": {
    "lazy-image": "/components/lazy-image/lazy-image"
  }
}
```

### 2. 在 WXML 中使用

```xml
<!-- 基础用法 -->
<lazy-image src="{{imageUrl}}" mode="aspectFill" />

<!-- 头像模式 -->
<lazy-image 
  src="{{avatarUrl}}" 
  placeholder-type="avatar"
  border-radius="50%"
/>

<!-- 自定义样式 -->
<lazy-image 
  src="{{productImage}}" 
  class-name="product-img"
  show-animation="{{true}}"
/>

<!-- 监听事件 -->
<lazy-image 
  src="{{imageUrl}}" 
  bind:load="onImageLoad"
  bind:error="onImageError"
  bind:tap="onImageTap"
/>
```

## 性能优势

1. **懒加载**：图片进入可视区域才加载
2. **占位图**：避免加载时的空白闪烁
3. **加载动画**：提升用户体验
4. **错误处理**：加载失败时显示友好提示
5. **渐变效果**：图片加载完成时平滑过渡

## 占位图类型

- **default**: 默认灰色渐变
- **avatar**: 橙黄色渐变（适合头像）
- **image**: 彩色渐变（适合普通图片）

## 最佳实践

1. 所有图片都应该使用懒加载
2. 根据场景选择合适的占位图类型
3. 头像使用圆形占位图
4. 商品图片使用矩形占位图
