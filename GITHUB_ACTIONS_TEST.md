# GitHub Actions 部署测试报告

**测试时间**: 2026-04-05 10:55  
**测试目标**: 验证 CI/CD 自动部署流程

---

## 📊 服务器配置测试结果

| 测试项 | 状态 | 详情 |
|--------|------|------|
| SSH 连接 | ✅ 成功 | clearspring-bot@101.96.192.63 |
| 用户身份 | ✅ 正确 | clearspring-bot |
| SSH 密钥 | ✅ 存在 | github_actions (ed25519) |
| 部署目录 | ✅ 已创建 | /home/clearspring-bot/clearspring-v3/api |
| Node.js | ✅ 已安装 | v22.22.0 |
| npm | ✅ 已安装 | 10.9.4 |
| PM2 | ✅ 已安装 | 6.0.14 |
| GitHub SSH | ⚠️ 待验证 | 需要 Deploy Key |

---

## 🚀 GitHub Actions 测试

### 触发提交

- **Commit**: c27366d
- **信息**: ci: 测试 GitHub Actions 自动部署
- **分支**: main
- **推送时间**: 2026-04-05 10:55

### 监控链接

- **Actions 页面**: https://github.com/ai-agent-marriage/clearspring-v3/actions
- **工作流**: ClearSpring V3 CI/CD

### 预期流程

```
┌─────────────────────────────────────────────────────────────┐
│  Job 1: quality-check (GitHub Actions 服务器)               │
│  - 代码检查                                                 │
│  - ESLint                                                   │
│  - 单元测试                                                 │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Job 2: miniprogram-build (GitHub Actions 服务器)           │
│  - 安装依赖                                                 │
│  - 构建小程序                                               │
│  - 上传构建产物                                             │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Job 3: backend-deploy (GitHub Actions 服务器 → 火山云)     │
│  - 构建后端 API                                             │
│  - SSH 部署到火山云服务器                                   │
│  - PM2 重启服务                                             │
│  - 飞书通知                                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ 验证步骤

### 步骤 1：检查 GitHub Actions 状态

访问：https://github.com/ai-agent-marriage/clearspring-v3/actions

查看最新的 workflow 运行：
- ✅ 绿色 = 成功
- 🔴 红色 = 失败
- 🟡 黄色 = 进行中

### 步骤 2：查看构建日志

点击最新的 workflow 运行，查看每个 job 的详细日志：
1. quality-check
2. miniprogram-build
3. backend-deploy

### 步骤 3：验证部署

如果部署成功，在服务器上执行：

```bash
# SSH 登录服务器
ssh clearspring-bot@101.96.192.63

# 检查部署目录
ls -la /home/clearspring-bot/clearspring-v3/api/

# 检查 PM2 进程
pm2 list

# 查看日志
pm2 logs clearspring-api
```

### 步骤 4：检查通知

- ✅ 飞书机器人应收到部署成功/失败通知
- ✅ Gmail 应收到部署邮件（如果配置了）

---

## 🔧 可能的问题和解决方案

### 问题 1：SSH 部署失败

**错误**: `Permission denied (publickey)`

**解决方案**:
1. 验证 Deploy Key 已添加到 GitHub
   - 访问：https://github.com/ai-agent-marriage/clearspring-v3/settings/keys
2. 确认勾选了 "Allow write access"
3. 检查服务器上的公钥权限：
   ```bash
   chmod 644 ~/.ssh/github_actions.pub
   chmod 600 ~/.ssh/github_actions
   ```

### 问题 2：PM2 启动失败

**错误**: `Error: Cannot find module 'app.js'`

**解决方案**:
1. 检查部署目录是否有 app.js
2. 创建测试文件：
   ```bash
   cat > /home/clearspring-bot/clearspring-v3/api/app.js << 'EOF'
   const http = require('http');
   const server = http.createServer((req, res) => {
     res.writeHead(200);
     res.end('ClearSpring V3 API Running!');
   });
   server.listen(3000, () => {
     console.log('API listening on port 3000');
   });
   EOF
   ```

### 问题 3：飞书通知未收到

**检查**:
1. 验证 FEISHU_BOT_URL Secret 是否正确
2. 测试 Webhook：
   ```bash
   curl -X POST "YOUR_WEBHOOK_URL" \
     -H "Content-Type: application/json" \
     -d '{"msg_type":"text","content":{"text":"测试"}}'
   ```

---

## 📈 成功标准

- [ ] GitHub Actions 所有 job 显示绿色 ✅
- [ ] 服务器部署目录有代码
- [ ] PM2 进程正常运行
- [ ] 飞书收到部署通知
- [ ] API 可以访问（http://101.96.192.63:3000）

---

## 📝 下一步

如果测试成功：
1. ✅ CI/CD 流程已验证
2. ✅ 可以开始正常开发
3. ✅ 每次推送到 main/dev 分支都会自动部署

如果测试失败：
1. 查看 GitHub Actions 日志
2. 根据错误信息修复
3. 重新推送触发

---

**测试状态**: 🟡 进行中  
**最后更新**: 2026-04-05 10:55
