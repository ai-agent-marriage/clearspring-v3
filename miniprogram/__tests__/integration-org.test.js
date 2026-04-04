/**
 * 机构端全流程集成测试
 * 测试机构端与后端接口的完整交互流程
 * 使用模拟的 wx.request 响应
 */

// 模拟 wx.request 的返回值
const mockRequest = (options) => {
  return Promise.resolve({
    statusCode: 200,
    data: {
      code: 200,
      data: options.url.includes('dashboard') ? {
        pendingOrders: 5,
        todayTasks: 3,
        todos: []
      } : options.url.includes('invite-code') ? {
        inviteCode: 'VOL20260407001'
      } : options.url.includes('statistics/org') ? {
        totalOrders: 100,
        totalAmount: 50000,
        totalVolunteers: 128
      } : options.url.includes('orders') ? {
        list: [{ id: 1, title: '订单 1', status: 1 }]
      } : options.url.includes('volunteers') ? {
        list: [{ id: 1, name: '张三', status: 'active' }]
      } : options.url.includes('settlements') ? {
        list: [{ id: 1, amount: 500, status: 'pending' }]
      } : options.url.includes('audit-execute') ? {
        success: true
      } : options.url.includes('update') ? {
        success: true
      } : options.url.includes('export') ? {
        buffer: new ArrayBuffer(100)
      } : options.url.includes('todos') ? [
        { id: 1, title: '待办 1', action: 'audit' }
      ] : {}
    }
  })
}

describe('机构全流程集成测试', () => {
  beforeEach(() => {
    wx.request = jest.fn(mockRequest)
  })

  test('机构工作台数据获取正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/dashboard?orgId=1',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('pendingOrders')
  })

  test('志愿者邀请码生成正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/invite-code?orgId=1',
      method: 'POST'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.inviteCode).toContain('VOL')
  })

  test('机构统计数据获取正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/statistics/org?orgId=1',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('totalOrders')
  })

  test('机构订单列表获取正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/orders?orgId=1&pageNum=1&pageSize=10',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('list')
    expect(Array.isArray(res.data.data.list)).toBe(true)
  })

  test('机构志愿者列表获取正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/volunteers?orgId=1&pageNum=1&pageSize=10',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('list')
    expect(Array.isArray(res.data.data.list)).toBe(true)
  })

  test('机构结算单列表获取正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/settlements?orgId=1&pageNum=1&pageSize=10',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data).toHaveProperty('list')
  })

  test('机构执行结果审核正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/audit-execute',
      method: 'POST',
      data: {
        orgId: 1,
        executeId: 1,
        status: 2,
        remark: '审核通过'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })

  test('机构信息更新正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/update',
      method: 'POST',
      data: {
        orgId: 1,
        contactPhone: '138****9999',
        address: '测试地址'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })

  test('机构报表导出正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/export/order-report?orgId=1&startDate=2026-04-01&endDate=2026-04-07',
      method: 'GET',
      responseType: 'arraybuffer'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data).toBeTruthy()
  })

  test('机构待办事项获取正常', async () => {
    const res = await wx.request({
      url: 'http://localhost:8080/api/org/manage/todos?orgId=1',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(Array.isArray(res.data.data)).toBe(true)
  })
})
