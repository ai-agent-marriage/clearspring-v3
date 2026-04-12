# 机构端页面 + CI/CD 部署问题清单（独立审查 B）

**审查日期**: 2026-04-12  
**审查者**: Agent B  
**问题总数**: 26 个（P0: 8 | P1: 12 | P2: 6）

---

## P0 问题（严重，必须修复）

### ISSUE-B-001: 数据交互逻辑完全缺失

**问题描述**: 所有页面的数据加载方法均为空实现，仅打印日志，未实际调用云函数获取数据。

**问题位置**:
- `pages/org-home/index.js:48-56` - `loadOrgData()` 方法
- `pages/org-home/orders.js:49-57` - `loadOrders()` 方法
- `pages/org-home/volunteers.js:52-60` - `loadVolunteers()` 方法
- `pages/org-home/settlement.js:73-81` - `loadSettlementData()` 方法

**严重级别**: 🔴 P0

**修复建议**: 
实现真实的云函数调用，处理网络请求、数据解析、错误处理。

**示例代码**:
```javascript
// 修复后示例
async loadOrgData() {
  try {
    const res = await wx.cloud.callFunction({
      name: 'org-data',
      data: { orgId: this.data.orgId }
    });
    if (res.result && res.result.data) {
      this.setData({ org: res.result.data });
    }
  } catch (error) {
    console.error('加载机构数据失败:', error);
    wx.showToast({
      title: '加载失败，请重试',
      icon: 'none',
      duration: 2000
    });
    // 记录错误日志
    wx.cloud.callFunction({
      name: 'log-error',
      data: { error: error.message, page: 'org-home' }
    });
  }
}
```

---

### ISSUE-B-002: 表单验证完全缺失

**问题描述**: 发票编辑表单无任何验证，必填项可为空，税号格式未校验。

**问题位置**: `pages/org-home/settlement.js:165-172` - `onSaveInvoice()` 方法

**严重级别**: 🔴 P0

**修复建议**: 
添加必填项验证、税号格式验证（15/18/20 位）、手机号格式验证。

**示例代码**:
```javascript
onSaveInvoice() {
  const { invoiceInfo } = this.data;
  
  // 必填项验证
  if (!invoiceInfo.company || !invoiceInfo.company.trim()) {
    wx.showToast({ title: '请输入单位名称', icon: 'none' });
    return;
  }
  if (!invoiceInfo.taxNo || !invoiceInfo.taxNo.trim()) {
    wx.showToast({ title: '请输入税号', icon: 'none' });
    return;
  }
  
  // 税号格式验证（15/18/20 位）
  const taxNoRegex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$|^[0-9A-HJ-NPQRTUWXY]{15,17}$/;
  if (!taxNoRegex.test(invoiceInfo.taxNo)) {
    wx.showToast({ title: '税号格式不正确', icon: 'none' });
    return;
  }
  
  // 手机号格式验证（如有）
  if (invoiceInfo.phone && !/^1[3-9]\d{9}$/.test(invoiceInfo.phone)) {
    wx.showToast({ title: '手机号格式不正确', icon: 'none' });
    return;
  }
  
  // 验证通过，保存数据
  console.log('保存发票信息:', invoiceInfo);
  wx.showToast({ title: '保存成功', icon: 'success' });
  this.setData({ showInvoiceForm: false, 'invoiceInfo.status': '审核中' });
}
```

---

### ISSUE-B-003: SSH 密钥安全配置不当

**问题描述**: GitHub Actions 中 SSH 密钥直接写入文件，存在泄露风险；无密钥轮换机制。

**问题位置**: 
- `.github/workflows/simple-deploy.yml:11-14`
- `.github/workflows/complete-deploy.yml:58-61`

**严重级别**: 🔴 P0

**修复建议**: 
使用 SSH 代理或短期凭证，添加 IP 白名单限制，实现密钥轮换。

**示例配置**:
```yaml
# 使用 SSH 代理（推荐）
- name: Setup SSH Agent
  uses: webfactory/ssh-agent@v0.5.3
  with:
    ssh-private-key: ${{ secrets.VOLCANO_SSH_KEY }}

- name: Deploy to Server
  run: |
    ssh -o StrictHostKeyChecking=no clearspring-bot@101.96.192.63 "
      # 部署命令
    "
```

