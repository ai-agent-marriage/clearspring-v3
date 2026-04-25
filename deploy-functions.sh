#!/bin/bash
# 清如 ClearSpring - 云函数自动部署脚本
# 使用方法：./deploy-functions.sh

set -e

# 配置
ENV_ID="clearspring-prod"
REGION="ap-guangzhou"
PROJECT_ROOT="/home/admin/.openclaw/workspace/projects/clearspring"
FUNCTIONS_DIR="$PROJECT_ROOT/cloud/functions"

echo "🚀 清如 ClearSpring - 云函数部署脚本"
echo "======================================"
echo "环境 ID: $ENV_ID"
echo "区域：$REGION"
echo ""

# 检查 tcb CLI 是否安装
if ! command -v tcb &> /dev/null; then
    echo "❌ 错误：未找到 tcb CLI"
    echo "请先安装：npm install -g @cloudbase/cli"
    echo "或使用微信开发者工具手动部署"
    exit 1
fi

# 检查是否已登录
echo "📝 检查登录状态..."
if ! tcb whoami &> /dev/null; then
    echo "未登录，请先执行：tcb login"
    exit 1
fi

# 云函数列表
FUNCTIONS=(
    "login"
    "createOrder"
    "grabOrder"
    "uploadEvidence"
)

# 部署函数
deploy_function() {
    local func_name=$1
    local func_path="$FUNCTIONS_DIR/$func_name"
    
    echo ""
    echo "📦 部署云函数：$func_name"
    echo "路径：$func_path"
    
    # 检查目录是否存在
    if [ ! -d "$func_path" ]; then
        echo "❌ 错误：目录不存在"
        return 1
    fi
    
    # 检查 index.js 是否存在
    if [ ! -f "$func_path/index.js" ]; then
        echo "❌ 错误：index.js 不存在"
        return 1
    fi
    
    # 检查 package.json 是否存在
    if [ ! -f "$func_path/package.json" ]; then
        echo "❌ 错误：package.json 不存在"
        return 1
    fi
    
    # 上传并部署
    echo "⬆️  上传中..."
    tcb function deploy "$func_name" \
        --envId "$ENV_ID" \
        --dir "$func_path" \
        --name "$func_name"
    
    echo "✅ 部署成功：$func_name"
}

# 主流程
echo "🎯 开始部署云函数..."
echo ""

for func in "${FUNCTIONS[@]}"; do
    if deploy_function "$func"; then
        echo "✅ $func 部署完成"
    else
        echo "❌ $func 部署失败"
        echo "继续下一个..."
    fi
done

echo ""
echo "======================================"
echo "🎉 云函数部署完成！"
echo ""
echo "下一步："
echo "1. 登录微信云开发控制台验证部署"
echo "2. 测试每个云函数"
echo "3. 进行集成测试"
echo ""
