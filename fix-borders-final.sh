#!/bin/bash

# Stitch V3.0 边框修复脚本 - 最终执行版
# 将 1px/1rpx 实线边框替换为更淡的边框（符合无边界设计）

cd /home/admin/.openclaw/workspace

echo "🔍 Stitch V3.0 边框修复开始..."
echo "=========================================="
echo ""

# 定义需要排除的目录
EXCLUDE_PATTERN="node_modules|coverage|tests/|dist/|backend/|admin-pc/|projects/"

# 统计修复前的问题数
BEFORE_COUNT=$(grep -r "1rpx solid\|1px solid" . --include="*.wxss" --include="*.css" 2>/dev/null | grep -vE "$EXCLUDE_PATTERN" | wc -l)
echo "📊 修复前边框问题数：$BEFORE_COUNT"
echo ""

# 创建备份目录
mkdir -p /tmp/stitch-border-backup

echo "🔧 执行批量替换..."
echo ""

# 获取所有需要修复的文件
FILES=$(find . -type f \( -name "*.wxss" -o -name "*.css" \) 2>/dev/null | \
  grep -vE "$EXCLUDE_PATTERN" | \
  grep -v "node_modules" | \
  grep -v "coverage" | \
  grep -v "tests/" | \
  grep -v "dist/" | \
  grep -v "backend/" | \
  grep -v "admin-pc/" | \
  grep -v "projects/")

# 统计文件数
FILE_COUNT=$(echo "$FILES" | wc -l)
echo "📁 找到 $FILE_COUNT 个需要修复的文件"
echo ""

# 对每个文件执行修复
FIXED_FILES=0
for file in $FILES; do
  if [ -f "$file" ]; then
    # 备份文件
    cp "$file" "/tmp/stitch-border-backup/$(basename $file).bak" 2>/dev/null
    
    # 执行替换
    sed -i 's/border-bottom: 1rpx solid var(--stitch-border-divider)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-top: 1rpx solid var(--stitch-border-divider)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border: 1rpx solid var(--stitch-border-divider)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-bottom: 1rpx solid var(--stitch-border-secondary)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.03)/g' "$file"
    sed -i 's/border-top: 1rpx solid var(--stitch-border-secondary)/border-top: 1rpx solid rgba(74, 93, 78, 0.03)/g' "$file"
    sed -i 's/border: 1rpx solid var(--stitch-border-secondary)/border: 1rpx solid rgba(74, 93, 78, 0.03)/g' "$file"
    sed -i 's/border-bottom: 1rpx solid var(--border-divider)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-top: 1rpx solid var(--border-divider)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border: 1rpx solid var(--border-divider)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border: 1rpx solid rgba(195, 200, 193, 0.3)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-bottom: 1rpx solid rgba(195, 200, 193, 0.3)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border: 1rpx solid rgba(74, 93, 78, 0.1)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-bottom: 1rpx solid rgba(74, 93, 78, 0.1)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-top: 1rpx solid rgba(74, 93, 78, 0.1)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-bottom: 1rpx solid rgba(74, 93, 78, 0.08)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-top: 1rpx solid rgba(74, 93, 78, 0.08)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border: 1rpx solid rgba(195, 200, 193, 0.1)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-top: 1rpx solid rgba(195, 200, 193, 0.2)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border: 1rpx solid rgba(255, 255, 255, 0.3)/border: 1rpx solid rgba(255, 255, 255, 0.08)/g' "$file"
    sed -i 's/border-top: 1rpx solid #e8e8e8/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-top: 1rpx solid #E3E2DE/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g' "$file"
    sed -i 's/border-bottom: 1rpx solid var(--stitch-bg-secondary)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.03)/g' "$file"
    sed -i 's/border-top: 1rpx solid var(--stitch-bg-secondary)/border-top: 1rpx solid rgba(74, 93, 78, 0.03)/g' "$file"
    sed -i 's/border-top: 1rpx solid var(--stitch-bg-primary)/border-top: 1rpx solid rgba(74, 93, 78, 0.03)/g' "$file"
    
    FIXED_FILES=$((FIXED_FILES + 1))
  fi
done

echo "✅ 已处理 $FIXED_FILES 个文件"
echo ""

# 统计修复后的问题数
AFTER_COUNT=$(grep -r "1rpx solid\|1px solid" . --include="*.wxss" --include="*.css" 2>/dev/null | grep -vE "$EXCLUDE_PATTERN" | wc -l)
echo "📊 修复后边框问题数：$AFTER_COUNT"
echo ""

# 计算修复数量
FIXED=$((BEFORE_COUNT - AFTER_COUNT))
echo "🔧 已修复：$FIXED 处"
echo ""

# 显示修复后的文件分布
echo "📁 修复后的文件分布（前 20）："
grep -r "1rpx solid\|1px solid" . --include="*.wxss" --include="*.css" 2>/dev/null | grep -vE "$EXCLUDE_PATTERN" | cut -d: -f1 | sort | uniq -c | sort -rn | head -20
echo ""

echo "=========================================="
echo "✅ Stitch V3.0 边框修复完成"
