#!/bin/bash

# Playwright 自动运行脚本
# 优先尝试本地模式，失败后自动切换到 Docker 模式

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🚀 开始运行 E2E 测试..."
echo "📍 工作目录：$PROJECT_ROOT"

# 尝试本地运行
echo "📍 尝试本地模式..."
if npx playwright test "$@"; then
  echo "✅ 本地模式测试成功!"
  echo "📊 报告路径：playwright-report/"
  echo "📸 截图路径：test-results/"
  exit 0
else
  echo "⚠️  本地模式失败，切换到 Docker 模式..."
  
  # 切换到 Docker 模式
  chmod +x "$(dirname "${BASH_SOURCE[0]}")/run-playwright-docker.sh"
  "$(dirname "${BASH_SOURCE[0]}")/run-playwright-docker.sh"
fi
