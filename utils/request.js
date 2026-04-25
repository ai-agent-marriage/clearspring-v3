/**
 * 清如 ClearSpring - 网络请求封装
 * 基于 V4.0 规范：统一错误处理、Token 注入、限流、CSRF 防护、请求签名
 * @module utils/request
 * @version 1.4.0
 * @update 2026-04-15: 添加 GET 请求缓存支持，优化重复请求性能
 */

import config from '../config/index.js'
import { generateSignature, isTimestampValid } from './security.js'
import constants from '../config/constants.js'

const BASE_URL = config.apiBase

// 使用常量替换魔法数字
const {
  RATE_LIMIT_REQUESTS,
  RATE_LIMIT_WINDOW,
  UPLOAD_RATE_LIMIT,
  UPLOAD_RATE_LIMIT_WINDOW,
  CSRF_TOKEN_EXPIRY,
  REQUEST_TIMEOUT,
  MAX_ERROR_LOGS
} = constants

// ========== GET 请求缓存配置 ==========
const GET_CACHE_CONFIG = {
  // 默认缓存时间（毫秒）
  DEFAULT_EXPIRE: 300000, // 5 分钟
  
  // 缓存前缀
  PREFIX: 'request_cache_',
  
  // 需要缓存的 URL 模式
  CACHE_PATTERNS: [
    '/order/list',
    '/volunteer/list',
    '/species/list',
    '/config',
    '/user/profile',
    '/income/list',
    '/message/list'
  ],
  
  // 不缓存的 URL 模式
  EXCLUDE_PATTERNS: [
    '/login',
    '/logout',
    '/order/create',
    '/order/update',
    '/order/delete',
    '/upload',
    '/pay'
  ]
};

// 内存缓存（Map 结构）
const requestCache = new Map();

// 缓存清理定时器
let cacheCleanupTimer = null;

/**
 * 初始化请求缓存
 */
function initRequestCache() {
  if (cacheCleanupTimer) {
    clearInterval(cacheCleanupTimer);
  }
  
  // 每 2 分钟清理一次过期缓存
  cacheCleanupTimer = setInterval(() => {
    cleanupExpiredCache();
  }, 120000);
  
  // [CLEANED] console.log('[Request] 请求缓存已初始化');
}

// 初始化缓存
initRequestCache();

/**
 * 生成缓存 Key
 * @param {string} url - 请求 URL
 * @param {object} data - 请求参数
 * @param {string} method - 请求方法
 * @returns {string} 缓存 Key
 */
function generateCacheKey(url, data, method) {
  const dataStr = JSON.stringify(data || {});
  return `${GET_CACHE_CONFIG.PREFIX}${method}:${url}?${dataStr}`;
}

/**
 * 检查 URL 是否应该缓存
 * @param {string} url - 请求 URL
 * @param {string} method - 请求方法
 * @returns {boolean} 是否应该缓存
 */
function shouldCache(url, method) {
  // 只缓存 GET 请求
  if (method !== 'GET') {
    return false;
  }
  
  // 检查排除模式
  for (const pattern of GET_CACHE_CONFIG.EXCLUDE_PATTERNS) {
    if (url.includes(pattern)) {
      return false;
    }
  }
  
  // 检查包含模式（如果定义了模式列表）
  if (GET_CACHE_CONFIG.CACHE_PATTERNS.length > 0) {
    for (const pattern of GET_CACHE_CONFIG.CACHE_PATTERNS) {
      if (url.includes(pattern)) {
        return true;
      }
    }
    // 如果定义了模式列表但 URL 不匹配任何模式，则不缓存
    return false;
  }
  
  // 默认缓存所有 GET 请求
  return true;
}

/**
 * 获取缓存
 * @param {string} key - 缓存 Key
 * @returns {any|null} 缓存值，不存在或已过期返回 null
 */
function getCache(key) {
  const cached = requestCache.get(key);
  
  if (!cached) {
    return null;
  }
  
  // 检查是否过期
  if (cached.expire && Date.now() > cached.expire) {
    requestCache.delete(key);
    return null;
  }
  
  // 更新访问时间
  cached.accessTime = Date.now();
  requestCache.set(key, cached);
  
  return cached.data;
}

/**
 * 设置缓存
 * @param {string} key - 缓存 Key
 * @param {any} data - 缓存数据
 * @param {number} expire - 过期时间（毫秒）
 */
