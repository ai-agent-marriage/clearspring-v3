# GitHub Secrets 配置指南 - ClearSpring V3

**创建时间**: 2026-04-05  
**最后更新**: 2026-04-05  
**安全等级**: 🔴 高（包含敏感配置）

---

## ⚠️ 安全警告

**本文档包含敏感配置信息，请妥善保管：**
- ✅ 不要将本文档提交到 Git 仓库
- ✅ 不要分享给他人
- ✅ 配置完成后建议删除明文密码部分
- ✅ 定期轮换密钥（建议 90 天）

---

## 📋 配置步骤

### 步骤 1：进入 Secrets 设置页面

1. 打开仓库：https://github.com/ai-agent-marriage/clearspring-v3
2. 点击 **Settings** 标签
3. 左侧菜单：**Secrets and variables** → **Actions**
4. 点击 **New repository secret** 按钮

---

### 步骤 2：配置 Secrets（逐个添加）

#### 📱 微信小程序配置（3 个）

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `WX_APP_ID` | `wxa914ecc15836bda6` | 小程序 AppID |
| `WX_APP_SECRET` | `2442d50db913ff0818ebd79cea520fe6` | ⚠️ **请立即重置** |
| `WX_CLOUD_ENV_ID` | `cloud1-7ga68ls3ccebbe5b` | 微信云环境 ID |

#### 📧 邮件通知配置（2 个）

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `GMAIL_ADDRESS` | `davisedwad82@gmail.com` | Gmail 地址 |
| `GMAIL_APP_PASSWORD` | `dghc wioj lggw bwpu` | ⚠️ **请立即重置** |

#### 📢 飞书通知配置（1 个）

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `FEISHU_BOT_URL` | `https://open.feishu.cn/open-apis/bot/v2/hook/3297ae19-077a-4b42-b827-cd56b5b82791` | ⚠️ **请重新生成** |

#### 🖥️ 火山云服务器配置（3 个）

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `VOLCANO_HOST` | `101.96.192.63` | 云服务器 IP |
| `VOLCANO_SSH_USER` | `root` | SSH 用户名 |
| `VOLCANO_API_PORT` | `3000` | API 端口 |

#### 🔧 构建配置（3 个）

| Secret 名称 | 值 | 说明 |
|------------|-----|------|
| `NODE_VERSION` | `18` | Node.js 版本 |
| `JAVA_VERSION` | `17` | Java 版本 |
| `PM2_APP_NAME` | `clearspring-api` | PM2 进程名 |

---

### 步骤 3：配置 SSH 密钥（重要）

#### 3.1 检查现有 SSH 密钥

你已有 SSH 密钥：
- **名称**: spring3
- **指纹**: `SHA256:bX4zYCSCkiEEZQeNyMjiuz1Uu/xKdTiGeamxpHUSmjw`
- **添加时间**: 2026-04-04
- **最后使用**: 最近一周内

#### 3.2 获取私钥内容

在本地终端执行：

```bash
# 查看私钥文件（通常在 ~/.ssh/ 目录）
ls -la ~/.ssh/

# 找到名为 spring3 或类似的私钥文件
cat ~/.ssh/spring3
# 或
cat ~/.ssh/id_ed25519
# 或
cat ~/.ssh/id_rsa
```

#### 3.3 添加为 GitHub Secret

1. 复制私钥的**完整内容**（包括 `-----BEGIN OPENSSH PRIVATE KEY-----` 和 `-----END OPENSSH PRIVATE KEY-----`）
2. 在 GitHub Secrets 页面创建新 Secret：
   - **Name**: `VOLCANO_SSH_KEY`
   - **Value**: 粘贴私钥内容
3. 点击 **Add secret**

#### 3.4 验证 SSH 连接

```bash
# 测试 SSH 连接到火山云服务器
ssh -i ~/.ssh/spring3 root@101.96.192.63

# 如果连接成功，说明密钥配置正确
```

---

### 步骤 4：创建 GitHub Actions 工作流

在仓库中创建文件：`.github/workflows/deploy.yml`

```yaml
name: ClearSpring V3 CI/CD

on:
  push:
    branches: [main, dev]
  pull_request:
    branches: [main]

jobs:
  # 小程序端构建
  miniprogram-build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd miniprogram
          npm install
      
      - name: Build miniprogram
        run: |
          cd miniprogram
          npm run build
        env:
          WX_APP_ID: ${{ secrets.WX_APP_ID }}
          WX_CLOUD_ENV_ID: ${{ secrets.WX_CLOUD_ENV_ID }}
      
      - name: Upload artifact
        uses: actions/upload-artifact@v4
        with:
          name: miniprogram-dist
          path: miniprogram/

  # 后端 API 构建与部署
  backend-deploy:
    runs-on: ubuntu-latest
    needs: miniprogram-build
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/dev'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Java
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Build backend
        run: |
          cd projects
          npm install
          npm run build
      
      - name: Deploy to Volcano Cloud
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.VOLCANO_SSH_KEY }}
          REMOTE_HOST: ${{ secrets.VOLCANO_HOST }}
          REMOTE_USER: ${{ secrets.VOLCANO_SSH_USER }}
          SOURCE: "projects/dist/"
          TARGET: "/opt/clearspring-v3/api"
          SCRIPT_AFTER: |
            cd /opt/clearspring-v3/api
            pm2 restart ${{ secrets.PM2_APP_NAME }} || pm2 start app.js --name ${{ secrets.PM2_APP_NAME }}
      
      - name: Notify Feishu (Success)
        if: success()
        run: |
          curl -X POST "${{ secrets.FEISHU_BOT_URL }}" \
            -H "Content-Type: application/json" \
            -d '{
              "msg_type": "text",
              "content": {
                "text": "✅ ClearSpring V3 部署成功\n分支：${{ github.ref }}\n提交：${{ github.sha }}\n时间：$(date -Iseconds)"
              }
            }'
      
      - name: Notify Feishu (Failure)
        if: failure()
        run: |
          curl -X POST "${{ secrets.FEISHU_BOT_URL }}" \
            -H "Content-Type: application/json" \
            -d '{
              "msg_type": "text",
              "content": {
                "text": "❌ ClearSpring V3 部署失败\n分支：${{ github.ref }}\n提交：${{ github.sha }}\n请检查：https://github.com/${{ github.repository }}/actions/runs/${{ github.run_id }}"
              }
            }'
```

