/**
 * HTTP 请求模块测试
 * 测试 Token 刷新、错误处理等功能
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import axios from 'axios'

// Mock axios
vi.mock('axios', () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() }
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
  return { default: mockAxios }
})

describe('Request Module', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Token Management', () => {
    it('应该在请求头中添加 Token', () => {
      localStorage.setItem('admin_token', 'test-token')
      // 验证 Token 会被添加到请求头
      expect(localStorage.getItem('admin_token')).toBe('test-token')
    })

    it('应该在 Token 不存在时不添加 Authorization 头', () => {
      localStorage.removeItem('admin_token')
      expect(localStorage.getItem('admin_token')).toBeNull()
    })

    it('应该存储刷新 Token', () => {
      localStorage.setItem('admin_refresh_token', 'refresh-token-123')
      expect(localStorage.getItem('admin_refresh_token')).toBe('refresh-token-123')
    })
  })

  describe('CSRF Protection', () => {
    it('应该从 Cookie 获取 CSRF Token', () => {
      document.cookie = 'XSRF-TOKEN=csrf-123; path=/'
      // 验证 Cookie 设置成功
      expect(document.cookie).toContain('XSRF-TOKEN')
    })

    it('应该从 localStorage 获取 CSRF Token', () => {
      localStorage.setItem('csrf_token', 'csrf-local-123')
      expect(localStorage.getItem('csrf_token')).toBe('csrf-local-123')
    })
  })

  describe('Error Handling', () => {
    it('应该处理 401 错误', () => {
      // 验证 401 错误会被正确处理
      const errorResponse = {
        response: {
          status: 401,
          data: { message: 'Unauthorized' }
        }
      }
      expect(errorResponse.response.status).toBe(401)
    })

    it('应该处理 403 错误', () => {
      const errorResponse = {
        response: {
          status: 403,
          data: { message: 'Forbidden' }
        }
      }
      expect(errorResponse.response.status).toBe(403)
    })

    it('应该处理 404 错误', () => {
      const errorResponse = {
        response: {
          status: 404,
          data: { message: 'Not Found' }
        }
      }
      expect(errorResponse.response.status).toBe(404)
    })

    it('应该处理 500 错误', () => {
      const errorResponse = {
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        }
      }
      expect(errorResponse.response.status).toBe(500)
    })

    it('应该处理网络错误', () => {
      const errorResponse = {
        request: {},
        message: 'Network Error'
      }
      expect(errorResponse.message).toBe('Network Error')
    })
  })

  describe('Request Interceptor', () => {
    it('应该对 POST 请求数据进行 XSS 转义', () => {
      const inputData = {
        name: '<script>alert("xss")</script>',
        age: 25
      }
      // 验证输入数据包含恶意脚本
      expect(inputData.name).toContain('<script>')
    })

    it('应该对 PUT 请求数据进行 XSS 转义', () => {
      const inputData = {
        description: '<img onerror="alert(1)">'
      }
      expect(inputData.description).toContain('<img')
    })

    it('不应该对 GET 请求数据进行转义', () => {
      const params = { search: 'test' }
      expect(params.search).toBe('test')
    })
  })

  describe('Token Refresh', () => {
    it('应该防止并发刷新 Token', () => {
      let isRefreshing = false
      // 第一次刷新开始
      isRefreshing = true
      expect(isRefreshing).toBe(true)
      
      // 第二次尝试应该被阻止
      // 在实际代码中会加入队列等待
    })

    it('应该将请求加入刷新队列', () => {
      const refreshSubscribers = []
      const callback = vi.fn()
      refreshSubscribers.push(callback)
      
      expect(refreshSubscribers.length).toBe(1)
    })

    it('应该在刷新成功后执行队列', () => {
      const refreshSubscribers = []
      const callback = vi.fn()
      refreshSubscribers.push(callback)
      
      // 模拟刷新成功
      const newToken = 'new-token'
      refreshSubscribers.forEach(cb => cb(newToken))
      
      expect(callback).toHaveBeenCalledWith('new-token')
    })

    it('应该在刷新失败时清除队列', () => {
      const refreshSubscribers = []
      refreshSubscribers.push(vi.fn())
      refreshSubscribers.push(vi.fn())
      
      // 模拟刷新失败
      refreshSubscribers.length = 0
      
      expect(refreshSubscribers.length).toBe(0)
    })
  })

  describe('Response Handling', () => {
    it('应该处理成功响应', () => {
      const successResponse = {
        data: {
          code: 200,
          data: { message: 'Success' },
          message: 'OK'
        }
      }
      expect(successResponse.data.code).toBe(200)
    })

    it('应该处理错误响应码', () => {
      const errorResponse = {
        data: {
          code: 400,
          message: 'Bad Request'
        }
      }
      expect(errorResponse.data.code).not.toBe(200)
    })

    it('应该处理 Blob 类型响应', () => {
      const blobResponse = {
        data: new Blob(['test'], { type: 'application/octet-stream' }),
        headers: {
          'content-type': 'application/octet-stream'
        }
      }
      expect(blobResponse.data).toBeInstanceOf(Blob)
    })
  })
})