function setCache(key, data, expire) {
  const now = Date.now();
  
  requestCache.set(key, {
    data: data,
    createTime: now,
    expire: expire > 0 ? now + expire : null,
    accessTime: now
  });
  
  // 限制缓存大小（最多 500 条）
  if (requestCache.size > 500) {
    evictOldestCache();
  }
}

/**
 * 清理过期缓存
 */
function cleanupExpiredCache() {
  const now = Date.now();
  let count = 0;
  
  requestCache.forEach((cached, key) => {
    if (cached.expire && now > cached.expire) {
      requestCache.delete(key);
      count++;
    }
  });
  
  if (count > 0) {
    // [CLEANED] console.log(`[Request] 清理了 ${count} 条过期缓存`);
  }
}

/**
 * 逐出最久未使用的缓存
 */
function evictOldestCache() {
  let oldestKey = null;
  let oldestTime = Infinity;
  
  requestCache.forEach((cached, key) => {
    if (cached.accessTime < oldestTime) {
      oldestTime = cached.accessTime;
      oldestKey = key;
    }
  });
  
  if (oldestKey) {
    requestCache.delete(oldestKey);
  }
}

/**
 * 清除指定 URL 的缓存
 * @param {string} url - URL 或 URL 模式
 */
function clearCacheByUrl(url) {
  const keysToDelete = [];
  
  requestCache.forEach((cached, key) => {
    if (key.includes(url)) {
      keysToDelete.push(key);
    }
  });
  
  keysToDelete.forEach(key => requestCache.delete(key));
  
  // [CLEANED] console.log(`[Request] 清除了 ${keysToDelete.length} 条缓存`);
}

/**
 * 生成 CSRF Token
 * 使用时间戳 + 随机数 + 用户标识的组合
 */
function generateCSRFToken() {
  const userInfo = wx.getStorageSync('userInfo')
  const timestamp = Date.now()
  const random = Math.random().toString(36).substr(2, 16)
  const userId = userInfo?.openid || 'anonymous'
  
  // 生成 token 并存储
  const token = btoa(`${userId}:${timestamp}:${random}`)
  wx.setStorageSync('csrfToken', token)
  wx.setStorageSync('csrfTokenTime', timestamp)
  
  return token
}

/**
 * 获取或生成 CSRF Token
 * Token 有效期为 1 小时，过期后重新生成
 * @returns {string} CSRF Token
 */
function getCSRFToken() {
  const token = wx.getStorageSync('csrfToken')
  const tokenTime = wx.getStorageSync('csrfTokenTime')
  const now = Date.now()
  
  // Token 有效期 1 小时
  if (!token || !tokenTime || (now - tokenTime) > CSRF_TOKEN_EXPIRY) {
    return generateCSRFToken()
  }
  
  return token
}

// 初始化时生成 CSRF Token
getCSRFToken()

// 错误码映射表
const ERROR_CODES = {
  // 通用错误
  1000: '系统繁忙，请稍后重试',
  1001: '订单不存在',
  1002: '需要资质认证',
  1003: '抢单失败，已被他人抢占',
  1004: '网络异常，请检查网络连接',
  1005: '请求超时',
  
  // 认证错误
  2001: '登录已过期，请重新登录',
  2002: '权限不足',
  2003: 'Token 无效',
  
  // 业务错误
  3001: '余额不足',
  3002: '订单状态异常',
  3003: '超出操作限制',
  3004: '参数错误',
  
  // 限流错误
  429: '操作过于频繁，请稍后再试'
}

// 请求限流（简单实现）
const rateLimit = {
  requests: {},
  
  /**
   * 检查请求频率限制
   * @param {string} userId - 用户 ID
   * @param {string} action - 操作类型
   * @param {number} limit - 最大请求数，默认使用常量
   * @param {number} window - 时间窗口（毫秒），默认使用常量
   * @returns {boolean} 是否允许请求
   */
  check(userId, action, limit = RATE_LIMIT_REQUESTS, window = RATE_LIMIT_WINDOW) {
    const key = `${userId}:${action}`
    const now = Date.now()
    
    if (!this.requests[key]) {
      this.requests[key] = []
    }
    
    // 清理过期记录
    this.requests[key] = this.requests[key].filter(time => now - time < window)
    
    if (this.requests[key].length >= limit) {
      return false
    }
    
    this.requests[key].push(now)
    return true
  }
}

