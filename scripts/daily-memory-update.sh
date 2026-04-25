#!/bin/bash

# 每日记忆更新脚本
# 执行时间：每日 23:00
# 功能：自动更新 MEMORY.md 和创建每日日志

set -e

WORKSPACE="/home/admin/.openclaw/workspace"
MEMORY_FILE="$WORKSPACE/MEMORY.md"
MEMORY_DIR="$WORKSPACE/memory"
DATE=$(date +%Y-%m-%d)
DATE_FILE="$MEMORY_DIR/$DATE.md"
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")

cd "$WORKSPACE"

echo "📝 开始每日记忆更新 - $TIMESTAMP"

# 1. 获取当日 Git 提交统计
echo "📊 获取 Git 提交记录..."
GIT_COMMITS=$(git log --since="$DATE 00:00:00" --until="$DATE 23:59:59" --oneline 2>/dev/null || echo "")
COMMIT_COUNT=$(echo "$GIT_COMMITS" | grep -c . || echo "0")

# 2. 获取当日新增代码行数
LINES_ADDED=$(git log --since="$DATE 00:00:00" --until="$DATE 23:59:59" --numstat --pretty="" 2>/dev/null | awk '{added+=$1} END {print added+0}' || echo "0")
LINES_DELETED=$(git log --since="$DATE 00:00:00" --until="$DATE 23:59:59" --numstat --pretty="" 2>/dev/null | awk '{deleted+=$2} END {print deleted+0}' || echo "0")

# 3. 获取最新提交信息
LATEST_COMMIT=$(git log -1 --oneline 2>/dev/null || echo "无提交")
LATEST_COMMIT_HASH=$(git log -1 --format="%h" 2>/dev/null || echo "unknown")

# 4. 更新 MEMORY.md 最后更新时间
echo "⏰ 更新 MEMORY.md 最后更新时间..."
sed -i "s/\*\*最后更新\*\*: .*/\*\*最后更新\*\*: $DATE $TIMESTAMP/" "$MEMORY_FILE"

# 5. 创建每日日志文件
echo "📄 创建每日日志 $DATE_FILE..."
if [ ! -f "$DATE_FILE" ]; then
  cat > "$DATE_FILE" << EOF
# $DATE 开发日志

**日期**: $DATE  
**记录时间**: $TIMESTAMP  
**自动生成**: ✅

---

## 📊 今日概览

| 指标 | 数值 |
|------|------|
| Git 提交数 | $COMMIT_COUNT 次 |
| 代码新增 | $LINES_ADDED 行 |
| 代码删除 | $LINES_DELETED 行 |
| 最新提交 | $LATEST_COMMIT |

---

## 🎯 完成工作

（待补充详细工作内容）

---

## 📈 进度更新

（待补充进度信息）

---

## 🔧 技术亮点

（待补充技术细节）

---

## ⚠️ 问题与改进

（待补充问题记录）

---

## 📝 明日计划

（待补充计划）

---

**工作时长**: 待统计  
**记录人**: AI Agent (自动)

---

*此日志由 AI Agent 自动生成，需手动补充详细内容*
EOF
  echo "✅ 创建新日志文件"
else
  echo "ℹ️  日志文件已存在，跳过创建"
fi

# 6. 提交并推送
echo "🚀 提交并推送更新..."
git add "$MEMORY_FILE" "$DATE_FILE" 2>/dev/null || true
git commit -m "chore: 每日记忆更新 $DATE (自动)" --allow-empty 2>/dev/null || true
git push origin main 2>/dev/null || echo "⚠️ 推送失败，请手动推送"

echo "✅ 每日记忆更新完成"
echo "📊 统计：$COMMIT_COUNT 次提交 | +$LINES_ADDED -$LINES_DELETED 行 | 最新：$LATEST_COMMIT_HASH"
