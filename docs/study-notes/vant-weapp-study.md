# Vant Weapp UI 组件库学习笔记

## 1. 项目概览

**项目地址**: https://github.com/youzan/vant-weapp

**核心功能**: 轻量、可靠的小程序 UI 组件库，由有赞团队维护

**许可证**: MIT

**最新版本**: 可通过 npm 查看 (@vant/weapp)

**基础库要求**: 小程序基础库 2.6.5+

**官方文档**: 
- 国内：https://vant.pro/vant-weapp/
- GitHub: https://vant-ui.github.io/vant-weapp/

---

## 2. 安装配置步骤

### 2.1 通过 npm 安装（推荐）

```bash
# 安装最新版
npm i @vant/weapp -S --production

# 或通过 yarn 安装
yarn add @vant/weapp --production

# 安装 0.x 旧版本（如需要）
npm i vant-weapp -S --production
```

### 2.2 通过 Git 下载

```bash
git clone https://github.com/youzan/vant-weapp.git
# 将 dist 目录拷贝到项目中
```

### 2.3 微信开发者工具配置

1. 打开微信开发者工具
2. 右键点击项目 → 详情 → 本地设置
3. 勾选「使用 npm 模块」
4. 点击工具 → 构建 npm

### 2.4 引入组件

以按钮组件为例，在页面的 json 文件中配置：

```json
{
  "usingComponents": {
    "van-button": "/path/to/vant-weapp/dist/button/index"
  }
}
```

---

## 3. 核心组件使用

### 3.1 Button 按钮组件

```xml
<!-- wxml -->
<van-button type="primary">主要按钮</van-button>
<van-button type="info">信息按钮</van-button>
<van-button type="warning">警告按钮</van-button>
<van-button type="danger">危险按钮</van-button>
<van-button type="default">默认按钮</van-button>

<!-- 朴素按钮 -->
<van-button type="primary" plain>朴素按钮</van-button>

<!-- 圆形按钮 -->
<van-button type="primary" round>圆形按钮</van-button>

<!-- 图标按钮 -->
<van-button type="primary" icon="plus">按钮</van-button>

<!-- 禁用状态 -->
<van-button type="primary" disabled>禁用按钮</van-button>

<!-- 加载状态 -->
<van-button type="primary" loading />
```

### 3.2 Card 卡片组件

```xml
<!-- wxml -->
<van-card
  num="2"
  price="10.00"
  desc="描述信息"
  title="商品标题"
  thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
>
  <view slot="tags">
    <van-tag plain type="primary">标签</van-tag>
  </view>
</van-card>

<!-- 自定义卡片内容 -->
<van-card
  num="2"
  price="10.00"
  desc="描述信息"
  title="商品标题"
  thumb="https://img.yzcdn.cn/vant/ipad.jpeg"
>
  <view slot="num">自定义数量</view>
  <view slot="price">自定义价格</view>
</van-card>
```

### 3.3 Dialog 弹窗组件

```xml
<!-- wxml -->
<van-dialog
  id="van-dialog"
  title="标题"
  content="代码是写出来给人看的，附带能在机器上运行"
  show-button-bar="{{true}}"
  confirm-button-text="确认"
  cancel-button-text="取消"
  bind:confirm="onConfirm"
  bind:cancel="onCancel"
/>
```

```javascript
// js - 通过 JS 调用
Page({
  onConfirm() {
    wx.showToast({ title: '确认' });
  },
  
  onCancel() {
    wx.showToast({ title: '取消' });
  },
  
  showDialog() {
    Dialog({
      title: '标题',
      content: '弹窗内容',
      selector: '#van-dialog'
    });
  }
});
```

### 3.4 Form 表单组件

```xml
<!-- wxml -->
<van-form bind:submit="onSubmit">
  <van-field
    name="username"
    label="用户名"
    placeholder="请输入用户名"
    bind:click-button="onClickButton"
  >
    <view slot="button" bind:click="onClickButton">发送验证码</view>
  </van-field>
  
  <van-field
    name="password"
    type="password"
    label="密码"
    placeholder="请输入密码"
  />
  
  <van-field
    name="phone"
    label="手机号"
    type="number"
    placeholder="请输入手机号"
  />
  
  <van-field
    name="rate"
    label="评分"
    render-bottom="{{false}}"
  >
    <van-rate name="rate" value="{{3}}" />
  </van-field>
  
  <view style="margin: 16px;">
    <van-button round block type="primary" native-type="submit">
      提交
    </van-button>
  </view>
</van-form>
```

```javascript
// js - 表单验证
Page({
  onSubmit(event) {
    console.log(event.detail);
    wx.showToast({ title: '提交成功' });
  }
});
```

---

## 4. 主题定制方法

### 4.1 通过 CSS 变量定制（推荐）

在 app.wxss 中定义全局 CSS 变量：

```css
/* app.wxss */
page {
  /* 主色 */
  --blue: #07c160;
  --green: #07c160;
  --red: #ee0a24;
  
  /* 圆角 */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;
  
  /* 间距 */
  --padding-base: 8px;
  --padding-xs: 8px;
  --padding-sm: 12px;
  --padding-md: 16px;
  --padding-lg: 24px;
}
```

### 4.2 常用 CSS 变量列表

