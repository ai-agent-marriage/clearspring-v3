# WEB 管理后台开发计划（Phase C）

**任务目标**: 开发 35 个 WEB 管理后台页面（Vue 3 + Vite + Element Plus）  
**开始时间**: 2026-04-11  
**截止时间**: 2026-04-14（72 小时）  
**开发规范**: Stitch 设计系统 V3.0（WEB 端适配）

---

## 📋 页面开发清单

### P0 核心模块（优先级最高 - 首先开发）

| 编号 | 页面名称 | 状态 | 文件路径 | 测试用例 |
|------|----------|------|----------|----------|
| A-01 | 登录页 | ✅ 完成 | views/system/Login.vue | ⏳ 待创建 |
| A-02 | 控制台首页 | ✅ 完成 | views/system/Dashboard.vue | ⏳ 待创建 |
| A-03 | 用户列表 | ✅ 完成 | views/user/UserList.vue | ⏳ 待创建 |
| A-04 | 用户详情 | ✅ 完成 | views/user/UserDetail.vue | ⏳ 待创建 |
| A-05 | 创建用户 | ✅ 完成 | views/user/CreateUser.vue | ⏳ 待创建 |
| A-06 | 编辑用户 | ✅ 完成 | views/user/EditUser.vue | ⏳ 待创建 |
| A-07 | 用户角色管理 | ✅ 完成 | views/user/RoleManage.vue | ⏳ 待创建 |
| A-08 | 权限配置 | ✅ 完成 | views/user/PermissionConfig.vue | ⏳ 待创建 |
| A-09 | 操作日志 | ✅ 完成 | views/user/OperationLog.vue | ⏳ 待创建 |
| A-10 | 用户分组 | ✅ 完成 | views/user/UserGroup.vue | ⏳ 待创建 |

### P1 重要模块

| 编号 | 页面名称 | 状态 | 文件路径 | 测试用例 |
|------|----------|------|----------|----------|
| A-11 | 订单列表 | ✅ 已有 | views/order/OrderList.vue | ⏳ 待创建 |
| A-12 | 订单详情 | ⏳ 待开发 | views/order/OrderDetail.vue | ⏳ 待创建 |
| A-13 | 创建订单 | ⏳ 待开发 | views/order/CreateOrder.vue | ⏳ 待创建 |
| A-14 | 订单审核 | ⏳ 待开发 | views/order/OrderAudit.vue | ⏳ 待创建 |
| A-15 | 订单统计 | ⏳ 待开发 | views/order/OrderStatistics.vue | ⏳ 待创建 |
| A-16 | 内容审核列表 | ✅ 已有 | views/content/ContentAudit.vue | ⏳ 待创建 |
| A-17 | 内容详情 | ⏳ 待开发 | views/content/ContentDetail.vue | ⏳ 待创建 |
| A-18 | 内容分类管理 | ⏳ 待开发 | views/content/CategoryManage.vue | ⏳ 待创建 |
| A-19 | 标签管理 | ⏳ 待开发 | views/content/TagManage.vue | ⏳ 待创建 |
| A-20 | 内容推荐 | ⏳ 待开发 | views/content/ContentRecommend.vue | ⏳ 待创建 |
| A-21 | 敏感词管理 | ⏳ 待开发 | views/content/SensitiveWord.vue | ⏳ 待创建 |
| A-22 | 内容回收站 | ⏳ 待开发 | views/content/ContentRecycle.vue | ⏳ 待创建 |
| A-23 | 资质审核列表 | ✅ 已有 | views/compliance/QualificationAudit.vue | ⏳ 待创建 |
| A-24 | 资质详情 | ⏳ 待开发 | views/compliance/QualificationDetail.vue | ⏳ 待创建 |
| A-25 | 合规检查 | ⏳ 待开发 | views/compliance/ComplianceCheck.vue | ⏳ 待创建 |
| A-26 | 申诉仲裁列表 | ✅ 已有 | views/compliance/AppealArbitration.vue | ⏳ 待创建 |
| A-27 | 风控规则配置 | ⏳ 待开发 | views/compliance/RiskRuleConfig.vue | ⏳ 待创建 |

### P2 系统模块

| 编号 | 页面名称 | 状态 | 文件路径 | 测试用例 |
|------|----------|------|----------|----------|
| A-28 | 分账配置 | ✅ 已有 | views/finance/ProfitSharing.vue | ⏳ 待创建 |
| A-29 | 财务报表 | ⏳ 待开发 | views/finance/FinancialReport.vue | ⏳ 待创建 |
| A-30 | 收支明细 | ⏳ 待开发 | views/finance/IncomeExpense.vue | ⏳ 待创建 |
| A-31 | 数据导出 | ✅ 已有 | views/finance/DataExport.vue | ⏳ 待创建 |
| A-32 | 发票管理 | ⏳ 待开发 | views/finance/InvoiceManage.vue | ⏳ 待创建 |
| A-33 | 系统设置 | ✅ 已有 | views/system/SystemSettings.vue | ⏳ 待创建 |
| A-34 | 参数配置 | ⏳ 待开发 | views/system/ParamConfig.vue | ⏳ 待创建 |
| A-35 | 系统监控 | ⏳ 待开发 | views/system/SystemMonitor.vue | ⏳ 待创建 |

