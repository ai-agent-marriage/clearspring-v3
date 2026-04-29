# 清如 ClearSpring - 管理端开发文档

## 项目概述

清如 ClearSpring 管理端包含两个独立应用：
- **PC 管理后台**：完整的后台管理系统（9 个页面）
- **移动应急 H5**：移动端简化版应急审核工具（2 个页面）

## 技术栈

### 共同技术栈
- React 18.2
- Vite 5.0
- Tailwind CSS 3.3
- React Router 6.20

### PC 端特有
- ECharts 5.4（数据可视化）

## 设计规范

### 配色方案
```css
/* 岱绿系主色 */
--dailv-primary: #4A5D4E
--dailv-dark: #334537
--dailv-light: #6B7D6E
--dailv-lighter: #8A9A8B

/* 状态色 */
--status-success: #52C41A
--status-warning: #FAAD14
--status-error: #F5222D
--status-info: #1890FF
```

### 核心规范
- ✅ 纯白底 #FFFFFF
- ✅ 岱绿系配色 #4A5D4E/#334537
- ❌ 禁止禅意/宣纸元素（办公场景）
- ✅ 敏感信息强制脱敏（身份证/手机号）
- ✅ 关键操作二次验证 + 审计日志
- ✅ ECharts 图表，状态色统一

## PC 管理后台页面

### 1. 管理员登录页 (`/login`)
- 极简办公风设计
- 用户名/密码/验证码登录
- 登录审计日志

### 2. 控制台总览 (`/dashboard`)
- 数据卡片（订单数、待审核、待仲裁、活跃执行者）
- ECharts 订单趋势图（近 7 日）
- ECharts 执行者等级分布图
- 收入概览
- 5 分钟自动轮询刷新

### 3. 订单管理页 (`/orders`)
- 订单列表 + 多条件筛选
- 执行者信息脱敏显示
- 批量选择导出
- 分页功能

### 4. 资质审核页 (`/qualifications`)
- 待审核列表
- 资质证书展示
- 通过/驳回操作
- 驳回原因必填
- 二次验证弹窗
- 审计日志记录

### 5. 申诉仲裁页 (`/appeals`)
- 申诉案件列表
- 双方证据对比展示
- 仲裁决定输入
- 仲裁结果选择（全额退款/部分退款/不予退款/额外补偿）
- 二次验证 + 审计日志

### 6. 分账配置页 (`/profit-sharing`)
- 平台分成比例滑块配置
- 执行者分成范围配置
- 订单金额限制
- 提现配置
- 修改原因必填
- 操作历史记录

### 7. 执行者管理页 (`/executors`)
- 执行者列表 + 筛选
- 详情弹窗（完整信息）
- 敏感信息脱敏
- 封禁/解封操作
- 数据统计展示

### 8. 数据导出页 (`/export`)
- 多类型数据导出（审计日志/订单/执行者等）
- 日期范围选择
- 格式选择（Excel/CSV）
- 敏感数据脱敏选项
- 导出历史记录

### 9. 系统设置页 (`/settings`)
- 角色权限配置（标签页）
- 管理员列表（标签页）
- 审计日志查看（标签页）
- 权限细粒度控制
- 操作二次验证

## 移动应急 H5 页面

### 1. 资质审核 H5 (`/qualifications`)
- 移动端简化版
- 卡片式信息展示
- 进度条指示
- 通过/驳回操作
- 驳回原因必填
- 审计日志记录

### 2. 申诉仲裁 H5 (`/appeals`)
- 移动端简化版
- 双方信息切换查看
- 仲裁结果选择
- 仲裁说明输入
- 二次验证
- 审计日志记录

## 项目结构

```
clearspring/
├── admin-pc/                    # PC 管理后台
│   ├── src/
│   │   ├── components/          # 公共组件
│   │   │   └── Sidebar.jsx      # 侧边栏导航
│   │   ├── pages/               # 页面组件
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── OrderManagement.jsx
│   │   │   ├── QualificationReview.jsx
│   │   │   ├── AppealArbitration.jsx
│   │   │   ├── ProfitSharingConfig.jsx
│   │   │   ├── ExecutorManagement.jsx
│   │   │   ├── DataExport.jsx
│   │   │   └── SystemSettings.jsx
│   │   ├── styles/
│   │   │   └── index.css        # 全局样式
│   │   ├── App.jsx              # 路由配置
│   │   └── main.jsx             # 入口文件
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── admin-h5/                    # 移动应急 H5
    ├── src/
    │   ├── pages/
    │   │   ├── QualificationReviewH5.jsx
    │   │   └── AppealArbitrationH5.jsx
    │   ├── styles/
    │   │   └── index.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    └── postcss.config.js
```

## 开发指南

### 安装依赖

```bash
# PC 端
cd admin-pc
npm install

# H5 端
cd admin-h5
npm install
```

### 启动开发服务器

```bash
# PC 端 (http://localhost:3001)
npm run dev

# H5 端 (http://localhost:3002)
npm run dev
```

### 构建生产版本

```bash
# PC 端
npm run build

# H5 端
npm run build
```

## 安全特性

### 敏感信息脱敏
- 手机号：`138****5678`
- 身份证：`110101********1234`
- 邮箱：`li***@example.com`
- 执行者姓名：`李**`

### 审计日志
所有关键操作均记录审计日志，包括：
- 登录/登出
- 资质审核（通过/驳回）
- 申诉仲裁
- 分账配置修改
- 执行者封禁/解封
- 数据导出
- 角色权限修改

### 二次验证
以下操作需要二次验证：
- 资质审核通过/驳回
- 申诉仲裁决定
- 分账配置修改
- 角色权限修改
- 执行者封禁

## 提交历史

```
f20e810 feat: 完成移动应急 H5 全部 2 个页面
9b039e1 feat: 完成 PC 管理后台全部 9 个页面
0da3a0c feat: 完成 PC 管理后台第 4-6 页
76e6f6a feat: 完成 PC 管理后台前 3 个页面
```

## 联系方式

- 项目：清如 ClearSpring
- 版本：1.0.0
- 开发时间：2026-03-28
