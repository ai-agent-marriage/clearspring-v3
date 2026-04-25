# GitHub Secrets 快速配置清单 ✅

**目标**: 在 10 分钟内完成所有 Secrets 配置

---

## 📋 配置清单（共 15 个 Secrets）

### 第一步：进入设置页面（1 分钟）

- [ ] 打开 https://github.com/ai-agent-marriage/clearspring-v3
- [ ] 点击 **Settings** 标签
- [ ] 点击 **Secrets and variables** → **Actions**
- [ ] 准备点击 **New repository secret**

---

### 第二步：逐个添加 Secrets（8 分钟）

#### 微信小程序（3 个）⚠️

> **注意**: 这些密钥已在聊天中暴露，**配置完成后请立即重置**！

- [ ] `WX_APP_ID` = `wxa914ecc15836bda6`
- [ ] `WX_APP_SECRET` = `2442d50db913ff0818ebd79cea520fe6` ⚠️
- [ ] `WX_CLOUD_ENV_ID` = `cloud1-7ga68ls3ccebbe5b`

#### Gmail 邮件（2 个）⚠️

> **注意**: 这些密钥已在聊天中暴露，**配置完成后请立即重置**！

- [ ] `GMAIL_ADDRESS` = `davisedwad82@gmail.com`
- [ ] `GMAIL_APP_PASSWORD` = `dghc wioj lggw bwpu` ⚠️

#### 飞书通知（1 个）⚠️

> **注意**: Webhook 已暴露，**配置完成后请重新生成机器人**！

- [ ] `FEISHU_BOT_URL` = `https://open.feishu.cn/open-apis/bot/v2/hook/3297ae19-077a-4b42-b827-cd56b5b82791` ⚠️

#### 火山云服务器（3 个）

- [ ] `VOLCANO_HOST` = `101.96.192.63`
- [ ] `VOLCANO_SSH_USER` = `root`
- [ ] `VOLCANO_API_PORT` = `3000`

#### 构建配置（3 个）

- [ ] `NODE_VERSION` = `18`
- [ ] `JAVA_VERSION` = `17`
- [ ] `PM2_APP_NAME` = `clearspring-api`

#### SSH 私钥（1 个）🔑

- [ ] `VOLCANO_SSH_KEY` = （从本地 ~/.ssh/ 目录获取私钥内容）

**获取 SSH 私钥命令**:
```bash
# 查看可用的私钥
ls -la ~/.ssh/

# 查看私钥内容（复制完整内容，包括 BEGIN 和 END 行）
cat ~/.ssh/spring3
# 或
cat ~/.ssh/id_ed25519
# 或
cat ~/.ssh/id_rsa
```

---

### 第三步：验证配置（1 分钟）

- [ ] 确认已添加 15 个 Secrets
- [ ] 检查每个 Secret 名称拼写正确
- [ ] 确认没有多余的空格或换行

---

### 第四步：提交工作流文件（2 分钟）

```bash
cd /home/admin/.openclaw/workspace

# 查看变更
git status

# 添加新文件
git add .github/workflows/deploy.yml
git add docs/GITHUB_SECRETS_SETUP.md
git add docs/GITHUB_SECRETS_CHECKLIST.md

# 提交
git commit -m "ci: 添加 GitHub Actions CI/CD 配置和 Secrets 指南"

# 推送到 dev 分支测试
git push origin dev
```

---

### 第五步：验证构建（等待 3-5 分钟）

- [ ] 打开 https://github.com/ai-agent-marriage/clearspring-v3/actions
- [ ] 查看最新的 workflow 运行
- [ ] 等待 `quality-check` 完成
- [ ] 等待 `miniprogram-build` 完成
- [ ] 等待 `backend-deploy` 完成
- [ ] 检查所有步骤都是绿色 ✅

---

### 第六步：验证通知（1 分钟）

- [ ] 飞书收到部署成功通知
- [ ] Gmail 收到部署邮件（如果配置了）

---

## 🔒 安全加固（配置完成后立即执行）

### 高优先级（必须立即执行）

- [ ] **重置微信小程序 AppSecret**
  - 登录 https://mp.weixin.qq.com
  - 开发 → 开发管理 → 开发设置 → 重置 Secret
  - 更新 GitHub Secret: `WX_APP_SECRET`

- [ ] **重置 Gmail 应用密码**
  - 登录 Google 账户安全设置
  - 撤销当前应用专用密码
  - 生成新密码并更新 GitHub Secret: `GMAIL_APP_PASSWORD`

- [ ] **重新生成飞书机器人**
  - 在飞书群中移除当前机器人
  - 重新添加自定义机器人
  - 获取新 Webhook 并更新 GitHub Secret: `FEISHU_BOT_URL`

### 中优先级（建议本周内完成）

- [ ] 启用分支保护（main 分支）
- [ ] 启用 GitHub Secret 扫描
- [ ] 设置密钥轮换提醒（飞书日历）

---

## ⏱️ 时间估算

| 步骤 | 预计时间 |
|------|---------|
| 进入设置页面 | 1 分钟 |
| 添加 15 个 Secrets | 8 分钟 |
| 验证配置 | 1 分钟 |
| 提交工作流文件 | 2 分钟 |
| 等待构建完成 | 3-5 分钟 |
| 验证通知 | 1 分钟 |
| **总计** | **约 15-20 分钟** |

---

## 🆘 遇到问题？

查看完整文档：`docs/GITHUB_SECRETS_SETUP.md`

常见问题：
- SSH 连接失败 → 检查私钥格式和服务器权限
- 飞书通知未收到 → 测试 Webhook URL
- 小程序构建失败 → 检查 AppID 和 Secret
- Gmail 发送失败 → 检查应用密码格式

---

**开始时间**: ________  
**完成时间**: ________  
**实际用时**: ________  

*配置完成后，请删除此清单中的明文密码部分！*
