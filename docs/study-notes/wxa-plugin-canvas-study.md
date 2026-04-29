# wxa-plugin-canvas 海报生成学习笔记

## 1. 项目概览

**项目地址**: https://github.com/jasondu/wxa-plugin-canvas

**核心功能**: 小程序海报组件，用于生成朋友圈分享海报并生成图片

**许可证**: MIT

**npm 包名**: wxa-plugin-canvas

**适用场景**: 
- 朋友圈分享海报生成
- 商品推广海报
- 活动宣传图片
- 二维码海报
- 用户专属海报

---

## 2. 安装配置步骤

### 2.1 通过 npm 安装（推荐）

```bash
# 安装
npm i wxa-plugin-canvas -S --production

# 或通过 yarn 安装
yarn add wxa-plugin-canvas --production
```

### 2.2 通过 Git 下载

```bash
git clone https://github.com/jasondu/wxa-plugin-canvas.git
# 将 miniprogram_dist 目录拷贝到项目组件目录
```

### 2.3 引入组件

在页面的 json 文件中配置：

```json
{
  "usingComponents": {
    "poster": "wxa-plugin-canvas/poster"
  }
}
```

### 2.4 域名配置

**重要**: 图片的域名必须添加到 downloadFile 合法域名中

路径：微信开发者工具 → 详情 → 本地设置 → 服务器域名 → downloadFile 合法域名

---

## 3. Painter 组件配置

### 3.1 基础用法

```xml
<!-- wxml -->
<poster
  id="poster"
  config="{{posterConfig}}"
  bind:success="onPosterSuccess"
  bind:fail="onPosterFail"
>
  <button type="primary" bind:tap="onCreatePoster">点击生成海报</button>
</poster>
```

```javascript
// js
Page({
  data: {
    posterConfig: {
      width: 750,
      height: 1334,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: 2,
      blocks: [],
      texts: [],
      images: [],
      lines: []
    }
  },

  onCreatePoster() {
    this.setData({ posterConfig: this.getPosterConfig() });
  },

  getPosterConfig() {
    return {
      width: 750,
      height: 1334,
      backgroundColor: '#fff',
      debug: false,
      pixelRatio: 2,
      blocks: [],
      texts: [],
      images: [],
      lines: []
    };
  },

  onPosterSuccess(e) {
    const { detail } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    });
  },

  onPosterFail(e) {
    console.log('生成失败', e);
    wx.showToast({ title: '生成失败', icon: 'none' });
  }
});
```

### 3.2 完整配置示例

```javascript
// 完整海报配置
const posterConfig = {
  width: 750,              // 画布宽度 (rpx)
  height: 1334,            // 画布高度 (rpx)
  backgroundColor: '#fff', // 画布背景色
  debug: false,            // 是否显示 canvas 调试
  pixelRatio: 2,           // 清晰度倍率
  preload: true,           // 预下载图片
  hideLoading: false,      // 隐藏 loading
  
  // 背景块
  blocks: [
    {
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      backgroundColor: '#f5f5f5',
      borderRadius: 0,
      zIndex: 1
    }
  ],
  
  // 文字
  texts: [
    {
      x: 50,
      y: 100,
      text: '海报标题',
      fontSize: 48,
      color: '#333',
      fontWeight: 'bold',
      zIndex: 10
    }
  ],
  
  // 图片
  images: [
    {
      x: 50,
      y: 200,
      url: 'https://example.com/image.jpg',
      width: 650,
      height: 400,
      borderRadius: 8,
      zIndex: 5
    }
  ],
  
  // 线条
  lines: [
    {
      startX: 50,
      startY: 650,
      endX: 700,
      endY: 650,
      width: 2,
      color: '#ddd',
      zIndex: 3
    }
  ]
};
```

---

## 4. Template 格式详解

### 4.1 Blocks（块）配置

块用于创建背景区域、卡片等容器：

```javascript
blocks: [
  {
    x: 50,              // 必填：块左上角 x 坐标 (rpx)
    y: 100,             // 必填：块左上角 y 坐标 (rpx)
    width: 650,         // 可选：块宽度
    height: 200,        // 必填：块高度
    paddingLeft: 20,    // 可选：内左边距
    paddingRight: 20,   // 可选：内右边距
    borderWidth: 2,     // 可选：边框宽度
    borderColor: '#333',// 可选：边框颜色
    backgroundColor: '#fff', // 可选：背景色
    borderRadius: 12,   // 可选：圆角
    zIndex: 1,          // 可选：层级
    text: {             // 可选：块内文字
      text: '块内文字',
      fontSize: 28,
      color: '#666'
    }
  }
]
```

