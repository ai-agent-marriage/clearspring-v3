# 执行者端 O-10~O-12 页面问题清单（审查员 A）

## 问题汇总

| 级别 | 数量 | 说明 |
|------|------|------|
| P0 | 3 | 严重问题，必须修复 |
| P1 | 8 | 重要问题，建议修复 |
| P2 | 6 | 优化问题，可延后 |
| **合计** | **17** | - |

---

## P0 问题（严重，必须修复）

### ISSUE-A-001：违反设计规范红线 - 使用 1rpx 实线边框

**问题描述**：Stitch 设计系统 V3.0 明确规定"无 1px 实线边框（使用色调渐变）"，但代码中存在多处 1rpx 实线边框。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.wxss` 第 183 行
- `pages/executor-settings/executor-settings.wxss` 第 52 行

**当前代码**：
```css
/* O-10 WXSS 第 183 行 */
.cert-footer {
  /* ... */
  border-bottom: 1rpx solid var(--border-divider);
}

/* O-12 WXSS 第 52 行 */
.setting-item {
  /* ... */
  border-bottom: 1rpx solid var(--border-divider);
}
```

**严重级别**：P0

**修复建议**：使用色调渐变分割线替代实线边框，或使用 `divider` 组件。

**示例代码**：
```css
/* 方案 1：使用渐变边框 */
.cert-footer {
  border-bottom: none;
  background: linear-gradient(180deg, transparent 99%, var(--stitch-border-divider) 100%);
  padding-bottom: var(--stitch-spacing-md);
}

/* 方案 2：使用 divider 组件（推荐） */
/* WXML 中添加 */
<view class="divider"></view>
```

---

### ISSUE-A-002：按钮热区未达到 88rpx 最小标准

**问题描述**：Stitch 设计系统规定按钮最小点击热区为 88rpx，但 O-10 证书操作按钮未设置 min-height。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.wxss` 第 203-208 行（.cert-actions 内的按钮）

**当前代码**：
```css
.cert-actions {
  display: flex;
  gap: var(--stitch-spacing-md);
}
/* 按钮继承 .btn 样式，但小按钮可能不足 88rpx */
```

**严重级别**：P0

**修复建议**：确保所有按钮 min-height ≥ 88rpx。

**示例代码**：
```css
/* 在 .btn-small 中确保最小高度 */
.btn-small {
  min-height: 88rpx;  /* 确保达到最小热区 */
  font-size: var(--stitch-font-l);
  border-radius: var(--stitch-radius-sm);
}

/* 或者在证书操作按钮中明确设置 */
.cert-actions .btn {
  min-height: 88rpx;
  padding: 0 var(--stitch-spacing-md);
}
```

---

### ISSUE-A-003：无任何测试文件

**问题描述**：三个页面均无任何测试文件，无法验证代码质量和功能正确性。

**问题位置**：
- `miniprogram/__tests__/` 目录下无 `executor-qualification-manage.test.js`
- `miniprogram/__tests__/` 目录下无 `executor-message-center.test.js`
- `miniprogram/__tests__/` 目录下无 `executor-settings.test.js`

**严重级别**：P0

**修复建议**：为每个页面创建测试文件，包含 ≥10 个测试用例。

**示例结构**：
```javascript
// miniprogram/__tests__/executor-qualification-manage.test.js
describe('执行者资质管理页 O-10', () => {
  describe('页面加载', () => {
    test('页面正常加载', () => { /* ... */ });
    test('资质数据正确显示', () => { /* ... */ });
  });
  
  describe('资质状态', () => {
    test('已认证状态显示正确', () => { /* ... */ });
    test('审核中状态显示正确', () => { /* ... */ });
    test('已驳回状态显示正确', () => { /* ... */ });
    test('已过期状态显示正确', () => { /* ... */ });
  });
  
  describe('证书管理', () => {
    test('添加证书功能', () => { /* ... */ });
    test('查看证书详情', () => { /* ... */ });
    test('删除证书确认', () => { /* ... */ });
  });
  
  describe('擅长领域', () => {
    test('切换擅长领域标签', () => { /* ... */ });
    test('编辑擅长领域', () => { /* ... */ });
  });
  
  describe('UI 组件', () => {
    test('液态玻璃效果渲染', () => { /* ... */ });
    test('按钮热区尺寸', () => { /* ... */ });
    test('空状态显示', () => { /* ... */ });
  });
});
```