---

### 步骤 5：验证配置

#### 5.1 推送测试提交

```bash
cd /home/admin/.openclaw/workspace

# 添加工作流文件
git add .github/workflows/deploy.yml

# 提交
git commit -m "ci: 添加 GitHub Actions CI/CD 配置"

# 推送到 dev 分支测试
git push origin dev
```

#### 5.2 检查构建状态

1. 打开：https://github.com/ai-agent-marriage/clearspring-v3/actions
2. 查看最新的 workflow 运行状态
3. 点击运行详情查看日志

#### 5.3 预期结果

- ✅ **miniprogram-build**: 成功（绿色）
- ✅ **backend-deploy**: 成功（绿色）
- ✅ **飞书通知**: 收到部署成功消息

---

## 🔒 安全加固建议

### 1. 立即重置的密钥（高优先级）

| 密钥 | 原因 | 操作 |
|------|------|------|
| 微信小程序 AppSecret | 已在聊天中暴露 | 立即重置 |
| Gmail 应用密码 | 已在聊天中暴露 | 立即重置 |
| 飞书 Webhook | 已在聊天中暴露 | 重新生成机器人 |

### 2. 启用分支保护

```bash
# 在 GitHub 仓库设置中：
Settings → Branches → Add branch protection rule

# 配置：
- Branch name pattern: main
- Require a pull request before merging: ✅
- Require status checks to pass before merging: ✅
  - Status checks: miniprogram-build, backend-deploy
- Require conversations to be resolved before merging: ✅
```

### 3. 配置 Secret 扫描

在 GitHub 仓库设置中启用：
- Settings → Security & analysis → Secret scanning → Enable

### 4. 定期轮换计划

| 密钥类型 | 轮换周期 | 提醒方式 |
|---------|---------|---------|
| 微信小程序 Secret | 90 天 | 飞书日历提醒 |
| Gmail 应用密码 | 90 天 | 飞书日历提醒 |
| SSH 密钥 | 180 天 | 飞书日历提醒 |
| 飞书 Webhook | 180 天 | 飞书日历提醒 |

---

## 📞 问题排查

### 问题 1：SSH 部署失败

**错误信息**: `Permission denied (publickey)`

**解决方案**:
```bash
# 1. 验证私钥格式正确
cat ~/.ssh/spring3 | head -1
# 应该输出：-----BEGIN OPENSSH PRIVATE KEY-----

# 2. 验证公钥已添加到服务器
ssh root@101.96.192.63 "cat ~/.ssh/authorized_keys"

# 3. 检查服务器 SSH 权限
ssh root@101.96.192.63
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 问题 2：飞书通知未收到

**排查步骤**:
```bash
# 1. 测试 Webhook
curl -X POST "https://open.feishu.cn/open-apis/bot/v2/hook/YOUR_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d '{"msg_type":"text","content":{"text":"测试"}}'

# 2. 检查 Secret 名称是否正确
# 必须是：FEISHU_BOT_URL

# 3. 查看 GitHub Actions 日志
# 确认 curl 命令执行成功
```

### 问题 3：小程序构建失败

**常见原因**:
- AppID 或 Secret 配置错误
- 依赖包版本不兼容
- Node.js 版本不匹配

**解决方案**:
```bash
# 1. 验证 Secrets 配置
# Settings → Secrets and variables → Actions
# 检查 WX_APP_ID 和 WX_APP_SECRET 是否正确

# 2. 本地测试构建
cd miniprogram
npm install
npm run build

# 3. 查看错误日志
# GitHub Actions → 失败的运行 → 查看日志
```

---

## ✅ 配置完成清单

- [ ] 进入 GitHub Secrets 设置页面
- [ ] 配置微信小程序 Secrets（3 个）
- [ ] 配置 Gmail Secrets（2 个）
- [ ] 配置飞书 Secrets（1 个）
- [ ] 配置火山云 Secrets（3 个）
- [ ] 配置构建 Secrets（3 个）
- [ ] 添加 SSH 私钥（VOLCANO_SSH_KEY）
- [ ] 创建 .github/workflows/deploy.yml
- [ ] 推送测试提交
- [ ] 验证 GitHub Actions 运行成功
- [ ] 收到飞书部署通知
- [ ] **重置已暴露的密钥**（高优先级）
- [ ] 启用分支保护
- [ ] 设置密钥轮换提醒

---

## 📚 相关文档

- [GitHub Actions 官方文档](https://docs.github.com/en/actions)
- [SSH 密钥配置指南](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [飞书机器人 API](https://open.feishu.cn/document/ukTMukTMukTM/ucTM5YjL3ETO24yNxkjN)

---

**配置完成后，请删除本文档中的明文密码部分！**

*最后更新：2026-04-05*
