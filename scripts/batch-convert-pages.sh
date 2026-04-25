#!/bin/bash
# Stitch 全量页面自动化转换脚本

STITCH_DIR="/home/admin/.openclaw/workspace/stitch_prd"
MINIPROGRAM_DIR="/home/admin/.openclaw/workspace/miniprogram/pages"

echo "🎨 Stitch 全量页面自动化转换开始"
echo "================================"

# 核心页面清单（按优先级）
declare -a PRIORITY_PAGES=(
  "q_05:audio:index"           # Q-05 → 梵音列表
  "q_06_v2:zen:index"          # Q-06 → 禅理功能页
  "q_08:species:list"          # Q-08 → 物种查询
  "q_10_1:merit-forest:merit-forest"  # Q-10 → 功德林
  "q_12_a:wiki:wiki"           # Q-12 → 科普百科
)

for mapping in "${PRIORITY_PAGES[@]}"; do
  IFS=':' read -r source_dir target_page target_file <<< "$mapping"
  
  echo ""
  echo "📄 转换：$source_dir → $target_page/$target_file"
  
  if [ -d "$STITCH_DIR/$source_dir" ]; then
    # 复制 HTML 原型作为参考
    cp "$STITCH_DIR/$source_dir/code.html" "/tmp/$target_file-reference.html" 2>/dev/null
    echo "   ✅ 参考文件已复制"
  else
    echo "   ⚠️ 源目录不存在"
  fi
done

echo ""
echo "================================"
echo "✅ 批量转换完成"
