# 日行一善小程序

基于微信小程序开发的日行一善平台，融合佛历、禅理、梵音等功能。

## 技术栈

- 微信小程序原生开发
- Vant Weapp UI 组件库
- Stitch 设计规范

## 设计规范

### 色彩
- 主色：#4A5D4E（成功绿）
- 辅助色：#C9B037（金色）
- 页面底色：#EFEEE9（米白）

### 字体
- 中文：Noto Serif SC
- 英文：Plus Jakarta Sans

### 圆角
- 统一圆角：8rpx

## 目录结构

```
miniprogram/
├── pages/              # 页面
│   ├── index/         # 首页
│   ├── audio/         # 梵音
│   ├── zen/           # 禅理
│   ├── profile/       # 我的
│   └── ...
├── components/         # 组件
├── utils/             # 工具函数
│   ├── request.js     # 请求封装
│   ├── audio.js       # 音频播放
│   └── util.js        # 通用工具
├── assets/            # 资源文件
├── styles/            # 全局样式
├── app.js             # 入口文件
├── app.json           # 全局配置
└── app.wxss           # 全局样式
```

## 快速开始

### 1. 安装依赖

```bash
cd miniprogram
npm install
```

### 2. 构建 npm

微信开发者工具 → 详情 → 本地设置 → 使用 npm 模块 → 构建 npm

### 3. 配置 AppID

修改 `project.config.json` 中的 `appid` 为你的小程序 AppID

### 4. 运行

微信开发者工具导入项目即可运行

## 功能特性

- ✅ 佛历展示（公历 + 农历 + 干支）
- ✅ 每日宜忌
- ✅ 禅理短句（随机/收藏）
- ✅ 打卡系统（晨起礼佛/晚间打坐）
- ✅ 功德林（点击积累功德）
- ✅ 梵音播放（9 首经典佛曲）
- ✅ 收听记录追踪

## 开发规范

- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 遵循微信小程序开发规范

## 相关文档

- [Vant Weapp 文档](https://youzan.github.io/vant-weapp/)
- [微信小程序文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## License

MIT
