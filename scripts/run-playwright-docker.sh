#!/bin/bash

# Playwright Docker 运行脚本
# 当本地运行失败时，使用 Docker 模式运行 E2E 测试

set -e

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_ROOT"

echo "🐳 使用 Docker 运行 Playwright E2E 测试..."

# Docker 镜像（官方 Playwright 镜像）
IMAGE="mcr.microsoft.com/playwright:v1.40.0-jammy"

# 运行测试
docker run --rm \
  --workdir /app \
  -v "$(pwd)":/app \
  -e CI=true \
  "$IMAGE" \
  bash -c "npm ci && npx playwright test"

echo "✅ Docker 测试完成"
echo "📊 报告路径：playwright-report/"
echo "📸 截图路径：test-results/"