---

## P1 问题（重要，建议修复）

### ISSUE-A-004：缺少加载状态指示器

**问题描述**：数据加载时没有显示加载指示器，用户无法感知加载状态。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.js` 第 66-78 行（loadQualificationData）
- `pages/executor-message-center/executor-message-center.js` 第 42-90 行（loadMessages）

**当前代码**：
```javascript
async loadQualificationData() {
  try {
    // TODO: 调用云函数获取资质数据
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  } catch (error) {
    console.error('加载资质数据失败:', error);
    wx.showToast({
      title: '加载失败',
      icon: 'none'
    });
  }
}
```

**严重级别**：P1

**修复建议**：在加载开始时显示 loading，加载完成后隐藏。

**示例代码**：
```javascript
async loadQualificationData() {
  wx.showLoading({ title: '加载中...', mask: true });
  
  try {
    const res = await wx.cloud.callFunction({
      name: 'getQualificationStatus',
      data: {}
    });
    
    // 处理数据
    this.setData({ /* ... */ });
  } catch (error) {
    console.error('加载资质数据失败:', error);
    wx.showToast({
      title: '加载失败',
      icon: 'none'
    });
  } finally {
    wx.hideLoading();
  }
}
```

---

### ISSUE-A-005：TODO 功能未实现（云函数调用）

**问题描述**：代码中存在多处 TODO 注释，云函数调用未实际实现，功能不完整。

**问题位置**：
- O-10 JS 第 68-71 行、159 行、177 行、212 行、230 行
- O-11 JS 第 45-51 行、130 行、143 行、157 行
- O-12 JS 第 27 行、61 行、120 行、138 行、178 行

**当前代码**（示例）：
```javascript
// TODO: 调用云函数获取资质数据
// const res = await wx.cloud.callFunction({
//   name: 'getQualificationStatus',
//   data: {}
// });
```

**严重级别**：P1

**修复建议**：实现云函数调用，完善数据持久化逻辑。

---

### ISSUE-A-006：错误处理不完整

**问题描述**：部分异步操作缺少错误处理，可能导致未捕获异常。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.js` 第 212-230 行（删除证书）
- `pages/executor-message-center/executor-message-center.js` 第 130-143 行（标记已读）

**当前代码**：
```javascript
onDeleteCertificate(e) {
  const certId = e.currentTarget.dataset.id;
  
  wx.showModal({
    title: '确认删除',
    content: '确定要删除这个证书吗？',
    confirmText: '删除',
    confirmColor: '#BA1A1A',  // 硬编码色值
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用云函数删除证书
        const certificates = this.data.certificates.filter(cert => cert.id !== certId);
        this.setData({ certificates });
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }
    }
  });
}
```

**严重级别**：P1

**修复建议**：添加云函数调用的错误处理，使用 CSS 变量替代硬编码色值。

**示例代码**：
```javascript
onDeleteCertificate(e) {
  const certId = e.currentTarget.dataset.id;
  
  wx.showModal({
    title: '确认删除',
    content: '确定要删除这个证书吗？',
    confirmText: '删除',
    confirmColor: 'var(--stitch-error)',  // 使用变量（需转换）
    success: async (res) => {
      if (res.confirm) {
        try {
          wx.showLoading({ title: '删除中...', mask: true });
          
          await wx.cloud.callFunction({
            name: 'deleteCertificate',
            data: { certId }
          });
          
          const certificates = this.data.certificates.filter(cert => cert.id !== certId);
          this.setData({ certificates });
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        } catch (error) {
          console.error('删除证书失败:', error);
          wx.showToast({
            title: '删除失败',
            icon: 'none'
          });
        } finally {
          wx.hideLoading();
        }
      }
    }
  });
}
```

---

### ISSUE-A-007：开关尺寸偏小

**问题描述**：O-12 设置页面使用 `transform: scale(0.9)` 缩小开关，可能导致点击困难。

**问题位置**：
- `pages/executor-settings/executor-settings.wxss` 第 79 行

**当前代码**：
```css
.setting-switch {
  transform: scale(0.9);
}
```

**严重级别**：P1

**修复建议**：移除 transform 缩放，或使用更大的点击区域包裹开关。

**示例代码**：
```css
/* 方案 1：移除缩放 */
.setting-switch {
  /* transform: scale(0.9); */
}

/* 方案 2：增加点击区域 */
.setting-item {
  padding: var(--stitch-spacing-lg);
  min-height: 88rpx;  /* 确保最小点击区域 */
}

.setting-switch {
  transform: scale(1);  /* 保持原始尺寸 */
}
```

