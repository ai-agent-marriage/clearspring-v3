/**
 * 安全工具模块
 * 提供 XSS/CSRF 防护、输入验证等安全功能
 */

import DOMPurify from 'dompurify'

/**
 * XSS 防护：转义用户输入
 * @param {string} input - 用户输入
 * @returns {string} 转义后的字符串
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return input
  }
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [], // 不允许任何 HTML 标签
    ALLOWED_ATTR: []  // 不允许任何属性
  })
}

/**
 * XSS 防护：转义对象中的所有字符串字段
 * @param {Object|Array} data - 数据对象或数组
 * @returns {Object|Array} 转义后的数据
 */
export function sanitizeObject(data) {
  if (Array.isArray(data)) {
    return data.map(item => sanitizeObject(item))
  }
  if (typeof data === 'object' && data !== null) {
    const sanitized = {}
    for (const key in data) {
      if (typeof data[key] === 'string') {
        sanitized[key] = sanitizeInput(data[key])
      } else if (typeof data[key] === 'object' && data[key] !== null) {
        sanitized[key] = sanitizeObject(data[key])
      } else {
        sanitized[key] = data[key]
      }
    }
    return sanitized
  }
  return data
}

/**
 * 获取 CSRF Token
 * @returns {string|null} CSRF Token
 */
export function getCsrfToken() {
  // 从 Cookie 获取
  const csrfCookie = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
  
  if (csrfCookie) {
    return decodeURIComponent(csrfCookie)
  }
  
  // 从 localStorage 获取
  return localStorage.getItem('csrf_token')
}

/**
 * 验证 Token 有效性（JWT decode 检查）
 * @param {string} token - JWT Token
 * @returns {boolean} Token 是否有效
 */
export function validateToken(token) {
  if (!token) return false
  
  try {
    // JWT 格式检查：header.payload.signature
    const parts = token.split('.')
    if (parts.length !== 3) {
      return false
    }
    
    // 解码 payload 检查过期时间
    const payload = JSON.parse(atob(parts[1]))
    
    // 检查是否过期（exp 字段，单位秒）
    if (payload.exp && payload.exp < Date.now() / 1000) {
      return false
    }
    
    return true
  } catch (error) {
    console.error('Token 验证失败:', error)
    return false
  }
}

/**
 * 密码强度验证
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
export function validatePassword(password) {
  const result = {
    valid: false,
    errors: []
  }
  
  if (!password || password.length < 8) {
    result.errors.push('密码长度至少 8 位')
  }
  
  if (!/[a-z]/.test(password)) {
    result.errors.push('密码必须包含小写字母')
  }
  
  if (!/[A-Z]/.test(password)) {
    result.errors.push('密码必须包含大写字母')
  }
  
  if (!/[0-9]/.test(password)) {
    result.errors.push('密码必须包含数字')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    result.errors.push('密码必须包含特殊字符')
  }
  
  result.valid = result.errors.length === 0
  return result
}

/**
 * 敏感数据脱敏
 * @param {string} data - 敏感数据
 * @param {string} type - 数据类型 (phone, idCard, email)
 * @returns {string} 脱敏后的数据
 */
export function maskSensitiveData(data, type) {
  if (!data) return ''
  
  switch (type) {
    case 'phone':
      // 手机号脱敏：138****5678
      return data.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    case 'idCard':
      // 身份证脱敏：110101********1234
      return data.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
    case 'email':
      // 邮箱脱敏：te**@example.com
      const [username, domain] = data.split('@')
      if (username && domain) {
        return `${username.slice(0, 2)}**@${domain}`
      }
      return data
    default:
      return data
  }
}

export default {
  sanitizeInput,
  sanitizeObject,
  getCsrfToken,
  validateToken,
  validatePassword,
  maskSensitiveData
}
