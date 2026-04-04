# 内容安全审核集成学习笔记

## 📚 概述

微信小程序内容安全审核是保障平台内容合规的重要机制。本文档记录了在护生功德林模块中集成内容安全审核的完整流程和最佳实践。

## 🔐 审核类型

### 1. 图片内容安全审核

**API**: `wx.security.imgSecCheck`

**适用场景**:
- 用户上传的现场照片
- 头像、背景图等用户生成内容
- 任何需要展示给用户查看的图片

**调用示例**:
```javascript
wx.security.imgSecCheck({
  mediaType: 1, // 1: 图片
  image: filePath, // 本地文件路径或网络 URL
  success: () => {
    console.log('图片审核通过');
  },
  fail: (err) => {
    console.error('图片审核失败', err);
  }
});
```

**注意事项**:
- 文件路径必须是本地临时路径（chooseMedia/chooseImage 返回的 tempFilePath）
- 网络图片需先下载到本地再审核
- 单次调用图片大小限制：不超过 10MB
- 审核结果有缓存，相同图片短期内不会重复审核

### 2. 文本内容安全审核

**API**: `wx.security.msgSecCheck`

**适用场景**:
- 用户输入的评论、留言
- 昵称、签名等个人信息
- 任何需要展示的文本内容

**调用示例**:
```javascript
wx.security.msgSecCheck({
  content: content, // 待审核文本
  success: () => {
    console.log('文本审核通过');
  },
  fail: (err) => {
    console.error('文本审核失败', err);
  }
});
```

**注意事项**:
- 文本长度限制：不超过 500KB
- 支持多语言内容审核
- 审核维度：色情、政治、广告、违禁品等

## 🛠️ 工具类封装

### security.js 核心函数

```javascript
// utils/security.js

// 单张图片审核
export function checkImage(filePath) {
  return new Promise((resolve, reject) => {
    wx.security.imgSecCheck({
      mediaType: 1,
      image: filePath,
      success: () => resolve(true),
      fail: (err) => {
        wx.showToast({ title: '图片包含违规内容', icon: 'none' });
        resolve(false);
      }
    });
  });
}

// 文本审核
export function checkText(content) {
  return new Promise((resolve, reject) => {
    wx.security.msgSecCheck({
      content: content,
      success: () => resolve(true),
      fail: (err) => {
        wx.showToast({ title: '文本包含违规内容', icon: 'none' });
        resolve(false);
      }
    });
  });
}

// 批量图片审核
export async function checkImagesBatch(filePaths) {
  for (const filePath of filePaths) {
    const pass = await checkImage(filePath);
    if (!pass) return false;
  }
  return true;
}

// 表单综合审核
export async function checkFormData(formData) {
  const result = { pass: true, errors: [] };
  
  if (formData.wish) {
    const textPass = await checkText(formData.wish);
    if (!textPass) {
      result.pass = false;
      result.errors.push('心愿内容包含违规信息');
    }
  }
  
  if (formData.images && formData.images.length > 0) {
    const imagesPass = await checkImagesBatch(formData.images);
    if (!imagesPass) {
      result.pass = false;
      result.errors.push('图片包含违规内容');
    }
  }
  
  return result;
}
```

## 📝 集成实践

### 表单提交前审核流程

```javascript
async submitRecord() {
  // 1. 基础校验
  if (!this.data.agree) {
    wx.showToast({ title: '请先勾选合规承诺', icon: 'none' });
    return;
  }
  
  // 2. 必填项校验
  if (!this.data.form.species || !this.data.form.quantity) {
    wx.showToast({ title: '请填写必填项', icon: 'none' });
    return;
  }
  
  // 3. 图片内容安全审核
  for (const image of this.data.form.images) {
    const pass = await checkImage(image);
    if (!pass) return; // 审核失败，终止提交
  }
  
  // 4. 文本内容安全审核
  if (this.data.form.wish) {
    const pass = await checkText(this.data.form.wish);
    if (!pass) return;
  }
  
  // 5. 提交到后端
  this.submitToBackend();
}
```

