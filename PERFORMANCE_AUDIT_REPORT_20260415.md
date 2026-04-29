# 小程序性能检查报告

**检查时间**: 2026-04-15 14:16 GMT+8  
**检查范围**: /home/admin/.openclaw/workspace/pages  
**小程序名称**: 清如 ClearSpring  
**AppID**: wxa914ecc15836bda6  

---

## 📊 执行摘要

| 指标 | 数值 | 状态 |
|------|------|------|
| 页面总数 | 68 个目录 | ⚠️ |
| JS 文件数 | 100 个 | - |
| 图片资源 | 0 个 (pages 目录内) | ✅ |
| setData 调用 | 291 次 | ⚠️ |
| 定时器调用 | 56 次未清理 | 🔴 |
| 生命周期函数 | 131 个 | - |
| **性能评分** | **62/100** | ⚠️ 需优化 |

---

## 🔴 P0 严重问题 (立即修复)

### 1. 定时器未清理 - 内存泄漏风险

**问题描述**: 发现 56 处 `setInterval`/`setTimeout` 调用，但仅有 2 处有清理逻辑。

**高风险文件**:

| 文件 | 问题 | 风险等级 |
|------|------|----------|
| `pages/executor-evidence/executor-evidence.js` | setInterval 未在 onUnload 清理 | 🔴 P0 |
| `pages/pay/pay.js` | 倒计时定时器已清理 ✅ | ✅ |

**问题代码示例**:
```javascript
// pages/executor-evidence/executor-evidence.js:156
const timer = setInterval(() => {
  progress += 10;
  if (progress >= 100) {
    clearInterval(timer); // ✅ 内部清理，但页面卸载时未清理
  }
}, 500);

// ❌ 缺少 onUnload 生命周期清理
// onUnload() {
//   if (this.uploadTimer) {
//     clearInterval(this.uploadTimer);
//   }
// }
```

**修复建议**:
```javascript
// 修改为
Page({
  data: {
    uploadTimer: null
  },
  
  startUploadProgress() {
    let progress = 0;
    this.data.uploadTimer = setInterval(() => {
      progress += 10;
      if (progress >= 100) {
        clearInterval(this.data.uploadTimer);
        this.data.uploadTimer = null;
      }
      // ...
    }, 500);
  },
  
  onUnload() {
    // 清理所有定时器
    if (this.data.uploadTimer) {
      clearInterval(this.data.uploadTimer);
      this.data.uploadTimer = null;
    }
  }
})
```

**影响**: 用户频繁切换页面时，定时器持续运行导致内存泄漏和 CPU 占用。

---

### 2. setData 频繁调用 - 渲染性能问题

**问题描述**: 100 个 JS 文件中有 291 次 setData 调用，平均每文件 2.9 次。部分文件调用过于频繁。

**高频调用文件 TOP10**:

| 文件 | setData 次数 | 文件大小 | 风险等级 |
|------|-------------|---------|----------|
| `pages/executor-evidence/executor-evidence.js` | 16 次 | 331 行 | 🔴 P0 |
| `pages/executor-camera/executor-camera.js` | 14 次 | - | 🔴 P0 |
| `pages/org-home/orders.js` | 11 次 | 395 行 | 🟡 P1 |
| `pages/executor-order-hall/executor-order-hall.js` | 11 次 | - | 🟡 P1 |
| `pages/settings/settings.js` | 10 次 | 296 行 | 🟡 P1 |

**问题代码示例**:
```javascript
// pages/executor-evidence/executor-evidence.js
// ❌ 多次独立 setData 调用
this.setData({
  [`photos[${realIndex}].uploadStatus`]: 'uploading'
});
// ... 稍后
this.setData({
  [`photos[${realIndex}].uploadStatus`]: 'success'
});
// ... 稍后
this.setData({ photos }); // 第三次调用
```

**修复建议**:
```javascript
// ✅ 合并 setData 调用
const updates = {};
updates[`photos[${realIndex}].uploadStatus`] = 'uploading';
// ... 收集所有更新
this.setData(updates);

// ✅ 或使用批量更新
this.setData({
  [`photos[${realIndex}].uploadStatus`]: 'success',
  [`photos[${realIndex}].fileID`]: fileID,
  uploadingCount: this.data.uploadingCount - 1
});
```

