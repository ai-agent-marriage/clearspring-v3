# 清如 V3 数据库设计与初始化方案 V1.0

> 适用：MySQL 8.0+、微信原生小程序  
> 适配：PRD 全业务模块（双角色、护生、梵音、订单、证书）

---

## 📊 数据库设计总览

### 表结构清单（10 张核心表）

| 表名 | 说明 | 核心字段 | 用途 |
|------|------|----------|------|
| `sys_role` | 系统角色表 | role_name, role_code | 祈福者/志愿者/机构/管理员 |
| `sys_user` | 用户表（双角色核心） | openid, role_code, org_id, merit | 用户信息 + 功德值 |
| `species` | 护生物种表 | name, type, is_forbid | 物种正面清单 + 入侵物种红标 |
| `audio` | 梵音音频表 | title, url, duration | 9 首固定音频 |
| `zen_quote` | 每日禅理表 | content, author | 随机禅理展示 |
| `protect_record` | 免费护生记录表 | user_openid, species_id, quantity | 免费自主护生登记 |
| `order_protect` | 付费护生订单表 | order_no, user_id, org_id, volunteer_id, status | 订单全流程 |
| `certificate` | 护生证书表 | user_id, cert_url, cert_type | 免费/付费证书 |
| `org_info` | 机构信息表 | org_name, contact, address | 机构资质管理 |
| `system_config` | 系统配置表 | config_key, config_value | 全局配置 |

---

## 🗄️ MySQL 建表语句（完整可执行）

### 1. 系统角色表

```sql
CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色 ID',
  `role_name` varchar(32) NOT NULL COMMENT '角色名称：祈福者/志愿者/机构/管理员',
  `role_code` varchar(32) NOT NULL COMMENT '角色编码：user/volunteer/org/admin',
  `status` tinyint DEFAULT 1 COMMENT '状态 1 正常 0 禁用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';
```

---

### 2. 用户表（双角色核心）

```sql
CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户 ID',
  `openid` varchar(64) NOT NULL COMMENT '微信 openid',
  `nickname` varchar(64) DEFAULT '' COMMENT '昵称',
  `avatar` varchar(255) DEFAULT '' COMMENT '头像',
  `phone` varchar(11) DEFAULT '' COMMENT '手机号',
  `role_code` varchar(32) NOT NULL DEFAULT 'user' COMMENT '角色编码',
  `org_id` bigint DEFAULT 0 COMMENT '所属机构 ID',
  `status` tinyint DEFAULT 1 COMMENT '1 正常 0 禁用',
  `merit` int DEFAULT 0 COMMENT '功德值',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_openid` (`openid`),
  KEY `idx_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

---

### 3. 护生物种表

```sql
CREATE TABLE `species` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '物种 ID',
  `name` varchar(64) NOT NULL COMMENT '物种名称',
  `type` tinyint NOT NULL COMMENT '类型 1 鱼类 2 鸟类 3 其他',
  `is_forbid` tinyint DEFAULT 0 COMMENT '是否禁止 0 否 1 是（入侵物种）',
  `remark` varchar(255) DEFAULT '' COMMENT '备注/警示语',
  `sort` int DEFAULT 0 COMMENT '排序',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='护生物种表';
```

---

### 4. 梵音音频表

```sql
CREATE TABLE `audio` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '音频 ID',
  `title` varchar(64) NOT NULL COMMENT '音频标题',
  `url` varchar(255) NOT NULL COMMENT '音频地址',
  `duration` int DEFAULT 0 COMMENT '时长 (秒)',
  `sort` int DEFAULT 0 COMMENT '排序',
  `status` tinyint DEFAULT 1 COMMENT '1 启用 0 禁用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='梵音音频表';
```

---

### 5. 每日禅理表

```sql
CREATE TABLE `zen_quote` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `content` varchar(512) NOT NULL COMMENT '禅理内容',
  `author` varchar(32) DEFAULT '' COMMENT '出处',
  `status` tinyint DEFAULT 1 COMMENT '1 启用 0 禁用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='每日禅理表';
