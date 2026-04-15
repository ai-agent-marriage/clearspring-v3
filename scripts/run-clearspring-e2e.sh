#!/bin/bash

# ClearSpring V3 E2E 测试运行脚本
# 自动运行所有 P0 优先级测试用例

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "========================================="
echo "🚀 ClearSpring V3 E2E 测试"
echo "========================================="
echo "📍 工作目录：$PROJECT_ROOT"
echo "📅 执行时间：$(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 创建测试结果目录
mkdir -p test-results
mkdir -p playwright-report

# 运行 P0 核心流程测试
echo "📋 运行 P0 核心流程测试..."
echo ""

npx playwright test \
  --config=./e2e/playwright.config.ts \
  --project=chromium \
  --reporter=list,html,json \
  --output=./test-results \
  ./e2e/specs/prayer-core-flow.spec.ts \
  ./e2e/specs/species-order-flow.spec.ts \
  ./e2e/specs/merit-forest-certificate.spec.ts \
  ./e2e/specs/executor-grab-order.spec.ts \
  ./e2e/specs/executor-qualification-income.spec.ts \
  ./e2e/specs/admin-order-qualification.spec.ts \
  ./e2e/specs/admin-financial-export.spec.ts \
  "$@"

EXIT_CODE=$?

echo ""
echo "========================================="
if [ $EXIT_CODE -eq 0 ]; then
  echo "✅ 测试执行成功!"
else
  echo "❌ 测试执行失败，请检查测试报告"
fi
echo "========================================="
echo "📊 HTML 报告：playwright-report/index.html"
echo "📸 截图路径：test-results/"
echo "📄 JSON 结果：test-results/test-results.json"
echo ""

exit $EXIT_CODE