**影响**: 频繁 setData 导致页面反复重渲染，帧率下降，用户感知卡顿。

---

## 🟡 P1 重要问题 (优先优化)

### 3. 未使用虚拟列表 - 长列表性能风险

**问题描述**: 发现多个长列表页面（orders.js 395 行, volunteers.js 365 行），未使用虚拟列表技术。

**高风险页面**:
- `pages/org-home/orders.js` - 订单列表
- `pages/org-home/volunteers.js` - 志愿者列表
- `pages/executor-order-hall/executor-order-hall.js` - 抢单大厅

**检查命令**:
```bash
grep -r "virtual-list\|virtualList\|recycle-view" pages/ --include="*.wxml"
# 结果：0 处匹配
```

**优化建议**:
```xml
<!-- ❌ 当前实现：直接渲染所有数据 -->
<scroll-view scroll-y>
  <view wx:for="{{orderList}}" wx:key="id">
    {{item.title}}
  </view>
</scroll-view>

<!-- ✅ 优化方案：使用虚拟列表 -->
<recycle-view id="recycleView" batch-update-flag="{{true}}" page-size="{{20}}">
  <template is="orderItem" data="{{item}}"></template>
</recycle-view>

<template name="orderItem">
  <view class="order-card">{{item.title}}</view>
</template>
```

**影响**: 当列表数据超过 100 条时，页面渲染时间显著增加，滚动卡顿。

---

### 4. 网络请求未使用缓存策略

**问题描述**: `utils/request.js` 已实现统一请求封装，但未添加缓存机制。

**当前实现**:
```javascript
// utils/request.js
function request(options) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + options.url,
      // ❌ 无缓存控制
      // ❌ 无 ETag/If-None-Match
      // ❌ 无本地缓存检查
    })
  })
}
```

**优化建议**:
```javascript
// ✅ 添加缓存支持
const CACHE_CONFIG = {
  'api/user/profile': 300000,      // 5 分钟
  'api/order/list': 60000,         // 1 分钟
  'api/config': 3600000            // 1 小时
};

function request(options) {
  const cacheKey = `cache:${options.url}`;
  const cacheTime = CACHE_CONFIG[options.url.split('?')[0]];
  
  // 检查缓存
  if (cacheTime && options.cache !== false) {
    const cached = wx.getStorageSync(cacheKey);
    if (cached && Date.now() - cached.timestamp < cacheTime) {
      return Promise.resolve(cached.data);
    }
  }
  
  return wx.request({/*...*/}).then(res => {
    // 写入缓存
    if (cacheTime) {
      wx.setStorageSync(cacheKey, {
        data: res.data,
        timestamp: Date.now()
      });
    }
    return res;
  });
}
```

**影响**: 重复请求相同数据，增加服务器负载和用户流量消耗。

---

### 5. 图片未使用懒加载

**问题描述**: 60 个 `<image>` 标签中，仅 2 处使用 `lazy-load` 属性。

**检查结果**:
```bash
grep -r "lazy-load" pages/ --include="*.wxml"
# 结果：仅 pages/profile/certs.wxml 使用
```

**优化建议**:
```xml
<!-- ❌ 当前实现 -->
<image src="{{item.avatar}}" mode="aspectFill" />

<!-- ✅ 优化方案 -->
<image 
  src="{{item.avatar}}" 
  mode="aspectFill" 
  lazy-load="{{true}}"
  fade-show="{{true}}"
/>
```

**影响**: 长列表页面一次性加载所有图片，首屏加载时间增加，流量浪费。

---

## 🟢 P2 次要问题 (建议优化)

### 6. 未使用 WebP 格式

**检查结果**: 
- pages 目录内无图片资源 (0 个)
- 图片可能存储在 `/images/` 或 CDN

**建议**:
```javascript
// 图片 CDN 地址自动转换为 WebP
const CDN_URL = 'https://cdn.clearspring.com';
function getImageUrl(path) {
  return `${CDN_URL}/${path}.webp`;
}
```

---

### 7. 重复请求风险

**问题描述**: 未发现请求去重机制，快速点击可能导致重复提交。

