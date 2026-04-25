# OpenClaw 4.14 P0 优化配置

**创建时间**: 2026-04-15 11:43 UTC  
**优化目标**: 启用 Active Memory + 飞书文档评论 + 安全加固

---

## 1️⃣ Active Memory 配置

### 启用方式

在 `openclaw.json` 中添加：

```json
{
  "activeMemory": {
    "enabled": true,
    "mode": "full",
    "beforeReply": true,
    "verbose": true,
    "searchLimit": 10,
    "minScore": 0.6,
    "transcript": {
      "enabled": true,
      "path": "memory/active-memory-transcripts"
    }
  }
}
```

### 配置说明

| 参数 | 值 | 说明 |
|------|-----|------|
| `enabled` | true | 启用 Active Memory |
| `mode` | full | 完整上下文模式（message/recent/full） |
| `beforeReply` | true | 回复前自动检索 |
| `verbose` | true | 显示检索状态 |
| `searchLimit` | 10 | 最多返回 10 条记忆 |
| `minScore` | 0.6 | 最低相关度阈值 |
| `transcript.enabled` | true | 启用转录持久化 |

### 预期效果

- ✅ 自动检索相关记忆（无需手动说"搜索记忆"）
- ✅ 回复前自动拉取项目上下文
- ✅ `/verbose` 实时检查记忆检索状态
- ✅ 转录持久化用于调试

---

## 2️⃣ 飞书文档评论配置

### 启用方式

飞书插件已安装，文档评论功能自动支持。

### 使用示例

```javascript
feishu_doc_comments({
  action: "create",
  file_token: "F29BdzqosoSqFoxRXTKctbsAnfc",
  file_type: "docx",
  elements: [
    { type: "text", text: "项目进展顺利！" },
    { type: "mention", open_id: "ou_xxx" }
  ]
})
```

### 预期效果

- ✅ 文档评论会话支持
- ✅ 评论反应功能
- ✅ 更丰富的上下文解析
- ✅ 打字反馈

---

## 3️⃣ 安全加固配置

### 配置快照脱敏

```json
{
  "security": {
    "redactConfigSnapshot": true,
    "redactFields": ["apiKey", "secret", "password", "token", "sourceConfig", "runtimeConfig"]
  }
}
```

### SSRF 策略

```json
{
  "browser": {
    "ssrfPolicy": "strict",
    "allowPrivateNetwork": false,
    "trustedProxyIPs": ["127.0.0.1"]
  }
}
```

### 网关工具危险标志拦截

```json
{
  "gateway": {
    "security": {
      "blockDangerousFlags": [
        "dangerouslyDisableDeviceAuth",
        "allowInsecureAuth",
        "dangerouslyAllowHostHeaderOriginFallback",
        "hooks.gmail.allowUnsafeExternalContent"
      ]
    }
  }
}
```

---

## 4️⃣ 验证步骤

### 步骤 1：检查配置

```bash
openclaw config show | grep -A 10 activeMemory
```

### 步骤 2：测试 Active Memory

测试对话："你还记得 ClearSpring 项目吗？"

**预期响应**:
- ✅ 自动检索项目记忆
- ✅ 显示记忆检索状态
- ✅ 基于记忆生成回复

### 步骤 3：测试飞书文档评论

在飞书文档中添加评论测试

### 步骤 4：安全验证

```bash
openclaw security audit
```

---

**配置完成时间**: 2026-04-15 11:43 UTC  
**配置执行者**: 杨一  
**配置状态**: ⏳ 待应用