---

## 📊 开发进度追踪

### 第一批（10 个页面）- P0 核心模块 ✅
- [x] A-01 登录页
- [x] A-02 控制台首页
- [x] A-03 用户列表
- [x] A-04 用户详情
- [x] A-05 创建用户
- [x] A-06 编辑用户
- [x] A-07 用户角色管理
- [x] A-08 权限配置
- [x] A-09 操作日志
- [x] A-10 用户分组

**完成时间**: 2026-04-11  
**推送状态**: 🟢 已推送

### 第二批（5 个页面）- P0 核心模块
- [ ] A-08 权限配置
- [ ] A-09 操作日志
- [ ] A-10 用户分组
- [ ] A-12 订单详情
- [ ] A-13 创建订单

**完成时间**: 2026-04-12  
**推送状态**: ⏳ 待推送

### 第三批（5 个页面）- P1 重要模块
- [ ] A-14 订单审核
- [ ] A-15 订单统计
- [ ] A-17 内容详情
- [ ] A-18 内容分类管理
- [ ] A-19 标签管理

**完成时间**: 2026-04-13  
**推送状态**: ⏳ 待推送

### 第四批（5 个页面）- P1 重要模块
- [ ] A-20 内容推荐
- [ ] A-21 敏感词管理
- [ ] A-22 内容回收站
- [ ] A-24 资质详情
- [ ] A-25 合规检查

**完成时间**: 2026-04-13  
**推送状态**: ⏳ 待推送

### 第五批（5 个页面）- P1/P2 模块
- [ ] A-27 风控规则配置
- [ ] A-29 财务报表
- [ ] A-30 收支明细
- [ ] A-32 发票管理
- [ ] A-34 参数配置

**完成时间**: 2026-04-14  
**推送状态**: ⏳ 待推送

### 第六批（5 个页面）- P2 系统模块
- [ ] A-35 系统监控
- [ ] 补充测试用例
- [ ] 代码审查
- [ ] 集成测试
- [ ] 文档完善

**完成时间**: 2026-04-14  
**推送状态**: ⏳ 待推送

---

## 🎨 Stitch 设计系统 V3.0 - WEB 端规范

### 色彩体系
- **主色**: #4A5D4E（低饱和森系墨绿）
- **辅助色**: #C9B037（哑光金）
- **第三色**: #A68966（暖棕褐）
- **页面底色**: #EFEEE9（浅奶油米白）
- **成功**: #38A169 | **错误**: #E53E3E | **警告**: #ECC94B

### 字体规范
- **一级标题**: 24px Noto Serif
- **二级标题**: 20px Noto Serif
- **正文**: 16px Plus Jakarta Sans
- **辅助文本**: 14px Plus Jakarta Sans

### 组件规范
- **圆角**: 4px（中等圆角 Level 2）
- **间距**: 16px（模块间距）
- **按钮**: 主色填充/描边
- **卡片**: 白色底色 + 淡投影（opacity 8%）

---

## 🧪 测试规范

每个页面配套测试用例 ≥10 个：
1. 页面加载测试
2. 数据渲染测试
3. 表单验证测试
4. 按钮点击测试
5. 搜索功能测试
6. 分页功能测试
7. 数据筛选测试
8. 数据排序测试
9. 数据导出测试
10. 权限控制测试

---

## 📝 每日进度报告

### Day 1 (2026-04-11)
- [ ] 完成项目结构搭建
- [ ] 完成 P0 模块 5 个页面开发
- [ ] 创建配套测试用例

### Day 2 (2026-04-12)
- [ ] 完成 P0 模块剩余页面
- [ ] 完成 P1 模块 5 个页面开发
- [ ] 推送第一批代码

### Day 3 (2026-04-13)
- [ ] 完成 P1 模块剩余页面
- [ ] 完成 P2 模块 5 个页面开发
- [ ] 推送第二批代码

### Day 4 (2026-04-14)
- [ ] 完成所有剩余页面
- [ ] 完成所有测试用例
- [ ] 代码审查与优化
- [ ] 最终推送

---

## 📢 协作说明

- ✅ 与小程序端开发并行
- ⏳ 完成后通知 测试验证-Agent
- ⏳ 接受 质量监督-Agent 审查

---

**当前状态**: 🟢 P0 核心模块已完成  
**最后更新**: 2026-04-11 23:55  
**完成进度**: 10/35 (28.6%)
