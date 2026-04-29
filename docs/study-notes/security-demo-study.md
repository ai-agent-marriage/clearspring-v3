# 微信小程序内容安全 API 官方 Demo 学习笔记

## 1. 项目概览

**项目名称**: 微信小程序内容安全 API 官方 Demo  
**GitHub 地址**: https://github.com/wechat-miniprogram/security-demo  
**开源协议**: MIT  
**Stars**: 1000+  
**官方文档**: https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.html

### 核心功能

微信小程序内容安全 API 是微信官方提供的内容审核服务，主要用于：

1. **图片审核**: 检测图片中的色情、暴力、政治敏感等违规内容
2. **文本审核**: 检测文本中的敏感词、违规内容
3. **音频审核**: 检测音频中的违规内容
4. **视频审核**: 检测视频中的违规内容

### 应用场景

- 用户头像、昵称审核
- 用户发布的内容审核 (图文、评论、动态)
- 用户上传图片/视频审核
- 聊天消息内容审核
- 商品信息发布审核

### API 类型对比

| API 名称 | 功能 | 同步/异步 | 适用场景 |
|---------|------|----------|---------|
| imgSecCheck | 图片审核 | 同步 | 小图片、实时性要求高 |
| mediaCheckAsync | 多媒体异步审核 | 异步 | 大图片、音频、视频 |
| msgSecCheck | 文本审核 | 同步 | 短文本、实时性要求高 |
| textSecurityCheck | 文本审核 (增强版) | 同步 | 长文本、更高准确率 |

---

## 2. 安装配置步骤

### 2.1 前置条件

1. **已注册微信小程序账号**
2. **已开通内容安全服务**
   - 登录小程序后台
   - 功能 → 内容安全 → 开通服务
3. **服务器已配置合法域名**
   - 登录小程序后台
   - 开发 → 开发管理 → 开发设置 → 服务器域名
   - 添加 request 合法域名

### 2.2 Node.js 环境配置

```bash
# 创建项目目录
mkdir wx-security-demo
cd wx-security-demo

# 初始化项目
npm init -y

# 安装依赖
npm install express axios multer crypto
```

### 2.3 项目结构

```
wx-security-demo/
├── app.js                 # 主应用入口
├── config/
│   └── index.js          # 配置文件
├── controllers/
│   ├── security.js       # 安全审核控制器
│   └── log.js            # 日志控制器
├── services/
│   ├── wxSecurity.js     # 微信安全服务
│   └── auditLog.js       # 审核日志服务
├── middlewares/
│   └── auth.js           # 认证中间件
├── utils/
│   └── signature.js      # 签名工具
├── uploads/              # 临时文件存储
└── logs/                 # 日志存储
```

### 2.4 配置文件 (config/index.js)

```javascript
module.exports = {
  // 微信小程序配置
  wx: {
    appId: 'wx8888888888888888',
    appSecret: 'your-app-secret',
  },
  
  // 服务器配置
  server: {
    port: 3000,
    uploadDir: './uploads',
  },
  
  // 审核配置
  audit: {
    // 审核场景 (1: 注册资料，2: 用户资料，3: 评论，4: 论坛，5: 社交日志等)
    scene: 3,
    // 是否开启异步审核
    asyncAudit: false,
  },
  
  // 日志配置
  log: {
    dir: './logs',
    maxFiles: 30,
  },
};
```

---

## 3. 核心 API 使用

### 3.1 获取 Access Token

