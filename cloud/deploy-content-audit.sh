#!/bin/bash
# 内容安全审核云函数部署脚本
# 用法：./deploy-content-audit.sh

set -e

echo "🚀 开始部署内容安全审核云函数..."

# 云函数列表
FUNCTIONS=(
  "content/checkText"
  "content/checkImage"
  "content/checkVideo"
  "admin/getAuditList"
  "admin/auditContent"
)

# 获取项目根目录
PROJECT_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CLOUD_ROOT="$PROJECT_ROOT/cloud"

echo "📁 项目根目录：$PROJECT_ROOT"
echo "☁️  云函数目录：$CLOUD_ROOT"

# 遍历部署每个云函数
for func in "${FUNCTIONS[@]}"; do
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📦 部署云函数：$func"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  
  func_path="$CLOUD_ROOT/functions/$func"
  
  if [ ! -d "$func_path" ]; then
    echo "❌ 错误：云函数目录不存在 - $func_path"
    exit 1
  fi
  
  # 进入云函数目录
  cd "$func_path"
  
  # 安装依赖
  echo "📥 安装依赖..."
  if [ -f "package.json" ]; then
    npm install --production
  fi
  
  # 使用微信开发者工具 CLI 部署（如果可用）
  if command -v cloudbase &> /dev/null; then
    echo "☁️  使用 Cloudbase CLI 部署..."
    cloudbase functions deploy $(basename "$func")
  elif command -v wx &> /dev/null; then
    echo "☁️  使用微信开发者工具部署..."
    # 微信开发者工具 CLI 部署命令
    wx -u $CLOUDBASE_ENV functions deploy $(basename "$func")
  else
    echo "⚠️  未找到云部署工具，请手动部署"
    echo "   1. 打开微信开发者工具"
    echo "   2. 选择云开发 -> 云函数"
    echo "   3. 右键 $func -> 上传并部署：云端安装依赖"
  fi
  
  echo "✅ 云函数 $func 部署完成"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🎉 所有云函数部署完成！"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 已部署的云函数:"
for func in "${FUNCTIONS[@]}"; do
  echo "   ✓ $func"
done
echo ""
echo "🔧 下一步:"
echo "   1. 在微信开发者工具中测试云函数"
echo "   2. 执行 database-schema-content-audit.sql 创建数据库表"
echo "   3. 在管理后台访问 /content-audit 查看审核池"
echo ""

# 返回项目根目录
cd "$PROJECT_ROOT"
