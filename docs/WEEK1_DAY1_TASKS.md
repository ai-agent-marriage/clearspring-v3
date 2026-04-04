# Week 1 Day 1 任务清单

> **日期**: 2026-04-07  
> **阶段**: Phase 1 - 环境搭建与基础能力  
> **今日目标**: 完成项目初始化，搭建开发环境  
> **负责人**: Orchestrator + 前端开发-Agent + 后端开发-Agent

---

## 📋 今日任务清单（6 个任务）

### Task 1: 创建小程序项目骨架 ⭐⭐⭐

**负责人**: 前端开发-Agent  
**工时**: 4 小时  
**优先级**: P0

**工作包**:
- [ ] 1.1 创建 miniprogram/ 目录结构
  ```bash
  cd /root/.openclaw/workspace
  mkdir -p miniprogram/{pages,components,utils,assets,styles}
  ```

- [ ] 1.2 创建 7 个页面目录
  ```bash
  cd miniprogram/pages
  mkdir -p index audio zen protect order user volunteer
  ```

- [ ] 1.3 创建 app.js（全局入口）
  - 文件路径：`miniprogram/app.js`
  - 内容：App 配置 + 微信登录初始化
  - **验收**: 可编译运行

- [ ] 1.4 创建 app.json（全局配置）
  - 文件路径：`miniprogram/app.json`
  - 内容：pages 路由 + window 配置 + tabBar
  - **验收**: 路由配置正确

- [ ] 1.5 创建 app.wxss（全局样式）
  - 文件路径：`miniprogram/app.wxss`
  - 内容：禅意样式（背景色/字体/按钮）
  - **验收**: 样式正常

- [ ] 1.6 创建 config.js（全局配置）
  - 文件路径：`miniprogram/config.js`
  - 内容：baseUrl/version/forbidTip
  - **验收**: 配置正确

**交付物**:
- ✅ miniprogram/ 目录结构
- ✅ app.js app.json app.wxss
- ✅ config.js
- ✅ 7 个页面目录（index/audio/zen/protect/order/user/volunteer）

**验收标准**:
- ✅ 目录结构正确
- ✅ 全局文件创建完成
- ✅ 微信开发者工具可编译运行
- ✅ 代码提交 Git（commit ≥1）

---

### Task 2: 创建后端项目骨架 ⭐⭐⭐

**负责人**: 后端开发-Agent  
**工时**: 4 小时  
**优先级**: P0

**工作包**:
- [ ] 2.1 克隆 RuoYi-Vue 框架
  ```bash
  cd /root/.openclaw/workspace
  git clone https://github.com/yangzongzhuan/RuoYi-Vue.git backend
  ```

- [ ] 2.2 配置数据库连接
  - 文件路径：`backend/ruoyi-admin/src/main/resources/application.yml`
  - 配置：MySQL 连接（localhost:3306/qingru_app）
  - **验收**: 数据库连接成功

- [ ] 2.3 配置 Redis 缓存
  - 文件路径：同上
  - 配置：Redis 连接（localhost:6379）
  - **验收**: Redis 连接成功

- [ ] 2.4 配置 WxJava 微信 SDK
  - 添加 Maven 依赖（pom.xml）
  - 配置 application.yml（AppID/Secret）
  - **验收**: WxJava 配置正确

- [ ] 2.5 创建项目包结构
  ```bash
  cd backend/ruoyi-admin/src/main/java/com/ruoyi
  mkdir -p qingru/{controller/service/mapper/entity/config}
  ```

**交付物**:
- ✅ backend/ 目录（RuoYi-Vue 框架）
- ✅ application.yml（数据库/Redis/WxJava 配置）
- ✅ 项目包结构

**验收标准**:
- ✅ RuoYi-Vue 框架克隆成功
- ✅ 数据库连接配置正确
- ✅ Redis 配置正确
- ✅ WxJava 配置正确
- ✅ 项目可启动
- ✅ 代码提交 Git（commit ≥1）

---

### Task 3: 创建 WEB 后台项目骨架 ⭐⭐