```javascript
// services/wxSecurity.js
const axios = require('axios');
const config = require('../config');

class WxSecurityService {
  constructor() {
    this.appId = config.wx.appId;
    this.appSecret = config.wx.appSecret;
    this.accessToken = null;
    this.tokenExpiresAt = 0;
  }
  
  /**
   * 获取 Access Token
   * access_token 有效期 2 小时，需要缓存
   */
  async getAccessToken() {
    // 检查缓存的 token 是否有效
    if (this.accessToken && Date.now() < this.tokenExpiresAt) {
      return this.accessToken;
    }
    
    try {
      const url = 'https://api.weixin.qq.com/cgi-bin/token';
      const params = {
        grant_type: 'client_credential',
        appid: this.appId,
        secret: this.appSecret,
      };
      
      const response = await axios.get(url, { params });
      const { access_token, expires_in } = response.data;
      
      if (!access_token) {
        throw new Error(`获取 access_token 失败：${JSON.stringify(response.data)}`);
      }
      
      // 缓存 token，提前 5 分钟过期
      this.accessToken = access_token;
      this.tokenExpiresAt = Date.now() + (expires_in - 300) * 1000;
      
      console.log('Access Token 已更新');
      return access_token;
      
    } catch (error) {
      console.error('获取 Access Token 失败:', error.message);
      throw error;
    }
  }
}

module.exports = new WxSecurityService();
```

### 3.2 图片审核流程

```javascript
// services/wxSecurity.js (续)
const fs = require('fs');
const FormData = require('form-data');

class WxSecurityService {
  // ... 前面的代码 ...
  
  /**
   * 图片内容安全检测 (同步)
   * @param {string} imagePath - 本地图片路径
   * @param {string} openid - 用户 openid
   * @param {number} scene - 审核场景
   * @returns {Promise<Object>} 检测结果
   */
  async checkImage(imagePath, openid, scene = 3) {
    try {
      const accessToken = await this.getAccessToken();
      
      // 读取图片文件
      const fileBuffer = fs.readFileSync(imagePath);
      
      // 构建 FormData
      const form = new FormData();
      form.append('media', fileBuffer, {
        filename: 'image.jpg',
        contentType: 'image/jpeg',
      });
      form.append('openid', openid);
      form.append('scene', scene);
      
      // 调用微信 API
      const url = `https://api.weixin.qq.com/wxa/img_sec_check?access_token=${accessToken}`;
      const response = await axios.post(url, form, {
        headers: form.getHeaders(),
      });
      
      const result = response.data;
      
      // 记录审核日志
      await this.logAudit({
        type: 'IMAGE',
        openid,
        scene,
        imagePath,
        result: result.errcode,
        createTime: new Date(),
      });
      
      return {
        success: result.errcode === 0,
        code: result.errcode,
        message: result.errmsg,
      };
      
    } catch (error) {
      console.error('图片审核失败:', error.message);
      throw error;
    }
  }
  
  /**
   * 多媒体异步审核 (支持图片、音频、视频)
   * @param {string} mediaUrl - 媒体文件 URL
   * @param {string} mediaType - 媒体类型 (1: 图片，2: 视频，3: 语音)
   * @param {string} openid - 用户 openid
   * @returns {Promise<Object>} 检测结果 (包含 task_id)
   */
  async checkMediaAsync(mediaUrl, mediaType, openid) {
    try {
      const accessToken = await this.getAccessToken();
      
      const url = `https://api.weixin.qq.com/wxa/media_check_async?access_token=${accessToken}`;
      
      const data = {
        media_url: mediaUrl,
        media_type: mediaType,
        version: 2, // 2.0 版本
        openid: openid,
        scene: 3,
      };
      
      const response = await axios.post(url, data);
      const result = response.data;
      
      if (result.errcode !== 0) {
        throw new Error(result.errmsg);
      }
      
      // 记录异步审核任务
      await this.logAudit({
        type: 'MEDIA_ASYNC',
        openid,
        mediaType,
        mediaUrl,
        taskId: result.taskid,
        status: 'PENDING',
        createTime: new Date(),
      });
      
      return {
        success: true,
        taskId: result.taskid,
      };
      
    } catch (error) {
      console.error('异步媒体审核失败:', error.message);
      throw error;
    }
  }
  
  /**
   * 查询异步审核结果
   * @param {string} taskId - 任务 ID
   * @returns {Promise<Object>} 审核结果
   */
  async getAsyncAuditResult(taskId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const url = `https://api.weixin.qq.com/wxa/get_async_audit_result?access_token=${accessToken}`;
      
      const response = await axios.post(url, { taskid: taskId });
      const result = response.data;
      
      // 更新审核日志状态
      await this.updateAuditStatus(taskId, result);
      
      return {
        success: result.errcode === 0,
        result: result.result, // 0: 通过，1: 违规，2: 疑似违规
        label: result.label,   // 违规标签
        detail: result.detail, // 详细信息
      };
      
    } catch (error) {
      console.error('查询异步审核结果失败:', error.message);
      throw error;
    }
  }
  
  /**
   * 记录审核日志
   */
  async logAudit(data) {
    // 实现日志记录逻辑
    console.log('审核日志:', data);
  }
  
  /**
   * 更新审核状态
   */
  async updateAuditStatus(taskId, result) {
    // 实现状态更新逻辑
    console.log('更新审核状态:', taskId, result);
  }
}

