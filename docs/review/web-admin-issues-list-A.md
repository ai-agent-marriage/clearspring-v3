# Web 管理端问题清单（审查 A）

## 问题编号说明

- **WEB-ISSUE-A-001 ~ WEB-ISSUE-A-009**: P0 严重问题
- **WEB-ISSUE-A-010 ~ WEB-ISSUE-A-017**: P1 重要问题
- **WEB-ISSUE-A-018 ~ WEB-ISSUE-A-029**: P2 建议优化

---

## P0 严重问题（必须立即修复）

### WEB-ISSUE-A-001: 技术栈不一致

| 项目 | 内容 |
|------|------|
| **问题描述** | admin-h5 实际使用 React 18，与任务描述的"Vue 3 + Vite + TailwindCSS"不符 |
| **问题位置** | `admin-h5/package.json`, `admin-h5/src/App.jsx`, `admin-h5/src/main.jsx` |
| **严重级别** | P0 |
| **影响范围** | 技术选型混乱，增加维护成本 |
| **修复建议** | 方案 1：将 admin-h5 迁移到 Vue 3；方案 2：更新文档说明实际技术栈 |

**示例代码**（当前 React 实现）：
```jsx
// admin-h5/src/App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
```

**建议代码**（如迁移到 Vue 3）：
```vue
<!-- admin-h5/src/App.vue -->
<template>
  <router-view />
</template>

<script setup>
import { RouterView } from 'vue-router'
</script>
```

---

### WEB-ISSUE-A-002: Token 验证逻辑缺失

| 项目 | 内容 |
|------|------|
| **问题描述** | `permission.js` 中 Token 有效性验证是 TODO 状态，仅检查是否存在，未验证有效性 |
| **问题位置** | `admin-pc/src/permission.js` 第 42-48 行 |
| **严重级别** | P0 |
| **影响范围** | 过期 Token 仍可访问受保护页面 |
| **修复建议** | 实现 JWT Token 验证，添加 Token 刷新机制 |

**当前代码**：
```javascript
// Token 验证（可选：可以在这里添加 Token 有效性验证）
try {
  // TODO: 可以在这里添加 Token 验证逻辑
  // const valid = await validateToken(token)
  // if (!valid) {
  //   localStorage.removeItem('admin_token')
  //   ElMessage.error('登录已过期，请重新登录')
  //   next({ path: '/login' })
  //   return
  // }
  next()
} catch (error) {
  // ...
}
```

**建议修复**：
```javascript
import { jwtDecode } from 'jwt-decode'

// Token 验证
try {
  const decoded = jwtDecode(token)
  const now = Date.now() / 1000
  
  // 检查是否过期
  if (decoded.exp < now) {
    // 尝试刷新 Token
    try {
      const newToken = await refreshToken()
      localStorage.setItem('admin_token', newToken)
      next()
    } catch {
      localStorage.removeItem('admin_token')
      ElMessage.error('登录已过期，请重新登录')
      next({ path: '/login' })
      return
    }
  } else {
    next()
  }
} catch (error) {
  console.error('Token 验证失败:', error)
  localStorage.removeItem('admin_token')
  ElMessage.error('登录已过期，请重新登录')
  next({ path: '/login' })
}
```

---

### WEB-ISSUE-A-003: XSS 防护缺失

| 项目 | 内容 |
|------|------|
| **问题描述** | 用户输入未进行 HTML 转义，存在 XSS 攻击风险 |
| **问题位置** | 所有显示用户输入的组件，如 `UserList.vue`, `ContentAudit.vue` |
| **严重级别** | P0 |
| **影响范围** | 恶意脚本注入 |
| **修复建议** | 安装 DOMPurify，对所有用户输入进行转义 |

**安装依赖**：
```bash
npm install dompurify
```

**使用示例**：
```javascript
import DOMPurify from 'dompurify'

// 在显示前转义
const safeContent = DOMPurify.sanitize(userInput)
```

**Vue 全局配置**：
```javascript
// main.js
import DOMPurify from 'dompurify'

app.config.globalProperties.$sanitize = DOMPurify.sanitize
```

---

### WEB-ISSUE-A-004: CSRF 防护缺失

| 项目 | 内容 |
|------|------|
| **问题描述** | 未使用 CSRF Token，存在跨站请求伪造风险 |
| **问题位置** | `admin-pc/src/api/request.js` |
| **严重级别** | P0 |
| **影响范围** | 恶意网站可伪造用户请求 |
| **修复建议** | 在请求拦截器中添加 CSRF Token |

