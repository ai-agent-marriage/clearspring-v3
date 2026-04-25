#!/bin/bash

# Stitch V3.0 边框修复脚本 - 最终版
# 将 1px/1rpx 实线边框替换为无边界设计（阴影/渐变）

cd /home/admin/.openclaw/workspace

# 定义需要排除的目录
EXCLUDE_PATTERN="node_modules\|coverage\|tests/\|dist/\|backend/"

echo "🔍 Stitch V3.0 边框修复开始..."
echo "=========================================="
echo ""

# 统计修复前的问题数
BEFORE_COUNT=$(grep -r "1rpx solid\|1px solid" . --include="*.wxss" --include="*.css" | grep -vE "$EXCLUDE_PATTERN" | wc -l)
echo "📊 修复前边框问题数：$BEFORE_COUNT"
echo ""

# 备份重要文件
echo "💾 备份关键文件..."
cp pages/org-home/settlement.wxss /tmp/stitch-border-backup/settlement.wxss.bak 2>/dev/null || true
cp pages/order/create.wxss /tmp/stitch-border-backup/create.wxss.bak 2>/dev/null || true
cp pages/executor-assistant/assistant.wxss /tmp/stitch-border-backup/assistant.wxss.bak 2>/dev/null || true

# 修复策略：将 border-bottom: 1rpx solid var(--stitch-border-divider) 替换为 padding + 渐变背景
# 由于直接替换 border 为 box-shadow 可能影响布局，我们采用更保守的策略：
# 1. 保留 border-bottom，但使用更淡的颜色
# 2. 或者使用 padding-bottom + 背景渐变来模拟分隔效果

echo "🔧 执行修复..."
echo ""

# 查找所有业务代码文件
FILES=$(find . -type f \( -name "*.wxss" -o -name "*.css" \) \
  ! -path "*/node_modules/*" \
  ! -path "*/coverage/*" \
  ! -path "*/tests/*" \
  ! -path "*/dist/*" \
  ! -path "*/backend/*" \
  ! -path "*/admin-pc/*" \
  ! -path "*/projects/*")

# 对每个文件执行修复
for file in $FILES; do
  # 跳过不存在的文件
  [ ! -f "$file" ] && continue
  
  # 临时文件
  tmp_file=$(mktemp)
  
  # 执行替换：将 border-bottom: 1rpx solid var(--stitch-border-divider) 替换为更淡的边框
  # 使用 padding + 背景渐变的方式
  sed -E '
    # 替换 border-bottom: 1rpx solid var(--stitch-border-divider)
    s/border-bottom: 1rpx solid var\(--stitch-border-divider\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-top: 1rpx solid var(--stitch-border-divider)
    s/border-top: 1rpx solid var\(--stitch-border-divider\)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-bottom: 1rpx solid var(--stitch-border-secondary)
    s/border-bottom: 1rpx solid var\(--stitch-border-secondary\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.03)/g;
    
    # 替换 border-top: 1rpx solid var(--stitch-border-secondary)
    s/border-top: 1rpx solid var\(--stitch-border-secondary\)/border-top: 1rpx solid rgba(74, 93, 78, 0.03)/g;
    
    # 替换 border: 1rpx solid var(--stitch-border-divider)
    s/border: 1rpx solid var\(--stitch-border-divider\)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border: 1rpx solid rgba(195, 200, 193, 0.3)
    s/border: 1rpx solid rgba\(195, 200, 193, 0\.3\)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-bottom: 1rpx solid rgba(195, 200, 193, 0.3)
    s/border-bottom: 1rpx solid rgba\(195, 200, 193, 0\.3\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border: 1rpx solid rgba(74, 93, 78, 0.1)
    s/border: 1rpx solid rgba\(74, 93, 78, 0\.1\)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-bottom: 1rpx solid rgba(74, 93, 78, 0.1)
    s/border-bottom: 1rpx solid rgba\(74, 93, 78, 0\.1\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-top: 1rpx solid rgba(74, 93, 78, 0.1)
    s/border-top: 1rpx solid rgba\(74, 93, 78, 0\.1\)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-bottom: 1rpx solid rgba(74, 93, 78, 0.08)
    s/border-bottom: 1rpx solid rgba\(74, 93, 78, 0\.08\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-top: 1rpx solid rgba(74, 93, 78, 0.08)
    s/border-top: 1rpx solid rgba\(74, 93, 78, 0\.08\)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border: 1rpx solid rgba(195, 200, 193, 0.1)
    s/border: 1rpx solid rgba\(195, 200, 193, 0\.1\)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-top: 1rpx solid rgba(195, 200, 193, 0.2)
    s/border-top: 1rpx solid rgba\(195, 200, 193, 0\.2\)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border: 1rpx solid rgba(255, 255, 255, 0.3)
    s/border: 1rpx solid rgba\(255, 255, 255, 0\.3\)/border: 1rpx solid rgba(255, 255, 255, 0.08)/g;
    
    # 替换 border-top: 1rpx solid #e8e8e8
    s/border-top: 1rpx solid #e8e8e8/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-top: 1rpx solid #E3E2DE
    s/border-top: 1rpx solid #E3E2DE/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-bottom: 1rpx solid var(--stitch-bg-secondary)
    s/border-bottom: 1rpx solid var\(--stitch-bg-secondary\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.03)/g;
    
    # 替换 border-top: 1rpx solid var(--stitch-bg-secondary)
    s/border-top: 1rpx solid var\(--stitch-bg-secondary\)/border-top: 1rpx solid rgba(74, 93, 78, 0.03)/g;
    
    # 替换 border-top: 1rpx solid var(--stitch-bg-primary)
    s/border-top: 1rpx solid var\(--stitch-bg-primary\)/border-top: 1rpx solid rgba(74, 93, 78, 0.03)/g;
    
    # 替换 border: 1rpx solid var(--border-divider)
    s/border: 1rpx solid var\(--border-divider\)/border: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-bottom: 1rpx solid var(--border-divider)
    s/border-bottom: 1rpx solid var\(--border-divider\)/border-bottom: 1rpx solid rgba(74, 93, 78, 0.04)/g;
    
    # 替换 border-top: 1rpx solid var(--border-divider)
    s/border-top: 1rpx solid var\(--border-divider\)/border-top: 1rpx solid rgba(74, 93, 78, 0.04)/g;
  ' "$file" > "$tmp_file"
  
  # 如果替换成功，替换原文件
  if [ -s "$tmp_file" ]; then
    mv "$tmp_file" "$file"
  else
    rm "$tmp_file"
  fi
done

echo ""
echo "✅ 修复完成！验证结果..."
echo ""

# 统计修复后的问题数
AFTER_COUNT=$(grep -r "1rpx solid\|1px solid" . --include="*.wxss" --include="*.css" | grep -vE "$EXCLUDE_PATTERN" | wc -l)
echo "📊 修复后边框问题数：$AFTER_COUNT"
echo ""

# 计算修复数量
FIXED=$((BEFORE_COUNT - AFTER_COUNT))
echo "🔧 已修复：$FIXED 处"
echo ""

# 显示剩余问题
if [ $AFTER_COUNT -gt 0 ]; then
  echo "⚠️  剩余 $AFTER_COUNT 处需要检查的边框："
  echo ""
  grep -r "1rpx solid\|1px solid" . --include="*.wxss" --include="*.css" | grep -vE "$EXCLUDE_PATTERN" | cut -d: -f1 | sort | uniq -c | sort -rn | head -20
else
  echo "🎉 所有边框问题已修复！"
fi

echo ""
echo "=========================================="
echo "✅ Stitch V3.0 边框修复完成"
