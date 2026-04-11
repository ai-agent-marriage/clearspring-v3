# 清如 V3 Bug 清单

**生成日期:** 2026-04-11  
**测试执行人:** 测试-Agent  
**Bug 总数:** 239 个测试失败点  
**分类统计:** P0: 2 个 | P1: 85 个 | P2: 152 个

---

## 🔴 P0: 阻断性 Bug（立即修复）

**定义:** 导致核心功能完全不可用、页面无法加载、数据丢失的严重问题

### P0-001: 帮助中心页面文件缺失

- **严重程度:** 🔴 P0
- **影响范围:** 帮助中心所有功能
- **失败测试:** `__tests__/help.test.js` (20 个测试全部失败)
- **错误信息:**
  ```
  Cannot find module '../pages/help/index.js'
  ```
- **复现步骤:**
  1. 运行测试 `npm test -- help.test.js`
  2. 所有测试因模块找不到而失败
- **预期结果:** 页面文件存在，测试正常执行
- **实际结果:** 页面文件缺失，测试无法执行
- **影响:** 用户无法访问帮助中心，FAQ、联系客服等功能不可用
- **建议修复:** 创建 `pages/help/index.js` 文件，或修正测试中的路径引用
- **负责人:** 前端开发-Agent
- **状态:** 🆕 待修复

### P0-002: 关于我们页面文件缺失

- **严重程度:** 🔴 P0
- **影响范围:** 关于我们所有功能
- **失败测试:** `__tests__/about.test.js` (20 个测试全部失败)
- **错误信息:**
  ```
  Cannot find module '../pages/about/index.js'
  ```
- **复现步骤:**
  1. 运行测试 `npm test -- about.test.js`
  2. 所有测试因模块找不到而失败
- **预期结果:** 页面文件存在，测试正常执行
- **实际结果:** 页面文件缺失，测试无法执行
- **影响:** 用户无法查看公司信息、联系方式、合作协议等
- **建议修复:** 创建 `pages/about/index.js` 文件，或修正测试中的路径引用
- **负责人:** 前端开发-Agent
- **状态:** 🆕 待修复

---

## 🟠 P1: 重要 Bug（24 小时内修复）

**定义:** 影响重要功能使用、导致用户体验严重下降的问题

### 公告管理增强功能缺失 (P1-001 ~ P1-033)

**影响文件:** `pages/admin/content/notice.js`  
**失败测试:** `__tests__/content-notice-enhanced.test.js` (33 个测试失败)

#### P1-001: 公告验证方法缺失
- **缺失方法:** `validateNotice()`
- **影响:** 无法验证公告标题、内容、有效期等
- **测试:** 公告标题不能为空、标题长度限制、内容不能为空等 7 个测试

#### P1-002: 草稿保存功能缺失
- **缺失方法:** `saveDraft()`
- **影响:** 无法保存公告草稿
- **测试:** 草稿保存功能

#### P1-003: 定时发布功能缺失
- **缺失方法:** `setScheduledPublish()`
- **影响:** 无法设置定时发布
- **测试:** 定时发布功能设置

#### P1-004: 立即发布功能缺失
- **缺失方法:** `publishNow()`
- **影响:** 无法立即发布公告
- **测试:** 立即发布功能

#### P1-005: 预览功能缺失
- **缺失方法:** `previewNotice()`
- **影响:** 无法预览公告内容
- **测试:** 发布前预览功能

#### P1-006: 撤回功能缺失
- **缺失方法:** `recallNotice()`
- **影响:** 无法撤回已发布公告
- **测试:** 撤回已发布公告

#### P1-007: 版本历史功能缺失
- **缺失方法:** `showVersionHistory()`
- **影响:** 无法查看公告版本历史
- **测试:** 公告版本历史

#### P1-008: 优先级管理功能缺失
- **缺失方法:** `getPriorityLabel()`, `sortByPriority()`, `getUrgentNotices()`
- **影响:** 无法管理公告优先级
- **测试:** 紧急/普通/低优先级标识、按优先级排序、紧急公告置顶 (5 个测试)

#### P1-009: 统计功能缺失
- **缺失方法:** `formatViewCount()`, `loadViewTrend()`, `loadSourceAnalysis()`
- **影响:** 无法查看公告浏览量统计
- **测试:** 浏览量统计、阅读量趋势、阅读来源分析 (5 个测试)

#### P1-010: 推送通知功能缺失
- **缺失方法:** `selectPushChannels()`, `previewPush()`, `showPushHistory()`, `calculatePushRate()`, `createScheduledPush()`
- **影响:** 无法管理公告推送
- **测试:** 推送渠道、预览、历史、成功率、定时推送 (5 个测试)