**额外措施**:
1. 在 GitHub Secrets 中启用密钥加密
2. 配置服务器 SSH 仅允许特定 IP 访问
3. 每 90 天轮换一次 SSH 密钥
4. 使用部署密钥（Deploy Key）而非个人密钥

---

### ISSUE-B-004: 无测试文件和测试配置

**问题描述**: 项目中未发现任何测试文件，无测试脚本配置，测试覆盖率为 0。

**问题位置**: 全局问题

**严重级别**: 🔴 P0

**修复建议**: 
创建测试框架配置，编写核心功能测试用例。

**示例步骤**:
```bash
# 1. 安装测试框架
npm install --save-dev jest miniprogram-simulate

# 2. 创建测试配置
# jest.config.js
module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  collectCoverageFrom: ['pages/**/*.js'],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};

# 3. 添加测试脚本
# package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage"
  }
}
```

---

### ISSUE-B-005: 无部署文档

**问题描述**: 项目中无任何部署文档，新成员无法了解部署流程。

**问题位置**: 全局问题

**严重级别**: 🔴 P0

**修复建议**: 
创建 `DEPLOY.md` 文档，包含部署流程、配置说明、故障排查。

**文档大纲**:
```markdown
# 部署指南

## 前置条件
- GitHub 账号
- 服务器 SSH 访问权限
- 微信小程序开发者权限

## Secrets 配置
| 名称 | 说明 | 获取方式 |
|------|------|----------|
| VOLCANO_SSH_KEY | 服务器 SSH 私钥 | `cat ~/.ssh/id_rsa | base64` |
| VOLCANO_HOST | 服务器 IP | 联系运维获取 |
| FEISHU_BOT_URL | 飞书机器人 Webhook | 飞书开放平台创建 |
| WX_APP_ID | 微信小程序 AppID | 微信公众平台 |
| WX_APP_SECRET | 微信小程序 Secret | 微信公众平台 |

## 部署流程
1. 推送代码到 main/dev 分支
2. GitHub Actions 自动触发
3. 等待部署完成（约 2-3 分钟）
4. 查看飞书通知

## 故障排查
### 部署失败
1. 检查 GitHub Actions 日志
2. 验证 SSH 密钥是否有效
3. 确认服务器 PM2 是否运行

### 健康检查失败
1. SSH 登录服务器
2. `pm2 list` 查看进程状态
3. `pm2 logs` 查看日志
```

---

### ISSUE-B-006: 无回滚机制

**问题描述**: 部署失败后无自动回滚流程，需手动恢复。

**问题位置**: `.github/workflows/complete-deploy.yml:67-70`（有备份但无回滚逻辑）

**严重级别**: 🔴 P0

**修复建议**: 
添加自动回滚步骤，部署失败时自动恢复备份。

**示例代码**:
```yaml
- name: Deploy to Server
  run: |
    ssh -i ~/.ssh/deploy_key clearspring-bot@101.96.192.63 "
      cd /home/clearspring-bot/clearspring-v3/api
      
      # 备份当前版本
      BACKUP_DIR=\"/home/clearspring-bot/clearspring-v3/api_backup_\$(date +%Y%m%d_%H%M%S)\"
      if [ -f 'app.js' ]; then
        cp -r . \"\$BACKUP_DIR\"
        echo \"BACKUP_DIR=\$BACKUP_DIR\" >> \$GITHUB_ENV
      fi
      
      # 部署新版本
      # ... 部署命令 ...
      
      # 健康检查
      HEALTH=\$(curl -s http://localhost:3000/health | jq -r '.status')
      if [ \"\$HEALTH\" != \"ok\" ]; then
        echo '❌ Health check failed, rolling back...'
        rm -rf *
        cp -r \"\$BACKUP_DIR\"/* .
        pm2 restart clearspring-api
        exit 1
      fi
    "
```

---

### ISSUE-B-007: 无网络超时和错误处理

**问题描述**: 所有异步操作无超时控制，网络错误仅简单打印日志。

