#!/bin/bash
# Day 6 测试覆盖率提升 - 测试执行脚本
# 用于导入测试数据并运行集成测试

set -e

echo "========================================="
echo "Day 6 测试覆盖率提升 - 测试执行脚本"
echo "========================================="
echo ""

# 1. 导入测试数据
echo "📊 步骤 1: 导入测试数据..."
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

# 检查 MySQL 连接
if command -v mysql &> /dev/null; then
    echo "✅ MySQL 客户端已安装"
    # 注意：实际执行需要配置数据库连接
    # mysql -u root -p qingru_app < "$PROJECT_ROOT/docs/tests/test-data.sql"
    echo "⚠️  请手动执行：mysql -u root -p qingru_app < docs/tests/test-data.sql"
else
    echo "⚠️  MySQL 客户端未安装，跳过数据导入"
fi

echo ""

# 2. 编译并运行测试
echo "🧪 步骤 2: 运行集成测试..."
cd "$PROJECT_ROOT/backend"

# 检查 Maven
if command -v mvn &> /dev/null; then
    echo "✅ Maven 已安装"
    
    # 先安装本地依赖
    echo "📦 安装本地依赖..."
    mvn clean install -DskipTests -Dmaven.test.skip=true
    
    # 运行集成测试
    echo "🚀 运行集成测试..."
    cd ruoyi-admin
    mvn test -Dtest=IntegrationTest
    
    # 生成覆盖率报告
    echo "📊 生成覆盖率报告..."
    mvn test jacoco:report
    
    echo ""
    echo "✅ 测试完成！"
    echo "📄 覆盖率报告位置：target/site/jacoco/index.html"
    
    # 在 macOS 上打开报告
    if [[ "$OSTYPE" == "darwin"* ]]; then
        open target/site/jacoco/index.html
    else
        echo "🌐 请在浏览器中打开：file://$(pwd)/target/site/jacoco/index.html"
    fi
else
    echo "❌ Maven 未安装，无法运行测试"
    echo "💡 请安装 Maven: sudo apt-get install maven"
fi

echo ""
echo "========================================="
echo "测试执行完成"
echo "========================================="
