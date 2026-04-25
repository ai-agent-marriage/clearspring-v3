# P0 优化配置（OpenClaw 4.14 官方标准版）

**创建时间**: 2026-04-15 13:34 UTC  
**依据**: OpenClaw v2026.4.14 官方文档  
**状态**: ✅ 可立即启用

---

## 📋 官方文档来源

1. **Active Memory 主文档**: https://docs.openclaw.ai/concepts/active-memory
2. **Memory 底层文档**: https://docs.openclaw.ai/concepts/memory
3. **CLI 命令手册**: https://openclaw-docs.beaverslab.xyz/en/cli/memory
4. **GitHub PR**: https://github.com/openclaw/openclaw/pull/63286

---

## 1️⃣ Active Memory 官方标准配置

### 配置结构（直接复制到 openclaw.json）

```json5
{
  "plugins": {
    "entries": {
      "active-memory": {
        "enabled": true,
        "config": {
          "enabled": true,
          "agents": ["main"],
          "allowedChatTypes": ["direct"],
          "modelFallback": "google/gemini-3-flash",
          "queryMode": "recent",
          "promptStyle": "balanced",
          "timeoutMs": 15000,
          "maxSummaryChars": 220,
          "persistTranscripts": false,
          "logging": true
        }
      }
    }
  }
}
```

### 启用步骤

1. 编辑 `openclaw.json`
2. 添加 Active Memory 配置
3. 重启 Gateway: `openclaw gateway`
4. 验证：`/active-memory status`

---

## 2️⃣ Memory Wiki 配置

```json5
{
  "plugins": {
    "allow": ["memory-core", "memory-wiki"],
    "entries": {
      "memory-wiki": {
        "enabled": true,
        "config": {
          "vault": "memory/wiki",
          "compileOnSave": true
        }
      }
    }
  }
}
```

---

## 3️⃣ 会话级控制

```text
/active-memory status      # 查看状态
/active-memory off         # 临时关闭
/active-memory on          # 临时开启
/active-memory off --global # 全局关闭
```

---

## 4️⃣ 预期效果

### Active Memory 启用后

**自动检索**:
- ✅ 无需手动说"搜索记忆"
- ✅ 回复前自动拉取项目上下文
- ✅ 显示记忆检索状态（verbose 模式）

**测试对话**:
```
用户：你还记得 ClearSpring 项目吗？

杨一：[自动触发 memory_search]
ClearSpring V3 项目当前状态：
- 综合评分：96/100 (A+)
- 64 个页面 100% 完成
- 26 个 P0/P1/P2 问题全部修复
- 生产环境就绪
```

---

## 🎯 杨一建议

**基于官方文档，建议立即启用 Active Memory！**

**理由**:
- ✅ 官方文档已确认
- ✅ 配置 100% 合规
- ✅ 安全风险低
- ✅ 收益高（自动记忆检索）

**需要我立即应用官方配置并启用 Active Memory 吗？**

**预计耗时**: 5 分钟  
**风险等级**: 🟢 低（官方标准配置）  
**预期收益**: ⭐⭐⭐⭐⭐