### 4.2 Texts（文字）配置

```javascript
texts: [
  {
    x: 50,              // 必填：文字 x 坐标
    y: 100,             // 必填：文字 y 坐标
    text: '文字内容',    // 必填：文字内容
    fontSize: 32,       // 必填：文字大小 (rpx)
    color: '#333',      // 可选：文字颜色
    opacity: 1,         // 可选：透明度 (0-1)
    lineHeight: 40,     // 可选：行高
    lineNum: 2,         // 可选：最大行数（超出省略）
    width: 600,         // 可选：文字宽度（用于换行）
    marginLeft: 10,     // 可选：多行文字左间距
    marginRight: 10,    // 可选：多行文字右间距
    textDecoration: 'none', // 可选：text-decoration
    baseLine: 'top',    // 可选：基线对齐 top|middle|bottom
    textAlign: 'left',  // 可选：对齐方式 left|center|right
    zIndex: 10,         // 可选：层级
    fontFamily: 'sans-serif', // 可选：字体
    fontWeight: 'normal',     // 可选：字体粗细
    fontStyle: 'normal'       // 可选：字体样式
  }
]
```

**文字对象格式**（支持多行文字间距控制）：

```javascript
texts: [
  {
    x: 50,
    y: 100,
    text: {
      text: '这是一段很长的文字，需要换行显示',
      fontSize: 28,
      color: '#666',
      marginLeft: 20,
      marginRight: 20
    },
    width: 650,
    lineNum: 3
  }
]
```

### 4.3 Images（图片）配置

```javascript
images: [
  {
    x: 50,              // 必填：图片右上角 x 坐标
    y: 200,             // 必填：图片右上角 y 坐标
    url: 'https://example.com/image.jpg', // 必填：图片 URL
    width: 300,         // 必填：图片宽度
    height: 300,        // 必填：图片高度
    borderRadius: 8,    // 可选：圆角
    borderWidth: 2,     // 可选：边框宽度
    borderColor: '#333',// 可选：边框颜色
    zIndex: 5           // 可选：层级
  }
]
```

**支持本地图片**:

```javascript
images: [
  {
    x: 50,
    y: 200,
    url: '/images/local.png', // 本地图片路径
    width: 300,
    height: 300
  }
]
```

### 4.4 Lines（线条）配置

```javascript
lines: [
  {
    startX: 50,         // 必填：起始 x 坐标
    startY: 100,        // 必填：起始 y 坐标
    endX: 700,          // 必填：结束 x 坐标
    endY: 100,          // 必填：结束 y 坐标
    width: 2,           // 必填：线条宽度
    color: '#333',      // 可选：线条颜色
    zIndex: 3           // 可选：层级
  }
]
```

---

## 5. 文字/图片/二维码样式

### 5.1 文字样式示例

```javascript
// 标题文字
{
  x: 50,
  y: 80,
  text: '课程标题',
  fontSize: 48,
  color: '#333',
  fontWeight: 'bold',
  baseLine: 'top',
  zIndex: 10
}

// 正文文字（多行）
{
  x: 50,
  y: 150,
  text: '这是一段描述文字，用于介绍课程的详细信息内容',
  fontSize: 28,
  color: '#666',
  width: 650,
  lineNum: 2,
  lineHeight: 40,
  zIndex: 10
}

// 价格文字
{
  x: 50,
  y: 220,
  text: '¥199.00',
  fontSize: 40,
  color: '#e02e24',
  fontWeight: 'bold',
  zIndex: 10
}
```

### 5.2 图片样式示例

```javascript
// 主图（带圆角）
{
  x: 50,
  y: 280,
  url: 'https://example.com/course.jpg',
  width: 650,
  height: 400,
  borderRadius: 12,
  zIndex: 5
}

// 头像（圆形）
{
  x: 50,
  y: 720,
  url: 'https://example.com/avatar.jpg',
  width: 80,
  height: 80,
  borderRadius: 40, // 圆角为宽高一半即为圆形
  zIndex: 5
}

// Logo
{
  x: 600,
  y: 1250,
  url: '/images/logo.png',
  width: 100,
  height: 40,
  zIndex: 5
}
```

### 5.3 二维码样式示例

```javascript
// 二维码图片
{
  x: 550,
  y: 1100,
  url: 'https://api.example.com/qrcode?scene=123',
  width: 160,
  height: 160,
  borderRadius: 4,
  zIndex: 5
}

// 二维码提示文字
{
  x: 550,
  y: 1280,
  text: '扫码学习',
  fontSize: 24,
  color: '#999',
  textAlign: 'center',
  width: 160,
  zIndex: 10
}
```