module.exports = new WxSecurityService();
```

### 3.3 文本审核流程

```javascript
// services/wxSecurity.js (续)

class WxSecurityService {
  // ... 前面的代码 ...
  
  /**
   * 文本内容安全检测 (同步)
   * @param {string} content - 待检测文本
   * @param {string} openid - 用户 openid
   * @param {number} scene - 审核场景
   * @returns {Promise<Object>} 检测结果
   */
  async checkText(content, openid, scene = 3) {
    try {
      const accessToken = await this.getAccessToken();
      
      const url = `https://api.weixin.qq.com/wxa/msg_sec_check?access_token=${accessToken}`;
      
      const data = {
        content: content,
        openid: openid,
        scene: scene,
      };
      
      const response = await axios.post(url, data);
      const result = response.data;
      
      // 记录审核日志
      await this.logAudit({
        type: 'TEXT',
        openid,
        scene,
        content: content.substring(0, 500), // 只记录前 500 字
        result: result.errcode,
        createTime: new Date(),
      });
      
      return {
        success: result.errcode === 0,
        code: result.errcode,
        message: result.errmsg,
        // 详细结果 (v2.0)
        detail: result.detail,
      };
      
    } catch (error) {
      console.error('文本审核失败:', error.message);
      throw error;
    }
  }
  
  /**
   * 文本内容安全检测 (增强版，支持长文本)
   * @param {string} content - 待检测文本
   * @param {string} openid - 用户 openid
   * @returns {Promise<Object>} 检测结果
   */
  async checkTextSecurity(content, openid) {
    try {
      const accessToken = await this.getAccessToken();
      
      const url = `https://api.weixin.qq.com/wxa/text_security_check?access_token=${accessToken}`;
      
      const data = {
        content: content,
        openid: openid,
        scene: 3,
      };
      
      const response = await axios.post(url, data);
      const result = response.data;
      
      await this.logAudit({
        type: 'TEXT_SECURITY',
        openid,
        content: content.substring(0, 500),
        result: result.errcode,
        createTime: new Date(),
      });
      
      return {
        success: result.errcode === 0,
        code: result.errcode,
        message: result.errmsg,
        detail: result.detail,
      };
      
    } catch (error) {
      console.error('文本安全检测失败:', error.message);
      throw error;
    }
  }
  
  /**
   * 批量文本审核 (长文本分段检测)
   * @param {string} content - 长文本
   * @param {string} openid - 用户 openid
   * @param {number} chunkSize - 每段长度
   * @returns {Promise<Object>} 检测结果
   */
  async checkTextBatch(content, openid, chunkSize = 5000) {
    // 如果文本较短，直接检测
    if (content.length <= chunkSize) {
      return this.checkText(content, openid);
    }
    
    // 分段检测
    const chunks = this.splitText(content, chunkSize);
    
    for (const chunk of chunks) {
      const result = await this.checkText(chunk, openid);
      if (!result.success) {
        return result; // 一旦有违规，立即返回
      }
    }
    
    return {
      success: true,
      code: 0,
      message: '检测通过',
    };
  }
  
  /**
   * 文本分段
   */
  splitText(text, chunkSize) {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.substring(i, i + chunkSize));
    }
    return chunks;
  }
}

