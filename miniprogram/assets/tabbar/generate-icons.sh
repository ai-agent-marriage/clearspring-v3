#!/bin/bash
# 生成简单的占位图标（实际应该用设计稿的图标）

# 创建简单的 SVG 转 PNG
cat > home.svg << 'SVG'
<svg width="81" height="81" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3 9L12 2L21 9V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V9Z" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M9 21V12H15V21" stroke="#718096" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
SVG

echo "⚠️ 注意：需要手动添加真实的 TabBar 图标文件"
echo "图标位置：/root/.openclaw/workspace/miniprogram/assets/tabbar/"
echo "需要 8 个文件：home.png, home-active.png, audio.png, audio-active.png, zen.png, zen-active.png, profile.png, profile-active.png"