// 图片上传限流（更严格的限制）
const uploadRateLimit = {
  uploads: {},
  
  /**
   * 检查上传频率限制
   * @param {string} userId - 用户 ID
   * @param {number} limit - 每分钟最大上传次数，默认使用常量
   * @param {number} window - 时间窗口（毫秒），默认使用常量
   * @returns {boolean} 是否允许上传
   */
  check(userId, limit = UPLOAD_RATE_LIMIT, window = UPLOAD_RATE_LIMIT_WINDOW) {
    const now = Date.now()
    
    if (!this.uploads[userId]) {
      this.uploads[userId] = []
    }
    
    // 清理过期记录
    this.uploads[userId] = this.uploads[userId].filter(time => now - time < window)
    
    if (this.uploads[userId].length >= limit) {
      console.warn(`[上传限流] 用户 ${userId} 上传过于频繁`)
      return false
    }
    
    this.uploads[userId].push(now)
    return true
  },
  
  /**
   * 获取用户剩余上传次数
   * @param {string} userId - 用户 ID
   * @param {number} limit - 每分钟最大上传次数，默认使用常量
   * @param {number} window - 时间窗口（毫秒），默认使用常量
   * @returns {number} 剩余次数
   */
  getRemaining(userId, limit = UPLOAD_RATE_LIMIT, window = UPLOAD_RATE_LIMIT_WINDOW) {
    const now = Date.now()
    if (!this.uploads[userId]) {
      return limit
    }
    const recentUploads = this.uploads[userId].filter(time => now - time < window)
    return Math.max(0, limit - recentUploads.length)
  }
}

/**
 * 统一网络请求
 * 支持请求签名、CSRF 防护、限流、错误处理
 * @param {Object} options - 请求配置
 * @param {string} options.url - 请求 URL
 * @param {string} options.method - 请求方法
 * @param {Object} options.data - 请求数据
 * @param {boolean} options.loading - 是否显示 loading
 * @param {string} options.loadingText - loading 文字
 * @param {number} options.timeout - 超时时间（毫秒）
 * @param {boolean} options.needSign - 是否需要请求签名（默认 true）
 * @returns {Promise} 请求结果
 */
function request(options) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    const method = options.method || 'GET'
    
    // ========== 缓存检查（仅 GET 请求）==========
    if (shouldCache(options.url, method)) {
      const cacheKey = generateCacheKey(options.url, options.data, method);
      const cachedData = getCache(cacheKey);
      
      if (cachedData !== null) {
        // [CLEANED] console.log(`[Request] 缓存命中：${options.url}`);
        // 缓存命中，直接返回（不显示 loading）
        resolve(cachedData);
        return;
      }
    }
    
    // 限流检查
    if (userInfo && userInfo.openid) {
      const action = options.url.split('?')[0]
      if (!rateLimit.check(userInfo.openid, action)) {
        wx.showToast({
          title: ERROR_CODES[CODE_RATE_LIMIT],
          icon: 'none'
        })
        reject({ errorCode: CODE_RATE_LIMIT, message: ERROR_CODES[CODE_RATE_LIMIT] })
        return
      }
    }
    
    // 显示全局 loading
    if (options.loading !== false) {
      wx.showLoading({
        title: options.loadingText || '加载中...',
        mask: true
      })
    }
    
    // 生成请求签名（防止请求篡改）
    const timestamp = Date.now().toString()
    const nonce = Math.random().toString(36).substr(2, 16)
    const requestData = options.data || {}
    const signature = options.needSign !== false ? generateSignature(requestData, timestamp, nonce) : ''
    
    wx.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        'X-User-Id': userInfo?.openid || '',
        'X-Request-Id': generateRequestId(),
        'X-CSRF-Token': getCSRFToken(),
        'X-Request-Source': 'miniprogram',
        'X-Timestamp': timestamp,
        'X-Nonce': nonce,
        'X-Signature': signature
      },
      timeout: options.timeout || REQUEST_TIMEOUT,
      
      success: (res) => {
        hideLoading()
        
        // HTTP 状态码处理
        if (res.statusCode >= 500) {
          handleError({ errorCode: 1000, message: '服务器错误' })
          reject({ errorCode: 1000, message: '服务器错误' })
          return
        }
        
        if (res.statusCode === 401) {
          // Token 过期，跳转登录
          wx.removeStorageSync('token')
          wx.removeStorageSync('userInfo')
          wx.navigateTo({ url: '/pages/login/login' })
          handleError({ errorCode: 2001, message: ERROR_CODES[2001] })
          reject({ errorCode: 2001, message: ERROR_CODES[2001] })
          return
        }
        
        if (res.statusCode === 429) {
          handleError({ errorCode: 429, message: ERROR_CODES[429] })
          reject({ errorCode: 429, message: ERROR_CODES[429] })
          return
        }
        
        // 业务错误处理
        const data = res.data
        if (data && data.errorCode && data.errorCode !== 0) {
          const message = ERROR_CODES[data.errorCode] || data.message || '请求失败'
          handleError({ errorCode: data.errorCode, message })
          reject({ errorCode: data.errorCode, message })
          return
        }
        
        // 成功响应
        // 保存到缓存（如果是 GET 请求且应该缓存）
        if (shouldCache(options.url, method)) {
          const cacheKey = generateCacheKey(options.url, options.data, method);
          const cacheExpire = options.cacheExpire || GET_CACHE_CONFIG.DEFAULT_EXPIRE;
          setCache(cacheKey, data, cacheExpire);
          // [CLEANED] console.log(`[Request] 已缓存：${options.url}`);
        }
        
        resolve(data)
      },
      
      fail: (err) => {
        hideLoading()
        console.error('[请求失败]', err)
        
        let message = ERROR_CODES[1004]
        if (err.errMsg.includes('timeout')) {
          message = ERROR_CODES[1005]
        }
        
        handleError({ errorCode: 1004, message })
        reject({ errorCode: 1004, message })
      }
    })
  })
}