**问题位置**: 所有页面的 `async` 方法

**严重级别**: 🔴 P0

**修复建议**: 
添加超时控制、重试机制、错误分类处理。

**示例代码**:
```javascript
// 添加超时控制的请求
async requestWithTimeout(promise, timeoutMs = 10000) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('请求超时')), timeoutMs);
  });
  return Promise.race([promise, timeout]);
}

async loadOrgData() {
  try {
    const res = await this.requestWithTimeout(
      wx.cloud.callFunction({ name: 'org-data' }),
      10000
    );
    // 处理响应
  } catch (error) {
    if (error.message === '请求超时') {
      wx.showToast({ title: '网络超时，请重试', icon: 'none' });
    } else if (error.errMsg?.includes('timeout')) {
      wx.showToast({ title: '服务器响应超时', icon: 'none' });
    } else {
      wx.showToast({ title: '加载失败，请检查网络', icon: 'none' });
    }
    console.error('加载失败:', error);
  }
}
```

---

### ISSUE-B-008: 无监控告警配置

**问题描述**: 仅部署时有飞书通知，无持续监控和告警机制。

**问题位置**: 全局问题

**严重级别**: 🔴 P0

**修复建议**: 
集成服务器监控（如 PM2 + 监控平台），配置告警规则。

**示例配置**:
```javascript
// ecosystem.config.js 添加监控配置
module.exports = {
  apps: [{
    name: 'clearspring-api',
    script: 'app.js',
    // ... 其他配置 ...
    
    // 错误阈值告警
    max_restarts: 10,
    min_uptime: '10s',
    
    // 日志配置
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    
    // 合并日志（便于采集）
    merge_logs: true,
    
    // 自动重启时间间隔
    restart_delay: 4000
  }]
};
```

**监控平台建议**:
- PM2 Plus（官方监控）
- Prometheus + Grafana（自建）
- 阿里云 ARMS（云服务）

---

## P1 问题（重要，建议修复）

### ISSUE-B-009: 硬编码颜色值

**问题描述**: 部分 WXSS 文件直接使用 `#D4B87B` 等硬编码颜色，未使用 CSS 变量。

**问题位置**: 
- `pages/org-home/index.wxss:13` - `background: rgba(212, 184, 123, 0.95)`
- `pages/org-home/orders.wxss:13` - 同上
- 多个文件存在类似问题

**严重级别**: 🟡 P1

**修复建议**: 
替换为 CSS 变量 `var(--stitch-gold-primary)`。

---

### ISSUE-B-010: 重复的数据加载逻辑

**问题描述**: 4 个页面的数据加载方法高度重复，未抽取公共模块。

**问题位置**: 所有页面的 `load*Data()` 和 `refresh*Data()` 方法

**严重级别**: 🟡 P1

**修复建议**: 
创建 `utils/request.js` 或 `utils/api.js` 统一数据请求逻辑。

---

### ISSUE-B-011: 无骨架屏加载状态

**问题描述**: 仅使用 `setTimeout(500)` 模拟加载，无骨架屏或加载动画。

**问题位置**: 所有页面

**严重级别**: 🟡 P1

**修复建议**: 
添加骨架屏组件，提升用户体验。

---

### ISSUE-B-012: 无空状态引导

**问题描述**: 空状态仅显示"暂无数据"，无操作引导。

**问题位置**: 
- `pages/org-home/orders.wxml:47-51`
- `pages/org-home/volunteers.wxml:45-52`

**严重级别**: 🟡 P1

**修复建议**: 
添加操作引导按钮，如"刷新"、"去创建"等。

---

### ISSUE-B-013: 工作流冗余

**问题描述**: `simple-deploy.yml` 与 `complete-deploy.yml` 功能重叠，易混淆。

**问题位置**: `.github/workflows/` 目录

**严重级别**: 🟡 P1

**修复建议**: 
合并为单一工作流，或明确区分使用场景（开发/生产）。

---

### ISSUE-B-014: 构建产物未利用

**问题描述**: `miniprogram-build` 阶段的产物未传递给部署阶段。

