# E2E 测试目录

ClearSpring V3 小程序的端到端自动化测试。

## 快速开始

```bash
# 运行所有测试
npm run test:e2e

# 有头模式运行（查看浏览器）
npm run test:e2e:headed

# 调试模式
npm run test:e2e:debug

# 查看测试报告
npm run test:e2e:report
```

## 目录结构

- `fixtures/` - 测试夹具（基础配置、测试数据）
- `pages/` - Page Object 类（页面操作封装）
- `specs/` - 测试用例（具体测试场景）

## 测试用例

详见 [E2E_TEST_SETUP.md](../docs/e2e/E2E_TEST_SETUP.md)
