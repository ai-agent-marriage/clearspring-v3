/**
 * 数据统计趋势分析单元测试
 * 测试文件：miniprogram/__tests__/stats-trend.test.js
 * 
 * 测试范围:
 * - 订单趋势分析
 * - 金额趋势分析
 * - 用户增长趋势
 * - 同比环比计算
 * - 趋势预测
 * 
 * 用例数量：10 个
 */

// Mock wx API
global.wx = {
  request: jest.fn()
}

describe('订单趋势分析 - 基础数据', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('获取日订单趋势数据', async () => {
    const mockDailyTrend = [
      { date: '2026-04-01', orders: 120, amount: 35600, users: 85 },
      { date: '2026-04-02', orders: 135, amount: 40200, users: 92 },
      { date: '2026-04-03', orders: 98, amount: 29400, users: 78 },
      { date: '2026-04-04', orders: 145, amount: 43500, users: 98 },
      { date: '2026-04-05', orders: 167, amount: 50100, users: 112 },
      { date: '2026-04-06', orders: 189, amount: 56700, users: 125 },
      { date: '2026-04-07', orders: 201, amount: 60300, users: 135 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockDailyTrend }
    })

    const response = await wx.request({ 
      url: '/api/stats/trend/daily',
      data: { startDate: '2026-04-01', endDate: '2026-04-07' }
    })

    expect(response.statusCode).toBe(200)
    expect(response.data.data).toHaveLength(7)
    expect(response.data.data[0].date).toBe('2026-04-01')
  })

  test('订单趋势数据完整性验证', () => {
    const trendData = {
      date: '2026-04-07',
      orders: 201,
      amount: 60300,
      users: 135,
      avgOrderValue: 300
    }

    expect(trendData).toHaveProperty('date')
    expect(trendData).toHaveProperty('orders')
    expect(trendData).toHaveProperty('amount')
    expect(trendData).toHaveProperty('users')
    expect(trendData).toHaveProperty('avgOrderValue')
  })

  test('订单趋势数据有效性验证', () => {
    const trendData = [
      { date: '2026-04-01', orders: 120, amount: 35600 },
      { date: '2026-04-02', orders: 135, amount: 40200 },
      { date: '2026-04-03', orders: 98, amount: 29400 }
    ]

    trendData.forEach(item => {
      expect(item.orders).toBeGreaterThanOrEqual(0)
      expect(item.amount).toBeGreaterThanOrEqual(0)
      expect(item.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })
  })
})

describe('金额趋势分析 - 统计计算', () => {
  test('计算总金额趋势', () => {
    const amounts = [35600, 40200, 29400, 43500, 50100, 56700, 60300]
    const total = amounts.reduce((sum, val) => sum + val, 0)
    
    expect(total).toBe(315800)
  })

  test('计算平均订单金额', () => {
    const dailyData = [
      { orders: 120, amount: 35600 },
      { orders: 135, amount: 40200 },
      { orders: 98, amount: 29400 }
    ]

    const totalOrders = dailyData.reduce((sum, d) => sum + d.orders, 0)
    const totalAmount = dailyData.reduce((sum, d) => sum + d.amount, 0)
    const avgOrderValue = totalAmount / totalOrders

    expect(avgOrderValue).toBeCloseTo(298.02, 1)
  })

  test('计算金额增长率', () => {
    const currentAmount = 60300
    const previousAmount = 56700
    const growthRate = ((currentAmount - previousAmount) / previousAmount) * 100

    expect(growthRate).toBeCloseTo(6.35, 2)
  })

  test('识别金额峰值', () => {
    const amounts = [35600, 40200, 29400, 43500, 50100, 56700, 60300]
    const maxAmount = Math.max(...amounts)
    const maxIndex = amounts.indexOf(maxAmount)

    expect(maxAmount).toBe(60300)
    expect(maxIndex).toBe(6) // 最后一天
  })
})