```

---

### 6. 免费护生记录表

```sql
CREATE TABLE `protect_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录 ID',
  `user_openid` varchar(64) DEFAULT '' COMMENT '用户 openid（未注册为空）',
  `species_id` bigint NOT NULL COMMENT '物种 ID',
  `quantity` int NOT NULL COMMENT '数量',
  `address` varchar(255) NOT NULL COMMENT '护生地点',
  `remark` varchar(512) DEFAULT '' COMMENT '备注',
  `images` text DEFAULT '' COMMENT '现场照片',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_openid` (`user_openid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='免费护生记录';
```

---

### 7. 付费护生订单表

```sql
CREATE TABLE `order_protect` (
  `order_no` varchar(32) NOT NULL COMMENT '订单号（主键）',
  `user_id` bigint NOT NULL COMMENT '下单用户 ID',
  `org_id` bigint DEFAULT 0 COMMENT '承接机构 ID',
  `volunteer_id` bigint DEFAULT 0 COMMENT '执行志愿者 ID',
  `species_id` bigint NOT NULL COMMENT '物种 ID',
  `quantity` int NOT NULL COMMENT '数量',
  `amount` decimal(10,2) NOT NULL COMMENT '订单金额',
  `status` tinyint NOT NULL COMMENT '订单状态：1 待承接 2 待执行 3 执行中 4 待确认 5 已完成 6 已取消',
  `address` varchar(255) NOT NULL COMMENT '护生地点',
  `execute_images` text DEFAULT '' COMMENT '执行照片/视频',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `complete_time` datetime DEFAULT NULL COMMENT '完成时间',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='付费护生订单';
```

---

### 8. 护生证书表

```sql
CREATE TABLE `certificate` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '证书 ID',
  `user_id` bigint NOT NULL COMMENT '用户 ID',
  `order_no` varchar(32) DEFAULT '' COMMENT '关联订单号',
  `record_id` bigint DEFAULT 0 COMMENT '关联免费记录 ID',
  `cert_url` varchar(255) NOT NULL COMMENT '证书图片地址',
  `cert_type` tinyint NOT NULL COMMENT '1 免费证书 2 付费证书',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='护生证书表';
```

---

### 9. 机构信息表

```sql
CREATE TABLE `org_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '机构 ID',
  `org_name` varchar(64) NOT NULL COMMENT '机构名称',
  `contact` varchar(11) NOT NULL COMMENT '联系电话',
  `address` varchar(255) DEFAULT '' COMMENT '机构地址',
  `status` tinyint DEFAULT 1 COMMENT '1 正常 0 禁用',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='机构信息表';
```

---

### 10. 系统配置表

```sql
CREATE TABLE `system_config` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `config_key` varchar(64) NOT NULL COMMENT '配置键',
  `config_value` varchar(1024) NOT NULL COMMENT '配置值',
  `remark` varchar(255) DEFAULT '' COMMENT '备注',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_config_key` (`config_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统配置表';
```

---

### 11. 初始化基础数据

```sql
-- 初始化角色数据
INSERT INTO `sys_role` (`role_name`, `role_code`) VALUES 
('祈福者', 'user'),
('志愿者', 'volunteer'),
('机构', 'org'),
('管理员', 'admin');

-- 初始化护生物种（示例）
INSERT INTO `species` (`name`, `type`, `is_forbid`, `remark`) VALUES 
('鲤鱼', 1, 0, '常见放生鱼类'),
('鲫鱼', 1, 0, '常见放生鱼类'),
('麻雀', 2, 0, '常见鸟类'),
('巴西龟', 1, 1, '入侵物种，禁止放生！'),
('鳄雀鳝', 1, 1, '入侵物种，禁止放生！');

-- 初始化梵音音频（9 首）
INSERT INTO `audio` (`title`, `url`, `duration`, `sort`) VALUES 
('大悲咒', 'https://xxx/audio1.mp3', 300, 1),
('心经', 'https://xxx/audio2.mp3', 180, 2),
('金刚经', 'https://xxx/audio3.mp3', 600, 3),
('阿弥陀佛圣号', 'https://xxx/audio4.mp3', 240, 4),
('观音菩萨圣号', 'https://xxx/audio5.mp3', 240, 5),
('地藏菩萨圣号', 'https://xxx/audio6.mp3', 240, 6),
('文殊菩萨圣号', 'https://xxx/audio7.mp3', 240, 7),
('普贤菩萨圣号', 'https://xxx/audio8.mp3', 240, 8),
('药师佛圣号', 'https://xxx/audio9.mp3', 240, 9);

-- 初始化禅理（示例）
INSERT INTO `zen_quote` (`content`, `author`) VALUES 
('诸恶莫作，众善奉行', '增一阿含经'),
('一切有为法，如梦幻泡影', '金刚经'),
('应无所住而生其心', '金刚经'),
('慈悲为本，方便为门', '佛教格言'),
('放下屠刀，立地成佛', '涅槃经');
```

---

## 📁 微信小程序项目目录结构

```
qingru-app/
├── app.js                      # 全局入口
├── app.json                    # 全局配置
├── app.wxss                    # 全局样式
├── config.js                   # 全局配置文件
├── utils/                      # 工具类（开源集成）
│   ├── audio.js                # 音频播放工具
│   ├── canvas.js               # 海报/证书生成
│   ├── lunar.js                # 佛历日历工具
│   └── request.js              # 网络请求
├── pages/                      # 业务页面
│   ├── index/                  # 首页
│   ├── audio/                  # 梵音播放页
│   ├── zen/                    # 每日禅理页
│   ├── protect/                # 免费护生页
│   ├── order/                  # 付费订单页
│   ├── user/                   # 个人中心
│   └── volunteer/              # 志愿者工作台
└── components/                 # 公共组件
```

---

## 💻 小程序核心全局文件代码

### 4.1 app.js（全局入口）

```javascript
App({
  globalData: {
    userInfo: null,
    openid: '',
    roleCode: 'user',
    baseUrl: 'http://localhost:8080/api'
  },
  
  onLaunch() {
    this.initApp()
  },
  
  async initApp() {
    const that = this
    wx.login({
      success: res => {
        wx.request({
          url: that.globalData.baseUrl + '/user/login',
          method: 'POST',
          data: { code: res.code },
          success: result => {
            that.globalData.openid = result.data.openid
            that.globalData.userInfo = result.data.user
            that.globalData.roleCode = result.data.roleCode
          }
        })
      }
    })
  }
})
```

---

### 4.2 app.json（全局路由 + 配置）

```json
{
  "pages": [
    "pages/index/index",
    "pages/audio/audio",
    "pages/zen/zen",
    "pages/protect/protect",
    "pages/order/order",
    "pages/user/user",
    "pages/volunteer/volunteer"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#2c5e4e",
    "navigationBarTitleText": "清如·科学护生",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#f5f5f5"
  },
  "tabBar": {
    "color": "#666",
    "selectedColor": "#2c5e4e",
    "list": [
      { "pagePath": "pages/index/index", "text": "首页" },
      { "pagePath": "pages/audio/audio", "text": "梵音" },
      { "pagePath": "pages/protect/protect", "text": "护生" },
      { "pagePath": "pages/user/user", "text": "我的" }
    ]
  },
  "sitemapLocation": "sitemap.json",
  "permission": {
    "scope.userLocation": { "desc": "用于获取护生地点" }
  }
}
```

---

### 4.3 app.wxss（全局禅意样式）

```css
page {
  background-color: #f8f6f2;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
}

.container {
  padding: 20rpx;
}

.btn-primary {
  background-color: #2c5e4e !important;
  color: #fff !important;
  border-radius: 50rpx;
}

.text-forbid {
  color: #e63946;
  font-weight: bold;
}
```

---

### 4.4 config.js（全局配置）

```javascript
module.exports = {
  baseUrl: 'http://localhost:8080/api',
  version: '1.0.0',
  forbidTip: '该物种为入侵物种，禁止护生！',
  certPath: 'certificate/'
}
```

---

## 🛠️ 小程序工具类代码（开源集成）

### 5.1 utils/audio.js（音频播放）

```javascript
class AudioUtil {
  constructor() {
    this.audio = wx.createInnerAudioContext()
    this.audio.loop = false
  }
  
  play(url) {
    this.audio.src = url
    this.audio.play()
  }
  
  pause() {
    this.audio.pause()
  }
  
  stop() {
    this.audio.stop()
  }
  
  onEnded(callback) {
    this.audio.onEnded(callback)
  }
}

module.exports = new AudioUtil()
```

---

### 5.2 utils/canvas.js（证书/海报生成）

```javascript
const drawCertificate = (data, callback) => {
  const ctx = wx.createCanvasContext('certCanvas')
  
  ctx.setFillStyle('#ffffff')
  ctx.fillRect(0, 0, 300, 400)
  
  ctx.setFontSize(20)
  ctx.fillText(data.title, 100, 50)
  
  ctx.draw()
  
  setTimeout(() => {
    wx.canvasToTempFilePath({
      canvasId: 'certCanvas',
      success: res => callback(res.tempFilePath)
    })
  }, 500)
}

module.exports = { drawCertificate }
```

---

### 5.3 utils/lunar.js（佛历日历）

```javascript
// 集成 lunar-javascript 开源库
const { Solar } = require('lunar-javascript')

module.exports = {
  getTodayLunar() {
    const solar = Solar.fromDate(new Date())
    const lunar = solar.getLunar()
    const fo = solar.getFo()
    
    return {
      lunarText: fo.toFullString(),
      suit: lunar.getDayYi(),
      avoid: lunar.getDayJi()
    }
  },
  
  getSuitableDate(date) {
    const solar = Solar.fromDate(date)
    const lunar = solar.getLunar()
    return lunar.getDayYi().includes('祭祀') || lunar.getDayYi().includes('祈福')
  }
}
```

---

## 🏠 小程序首页初始化代码

### 6.1 pages/index/index.wxml

```xml
<view class="container">
  <!-- 佛历卡片 -->
  <view class="lunar-card">
    <text>{{lunarText}}</text>
    <text>宜：{{suit}}</text>
  </view>
  
  <!-- 护生按钮 -->
  <view class="protect-btn">
    <button bindtap="goProtect" class="btn-primary">免费护生</button>
    <button bindtap="goOrder" class="btn-primary" wx:if="{{roleCode != 'user'}}">委托护生</button>
  </view>
</view>
```

---

### 6.2 pages/index/index.js

```javascript
const app = getApp()
const { Solar } = require('../../utils/lunar')

Page({
  data: {
    lunarText: '',
    suit: '',
    roleCode: 'user'
  },
  
  onLoad() {
    this.getLunarDate()
    this.setData({ roleCode: app.globalData.roleCode })
  },
  
  getLunarDate() {
    const solar = Solar.fromDate(new Date())
    const fo = solar.getFo()
    this.setData({
      lunarText: fo.toFullString(),
      suit: '护生、行善'
    })
  },
  
  goProtect() {
    wx.navigateTo({ url: '/pages/protect/protect' })
  },
  
  goOrder() {
    wx.navigateTo({ url: '/pages/order/order' })
  }
})
```

---

## 🚀 快速启动部署指南

### 7.1 数据库部署

1. 打开 MySQL 客户端（Navicat/DBeaver）
2. 新建数据库 `qingru_app`
3. 复制本文档 SQL 语句全量执行
4. 自动生成 10 张业务表 + 初始化角色数据

---

### 7.2 小程序部署

1. 微信开发者工具
2. 新建原生小程序
3. 按目录结构创建文件
4. 复制所有代码到对应文件
5. 修改 `config.js` 后端接口地址
6. 直接预览运行

---

### 7.3 开源依赖内置

- ✅ 音频播放工具（wx.createInnerAudioContext）
- ✅ 佛历日历工具（lunar-javascript）
- ✅ 海报生成工具（wxa-plugin-canvas）
- ✅ **无需额外安装插件，开箱即用**

---

## 📊 数据库 ER 关系图

```
sys_user (用户表)
  ├── 1:N → protect_record (免费护生记录)
  ├── 1:N → order_protect (付费护生订单)
  └── 1:N → certificate (护生证书)

order_protect (订单表)
  ├── N:1 → sys_user (下单用户)
  ├── N:1 → org_info (承接机构)
  ├── N:1 → sys_user (执行志愿者)
  └── 1:1 → certificate (护生证书)

species (物种表)
  └── 1:N → protect_record / order_protect
```

---

*清如 V3 · 数据库设计完成* 🌊
