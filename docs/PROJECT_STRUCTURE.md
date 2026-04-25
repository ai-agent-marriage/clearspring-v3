# 清如 ClearSpring V2.0 - 项目目录结构

**文档版本**: V1.0  
**创建时间**: 2026-04-16  
**项目根目录**: `/home/admin/.openclaw/workspace/`

---

## 📁 整体目录结构

```
clearspring-v3/
├── 📱 miniprogram/                    # 小程序端（微信原生）
│   ├── pages/                        # 页面目录
│   │   ├── index/                   # 首页（梵音板块）
│   │   │   ├── index.js
│   │   │   ├── index.json
│   │   │   ├── index.wxml
│   │   │   └── index.wxss
│   │   ├── audio-player/            # 音频播放页
│   │   ├── zen/                     # 禅理板块首页
│   │   ├── zen-home/                # 禅理功能主页
│   │   ├── daily-zen/               # 每日一禅页
│   │   ├── species-list/            # 物种列表页
│   │   ├── species-detail/          # 物种详情页
│   │   ├── calendar/                # 佛历吉日页
│   │   ├── merit-forest/            # 护生功德林
│   │   ├── certificate/             # 功德证书页
│   │   ├── profile/                 # 个人中心（祈福者端）
│   │   ├── volunteer-profile/       # 个人中心（志愿者端）
│   │   └── org-profile/             # 个人中心（机构端）
│   ├── components/                   # 公共组件
│   │   ├── audio-card/              # 音频卡片组件
│   │   ├── certificate-card/        # 证书卡片组件
│   │   ├── species-item/            # 物种列表项
│   │   ├── task-item/               # 任务列表项
│   │   └── tab-bar/                 # 自定义底部导航
│   ├── services/                     # API 服务层
│   │   ├── audio.js                 # 音频相关 API
│   │   ├── user.js                  # 用户相关 API
│   │   ├── order.js                 # 订单相关 API
│   │   ├── species.js               # 物种相关 API
│   │   └── certificate.js           # 证书相关 API
│   ├── utils/                        # 工具函数
│   │   ├── util.js                  # 通用工具
│   │   ├── auth.js                  # 认证工具
│   │   └── format.js                # 格式化工具
│   ├── styles/                       # 全局样式
│   │   ├── variables.wxss           # CSS 变量（Stitch 设计系统）
│   │   ├── mixins.wxss              # 样式混入
│   │   └── theme.wxss               # 主题样式
│   ├── images/                       # 图片资源
│   │   ├── icons/                   # 图标
│   │   ├── backgrounds/             # 背景图
│   │   └── certificates/            # 证书模板
│   ├── app.js                        # 小程序入口
│   ├── app.json                      # 小程序配置
│   ├── app.wxss                      # 全局样式
│   ├── project.config.json          # 项目配置
│   └── sitemap.json                  # 索引配置
│
├── 💻 admin-vue3/                    # WEB 管理后台（Vue 3）
│   ├── public/
│   │   ├── index.html
│   │   └── favicon.ico
│   ├── src/
│   │   ├── api/                     # API 服务
│   │   │   ├── user.js
│   │   │   ├── order.js
│   │   │   ├── content.js
│   │   │   ├── finance.js
│   │   │   └── system.js
│   │   ├── assets/                  # 静态资源
│   │   │   ├── images/
│   │   │   └── icons/
│   │   ├── components/              # 公共组件
│   │   │   ├── Layout/              # 布局组件
│   │   │   ├── Table/               # 表格组件
│   │   │   ├── Form/                # 表单组件
│   │   │   └── Chart/               # 图表组件
│   │   ├── composables/             # 组合式函数
│   │   │   ├── useTable.js
│   │   │   ├── useForm.js
│   │   │   └── useAuth.js
│   │   ├── layouts/                 # 布局
│   │   │   ├── BasicLayout.vue
│   │   │   └── UserLayout.vue
│   │   ├── router/                  # 路由配置
│   │   │   ├── index.js
│   │   │   └── routes.js
│   │   ├── stores/                  # Pinia 状态管理
│   │   │   ├── user.js
│   │   │   ├── order.js
│   │   │   └── system.js
│   │   ├── styles/                  # 全局样式
│   │   │   ├── variables.scss
│   │   │   ├── mixins.scss
│   │   │   └── index.scss
│   │   ├── utils/                   # 工具函数
│   │   │   ├── request.js           # HTTP 请求封装
│   │   │   ├── auth.js              # 认证工具
│   │   │   └── format.js            # 格式化工具
│   │   ├── views/                   # 页面组件
│   │   │   ├── dashboard/           # 控制台首页
│   │   │   ├── user/                # 用户管理
│   │   │   ├── order/               # 订单管理
│   │   │   ├── content/             # 内容管理
│   │   │   ├── finance/             # 财务管理
│   │   │   └── system/              # 系统设置
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env                         # 环境变量
│   ├── .eslintrc.js                 # ESLint 配置
│   ├── .prettierrc                  # Prettier 配置
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js               # Vite 配置
│   └── README.md
│
├── 🖥️ api/                           # 后端 API（Node.js Express）
│   ├── src/
│   │   ├── config/                  # 配置文件
│   │   │   ├── database.js          # 数据库配置
│   │   │   ├── wechat.js            # 微信配置
│   │   │   └── index.js
│   │   ├── controllers/             # 控制器层
│   │   │   ├── audioController.js   # 音频控制器
│   │   │   ├── userController.js    # 用户控制器
│   │   │   ├── orderController.js   # 订单控制器
│   │   │   ├── speciesController.js # 物种控制器
│   │   │   └── certificateController.js
│   │   ├── models/                  # 数据模型
│   │   │   ├── User.js
│   │   │   ├── Order.js
│   │   │   ├── Species.js
│   │   │   └── Certificate.js
│   │   ├── routes/                  # 路由配置
│   │   │   ├── audio.js
│   │   │   ├── user.js
│   │   │   ├── order.js
│   │   │   ├── species.js
│   │   │   └── index.js
│   │   ├── middlewares/             # 中间件
│   │   │   ├── auth.js              # 认证中间件
│   │   │   ├── error.js             # 错误处理
│   │   │   └── logger.js            # 日志中间件
│   │   ├── services/                # 业务逻辑层
│   │   │   ├── audioService.js
│   │   │   ├── userService.js
│   │   │   ├── orderService.js
│   │   │   └── paymentService.js
│   │   ├── utils/                   # 工具函数
│   │   │   ├── logger.js
│   │   │   ├── response.js
│   │   │   └── validator.js
│   │   └── app.js                   # Express 应用入口
│   ├── tests/                       # 测试文件
│   │   ├── unit/
│   │   └── integration/
│   ├── .env                         # 环境变量
│   ├── .eslintrc.js
│   ├── package.json
│   └── README.md
│
├── ☁️ cloudfunctions/                 # 微信云函数
│   ├── generateCertificate/         # 生成证书云函数
│   │   ├── index.js
│   │   └── package.json
│   ├── sendNotification/            # 发送通知云函数
│   │   ├── index.js
│   │   └── package.json
│   ├── contentModeration/           # 内容审核云函数
│   │   ├── index.js
│   │   └── package.json
│   └── syncData/                    # 数据同步云函数
│       ├── index.js
│       └── package.json
│
├── 🗄️ database/                      # 数据库相关
│   ├── migrations/                  # 数据库迁移脚本
│   │   ├── 001_initial_schema.sql
│   │   ├── 002_add_orders.sql
│   │   └── 003_add_certificates.sql
│   ├── seeds/                       # 种子数据
│   │   ├── species.sql
│   │   ├── audio.sql
│   │   └── zen_quotes.sql
│   └── README.md
│
├── 📚 docs/                          # 项目文档
│   ├── PRD_V2.0.0_COMPLETE.md      # 产品需求文档
│   ├── TECH_STACK.md               # 技术选型文档
│   ├── PROJECT_STRUCTURE.md        # 项目结构文档（本文档）
│   ├── SETUP_GUIDE.md              # 开发环境配置
│   ├── CODING_STANDARD.md          # 代码规范
│   ├── API_DOCUMENTATION.md        # API 接口文档
│   ├── DEPLOYMENT_GUIDE.md         # 部署指南
│   └── CHANGELOG.md                # 更新日志
│
├── 🚀 deploy/                        # 部署配置
│   ├── github-actions/              # GitHub Actions 配置
│   │   ├── deploy-api.yml
│   │   ├── deploy-admin.yml
│   │   └── test.yml
│   ├── pm2/                         # PM2 配置
│   │   ├── ecosystem.config.js
│   │   └── production.config.js
│   ├── nginx/                       # Nginx 配置
│   │   ├── production.conf
│   │   └── staging.conf
│   └── scripts/                     # 部署脚本
│       ├── deploy.sh
│       └── rollback.sh
│
├── 🧪 tests/                         # 测试文件
│   ├── e2e/                         # E2E 测试（Playwright）
│   │   ├── tests/
│   │   │   ├── audio.spec.js
│   │   │   ├── order.spec.js
│   │   │   └── user.spec.js
│   │   ├── fixtures/
│   │   └── playwright.config.js
│   └── unit/                        # 单元测试
│       ├── miniprogram/
│       └── api/
│
├── 🔧 scripts/                       # 工具脚本
│   ├── init-db.sh                   # 初始化数据库
│   ├── backup.sh                    # 数据备份
│   └── sync-cloud.sh                # 云数据库同步
│
├── .gitignore                       # Git 忽略配置
├── .eslintrc.js                     # ESLint 配置（根目录）
├── .prettierrc                      # Prettier 配置
├── package.json                     # 根目录 package.json
└── README.md                        # 项目说明
```