#### P1-011: 模板功能缺失
- **缺失方法:** `loadTemplates()`, `applyTemplate()`, `saveAsTemplate()`, `replaceTemplateVariables()`, `filterTemplatesByCategory()`
- **影响:** 无法使用公告模板
- **测试:** 加载模板、应用模板、保存模板、变量替换、分类筛选 (5 个测试)

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 帮助文档增强功能缺失 (P1-034 ~ P1-062)

**影响文件:** `pages/admin/content/help.js`  
**失败测试:** `__tests__/content-help-enhanced.test.js` (29 个测试失败)

#### P1-034: 富文本编辑器功能缺失
- **缺失方法:** `initEditor()`, `insertText()`, `insertImage()`, `insertLink()`
- **影响:** 无法使用富文本编辑
- **测试:** 编辑器初始化、文本/图片/链接插入 (4 个测试)

#### P1-035: 自动保存功能缺失
- **缺失方法:** `autoSave()`, `restoreDraft()`
- **影响:** 无法自动保存和恢复草稿
- **测试:** 自动保存、草稿恢复 (2 个测试)

#### P1-036: 目录管理功能缺失
- **缺失方法:** `generateTOC()`, `scrollToSection()`, `addTOCItem()`
- **影响:** 无法生成和跳转目录
- **测试:** 自动生成目录、目录跳转、手动添加目录项 (3 个测试)

#### P1-037: 版本控制功能缺失
- **缺失方法:** `createNewVersion()`, `compareVersions()`, `rollbackToVersion()`, `addVersionComment()`, `showVersionHistory()`
- **影响:** 无法管理文档版本
- **测试:** 创建版本、版本对比、版本回滚、版本注释、版本历史 (5 个测试)

#### P1-038: 协作功能缺失
- **缺失方法:** `setSharePermission()`, `addCollaborator()`, `removeCollaborator()`, `updateCollaboratorRole()`, `lockDocument()`, `unlockDocument()`
- **影响:** 无法进行文档协作
- **测试:** 共享设置、添加/移除协作者、权限变更、文档锁定/解锁 (6 个测试)

#### P1-039: 搜索优化功能缺失
- **缺失方法:** `fullTextSearch()`, `highlightKeyword()`, `getSearchSuggestions()`, `loadHotSearches()`, `addToSearchHistory()`
- **影响:** 无法使用高级搜索功能
- **测试:** 全文搜索、高亮、搜索建议、热门搜索、搜索历史 (5 个测试)

#### P1-040: 统计分析功能缺失
- **缺失方法:** `getDocumentStats()`, `likeDocument()`, `favoriteDocument()`, `shareDocument()`, `recordStayDuration()`
- **影响:** 无法查看文档统计
- **测试:** 文档统计、点赞、收藏、分享、停留时长 (5 个测试)

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 物种管理增强功能缺失 (P1-063 ~ P1-085)

**影响文件:** `pages/admin/content/species.js`  
**失败测试:** `__tests__/content-species-enhanced.test.js` (23 个测试失败)

#### P1-063: 数据验证功能缺失
- **缺失方法:** `validateSpecies()`
- **影响:** 无法验证物种数据
- **测试:** 学名格式、类型选择、描述长度、有效数据验证 (4 个测试)

#### P1-064: 搜索筛选功能缺失
- **缺失方法:** `resetFilter()`, `highlightSearch()`
- **影响:** 无法重置筛选和高亮搜索
- **测试:** 筛选条件重置、搜索结果高亮 (2 个测试)

#### P1-065: 批量操作功能缺失
- **缺失方法:** `selectAll()`, `deselectAll()`, `toggleSelect()`, `batchUpdateStatus()`, `exportSelected()`
- **影响:** 无法进行批量操作
- **测试:** 全选、取消全选、单个选择、批量修改状态、批量导出 (5 个测试)

#### P1-066: 导入功能缺失
- **缺失方法:** `showImportModal()`, `validateImportFile()`, `validateImportFileSize()`, `previewImport()`, `updateImportProgress()`, `onImportComplete()`
- **影响:** 无法导入物种数据
- **测试:** 导入弹窗、格式验证、大小验证、预览、进度、完成回调 (6 个测试)

#### P1-067: 权限控制功能缺失
- **缺失方法:** `checkPermissions()`, `logAction()`, `showRecentLogs()`
- **影响:** 无法管理操作权限
- **测试:** 管理员/普通用户权限、删除确认、操作日志、最近操作 (4 个测试)

#### P1-068: 性能优化功能缺失
- **缺失方法:** `preloadNextPage()`, `lazyLoadImage()`, `debounceSearch()`
- **影响:** 列表性能未优化
- **测试:** 分页预加载、图片懒加载、防抖搜索 (3 个测试)

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

---