---

## 6. 海报保存/分享流程

### 6.1 预览海报

```javascript
onPosterSuccess(e) {
  const { detail } = e; // detail 为图片本地路径
  wx.previewImage({
    current: detail,
    urls: [detail]
  });
}
```

### 6.2 保存到相册

```javascript
onPosterSuccess(e) {
  const { detail } = e;
  
  // 先获取用户授权
  wx.authorize({
    scope: 'writePhotosAlbum',
    success: () => {
      // 保存图片到相册
      wx.saveImageToPhotosAlbum({
        filePath: detail,
        success: () => {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.error('保存失败', err);
          wx.showToast({
            title: '保存失败',
            icon: 'none'
          });
        }
      });
    },
    fail: () => {
      // 用户拒绝授权，引导到设置页
      wx.showModal({
        title: '提示',
        content: '需要授权才能保存图片',
        success: (res) => {
          if (res.confirm) {
            wx.openSetting();
          }
        }
      });
    }
  });
}
```

### 6.3 分享海报

```javascript
// 方式 1：预览后用户手动分享
onPosterSuccess(e) {
  const { detail } = e;
  wx.previewImage({
    current: detail,
    urls: [detail]
  });
  wx.showToast({
    title: '长按图片可分享',
    icon: 'none',
    duration: 2000
  });
}

// 方式 2：生成临时文件后分享
async function sharePoster(imagePath) {
  // 小程序分享需要使用文件系统
  const fs = wx.getFileSystemManager();
  const tempPath = `${wx.env.USER_DATA_PATH}/poster.png`;
  
  fs.copyFile({
    srcPath: imagePath,
    destPath: tempPath,
    success: () => {
      // 可以调用分享 API
      wx.shareAppMessage({
        imageUrl: tempPath,
        title: '精彩课程推荐'
      });
    }
  });
}
```

---

## 7. 异步生成海报

### 7.1 Page 中异步生成

```javascript
// pages/poster/poster.js
import Poster from '../../miniprogram_dist/poster/poster';

Page({
  onReady() {
    // 可以延迟初始化
  },
  
  onCreatePoster() {
    // 先获取数据
    this.fetchData().then((data) => {
      // 设置配置
      this.setData({ posterConfig: this.buildConfig(data) }, () => {
        // 生成海报
        Poster.create();
      });
    });
  },
  
  buildConfig(data) {
    return {
      width: 750,
      height: 1334,
      images: [
        {
          x: 50,
          y: 100,
          url: data.imageUrl,
          width: 650,
          height: 400
        }
      ],
      texts: [
        {
          x: 50,
          y: 550,
          text: data.title,
          fontSize: 40,
          color: '#333'
        }
      ]
    };
  },
  
  onPosterSuccess(e) {
    const { detail } = e;
    wx.previewImage({
      current: detail,
      urls: [detail]
    });
  }
});
```

### 7.2 组件中异步生成

```javascript
// components/poster-wrapper/index.js
import Poster from '../../miniprogram_dist/poster/poster';

Component({
  data: {
    posterConfig: {}
  },
  
  methods: {
    onCreatePoster() {
      // 获取数据
      this.getData().then((data) => {
        this.setData({ posterConfig: this.buildConfig(data) }, () => {
          // 注意：组件中需要传入 this
          Poster.create(true, this);
        });
      });
    },
    
    buildConfig(data) {
      return {
        width: 750,
        height: 1334,
        images: [],
        texts: []
      };
    }
  }
});
```

---

## 8. 可复用代码片段

### 8.1 通用海报生成器

```javascript
// utils/poster-generator.js
export class PosterGenerator {
  constructor(options = {}) {
    this.width = options.width || 750;
    this.height = options.height || 1334;
    this.backgroundColor = options.backgroundColor || '#fff';
  }
  
  // 添加背景
  addBackground(color) {
    this.blocks = this.blocks || [];
    this.blocks.push({
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
      backgroundColor: color || this.backgroundColor,
      zIndex: 1
    });
    return this;
  }
  
  // 添加标题
  addTitle(text, options = {}) {
    this.texts = this.texts || [];
    this.texts.push({
      x: options.x || 50,
      y: options.y || 80,
      text,
      fontSize: options.fontSize || 48,
      color: options.color || '#333',
      fontWeight: 'bold',
      zIndex: options.zIndex || 10
    });
    return this;
  }
  
  // 添加图片
  addImage(url, options = {}) {
    this.images = this.images || [];
    this.images.push({
      x: options.x || 50,
      y: options.y || 150,
      url,
      width: options.width || 650,
      height: options.height || 400,
      borderRadius: options.borderRadius || 0,
      zIndex: options.zIndex || 5
    });
    return this;
  }
  
  // 添加二维码
  addQRCode(url, options = {}) {
    this.images = this.images || [];
    this.images.push({
      x: options.x || 550,
      y: options.y || 1100,
      url,
      width: options.width || 160,
      height: options.height || 160,
      borderRadius: 4,
      zIndex: options.zIndex || 5
    });
    return this;
  }
  
  // 生成配置
  build() {
    return {
      width: this.width,
      height: this.height,
      backgroundColor: this.backgroundColor,
      blocks: this.blocks || [],
      texts: this.texts || [],
      images: this.images || [],
      lines: this.lines || []
    };
  }
}
```

