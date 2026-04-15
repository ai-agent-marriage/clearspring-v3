# Stitch V3.0 设计规范检查报告

**检查时间**: 2026-04-15 11:32 GMT+8  
**检查范围**: `/root/.openclaw/workspace/pages/`  
**文件总数**: 99 个 WXSS 文件 + 99 个 WXML 文件 = 198 个文件

---

## 📊 总体统计

| 检查项 | 问题数量 | 涉及文件数 | 规范符合度 |
|--------|----------|------------|------------|
| 色彩系统 | 530 处 | 43 个文件 | 56.6% |
| 无边界设计 (1px 边框) | 157 处 | 51 个文件 | 48.5% |
| 组件圆角 | 199 处 | 50 个文件 | 49.5% |
| Emoji 使用 | 33 处 | 19 个文件 | 80.8% |
| **综合符合度** | - | - | **58.9%** |

---

## 🔴 P0 级别问题（必须修复）

### 1. 色彩系统 - 硬编码色值

**规范要求**: 
- 祈福者端底色：`#EFEEE9` (应使用 `var(--stitch-bg-primary)`)
- 执行者端主色：`#4A5D4E` / `#334537` (应使用 `var(--stitch-green-primary/dim)`)
- 辅助金色：`#C9B037` (应使用 `var(--stitch-gold-primary)`)
- **禁止硬编码色值**，应使用 CSS 变量

**问题统计**: 530 处硬编码色值，涉及 43 个文件

**主要问题文件**:

| 文件路径 | 问题数量 | 主要违规色值 |
|----------|----------|--------------|
| `pages/q-13-service/q-13-service.wxss` | 45+ | `#FFFFFF`, `#F5F4EF`, `#1B1C19`, `#737872`, `#BA1A1A` |
| `pages/admin-appeal/appeal.wxss` | 40+ | `#FFFFFF`, `#F5F4EF`, `#FEE264`, `#D3E8D5`, `#E9E8E3` |
| `pages/q-16-order-detail/q-16-order-detail.wxss` | 35+ | `#FAF9F4`, `#E3E2DE`, `#6E5E00`, `#07C160` |
| `pages/executor-camera/camera.wxss` | 30+ | `#000000`, `#FFFFFF`, `#1B1C19`, `#434843` |
| `pages/admin-export/export.wxss` | 25+ | `#FFFFFF`, `#F5F4EF`, `#1B1C19` |

**典型违规代码**:
```css
/* ❌ 违规 */
background-color: #FFFFFF;
color: #1B1C19;
border-left: 8rpx solid #6E5E00;

/* ✅ 应改为 */
background-color: var(--stitch-bg-white);
color: var(--stitch-text-primary);
border-left: 8rpx solid var(--stitch-gold-primary);
```

**其他常见硬编码色值**:
- `#FFFFFF` → 应使用 `var(--stitch-bg-white)`
- `#F5F4EF` → 应使用 `var(--stitch-bg-secondary)`
- `#1B1C19` → 应使用 `var(--stitch-text-primary)`
- `#737872` / `#434843` → 应使用 `var(--stitch-text-secondary)`
- `#D3E8D5` → 应使用 `var(--stitch-green-light)` 或自定义变量
- `#E3E2DE` → 应使用 `var(--stitch-border-primary)`

---

### 2. 无边界设计 - 1px 实线边框

**规范要求**: 
- ❌ 禁止 1px 实线边框
- ✅ 使用色调渐变分隔
- ✅ 使用呼吸感阴影：`0 12rpx 40rpx rgba(74,93,78,0.06)`

**问题统计**: 157 处 1px/1rpx 边框，涉及 51 个文件

**主要问题文件**:

| 文件路径 | 问题数量 | 违规类型 |
|----------|----------|----------|
| `pages/org-home/settlement.wxss` | 15+ | `1rpx solid rgba(74, 93, 78, 0.08)` |
| `pages/order/order.wxss` | 12+ | `1rpx solid #f0f0f0`, `1rpx solid #e8e8e8` |
| `pages/order/create.wxss` | 10+ | `1rpx solid #e8e8e8`, `1rpx solid #f0f0f0` |
| `pages/executor-assistant/assistant.wxss` | 10+ | `1rpx solid rgba(195, 200, 193, 0.1)` |
| `pages/org-volunteer-detail/org-volunteer-detail.wxss` | 8+ | `1rpx solid var(--border-divider)` |

