#!/bin/bash

# WXML P0 问题详细定位脚本

WORKSPACE="/root/.openclaw/workspace"
P0_DETAIL_REPORT="$WORKSPACE/wxml-p0-detailed-report.md"

echo "# WXML P0 问题详细定位报告" > "$P0_DETAIL_REPORT"
echo "" >> "$P0_DETAIL_REPORT"
echo "**生成时间**: $(date '+%Y-%m-%d %H:%M:%S')" >> "$P0_DETAIL_REPORT"
echo "**问题级别**: P0 (严重 - 标签不匹配)" >> "$P0_DETAIL_REPORT"
echo "" >> "$P0_DETAIL_REPORT"

# P0 问题文件列表
P0_FILES=(
"pages/q-13-service/q-13-service.wxml"
"pages/executor-evidence/executor-evidence.wxml"
"pages/protect/register.wxml"
"pages/order/create.wxml"
"pages/order/review.wxml"
"pages/merit-forest/detail.wxml"
"miniprogram/pages/q-17-order-review/q-17-order-review.wxml"
"miniprogram/pages/admin/feedback/submit.wxml"
"miniprogram/pages/admin/message/subscribe.wxml"
"projects/clearspring-v2/miniprogram/pages/order/order.wxml"
"projects/clearspring-v2/miniprogram/pages/ritual/learn.wxml"
"projects/clearspring-v2/miniprogram/pages/ritual/practice.wxml"
"projects/clearspring-v2/miniprogram/pages/executor/evidence/evidence.wxml"
"projects/clearspring-v2/miniprogram/pages/admin/audit-h5/audit-h5.wxml"
"projects/clearspring-v2/miniprogram/pages/admin/arbitration-h5/arbitration-h5.wxml"
)

echo "## P0 问题详情" >> "$P0_DETAIL_REPORT"
echo "" >> "$P0_DETAIL_REPORT"

for file in "${P0_FILES[@]}"; do
    full_path="$WORKSPACE/$file"
    if [ -f "$full_path" ]; then
        echo "### $file" >> "$P0_DETAIL_REPORT"
        echo "" >> "$P0_DETAIL_REPORT"
        
        # 检查各类标签
        for tag in "view" "text" "block" "scroll-view"; do
            open_count=$(grep -c "<$tag" "$full_path" 2>/dev/null || echo "0")
            close_count=$(grep -c "</$tag>" "$full_path" 2>/dev/null || echo "0")
            
            if [ "$open_count" -ne "$close_count" ]; then
                echo "**$tag 标签不匹配**: 开始=$open_count, 结束=$close_count, 差异=$((open_count - close_count))" >> "$P0_DETAIL_REPORT"
                
                # 显示文件末尾的标签情况
                echo "" >> "$P0_DETAIL_REPORT"
                echo "文件末尾 20 行:" >> "$P0_DETAIL_REPORT"
                echo '```xml' >> "$P0_DETAIL_REPORT"
                tail -20 "$full_path" >> "$P0_DETAIL_REPORT"
                echo '```' >> "$P0_DETAIL_REPORT"
                echo "" >> "$P0_DETAIL_REPORT"
            fi
        done
        
        echo "---" >> "$P0_DETAIL_REPORT"
        echo "" >> "$P0_DETAIL_REPORT"
    fi
done

echo "## 修复建议" >> "$P0_DETAIL_REPORT"
echo "" >> "$P0_DETAIL_REPORT"
echo "1. 检查是否有自闭合标签误用（如 \<text /> 应为 \<text></text>）" >> "$P0_DETAIL_REPORT"
echo "2. 检查是否有遗漏的结束标签" >> "$P0_DETAIL_REPORT"
echo "3. 检查是否有条件渲染导致标签不匹配（wx:if/wx:else 块内标签不完整）" >> "$P0_DETAIL_REPORT"
echo "4. 使用编辑器 XML 验证功能定位具体行号" >> "$P0_DETAIL_REPORT"

echo "P0 详细报告生成完成：$P0_DETAIL_REPORT"
