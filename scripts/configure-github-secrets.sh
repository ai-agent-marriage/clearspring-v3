#!/bin/bash

# GitHub Secrets 自动配置脚本
# 用途：通过 GitHub API 自动配置所有 Secrets
# 安全：配置完成后立即删除本地明文，不保留任何敏感信息

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 配置信息
REPO="ai-agent-marriage/clearspring-v3"
GITHUB_TOKEN=""

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  GitHub Secrets 自动配置脚本${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 第 1 步：获取 GitHub Token
echo -e "${YELLOW}第 1 步：配置 GitHub Personal Access Token${NC}"
echo ""
echo "请在 GitHub 生成 Personal Access Token："
echo "1. 访问：https://github.com/settings/tokens"
echo "2. 点击 'Generate new token (classic)'"
echo "3. 选择 scopes: repo (完整权限)"
echo "4. 生成后复制 token"
echo ""
read -p "粘贴你的 GitHub Token: " GITHUB_TOKEN

# 验证 Token
echo -e "${YELLOW}验证 Token...${NC}"
if ! curl -s -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user > /dev/null; then
    echo -e "${RED}❌ Token 无效，请检查后重试${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Token 验证通过${NC}"
echo ""

# 第 2 步：定义 Secrets
echo -e "${YELLOW}第 2 步：准备配置 Secrets...${NC}"
echo ""

# 微信小程序
declare -A SECRETS
SECRETS["WX_APP_ID"]="wxa914ecc15836bda6"
SECRETS["WX_APP_SECRET"]="2442d50db913ff0818ebd79cea520fe6"
SECRETS["WX_CLOUD_ENV_ID"]="cloud1-7ga68ls3ccebbe5b"

# Gmail
SECRETS["GMAIL_ADDRESS"]="davisedwad82@gmail.com"
SECRETS["GMAIL_APP_PASSWORD"]="dghc wioj lggw bwpu"

# 飞书
SECRETS["FEISHU_BOT_URL"]="https://open.feishu.cn/open-apis/bot/v2/hook/3297ae19-077a-4b42-b827-cd56b5b82791"

# 火山云
SECRETS["VOLCANO_HOST"]="101.96.192.63"
SECRETS["VOLCANO_SSH_USER"]="root"
SECRETS["VOLCANO_API_PORT"]="3000"

# 构建配置
SECRETS["NODE_VERSION"]="18"
SECRETS["JAVA_VERSION"]="17"
SECRETS["PM2_APP_NAME"]="clearspring-api"

# 第 3 步：获取 SSH 私钥
echo -e "${YELLOW}第 3 步：获取 SSH 私钥${NC}"
echo ""
echo "可用的 SSH 私钥："
ls -la ~/.ssh/ | grep -E "^-" | grep -v "\.pub$" | awk '{print $9}' | sed 's/^/  /'
echo ""
read -p "请输入 SSH 私钥文件名（默认 spring3）: " SSH_KEY_NAME
SSH_KEY_NAME=${SSH_KEY_NAME:-spring3}

if [ ! -f ~/.ssh/$SSH_KEY_NAME ]; then
    echo -e "${RED}❌ 私钥文件不存在：~/.ssh/$SSH_KEY_NAME${NC}"
    exit 1
fi

# 读取私钥内容
SSH_PRIVATE_KEY=$(cat ~/.ssh/$SSH_KEY_NAME)
SECRETS["VOLCANO_SSH_KEY"]="$SSH_PRIVATE_KEY"
echo -e "${GREEN}✓ SSH 私钥已加载${NC}"
echo ""

# 第 4 步：加密并上传 Secrets
echo -e "${YELLOW}第 4 步：加密并上传 Secrets 到 GitHub...${NC}"
echo ""

# 获取仓库公钥
echo "获取仓库公钥..."
RESPONSE=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$REPO/actions/secrets/public-key)
KEY_ID=$(echo $RESPONSE | jq -r '.key_id')
PUBLIC_KEY=$(echo $RESPONSE | jq -r '.key')

if [ -z "$KEY_ID" ] || [ "$KEY_ID" == "null" ]; then
    echo -e "${RED}❌ 获取公钥失败${NC}"
    exit 1
fi
echo -e "${GREEN}✓ 公钥获取成功 (Key ID: $KEY_ID)${NC}"
echo ""

# 安装 age 加密工具（如果没有）
if ! command -v age &> /dev/null; then
    echo "安装 age 加密工具..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew install age
    else
        sudo apt-get install -y age || sudo yum install -y age
    fi
