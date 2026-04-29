/**
 * User API 模块测试
 * 测试用户相关的 API 调用
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'

// 模拟 request 模块
const mockRequest = vi.fn()
vi.mock('@/api/request', () => ({
  default: (...args) => mockRequest(...args)
}))

describe('User API', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该调用获取用户列表 API', async () => {
    const { getUserList } = await import('../src/api/user')
    mockRequest.mockResolvedValue({ code: 200, data: [] })
    
    await getUserList({ page: 1, size: 10 })
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/api/users',
      method: 'get',
      params: { page: 1, size: 10 }
    })
  })

  it('应该调用获取用户详情 API', async () => {
    const { getUserDetail } = await import('../src/api/user')
    mockRequest.mockResolvedValue({ code: 200, data: {} })
    
    await getUserDetail('user-123')
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/api/users/user-123',
      method: 'get'
    })
  })

  it('应该调用创建用户 API', async () => {
    const { createUser } = await import('../src/api/user')
    mockRequest.mockResolvedValue({ code: 200, data: {} })
    
    const userData = {
      username: 'testuser',
      password: 'Test123!@#',
      role: 'admin'
    }
    await createUser(userData)
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/api/users',
      method: 'post',
      data: userData
    })
  })

  it('应该调用更新用户 API', async () => {
    const { updateUser } = await import('../src/api/user')
    mockRequest.mockResolvedValue({ code: 200, data: {} })
    
    const userData = {
      username: 'testuser',
      role: 'user'
    }
    await updateUser('user-123', userData)
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/api/users/user-123',
      method: 'put',
      data: userData
    })
  })

  it('应该调用删除用户 API', async () => {
    const { deleteUser } = await import('../src/api/user')
    mockRequest.mockResolvedValue({ code: 200, data: {} })
    
    await deleteUser('user-123')
    
    expect(mockRequest).toHaveBeenCalledWith({
      url: '/api/users/user-123',
      method: 'delete'
    })
  })

  it('应该处理 API 错误', async () => {
    const { getUserList } = await import('../src/api/user')
    mockRequest.mockRejectedValue(new Error('Network Error'))
    
    await expect(getUserList({ page: 1 })).rejects.toThrow('Network Error')
  })

  it('应该处理 API 错误', async () => {
    const { getUserList } = await import('../src/api/user')
    mockRequest.mockRejectedValue(new Error('Network Error'))
    
    await expect(getUserList({ page: 1 })).rejects.toThrow('Network Error')
  })
})