## 🟡 P2: 次要 Bug（规划修复）

**定义:** 影响轻微、有替代方案、或测试代码自身问题的 bug

### 工具函数 Bug (P2-001 ~ P2-010)

**影响文件:** `utils/util.js`  
**失败测试:** `__tests__/utils-util.test.js` (10 个测试失败)

#### P2-001: 佛历日期年份计算错误
- **问题:** 期望 "佛历 2570 年"，实际 "佛历 2569 年"
- **原因:** 年份计算逻辑错误（应该是 公历 +543）
- **修复建议:** 检查 `getBuddhistDate()` 函数的年份计算

#### P2-002: 佛历日期格式缺少空格
- **问题:** 期望 "佛历 2543 年"，实际 "佛历 2543 年"
- **修复建议:** 在年份和"年"之间添加空格

#### P2-003: 相对时间格式缺少空格
- **问题:** 期望 "5 分钟前"，实际 "5 分钟前"
- **影响:** 所有相对时间格式（分钟、小时、天、周）
- **修复建议:** 在 `formatRelativeTime()` 函数中添加空格

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 音频播放器 Bug (P2-011 ~ P2-034)

**影响文件:** `utils/audio.js`  
**失败测试:** `__tests__/utils-audio.test.js` (24 个测试失败)

#### P2-011: 音频上下文未创建
- **问题:** `wx.createInnerAudioContext` 未被调用
- **影响:** 播放器无法初始化

#### P2-012: 事件监听器未注册
- **问题:** onCanplay, onPlay, onPause, onStop, onEnded, onError 未注册
- **影响:** 无法监听播放状态

#### P2-013: 播放控制方法未实现
- **问题:** play, pause, resume, stop, seek 方法未正确实现
- **影响:** 无法控制音频播放

#### P2-014: 音量调节未生效
- **问题:** setVolume 方法未设置音量
- **影响:** 音量始终为默认值 0.8

#### P2-015: 进度监听返回错误值
- **问题:** getCurrentTime, getDuration 返回 0
- **影响:** 无法获取播放进度

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 性能优化工具 Bug (P2-035 ~ P2-050)

**影响文件:** `utils/performance.js`  
**失败测试:** `__tests__/utils-performance.test.js` (5 个测试失败)

#### P2-035: 缓存管理器 clear 方法异常
- **问题:** 清空缓存时误删了不该删的键
- **测试:** 清空本地存储中带前缀的缓存

#### P2-036: 节流更新数据异常
- **问题:** 节流后数据未被正确清除
- **测试:** 节流更新数据

#### P2-037: 图片懒加载 observer 方法缺失
- **问题:** `observer.unobserve` 不是函数
- **测试:** 图片进入视口时触发回调

#### P2-038: 性能监控计数错误
- **问题:** 记录多次计时，count 只增加 1
- **测试:** 记录多次计时

#### P2-039: 虚拟列表初始化失败
- **问题:** 无法读取 undefined 的 itemHeight
- **测试:** 使用默认配置初始化虚拟列表

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 页面功能 Bug (P2-051 ~ P2-070)

#### P2-051: 公告编辑弹窗未显示
- **文件:** `pages/admin/content/notice.js`
- **问题:** `editNotice()` 方法未设置 `showEditModal`
- **测试:** `content-notice.test.js`

#### P2-052: 公告删除确认未显示
- **文件:** `pages/admin/content/notice.js`
- **问题:** `deleteNotice()` 方法未设置 `showDeleteConfirm`
- **测试:** `content-notice.test.js`

#### P2-053: 公告发布状态未更新
- **文件:** `pages/admin/content/notice.js`
- **问题:** `publishNotice()` 方法未更新 status 为 1
- **测试:** `content-notice.test.js`

#### P2-054: 禁止投放物种警示未显示
- **文件:** `pages/species/index.js`
- **问题:** `showForbidWarning` 未设置为 true
- **测试:** `species.test.js`

#### P2-055: 可投放物种保护按钮未显示
- **文件:** `pages/species/index.js`
- **问题:** `showProtectButton` 未设置为 true
- **测试:** `species.test.js`

#### P2-056: 关于弹窗格式不符
- **文件:** `pages/profile.js`
- **问题:** showModal 的 content 包含额外换行和文本
- **测试:** `settings.test.js`

#### P2-057: 联系方式格式不符
- **文件:** `pages/profile.js`
- **问题:** showModal 的 content 包含额外换行和服务时间
- **测试:** `settings.test.js`

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 集成测试 Bug (P2-071 ~ P2-076)

**影响文件:** `cloudfunctions` 相关  
**失败测试:** `__tests__/integration-stats.test.js` (6 个测试失败)