**负责人**: 前端开发-Agent  
**工时**: 3 小时  
**优先级**: P1

**工作包**:
- [ ] 3.1 克隆 vue-element-admin 模板
  ```bash
  cd /root/.openclaw/workspace
  git clone https://github.com/PanJiaChen/vue-element-admin.git admin-web
  ```

- [ ] 3.2 配置路由和权限
  - 文件路径：`admin-web/src/router/index.js`
  - 配置：清如后台路由
  - **验收**: 路由配置正确

- [ ] 3.3 配置 API 请求封装
  - 文件路径：`admin-web/src/utils/request.js`
  - 配置：axios 封装 + 拦截器
  - **验收**: API 请求正常

- [ ] 3.4 修改项目配置
  - 文件路径：`admin-web/vue.config.js`
  - 配置：项目名称/端口/代理
  - **验收**: 项目可运行

**交付物**:
- ✅ admin-web/ 目录（vue-element-admin 模板）
- ✅ 路由配置
- ✅ API 请求封装

**验收标准**:
- ✅ vue-element-admin 克隆成功
- ✅ 路由配置正确
- ✅ API 请求封装正确
- ✅ 项目可运行（npm run dev）
- ✅ 代码提交 Git（commit ≥1）

---

### Task 4: 配置 Git 分支策略 ⭐⭐

**负责人**: Orchestrator  
**工时**: 2 小时  
**优先级**: P1

**工作包**:
- [ ] 4.1 创建 main 分支（生产）
  ```bash
  git branch -m master main
  git push -u origin main
  ```

- [ ] 4.2 创建 dev 分支（开发）
  ```bash
  git checkout -b dev
  git push -u origin dev
  ```

- [ ] 4.3 配置 Git Hooks
  - 创建 .git/hooks/pre-commit
  - 配置 ESLint 检查
  - **验收**: 提交前自动检查

- [ ] 4.4 创建 .gitignore 文件
  - 文件路径：`.gitignore`
  - 内容：node_modules/ dist/ *.log 等
  - **验收**: 忽略规则正确

**交付物**:
- ✅ main 分支（生产）
- ✅ dev 分支（开发）
- ✅ Git Hooks 配置
- ✅ .gitignore 文件

**验收标准**:
- ✅ 分支策略配置完成
- ✅ Git Hooks 正常工作
- ✅ .gitignore 配置正确
- ✅ 代码提交 Git（commit ≥1）

---

### Task 5: 配置开发工具链 ⭐

**负责人**: 测试-Agent  
**工时**: 2 小时  
**优先级**: P2

**工作包**:
- [ ] 5.1 安装 ESLint + Prettier
  ```bash
  cd /root/.openclaw/workspace/miniprogram
  npm install --save-dev eslint prettier
  ```

- [ ] 5.2 配置代码格式化规则
  - 文件路径：`.eslintrc.js` `.prettierrc`
  - 配置：小程序代码规范
  - **验收**: 规则配置正确

- [ ] 5.3 配置提交前检查
  - 文件路径：`.git/hooks/pre-commit`
  - 配置：Lint 检查 + Test 检查
  - **验收**: 提交前自动检查

- [ ] 5.4 测试工具链
  - 执行：`npm run lint`
  - 执行：`npm run format`
  - **验收**: 工具链正常工作

**交付物**:
- ✅ ESLint + Prettier 安装
- ✅ 代码格式化规则
- ✅ 提交前检查配置

**验收标准**:
- ✅ ESLint 安装成功
- ✅ Prettier 安装成功
- ✅ 代码格式化正常
- ✅ 提交前检查正常
- ✅ 代码提交 Git（commit ≥1）

---

### Task 6: 首次代码提交 ⭐⭐⭐

**负责人**: Orchestrator  
**工时**: 1 小时  
**优先级**: P0

**工作包**:
- [ ] 6.1 检查所有任务完成情况
  - Task 1: 小程序项目骨架 ✅
  - Task 2: 后端项目骨架 ✅
  - Task 3: WEB 后台项目骨架 ✅
  - Task 4: Git 分支策略 ✅
  - Task 5: 开发工具链 ✅

