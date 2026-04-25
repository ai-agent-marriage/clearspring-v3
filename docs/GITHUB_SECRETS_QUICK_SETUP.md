# GitHub Secrets 一键配置指南

**最简单的配置方式** - 使用 GitHub CLI

---

## 🚀 方案对比

| 方案 | 时间 | 安全性 | 难度 |
|------|------|--------|------|
| 手动配置（网页） | 15 分钟 | ⭐⭐⭐⭐ | 简单 |
| 自动脚本（需要 Token） | 5 分钟 | ⭐⭐⭐⭐⭐ | 中等 |
| **GitHub CLI（推荐）** | **3 分钟** | ⭐⭐⭐⭐⭐ | **最简单** |

---

## ✅ 使用 GitHub CLI 配置（推荐）

### 第 1 步：安装 GitHub CLI

```bash
# 如果已安装可跳过
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y
```

### 第 2 步：登录 GitHub

```bash
gh auth login
```

按提示操作：
1. 选择 GitHub.com
2. 选择 SSH 或 HTTPS
3. 复制代码打开浏览器
4. 在浏览器中授权
5. 回到终端继续

### 第 3 步：一键配置所有 Secrets

复制以下命令，在终端执行：

```bash
# 微信小程序
gh secret set WX_APP_ID -b "wxa914ecc15836bda6" -R ai-agent-marriage/clearspring-v3
gh secret set WX_APP_SECRET -b "2442d50db913ff0818ebd79cea520fe6" -R ai-agent-marriage/clearspring-v3
gh secret set WX_CLOUD_ENV_ID -b "cloud1-7ga68ls3ccebbe5b" -R ai-agent-marriage/clearspring-v3

# Gmail
gh secret set GMAIL_ADDRESS -b "davisedwad82@gmail.com" -R ai-agent-marriage/clearspring-v3
gh secret set GMAIL_APP_PASSWORD -b "dghc wioj lggw bwpu" -R ai-agent-marriage/clearspring-v3

# 飞书
gh secret set FEISHU_BOT_URL -b "https://open.feishu.cn/open-apis/bot/v2/hook/3297ae19-077a-4b42-b827-cd56b5b82791" -R ai-agent-marriage/clearspring-v3

# 火山云
gh secret set VOLCANO_HOST -b "101.96.192.63" -R ai-agent-marriage/clearspring-v3
gh secret set VOLCANO_SSH_USER -b "root" -R ai-agent-marriage/clearspring-v3
gh secret set VOLCANO_API_PORT -b "3000" -R ai-agent-marriage/clearspring-v3

# 构建配置
gh secret set NODE_VERSION -b "18" -R ai-agent-marriage/clearspring-v3
gh secret set JAVA_VERSION -b "17" -R ai-agent-marriage/clearspring-v3
gh secret set PM2_APP_NAME -b "clearspring-api" -R ai-agent-marriage/clearspring-v3

# SSH 私钥（从文件读取）
gh secret set VOLCANO_SSH_KEY --repo ai-agent-marriage/clearspring-v3 < ~/.ssh/spring3
```

### 第 4 步：验证配置

```bash
# 查看已配置的所有 Secrets
gh secret list -R ai-agent-marriage/clearspring-v3
```

预期输出：
```
WX_APP_ID             Added 2026-04-05T10:20:00Z
WX_APP_SECRET         Added 2026-04-05T10:20:01Z
WX_CLOUD_ENV_ID       Added 2026-04-05T10:20:02Z
GMAIL_ADDRESS         Added 2026-04-05T10:20:03Z
GMAIL_APP_PASSWORD    Added 2026-04-05T10:20:04Z
FEISHU_BOT_URL        Added 2026-04-05T10:20:05Z
VOLCANO_HOST          Added 2026-04-05T10:20:06Z
VOLCANO_SSH_USER      Added 2026-04-05T10:20:07Z
VOLCANO_API_PORT      Added 2026-04-05T10:20:08Z
NODE_VERSION          Added 2026-04-05T10:20:09Z
JAVA_VERSION          Added 2026-04-05T10:20:10Z
PM2_APP_NAME          Added 2026-04-05T10:20:11Z
VOLCANO_SSH_KEY       Added 2026-04-05T10:20:12Z
```

---

## 🔐 安全优势

使用 GitHub CLI 的优势：

1. **官方工具** - GitHub 官方维护，安全可靠
2. **加密传输** - 所有数据通过 HTTPS 加密
3. **不保存明文** - 命令执行后立即清除
4. **审计日志** - 所有操作记录在 GitHub 审计日志
5. **最小权限** - 只需要 repo 权限

---

## ⚠️ 配置完成后

### 1. 立即重置已暴露的密钥

```
🔴 高优先级（今天完成）
□ 微信小程序 AppSecret - https://mp.weixin.qq.com
□ Gmail 应用密码 - https://myaccount.google.com/security
□ 飞书 Webhook - 重新生成机器人

🟡 中优先级（本周完成）
□ 启用分支保护
□ 启用 Secret 扫描
□ 设置密钥轮换提醒
```

### 2. 验证 CI/CD 工作流

```bash
# 推送测试提交
cd /home/admin/.openclaw/workspace
git commit --allow-empty -m "ci: 触发 CI/CD 测试"
git push origin dev
```

然后查看：https://github.com/ai-agent-marriage/clearspring-v3/actions

---

## 📞 问题排查

### 问题：gh command not found

**解决**：安装 GitHub CLI
```bash
# Ubuntu/Debian
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh -y
```

### 问题：权限不足

**解决**：重新授权
```bash
gh auth logout
gh auth login
```

### 问题：SSH 密钥不存在

**解决**：检查 SSH 密钥
```bash
ls -la ~/.ssh/
# 如果没有 spring3，使用其他私钥或生成新的
ssh-keygen -t ed25519 -C "clearspring-v3"
```

---

## ✅ 完成清单

- [ ] 安装 GitHub CLI
- [ ] 登录 GitHub (`gh auth login`)
- [ ] 执行 13 个 `gh secret set` 命令
- [ ] 验证配置 (`gh secret list`)
- [ ] 重置已暴露的密钥
- [ ] 推送测试提交
- [ ] 查看 CI/CD 运行状态

---

**预计完成时间**: 3-5 分钟

*最后更新：2026-04-05*