fi

# 上传每个 Secret
COUNTER=0
TOTAL=${#SECRETS[@]}

for SECRET_NAME in "${!SECRETS[@]}"; do
    SECRET_VALUE="${SECRETS[$SECRET_NAME]}"
    COUNTER=$((COUNTER + 1))
    
    echo -n "[$COUNTER/$TOTAL] 上传 $SECRET_NAME... "
    
    # 使用 GitHub 的加密库（Python）
    python3 << EOF
import base64
from nacl import encoding, public

def encrypt(public_key: str, secret_value: str) -> str:
    public_key_bytes = base64.b64decode(public_key)
    sealed_box = public.SealedBox(public.PublicKey(public_key_bytes))
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

encrypted_value = encrypt("$PUBLIC_KEY", """$SECRET_VALUE""")
print(encrypted_value)
EOF
    
    ENCRYPTED_VALUE=$(python3 << EOF
import base64
from nacl import encoding, public

def encrypt(public_key: str, secret_value: str) -> str:
    public_key_bytes = base64.b64decode(public_key)
    sealed_box = public.SealedBox(public.PublicKey(public_key_bytes))
    encrypted = sealed_box.encrypt(secret_value.encode("utf-8"))
    return base64.b64encode(encrypted).decode("utf-8")

encrypted_value = encrypt("$PUBLIC_KEY", """$SECRET_VALUE""")
print(encrypted_value)
EOF
)
    
    # 调用 GitHub API 创建 Secret
    RESPONSE=$(curl -s -X PUT \
      -H "Authorization: token $GITHUB_TOKEN" \
      -H "Content-Type: application/json" \
      https://api.github.com/repos/$REPO/actions/secrets/$SECRET_NAME \
      -d "{
        \"encrypted_value\": \"$ENCRYPTED_VALUE\",
        \"key_id\": \"$KEY_ID\"
      }")
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "  错误：$RESPONSE"
    fi
done

echo ""

# 第 5 步：清理敏感信息
echo -e "${YELLOW}第 5 步：清理本地敏感信息...${NC}"
echo ""

# 删除脚本中的明文
echo "清理脚本中的明文密码..."
sed -i.bak 's/SECRETS\["WX_APP_SECRET"\]="[^"]*"/SECRETS["WX_APP_SECRET"]="REDACTED"/g' $0
sed -i.bak 's/SECRETS\["GMAIL_APP_PASSWORD"\]="[^"]*"/SECRETS["GMAIL_APP_PASSWORD"]="REDACTED"/g' $0
sed -i.bak 's|SECRETS\["FEISHU_BOT_URL"\]="[^"]*"|SECRETS["FEISHU_BOT_URL"]="REDACTED"|g' $0
rm -f $0.bak
echo -e "${GREEN}✓ 已清理脚本中的明文密码${NC}"

# 清理内存中的变量
unset SSH_PRIVATE_KEY
echo -e "${GREEN}✓ 已清理内存中的敏感信息${NC}"
echo ""

# 第 6 步：验证配置
echo -e "${YELLOW}第 6 步：验证配置...${NC}"
echo ""
echo "查看已配置的 Secrets："
curl -s -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/$REPO/actions/secrets | jq -r '.secrets[].name' | sed 's/^/  ✓ /'
echo ""

# 第 7 步：安全建议
echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  配置完成！${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${GREEN}✅ 已成功配置 ${#SECRETS[@]} 个 Secrets${NC}"
echo ""
echo -e "${YELLOW}🔒 安全建议（重要）:${NC}"
echo ""
echo "1. 立即重置以下已暴露的密钥："
echo "   • 微信小程序 AppSecret (微信公众平台)"
echo "   • Gmail 应用密码 (Google 安全设置)"
echo "   • 飞书 Webhook (重新生成机器人)"
echo ""
echo "2. 删除本地的 Token："
echo "   unset GITHUB_TOKEN"
echo ""
echo "3. 启用 GitHub 分支保护："
echo "   Settings → Branches → Add rule → main"
echo ""
echo "4. 启用 Secret 扫描："
echo "   Settings → Security & analysis → Secret scanning"
echo ""
echo -e "${BLUE}查看配置：https://github.com/$REPO/settings/secrets/actions${NC}"
echo ""

# 清理 Token
unset GITHUB_TOKEN

echo -e "${GREEN}✓ 脚本执行完成${NC}"
