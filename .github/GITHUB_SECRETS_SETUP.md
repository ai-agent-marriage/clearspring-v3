# GitHub Secrets 配置指南

## 必需配置的 Secrets

在 GitHub 仓库 Settings → Secrets and variables → Actions 中添加以下 Secrets：

### 1. SSH_KEY (SSH 私钥)
用于 GitHub Actions 登录服务器进行部署。

**生成方法：**
```bash
# 在服务器上生成专用部署密钥
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_actions

# 将公钥添加到 authorized_keys
cat ~/.ssh/github_actions.pub >> ~/.ssh/authorized_keys

# 复制私钥内容到 GitHub Secrets
cat ~/.ssh/github_actions
```

**Secret 名称：** `SSH_KEY`
**值：** 私钥完整内容（包含 BEGIN/END 行）

### 2. SERVER_HOST (服务器地址)
**Secret 名称：** `SERVER_HOST`
**值：** `springs.dexoconnect.com` 或服务器 IP 地址

### 3. SSH_USER (SSH 用户名)
**Secret 名称：** `SSH_USER`
**值：** `root` 或其他用于部署的用户名

### 4. FEISHU_WEBHOOK (飞书机器人 Webhook)
用于部署成功后发送通知到飞书群。

**获取方法：**
1. 在飞书群中添加自定义机器人
2. 复制 Webhook 地址
3. 粘贴到 GitHub Secrets

**Secret 名称：** `FEISHU_WEBHOOK`
**值：** `https://open.feishu.cn/open-apis/bot/v2/hook/xxx`

## 配置步骤

1. 打开 GitHub 仓库：https://github.com/ai-agent-marriage/clearspring-v3
2. 点击 Settings 标签
3. 左侧菜单选择 "Secrets and variables" → "Actions"
4. 点击 "New repository secret"
5. 依次添加上述 4 个 Secrets

## 验证配置

推送代码到 main 分支后，查看 Actions 标签页：
- ✅ Test 任务应该通过
- ✅ Deploy 任务应该成功部署到服务器
- ✅ 飞书群应该收到部署成功通知

## 安全建议

- SSH 私钥建议设置密码短语（passphrase），并在 GitHub Secrets 中使用 `SSH_PASSPHRASE` 额外配置
- 定期轮换 SSH 密钥
- 限制部署密钥的权限（可选：使用 deploy keys 而非个人 SSH 密钥）