/**
 * 隐藏 loading
 */
function hideLoading() {
  wx.hideLoading({
    success: () => {}
  })
}

/**
 * 统一错误处理
 * @param {Object} error - 错误信息
 */
function handleError(error) {
  console.error('[业务错误]', error)
  
  // 记录错误日志（可接入监控系统）
  logError(error)
  
  // 非用户主动操作才显示错误提示
  if (!error.silent) {
    wx.showToast({
      title: error.message || '操作失败',
      icon: 'none',
      duration: 2000
    })
  }
}

/**
 * 错误日志记录
 * @param {Object} error - 错误信息
 */
function logError(error) {
  const userInfo = wx.getStorageSync('userInfo')
  const logs = wx.getStorageSync('errorLogs') || []
  
  logs.push({
    timestamp: Date.now(),
    errorCode: error.errorCode,
    message: error.message,
    page: getCurrentPage(),
    userId: userInfo?.openid || 'anonymous',
    userAgent: wx.getSystemInfoSync().model
  })
  
  // 只保留最近 MAX_ERROR_LOGS 条
  if (logs.length > MAX_ERROR_LOGS) {
    logs.splice(0, logs.length - MAX_ERROR_LOGS)
  }
  
  wx.setStorageSync('errorLogs', logs)
  
  // TODO: 上报到服务端日志系统
  // request({ url: '/log/error', method: 'POST', data: error, loading: false })
}

/**
 * 获取当前页面
 */
function getCurrentPage() {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1]
  return currentPage ? currentPage.route : 'unknown'
}

/**
 * 生成请求 ID
 */
