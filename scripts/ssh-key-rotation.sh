# SSH 密钥轮换脚本

**用途**: 每 90 天自动轮换 SSH 部署密钥  
**执行**: 手动执行或配置 cron 定时任务  
**责任人**: DevOps-Agent

---

## 🔐 密钥轮换流程

### 步骤 1: 生成新密钥对

```bash
#!/bin/bash
set -e

BACKUP_DIR="$HOME/.ssh/clearspring-backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
NEW_KEY_DIR="$HOME/.ssh/clearspring-deploy-$TIMESTAMP"

echo "🔐 开始 SSH 密钥轮换..."

# 创建备份目录
mkdir -p "$BACKUP_DIR"

# 备份旧密钥
if [ -f "$HOME/.ssh/clearspring_deploy_key" ]; then
  echo "📦 备份旧密钥..."
  cp "$HOME/.ssh/clearspring_deploy_key" "$BACKUP_DIR/clearspring_deploy_key.old.$TIMESTAMP"
  cp "$HOME/.ssh/clearspring_deploy_key.pub" "$BACKUP_DIR/clearspring_deploy_key.pub.old.$TIMESTAMP"
fi

# 生成新密钥对（RSA 4096 位）
echo "🔑 生成新密钥对..."
mkdir -p "$NEW_KEY_DIR"
ssh-keygen -t rsa -b 4096 -f "$NEW_KEY_DIR/clearspring_deploy_key" -N "" -C "clearspring-deploy-$(date +%Y%m%d)"

echo "✅ 新密钥对生成成功"
echo "私钥：$NEW_KEY_DIR/clearspring_deploy_key"
echo "公钥：$NEW_KEY_DIR/clearspring_deploy_key.pub"
```

### 步骤 2: 部署公钥到服务器

```bash
#!/bin/bash
set -e

SERVER_HOST="101.96.192.63"
SERVER_USER="clearspring-bot"
OLD_KEY="$HOME/.ssh/clearspring_deploy_key"
NEW_KEY="$HOME/.ssh/clearspring-deploy-*/clearspring_deploy_key"

echo "📤 部署公钥到服务器..."

# 使用旧密钥授权新密钥
ssh -i "$OLD_KEY" -o IdentitiesOnly=yes "$SERVER_USER@$SERVER_HOST" "
  mkdir -p ~/.ssh
  cat >> ~/.ssh/authorized_keys << EOF
$(cat $NEW_KEY.pub)
EOF
  chmod 700 ~/.ssh
  chmod 600 ~/.ssh/authorized_keys
"

echo "✅ 公钥部署成功"
```

### 步骤 3: 更新 GitHub Secrets

```bash
#!/bin/bash
set -e

REPO="ai-agent-marriage/clearspring-v3"
NEW_KEY_FILE="$HOME/.ssh/clearspring-deploy-*/clearspring_deploy_key"

echo "🔄 更新 GitHub Secrets..."

# 使用 GitHub CLI 更新 Secret
gh secret set VOLCANO_SSH_KEY --repo "$REPO" < "$NEW_KEY_FILE"

echo "✅ GitHub Secrets 更新成功"
```

### 步骤 4: 验证新密钥

```bash
#!/bin/bash
set -e

SERVER_HOST="101.96.192.63"
SERVER_USER="clearspring-bot"
NEW_KEY="$HOME/.ssh/clearspring-deploy-*/clearspring_deploy_key"

echo "🔍 验证新密钥..."

ssh -i "$NEW_KEY" -o IdentitiesOnly=yes "$SERVER_USER@$SERVER_HOST" "
  echo '✅ SSH 连接成功'
  whoami
  hostname
"

echo "✅ 密钥验证成功"
```

### 步骤 5: 清理旧密钥（可选）

```bash
#!/bin/bash
set -e

BACKUP_DIR="$HOME/.ssh/clearspring-backup"
RETENTION_DAYS=90

echo "🧹 清理超过 ${RETENTION_DAYS} 天的旧密钥..."

find "$BACKUP_DIR" -name "*.old.*" -mtime +${RETENTION_DAYS} -delete

echo "✅ 清理完成"
```

---

## 📅 自动化轮换（Cron）

### 配置定时任务

```bash
# 每 90 天执行一次密钥轮换
0 0 */90 * * /home/admin/.openclaw/workspace/scripts/ssh-key-rotation.sh >> /home/admin/.openclaw/workspace/logs/ssh-rotation.log 2>&1
```

### 查看轮换日志

```bash
tail -f /home/admin/.openclaw/workspace/logs/ssh-rotation.log
```

---

## 📝 密钥管理最佳实践

### 安全存储
- ✅ 私钥权限设置为 600
- ✅ 公钥部署到 authorized_keys
- ✅ 使用 passphrase 保护私钥（可选）
- ✅ 定期备份密钥文件

### 访问控制
- ✅ 限制密钥只能用于部署用户
- ✅ 使用 `command=` 限制可执行命令
- ✅ 启用 SSH 审计日志
- ✅ 定期审查 authorized_keys

### 监控告警
- ✅ 监控密钥使用频率
- ✅ 异常访问告警
- ✅ 密钥过期提醒（提前 7 天）

---

## 🔍 故障排查

### 问题 1: SSH 连接失败

```bash
# 检查密钥权限
ls -l ~/.ssh/clearspring_deploy_key
# 应该是 -rw------- (600)

# 测试连接
ssh -i ~/.ssh/clearspring_deploy_key -o IdentitiesOnly=yes -v clearspring-bot@101.96.192.63
```

### 问题 2: GitHub Actions 部署失败

```bash
# 验证 GitHub Secrets
gh secret list --repo ai-agent-marriage/clearspring-v3

# 重新设置 Secret
gh secret set VOLCANO_SSH_KEY --repo ai-agent-marriage/clearspring-v3 < ~/.ssh/clearspring_deploy_key
```

### 问题 3: 服务器 authorized_keys 权限错误

```bash
# SSH 登录服务器
ssh clearspring-bot@101.96.192.63

# 修复权限
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

---

## 📊 密钥轮换记录

| 轮换日期 | 密钥标识 | 操作人 | 状态 |
|---------|---------|--------|------|
| 2026-04-12 | clearspring-deploy-20260412 | AI Agent | ✅ 初始配置 |
| - | - | - | ⏳ 下次轮换：2026-07-11 |

---

**最后更新**: 2026-04-12  
**下次轮换**: 2026-07-11（90 天后）

---

*此脚本由 AI Agent 维护，确保 SSH 密钥安全*