**建议修复**：
```javascript
// request.js
request.interceptors.request.use(config => {
  const token = localStorage.getItem('admin_token')
  const csrfToken = localStorage.getItem('csrf_token')
  
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  if (csrfToken) {
    config.headers['X-CSRF-Token'] = csrfToken
  }
  
  return config
})
```

---

### WEB-ISSUE-A-005: 无自动化测试

| 项目 | 内容 |
|------|------|
| **问题描述** | 只有测试用例文档 (`P0_CORE_MODULE_TESTS.md`)，无实际自动化测试代码 |
| **问题位置** | `admin-pc/tests/` 目录仅有 Markdown 文档 |
| **严重级别** | P0 |
| **影响范围** | 无法保证代码质量，回归测试困难 |
| **修复建议** | 添加 Vitest + Vue Test Utils + Playwright |

**建议配置**：
```json
// package.json
{
  "devDependencies": {
    "vitest": "^1.0.0",
    "@vue/test-utils": "^2.4.0",
    "playwright": "^1.40.0"
  },
  "scripts": {
    "test:unit": "vitest",
    "test:e2e": "playwright test"
  }
}
```

---

## P1 重要问题（应该修复）

### WEB-ISSUE-A-010: API 错误处理不一致

| 项目 | 内容 |
|------|------|
| **问题描述** | 部分组件 catch 后只 console.error，未给用户提示 |
| **问题位置** | `QualificationAudit.vue`, `ProfitSharing.vue` 等 |
| **严重级别** | P1 |
| **修复建议** | 统一错误处理，所有 API 错误都要给用户提示 |

**问题代码**：
```javascript
catch (error) {
  console.error('加载审核列表失败:', error)
  // 未给用户提示
}
```

**建议修复**：
```javascript
catch (error) {
  console.error('加载审核列表失败:', error)
  ElMessage.error('加载审核列表失败，请稍后重试')
}
```

---

### WEB-ISSUE-A-011: 部分页面无加载状态

| 项目 | 内容 |
|------|------|
| **问题描述** | 部分页面异步加载时未显示 loading 状态 |
| **问题位置** | `ProfitSharing.vue`, `SystemSettings.vue` |
| **严重级别** | P1 |
| **修复建议** | 所有异步操作添加 v-loading |

---

### WEB-ISSUE-A-012: 空状态处理不一致

| 项目 | 内容 |
|------|------|
| **问题描述** | 部分列表无数据时未显示空状态提示 |
| **问题位置** | 多个列表页面 |
| **严重级别** | P1 |
| **修复建议** | 使用 `el-empty` 组件统一空状态 |

---

### WEB-ISSUE-A-013: 按钮级权限控制缺失

| 项目 | 内容 |
|------|------|
| **问题描述** | 路由有守卫，但按钮级权限控制不足 |
| **问题位置** | 所有包含操作按钮的页面 |
| **严重级别** | P1 |
| **修复建议** | 添加自定义指令 `v-permission` |

**建议实现**：
```javascript
// directives/permission.js
export default {
  mounted(el, binding) {
    const { value } = binding
    const permissions = localStorage.getItem('permissions')
    
    if (value && value.length > 0 && !permissions.includes(value)) {
      el.parentNode && el.parentNode.removeChild(el)
    }
  }
}

// 使用
<el-button v-permission="['user:delete']">删除</el-button>
```

---

### WEB-ISSUE-A-014: 代码注释不足

| 项目 | 内容 |
|------|------|
| **问题描述** | 关键逻辑缺少注释，复杂函数无说明 |
| **问题位置** | 多个组件文件 |
| **严重级别** | P1 |
| **修复建议** | 添加 JSDoc 风格注释 |

---

### WEB-ISSUE-A-015: 未实现请求取消

| 项目 | 内容 |
|------|------|
| **问题描述** | 组件卸载时未取消进行中的请求 |
| **问题位置** | 所有发起 API 请求的组件 |
| **严重级别** | P1 |
| **修复建议** | 使用 AbortController 取消请求 |

---

### WEB-ISSUE-A-016: 部分功能未完成

| 项目 | 内容 |
|------|------|
| **问题描述** | 多处 TODO 标记，功能未实现 |
| **问题位置** | `ProfitSharing.vue` (加载配置), `UserList.vue` (批量禁用), `SystemSettings.vue` (管理员管理) |
| **严重级别** | P1 |
| **修复建议** | 完成所有 TODO 功能 |