function generateRequestId() {
  return 'req_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * GET 请求快捷方法
 */
function get(url, data = {}, options = {}) {
  return request({ url, method: 'GET', data, ...options })
}

/**
 * POST 请求快捷方法
 */
function post(url, data = {}, options = {}) {
  return request({ url, method: 'POST', data, ...options })
}

/**
 * 文件上传（支持断点续传，带限流防护）
 * @param {Object} options - 上传配置
 * @param {string} options.url - 上传 URL
 * @param {string} options.filePath - 文件路径
 * @param {string} options.name - 文件名，默认 'file'
 * @param {Object} options.formData - 表单数据
 * @param {Function} options.onProgress - 进度回调
 * @returns {Promise} 上传结果
 */
function uploadFile(options) {
  const { url, filePath, name = 'file', formData = {}, onProgress } = options
  
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    
    // 【安全增强】获取文件信息并验证
    wx.getFileInfo({
      filePath,
      success: (fileInfo) => {
        // 验证文件大小（使用 constants 中的 MAX_IMAGE_SIZE）
        if (fileInfo.size > MAX_IMAGE_SIZE) {
          const sizeMB = (fileInfo.size / 1024 / 1024).toFixed(2)
          wx.showModal({
            title: '文件过大',
            content: `文件大小不能超过 10MB，当前大小为 ${sizeMB}MB`,
            showCancel: false
          })
          reject({ 
            errorCode: 'FILE_TOO_LARGE', 
            message: `文件大小超限：${sizeMB}MB`
          })
          return
        }
        
        // 验证文件格式（图片格式白名单）
        const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp']
        const fileExt = filePath.split('.').pop().toLowerCase()
        if (!allowedExtensions.includes(fileExt)) {
          wx.showModal({
            title: '格式不支持',
            content: '仅支持 JPG、PNG、GIF、WebP 格式的图片',
            showCancel: false
          })
          reject({ 
            errorCode: 'UNSUPPORTED_FORMAT', 
            message: '文件格式不支持'
          })
          return
        }
        
        // 验证通过，开始上传
        startUpload()
      },
      fail: (err) => {
        console.error('[获取文件信息失败]', err)
        // 无法获取文件信息时，尝试直接上传（兼容旧版本）
        startUpload()
      }
    })
    
    function startUpload() {
      // 上传限流检查（防止恶意上传）
      if (userInfo && userInfo.openid) {
        if (!uploadRateLimit.check(userInfo.openid)) {
          wx.showToast({
            title: '上传过于频繁，请稍后再试',
            icon: 'none'
          })
          reject({ 
            errorCode: CODE_RATE_LIMIT, 
            message: '上传过于频繁，请稍后再试',
            remaining: 0
          })
          return
        }
      }
      
      wx.showLoading({
        title: '上传中...',
        mask: true
      })
      
      const uploadTask = wx.uploadFile({
        url: BASE_URL + url,
        filePath,
        name,
        formData,
        header: {
          'Authorization': token ? `Bearer ${token}` : '',
          'X-User-Id': userInfo?.openid || '',
          'X-Request-Id': generateRequestId(),
          'X-CSRF-Token': getCSRFToken()
        },
        
        success: (res) => {
          wx.hideLoading()
          try {
            const data = JSON.parse(res.data)
            if (data.errorCode && data.errorCode !== 0) {
              handleError({ errorCode: data.errorCode, message: data.message })
              reject(data)
            } else {
              resolve(data)
            }
          } catch (e) {
            reject({ message: '解析响应失败' })
          }
        },
        
        fail: (err) => {
          wx.hideLoading()
          
          // 【安全增强】上传失败处理
          wx.showModal({
            title: '上传失败',
            content: err.errMsg || '文件上传失败，请检查网络连接后重试',
            showCancel: false
          })
          
          handleError({ errorCode: 1004, message: '上传失败' })
          reject(err)
        }
      })
      
      // 监听上传进度
      if (onProgress && uploadTask.onProgressUpdate) {
        uploadTask.onProgressUpdate((progressEvent) => {
          onProgress(progressEvent.progress)
        })
      }
    }
  })
}

/**
 * 下载文件
 */
function downloadFile(url, options = {}) {
  return new Promise((resolve, reject) => {
    const token = wx.getStorageSync('token')
    
    wx.showLoading({
      title: '下载中...',
      mask: true
    })
    
    wx.downloadFile({
      url: BASE_URL + url,
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      
      success: (res) => {
        wx.hideLoading()
        if (res.statusCode === 200) {
          resolve(res.tempFilePath)
        } else {
          reject({ message: '下载失败' })
        }
      },
      
      fail: (err) => {
        wx.hideLoading()
        reject(err)
      }
    })
  })
}

export default {
  request,
  get,
  post,
  uploadFile,
  downloadFile,
  handleError,
  logError,
  // CSRF 防护相关
  generateCSRFToken,
  getCSRFToken,
  // 上传限流相关
  uploadRateLimit,
  // 缓存相关
  clearCacheByUrl,
  getCacheStats: () => ({
    size: requestCache.size,
    keys: Array.from(requestCache.keys())
  })
}