---

### ISSUE-A-008：代码复用度低

**问题描述**：O-10 中上传技能证书和上传资质证书的逻辑重复，应提取为公共函数。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.js` 第 156-190 行

**当前代码**：
```javascript
// 上传技能证书
async onUploadSkillCertificate() {
  wx.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: (res) => {
      console.log('选择的证书图片:', res.tempFiles);
      // TODO: 上传证书图片
      wx.showToast({ title: '证书上传成功', icon: 'success' });
    },
    fail: (err) => {
      if (err.errMsg !== 'chooseMedia:fail cancel') {
        wx.showToast({ title: '上传失败', icon: 'none' });
      }
    }
  });
}

// 上传资质证书（几乎相同）
async onUploadQualificationCertificate() {
  wx.chooseMedia({ /* ... 相同代码 ... */ });
}
```

**严重级别**：P1

**修复建议**：提取公共上传函数，减少代码重复。

**示例代码**：
```javascript
// 公共上传函数
async uploadCertificate(type) {
  const typeMap = {
    skill: '技能证书',
    qualification: '资质证书'
  };
  
  wx.chooseMedia({
    count: 9,
    mediaType: ['image'],
    sourceType: ['camera', 'album'],
    sizeType: ['compressed'],
    success: async (res) => {
      console.log(`选择的${typeMap[type]}图片:`, res.tempFiles);
      
      try {
        wx.showLoading({ title: '上传中...', mask: true });
        
        // TODO: 调用云函数上传
        // await wx.cloud.callFunction({
        //   name: 'uploadCertificate',
        //   data: { type, files: res.tempFiles }
        // });
        
        wx.showToast({
          title: `${typeMap[type]}上传成功`,
          icon: 'success'
        });
      } catch (error) {
        console.error('上传失败:', error);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      } finally {
        wx.hideLoading();
      }
    },
    fail: (err) => {
      if (err.errMsg !== 'chooseMedia:fail cancel') {
        wx.showToast({ title: '上传失败', icon: 'none' });
      }
    }
  });
}

// 简化调用
onUploadSkillCertificate() {
  this.uploadCertificate('skill');
}

onUploadQualificationCertificate() {
  this.uploadCertificate('qualification');
}
```

---

### ISSUE-A-009：删除确认对话框颜色硬编码

**问题描述**：确认对话框的 confirmColor 使用硬编码色值 `#BA1A1A`，应使用 CSS 变量。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.js` 第 217 行
- `pages/executor-settings/executor-settings.wxss` 第 149 行、172 行

**当前代码**：
```javascript
wx.showModal({
  title: '确认删除',
  content: '确定要删除这个证书吗？',
  confirmText: '删除',
  confirmColor: '#BA1A1A',  // 硬编码
  // ...
});
```

**严重级别**：P1

**修复建议**：使用主题色变量（虽然 showModal 不支持直接传 CSS 变量，但应统一定义常量）。

**示例代码**：
```javascript
// 在工具文件中定义
const COLORS = {
  error: '#BA1A1A',
  primary: '#4A5D4E'
};

// 使用常量
wx.showModal({
  confirmColor: COLORS.error,
  // ...
});
```

---

### ISSUE-A-010：消息清空操作无二次确认保护

**问题描述**：消息清空操作虽然有确认对话框，但清空后无恢复机制，应添加更明确的警告。

**问题位置**：
- `pages/executor-message-center/executor-message-center.js` 第 151-168 行

**当前代码**：
```javascript
onClearMessages() {
  wx.showModal({
    title: '确认清空',
    content: '确定要清空所有消息吗？此操作不可恢复。',
    confirmText: '清空',
    confirmColor: '#BA1A1A',
    success: (res) => {
      if (res.confirm) {
        // TODO: 调用云函数清空消息
        this.setData({ /* ... */ });
        wx.showToast({ title: '已清空', icon: 'success' });
      }
    }
  });
}
```

**严重级别**：P1

**修复建议**：增加更明确的警告，或添加消息归档功能而非直接删除。

---

### ISSUE-A-011：缓存清除逻辑不完整

**问题描述**：O-12 清除缓存功能使用 `wx.clearStorageSync()` 会清除所有本地存储数据（包括登录状态），应只清除缓存文件。

