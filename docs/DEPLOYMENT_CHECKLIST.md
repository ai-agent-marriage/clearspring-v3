# ClearSpring V3 生产部署检查清单

**创建时间**: 2026-04-13 10:45  
**责任人**: DevOps-Agent  
**状态**: 🔄 进行中

---

## 📋 部署前检查

### 1. 服务器环境

- [ ] 服务器可访问（SSH 连接测试）
- [ ] Node.js v18+ 已安装
- [ ] PM2 v5+ 已安装
- [ ] 部署用户已创建（clearspring-bot）
- [ ] SSH 密钥已配置

### 2. GitHub Secrets

- [ ] VOLCANO_SSH_KEY（SSH 私钥）
- [ ] VOLCANO_HOST（服务器 IP：101.96.192.63）
- [ ] VOLCANO_USER（部署用户：clearspring-bot）
- [ ] FEISHU_BOT_URL（飞书机器人 Webhook）
- [ ] WX_APP_ID（微信小程序 AppID）
- [ ] WX_APP_SECRET（微信小程序 Secret）

### 3. 应用配置

- [ ] 应用目录创建（/home/clearspring-bot/clearspring-v3）
- [ ] 环境变量配置文件（.env.production）
- [ ] PM2 配置文件（ecosystem.config.js）
- [ ] Nginx 配置（Web 管理端）

### 4. 安全配置

- [ ] SSH 密钥权限（600）
- [ ] 防火墙配置（端口 3000/80/443）
- [ ] HTTPS 证书（Let's Encrypt）
- [ ] 数据库连接加密

### 5. 监控告警

- [ ] PM2 监控配置
- [ ] 日志轮转配置
- [ ] Health Check 端点
- [ ] 告警通知配置

---

## 🚀 部署流程

### 阶段 1: 环境准备（预计 15 分钟）

1. SSH 连接服务器
2. 创建部署用户
3. 配置 SSH 授权
4. 安装 Node.js/PM2
5. 创建应用目录

### 阶段 2: GitHub Secrets 配置（预计 5 分钟）

1. 生成 SSH 密钥对
2. 配置 GitHub Secrets
3. 测试 Secrets 验证工作流

### 阶段 3: 首次部署（预计 10 分钟）

1. 触发 GitHub Actions
2. 观察部署过程
3. 验证 Health Check
4. 功能抽样测试

### 阶段 4: 监控配置（预计 10 分钟）

1. 配置 PM2 监控
2. 配置日志轮转
3. 配置外部监控（Uptime Robot）
4. 配置告警通知

---

## 📊 当前状态

| 检查项 | 状态 | 备注 |
|--------|------|------|
| 服务器 SSH | 🔴 待配置 | 需要配置 clearspring-bot 用户 |
| GitHub Secrets | 🔴 待配置 | 需要添加 6 个 Secrets |
| 应用目录 | 🔴 待创建 | /home/clearspring-bot/clearspring-v3 |
| 部署脚本 | ✅ 已完成 | simple-deploy.yml |
| 部署文档 | ✅ 已完成 | DEPLOYMENT_GUIDE.md |
| 回滚机制 | ✅ 已完成 | 自动回滚配置 |
| 监控告警 | 🔴 待配置 | PM2 Monitor + Uptime Robot |

---

## ⚠️ 注意事项

1. **SSH 密钥安全**
   - 使用 RSA 4096 位密钥
   - 密钥文件权限设为 600
   - 90 天周期轮换

2. **Secrets 管理**
   - 不在代码中硬编码敏感信息
   - 使用 GitHub Secrets 存储
   - 定期轮换密钥

3. **部署验证**
   - 首次部署后进行完整功能测试
   - 验证 Health Check 端点
   - 检查日志输出正常

4. **回滚准备**
   - 确保备份机制可用
   - 测试回滚流程
   - 记录回滚步骤

---

## 📞 问题排查

如遇到问题，参考：
- 部署指南：docs/DEPLOYMENT_GUIDE.md
- GitHub Actions 日志：https://github.com/ai-agent-marriage/clearspring-v3/actions
- PM2 日志：ssh clearspring-bot@101.96.192.63 "pm2 logs"

---

**下一步**: 等待用户确认部署配置 → 执行环境准备 → 配置 GitHub Secrets → 触发首次部署
