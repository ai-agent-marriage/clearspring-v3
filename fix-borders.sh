#!/bin/bash

# Stitch V3.0 边框修复脚本
# 将 1px/1rpx 实线边框替换为无边界设计

cd /home/admin/.openclaw/workspace

# 定义需要排除的目录
EXCLUDE_PATTERN="node_modules\|coverage\|tests/\|dist/\|backend/"

# 创建备份目录
mkdir -p /tmp/stitch-border-backup

echo "🔍 开始扫描边框问题..."

# 查找所有业务代码中的边框问题（排除依赖和构建目录）
grep -r "1px\|1rpx" . --include="*.wxss" --include="*.css" | grep "solid" | grep -vE "$EXCLUDE_PATTERN" > /tmp/border-issues.txt

TOTAL_ISSUES=$(wc -l < /tmp/border-issues.txt)
echo "📊 发现 $TOTAL_ISSUES 处边框问题"

# 统计各文件的问题数
echo ""
echo "📁 问题文件分布："
cat /tmp/border-issues.txt | cut -d: -f1 | sort | uniq -c | sort -rn

# 开始修复
echo ""
echo "🔧 开始修复边框..."

# 修复策略 1: border-bottom: 1rpx solid var(--border-divider) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-bottom: 1rpx solid var(--border-divider)/border-bottom: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 2: border-top: 1rpx solid var(--border-divider) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid var(--border-divider)/border-top: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 3: border: 1rpx solid rgba(195, 200, 193, 0.3) → 使用更淡的边框
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border: 1rpx solid rgba(195, 200, 193, 0\.3)/border: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 4: border: 1rpx solid rgba(195, 200, 193, 0.2) → 使用更淡的边框
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border: 1rpx solid rgba(195, 200, 193, 0\.2)/border: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 5: border-bottom: 1rpx solid rgba(195, 200, 193, 0.15) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-bottom: 1rpx solid rgba(195, 200, 193, 0\.15)/border-bottom: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 6: border-top: 1rpx solid rgba(195, 200, 193, 0.15) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid rgba(195, 200, 193, 0\.15)/border-top: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 7: border-top: 1rpx solid #E3E2DE → var(--stitch-border-secondary)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid #E3E2DE/border-top: 1rpx solid var(--stitch-border-secondary)/g' {} \;

# 修复策略 8: border: 1rpx solid rgba(255, 255, 255, 0.3) → 保留但使用标准变量
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border: 1rpx solid rgba(255, 255, 255, 0\.3)/border: 1rpx solid var(--stitch-border-light)/g' {} \;

# 修复策略 9: border-bottom: 1rpx solid var(--stitch-bg-secondary) → var(--stitch-border-secondary)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-bottom: 1rpx solid var(--stitch-bg-secondary)/border-bottom: 1rpx solid var(--stitch-border-secondary)/g' {} \;

# 修复策略 10: border-top: 1rpx solid var(--stitch-bg-secondary) → var(--stitch-border-secondary)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid var(--stitch-bg-secondary)/border-top: 1rpx solid var(--stitch-border-secondary)/g' {} \;

# 修复策略 11: border-top: 1rpx solid #e8e8e8 → var(--stitch-border-secondary)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid #e8e8e8/border-top: 1rpx solid var(--stitch-border-secondary)/g' {} \;

# 修复策略 12: border: 1rpx solid rgba(74, 93, 78, 0.1) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border: 1rpx solid rgba(74, 93, 78, 0\.1)/border: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 13: border-bottom: 1rpx solid rgba(74, 93, 78, 0.1) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-bottom: 1rpx solid rgba(74, 93, 78, 0\.1)/border-bottom: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 14: border-top: 1rpx solid rgba(74, 93, 78, 0.1) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid rgba(74, 93, 78, 0\.1)/border-top: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 15: border-bottom: 1rpx solid rgba(74, 93, 78, 0.08) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-bottom: 1rpx solid rgba(74, 93, 78, 0\.08)/border-bottom: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 16: border-top: 1rpx solid rgba(74, 93, 78, 0.08) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid rgba(74, 93, 78, 0\.08)/border-top: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 17: border-bottom: 1rpx solid rgba(74, 93, 78, 0.1) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-bottom: 1rpx solid rgba(74, 93, 78, 0\.1)/border-bottom: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 18: border-top: 1rpx solid rgba(74, 93, 78, 0.1) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid rgba(74, 93, 78, 0\.1)/border-top: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 19: border: 1rpx solid rgba(195, 200, 193, 0.1) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border: 1rpx solid rgba(195, 200, 193, 0\.1)/border: 1rpx solid var(--stitch-border-divider)/g' {} \;

# 修复策略 20: border-top: 1rpx solid rgba(195, 200, 193, 0.2) → var(--stitch-border-divider)
find . -type f \( -name "*.wxss" -o -name "*.css" \) ! -path "*/node_modules/*" ! -path "*/coverage/*" ! -path "*/tests/*" ! -path "*/dist/*" ! -path "*/backend/*" -exec sed -i 's/border-top: 1rpx solid rgba(195, 200, 193, 0\.2)/border-top: 1rpx solid var(--stitch-border-divider)/g' {} \;

echo ""
echo "✅ 修复完成！验证结果..."
echo ""

# 验证修复结果
REMAINING=$(grep -r "1px\|1rpx" . --include="*.wxss" --include="*.css" | grep "solid" | grep -vE "$EXCLUDE_PATTERN" | wc -l)
echo "📊 剩余边框问题：$REMAINING"

if [ $REMAINING -eq 0 ]; then
    echo "🎉 所有边框问题已修复！"
else
    echo "⚠️  仍有 $REMAINING 处需要手动处理"
    grep -r "1px\|1rpx" . --include="*.wxss" --include="*.css" | grep "solid" | grep -vE "$EXCLUDE_PATTERN" > /tmp/remaining-issues.txt
fi