**问题位置**：
- `pages/executor-settings/executor-settings.js` 第 134-147 行

**当前代码**：
```javascript
onClearCache() {
  wx.showModal({
    title: '清除缓存',
    content: `确定要清除 ${this.data.cacheSize} 的缓存吗？`,
    success: (res) => {
      if (res.confirm) {
        // TODO: 清除缓存
        wx.clearStorageSync();  // 危险：清除所有数据
        this.setData({ cacheSize: '0 MB' });
        wx.showToast({ title: '已清除', icon: 'success' });
      }
    }
  });
}
```

**严重级别**：P1

**修复建议**：使用 `wx.getStorageInfo` 获取缓存信息，只清除临时文件，保留重要数据。

**示例代码**：
```javascript
async onClearCache() {
  wx.showModal({
    title: '清除缓存',
    content: `确定要清除 ${this.data.cacheSize} 的缓存吗？`,
    confirmText: '清除',
    confirmColor: '#BA1A1A',
    success: async (res) => {
      if (res.confirm) {
        try {
          // 清除临时文件，保留登录状态等关键数据
          const keys = ['executor_settings', 'user_info', 'token'];
          const storageInfo = wx.getStorageInfoSync();
          
          for (const key of storageInfo.keys) {
            if (!keys.includes(key)) {
              wx.removeStorageSync(key);
            }
          }
          
          this.setData({ cacheSize: '0 MB' });
          wx.showToast({ title: '已清除', icon: 'success' });
        } catch (error) {
          console.error('清除缓存失败:', error);
          wx.showToast({ title: '清除失败', icon: 'none' });
        }
      }
    }
  });
}
```

---

## P2 问题（优化，可延后）

### ISSUE-A-012：代码注释不足

**问题描述**：关键函数缺少注释说明，不利于代码维护。

**问题位置**：全部 JS 文件

**严重级别**：P2

**修复建议**：为公共函数、复杂逻辑添加 JSDoc 风格注释。

---

### ISSUE-A-013：状态日期格式不统一

**问题描述**：O-10 中日期格式混用（'2026-03-25'、'今天 10:30'），应统一格式。

**问题位置**：
- `pages/executor-qualification-manage/executor-qualification-manage.js` 第 16-18 行、42-43 行

**严重级别**：P2

**修复建议**：使用统一的日期格式化工具函数。

---

### ISSUE-A-014：消息时间格式应使用相对时间

**问题描述**：O-11 消息时间使用绝对时间（'今天 10:30'、'昨天 16:20'），应使用相对时间（'10 分钟前'、'2 小时前'）。

**问题位置**：
- `pages/executor-message-center/executor-message-center.js` 第 56-82 行（模拟数据）

**严重级别**：P2

**修复建议**：添加相对时间格式化函数。

---

### ISSUE-A-015：设置项图标使用 Emoji 而非系统图标

**问题描述**：O-12 设置项使用 Emoji 图标（📱、🔐等），在不同设备上显示可能不一致。

**问题位置**：
- `pages/executor-settings/executor-settings.wxml` 第 13-89 行

**严重级别**：P2

**修复建议**：使用系统图标或 SVG 图标。

---

### ISSUE-A-016：缺少骨架屏加载状态

**问题描述**：页面加载时没有骨架屏，用户体验不佳。

**问题位置**：全部 WXML 文件

**严重级别**：P2

**修复建议**：添加骨架屏组件，在数据加载前显示。

---

### ISSUE-A-017：缺少无障碍支持

**问题描述**：页面缺少 aria 标签，不支持屏幕阅读器。

**问题位置**：全部 WXML 文件

**严重级别**：P2

**修复建议**：为关键元素添加 aria-label 属性。

---

## 问题修复优先级

```
优先级排序（从高到低）：

1. ISSUE-A-003：补充测试文件（最重要）
2. ISSUE-A-001：移除 1rpx 实线边框
3. ISSUE-A-002：确保按钮热区 ≥ 88rpx
4. ISSUE-A-004：添加加载状态指示器
5. ISSUE-A-005：实现 TODO 云函数调用
6. ISSUE-A-006：完善错误处理
7. ISSUE-A-007 ~ ISSUE-A-011：其他 P1 问题
8. ISSUE-A-012 ~ ISSUE-A-017：P2 优化问题
```

---

*问题清单生成时间：2026-04-12 12:30*
*审查员：Agent A*
