# Week 2 前端问题清单

**创建日期**: 2026-04-04  
**优先级说明**: P0-立即修复 | P1-本周完成 | P2-持续优化 | P3-技术债务

---

## 🔴 P0 - 立即修复（阻塞发布）

### Issue #001: 统计可视化页面违反 Stitch 设计规范
- **文件**: `miniprogram/pages/admin/stats/dashboard.wxss`
- **问题**: 使用硬编码色值而非 CSS 变量
- **影响**: 破坏整体禅意风格，主题切换失效
- **修复方案**: 
  ```css
  /* 修复前 */
  .dashboard-container { background-color: #1a1a2e; }
  .metric-value { color: #FFD700; }
  
  /* 修复后 */
  .dashboard-container { background-color: var(--bg-xuan); }
  .metric-value { color: var(--gold-main); }
  ```
- **负责人**: TBD
- **截止日期**: 2026-04-05

### Issue #002: ECharts 图表配置硬编码色值
- **文件**: `miniprogram/pages/admin/stats/dashboard.js`
- **问题**: ECharts option 中使用硬编码颜色
- **影响**: 图表颜色与主题不一致
- **修复方案**: 从 CSS 变量读取颜色值
  ```javascript
  // 获取 CSS 变量
  const cssVar = (name) => {
    const styles = getComputedStyle(document.documentElement)
    return styles.getPropertyValue(name).trim()
  }
  
  // 在 ECharts 配置中使用
  const option = {
    series: [{
      itemStyle: { color: cssVar('--gold-main') }
    }]
  }
  ```
- **负责人**: TBD
- **截止日期**: 2026-04-05

### Issue #003: 统计页面深色主题与整体风格冲突
- **文件**: `miniprogram/pages/admin/stats/dashboard.wxml`
- **问题**: 使用深色背景（#1a1a2e），与宣纸白（#EFEEE9）主题冲突
- **影响**: 用户体验不一致，品牌识别度降低
- **修复方案**: 改用浅色禅意主题
- **负责人**: TBD
- **截止日期**: 2026-04-05

---

## 🟠 P1 - 本周完成（重要）

### Issue #010: TODO 功能未实现
- **文件**: 多个
- **问题**: 代码中存在 TODO 注释，功能未完成
- **清单**:
  - [ ] `pages/admin/content/index.js`: loadStats(), refreshStats()
  - [ ] `miniprogram/pages/admin/message/subscribe.js`: loadTemplates()
  - [ ] `miniprogram/pages/admin/stats/dashboard.js`: 真实数据接入
- **负责人**: TBD
- **截止日期**: 2026-04-07

### Issue #011: 缺少加载状态提示
- **文件**: `pages/admin/content/index.js`
- **问题**: 数据加载时未显示 loading
- **修复方案**:
  ```javascript
  async loadStats() {
    wx.showLoading({ title: '加载中...' })
    try {
      // ... 加载逻辑
    } finally {
      wx.hideLoading()
    }
  }
  ```
- **负责人**: TBD
- **截止日期**: 2026-04-06

### Issue #012: 错误处理不完整
- **文件**: 多个
- **问题**: catch 块仅打印日志，未给用户友好提示
- **修复方案**:
  ```javascript
  catch (error) {
    console.error('加载失败:', error)
    wx.showToast({
      title: '加载失败，请稍后重试',
      icon: 'none',
      duration: 2000
    })
  }
  ```
- **负责人**: TBD
- **截止日期**: 2026-04-06

### Issue #013: 图片上传未压缩
- **文件**: `miniprogram/pages/admin/feedback/submit.js`
- **问题**: 直接上传原图，影响性能和流量
- **修复方案**: 使用 `sizeType: ['compressed']` 并添加压缩逻辑
- **负责人**: TBD
- **截止日期**: 2026-04-07

---

## 🟡 P2 - 持续优化（建议）

### Issue #020: 未使用防抖优化
- **文件**: `miniprogram/pages/admin/message/subscribe.js`
- **问题**: 搜索/筛选功能未使用防抖
- **修复方案**: 使用 `utils/util.js` 中的 `debounce` 函数
- **负责人**: TBD
- **截止日期**: 2026-04-10

### Issue #021: 缺少权限校验
- **文件**: 管理端所有页面
- **问题**: 未检查管理员权限
- **修复方案**: 在 onLoad 中添加权限校验
  ```javascript
  onLoad() {
    const isAdmin = checkAdminPermission()
    if (!isAdmin) {
      wx.showModal({
        title: '权限不足',
        content: '需要管理员权限',
        showCancel: false,
        success: () => wx.navigateBack()
      })
    }
  }
  ```
- **负责人**: TBD
- **截止日期**: 2026-04-10

### Issue #022: 未使用数据缓存
- **文件**: 统计页面、反馈列表
- **问题**: 每次打开都重新请求数据
- **修复方案**: 使用缓存工具类（见 `cache-optimized.js`）
- **负责人**: TBD
- **截止日期**: 2026-04-10

### Issue #023: 富文本内容未转义
- **文件**: `pages/admin/content/notice.js`
- **问题**: 可能存在 XSS 风险
- **修复方案**: 使用 `wx.parseHtml` 或自定义转义函数
- **负责人**: TBD
- **截止日期**: 2026-04-10

---

## 🔵 P3 - 技术债务（长期）

### Issue #030: 代码复用度低
- **问题**: 多个页面有重复的表单处理逻辑
- **建议**: 抽取通用表单组件
- **负责人**: TBD
- **截止日期**: Phase 2

### Issue #031: 缺少单元测试
- **问题**: 无自动化测试覆盖
- **建议**: 使用 miniprogram-simulate 编写测试
- **负责人**: TBD
- **截止日期**: Phase 2

### Issue #032: 缺少性能监控
- **问题**: 无法追踪页面加载性能
- **建议**: 集成性能监控 SDK
- **负责人**: TBD
- **截止日期**: Phase 2

---

## 📋 问题统计

| 优先级 | 数量 | 状态 |
|--------|------|------|
| P0 | 3 | 🔴 待修复 |
| P1 | 4 | 🟠 待完成 |
| P2 | 4 | 🟡 建议 |
| P3 | 3 | 🔵 长期 |
| **总计** | **14** | - |

---

## 🎯 修复计划

### 第 1 天（04-05）
- [ ] 修复 Issue #001, #002, #003（P0 统计页面问题）

### 第 2 天（04-06）
- [ ] 修复 Issue #011, #012（加载状态和错误处理）

### 第 3 天（04-07）
- [ ] 修复 Issue #010（TODO 功能实现）
- [ ] 修复 Issue #013（图片压缩）

### 第 4-5 天（04-08 ~ 04-09）
- [ ] 修复 Issue #020 ~ #023（P2 优化项）

---

**清单创建人**: AI Agent  
**最后更新**: 2026-04-04 17:30
