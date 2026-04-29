# wxa-plugin-canvas 海报生成集成笔记

## 概述

本文档记录微信小程序海报生成功能的集成过程，使用 `wxa-plugin-canvas` 插件实现动态海报生成。

## 插件信息

- **插件名称**: wxa-plugin-canvas
- **GitHub**: https://github.com/jasondu/wxa-plugin-canvas
- **功能**: 微信小程序 canvas 绘图，支持生成海报、分享图等

## 安装步骤

### 方式一：Git 克隆（推荐）

```bash
cd /home/admin/.openclaw/workspace/miniprogram
git clone https://github.com/jasondu/wxa-plugin-canvas.git components/painter
```

### 方式二：下载 ZIP

1. 访问 GitHub 仓库
2. 下载 ZIP 包
3. 解压到 `components/painter` 目录

## 配置步骤

### 1. app.json 配置

在全局配置中注册 painter 组件：

```json
{
  "usingComponents": {
    "painter": "/components/painter/painter"
  }
}
```

### 2. 页面中使用

在需要生成海报的页面 WXML 中添加：

```xml
<painter 
  id="painter" 
  config="{{posterConfig}}"
  style="width: {{posterConfig.width}}px; height: {{posterConfig.height}}px;"
/>
```

## 海报模板配置

### 基础结构

```javascript
const posterConfig = {
  width: 1080,    // 海报宽度
  height: 1920,   // 海报高度
  views: [        // 视图元素数组
    // 元素配置
  ]
};
```

### 支持的元素类型

#### 1. 图片 (image)

```javascript
{
  type: 'image',
  url: 'https://example.com/image.jpg',
  css: {
    top: 0,
    left: 0,
    width: 1080,
    height: 1920
  }
}
```

#### 2. 文本 (text)

```javascript
{
  type: 'text',
  text: '禅理内容',
  css: {
    top: 400,
    left: 100,
    width: 880,
    fontSize: 56,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 80,
    fontWeight: 'bold',
    fontStyle: 'italic'
  }
}
```

#### 3. 矩形 (rect)

```javascript
{
  type: 'rect',
  css: {
    top: 0,
    left: 0,
    width: 1080,
    height: 1920,
    color: 'rgba(0, 0, 0, 0.4)'
  }
}
```

#### 4. 二维码 (qrcode)

```javascript
{
  type: 'qrcode',
  content: 'https://example.com',
  css: {
    top: 1600,
    left: 440,
    width: 200,
    height: 200
  }
}
```

## 工具类封装

### poster-template.js

定义海报模板配置，支持多种场景：

- `dailyZenPoster`: 每日一禅海报
- `speciesPoster`: 物种科普海报

### poster.js

提供海报生成工具函数：

```javascript
import { generateDailyZenPoster, savePosterToAlbum } from '@/utils/poster';

// 生成海报
const posterPath = await generateDailyZenPoster(
  zenQuote,
  author,
  bgUrl,
  qrcodeContent
);

// 保存到相册
await savePosterToAlbum(posterPath);
```

## 使用示例

### 在 share 页面中使用

```javascript
// pages/zen/share.js
import { generateDailyZenPoster, savePosterToAlbum } from '@/utils/poster';

Page({
  data: {
    posterConfig: {}
  },

  async onGeneratePoster() {
    wx.showLoading({ title: '生成中...' });
    
    try {
      const { zenQuote, author, backgrounds, bgIndex } = this.data;
      const bgUrl = backgrounds[bgIndex].url;
      const qrcodeContent = 'https://example.com';

      const posterPath = await generateDailyZenPoster(
        zenQuote,
        author,
        bgUrl,
        qrcodeContent
      );

      wx.hideLoading();
      
      // 显示分享弹窗或保存图片
      this.setData({ posterPath, showShareModal: true });
    } catch (error) {
      wx.hideLoading();
      wx.showToast({
        icon: 'none',
        title: '生成失败'
      });
    }
  }
});
```

## 常见问题

### 1. 图片无法显示

**原因**: 小程序域名未配置

**解决**: 
- 在微信公众平台配置 downloadFile 合法域名
- 或使用本地图片资源

### 2. 二维码无法识别

**原因**: 二维码内容格式错误或尺寸过小

**解决**:
- 确保 content 为有效 URL
- 增大二维码尺寸（建议 200x200 以上）

### 3. 画布导出失败

**原因**: 绘制未完成就调用导出

**解决**:
- 在 `ctx.draw(true, callback)` 的回调中导出
- 添加适当延迟

### 4. 文本换行问题

**原因**: 长文本未处理换行

**解决**:
- 使用 `wrapText` 函数处理多行文本
- 设置合适的 `lineHeight`

## 性能优化

1. **图片预加载**: 提前下载背景图，避免绘制时等待
2. **模板复用**: 相同模板只配置一次，动态替换内容
3. **离屏渲染**: 将 canvas 放置在屏幕外，避免影响 UI
4. **缓存机制**: 对相同内容海报进行缓存

## 最佳实践

1. **模板分离**: 将模板配置与业务逻辑分离
2. **错误处理**: 完善的 try-catch 和用户提示
3. **权限检查**: 提前检查相册写入权限
4. **loading 提示**: 生成过程中显示加载状态

## 参考资料

- [wxa-plugin-canvas GitHub](https://github.com/jasondu/wxa-plugin-canvas)
- [微信小程序 Canvas API](https://developers.weixin.qq.com/miniprogram/dev/api/canvas/CanvasContext.html)
- [小程序图片保存指南](https://developers.weixin.qq.com/miniprogram/dev/api/media/image/wx.saveImageToPhotosAlbum.html)

---

**创建时间**: 2026-04-04  
**作者**: Agent  
**版本**: 1.0
