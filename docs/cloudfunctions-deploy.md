# 云函数部署指南

## 目录结构

```
cloudfunctions/
├── org-data/           # 机构数据获取
│   ├── index.js
│   └── package.json
├── order-list/         # 订单列表获取
│   ├── index.js
│   └── package.json
├── volunteer-list/     # 志愿者列表获取
│   ├── index.js
│   └── package.json
├── settlement-list/    # 结算数据获取
│   ├── index.js
│   └── package.json
└── log-error/          # 错误日志记录
    ├── index.js
    └── package.json
```

## 部署步骤

### 1. 安装微信开发者工具

下载地址：https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html

### 2. 导入云函数

1. 打开微信开发者工具
2. 打开小程序项目
3. 在工具栏点击「云开发」按钮
4. 进入云开发控制台

### 3. 上传云函数

#### 方法一：通过开发者工具上传

1. 在开发者工具中，右键点击 `cloudfunctions/org-data` 目录
2. 选择「上传并部署：云端安装依赖」
3. 等待上传完成
4. 重复上述步骤上传其他云函数

#### 方法二：通过命令行上传

```bash
# 进入云函数目录
cd cloudfunctions/org-data

# 安装依赖
npm install

# 使用云开发 CLI 上传
cloudbase functions deploy org-data
```

### 4. 验证部署

1. 进入云开发控制台
2. 点击「云函数」标签
3. 确认所有云函数状态为「部署成功」
4. 点击云函数名称查看详细信息

### 5. 配置数据库权限

确保以下数据库集合已创建并配置权限：

| 集合名称 | 说明 | 权限要求 |
|---------|------|---------|
| `organizations` | 机构信息 | 所有用户可读，仅管理员可写 |
| `orders` | 订单数据 | 机构用户可读自己机构的订单 |
| `volunteers` | 志愿者信息 | 机构用户可读自己机构的志愿者 |
| `tasks` | 任务数据 | 机构用户可读自己机构的任务 |
| `settlements` | 结算记录 | 机构用户可读自己机构的记录 |
| `invoices` | 发票信息 | 机构用户可读自己机构的发票 |
| `materials` | 执行材料 | 机构用户可读自己机构的材料 |
| `disputes` | 异议记录 | 机构用户可读自己机构的异议 |
| `error_logs` | 错误日志 | 仅管理员可读写 |

### 6. 测试云函数

在开发者工具控制台中测试：

```javascript
// 测试 org-data
wx.cloud.callFunction({
  name: 'org-data',
  data: {
    orgId: 'org_001',
    timestamp: Date.now()
  }
}).then(res => {
  console.log('org-data:', res);
});

// 测试 order-list
wx.cloud.callFunction({
  name: 'order-list',
  data: {
    orgId: 'org_001',
    status: 0,
    timestamp: Date.now()
  }
}).then(res => {
  console.log('order-list:', res);
});

// 测试 volunteer-list
wx.cloud.callFunction({
  name: 'volunteer-list',
  data: {
    orgId: 'org_001',
    timestamp: Date.now()
  }
}).then(res => {
  console.log('volunteer-list:', res);
});

// 测试 settlement-list
wx.cloud.callFunction({
  name: 'settlement-list',
  data: {
    orgId: 'org_001',
    tabType: 0,
    timestamp: Date.now()
  }
}).then(res => {
  console.log('settlement-list:', res);
});
```

## 常见问题

### Q1: 云函数上传失败

**原因：**
- 网络连接问题
- 云开发环境未开通
- 权限不足

**解决方案：**
1. 检查网络连接
2. 确认已开通云开发服务
3. 确认有云函数部署权限

### Q2: 云函数调用超时

**原因：**
- 数据库查询过慢
- 云函数逻辑复杂
- 网络延迟

**解决方案：**
1. 优化数据库查询，添加索引
2. 简化云函数逻辑
3. 增加超时时间配置（默认 3 秒，最大 60 秒）

### Q3: 数据库权限错误

**原因：**
- 集合权限配置不当
- 用户没有访问权限

**解决方案：**
1. 检查集合权限配置
2. 确保用户使用正确的 openid
3. 必要时使用自定义登录票据

### Q4: 依赖安装失败

**原因：**
- npm 源问题
- 依赖版本冲突

**解决方案：**
```bash
# 使用淘宝 npm 源
npm config set registry https://registry.npmmirror.com

# 重新安装依赖
npm install
```

## 监控与日志

### 查看云函数日志

1. 进入云开发控制台
2. 点击「云函数」
3. 选择要查看的云函数
4. 点击「日志」标签

### 设置告警

1. 进入云开发控制台
2. 点击「设置」
3. 配置云函数异常告警
4. 设置告警通知方式（邮件、微信）

### 性能监控

关注以下指标：
- 调用次数
- 平均耗时
- 错误率
- 超时次数

## 版本管理

### 云函数版本

每次上传都会生成新版本，可在云开发控制台查看历史版本。

### 回滚操作

1. 进入云开发控制台
2. 选择云函数
3. 点击「版本管理」
4. 选择要回滚的版本
5. 点击「部署」

## 安全建议

1. **参数验证**：所有输入参数必须验证
2. **权限检查**：检查用户是否有权限访问数据
3. **数据脱敏**：敏感数据不要返回给客户端
4. **错误处理**：不要暴露内部错误信息
5. **日志记录**：记录关键操作和错误

## 更新日志

| 版本 | 日期 | 更新内容 |
|-----|------|---------|
| 1.0.0 | 2026-04-12 | 初始部署指南 |
