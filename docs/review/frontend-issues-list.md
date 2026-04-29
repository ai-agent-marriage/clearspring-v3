# 前端问题清单

**创建日期**: 2026-04-04  
**优先级说明**: P0-紧急 | P1-高 | P2-中 | P3-低

---

## 🔴 P0 紧急问题

### 1. 硬编码色值破坏设计一致性
- **位置**: `pages/org-home/*.wxss`, `pages/executor-status/*.wxss`, `pages/protect/*.wxss`
- **问题**: 28 处硬编码色值，未使用 CSS 变量
- **影响**: 设计系统无法统一维护，主题切换困难
- **修复**:
  ```css
  /* 在 app.wxss 中添加 */
  --card-bg: #ffffff;
  --card-bg-alt: #fafafa;
  --border-light: #e8e8e8;
  --border-lighter: #f5f5f5;
  
  /* 替换 */
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  /* 为 */
  background: linear-gradient(180deg, var(--card-bg) 0%, var(--card-bg-alt) 100%);
  ```
- **预估工时**: 1 小时

### 2. Zen 页面引用但目录不存在
- **位置**: `app.json` pages 数组
- **问题**: 引用了 `pages/zen/home1`, `pages/zen/home2` 等 5 个页面，但目录不存在
- **影响**: 小程序编译报错
- **修复**: 删除 app.json 中的 zen 相关页面引用或创建对应目录
- **预估工时**: 0.5 小时

---

## 🟠 P1 高优先级问题

### 3. 图片懒加载未实现
- **位置**: 所有包含 `<image>` 的 wxml 文件
- **问题**: 图片一次性加载，浪费流量和内存
- **影响**: 首屏加载慢，用户体验差
- **修复**:
  ```javascript
  // 使用微信小程序懒加载
  <image src="{{imgUrl}}" lazy-load="true" />
  
  // 或使用 IntersectionObserver 实现自定义懒加载
  ```
- **涉及文件**: 约 20 个 wxml 文件
- **预估工时**: 2 小时

### 4. setData 调用未优化
- **位置**: 113 处 setData 调用
- **问题**: 多次独立 setData 调用，未合并
- **影响**: 频繁触发渲染，性能损耗
- **修复**:
  ```javascript
  // 合并多次 setData 为一次
  this.setData({
    loading: false,
    list: newList,
    total: data.total,
    hasMore: data.hasMore
  })
  ```
- **重点文件**: 
  - `pages/executor-evidence/executor-evidence.js` (331 行)
  - `pages/org-home/settlement.js` (251 行)
  - `pages/org-home/volunteers.js` (243 行)
- **预估工时**: 2 小时

### 5. 缺少分包加载配置
- **位置**: `app.json`
- **问题**: 所有页面在主包，体积可能超限
- **影响**: 首屏加载慢，主包体积限制 2MB
- **修复**: 配置 subPackages（见 Task 2）
- **预估工时**: 1 小时

### 6. Console.log 未清理
- **位置**: 74 处 console.log/console.error
- **问题**: 生产环境泄露调试信息
- **影响**: 性能损耗，信息泄露风险
- **修复**: 
  - 方案 A: 全部删除
  - 方案 B: 封装日志工具，生产环境禁用
  ```javascript
  // utils/logger.js
  const isDev = process.env.NODE_ENV === 'development'
  export const log = isDev ? console.log : () => {}
  ```
- **预估工时**: 1 小时

---

## 🟡 P2 中优先级问题

### 7. TODO 注释堆积
- **位置**: 20+ 处 TODO 注释
- **问题**: 功能未完成标记未清理
- **影响**: 代码可读性差，难以判断完成度
- **修复**: 
  - 已完成的 TODO → 删除注释
  - 未完成的 TODO → 转为任务清单
- **预估工时**: 0.5 小时

### 8. 代码复用率低
- **位置**: 订单相关页面、状态管理页面
- **问题**: 重复代码模式
- **影响**: 维护成本高，易出错
- **修复**:
  - 提取 `utils/order.js` - 订单公共逻辑
  - 提取 `utils/status.js` - 状态管理逻辑
- **预估工时**: 2 小时

### 9. 缺少公共组件
- **位置**: 整个项目
- **问题**: 每个页面重复编写卡片、按钮、加载态
- **影响**: 代码冗余，样式不一致
- **建议创建**:
  - `components/card/card` - 通用卡片
  - `components/button/button` - 统一按钮
  - `components/loading/loading` - 加载状态
  - `components/empty/empty` - 空状态
- **预估工时**: 4 小时

### 10. 敏感数据未加密存储
- **位置**: 多处 `wx.setStorageSync`
- **问题**: Token、用户信息明文存储
- **影响**: 安全风险
- **修复**: 使用 `wx.setStorageSync` + 简单加密或改用 `wx.cloud.callFunction` 存储
- **预估工时**: 1 小时

### 11. 云函数返回未校验
- **位置**: `utils/cloud.js`
- **问题**: 未校验云函数返回数据结构
- **影响**: 异常数据导致页面崩溃
- **修复**: 增加数据校验逻辑
  ```javascript
  if (!result || !result.data) {
    throw new Error('云函数返回格式异常')
  }
  ```
- **预估工时**: 0.5 小时

---

## 🟢 P3 低优先级问题

### 12. TabBar 图标未优化
- **位置**: `images/` 目录
- **问题**: 使用 PNG 图标，未使用雪碧图或 SVG
- **影响**: 增加包体积
- **修复**: 使用雪碧图或切换到 SVG
- **预估工时**: 1 小时

### 13. 缺少错误边界
- **位置**: 所有页面
- **问题**: 未捕获全局错误
- **影响**: 异常时白屏
- **修复**: 在 `app.js` 中添加 `onError` 处理
- **预估工时**: 0.5 小时

### 14. 缺少页面埋点
- **位置**: 所有页面
- **问题**: 未记录用户行为
- **影响**: 无法分析用户行为
- **修复**: 集成微信小程序分析或自定义埋点
- **预估工时**: 2 小时

---

## 📋 问题统计

| 优先级 | 数量 | 预估工时 |
|--------|------|----------|
| P0 | 2 | 1.5 小时 |
| P1 | 4 | 6 小时 |
| P2 | 5 | 8 小时 |
| P3 | 3 | 3.5 小时 |
| **总计** | **14** | **19 小时** |

---

## ✅ 修复计划

### Week 1 完成（本次任务）
- [x] 代码审查报告
- [x] 问题清单创建
- [ ] 硬编码色值修复（P0）
- [ ] 分包配置（P1）
- [ ] 缓存工具类优化（P1）

### Week 2 完成
- [ ] 图片懒加载（P1）
- [ ] setData 优化（P1）
- [ ] Console.log 清理（P1）
- [ ] 公共组件创建（P2）
- [ ] 代码复用优化（P2）

### 后续迭代
- [ ] 敏感数据加密（P2）
- [ ] 错误边界（P3）
- [ ] 页面埋点（P3）
- [ ] TabBar 图标优化（P3）

---

**负责人**: 前端开发团队  
**最后更新**: 2026-04-04