### 图片上传时即时审核

```javascript
async uploadImages() {
  wx.chooseMedia({
    count: 6,
    mediaType: ['image'],
    sourceType: ['album', 'camera'],
    success: async (res) => {
      const tempFiles = res.tempFiles.map(file => file.tempFilePath);
      
      // 即时审核
      for (const image of tempFiles) {
        const pass = await checkImage(image);
        if (!pass) {
          // 审核失败，不添加到列表
          return;
        }
      }
      
      // 全部通过，添加到列表
      this.setData({
        'form.images': [...this.data.form.images, ...tempFiles]
      });
    }
  });
}
```

## ⚠️ 最佳实践

### 1. 用户体验优化

- **即时反馈**: 图片上传时立即审核，避免提交时才发现违规
- **友好提示**: 使用明确的错误提示，告知用户具体原因
- **加载状态**: 审核期间显示 loading，避免用户重复操作
- **批量处理**: 多图片上传时逐个审核，遇到失败立即停止

### 2. 性能优化

```javascript
// ✅ 推荐：使用 Promise.all 并行审核（适用于少量图片）
async function checkImagesParallel(filePaths) {
  const results = await Promise.all(
    filePaths.map(path => checkImage(path))
  );
  return results.every(r => r);
}

// ✅ 推荐：串行审核（适用于大量图片，避免并发限制）
async function checkImagesSerial(filePaths) {
  for (const path of filePaths) {
    const pass = await checkImage(path);
    if (!pass) return false;
  }
  return true;
}
```

### 3. 错误处理

```javascript
// 完善的错误处理
async function safeCheckImage(filePath) {
  try {
    return await checkImage(filePath);
  } catch (error) {
    console.error('图片审核异常:', error);
    wx.showToast({
      title: '审核服务异常，请稍后重试',
      icon: 'none'
    });
    return false;
  }
}
```

### 4. 后端二次审核

**重要**: 前端审核仅为用户体验优化，后端必须进行二次审核！

```javascript
// 后端云函数示例
exports.main = async (event, context) => {
  const { images, text } = event;
  
  // 调用微信内容安全 API
  const imgResult = await wx.openapi.security.imgSecCheck({
    mediaType: 1,
    fileContent: images[0]
  });
  
  const textResult = await wx.openapi.security.msgSecCheck({
    content: text
  });
  
  return {
    pass: imgResult.result === 0 && textResult.result === 0
  };
};
```

## 📊 审核结果处理

| 结果 | 处理方式 | 用户提示 |
|------|----------|----------|
| 通过 | 允许提交/展示 | - |
| 违规 | 拒绝提交 | "内容包含违规信息，请修改后重试" |
| 审核失败 | 重试或转人工 | "审核服务繁忙，请稍后重试" |
| 超时 | 转人工审核 | "审核中，请稍后查看结果" |

## 🔍 常见问题

### Q1: 审核接口调用失败？
**A**: 检查是否已开通内容安全服务，需在微信公众平台设置中开启。

### Q2: 审核结果不准确？
**A**: 可结合多个审核维度，或引入第三方内容安全服务进行二次校验。

### Q3: 如何降低审核延迟？
**A**: 
- 压缩图片后再审核
- 使用 CDN 加速
- 异步审核 + 轮询结果

### Q4: 审核缓存如何清除？
**A**: 微信会自动管理缓存，相同内容短期内不会重复审核。如需强制重新审核，可对文件进行微小修改（如添加时间戳）。

## 📖 参考资料

- [微信小程序内容安全接口文档](https://developers.weixin.qq.com/miniprogram/dev/api/openapi/security/)
- [微信内容安全最佳实践](https://developers.weixin.qq.com/community/develop/doc/000c6c0b6f8b28e2a049c8e9b51c00)
- [内容安全违规词库](https://mp.weixin.qq.com/cgi-bin/announce?action=getannouncement&key=11534)

---

*最后更新: 2026-04-04*
*作者: Phase 1 Week 1 Day 3 开发团队*
