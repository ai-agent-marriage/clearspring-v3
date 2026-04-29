# 清如 ClearSpring - 云函数部署指南

**更新时间**: 2026-03-29 09:15  
**部署状态**: 准备部署

---

## 📦 云函数清单（8 个）

| # | 函数名 | 状态 | 代码大小 | 依赖 | 部署状态 |
|---|--------|------|---------|------|---------|
| 1 | login | ✅ 完成 | 5.9KB | wx-server-sdk | ⏳ 待部署 |
| 2 | createOrder | ✅ 完成 | 7.5KB | wx-server-sdk | ⏳ 待部署 |
| 3 | grabOrder | ✅ 完成 | 8.5KB | wx-server-sdk | ⏳ 待部署 |
| 4 | uploadEvidence | ✅ 完成 | 12.6KB | wx-server-sdk | ⏳ 待部署 |
| 5 | generateCertificate | ⏳ 进行中 | - | - | ⏳ 待开发 |
| 6 | processPayment | ⏳ 进行中 | - | - | ⏳ 待开发 |
| 7 | sendNotification | ⏳ 进行中 | - | - | ⏳ 待开发 |
| 8 | synthesizeWatermark | ⏳ 进行中 | - | - | ⏳ 待开发 |

**完成率**: 4/8 (50%)

---

## 🚀 部署步骤

### 方式一：微信开发者工具（推荐）

1. **打开微信开发者工具**
   ```bash
   # 导入项目
   项目路径：/home/admin/.openclaw/workspace/projects/clearspring
   AppID: wxa914ecc15836bda6
   ```

2. **配置云开发环境**
   - 点击「云开发」按钮
   - 创建环境：`clearspring-prod`
   - 选择区域：广州

3. **上传云函数**
   ```bash
   # 右键点击 cloud/functions/login
   # 选择「上传并部署：云端安装依赖」
   # 重复操作其他 3 个云函数
   ```

4. **验证部署**
   - 进入云开发控制台
   - 云函数 → 查看已部署函数
   - 测试每个函数

### 方式二：CLI 自动部署（需要配置）

```bash
# 安装微信云开发 CLI
npm install -g @cloudbase/cli

# 登录
tcb login

# 部署云函数
tcb function deploy login --envId clearspring-prod
tcb function deploy createOrder --envId clearspring-prod
tcb function deploy grabOrder --envId clearspring-prod
tcb function deploy uploadEvidence --envspring-prod
```

---

## 📝 部署前检查

### 云函数代码检查
- [x] login/index.js - 代码完整
- [x] createOrder/index.js - 代码完整
- [x] grabOrder/index.js - 代码完整
- [x] uploadEvidence/index.js - 代码完整
- [ ] generateCertificate/index.js - 待开发
- [ ] processPayment/index.js - 待开发
- [ ] sendNotification/index.js - 待开发
- [ ] synthesizeWatermark/index.js - 待开发

### 配置文件检查
- [x] cloudfunction-config.json - 配置完整
- [x] package.json - 依赖完整
- [x] project.config.json - 项目配置

### 环境配置检查
- [ ] 云开发环境 ID: clearspring-prod
- [ ] 区域：ap-guangzhou
- [ ] AppID: wxa914ecc15836bda6

---

## 🧪 测试计划

### 单元测试（每个云函数）
```javascript
// login 测试
{
  "code": "mock_login_code",
  "userInfo": { "nickName": "测试用户" }
}

// createOrder 测试
{
  "species": { "id": "species_001", "name": "鲫鱼" },
  "location": { "latitude": 23.1234, "longitude": 113.2345 },
  "quantity": 100,
  "guidePrice": 299
}

// grabOrder 测试
{
  "orderId": "ORD20260329001"
}

// uploadEvidence 测试
{
  "action": "init",
  "orderId": "ORD20260329001",
  "fileName": "test.mp4",
  "fileSize": 10485760
}
```

### 集成测试流程
1. 用户登录 → login
2. 创建订单 → createOrder
3. 执行者抢单 → grabOrder
4. 上传证据 → uploadEvidence
5. 确认完成 → (待开发)
6. 生成分账 → processPayment (待开发)
7. 生成证书 → generateCertificate (待开发)
8. 推送通知 → sendNotification (待开发)

---

## ⚠️ 注意事项

1. **依赖安装**
   - 每个云函数都有独立的 package.json
   - 上传时必须选择「云端安装依赖」

2. **环境变量**
   - 目前不需要特殊环境变量
   - 如需配置，在 cloudfunction-config.json 中添加

3. **超时设置**
   - login: 30 秒
   - createOrder: 60 秒
   - grabOrder: 30 秒
   - uploadEvidence: 300 秒（5 分钟）

4. **权限配置**
   - 确保云函数有数据库读写权限
   - 确保云函数有文件上传权限

---

## 📊 部署进度

| 时间 | 操作 | 状态 | 备注 |
|------|------|------|------|
| 09:15 | 代码检查 | ✅ 完成 | 4 个云函数代码完整 |
| 09:20 | 配置检查 | ✅ 完成 | 配置文件完整 |
| 09:25 | 环境准备 | ⏳ 进行中 | 等待微信开发者工具 |
| 09:30 | 云函数上传 | ⏳ 等待中 | - |
| 09:45 | 功能测试 | ⏳ 等待中 | - |
| 10:00 | 集成测试 | ⏳ 等待中 | - |

---

## 🐛 已知问题

| 问题 | 影响 | 解决方案 | 状态 |
|------|------|---------|------|
| 云函数未部署 | 无法联调 | 使用微信开发者工具上传 | ⏳ 待解决 |
| 缺少测试数据 | 无法验证 | 准备模拟数据 | ⏳ 待解决 |
| 4 个云函数待开发 | 功能不完整 | 继续开发 | ⏳ 待解决 |

---

**下一步**: 使用微信开发者工具部署云函数

*文档持续更新中...*