#### P2-071: 统计接口返回数据结构异常
- **问题:** `res.data.code` 为 undefined
- **影响:** 仪表盘、趋势、分布、排行榜所有接口
- **可能原因:** 云函数返回格式错误或测试 mock 不正确

**负责人:** 后端开发-Agent  
**状态:** 🆕 待修复

### P0/P1 修复验证 Bug (P2-077 ~ P2-079)

**影响文件:** `pages/index/index.js` 等  
**失败测试:** `__tests__/p0-p1-fixes-verification.test.js` (3 个测试失败)

#### P2-077: 首页数据加载异常处理未实现
- **问题:** `showErrorPage` 未设置为 true
- **测试:** P0-001: 首页数据加载异常处理

#### P2-078: 登录状态持久化未实现
- **问题:** `isLoggedIn` 未设置为 true
- **测试:** P0-002: 登录状态持久化

#### P2-079: 列表分页功能未实现
- **问题:** `loadMore()` 未调用 `wx.request`
- **测试:** P1-001: 列表分页功能正常

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 其他工具 Bug (P2-080 ~ P2-100)

#### P2-080: 图片上传未调用 request
- **文件:** `utils/api.js`
- **测试:** `api-utils.test.js`

#### P2-081: ECharts themeColors 未定义
- **文件:** `utils/echarts.js`
- **测试:** `echarts-optimized.test.js`

#### P2-082: CSV 导出 BOM 未添加
- **文件:** `utils/export.js`
- **测试:** `export-utils.test.js`

#### P2-083: CSV 字段逗号处理异常
- **文件:** `utils/export.js`
- **测试:** `export-utils.test.js`

#### P2-084: 分享文件功能缺失
- **文件:** `utils/export.js`
- **问题:** `wx.showShareMenu` 不是函数
- **测试:** `export-utils.test.js`

#### P2-085: 消息推送页面创建器异常
- **文件:** `pages/admin/message/*.js`
- **问题:** Page 不是函数
- **测试:** `message-push.test.js` (27 个测试失败)

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

### 性能回归测试 Bug (P2-101 ~ P2-152)

**影响文件:** 多个页面和工具函数  
**失败测试:** `performance-regression*.test.js` (约 50 个测试失败)

主要问题包括:
- 数据请求合并功能未实现
- setData 调用次数优化未实现
- 图片预加载/压缩功能缺失
- 缓存过期清理逻辑错误
- 请求队列管理异常
- 请求重试机制缺失
- 内存泄漏检测功能缺失
- 事件监听器/定时器清理功能缺失

**负责人:** 前端开发-Agent  
**状态:** 🆕 待修复

---

## 📊 Bug 分布统计

### 按模块分布

| 模块 | P0 | P1 | P2 | 总计 |
|------|----|----|----|------|
| 页面文件 | 2 | 0 | 0 | 2 |
| 公告管理 | 0 | 33 | 3 | 36 |
| 帮助文档 | 0 | 29 | 0 | 29 |
| 物种管理 | 0 | 23 | 0 | 23 |
| 工具函数 | 0 | 0 | 24 | 24 |
| 音频播放 | 0 | 0 | 24 | 24 |
| 性能优化 | 0 | 0 | 50 | 50 |
| 页面功能 | 0 | 0 | 20 | 20 |
| 集成测试 | 0 | 0 | 10 | 10 |
| 其他 | 0 | 0 | 21 | 21 |
| **总计** | **2** | **85** | **152** | **239** |

### 按优先级分布

```
P0 (阻断性): ██ 2 个 (0.8%)
P1 (重要):   ████████████████████████████████████████ 85 个 (35.6%)
P2 (次要):   ████████████████████████████████████████████████████████████████████████████████ 152 个 (63.6%)
```

---

## 🔧 修复建议

### 第一阶段 (立即修复 - 1 天内)
1. 创建缺失的页面文件 `pages/help/index.js` 和 `pages/about/index.js`
2. 修复 `utils/util.js` 中的佛历日期和相对时间格式问题

### 第二阶段 (优先修复 - 3 天内)
1. 实现公告管理增强功能的核心方法
2. 实现帮助文档增强功能的富文本编辑器和版本控制
3. 实现物种管理增强功能的批量操作和导入导出

### 第三阶段 (规划修复 - 1 周内)
1. 完善音频播放器功能
2. 优化性能相关工具函数
3. 修复其他页面功能和集成测试问题

---

## 📈 修复进度跟踪

| 日期 | P0 修复 | P1 修复 | P2 修复 | 备注 |
|------|--------|--------|--------|------|
| 2026-04-11 | 0/2 | 0/85 | 0/152 | 初始状态 |

---

**清单生成时间:** 2026-04-11 22:47  
**下次更新:** 修复完成后重新运行测试