module.exports = new WxSecurityService();
```

---

## 4. 审核结果处理

### 4.1 结果码说明

| errcode | 说明 | 处理建议 |
|---------|------|---------|
| 0 | 检测通过 | 允许发布/显示 |
| 87014 | 内容含有违法违规内容 | 禁止发布，提示用户修改 |
| 87015 | 内容含有违法违规内容 (疑似) | 进入人工审核队列 |
| 40001 | 签名错误 | 检查签名算法 |
| 41001 | 缺少 access_token 参数 | 检查 token 获取 |
| 42001 | access_token 已过期 | 重新获取 token |
| 45009 | 接口调用频率超限 | 增加重试机制，降低调用频率 |

### 4.2 违规标签说明

| 标签 | 说明 |
|-----|------|
| porn | 色情 |
| politics | 政治 |
| terrorism | 恐怖主义 |
| contraband | 违禁品 |
| abuse | 谩骂 |
| ad | 广告 |
| custom | 自定义违规词 |

### 4.3 审核结果处理控制器

```javascript
// controllers/security.js
const express = require('express');
const router = express.Router();
const wxSecurityService = require('../services/wxSecurity');
const auditLogService = require('../services/auditLog');

/**
 * 图片上传并审核
 */
router.post('/upload-image', async (req, res) => {
  try {
    const { openid } = req.body;
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ code: 400, message: '请上传图片文件' });
    }
    
    if (!openid) {
      return res.status(400).json({ code: 400, message: '缺少 openid 参数' });
    }
    
    // 调用微信审核
    const result = await wxSecurityService.checkImage(file.path, openid);
    
    if (!result.success) {
      // 删除违规图片
      fs.unlinkSync(file.path);
      
      return res.json({
        code: 1,
        message: '图片内容违规，请重新上传',
        label: result.label,
      });
    }
    
    // 审核通过，返回图片 URL
    const imageUrl = `/uploads/${file.filename}`;
    
    res.json({
      code: 0,
      message: '上传成功',
      data: {
        url: imageUrl,
      },
    });
    
  } catch (error) {
    console.error('图片上传失败:', error);
    res.status(500).json({
      code: 500,
      message: '上传失败：' + error.message,
    });
  }
});

/**
 * 文本内容审核
 */
router.post('/check-text', async (req, res) => {
  try {
    const { content, openid } = req.body;
    
    if (!content) {
      return res.status(400).json({ code: 400, message: '缺少 content 参数' });
    }
    
    if (!openid) {
      return res.status(400).json({ code: 400, message: '缺少 openid 参数' });
    }
    
    // 调用微信审核
    const result = await wxSecurityService.checkText(content, openid);
    
    if (!result.success) {
      return res.json({
        code: 1,
        message: '内容包含敏感信息，请修改后重新提交',
        detail: result.detail,
      });
    }
    
    res.json({
      code: 0,
      message: '检测通过',
    });
    
  } catch (error) {
    console.error('文本审核失败:', error);
    res.status(500).json({
      code: 500,
      message: '审核失败：' + error.message,
    });
  }
});

/**
 * 查询异步审核结果
 */
router.post('/query-async-result', async (req, res) => {
  try {
    const { taskId } = req.body;
    
    if (!taskId) {
      return res.status(400).json({ code: 400, message: '缺少 taskId 参数' });
    }
    
    const result = await wxSecurityService.getAsyncAuditResult(taskId);
    
    res.json({
      code: 0,
      data: result,
    });
    
  } catch (error) {
    console.error('查询异步结果失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败：' + error.message,
    });
  }
});

/**
 * 获取审核日志
 */
router.get('/audit-logs', async (req, res) => {
  try {
    const { openid, type, startDate, endDate, page = 1, pageSize = 20 } = req.query;
    
    const logs = await auditLogService.getLogs({
      openid,
      type,
      startDate,
      endDate,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
    });
    
    res.json({
      code: 0,
      data: logs,
    });
    
  } catch (error) {
    console.error('获取日志失败:', error);
    res.status(500).json({
      code: 500,
      message: '获取失败：' + error.message,
    });
  }
});