---

## 📂 核心目录说明

### 1. miniprogram/ - 小程序端

**技术栈**: 微信原生（WXML + WXSS + JavaScript）

**目录规范**:
- 每个页面一个独立目录，包含 `.js/.json/.wxml/.wxss` 四个文件
- 组件统一放在 `components/` 目录
- API 服务层放在 `services/` 目录，按业务模块划分
- 工具函数放在 `utils/` 目录

**页面列表**（共 15 个核心页面）:

| 页面路径 | 页面名称 | 对应 PRD 模块 | 优先级 |
|---------|---------|-------------|--------|
| pages/index/ | 梵音首页 | 6.2.1 首页展示 | P0 |
| pages/audio-player/ | 音频播放页 | 6.2.2 音频播放 | P0 |
| pages/zen/ | 禅理首页 1 | 6.3.1 双首页交互 | P0 |
| pages/zen-home/ | 禅理首页 2 | 6.3.1 双首页交互 | P0 |
| pages/daily-zen/ | 每日一禅 | 6.3.2 每日一禅 | P0 |
| pages/species-list/ | 物种列表 | 6.3.3 物种查询 | P0 |
| pages/species-detail/ | 物种详情 | 6.3.3 物种查询 | P0 |
| pages/calendar/ | 佛历吉日 | 6.3.4 佛历吉日 | P0 |
| pages/merit-forest/ | 护生功德林 | 6.3.5 护生功德林 | P0 |
| pages/certificate/ | 功德证书 | 6.3.6 功德证书 | P0 |
| pages/profile/ | 个人中心（祈福者） | 6.4 我的板块 | P0 |
| pages/volunteer-profile/ | 个人中心（志愿者） | 6.5 践行者端 | P0 |
| pages/org-profile/ | 个人中心（机构） | 6.6 机构端 | P0 |

