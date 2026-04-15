#!/bin/bash

# WXML 深度检查脚本 - bindtap 函数和组件引用检查

WORKSPACE="/root/.openclaw/workspace"
DEEP_REPORT="$WORKSPACE/wxml-deep-check-report.md"

echo "# WXML 深度检查报告" > "$DEEP_REPORT"
echo "" >> "$DEEP_REPORT"
echo "**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$DEEP_REPORT"
echo "**检查内容**: bindtap 函数定义检查、组件引用检查" >> "$DEEP_REPORT"
echo "" >> "$DEEP_REPORT"

# 1. bindtap 函数定义检查
echo "## 1. bindtap 函数定义检查" >> "$DEEP_REPORT"
echo "" >> "$DEEP_REPORT"

P1_BINDTAP=0

# 遍历所有 WXML 文件
find "$WORKSPACE" -path "*/coverage/*" -prune -o -path "*/node_modules/*" -prune -o -name "*.wxml" -type f -print 2>/dev/null | while read wxml_file; do
    relative_path="${wxml_file#$WORKSPACE/}"
    dir_path=$(dirname "$wxml_file")
    
    # 获取对应的 JS 文件
    base_name=$(basename "$wxml_file" .wxml)
    js_file="$dir_path/$base_name.js"
    
    if [ ! -f "$js_file" ]; then
        # 尝试查找同目录下的其他 JS 文件
        js_file=$(find "$dir_path" -maxdepth 1 -name "*.js" -type f | head -1)
    fi
    
    if [ -f "$js_file" ]; then
        # 提取 WXML 中所有的 bindtap 值
        bindtap_funcs=$(grep -oE 'bindtap="[^"]*"' "$wxml_file" 2>/dev/null | sed 's/bindtap="//g' | sed 's/"//g' | sort -u)
        
        for func in $bindtap_funcs; do
            # 检查函数是否在 JS 文件中定义
            if ! grep -q "function $func\|$func: function\|$func = function\|$func = (" "$js_file" 2>/dev/null; then
                echo "P1|$relative_path|bindtap 绑定的函数 '$func' 未在 JS 中定义" >> /tmp/bindtap_issues.txt
            fi
        done
    fi
done

if [ -f /tmp/bindtap_issues.txt ] && [ -s /tmp/bindtap_issues.txt ]; then
    echo "| 文件 | 问题描述 |" >> "$DEEP_REPORT"
    echo "|------|----------|" >> "$DEEP_REPORT"
    while IFS='|' read -r level file desc; do
        echo "| $file | $desc |" >> "$DEEP_REPORT"
        P1_BINDTAP=$((P1_BINDTAP + 1))
    done < /tmp/bindtap_issues.txt
    echo "" >> "$DEEP_REPORT"
    echo "**bindtap 问题数**: $P1_BINDTAP" >> "$DEEP_REPORT"
else
    echo "✅ 未发现 bindtap 函数未定义的问题" >> "$DEEP_REPORT"
fi

rm -f /tmp/bindtap_issues.txt

echo "" >> "$DEEP_REPORT"

# 2. 组件引用检查
echo "## 2. 组件引用检查" >> "$DEEP_REPORT"
echo "" >> "$DEEP_REPORT"

# 检查自定义组件是否在 usingComponents 中声明
find "$WORKSPACE" -path "*/coverage/*" -prune -o -path "*/node_modules/*" -prune -o -name "*.wxml" -type f -print 2>/dev/null | while read wxml_file; do
    relative_path="${wxml_file#$WORKSPACE/}"
    dir_path=$(dirname "$wxml_file")
    base_name=$(basename "$wxml_file" .wxml)
    json_file="$dir_path/$base_name.json"
    
    # 获取 WXML 中使用的所有标签名 (排除内置标签)
    builtin_tags="view|text|block|scroll-view|image|button|input|textarea|navigator|swiper|swiper-item|icon|progress|checkbox|checkbox-group|radio|radio-group|slider|switch|label|form|picker|picker-view|picker-view-column|movable-area|movable-view|cover-view|cover-image|rich-text|web-view|live-player|live-pusher|voip-room|map|camera|open-data|ad|official-account|wxs|slot|slot-name"
    
    # 提取所有自定义组件标签
    custom_components=$(grep -oE '<[a-z][a-z0-9-]*' "$wxml_file" 2>/dev/null | sed 's/<//g' | grep -vE "^($builtin_tags)$" | sort -u)
    
    if [ -n "$custom_components" ] && [ -f "$json_file" ]; then
        # 读取 usingComponents
        using_components=$(grep -oE '"[a-z][a-zA-Z0-9-]*":' "$json_file" 2>/dev/null | sed 's/"//g' | sed 's/:$//g')
        
        for comp in $custom_components; do
            # 检查组件是否在 usingComponents 中声明
            if ! echo "$using_components" | grep -q "^$comp$"; then
                # 检查是否是全局组件或内置组件
                if ! echo "$comp" | grep -qE "^(mp-|van-|weui|t-)"; then
                    echo "P1|$relative_path|自定义组件 <$comp> 可能未在 usingComponents 中声明" >> /tmp/component_issues.txt
                fi
            fi
        done
    fi
done

if [ -f /tmp/component_issues.txt ] && [ -s /tmp/component_issues.txt ]; then
    echo "| 文件 | 问题描述 |" >> "$DEEP_REPORT"
    echo "|------|----------|" >> "$DEEP_REPORT"
    while IFS='|' read -r level file desc; do
        echo "| $file | $desc |" >> "$DEEP_REPORT"
    done < /tmp/component_issues.txt
    echo "" >> "$DEEP_REPORT"
    comp_count=$(wc -l < /tmp/component_issues.txt)
    echo "**组件引用问题数**: $comp_count" >> "$DEEP_REPORT"
else
    echo "✅ 未发现组件引用问题" >> "$DEEP_REPORT"
fi

rm -f /tmp/component_issues.txt

echo "" >> "$DEEP_REPORT"
echo "---" >> "$DEEP_REPORT"
echo "" >> "$DEEP_REPORT"
echo "深度检查完成！" >> "$DEEP_REPORT"

echo "深度检查完成！报告：$DEEP_REPORT"