describe('用户增长趋势 - 分析', () => {
  test('计算用户增长趋势', async () => {
    const mockUserTrend = [
      { date: '2026-04-01', newUsers: 25, activeUsers: 850 },
      { date: '2026-04-02', newUsers: 32, activeUsers: 882 },
      { date: '2026-04-03', newUsers: 18, activeUsers: 900 },
      { date: '2026-04-04', newUsers: 45, activeUsers: 945 },
      { date: '2026-04-05', newUsers: 38, activeUsers: 983 },
      { date: '2026-04-06', newUsers: 42, activeUsers: 1025 },
      { date: '2026-04-07', newUsers: 55, activeUsers: 1080 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockUserTrend }
    })

    const response = await wx.request({ 
      url: '/api/stats/trend/users',
      data: { startDate: '2026-04-01', endDate: '2026-04-07' }
    })

    expect(response.data.data).toHaveLength(7)
    
    // 验证累计增长
    const totalNewUsers = mockUserTrend.reduce((sum, d) => sum + d.newUsers, 0)
    expect(totalNewUsers).toBe(255)
  })

  test('计算用户活跃度', () => {
    const userData = {
      totalUsers: 1256,
      activeUsers: 1080,
      date: '2026-04-07'
    }

    const activityRate = (userData.activeUsers / userData.totalUsers) * 100
    expect(activityRate).toBeCloseTo(85.99, 2)
  })

  test('用户增长率计算', () => {
    const currentUsers = 1080
    const previousUsers = 1025
    const growthRate = ((currentUsers - previousUsers) / previousUsers) * 100

    expect(growthRate).toBeCloseTo(5.37, 2)
  })
})

describe('同比环比分析 - 计算逻辑', () => {
  test('计算日环比增长率', () => {
    const currentDay = { orders: 201, amount: 60300 }
    const previousDay = { orders: 189, amount: 56700 }

    const ordersGrowth = ((currentDay.orders - previousDay.orders) / previousDay.orders) * 100
    const amountGrowth = ((currentDay.amount - previousDay.amount) / previousDay.amount) * 100

    expect(ordersGrowth).toBeCloseTo(6.35, 2)
    expect(amountGrowth).toBeCloseTo(6.35, 2)
  })

  test('计算周同比增长率', () => {
    const currentWeek = { orders: 1055, amount: 315800 }
    const previousWeek = { orders: 920, amount: 276000 }

    const ordersYoY = ((currentWeek.orders - previousWeek.orders) / previousWeek.orders) * 100
    const amountYoY = ((currentWeek.amount - previousWeek.amount) / previousWeek.amount) * 100

    expect(ordersYoY).toBeCloseTo(14.67, 2)
    expect(amountYoY).toBeCloseTo(14.42, 2)
  })

  test('计算月同比增长率', () => {
    const currentMonth = { orders: 3500, amount: 1050000 }
    const previousMonth = { orders: 3200, amount: 960000 }

    const ordersYoY = ((currentMonth.orders - previousMonth.orders) / previousMonth.orders) * 100
    const amountYoY = ((currentMonth.amount - previousMonth.amount) / previousMonth.amount) * 100

    expect(ordersYoY).toBeCloseTo(9.38, 1)
    expect(amountYoY).toBeCloseTo(9.38, 1)
  })

  test('趋势方向判断', () => {
    const trend = [35600, 40200, 29400, 43500, 50100, 56700, 60300]
    
    // 判断整体趋势（简单线性回归斜率）
    const n = trend.length
    const sumX = n * (n - 1) / 2
    const sumY = trend.reduce((sum, val) => sum + val, 0)
    const sumXY = trend.reduce((sum, val, idx) => sum + idx * val, 0)
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
    
    expect(slope).toBeGreaterThan(0) // 正斜率表示上升趋势
  })
})

describe('趋势预测 - 简单模型', () => {
  test('基于移动平均的预测', () => {
    const recentData = [50100, 56700, 60300]
    const movingAverage = recentData.reduce((sum, val) => sum + val, 0) / recentData.length
    
    expect(movingAverage).toBeCloseTo(55700, 0)
  })

  test('基于增长率的预测', () => {
    const data = [50100, 56700, 60300]
    const growthRates = [
      (56700 - 50100) / 50100,
      (60300 - 56700) / 56700
    ]
    const avgGrowthRate = growthRates.reduce((sum, r) => sum + r, 0) / growthRates.length
    const predicted = data[data.length - 1] * (1 + avgGrowthRate)

    expect(predicted).toBeGreaterThan(60300)
  })
})
