/**
 * 安全工具模块测试
 * 测试 XSS/CSRF 防护、输入验证等功能
 */

import { describe, it, expect, beforeEach } from 'vitest'
import {
  sanitizeInput,
  sanitizeObject,
  validateToken,
  validatePassword,
  maskSensitiveData,
  getCsrfToken
} from '../src/utils/security'

describe('Security Utils', () => {
  describe('sanitizeInput', () => {
    it('应该转义 HTML 标签', () => {
      const input = '<script>alert("xss")</script>'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<script>')
      expect(result).not.toContain('alert')
    })

    it('应该转义 HTML 实体', () => {
      const input = '<img src="x" onerror="alert(1)">'
      const result = sanitizeInput(input)
      expect(result).not.toContain('<img')
    })

    it('应该保留普通文本', () => {
      const input = 'Hello World!'
      const result = sanitizeInput(input)
      expect(result).toBe('Hello World!')
    })

    it('应该处理非字符串输入', () => {
      expect(sanitizeInput(123)).toBe(123)
      expect(sanitizeInput(null)).toBe(null)
      expect(sanitizeInput(undefined)).toBe(undefined)
    })
  })

  describe('sanitizeObject', () => {
    it('应该转义对象中的所有字符串字段', () => {
      const input = {
        name: '<script>alert("xss")</script>',
        age: 25,
        description: 'Normal text'
      }
      const result = sanitizeObject(input)
      expect(result.name).not.toContain('<script>')
      expect(result.age).toBe(25)
      expect(result.description).toBe('Normal text')
    })

    it('应该处理嵌套对象', () => {
      const input = {
        user: {
          name: '<b>Bold</b>',
          profile: {
            bio: '<script>evil()</script>'
          }
        }
      }
      const result = sanitizeObject(input)
      expect(result.user.name).not.toContain('<b>')
      expect(result.user.profile.bio).not.toContain('<script>')
    })

    it('应该处理数组', () => {
      const input = [
        { name: '<script>1</script>' },
        { name: '<script>2</script>' }
      ]
      const result = sanitizeObject(input)
      expect(result[0].name).not.toContain('<script>')
      expect(result[1].name).not.toContain('<script>')
    })
  })

  describe('validateToken', () => {
    it('应该验证有效的 JWT Token', () => {
      // 创建一个有效的 JWT Token（payload 中 exp 为未来时间）
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ 
        sub: '1234567890',
        name: 'Test User',
        exp: Math.floor(Date.now() / 1000) + 3600 // 1 小时后过期
      }))
      const signature = 'test-signature'
      const token = `${header}.${payload}.${signature}`
      
      expect(validateToken(token)).toBe(true)
    })

    it('应该拒绝过期的 Token', () => {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
      const payload = btoa(JSON.stringify({ 
        sub: '1234567890',
        exp: Math.floor(Date.now() / 1000) - 3600 // 1 小时前过期
      }))
      const signature = 'test-signature'
      const token = `${header}.${payload}.${signature}`
      
      expect(validateToken(token)).toBe(false)
    })

    it('应该拒绝格式错误的 Token', () => {
      expect(validateToken('invalid-token')).toBe(false)
      expect(validateToken('')).toBe(false)
      expect(validateToken(null)).toBe(false)
    })
  })

  describe('validatePassword', () => {
    it('应该验证强密码', () => {
      const result = validatePassword('Test123!@#')
      expect(result.valid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })

    it('应该拒绝太短的密码', () => {
      const result = validatePassword('Te1!')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码长度至少 8 位')
    })

    it('应该拒绝缺少小写字母的密码', () => {
      const result = validatePassword('TEST123!@#')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含小写字母')
    })

    it('应该拒绝缺少大写字母的密码', () => {
      const result = validatePassword('test123!@#')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含大写字母')
    })

    it('应该拒绝缺少数字的密码', () => {
      const result = validatePassword('TestTest!@#')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含数字')
    })

    it('应该拒绝缺少特殊字符的密码', () => {
      const result = validatePassword('Test1234')
      expect(result.valid).toBe(false)
      expect(result.errors).toContain('密码必须包含特殊字符')
    })
  })

  describe('maskSensitiveData', () => {
    it('应该脱敏手机号', () => {
      const result = maskSensitiveData('13812345678', 'phone')
      expect(result).toBe('138****5678')
    })

    it('应该脱敏身份证号', () => {
      const result = maskSensitiveData('110101199001011234', 'idCard')
      expect(result).toBe('110101********1234')
    })

    it('应该脱敏邮箱', () => {
      const result = maskSensitiveData('test@example.com', 'email')
      expect(result).toBe('te**@example.com')
    })

    it('应该处理空值', () => {
      expect(maskSensitiveData('', 'phone')).toBe('')
      expect(maskSensitiveData(null, 'phone')).toBe('')
    })
  })

  describe('getCsrfToken', () => {
    beforeEach(() => {
      // 清除所有 Cookie
      document.cookie.split(';').forEach(c => {
        document.cookie = c.replace(/^ +/, '').replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
      })
      localStorage.clear()
    })

    it('应该从 Cookie 获取 CSRF Token', () => {
      document.cookie = 'XSRF-TOKEN=csrf-cookie-token; path=/'
      const result = getCsrfToken()
      expect(result).toBe('csrf-cookie-token')
    })

    it('应该从 localStorage 获取 CSRF Token（当 Cookie 不存在时）', () => {
      localStorage.setItem('csrf_token', 'csrf-local-token')
      const result = getCsrfToken()
      expect(result).toBe('csrf-local-token')
    })

    it('Cookie 优先于 localStorage', () => {
      document.cookie = 'XSRF-TOKEN=csrf-cookie-token; path=/'
      localStorage.setItem('csrf_token', 'csrf-local-token')
      const result = getCsrfToken()
      expect(result).toBe('csrf-cookie-token')
    })

    it('没有 Token 时返回 null', () => {
      const result = getCsrfToken()
      expect(result).toBeNull()
    })
  })
})
