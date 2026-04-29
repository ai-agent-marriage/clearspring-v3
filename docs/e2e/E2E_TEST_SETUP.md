# E2E 测试配置指南

## 概述

本文档介绍 ClearSpring V3 小程序的 E2E（端到端）自动化测试配置。

## 技术栈

- **测试框架**: Playwright
- **语言**: TypeScript
- **浏览器**: Chromium
- **报告**: HTML 报告

## 目录结构

```
e2e/
├── fixtures/
│   └── test-fixtures.ts      # 测试夹具（测试用户、基础配置）
├── pages/
│   ├── home.page.ts          # 首页 Page Object
│   ├── login.page.ts         # 登录页 Page Object
│   ├── order.page.ts         # 订单页 Page Object
│   ├── profile.page.ts       # 个人中心 Page Object
│   └── executor.page.ts      # 执行者 Page Object
├── specs/
│   ├── login.spec.ts         # 登录流程测试
│   ├── order-flow.spec.ts    # 订单流程测试
│   └── admin.spec.ts         # 管理端测试
└── playwright.config.ts      # Playwright 配置
```

## 安装步骤

### 1. 安装依赖

```bash
cd /home/admin/.openclaw/workspace
npm install -D @playwright/test
npx playwright install chromium
```

### 2. 配置说明

`playwright.config.ts` 关键配置：

- `testDir`: 测试目录 (`./e2e`)
- `timeout`: 单个测试超时 (30000ms)
- `retries`: 失败重试次数 (2 次)
- `reporter`: HTML 报告
- `screenshot`: 仅在失败时截图
- `video`: 失败时保留视频
- `trace`: 失败时保留轨迹

### 3. 运行测试

#### 本地运行

```bash
# 运行所有测试
npx playwright test

# 运行特定测试文件
npx playwright test e2e/specs/login.spec.ts

# 运行特定测试用例
npx playwright test -g "TC001"

# 有头模式（查看浏览器）
npx playwright test --headed

# 调试模式
npx playwright test --debug
```

#### 查看测试报告

```bash
npx playwright show-report
```

## 测试用例说明

### P0 优先级（核心流程）

| 用例 ID | 测试场景 | 描述 |
|--------|---------|------|
| TC001 | 用户登录 | 打开小程序 → 授权登录 → 获取用户信息 → 进入首页 |
| TC002 | 用户信息验证 | 验证登录状态和首页访问 |
| TC003 | 服务浏览 | 首页 → 服务列表 → 服务详情 → 返回 |
| TC004 | 下单流程 | 选择服务 → 填写订单 → 提交 → 支付 → 成功 |
| TC005 | 订单查看 | 个人中心 → 我的订单 → 订单详情 → 查看证据 |
| TC006 | 执行者抢单 | 执行者首页 → 抢单大厅 → 抢单 → 提交证据 |

### P1 优先级（管理端）

| 用例 ID | 测试场景 | 描述 |
|--------|---------|------|
| TC007 | 管理后台登录 | 打开后台 → 输入账号密码 → 登录成功 |
| TC008 | 订单管理 | 订单列表 → 筛选订单 → 查看订单详情 |

## Page Object 模式

每个页面对应一个 Page Object 类，封装页面操作：

```typescript
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: /登录/i });
  }

  async login() {
    await this.loginButton.click();
  }
}
```

## 元素定位策略

优先使用以下定位方式（按优先级排序）：

1. `getByRole()` - 语义化角色
2. `getByLabel()` - 表单标签
3. `getByPlaceholder()` - 输入框占位符
4. `getByText()` - 文本内容
5. `getByTestId()` - 测试专用标识

## CI/CD 集成

GitHub Actions 配置在 `.github/workflows/e2e-tests.yml`：

- 在 `push` 和 `pull_request` 时自动触发
- 使用 Ubuntu latest 运行器
- 自动安装 Playwright 和 Chromium
- 上传测试报告和截图作为 artifact

## 常见问题

### 测试失败

1. 检查截图：`test-results/` 目录
2. 查看视频：失败测试的视频录像
3. 分析轨迹：使用 `npx playwright show-trace`

### 元素找不到

1. 增加等待：使用 `waitFor()` 代替 `sleep()`
2. 检查选择器：确保选择器准确
3. 查看截图：确认页面状态

### 测试不稳定

1. 避免硬编码等待
2. 使用确定性断言
3. 增加重试机制（已配置）

## 最佳实践

1. **测试隔离**: 每个测试用例独立，不依赖其他用例状态
2. **数据清理**: 测试后清理测试数据
3. **有意义命名**: 测试用例名称清晰描述测试内容
4. **证据保留**: 失败时自动保留截图、视频、轨迹
5. **定期审查**: 定期审查和更新测试用例

## 下一步

1. 运行测试：`npx playwright test`
2. 查看报告：`npx playwright show-report`
3. 持续集成：推送到 GitHub 自动运行
