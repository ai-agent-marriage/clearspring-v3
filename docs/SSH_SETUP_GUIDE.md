# 🔐 SSH 部署密钥配置指南

**生成时间**: 2026-04-13 10:45  
**密钥类型**: RSA 4096  
**密钥指纹**: SHA256:RzrEWvaO7P9z3iCY4XWSzmHfoGm2oMG63Qo085JXSBU

---

## 📍 密钥文件位置

- **私钥**: `/root/.openclaw/workspace/deploy/clearspring_deploy_key`
- **公钥**: `/root/.openclaw/workspace/deploy/clearspring_deploy_key.pub`

---

## 🚀 配置步骤

### 步骤 1: SSH 登录服务器

```bash
# 使用 root 用户登录火山云服务器
ssh root@101.96.192.63
```

### 步骤 2: 创建部署用户

```bash
# 创建部署用户
useradd -m -s /bin/bash clearspring-bot

# 设置密码（可选，仅用于紧急登录）
passwd clearspring-bot

# 创建应用目录
mkdir -p /home/clearspring-bot/clearspring-v3/api
chown -R clearspring-bot:clearspring-bot /home/clearspring-bot/clearspring-v3
```

### 步骤 3: 配置 SSH 授权

```bash
# 切换到部署用户
su - clearspring-bot

# 创建 .ssh 目录
mkdir -p ~/.ssh
chmod 700 ~/.ssh

# 添加部署公钥到 authorized_keys
# 将下面的公钥内容复制粘贴到服务器
cat >> ~/.ssh/authorized_keys << 'EOF'
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCp19nz4yvN30TQC7G58ffRJO0flueBqU/L92K8s48PwSCR4tFPxNzf2WotNitH+LDxO0f2oXGYalrW/SsyrxCGfSEHw+FdHPvXregiTVRTfdRuj2QgKz6ytpcsL/dPHj4s+81lyX/lzqeCFHwCwWtmSpkbCPM+CHu9JnfJb07Auj4CSIbunu+tk5Z302Vt5t1oXFUGy95vhHDHd1SJHAqd+p17EwbV+I9bfRRG6ra/v5GXo3ha3KOcUZEDP98TvHcqbDmbzwywCfakpAM3Jrhmr18X6M2KCrzkvw3uRb2aRHBExIQe+DRbE+cbflPKbDfDIIlQ1K6WGRwyXW79lLt5EyHZwTNz05ymvpWTdJR4mRZQnwNePShtAuGQcM5zRFIODa5ovOimqIbEgYzMNeH8NOuy0r2lYIZlipZakp1gw+gn6Y6j9p+A3XPhMCVSIcvsKKydoRB+xyqwSwvYXL1w4QGjQa6uIdZW64Xj4VNMGwtaR1C25U9JIQJlKYAwCYSpsA/aWRMCkKD5tfr+8/rnGfiPc0HdQTMtH68/Pkk1Y5VfIMVlkDkvjuHJU0j76Tp3z5xYIIeQ2yIyvM8oaGrpQxtf0MqfwrtKsWzK0fMYs28c66OJx88n+osDf5odR/LMjO/PCp/xfh1czaV4pe0W0egCEeFfOPHIcf3jAq8KFQ== clearspring-deploy-20260413
EOF

chmod 600 ~/.ssh/authorized_keys

# 退出部署用户
exit
```

### 步骤 4: 验证 SSH 连接

```bash
# 在本地测试 SSH 连接（使用部署密钥）
ssh -i /root/.openclaw/workspace/deploy/clearspring_deploy_key -o IdentitiesOnly=yes clearspring-bot@101.96.192.63 "echo '✅ SSH 连接成功'"
```

预期输出：`✅ SSH 连接成功`

### 步骤 5: 安装 PM2（如未安装）

```bash
# SSH 登录服务器
ssh -i /root/.openclaw/workspace/deploy/clearspring_deploy_key -o IdentitiesOnly=yes clearspring-bot@101.96.192.63

# 检查 Node.js
node -v  # 应显示 v18+

# 检查 PM2
pm2 -v   # 如未安装，执行下面的命令

# 安装 PM2
npm install -g pm2

# 配置 PM2 开机自启
pm2 startup
# 执行输出的命令（类似：sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u clearspring-bot --hp /home/clearspring-bot）

# 退出
exit
```

---

## 🔧 GitHub Secrets 配置

### 步骤 6: 配置 GitHub Secrets

访问：https://github.com/ai-agent-marriage/clearspring-v3/settings/secrets/actions

添加以下 4 个 Secrets：

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `VOLCANO_SSH_KEY` | 见下方私钥内容 | SSH 部署私钥 |
| `VOLCANO_HOST` | `101.96.192.63` | 服务器 IP |
| `VOLCANO_USER` | `clearspring-bot` | 部署用户 |
| `FEISHU_BOT_URL` | （你的飞书机器人 Webhook） | 通知推送 |

#### VOLCANO_SSH_KEY 私钥内容

```
-----BEGIN OPENSSH PRIVATE KEY-----
b3BlbnNzaC1rZXktdjEAAAAABG5vbmUAAAAEbm9uZQAAAAAAAAABAAACFwAAAAdzc2gtcn
NhAAAAAwEAAQAAAgEAqdfZ8+Mrzd9E0AuxufH30STtH5bngalPy/divLOPD8EgkeLRT8Tc
39lqLTYrR/iw8TtH9qFxmGpa1v0rMq8Qhn0hB8PhXRz7163oIk1UU33Ubo9kICs+sraXLC
/3Tx4+LPvNZcl/5c6nghR8AsFrZkqZGwjzPgh7vSZ3yW9OwLo+AkiG7p7vrZOWd9Nlbebd
[... 完整私钥内容见文件：/root/.openclaw/workspace/deploy/clearspring_deploy_key ...]
-----END OPENSSH PRIVATE KEY-----
```

**注意**: 请将完整的私钥文件内容复制到 GitHub Secrets（不要省略号，要完整内容）

```bash
# 查看完整私钥
cat /root/.openclaw/workspace/deploy/clearspring_deploy_key
```

### 步骤 7: 测试 Secrets 验证

1. 访问：https://github.com/ai-agent-marriage/clearspring-v3/actions/workflows/test-secrets.yml
2. 点击 "Run workflow"
3. 观察 Secrets 检查是否全部显示 ✅

---

## ✅ 配置完成检查清单

- [ ] 部署用户 `clearspring-bot` 已创建
- [ ] SSH 公钥已添加到 `~/.ssh/authorized_keys`
- [ ] SSH 连接测试成功
- [ ] PM2 已安装并配置开机自启
- [ ] GitHub Secrets 已配置（4 个）
- [ ] Secrets 验证工作流测试通过

---

## 🆘 问题排查

### SSH 连接失败
```bash
# 查看详细日志
ssh -v -i /root/.openclaw/workspace/deploy/clearspring_deploy_key clearspring-bot@101.96.192.63
```

### 权限错误
```bash
# 修复密钥权限
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh
```

### PM2 未安装
```bash
# 安装 PM2
npm install -g pm2
```

---

**下一步**: 完成上述配置后，告诉我"SSH 配置完成"，我将触发首次部署！🚀