**问题位置**: `.github/workflows/complete-deploy.yml:43-49`

**严重级别**: 🟡 P1

**修复建议**: 
使用 `actions/download-artifact` 下载构建产物并部署。

---

### ISSUE-B-015: 无重试机制

**问题描述**: SSH 连接失败、部署命令失败无重试。

**问题位置**: 所有 SSH 相关步骤

**严重级别**: 🟡 P1

**修复建议**: 
添加 `retry` 步骤或使用 `actions/checkout@v4` 的 retry 配置。

---

### ISSUE-B-016: 无超时控制

**问题描述**: SSH 命令无超时设置，可能无限等待。

**问题位置**: 所有 SSH 命令

**严重级别**: 🟡 P1

**修复建议**: 
添加 `ConnectTimeout` 和 `ServerAliveInterval` 配置。

```yaml
ssh -o ConnectTimeout=30 -o ServerAliveInterval=60 -i ~/.ssh/deploy_key ...
```

---

### ISSUE-B-017: 日志未集中管理

**问题描述**: PM2 日志本地存储，无日志聚合和查询。

**问题位置**: `ecosystem.config.js`

**严重级别**: 🟡 P1

**修复建议**: 
接入日志聚合服务（如 ELK、阿里云日志服务）。

---

### ISSUE-B-018: 无响应式布局

**问题描述**: 未针对不同屏幕尺寸做适配。

**问题位置**: 所有 WXSS 文件

**严重级别**: 🟡 P1

**修复建议**: 
使用媒体查询或动态 rpx 计算适配不同屏幕。

---

### ISSUE-B-019: 无性能优化

**问题描述**: 无图片懒加载、数据缓存等优化。

**问题位置**: 所有页面

**严重级别**: 🟡 P1

**修复建议**: 
添加图片懒加载、接口数据缓存、分页加载。

---

### ISSUE-B-020: 代码注释不足

**问题描述**: 关键逻辑无注释，复杂操作无说明。

**问题位置**: 所有 JS 文件

**严重级别**: 🟡 P1

**修复建议**: 
添加 JSDoc 风格注释，说明函数用途、参数、返回值。

---

## P2 问题（优化，可延后）

### ISSUE-B-021: 状态颜色可访问性

**问题描述**: 部分状态颜色对比度不足，色弱用户难以识别。

**问题位置**: 状态标签样式

**严重级别**: 🟢 P2

**修复建议**: 
增加图标或文字辅助识别状态。

---

### ISSUE-B-022: 按钮文案不一致

**问题描述**: 部分按钮使用"确定"，部分使用"确认"。

**问题位置**: 多个弹窗

**严重级别**: 🟢 P2

**修复建议**: 
统一文案规范。

---

### ISSUE-B-023: 无动画过渡

**问题描述**: 页面切换、弹窗显示无动画过渡。

**问题位置**: 所有页面

**严重级别**: 🟢 P2

**修复建议**: 
添加 CSS 过渡动画。

---

### ISSUE-B-024: 无错误边界

**问题描述**: 单点错误可能导致整个页面崩溃。

**问题位置**: 所有页面

**严重级别**: 🟢 P2

**修复建议**: 
添加错误边界组件，捕获并展示错误。

---

### ISSUE-B-025: 无辅助功能

**问题描述**: 无 aria 标签、键盘导航等辅助功能。

**问题位置**: 所有页面

**严重级别**: 🟢 P2

**修复建议**: 
添加 aria 标签，支持键盘操作。

---

### ISSUE-B-026: 无版本管理

**问题描述**: 代码无版本号，难以追踪变更。

**问题位置**: 全局问题

**严重级别**: 🟢 P2

**修复建议**: 
使用语义化版本（SemVer），在代码和部署中体现版本号。

---

## 问题统计

| 级别 | 数量 | 占比 |
|------|------|------|
| 🔴 P0 | 8 | 30.8% |
| 🟡 P1 | 12 | 46.2% |
| 🟢 P2 | 6 | 23.0% |
| **总计** | **26** | **100%** |

---

**清单生成时间**: 2026-04-12 09:45  
**建议修复顺序**: P0 → P1 → P2
