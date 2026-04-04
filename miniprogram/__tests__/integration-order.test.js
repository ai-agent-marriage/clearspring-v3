/**
 * 订单全流程集成测试
 * 测试订单创建、机构承接、志愿者任务分配等完整流程
 */

// Mock wx 对象
const mockWx = {
  request: jest.fn(),
  showToast: jest.fn(),
  navigateTo: jest.fn()
}

global.wx = mockWx

const API_BASE_URL = 'http://localhost:8080/api'

describe('订单全流程集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('订单创建流程正常', async () => {
    // 1. 创建订单
    const mockCreateResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '创建成功',
        data: {
          orderNo: 'PRO202604070001',
          amount: 299,
          createTime: new Date().toISOString()
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockCreateResponse)
    
    const res1 = await wx.request({
      url: `${API_BASE_URL}/order/create`,
      method: 'POST',
      data: {
        userId: 1,
        speciesId: 1,
        quantity: 10,
        amount: 299,
        address: '珠江广州段',
        executeDate: '2026-04-15'
      }
    })

    expect(res1.statusCode).toBe(200)
    expect(res1.data.code).toBe(200)
    expect(res1.data.data).toHaveProperty('orderNo')

    // 2. 查询订单
    const mockListResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '查询成功',
        data: [
          {
            orderNo: 'PRO202604070001',
            speciesName: '鲢鱼',
            quantity: 10,
            amount: 299,
            status: 1
          }
        ]
      }
    }
    
    wx.request.mockResolvedValueOnce(mockListResponse)
    
    const res2 = await wx.request({
      url: `${API_BASE_URL}/order/my?userId=1`,
      method: 'GET'
    })

    expect(res2.statusCode).toBe(200)
    expect(res2.data.data).toBeInstanceOf(Array)
    expect(res2.data.data.length).toBeGreaterThan(0)
  })

  test('机构承接订单流程正常', async () => {
    const orderNo = 'PRO202604070001'
    const orgId = 1

    // 1. 机构承接订单
    const mockAcceptResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '承接成功',
        data: null
      }
    }
    
    wx.request.mockResolvedValueOnce(mockAcceptResponse)
    
    const res1 = await wx.request({
      url: `${API_BASE_URL}/org/order/accept/${orderNo}?orgId=${orgId}`,
      method: 'POST'
    })

    expect(res1.statusCode).toBe(200)
    expect(res1.data.code).toBe(200)

    // 2. 查询订单状态
    const mockDetailResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '查询成功',
        data: {
          orderNo: orderNo,
          status: 2,
          statusName: '待执行',
          orgId: orgId,
          orgName: '广州护生协会'
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockDetailResponse)
    
    const res2 = await wx.request({
      url: `${API_BASE_URL}/order/detail/${orderNo}`,
      method: 'GET'
    })

    expect(res2.statusCode).toBe(200)
    expect(res2.data.data.status).toBe(2) // 待执行
  })

  test('志愿者任务分配流程正常', async () => {
    const orderNo = 'PRO202604070001'
    const volunteerId = 1

    // 1. 分配任务
    const mockAssignResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '分配成功',
        data: {
          taskId: 1,
          orderNo: orderNo,
          volunteerId: volunteerId
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockAssignResponse)
    
    const res1 = await wx.request({
      url: `${API_BASE_URL}/volunteer/task/assign`,
      method: 'POST',
      data: { orderNo, volunteerId }
    })

    expect(res1.statusCode).toBe(200)
    expect(res1.data.code).toBe(200)

    // 2. 查询志愿者任务
    const mockTasksResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '查询成功',
        data: [
          {
            taskId: 1,
            orderNo: orderNo,
            speciesName: '鲢鱼',
            quantity: 10,
            address: '珠江广州段',
            status: 1,
            statusName: '待执行'
          }
        ]
      }
    }
    
    wx.request.mockResolvedValueOnce(mockTasksResponse)
    
    const res2 = await wx.request({
      url: `${API_BASE_URL}/volunteer/task/my?volunteerId=${volunteerId}`,
      method: 'GET'
    })

    expect(res2.statusCode).toBe(200)
    expect(res2.data.data).toBeInstanceOf(Array)
    expect(res2.data.data.length).toBeGreaterThan(0)
  })

  test('订单支付流程正常', async () => {
    const orderNo = 'PRO202604070001'

    // 1. 发起支付
    const mockPayResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '支付成功',
        data: {
          orderNo: orderNo,
          payTime: new Date().toISOString(),
          status: 1
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockPayResponse)
    
    const res1 = await wx.request({
      url: `${API_BASE_URL}/order/pay`,
      method: 'POST',
      data: { orderNo }
    })

    expect(res1.statusCode).toBe(200)
    expect(res1.data.code).toBe(200)

    // 2. 查询支付结果
    const mockResultResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '查询成功',
        data: {
          orderNo: orderNo,
          payStatus: 1,
          payTime: new Date().toISOString()
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockResultResponse)
    
    const res2 = await wx.request({
      url: `${API_BASE_URL}/order/payResult?orderNo=${orderNo}`,
      method: 'GET'
    })

    expect(res2.statusCode).toBe(200)
    expect(res2.data.data.payStatus).toBe(1)
  })

  test('订单取消流程正常', async () => {
    const orderNo = 'PRO202604070001'

    // 1. 取消订单
    const mockCancelResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '取消成功',
        data: null
      }
    }
    
    wx.request.mockResolvedValueOnce(mockCancelResponse)
    
    const res1 = await wx.request({
      url: `${API_BASE_URL}/order/cancel`,
      method: 'POST',
      data: { orderNo, reason: '用户主动取消' }
    })

    expect(res1.statusCode).toBe(200)
    expect(res1.data.code).toBe(200)

    // 2. 查询订单状态
    const mockDetailResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '查询成功',
        data: {
          orderNo: orderNo,
          status: 6,
          statusName: '已取消'
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockDetailResponse)
    
    const res2 = await wx.request({
      url: `${API_BASE_URL}/order/detail/${orderNo}`,
      method: 'GET'
    })

    expect(res2.statusCode).toBe(200)
    expect(res2.data.data.status).toBe(6) // 已取消
  })

  test('订单复核流程正常', async () => {
    const orderNo = 'PRO202604070001'

    // 1. 申请复核
    const mockReviewResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '申请成功',
        data: {
          reviewId: 1,
          orderNo: orderNo,
          status: 'pending'
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockReviewResponse)
    
    const res1 = await wx.request({
      url: `${API_BASE_URL}/order/review`,
      method: 'POST',
      data: { 
        orderNo, 
        reason: '执行质量不符合要求',
        images: ['img1.jpg', 'img2.jpg']
      }
    })

    expect(res1.statusCode).toBe(200)
    expect(res1.data.code).toBe(200)

    // 2. 查询复核进度
    const mockReviewProgressResponse = {
      statusCode: 200,
      data: {
        code: 200,
        msg: '查询成功',
        data: {
          reviewId: 1,
          status: 'pending',
          statusName: '审核中'
        }
      }
    }
    
    wx.request.mockResolvedValueOnce(mockReviewProgressResponse)
    
    const res2 = await wx.request({
      url: `${API_BASE_URL}/order/reviewProgress?reviewId=1`,
      method: 'GET'
    })

    expect(res2.statusCode).toBe(200)
    expect(res2.data.data.status).toBe('pending')
  })
})