```css
/* 主色 */
--blue: #1989fa;
--green: #07c160;
--red: #ee0a24;
--orange: #ff976a;

/* 基础样式 */
--text-color: #323233;
--text-color-2: #969799;
--text-color-3: #c8c9cc;
--active-color: #f2f3f5;
--background-color: #f7f8fa;

/* 圆角 */
--border-radius-sm: 4px;
--border-radius-md: 8px;
--border-radius-lg: 16px;
--border-radius-max: 999px;

/* 间距 */
--padding-xs: 8px;
--padding-sm: 12px;
--padding-md: 16px;
--padding-lg: 24px;
--padding-xl: 32px;
```

### 4.3 组件级定制

针对特定组件的样式覆盖：

```css
/* 自定义按钮样式 */
.van-button--primary {
  background-color: #07c160 !important;
  border-color: #07c160 !important;
}

/* 自定义卡片样式 */
.van-card {
  border-radius: 12px !important;
}
```

---

## 5. 可复用代码片段

### 5.1 通用页面模板

```xml
<!-- pages/common/base.wxml -->
<view class="page-container">
  <van-nav-bar
    title="{{navTitle}}"
    left-arrow="{{showBack}}"
    bind:click-left="onBack"
  />
  
  <view class="content">
    <slot />
  </view>
  
  <van-toast id="van-toast" />
  <van-dialog id="van-dialog" />
</view>
```

```css
/* pages/common/base.wxss */
.page-container {
  min-height: 100vh;
  background-color: var(--background-color);
}

.content {
  padding: var(--padding-md);
}
```

### 5.2 表单验证工具

```javascript
// utils/form-validator.js
export const validatePhone = (phone) => {
  return /^1[3-9]\d{9}$/.test(phone);
};

export const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};
```

### 5.3 通用请求封装

```javascript
// utils/request.js
const BASE_URL = 'https://api.example.com';

export const request = (options) => {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: (err) => {
        wx.showToast({ title: '网络错误', icon: 'none' });
        reject(err);
      }
    });
  });
};
```

---

## 6. 踩坑记录

### 6.1 npm 构建问题

**问题**: 构建 npm 后组件无法显示

**解决方案**:
1. 确保微信开发者工具已勾选「使用 npm 模块」
2. 删除 node_modules 重新安装
3. 重新构建 npm（工具 → 构建 npm）

### 6.2 样式覆盖失效

**问题**: 自定义样式无法覆盖组件默认样式

**解决方案**:
- 使用 `!important` 强制覆盖
- 确保样式文件在组件样式之后引入
- 使用 CSS 变量定制优先于直接覆盖

### 6.3 图标不显示

**问题**: 使用 icon 属性但图标不显示

**解决方案**:
- 确保图标名称正确（参考官方文档）
- 部分图标需要引入 iconfont
- 检查基础库版本是否支持

### 6.4 弹窗层级问题

**问题**: Dialog 被其他组件遮挡

**解决方案**:
- 将 Dialog 组件放在页面最外层
- 使用 z-index 调整层级
- 避免在 scroll-view 中使用弹窗

---

## 7. 清如项目复用建议

### 7.1 推荐使用的组件

根据清如项目（冥想/音频类小程序）特点，推荐以下组件：

1. **Button** - 播放控制、提交操作
2. **Card** - 课程卡片、内容展示
3. **Dialog** - 确认操作、提示信息
4. **Form** - 用户信息填写
5. **Rate** - 课程评分
6. **Tag** - 分类标签
7. **Toast** - 轻量提示
8. **Loading** - 加载状态

### 7.2 主题定制建议

```css
/* 清如项目主题色 - 禅意风格 */
page {
  --blue: #4A5D4E;        /* 主色：深绿色 */
  --green: #4A5D4E;
  --red: #C9B037;         /* 强调色：金色 */
  --orange: #A68966;      /* 辅助色：棕色 */
  
  --text-color: #333333;
  --text-color-2: #666666;
  --background-color: #F5F5F0;  /* 米白色背景 */
  
  --border-radius-md: 12px;
  --border-radius-lg: 16px;
}
```

### 7.3 性能优化建议

1. **按需引入**: 只引入需要的组件，减少包体积
2. **图片优化**: 使用 WebP 格式，压缩图片
3. **分包加载**: 将非核心页面分包
4. **懒加载**: 长列表使用虚拟滚动

### 7.4 代码规范建议

```javascript
// 组件引入规范
{
  "usingComponents": {
    "van-button": "@vant/weapp/dist/button/index",
    "van-card": "@vant/weapp/dist/card/index"
  }
}

// 事件命名规范
// handleXxx - 处理函数
// onXxx - 回调函数
// onClick - 点击事件
```

---

## 8. 总结

Vant Weapp 是一个成熟稳定的小程序 UI 组件库，具有以下优势：

✅ **组件丰富**: 70+ 高质量组件  
✅ **文档完善**: 详细的 API 文档和示例  
✅ **主题定制**: 支持 CSS 变量定制  
✅ **持续维护**: 有赞团队持续更新  
✅ **社区活跃**: 大量使用者和贡献者  

对于清如项目，Vant Weapp 可以作为基础 UI 框架，配合自定义的禅意风格主题，快速搭建高质量的界面。

---

**笔记创建时间**: 2026-04-04  
**适用版本**: Vant Weapp 最新稳定版
