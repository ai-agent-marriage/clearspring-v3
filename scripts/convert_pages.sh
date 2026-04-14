#!/bin/bash

# 批量转换祈福者端 P2 页面脚本
# 转换 Q-13_v2 ~ Q-34_v1 共 17 个页面

PAGES=(
  "q_13_v2:q-13-service"
  "q_14_v2:q-14-confirm"
  "q_15_v2:q-15-result"
  "q_16:q-16-merit"
  "q_17:q-17-certificate"
  "q_18_v2:q-18-ranking"
  "q_19_v3:q-19-forest"
  "q_20:q-20-tree"
  "q_21:q-21-water"
  "q_22:q-22-record"
  "q_23_v2:q-23-share"
  "q_24_v2:q-24-invite"
  "q_25:q-25-guest"
  "q_26:q-26-task"
  "q_27:q-27-signin"
  "q_28:q-28-calendar"
  "q_29:q-29-notification"
  "q_30_v2:q-30-settings"
  "q_31_v1:q-31-about"
  "q_32_v3:q-32-help"
  "q_33:q-33-feedback"
)

PRD_DIR="/root/.openclaw/workspace/stitch_prd"
PAGES_DIR="/root/.openclaw/workspace/pages"

echo "开始转换祈福者端 P2 页面..."
echo "共 ${#PAGES[@]} 个页面"
echo ""

for item in "${PAGES[@]}"; do
  IFS=':' read -r folder page_name <<< "$item"
  echo "处理：$folder -> $page_name"
  
  # 创建页面目录
  mkdir -p "$PAGES_DIR/$page_name"
  
  # 检查设计稿是否存在
  if [ ! -f "$PRD_DIR/$folder/code.html" ]; then
    echo "  ⚠️ 设计稿不存在：$PRD_DIR/$folder/code.html"
    continue
  fi
  
  echo "  ✓ 创建页面文件..."
done

echo ""
echo "目录创建完成！"