module.exports = router;
```

---

## 5. 审核日志记录

### 5.1 日志服务

```javascript
// services/auditLog.js
const fs = require('fs');
const path = require('path');
const config = require('../config');

class AuditLogService {
  constructor() {
    this.logDir = config.log.dir;
    this.ensureLogDir();
  }
  
  ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }
  
  /**
   * 记录审核日志
   */
  async log(data) {
    const logFile = path.join(this.logDir, `audit-${this.getDate()}.log`);
    
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...data,
    };
    
    const logLine = JSON.stringify(logEntry) + '\n';
    
    fs.appendFileSync(logFile, logLine);
  }
  
  /**
   * 获取审核日志
   */
  async getLogs(filters) {
    const { openid, type, startDate, endDate, page, pageSize } = filters;
    
    // 读取日志文件
    const logFile = path.join(this.logDir, `audit-${this.getDate()}.log`);
    
    if (!fs.existsSync(logFile)) {
      return { list: [], total: 0 };
    }
    
    const content = fs.readFileSync(logFile, 'utf-8');
    const lines = content.trim().split('\n').filter(line => line);
    
    // 解析日志
    let logs = lines.map(line => JSON.parse(line));
    
    // 过滤
    if (openid) {
      logs = logs.filter(log => log.openid === openid);
    }
    if (type) {
      logs = logs.filter(log => log.type === type);
    }
    if (startDate) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(startDate));
    }
    if (endDate) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(endDate));
    }
    
    // 分页
    const total = logs.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const list = logs.slice(start, end).reverse(); // 最新的在前
    
    return { list, total };
  }
  
  getDate() {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }
}

module.exports = new AuditLogService();
```

### 5.2 日志数据结构

```javascript
// 审核日志数据结构示例
{
  "timestamp": "2026-04-04T12:00:00.000Z",
  "type": "IMAGE",           // 审核类型：IMAGE/TEXT/MEDIA_ASYNC
  "openid": "oXXXX...",      // 用户 openid
  "scene": 3,                // 审核场景
  "imagePath": "/uploads/xxx.jpg",  // 图片路径 (图片审核)
  "content": "待检测文本...",         // 文本内容 (文本审核)
  "mediaUrl": "https://...",  // 媒体 URL (异步审核)
  "taskId": "xxx",           // 异步任务 ID
  "result": 0,               // 审核结果：0=通过，1=违规，2=疑似
  "label": "porn",           // 违规标签
  "status": "APPROVED",      // 状态：APPROVED/REJECTED/PENDING
  "createTime": "2026-04-04T12:00:00.000Z"
}
```

---

## 6. 完整代码示例

### 6.1 主应用入口 (app.js)

```javascript
const express = require('express');
const multer = require('multer');
const path = require('path');
const config = require('./config');
const securityRouter = require('./controllers/security');

const app = express();

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 文件上传配置
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.server.uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|bmp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('只支持 jpg/png/bmp 格式的图片'));
    }
  },
});

// 路由
app.use('/uploads', express.static(config.server.uploadDir));
app.use('/api/security', upload.single('file'), securityRouter);