**典型违规代码**:
```css
/* ❌ 违规 */
border-bottom: 1rpx solid #e8e8e8;
border-top: 1rpx solid rgba(74, 93, 78, 0.08);

/* ✅ 应改为 */
/* 方案 1: 使用 CSS 变量 */
border-bottom: 1rpx solid var(--stitch-border-divider);

/* 方案 2: 使用渐变分隔 */
background: linear-gradient(180deg, var(--stitch-bg-white) 95%, var(--stitch-bg-secondary) 100%);

/* 方案 3: 使用阴影分隔 */
box-shadow: 0 1rpx 0 rgba(74, 93, 78, 0.05);
```

---

## 🟠 P1 级别问题（建议修复）

### 3. 组件圆角不统一

**规范要求**: 
- 组件圆角统一 `24rpx` (大卡片/组件)
- 按钮/标签可使用 `16rpx` 或 `8rpx`

**问题统计**: 199 处非 24rpx 圆角，涉及 50 个文件

**主要问题文件**:

| 文件路径 | 问题圆角值 | 建议修改 |
|----------|------------|----------|
| `pages/admin-appeal/appeal.wxss` | `3rpx`, `32rpx`, `16rpx` | 统一为 `24rpx` 或 `16rpx` |
| `pages/q-16-order-detail/q-16-order-detail.wxss` | `2rpx`, `12rpx`, `16rpx` | 统一为 `24rpx` |
| `pages/executor-evidence/evidence.wxss` | `4rpx`, `2rpx`, `48rpx` | 统一为 `24rpx` 或 `32rpx` |
| `pages/admin-export/export.wxss` | `48rpx`, `20rpx`, `32rpx` | 统一为 `24rpx` |
| `pages/executor-settings/settings.wxss` | `8rpx`, `12rpx`, `32rpx` | 统一为 `24rpx` |

**典型违规代码**:
```css
/* ❌ 违规 - 圆角不统一 */
border-radius: 3rpx;    /* 太小 */
border-radius: 48rpx;   /* 太大 */
border-radius: 12rpx;   /* 非标准值 */

/* ✅ 应改为 */
border-radius: 24rpx;   /* 标准大卡片 */
/* 或 */
border-radius: 16rpx;   /* 标准按钮/标签 */
```

---

### 4. 间距系统不规范

**规范要求**: 
- 组件间距：`24rpx` 统一
- 卡片内边距：`24-32rpx`
- 底部补偿：`240rpx`（祈福者端）/ `40rpx`（执行者端/管理端）

**问题统计**: 多处使用非标准间距值

**主要问题**:
- 使用 `48rpx` padding（应使用 `var(--stitch-spacing-lg)` = 32rpx 或 `var(--stitch-spacing-xl)` = 48rpx）
- 使用 `160rpx` 底部 padding（祈福者端应为 `240rpx`）
- 使用 `var(--spacing-2)` 等未定义变量

**典型违规代码**:
```css
/* ❌ 违规 */
padding: 48rpx;          /* 应使用变量 */
padding-bottom: 160rpx;  /* 祈福者端应为 240rpx */
margin-bottom: 12rpx;    /* 非标准间距 */

/* ✅ 应改为 */
padding: var(--stitch-spacing-xl);
padding-bottom: 240rpx;  /* 祈福者端 */
margin-bottom: var(--stitch-spacing-sm);  /* 16rpx */
```

---

## 🟡 P2 级别问题（优化建议）

### 5. 彩色 Emoji 使用

**规范要求**: 
- ❌ 无彩色 Emoji（使用 SVG/Material Icons）

**问题统计**: 33 处 Emoji，涉及 19 个文件

**问题文件列表**:

| 文件路径 | Emoji 使用 | 建议替换 |
|----------|------------|----------|
| `pages/executor-settings/executor-settings.wxml` | `🗄️`, `✍️`, `☎️`, `🙏` | Material Icons |
| `pages/profile/profile.wxml` | `⚙️`, `ℹ️` | Material Icons |
| `pages/org-settings/org-settings.wxml` | `👁️`, `🗄️`, `✍️`, `☎️`, `🙏` | Material Icons |
| `pages/order/create.wxml` | `👤` | Material Icons |
| `pages/executor-assistant/executor-assistant.wxml` | `👤`, `📖` | Material Icons |
| `pages/wiki/detail.wxml` | `❤️`, `🤍`, `⚠️` | Material Icons |

**典型违规代码**:
```xml
<!-- ❌ 违规 -->
<text class="setting-icon">🗄️</text>
<view class="nav-icon">👤</view>

<!-- ✅ 应改为 -->
<text class="material-icons">folder</text>
<view class="material-icons">person</view>
```