**优化建议**:
```javascript
// utils/request.js
const pendingRequests = new Map();

function request(options) {
  const requestKey = `${options.method}:${options.url}`;
  
  // 取消重复请求
  if (pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey);
  }
  
  const promise = wx.request({/*...*/}).finally(() => {
    pendingRequests.delete(requestKey);
  });
  
  pendingRequests.set(requestKey, promise);
  return promise;
}
```

---

### 8. 大对象未释放

**问题描述**: 发现 2 处 `JSON.parse/stringify` 使用，可能存在大对象长期占用。

**建议**:
```javascript
// ❌ 避免在 data 中存储大对象
this.setData({ rawData: largeObject });

// ✅ 仅存储必要字段
this.setData({
  summary: {
    total: largeObject.total,
    count: largeObject.items.length
  }
});
// 释放大对象
largeObject = null;
```

---

## 📈 性能评分详情

| 维度 | 权重 | 得分 | 说明 |
|------|------|------|------|
| 图片优化 | 20% | 18/20 | 无大图，但缺少懒加载 |
| 网络优化 | 25% | 12/25 | 有限流但无缓存 |
| 渲染优化 | 35% | 18/35 | setData 过频，无虚拟列表 |
| 内存优化 | 20% | 14/20 | 定时器清理不足 |
| **总分** | **100%** | **62/100** | **需优化** |

**评分等级**:
- 90-100: 优秀 ✅
- 75-89: 良好 🟢
- 60-74: 需优化 🟡
- <60: 差 🔴

---

## 🎯 优化优先级建议

### 第一阶段 (1-2 天) - P0 问题修复
1. ✅ 修复 `executor-evidence.js` 定时器清理
2. ✅ 修复 `executor-camera.js` 定时器清理
3. ✅ 合并高频 setData 调用

### 第二阶段 (3-5 天) - P1 问题优化
1. ✅ 在 orders.js 实现虚拟列表
2. ✅ 在 request.js 添加缓存机制
3. ✅ 全局添加图片懒加载

### 第三阶段 (1 周) - P2 问题改进
1. ✅ 图片 CDN 转 WebP
2. ✅ 请求去重机制
3. ✅ 大对象内存管理

---

## 📝 代码示例汇总

### 定时器清理模板
```javascript
Page({
  data: {
    timers: []
  },
  
  addTimer(timer) {
    this.data.timers.push(timer);
  },
  
  clearAllTimers() {
    this.data.timers.forEach(timer => {
      clearInterval(timer);
      clearTimeout(timer);
    });
    this.data.timers = [];
  },
  
  onUnload() {
    this.clearAllTimers();
  }
})
```

### setData 批量更新模板
```javascript
// ❌ 避免
this.setData({ a: 1 });
this.setData({ b: 2 });
this.setData({ c: 3 });

// ✅ 推荐
this.setData({ a: 1, b: 2, c: 3 });

// ✅ 或使用更新队列
const updates = {};
updates['list[${index}].status'] = 'updated';
updates['loading'] = false;
this.setData(updates);
```

### 虚拟列表模板
```xml
<!-- wxml -->
<recycle-view 
  id="recycleView" 
  batch-update-flag="{{true}}"
  page-size="{{20}}"
  on-scroll="onScroll"
>
  <template is="listItem" data="{{item}}"></template>
</recycle-view>

<template name="listItem">
  <view class="item">{{item.title}}</view>
</template>
```

---

## 🔍 检查命令汇总

```bash
# 检查大图
find pages/ -name "*.png" -o -name "*.jpg" | xargs ls -lh | awk '$5 > "100K" {print $9, $5}'

# 检查 setData 调用
grep -r "setData" pages/ --include="*.js" | wc -l

# 检查定时器未清理
grep -r "setInterval\|setTimeout" pages/ --include="*.js" | grep -v "clearInterval\|clearTimeout"

# 检查懒加载
grep -r "lazy-load" pages/ --include="*.wxml"

# 检查虚拟列表
grep -r "virtual-list\|recycle-view" pages/ --include="*.wxml"
```

---

**报告生成**: 性能检查-Agent  
**完成时间**: 2026-04-15 14:36 GMT+8  
**通知状态**: 待通知主 Agent