### 8.2 使用示例

```javascript
import { PosterGenerator } from '../../utils/poster-generator';

Page({
  onCreatePoster() {
    const config = new PosterGenerator({
      width: 750,
      height: 1334
    })
      .addBackground('#f5f5f5')
      .addTitle('精品课程推荐')
      .addImage('https://example.com/course.jpg', {
        y: 150,
        borderRadius: 12
      })
      .addQRCode('https://api.example.com/qrcode?scene=123')
      .build();
    
    this.setData({ posterConfig: config }, () => {
      Poster.create();
    });
  }
});
```

---

## 9. 踩坑记录

### 9.1 图片无法显示

**问题**: 海报上的图片不显示

**原因**: 
1. 图片域名未添加到 downloadFile 合法域名
2. 图片 URL 无法访问
3. 图片尺寸过大

**解决方案**:
- 在微信开发者工具中添加合法域名
- 测试图片 URL 是否可访问
- 压缩图片尺寸

### 9.2 文字显示不全

**问题**: 文字被截断或显示不全

**原因**:
1. 文字宽度设置过小
2. 行数限制过严
3. 坐标计算错误

**解决方案**:
- 增加 width 值
- 调整 lineNum
- 检查 x/y 坐标

### 9.3 生成失败

**问题**: 调用 Poster.create() 后触发 fail 回调

**原因**:
1. 配置参数错误
2. 图片资源加载失败
3. canvas 绘制错误

**解决方案**:
- 检查配置参数是否完整
- 添加图片加载错误处理
- 查看控制台错误信息

### 9.4 清晰度问题

**问题**: 生成的海报模糊

**解决方案**:
- 增加 pixelRatio 值（推荐 2 或 3）
- 使用高清图片资源
- 增加画布尺寸

---

## 10. 清如项目复用建议

### 10.1 适用场景

1. **课程分享海报**: 展示课程封面、标题、价格、二维码
2. **冥想打卡海报**: 展示用户冥想时长、成就徽章
3. **活动宣传海报**: 禅修活动、线下聚会宣传
4. **用户成就海报**: 学习里程碑、连续打卡记录

### 10.2 设计风格建议

```javascript
// 清如风格海报配置
const qingruPosterConfig = {
  width: 750,
  height: 1334,
  backgroundColor: '#F5F5F0', // 米白色背景
  
  blocks: [
    {
      x: 40,
      y: 40,
      width: 670,
      height: 1254,
      backgroundColor: '#fff',
      borderRadius: 16,
      zIndex: 1
    }
  ],
  
  // 配色方案
  colors: {
    primary: '#4A5D4E',    // 深绿
    accent: '#C9B037',     // 金色
    secondary: '#A68966',  // 棕色
    text: '#333333',
    textLight: '#666666'
  }
};
```

### 10.3 性能优化建议

1. **图片预加载**: 使用 preload: true 预下载图片
2. **缓存海报**: 生成的海报可缓存避免重复生成
3. **按需生成**: 用户点击时才生成海报
4. **压缩图片**: 使用适当的图片尺寸和质量

---

## 11. 总结

wxa-plugin-canvas 是一个功能强大的小程序海报生成组件，具有以下特点：

✅ **配置简单**: JSON 配置即可生成海报  
✅ **功能丰富**: 支持文字、图片、线条、背景块  
✅ **灵活定制**: 支持层级、圆角、透明度等属性  
✅ **异步支持**: 支持 Page 和 Component 中异步生成  
✅ **社区活跃**: 大量使用者和案例  

对于清如项目，可用于生成课程分享、用户成就、活动宣传等多种海报，配合禅意风格设计，提升用户分享意愿。

---

**笔记创建时间**: 2026-04-04  
**适用版本**: wxa-plugin-canvas 最新稳定版
