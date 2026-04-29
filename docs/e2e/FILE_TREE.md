# E2E 测试文件树

```
/home/admin/.openclaw/workspace/
│
├── 📄 playwright.config.ts                    # Playwright 主配置
├── 📄 package.json                            # 已添加测试脚本
├── 📄 .gitignore                              # 已添加测试产物排除
│
├── 📁 e2e/                                    # E2E 测试目录
│   ├── 📄 README.md                           # E2E 目录说明
│   ├── 📄 tsconfig.json                       # TypeScript 配置
│   │
│   ├── 📁 fixtures/                           # 测试夹具
│   │   └── 📄 test-fixtures.ts                # 测试用户、基础配置
│   │
│   ├── 📁 pages/                              # Page Objects
│   │   ├── 📄 login.page.ts                   # 登录页 (719 bytes)
│   │   ├── 📄 home.page.ts                    # 首页 (1,013 bytes)
│   │   ├── 📄 order.page.ts                   # 订单页 (1,964 bytes)
│   │   ├── 📄 profile.page.ts                 # 个人中心 (804 bytes)
│   │   └── 📄 executor.page.ts                # 执行者页 (1,509 bytes)
│   │
│   └── 📁 specs/                              # 测试用例
│       ├── 📄 login.spec.ts                   # 登录测试 (1,034 bytes)
│       │   - TC001: 用户打开小程序并授权登录
│       │   - TC002: 获取用户信息并进入首页
│       │
│       ├── 📄 order-flow.spec.ts              # 订单流程测试 (2,887 bytes)
│       │   - TC003: 服务浏览流程
│       │   - TC004: 下单流程
│       │   - TC005: 订单查看流程
│       │   - TC006: 执行者抢单流程
│       │
│       └── 📄 admin.spec.ts                   # 管理端测试 (1,554 bytes)
│           - TC007: PC 管理后台登录
│           - TC008: 订单管理
│
├── 📁 .github/
│   └── 📁 workflows/
│       └── 📄 e2e-tests.yml                   # GitHub Actions CI/CD (1,000 bytes)
│
├── 📁 docs/
│   └── 📁 e2e/                                # E2E 文档
│       ├── 📄 E2E_TEST_SETUP.md               # 配置指南 (3,001 bytes)
│       ├── 📄 E2E_TEST_REPORT.md              # 测试报告模板 (2,429 bytes)
│       ├── 📄 IMPLEMENTATION_SUMMARY.md       # 实施总结 (4,682 bytes)
│       └── 📄 FILE_TREE.md                    # 本文件
│
└── 📁 scripts/                                # 运行脚本
    ├── 📄 run-playwright.sh                   # 本地运行 (324 bytes)
    ├── 📄 run-playwright-docker.sh            # Docker 模式 (511 bytes)
    └── 📄 run-playwright-auto.sh              # 自动选择 (566 bytes)
```

## 文件统计

| 类别 | 数量 | 说明 |
|------|------|------|
| 配置文件 | 3 | playwright.config.ts, tsconfig.json, test-fixtures.ts |
| Page Objects | 5 | login, home, order, profile, executor |
| 测试用例 | 3 | login.spec, order-flow.spec, admin.spec |
| CI/CD | 1 | e2e-tests.yml |
| 文档 | 4 | SETUP, REPORT, SUMMARY, FILE_TREE |
| 脚本 | 3 | local, docker, auto |
| **总计** | **19** | |

## 测试用例覆盖

| 优先级 | 用例数 | 覆盖流程 |
|--------|--------|---------|
| P0 | 6 | 登录、服务浏览、下单、订单查看、执行者抢单 |
| P1 | 2 | 管理后台登录、订单管理 |
| **总计** | **8** | **7 个核心流程** |

## 快速命令

```bash
# 运行所有测试
npm run test:e2e

# 查看报告
npm run test:e2e:report

# 调试模式
npm run test:e2e:debug
```

---

**生成时间**: 2026-04-12 23:40
**版本**: v1.0
