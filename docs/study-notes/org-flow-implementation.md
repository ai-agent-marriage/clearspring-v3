# 机构端页面实现学习笔记

**创建时间**: 2026-04-07  
**作者**: AI Agent  
**任务**: Phase 1 Week 1 Day 6 - 机构端 4 个核心页面开发

---

## 📋 任务概述

完成机构端（Organization）的 4 个核心页面开发：
1. 机构端首页（org-home/index）
2. 机构订单管理页（org-home/orders）
3. 机构志愿者管理页（org-home/volunteers）
4. 机构结算管理页（org-home/settlement）

---

## 🎨 设计规范

### 色彩系统
- **主色**: `#D4B87B` (禅意金) - 用于机构端导航栏和主按钮
- **辅助色**: `#6E5E00` (暖沙金暗) - 用于强调和次主色
- **成功色**: `#008A17` (岱绿系)
- **警示色**: `#FF9A44` (低饱和橙)
- **错误色**: `#BA1A1A` (柔化红)

### 圆角系统
- **小圆角**: `12rpx` - 小组件
- **中圆角**: `24rpx` - 标准卡片
- **大圆角**: `32rpx` - 大卡片和区域

### 布局特点
- 采用渐变背景区分层级
- 卡片式设计，无框线
- 液态玻璃效果用于浮层
- 按钮热区最小 `88rpx`

---

## 📁 页面结构

### 1. 机构端首页 (index)

**文件结构**:
```
pages/org-home/
├── index.js      # 页面逻辑
├── index.json    # 页面配置
├── index.wxml    # 页面结构
└── index.wxss    # 页面样式
```

**核心模块**:
1. **顶部导航栏**: 主色背景，白色标题「机构工作台」
2. **机构信息区**: 白色卡片展示机构名称、身份标识、审核状态
3. **数据看板**: 横向滚动卡片，展示 4 项核心数据
4. **待办事项**: 列表展示，带红色角标标记未处理数量
5. **功能入口**: 2×2 网格布局，4 个核心功能
6. **底部按钮**: 固定定位，切换视角

**关键技术点**:
- 使用 `scroll-view` 实现横向滚动数据看板
- 待办事项角标使用条件渲染 `wx:if="{{item.count > 0}}"`
- 底部按钮使用 `position: fixed` 固定定位

---

### 2. 机构订单管理页 (orders)

**核心模块**:
1. **状态 Tab 栏**: 7 个状态横向滚动 Tab
2. **筛选栏**: 可展开，支持日期、水域、志愿者筛选
3. **订单列表**: 卡片式展示，带状态标签和操作按钮
4. **空状态**: 无订单时展示极简插画

**订单状态映射**:
```javascript
{
  1: '待承接',  // pending-accept
  2: '待执行',  // pending-execute
  3: '执行中',  // processing
  4: '待确认',  // pending-confirm
  5: '已完成',  // completed
  6: '已取消'   // cancelled
}
```

**操作按钮逻辑**:
- 待承接 → 承接订单
- 待执行 → 分配任务
- 执行中 → 审核材料
- 其他状态 → 查看详情

---

### 3. 机构志愿者管理页 (volunteers)

**核心模块**:
1. **邀请码生成**: 弹窗展示邀请码，支持复制和分享
2. **数据卡片**: 3 个等宽卡片展示统计数据
3. **筛选栏**: 按区域、合规执行率筛选
4. **志愿者列表**: 卡片展示，含操作按钮

**邀请码弹窗实现**:
```xml
<view class="modal-mask" wx:if="{{showInviteModal}}">
  <view class="modal-content">
    <!-- 弹窗内容 -->
  </view>
</view>
```

**志愿者操作**:
- 详情 → 跳转到详情页
- 分配 → 分配任务
- 解绑 → 二次确认后解绑
- 拉黑 → 二次确认后拉黑（仅未认证志愿者无此选项）

---

### 4. 机构结算管理页 (settlement)

**核心模块**:
1. **数据卡片**: 累计结算、待结算、已结算订单数
2. **Tab 栏**: 3 个 Tab 切换
3. **待结算订单**: 列表展示，支持批量结算
4. **结算记录**: 历史结算单，支持导出
5. **发票管理**: 发票信息填写、上传、审核状态

**发票表单实现**:
- 使用弹窗表单收集发票信息
- 字段验证（必填项标记 *）
- 保存后状态变为「审核中」

---

## 🔧 技术实现要点

### 1. 页面配置 (app.json)
```json
{
  "navigationBarBackgroundColor": "#D4B87B",
  "navigationBarTextStyle": "white",
  "enablePullDownRefresh": true,
  "backgroundTextStyle": "dark"
}
```

### 2. 数据 Mock 结构
所有页面采用统一的 Mock 数据结构，便于后续替换为真实 API：
```javascript
data: {
  // 页面数据
},

async loadXxxData() {
  // TODO: 实际从云函数获取数据
  console.log('加载数据');
},

async refreshData() {
  await new Promise(resolve => setTimeout(resolve, 500));
  console.log('数据刷新完成');
}
```

### 3. 事件处理规范
```javascript
// Tab 切换
onTabChange(e) {
  const { index } = e.currentTarget.dataset;
  this.setData({ activeTab: index });
}

// 列表项操作
onItemAction(e) {
  const { action, item } = e.currentTarget.dataset;
  switch (action) {
    case 'detail': this.viewDetail(item); break;
    case 'edit': this.editItem(item); break;
  }
}
```

### 4. 样式复用
- 使用全局 CSS 变量 (`var(--gold-main)`, `var(--radius-lg)` 等)
- 卡片样式统一使用渐变背景
- 按钮四态（正常、active、loading、disabled）

---

## 🧪 单元测试

测试文件：`tests/org-home-pages.test.js`

**测试覆盖**:
- Task 7.1: 3 个测试（数据初始化、待办事项、功能入口）
- Task 7.2: 3 个测试（Tab 配置、订单数据、状态映射）
- Task 7.3: 3 个测试（数据统计、志愿者数据、邀请码）
- Task 7.4: 4 个测试（Tab 配置、统计数据、待结算订单、结算记录）

**总计**: 13 个测试用例，全部通过 ✅

---

## 📝 经验总结

### 做得好的地方
1. **代码结构清晰**: 每个页面 4 个文件职责明确
2. **样式统一**: 遵循全局设计规范，使用 CSS 变量
3. **数据 Mock 完善**: 便于后续 API 对接
4. **测试覆盖充分**: 13 个测试用例覆盖核心数据结构

### 待改进的地方
1. **云函数对接**: 目前是 Mock 数据，需要后续对接真实 API
2. **错误处理**: 需要完善网络错误的用户提示
3. **加载状态**: 需要添加 loading 状态展示
4. **分页加载**: 订单和志愿者列表需要支持分页

### 后续工作
1. 对接云函数 API，替换 Mock 数据
2. 添加下拉刷新和上拉加载更多
3. 完善表单验证和错误提示
4. 添加分享功能（邀请志愿者、结算单分享）

---

## 🔗 相关文件

- 页面代码：`pages/org-home/`
- 测试文件：`tests/org-home-pages.test.js`
- 全局样式：`app.wxss`
- 页面配置：`app.json`

---

**下一步**: 创建进度报告并提交 Git
