/**
 * 内容安全审核工具类
 * 集成微信小程序内容安全 API + XSS 防护 + 请求签名
 * 提供内容过滤、输入验证、请求签名等功能
 * @module utils/security
 * @version 1.2.0
 * @author ClearSpring Team
 */

import config from '../config/index.js'
import constants from '../config/constants.js'

const { SIGNATURE_EXPIRY } = constants

/**
 * 生成请求签名
 * 使用简化哈希算法，防止请求篡改
 * 注意：生产环境建议使用服务端签名或更安全的 crypto 库
 * @param {Object} params - 请求参数对象
 * @param {string} timestamp - 时间戳（毫秒）
 * @param {string} nonce - 随机字符串
 * @returns {string} 签名值（hex 格式）
 */
export function generateSignature(params, timestamp, nonce) {
  // 1. 参数排序（确保签名一致性）
  const sortedKeys = Object.keys(params).sort();
  
  // 2. 拼接参数字符串
  const queryString = sortedKeys.map(key => {
    const value = params[key];
    // 跳过空值和签名本身
    if (value === '' || value === null || value === undefined || key === 'sign') {
      return '';
    }
    return `${key}=${value}`;
  }).filter(Boolean).join('&');
  
  // 3. 拼接签名原文：参数 + 时间戳 + 随机数 + 密钥
  const signSecret = config.security.signSecret || 'clearspring_default_secret_2026';
  const signString = `${queryString}&timestamp=${timestamp}&nonce=${nonce}&secret=${signSecret}`;
  
  // 4. 计算哈希值（简化实现）
  return simpleHash(signString);
}

/**
 * 简单哈希函数（小程序端简化实现）
 * 生产环境建议使用服务端签名或更安全的 crypto 库
 * @param {string} str - 待哈希字符串
 * @returns {string} 哈希值（8 位 16 进制）
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  // 转为 16 进制
  return Math.abs(hash).toString(16).padStart(8, '0');
}

/**
 * 验证请求签名
 * @param {Object} params - 请求参数
 * @param {string} timestamp - 时间戳
 * @param {string} nonce - 随机数
 * @param {string} signature - 待验证的签名
 * @returns {boolean} 验证结果
 */
export function verifySignature(params, timestamp, nonce, signature) {
  const expectedSign = generateSignature(params, timestamp, nonce);
  return expectedSign === signature;
}

/**
 * 检查时间戳是否过期（防重放攻击）
 * @param {string} timestamp - 请求时间戳
 * @param {number} validityMs - 有效期（毫秒），默认使用常量
 * @returns {boolean} 是否有效
 */
export function isTimestampValid(timestamp, validityMs = SIGNATURE_EXPIRY) {
  const now = Date.now();
  const requestTime = parseInt(timestamp, 10);
  return Math.abs(now - requestTime) < validityMs;
}

/**
 * XSS 过滤 - 清理 HTML 特殊字符
 * @param {string} str - 待过滤字符串
 * @returns {string} - 过滤后的字符串
 */