---

### 6. 字体系统

**规范要求**: 
- 标题字体：`Noto Serif SC`
- 正文字体：`Plus Jakarta Sans`
- 字体大小符合规范

**检查结果**: ✅ **基本符合规范**

大部分文件正确使用：
- `font-family: 'Noto Serif SC', serif;` (标题)
- `font-family: var(--stitch-font-headline);` (标题)
- `font-family: var(--stitch-font-sans);` (正文)

**小问题**: 少数文件使用 `monospace` 等特殊字体（代码显示场景可接受）

---

### 7. 阴影系统

**规范要求**: 
- 呼吸感阴影：`0 12rpx 40rpx rgba(74,93,78,0.06)`

**检查结果**: ⚠️ **部分符合**

**符合规范的阴影**:
```css
box-shadow: 0 12rpx 40rpx rgba(74, 93, 78, 0.06);  /* ✅ 标准 */
box-shadow: 0 24rpx 80rpx rgba(74, 93, 78, 0.06);  /* ✅ 大卡片 */
```

**不规范的阴影**:
```css
box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.05);      /* ❌ 应使用主题变量 */
box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.1);       /* ❌ 应使用主题变量 */
```

**建议**: 统一使用主题变量：
```css
box-shadow: var(--stitch-shadow-sm);
box-shadow: var(--stitch-shadow-md);
box-shadow: var(--stitch-shadow-lg);
```

---

### 8. 按钮热区

**规范要求**: 
- 按钮热区 ≥ `88rpx`

**检查结果**: ⚠️ **部分符合**

**问题**: 部分按钮高度为 `48rpx`, `56rpx`, `64rpx`，低于规范的 `88rpx`

**典型违规**:
```css
/* ❌ 违规 - 热区太小 */
height: 48rpx;
min-height: 56rpx;

/* ✅ 应改为 */
min-height: 88rpx;  /* 或 var(--stitch-touch-target) */
```

---

## 📋 整改优先级建议

### 第一阶段（P0 - 1 周内完成）
1. **色彩系统整改** (530 处)
   - 替换所有硬编码色值为 CSS 变量
   - 优先处理：`q-13-service`, `admin-appeal`, `q-16-order-detail`
   
2. **1px 边框整改** (157 处)
   - 替换为 CSS 变量或渐变/阴影分隔
   - 优先处理：`org-home/*`, `order/*`, `executor-assistant/*`

### 第二阶段（P1 - 2 周内完成）
3. **圆角统一** (199 处)
   - 统一为 `24rpx`（大卡片）或 `16rpx`（按钮/标签）
   
4. **间距系统整改**
   - 统一使用 `var(--stitch-spacing-*)` 变量
   - 修正底部补偿值

### 第三阶段（P2 - 3 周内完成）
5. **Emoji 替换** (33 处)
   - 替换为 Material Icons 或 SVG
   
6. **阴影系统统一**
   - 使用 `var(--stitch-shadow-*)` 变量

7. **按钮热区调整**
   - 确保所有可点击元素 ≥ `88rpx`

---

## 📈 规范符合度提升路径

| 阶段 | 完成项 | 预期符合度 |
|------|--------|------------|
| 当前 | - | 58.9% |
| 阶段一 | P0 问题修复 | 75%+ |
| 阶段二 | P1 问题修复 | 85%+ |
| 阶段三 | P2 问题修复 | 95%+ |

---

## 📝 附录：主题变量参考

完整变量列表见 `theme.wxss`，常用变量：

```css
/* 色彩 */
--stitch-bg-primary: #EFEEE9
--stitch-bg-white: #FFFFFF
--stitch-green-primary: #4A5D4E
--stitch-gold-primary: #C9B037

/* 文字 */
--stitch-text-primary: #434843
--stitch-text-secondary: #727772

/* 边框 */
--stitch-border-divider: rgba(74, 93, 78, 0.08)

/* 间距 */
--stitch-spacing-md: 24rpx
--stitch-spacing-lg: 32rpx

/* 圆角 */
--stitch-radius-lg: 24rpx
--stitch-radius-md: 16rpx

/* 阴影 */
--stitch-shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.06)
--stitch-shadow-lg: 0 8rpx 32rpx rgba(0, 0, 0, 0.08)

/* 热区 */
--stitch-touch-target: 88rpx
```

---

**报告生成完成** ✅  
**下一步**: 请主 Agent 审阅并分配整改任务
