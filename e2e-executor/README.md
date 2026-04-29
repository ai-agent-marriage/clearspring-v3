# 执行者端 E2E 测试

执行者端（Agent B）端到端自动化测试套件，基于 Playwright + TypeScript。

## 快速开始

### 安装依赖

```bash
npm install -D @playwright/test
npx playwright install chromium
```

### 运行测试

```bash
# 运行所有测试
npx playwright test

# 运行特定测试
npx playwright test specs/executor-login.spec.ts

# 运行 P0 测试
npx playwright test --grep "@smoke"

# 查看报告
npx playwright show-report ../playwright-report-executor
```

## 测试覆盖

| 模块 | 用例数 | 优先级 |
|------|--------|--------|
| 执行者登录 | 5 | P0 |
| 抢单流程 | 7 | P0 |
| 任务执行 | 7 | P0 |
| 证据提交 | 7 | P0 |
| 收入查看 | 7 | P0 |
| 资质管理 | 7 | P1 |
| 消息中心 | 9 | P1 |
| 设置流程 | 11 | P1 |

**总计**: 48 个测试用例

## 目录结构

```
e2e-executor/
├── fixtures/           # 测试数据
├── pages/              # Page Objects
├── specs/              # 测试用例
├── playwright.config.ts
└── README.md
```

## 文档

- [配置指南](../../docs/e2e/E2E_EXECUTOR_TEST_SETUP.md)
- [测试报告](../../docs/e2e/E2E_EXECUTOR_TEST_REPORT.md)

## CI/CD

测试集成到 GitHub Actions：
- Push 到 main/develop 自动运行
- Pull Request 自动运行
- 生成 HTML 报告

## 与 Agent A 协作

- **Agent A**: 用户端 + PC 后台测试
- **Agent B**: 执行者端测试（本目录）

共享配置和 fixtures，形成完整 E2E 测试覆盖。