---

### WEB-ISSUE-A-017: 敏感信息脱敏不足

| 项目 | 内容 |
|------|------|
| **问题描述** | 部分手机号、身份证未完全脱敏 |
| **问题位置** | `QualificationReviewH5.jsx` 等 |
| **严重级别** | P1 |
| **修复建议** | 统一脱敏规则 |

---

## P2 建议优化（建议改进）

### WEB-ISSUE-A-018: 代码复用不足

| 项目 | 内容 |
|------|------|
| **问题描述** | 多个页面有相似的搜索表单，可提取为组件 |
| **修复建议** | 创建 `SearchForm` 通用组件 |

---

### WEB-ISSUE-A-019: 常量未提取

| 项目 | 内容 |
|------|------|
| **问题描述** | 状态映射、标签类型等硬编码在组件中 |
| **修复建议** | 提取到 `src/constants/index.js` |

---

### WEB-ISSUE-A-020: 无 TypeScript 支持

| 项目 | 内容 |
|------|------|
| **问题描述** | 项目使用 JavaScript，无类型检查 |
| **修复建议** | 逐步迁移到 TypeScript |

---

### WEB-ISSUE-A-021: 性能优化不足

| 项目 | 内容 |
|------|------|
| **问题描述** | 大数据列表未使用虚拟滚动，图表未做防抖 |
| **修复建议** | 添加虚拟滚动和防抖处理 |

---

### WEB-ISSUE-A-022: 无国际化支持

| 项目 | 内容 |
|------|------|
| **问题描述** | 硬编码中文，未使用 i18n |
| **修复建议** | 添加 vue-i18n |

---

### WEB-ISSUE-A-023: 环境变量配置不完善

| 项目 | 内容 |
|------|------|
| **问题描述** | API 基础 URL 有默认值，建议完善 .env 配置 |
| **修复建议** | 创建 `.env.development` 和 `.env.production` |

---

### WEB-ISSUE-A-024: 代码格式化不一致

| 项目 | 内容 |
|------|------|
| **问题描述** | 部分文件缩进不一致 |
| **修复建议** | 配置 ESLint + Prettier |

---

### WEB-ISSUE-A-025: 无 Git 提交规范

| 项目 | 内容 |
|------|------|
| **问题描述** | 未见 commit message 规范 |
| **修复建议** | 采用 Conventional Commits |

---

### WEB-ISSUE-A-026: 未配置代码分割

| 项目 | 内容 |
|------|------|
| **问题描述** | 未见路由懒加载配置 |
| **修复建议** | 添加路由懒加载 |

```javascript
// router/index.js
const routes = [
  {
    path: '/users',
    name: 'UserList',
    component: () => import('@/views/user/UserList.vue')
  }
]
```

---

### WEB-ISSUE-A-027: 无监控埋点

| 项目 | 内容 |
|------|------|
| **问题描述** | 路由后置守卫有 console.log，未对接埋点系统 |
| **修复建议** | 添加用户行为追踪 |

---

### WEB-ISSUE-A-028: 可访问性不足

| 项目 | 内容 |
|------|------|
| **问题描述** | 未见 ARIA 属性 |
| **修复建议** | 添加无障碍支持 |

---

### WEB-ISSUE-A-029: 无构建优化

| 项目 | 内容 |
|------|------|
| **问题描述** | 未见 gzip、CDN 等优化配置 |
| **修复建议** | 配置 vite-plugin-compression |

---

## 问题统计

| 级别 | 数量 | 占比 |
|------|------|------|
| P0 | 5 | 20% |
| P1 | 8 | 32% |
| P2 | 12 | 48% |
| **总计** | **25** | **100%** |

---

## 修复优先级建议

### 第一阶段（立即修复）
- WEB-ISSUE-A-001: 技术栈不一致
- WEB-ISSUE-A-002: Token 验证逻辑缺失
- WEB-ISSUE-A-003: XSS 防护缺失
- WEB-ISSUE-A-004: CSRF 防护缺失
- WEB-ISSUE-A-005: 无自动化测试

### 第二阶段（1-2 周内）
- WEB-ISSUE-A-010 ~ WEB-ISSUE-A-017: 所有 P1 问题

### 第三阶段（1 个月内）
- WEB-ISSUE-A-018 ~ WEB-ISSUE-A-029: 所有 P2 问题

---

*问题清单生成时间：2026-04-12 15:30*
*审查人：Agent A*