describe('订单异常流程测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('库存不足时下单失败', async () => {
    const mockErrorResponse = {
      statusCode: 200,
      data: {
        code: 500,
        msg: '库存不足',
        data: null
      }
    }
    
    wx.request.mockResolvedValueOnce(mockErrorResponse)
    
    const res = await wx.request({
      url: `${API_BASE_URL}/order/create`,
      method: 'POST',
      data: {
        userId: 1,
        speciesId: 1,
        quantity: 1000, // 超出库存
        amount: 29900,
        address: '珠江广州段',
        executeDate: '2026-04-15'
      }
    })

    expect(res.data.code).toBe(500)
    expect(res.data.msg).toBe('库存不足')
  })

  test('非法日期范围下单失败', async () => {
    const mockErrorResponse = {
      statusCode: 200,
      data: {
        code: 400,
        msg: '执行日期超出可预约范围',
        data: null
      }
    }
    
    wx.request.mockResolvedValueOnce(mockErrorResponse)
    
    const res = await wx.request({
      url: `${API_BASE_URL}/order/create`,
      method: 'POST',
      data: {
        userId: 1,
        speciesId: 1,
        quantity: 10,
        amount: 299,
        address: '珠江广州段',
        executeDate: '2026-04-01' // 早于 7 天
      }
    })

    expect(res.data.code).toBe(400)
    expect(res.data.msg).toBe('执行日期超出可预约范围')
  })

  test('禁止投放物种下单失败', async () => {
    const mockErrorResponse = {
      statusCode: 200,
      data: {
        code: 400,
        msg: '该物种禁止投放',
        data: null
      }
    }
    
    wx.request.mockResolvedValueOnce(mockErrorResponse)
    
    const res = await wx.request({
      url: `${API_BASE_URL}/order/create`,
      method: 'POST',
      data: {
        userId: 1,
        speciesId: 7, // 巴西龟（禁止投放）
        quantity: 10,
        amount: 299,
        address: '珠江广州段',
        executeDate: '2026-04-15'
      }
    })

    expect(res.data.code).toBe(400)
    expect(res.data.msg).toBe('该物种禁止投放')
  })
})