---

### 2. admin-vue3/ - WEB 管理后台

**技术栈**: Vue 3 + Element Plus + Vite

**目录规范**:
- 采用 Vue 3 Composition API
- 状态管理使用 Pinia
- 路由使用 Vue Router 4.x
- HTTP 请求使用 Axios 封装

**核心页面**（共 6 个模块）:

| 页面路径 | 页面名称 | 对应 PRD 模块 | 优先级 |
|---------|---------|-------------|--------|
| views/dashboard/ | 控制台首页 | 7.2.1 控制台首页 | P0 |
| views/user/ | 用户管理 | 7.2.2 用户管理 | P0 |
| views/order/ | 订单管理 | 7.2.3 订单管理 | P0 |
| views/content/ | 内容管理 | 7.2.4 内容管理 | P0 |
| views/finance/ | 财务管理 | 7.2.5 财务管理 | P0 |
| views/system/ | 系统设置 | 7.2.6 系统设置 | P1 |

---

### 3. api/ - 后端 API

**技术栈**: Node.js + Express + MySQL

**目录规范**:
- MVC 架构（Model-View-Controller）
- 路由、控制器、服务层分离
- 中间件处理认证、日志、错误

**核心接口**（共 32 个接口）:

| 接口分类 | 接口数量 | 部署位置 |
|---------|---------|---------|
| 音频相关 | 4 个 | 火山云 Express |
| 用户相关 | 6 个 | 火山云 Express |
| 订单相关 | 8 个 | 火山云 Express |
| 物种相关 | 4 个 | 火山云 Express + 云函数 |
| 证书相关 | 3 个 | 云函数 |
| 通知相关 | 3 个 | 云函数 |
| 内容审核 | 4 个 | 云函数 |

