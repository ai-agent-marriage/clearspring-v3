#!/bin/bash

# 批量创建祈福者端 P2 页面 - 自动化脚本
# 创建 Q-16 到 Q-34 的页面结构

PAGES_DIR="/home/admin/.openclaw/workspace/pages"

# 页面列表 (剩余 14 个)
declare -A PAGES=(
  ["q-16-order-detail"]="订单详情"
  ["q-17-certificate"]="功德证书"
  ["q-18-ranking"]="功德排行榜"
  ["q-19-forest"]="功德森林"
  ["q-20-tree"]="我的树"
  ["q-21-water"]="流水记录"
  ["q-22-record"]="执行记录"
  ["q-23-share"]="分享"
  ["q-24-invite"]="邀请"
  ["q-25-guest"]="访客"
  ["q-26-task"]="任务"
  ["q-27-signin"]="签到"
  ["q-28-calendar"]="日历"
  ["q-29-notification"]="通知"
  ["q-30-settings"]="设置"
  ["q-31-about"]="关于"
  ["q-32-help"]="帮助"
  ["q-33-feedback"]="反馈"
)

echo "开始批量创建页面目录..."

for page_key in "${!PAGES[@]}"; do
  page_name="${PAGES[$page_key]}"
  mkdir -p "$PAGES_DIR/$page_key"
  
  # 创建基础 wxml 文件
  cat > "$PAGES_DIR/$page_key/$page_key.wxml" << 'WXML'
<!-- 页面模板 - Stitch V3.0 规范 -->
<view class="container">
  <!-- 自定义导航栏 -->
  <navbar title="{{pageTitle}}" show-back="true"/>
  
  <!-- 页面内容 -->
  <view class="content">
    <text>{{pageTitle}}</text>
  </view>
  
  <!-- TabBar -->
  <tab-bar/>
</view>
WXML

  # 创建基础 wxss 文件
  cat > "$PAGES_DIR/$page_key/$page_key.wxss" << 'WXSS'
/* 页面样式 - Stitch V3.0 规范 */
.container {
  min-height: 100vh;
  background-color: #EFEEE9;
  padding-bottom: 240rpx;
}

.content {
  padding: 48rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
}
WXSS

  # 创建基础 js 文件
  cat > "$PAGES_DIR/$page_key/$page_key.js" << 'JS'
// 页面逻辑 - Stitch V3.0 规范
Page({
  data: {
    pageTitle: ''
  },

  onLoad(options) {
    // 初始化页面
  }
})
JS

  # 创建基础 json 文件
  cat > "$PAGES_DIR/$page_key/$page_key.json" << 'JSON'
{
  "navigationBarTitleText": "页面",
  "navigationStyle": "custom",
  "usingComponents": {
    "tab-bar": "/custom-tab-bar/index",
    "navbar": "/components/navbar/navbar"
  }
}
JSON

  echo "✓ 创建：$page_key ($page_name)"
done

echo ""
echo "批量创建完成！共 ${#PAGES[@]} 个页面"