- [ ] 6.2 执行 Git 提交
  ```bash
  cd /root/.openclaw/workspace
  git add .
  git commit -m "init: ClearSpring V3 项目初始化
  
  - 创建小程序项目骨架（miniprogram/）
  - 创建后端项目骨架（backend/ RuoYi-Vue）
  - 创建 WEB 后台项目骨架（admin-web/ vue-element-admin）
  - 配置 Git 分支策略（main/dev）
  - 配置开发工具链（ESLint/Prettier/Git Hooks）
  
  🚀 V3 开发正式启动"
  git push origin main
  ```

- [ ] 6.3 创建 Day 1 进度报告（飞书文档）
  - 使用 feishu_create_doc
  - 内容：Day 1 完成情况 + 明日计划
  - **验收**: 报告发送到对话框

**交付物**:
- ✅ Git 提交（init commit）
- ✅ Day 1 进度报告（飞书文档）

**验收标准**:
- ✅ 所有任务完成
- ✅ Git 提交成功
- ✅ 进度报告发送

---

## 📊 今日统计

| 指标 | 目标值 | 实际值 | 状态 |
|------|--------|--------|------|
| **任务数** | 6 | - | ⏳ 进行中 |
| **工作包数** | 25 | - | ⏳ 进行中 |
| **工时** | 16 小时 | - | ⏳ 进行中 |
| **Git 提交** | ≥4 次 | - | ⏳ 进行中 |
| **文档** | 1 份（进度报告） | - | ⏳ 进行中 |

---

## 🚀 多 Agent 协同启动

### 需要创建的子 Agent

1. **前端开发-Agent**
   - 职责：小程序端 + WEB 后台前端
   - 技能：微信小程序/Vue/ES6
   - 任务：Task 1 + Task 3

2. **后端开发-Agent**
   - 职责：后端接口 + 数据库
   - 技能：Java/Spring Boot/MySQL
   - 任务：Task 2

3. **测试-Agent**
   - 职责：环境验证 + 工具链测试
   - 技能：Jest/单元测试
   - 任务：Task 5

4. **Orchestrator**（我）
   - 职责：任务分配 + 进度跟踪 + 质量审查
   - 任务：Task 4 + Task 6

---

### 协同流程

```
Orchestrator (我)
  ↓ 创建子 Agent
前端开发-Agent → Task 1 + Task 3
后端开发-Agent → Task 2
测试-Agent → Task 5
  ↓ 并行执行
各 Agent 执行任务
  ↓ 进度同步
每日站会（飞书文档）
  ↓ 代码审查
Orchestrator 审查 + 合并
  ↓ 提交
Task 6: 首次代码提交
```

---

## ⏰ 时间计划

| 时间段 | 任务 | 负责人 |
|--------|------|--------|
| **09:00-10:00** | 启动会议 + 任务分配 | Orchestrator |
| **10:00-12:00** | Task 1: 小程序项目骨架 | 前端开发-Agent |
| **10:00-12:00** | Task 2: 后端项目骨架 | 后端开发-Agent |
| **13:00-15:00** | Task 3: WEB 后台项目骨架 | 前端开发-Agent |
| **15:00-16:00** | Task 4: Git 分支策略 | Orchestrator |
| **15:00-16:00** | Task 5: 开发工具链 | 测试-Agent |
| **16:00-17:00** | Task 6: 首次代码提交 | Orchestrator |
| **17:00-18:00** | 进度报告 + 明日计划 | Orchestrator |

---

## ✅ 验收清单

- [ ] 小程序项目骨架创建完成
- [ ] 后端项目骨架创建完成
- [ ] WEB 后台项目骨架创建完成
- [ ] Git 分支策略配置完成
- [ ] 开发工具链配置完成
- [ ] 首次代码提交成功
- [ ] Day 1 进度报告发送

---

*清如 V3 · Week 1 Day 1 任务清单* 🌊

**准备就绪，等待你的确认，我立即启动多 Agent 协同开发！** 🚀