export function sanitizeHTML(str) {
  if (typeof str !== 'string') {
    return str;
  }
  
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };
  
  return str.replace(/[&<>"'/`=]/g, (char) => htmlEntities[char]);
}

/**
 * XSS 过滤 - 清理脚本标签
 * @param {string} str - 待过滤字符串
 * @returns {string} - 过滤后的字符串
 */
export function removeScriptTags(str) {
  if (typeof str !== 'string') {
    return str;
  }
  
  // 移除 script 标签及其内容
  str = str.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // 移除 javascript: 协议
  str = str.replace(/javascript:/gi, '');
  
  // 移除 on 开头的事件处理器
  str = str.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  
  return str;
}

/**
 * 综合 XSS 过滤
 * @param {string} str - 待过滤字符串
 * @returns {string} - 过滤后的字符串
 */
export function sanitize(str) {
  if (!config.security.enableXSSFilter) {
    return str;
  }
  
  if (typeof str !== 'string') {
    return str;
  }
  
  // 先移除危险标签和协议
  let result = removeScriptTags(str);
  // 再转义 HTML 实体
  result = sanitizeHTML(result);
  
  return result;
}

/**
 * 输入验证 - 验证字符串
 * @param {string} input - 输入值
 * @param {object} options - 验证选项
 * @param {number} options.minLength - 最小长度
 * @param {number} options.maxLength - 最大长度
 * @param {RegExp} options.pattern - 正则表达式
 * @returns {object} - 验证结果 {valid: boolean, message: string}
 */
export function validateString(input, options = {}) {
  const { minLength = 0, maxLength = 1000, pattern = null } = options;
  
  if (typeof input !== 'string') {
    return { valid: false, message: '输入必须是字符串' };
  }
  
  if (input.length < minLength) {
    return { valid: false, message: `输入长度不能小于${minLength}` };
  }
  
  if (input.length > maxLength) {
    return { valid: false, message: `输入长度不能超过${maxLength}` };
  }
  
  if (pattern && !pattern.test(input)) {
    return { valid: false, message: '输入格式不正确' };
  }
  
  return { valid: true, message: '验证通过' };
}

/**
 * 输入验证 - 验证数字
 * @param {number} input - 输入值
 * @param {object} options - 验证选项
 * @param {number} options.min - 最小值
 * @param {number} options.max - 最大值
 * @returns {object} - 验证结果
 */
export function validateNumber(input, options = {}) {
  const { min = -Infinity, max = Infinity } = options;
  
  if (typeof input !== 'number' || isNaN(input)) {
    return { valid: false, message: '输入必须是数字' };
  }
  
  if (input < min) {
    return { valid: false, message: `数值不能小于${min}` };
  }
  
  if (input > max) {
    return { valid: false, message: `数值不能大于${max}` };
  }
  
  return { valid: true, message: '验证通过' };
}

/**
 * 输入验证 - 验证手机号
 * @param {string} phone - 手机号
 * @returns {object} - 验证结果
 */
export function validatePhone(phone) {
  return validateString(phone, {
    minLength: 11,
    maxLength: 11,
    pattern: /^1[3-9]\d{9}$/
  });
}

/**
 * 输入验证 - 验证邮箱
 * @param {string} email - 邮箱地址
 * @returns {object} - 验证结果
 */
export function validateEmail(email) {
  return validateString(email, {
    maxLength: 255,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  });
}

/**
 * 输入验证 - 验证 URL
 * @param {string} url - URL 地址
 * @returns {object} - 验证结果
 */
export function validateURL(url) {
  return validateString(url, {
    maxLength: 2048,
    pattern: /^https?:\/\/.+/
  });
}

/**
 * 图片内容安全审核
 * @param {string} filePath - 图片文件路径
 * @returns {Promise<boolean>} - 审核是否通过
 */
export function checkImage(filePath) {
  return new Promise((resolve, reject) => {
    wx.security.imgSecCheck({
      mediaType: 1, // 1: 图片
      image: filePath,
      success: () => {
        // [CLEANED] console.log('图片审核通过:', filePath);
        resolve(true);
      },
      fail: (err) => {
        console.error('图片审核失败:', err);
        wx.showToast({
          title: '图片包含违规内容',
          icon: 'none',
          duration: 2000
        });
        resolve(false);
      }
    });
  });
}

/**
 * 文本内容安全审核
 * @param {string} content - 待审核文本内容
 * @returns {Promise<boolean>} - 审核是否通过
 */
export function checkText(content) {
  return new Promise((resolve, reject) => {
    wx.security.msgSecCheck({
      content: content,
      success: () => {
        // [CLEANED] console.log('文本审核通过');
        resolve(true);
      },
      fail: (err) => {
        console.error('文本审核失败:', err);
        wx.showToast({
          title: '文本包含违规内容',
          icon: 'none',
          duration: 2000
        });
        resolve(false);
      }
    });
  });
}

/**
 * 批量图片审核
 * @param {string[]} filePaths - 图片文件路径数组
 * @returns {Promise<boolean>} - 是否全部通过
 */
export async function checkImagesBatch(filePaths) {
  for (const filePath of filePaths) {
    const pass = await checkImage(filePath);
    if (!pass) {
      return false;
    }
  }
  return true;
}

/**
 * 表单内容综合审核
 * @param {Object} formData - 表单数据
 * @returns {Promise<Object>} - 审核结果
 */
export async function checkFormData(formData) {
  const result = {
    pass: true,
    errors: []
  };

  // 审核文本内容
  if (formData.wish) {
    const textPass = await checkText(formData.wish);
    if (!textPass) {
      result.pass = false;
      result.errors.push('心愿内容包含违规信息');
    }
  }

  // 审核图片
  if (formData.images && formData.images.length > 0) {
    const imagesPass = await checkImagesBatch(formData.images);
    if (!imagesPass) {
      result.pass = false;
      result.errors.push('图片包含违规内容');
    }
  }

  return result;
}