---

### 4. cloudfunctions/ - 微信云函数

**技术栈**: Node.js + 微信云开发 SDK

**云函数列表**:

| 云函数名称 | 功能描述 | 触发方式 |
|-----------|---------|---------|
| generateCertificate | 生成护生圆满证书 | HTTP 调用 |
| sendNotification | 发送微信服务通知 | 定时触发 + HTTP |
| contentModeration | 内容安全审核 | 云调用触发 |
| syncData | MySQL 与云数据库同步 | 定时触发 |

---

### 5. database/ - 数据库

**技术栈**: MySQL 8.0 + 微信云数据库

**核心表结构**:

| 表名 | 描述 | 存储位置 |
|-----|------|---------|
| users | 用户信息表 | MySQL |
| orders | 订单表 | MySQL |
| species | 物种库表 | MySQL + 云数据库 |
| audio_records | 音频收听记录 | 云数据库 |
| certificates | 证书表 | MySQL + 云数据库 |
| zen_quotes | 禅理短句表 | MySQL + 云数据库 |
| check_in_records | 打卡记录表 | 云数据库 |

---

### 6. deploy/ - 部署配置

**部署工具**:
- GitHub Actions（CI/CD）
- PM2（进程管理）
- Nginx（反向代理）

**部署环境**:
- **Production**: 火山云服务器 101.96.192.63:3000
- **Staging**: 本地测试环境

---

### 7. tests/ - 测试文件

**测试框架**:
- E2E 测试：Playwright
- 单元测试：Vitest

**测试覆盖率要求**:
- 核心业务逻辑：≥ 80%
- API 接口：≥ 90%
- 页面组件：≥ 70%

---

## 📐 命名规范

### 目录命名
- ✅ 使用小写字母 + 连字符：`audio-player/`
- ❌ 禁止驼峰：`audioPlayer/`
- ❌ 禁止下划线：`audio_player/`

### 文件命名
- ✅ JavaScript: `userService.js`（小驼峰）
- ✅ Vue 组件：`UserCard.vue`（大驼峰）
- ✅ 样式文件：`variables.wxss`（小写）
- ✅ 配置文件：`vite.config.js`（小写）

### 页面命名
- ✅ 功能命名：`audio-player/`
- ✅ 统一风格：全项目使用功能命名
- ❌ 禁止混用：不使用设计稿编号命名

---

## 🎯 现有资产复用

### 可复用目录
- ✅ `backend/` - 若依框架（Java Spring Boot），保留作为参考
- ✅ `admin-pc/` - 现有 Vue 2 管理后台，逐步迁移
- ✅ `admin-h5/` - 移动应急 H5，保留
- ✅ `cloudfunctions/` - 现有云函数，直接复用
- ✅ `components/` - 公共组件，筛选复用
- ✅ `docs/` - 现有文档，整合更新

### 需重构目录
- 🔴 `miniprogram/` - 按新结构重构（页面实现率仅 33%）
- 🔴 `api-v3/` - 按新结构重构（Node.js Express）
- 🔴 `admin-pc/` - 升级到 Vue 3（新建 admin-vue3/）

---

## 📊 项目统计

| 指标 | 数量 | 状态 |
|------|------|------|
| 小程序页面 | 15 个 | 待实现 |
| 公共组件 | 10 个 | 待实现 |
| WEB 后台页面 | 6 个 | 待实现 |
| 后端 API 接口 | 32 个 | 部分实现 |
| 云函数 | 4 个 | 已实现 |
| 数据库表 | 10 个 | 部分实现 |
| E2E 测试用例 | 50+ 个 | 待实现 |

---

*文档创建时间*: 2026-04-16 10:52 UTC  
*最后更新*: 2026-04-16 10:52 UTC
