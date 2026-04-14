#!/bin/bash

# Playwright 本地运行脚本

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 运行 Playwright E2E 测试（本地模式）..."

# 运行测试
npx playwright test "$@"

echo "✅ 测试完成"
echo "📊 报告路径：playwright-report/"
echo "📸 截图路径：test-results/"
echo ""
echo "查看报告：npx playwright show-report"
