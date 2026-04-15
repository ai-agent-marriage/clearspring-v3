#!/bin/bash

# WXML 语法和规范性检查脚本
# 检查所有 pages/ 目录下的 WXML 文件

WORKSPACE="/root/.openclaw/workspace"
REPORT_FILE="$WORKSPACE/wxml-check-report.md"
TEMP_DIR="/tmp/wxml-check"

mkdir -p "$TEMP_DIR"

# 初始化报告
cat > "$REPORT_FILE" << 'EOF'
# WXML 语法和规范性检查报告

**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')
**检查范围**: 所有 pages/ 目录下的 WXML 文件
**文件总数**: 待统计

---

## 问题分级说明

- **P0 (严重)**: 标签不匹配、语法错误导致无法编译
- **P1 (重要)**: 属性语法错误、组件引用问题
- **P2 (建议)**: 规范问题、可优化项

---

## 检查结果

EOF

# 统计文件总数
TOTAL_FILES=$(find "$WORKSPACE" -path "*/coverage/*" -prune -o -path "*/node_modules/*" -prune -o -name "*.wxml" -type f -print 2>/dev/null | wc -l)
echo "**文件总数**: $TOTAL_FILES" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 初始化问题计数
P0_COUNT=0
P1_COUNT=0
P2_COUNT=0

# 临时文件存储各类问题
> "$TEMP_DIR/p0_issues.txt"
> "$TEMP_DIR/p1_issues.txt"
> "$TEMP_DIR/p2_issues.txt"

echo "开始检查 $TOTAL_FILES 个 WXML 文件..."

# 获取所有 WXML 文件
find "$WORKSPACE" -path "*/coverage/*" -prune -o -path "*/node_modules/*" -prune -o -name "*.wxml" -type f -print 2>/dev/null | while read wxml_file; do
    relative_path="${wxml_file#$WORKSPACE/}"
    
    # 1. 标签匹配检查
    # view 标签
    open_view=$(grep -o '<view' "$wxml_file" 2>/dev/null | wc -l)
    close_view=$(grep -o '</view>' "$wxml_file" 2>/dev/null | wc -l)
    if [ "$open_view" -ne "$close_view" ]; then
        echo "P0|$relative_path|view 标签不匹配 (开:$open_view 闭:$close_view)" >> "$TEMP_DIR/p0_issues.txt"
    fi
    
    # text 标签
    open_text=$(grep -o '<text' "$wxml_file" 2>/dev/null | wc -l)
    close_text=$(grep -o '</text>' "$wxml_file" 2>/dev/null | wc -l)
    if [ "$open_text" -ne "$close_text" ]; then
        echo "P0|$relative_path|text 标签不匹配 (开:$open_text 闭:$close_text)" >> "$TEMP_DIR/p0_issues.txt"
    fi
    
    # block 标签
    open_block=$(grep -o '<block' "$wxml_file" 2>/dev/null | wc -l)
    close_block=$(grep -o '</block>' "$wxml_file" 2>/dev/null | wc -l)
    if [ "$open_block" -ne "$close_block" ]; then
        echo "P0|$relative_path|block 标签不匹配 (开:$open_block 闭:$close_block)" >> "$TEMP_DIR/p0_issues.txt"
    fi
    
    # scroll-view 标签
    open_scroll=$(grep -o '<scroll-view' "$wxml_file" 2>/dev/null | wc -l)
    close_scroll=$(grep -o '</scroll-view>' "$wxml_file" 2>/dev/null | wc -l)
    if [ "$open_scroll" -ne "$close_scroll" ]; then
        echo "P0|$relative_path|scroll-view 标签不匹配 (开:$open_scroll 闭:$close_scroll)" >> "$TEMP_DIR/p0_issues.txt"
    fi
    
    # image 标签 (自闭合或成对)
    open_img=$(grep -o '<image' "$wxml_file" 2>/dev/null | wc -l)
    close_img=$(grep -o '</image>' "$wxml_file" 2>/dev/null | wc -l)
    self_close_img=$(grep -o '<image[^>]*\/>' "$wxml_file" 2>/dev/null | wc -l)
    # image 可以是自闭合的，所以不强制要求成对
    
    # 2. 属性语法检查
    # data-* 属性使用对象字面量 {{{}}}
    if grep -q 'data-[a-zA-Z0-9_-]*="{{{' "$wxml_file" 2>/dev/null; then
        line_nums=$(grep -n 'data-[a-zA-Z0-9_-]*="{{{' "$wxml_file" | cut -d: -f1 | tr '\n' ',' | sed 's/,$//')
        echo "P1|$relative_path|data-* 属性使用对象字面量 {{{}}} (行:$line_nums)" >> "$TEMP_DIR/p1_issues.txt"
    fi
    
    # wx:if 语法检查 (检查是否有未闭合的引号)
    if grep -E 'wx:if="[^"]*$' "$wxml_file" >/dev/null 2>&1; then
        line_nums=$(grep -n -E 'wx:if="[^"]*$' "$wxml_file" | cut -d: -f1 | tr '\n' ',' | sed 's/,$//')
        echo "P1|$relative_path|wx:if 属性引号未闭合 (行:$line_nums)" >> "$TEMP_DIR/p1_issues.txt"
    fi
    
    # wx:for 语法检查
    if grep -E 'wx:for="[^"]*$' "$wxml_file" >/dev/null 2>&1; then
        line_nums=$(grep -n -E 'wx:for="[^"]*$' "$wxml_file" | cut -d: -f1 | tr '\n' ',' | sed 's/,$//')
        echo "P1|$relative_path|wx:for 属性引号未闭合 (行:$line_nums)" >> "$TEMP_DIR/p1_issues.txt"
    fi
    
    # 3. Stitch V3.0 规范检查
    # 彩色 Emoji 检查
    if grep -E '[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}\x{1F700}-\x{1F77F}\x{1F780}-\x{1F7FF}\x{1F800}-\x{1F8FF}\x{1F900}-\x{1F9FF}\x{1FA00}-\x{1FA6F}\x{1FA70}-\x{1FAFF}\x{2600}-\x{26FF}\x{2700}-\x{27BF}]' "$wxml_file" >/dev/null 2>&1; then
        line_nums=$(grep -n -E '[\x{1F600}-\x{1F64F}\x{1F300}-\x{1F5FF}\x{1F680}-\x{1F6FF}]' "$wxml_file" | cut -d: -f1 | tr '\n' ',' | sed 's/,$//')
        echo "P2|$relative_path|包含彩色 Emoji，建议使用 SVG/Material Icons (行:$line_nums)" >> "$TEMP_DIR/p2_issues.txt"
    fi
    
    # 类名 kebab-case 检查 (检查是否有驼峰命名)
    if grep -E 'class="[^"]*[a-z][A-Z][^"]*"' "$wxml_file" >/dev/null 2>&1; then
        line_nums=$(grep -n -E 'class="[^"]*[a-z][A-Z][^"]*"' "$wxml_file" | cut -d: -f1 | tr '\n' ',' | sed 's/,$//')
        echo "P2|$relative_path|类名可能不符合 kebab-case 规范 (行:$line_nums)" >> "$TEMP_DIR/p2_issues.txt"
    fi
    
    # 硬编码色值检查 (检查是否有 #xxx 或 rgb/rgba 直接写在 style 中)
    if grep -E 'style="[^"]*(#[0-9a-fA-F]{3,6}|rgb\(|rgba\()[^"]*"' "$wxml_file" >/dev/null 2>&1; then
        line_nums=$(grep -n -E 'style="[^"]*(#[0-9a-fA-F]{3,6}|rgb\(|rgba\()[^"]*"' "$wxml_file" | cut -d: -f1 | tr '\n' ',' | sed 's/,$//')
        echo "P2|$relative_path|存在硬编码色值，建议使用 CSS 变量 (行:$line_nums)" >> "$TEMP_DIR/p2_issues.txt"
    fi
    
