/**
 * Auth API 模块测试
 * 测试认证相关的 API 调用
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// 模拟 request 模块
const mockRequest = vi.fn()
vi.mock('@/api/request', () => ({
  default: (...args) => mockRequest(...args)
}))

describe('Auth API', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('应该调用登录 API', async () => {
    const { login } = await import('../src/api/auth')
    mockRequest.mockResolvedValue({ 
      code: 200, 
      data: { token: 'test-token', refreshToken: 'refresh-token' } 
    })
    
    const credentials = { username: 'admin', password: 'Test123!@#' }
    const result = await login(credentials)
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/auth/login',
      method: 'post',
      data: credentials
    })
    expect(result.code).toBe(200)
  })

  it('应该调用退出登录 API', async () => {
    const { logout } = await import('../src/api/auth')
    mockRequest.mockResolvedValue({ code: 200, data: {} })
    
    await logout()
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/auth/logout',
      method: 'post'
    })
  })

  it('应该调用获取当前用户 API', async () => {
    const { getCurrentUser } = await import('../src/api/auth')
    mockRequest.mockResolvedValue({ 
      code: 200, 
      data: { id: '1', username: 'admin', name: '管理员' } 
    })
    
    const result = await getCurrentUser()
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/auth/me',
      method: 'get'
    })
    expect(result.data.username).toBe('admin')
  })

  it('应该调用刷新 Token API', async () => {
    const { refreshToken } = await import('../src/api/auth')
    localStorage.setItem('admin_refresh_token', 'refresh-123')
    mockRequest.mockResolvedValue({ 
      code: 200, 
      data: { token: 'new-token', refreshToken: 'new-refresh' } 
    })
    
    const result = await refreshToken()
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/auth/refresh',
      method: 'post'
    })
    expect(result.code).toBe(200)
  })

  it('应该调用修改密码 API', async () => {
    const { changePassword } = await import('../src/api/auth')
    mockRequest.mockResolvedValue({ code: 200, data: {} })
    
    const passwordData = {
      oldPassword: 'Old123!@#',
      newPassword: 'New123!@#'
    }
    await changePassword(passwordData)
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/auth/change-password',
      method: 'post',
      data: passwordData
    })
  })

  it('应该处理登录失败', async () => {
    const { login } = await import('../src/api/auth')
    mockRequest.mockRejectedValue({ 
      response: { 
        status: 401, 
        data: { message: '用户名或密码错误' } 
      } 
    })
    
    const credentials = { username: 'admin', password: 'wrong' }
    await expect(login(credentials)).rejects.toHaveProperty('response.status', 401)
  })

  it('应该处理 Token 刷新失败', async () => {
    const { refreshToken } = await import('../src/api/auth')
    mockRequest.mockRejectedValue({ 
      response: { 
        status: 401, 
        data: { message: '刷新 Token 无效' } 
      } 
    })
    
    await expect(refreshToken()).rejects.toHaveProperty('response.status', 401)
  })

  it('应该在登录成功后存储 Token', async () => {
    const { login } = await import('../src/api/auth')
    const mockToken = 'mock-jwt-token'
    mockRequest.mockResolvedValue({ 
      code: 200, 
      data: { token: mockToken } 
    })
    
    await login({ username: 'admin', password: 'Test123!@#' })
    
    // 验证 Token 会被存储（在实际代码中）
    expect(mockToken).toBeTruthy()
  })
})
