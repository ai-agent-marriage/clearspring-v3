# 执行者端 E2E 测试配置指南

## 概述

本文档描述执行者端（Agent B）E2E 自动化测试的配置和使用方法。

## 测试范围

### P0 优先级流程（核心主流程）

1. **执行者登录流程** - 授权登录、资质验证
2. **抢单流程** - 抢单大厅、查看订单、抢单
3. **任务执行流程** - 任务助手、导航、开始任务
4. **证据提交流程** - 原生拍摄、添加水印、上传证据
5. **收入查看流程** - 收入统计、明细、提现

### P1 优先级流程（关键分支）

6. **资质管理流程** - 资质状态、更新资质、提交审核
7. **消息中心流程** - 查看通知、标记已读
8. **设置流程** - 隐私设置、外观设置、通知开关

## 目录结构

```
e2e-executor/
├── fixtures/
│   └── executor-fixtures.ts          # 测试数据 fixtures
├── pages/
│   ├── executor-login.page.ts        # 登录页
│   ├── executor-home.page.ts         # 首页
│   ├── order-hall.page.ts            # 抢单大厅
│   ├── task-assistant.page.ts        # 任务助手
│   ├── camera.page.ts                # 相机页面
│   ├── evidence.page.ts              # 证据提交页
│   ├── income.page.ts                # 收入管理页
│   ├── qualification.page.ts         # 资质管理页
│   ├── message-center.page.ts        # 消息中心页
│   └── settings.page.ts              # 设置页
├── specs/
│   ├── executor-login.spec.ts        # 登录测试
│   ├── grab-order.spec.ts            # 抢单测试
│   ├── execute-task.spec.ts          # 任务执行测试
│   ├── submit-evidence.spec.ts       # 证据提交测试
│   ├── income-flow.spec.ts           # 收入流程测试
│   ├── qualification-flow.spec.ts    # 资质流程测试
│   ├── message-center.spec.ts        # 消息中心测试
│   └── settings.spec.ts              # 设置测试
├── playwright.config.ts              # Playwright 配置
└── README.md
```

## 环境准备

### 1. 安装依赖

```bash
cd /root/.openclaw/workspace
npm install -D @playwright/test
npx playwright install chromium
```

### 2. 安装系统依赖（Linux）

```bash
npx playwright install-deps chromium
```

## 运行测试

### 本地运行

```bash
# 运行所有测试
cd e2e-executor
npx playwright test

# 运行特定测试文件
npx playwright test specs/executor-login.spec.ts

# 运行特定用例
npx playwright test -g "E2E-EXEC-001"

# 运行 P0 测试
npx playwright test --grep "@smoke"

# 有头模式运行
npx playwright test --headed

# 调试模式
npx playwright test --debug
```

### CI/CD 运行

GitHub Actions 会自动在以下场景运行测试：
- Push 到 main/develop 分支
- Pull Request
- 手动触发

## 配置说明

### Playwright 配置 (playwright.config.ts)

```typescript
export default defineConfig({
  testDir: './specs',
  timeout: 30 * 1000,
  retries: process.env.CI ? 2 : 0,
  reporter: [
    ['html', { outputFolder: '../playwright-report-executor' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'https://wx.qq.com',
    viewport: { width: 375, height: 812 },
    isMobile: true,
  },
});
```

### 环境变量

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| BASE_URL | 测试环境地址 | https://wx.qq.com |
| CI | 是否为 CI 环境 | false |

## 测试数据

测试数据定义在 `fixtures/executor-fixtures.ts` 中：

- `EXECUTOR_ACCOUNTS` - 执行者账号（有效、未认证、已冻结）
- `ORDER_DATA` - 订单数据（可抢、已抢）
- `TASK_DATA` - 任务数据（进行中、已完成）
- `EVIDENCE_DATA` - 证据数据（照片、视频）
- `INCOME_DATA` - 收入数据（汇总、明细）
- `QUALIFICATION_DATA` - 资质数据（有效、即将到期、过期）
- `MESSAGE_DATA` - 消息数据（通知、提醒）
- `SETTINGS_DATA` - 设置数据（隐私、外观、通知）

## Page Object 设计

每个页面对应一个 Page Object 类，包含：
- 元素定位器
- 页面操作方法
- 断言辅助方法

### 定位策略

1. 优先使用 `getByRole()` + 语义化名称
2. 其次使用 `getByLabel()`、`getByPlaceholder()`
3. 使用稳定的 `data-testid`
4. 避免使用动态 class 名

### 示例

```typescript
export class ExecutorLoginPage {
  readonly page: Page;
  readonly authorizeButton: Locator;
  readonly phoneNumberInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.authorizeButton = page.getByRole('button', { name: /授权登录/i });
    this.phoneNumberInput = page.getByLabel(/手机号/);
  }

  async loginWithPhone(phone: string, code: string) {
    await this.phoneNumberInput.fill(phone);
    // ...
  }
}
```

## 查看测试报告

测试完成后，HTML 报告会生成在 `playwright-report-executor/` 目录：

```bash
# 本地查看报告
npx playwright show-report ../playwright-report-executor
```

## 与 Agent A 协作

### 共享资源

- 使用相同的 Playwright 配置结构
- 共享 fixtures 测试数据格式
- 共享 GitHub Actions 工作流配置

### 职责划分

| Agent | 负责流程 |
|-------|----------|
| Agent A | 用户登录、服务浏览、下单、PC 后台管理 |
| Agent B | 执行者登录、抢单、任务执行、证据提交、收入管理 |

## 故障排查

### 常见问题

1. **浏览器安装失败**
   ```bash
   npx playwright install chromium --force
   ```

2. **系统依赖缺失**
   ```bash
   npx playwright install-deps chromium
   ```

3. **测试超时**
   - 增加 timeout 配置
   - 检查网络或环境

4. **元素定位失败**
   - 使用 `--debug` 模式调试
   - 检查页面加载状态
   - 使用确定性等待

## 最佳实践

1. **测试稳定性**
   - 使用确定性等待，避免 `sleep`
   - 使用稳定的元素定位器
   - 添加适当的重试机制

2. **测试数据**
   - 使用独立的测试数据
   - 避免依赖外部状态
   - 清理测试产生的数据

3. **错误处理**
   - 失败时自动截图
   - 保留 trace 和日志
   - 明确的错误信息

## 维护

- 定期更新测试用例
- 跟随产品迭代更新定位器
- 优化测试执行速度
- 清理废弃的测试

## 参考文档

- [Playwright 官方文档](https://playwright.dev)
- [E2E 测试报告模板](./E2E_EXECUTOR_TEST_REPORT.md)
- [测试用例模板](../../skills/e2e-test-orchestrator/references/case-template.md)