done

echo "文件检查完成，生成报告中..."

# 统计问题数量
P0_COUNT=$(wc -l < "$TEMP_DIR/p0_issues.txt")
P1_COUNT=$(wc -l < "$TEMP_DIR/p1_issues.txt")
P2_COUNT=$(wc -l < "$TEMP_DIR/p2_issues.txt")

# 生成报告内容
cat >> "$REPORT_FILE" << EOF

### P0 严重问题 (共 $P0_COUNT 个)

EOF

if [ "$P0_COUNT" -gt 0 ]; then
    echo "| 文件 | 问题描述 |" >> "$REPORT_FILE"
    echo "|------|----------|" >> "$REPORT_FILE"
    while IFS='|' read -r level file desc; do
        echo "| $file | $desc |" >> "$REPORT_FILE"
    done < "$TEMP_DIR/p0_issues.txt"
else
    echo "✅ 无 P0 级别问题" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

### P1 重要问题 (共 $P1_COUNT 个)

EOF

if [ "$P1_COUNT" -gt 0 ]; then
    echo "| 文件 | 问题描述 |" >> "$REPORT_FILE"
    echo "|------|----------|" >> "$REPORT_FILE"
    while IFS='|' read -r level file desc; do
        echo "| $file | $desc |" >> "$REPORT_FILE"
    done < "$TEMP_DIR/p1_issues.txt"
else
    echo "✅ 无 P1 级别问题" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

### P2 建议优化 (共 $P2_COUNT 个)

EOF

if [ "$P2_COUNT" -gt 0 ]; then
    echo "| 文件 | 问题描述 |" >> "$REPORT_FILE"
    echo "|------|----------|" >> "$REPORT_FILE"
    while IFS='|' read -r level file desc; do
        echo "| $file | $desc |" >> "$REPORT_FILE"
    done < "$TEMP_DIR/p2_issues.txt"
else
    echo "✅ 无 P2 级别问题" >> "$REPORT_FILE"
fi

cat >> "$REPORT_FILE" << EOF

---

## 检查总结

- **检查文件数**: $TOTAL_FILES
- **P0 严重问题**: $P0_COUNT
- **P1 重要问题**: $P1_COUNT
- **P2 建议优化**: $P2_COUNT
- **总问题数**: $((P0_COUNT + P1_COUNT + P2_COUNT))

EOF

if [ "$P0_COUNT" -eq 0 ] && [ "$P1_COUNT" -eq 0 ] && [ "$P2_COUNT" -eq 0 ]; then
    echo "🎉 所有 WXML 文件均通过检查！" >> "$REPORT_FILE"
else
    echo "⚠️ 发现 $((P0_COUNT + P1_COUNT + P2_COUNT)) 个问题，请优先处理 P0 级别问题。" >> "$REPORT_FILE"
fi

# 清理临时文件
rm -rf "$TEMP_DIR"

echo "检查完成！报告已生成：$REPORT_FILE"
echo "P0: $P0_COUNT, P1: $P1_COUNT, P2: $P2_COUNT"