// 启动服务器
app.listen(config.server.port, () => {
  console.log(`服务器启动在 http://localhost:${config.server.port}`);
});
```

### 6.2 小程序端调用示例

```javascript
// pages/publish/publish.js
Page({
  data: {
    content: '',
    images: [],
    submitting: false,
  },
  
  // 输入内容
  onContentInput(e) {
    this.setData({ content: e.detail.value });
  },
  
  // 选择图片
  chooseImage() {
    wx.chooseMedia({
      count: 9,
      mediaType: ['image'],
      success: (res) => {
        const images = res.tempFiles.map(file => file.tempFilePath);
        this.setData({ images: [...this.data.images, ...images] });
      },
    });
  },
  
  // 提交内容
  async submit() {
    const { content, images, submitting } = this.data;
    
    if (submitting) return;
    if (!content && images.length === 0) {
      wx.showToast({ title: '请输入内容或上传图片', icon: 'none' });
      return;
    }
    
    this.setData({ submitting: true });
    
    try {
      // 1. 审核文本
      if (content) {
        const textResult = await this.checkText(content);
        if (!textResult.success) {
          wx.showToast({ title: '内容包含敏感信息', icon: 'none' });
          this.setData({ submitting: false });
          return;
        }
      }
      
      // 2. 审核图片
      const uploadedImages = [];
      for (const imagePath of images) {
        const imageResult = await this.uploadImage(imagePath);
        if (!imageResult.success) {
          wx.showToast({ title: '图片内容违规', icon: 'none' });
          this.setData({ submitting: false });
          return;
        }
        uploadedImages.push(imageResult.url);
      }
      
      // 3. 发布内容
      await this.publishContent(content, uploadedImages);
      
      wx.showToast({ title: '发布成功', icon: 'success' });
      wx.navigateBack();
      
    } catch (error) {
      console.error('发布失败:', error);
      wx.showToast({ title: '发布失败，请稍后重试', icon: 'none' });
    } finally {
      this.setData({ submitting: false });
    }
  },
  
  // 审核文本
  checkText(content) {
    return wx.cloud.callFunction({
      name: 'security',
      data: {
        action: 'checkText',
        content: content,
      },
    }).then(res => res.result);
  },
  
  // 上传图片并审核
  uploadImage(imagePath) {
    return wx.cloud.callFunction({
      name: 'security',
      data: {
        action: 'uploadImage',
        filePath: imagePath,
      },
    }).then(res => res.result);
  },
  
  // 发布内容
  publishContent(content, images) {
    return wx.request({
      url: 'https://yourdomain.com/api/content/publish',
      method: 'POST',
      data: {
        content,
        images,
      },
    });
  },
});
```

---

## 7. 踩坑记录

### 7.1 常见问题及解决方案

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| invalid access_token | token 过期 | access_token 有效期 2 小时，需要缓存并及时刷新 |
| media size over limit | 文件过大 | 图片不超过 5MB，视频不超过 100MB |
| invalid media format | 格式不支持 | 图片支持 jpg/png/bmp，视频支持 mp4 |
| frequency limit exceeded | 调用频率超限 | 增加重试机制，使用指数退避 |
| empty content | 内容为空 | 检查请求参数，确保 content 不为空 |
| openid 无效 | openid 获取错误 | 确保用户已登录，openid 从正确渠道获取 |

### 7.2 性能优化建议

1. **Access Token 缓存**: 使用 Redis 缓存，多进程共享
2. **异步审核**: 大文件使用异步审核，避免阻塞
3. **批量处理**: 多个内容可批量审核
4. **本地缓存**: 已审核通过的内容可缓存结果
5. **降级策略**: API 不可用时，可临时切换到本地敏感词过滤

---

## 8. 清如项目复用建议

### 8.1 推荐复用模块

1. **图片审核服务**: 用户头像、发布图片必须审核
2. **文本审核服务**: 评论、动态、聊天消息需要审核
3. **审核日志**: 记录所有审核操作，便于追溯
4. **异步审核**: 视频、音频等大文件使用异步审核

### 8.2 集成步骤

1. 复制 security-demo 项目到清如后端
2. 修改 config/index.js 配置清如的小程序 AppID/Secret
3. 将审核服务集成到内容发布流程
4. 配置定时任务查询异步审核结果
5. 添加审核日志查看功能

### 8.3 注意事项

- 内容安全 API 有调用频率限制，建议增加限流机制
- 审核结果需要人工复核机制，特别是"疑似"违规内容
- 建议设置审核超时时间，避免用户长时间等待
- 生产环境需要配置 HTTPS，确保传输安全

---

## 参考资源

- **官方文档**: https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/sec-check/security.html
- **API 频率限制**: https://developers.weixin.qq.com/miniprogram/dev/framework/operation.html
- **违规词库**: 可在微信后台自定义添加

---

*笔记创建时间：2026-04-04*
