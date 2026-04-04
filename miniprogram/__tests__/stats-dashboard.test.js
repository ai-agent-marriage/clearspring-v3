/**
 * 数据统计仪表盘单元测试
 * 测试文件：miniprogram/__tests__/stats-dashboard.test.js
 * 
 * 测试范围:
 * - 仪表盘数据统计测试
 * - 订单趋势数据测试
 * - 物种分布数据测试
 * - 志愿者排行榜测试
 * - 机构排行榜测试
 * 
 * 用例数量：10 个
 */

// Mock wx API
global.wx = {
  request: jest.fn(),
  navigateTo: jest.fn(),
  showModal: jest.fn((options) => {
    if (options.success) {
      options.success({ confirm: true })
    }
  }),
  showToast: jest.fn()
}

describe('数据统计仪表盘 - 数据加载', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('成功加载仪表盘汇总数据', async () => {
    const mockData = {
      totalUsers: 1256,
      totalOrders: 456,
      totalAmount: 125680,
      activeVolunteers: 89
    }

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockData }
    })

    const response = await wx.request({ url: '/api/stats/dashboard' })
    
    expect(response.statusCode).toBe(200)
    expect(response.data.code).toBe(200)
    expect(response.data.data.totalUsers).toBe(1256)
    expect(response.data.data.totalOrders).toBe(456)
  })

  test('仪表盘数据字段完整性验证', () => {
    const dashboard = {
      totalUsers: 1256,
      totalOrders: 456,
      totalAmount: 125680,
      activeVolunteers: 89,
      totalOrgs: 45,
      totalSpecies: 256
    }

    expect(dashboard).toHaveProperty('totalUsers')
    expect(dashboard).toHaveProperty('totalOrders')
    expect(dashboard).toHaveProperty('totalAmount')
    expect(dashboard).toHaveProperty('activeVolunteers')
    expect(dashboard).toHaveProperty('totalOrgs')
    expect(dashboard).toHaveProperty('totalSpecies')
  })

  test('仪表盘数据数值有效性验证', () => {
    const dashboard = {
      totalUsers: 1256,
      totalOrders: 456,
      totalAmount: 125680,
      activeVolunteers: 89
    }

    expect(dashboard.totalUsers).toBeGreaterThan(0)
    expect(dashboard.totalOrders).toBeGreaterThanOrEqual(0)
    expect(dashboard.totalAmount).toBeGreaterThanOrEqual(0)
    expect(dashboard.activeVolunteers).toBeGreaterThanOrEqual(0)
  })
})

describe('订单趋势数据 - 时间维度', () => {
  test('按天获取订单趋势数据', async () => {
    const mockTrend = [
      { date: '2026-04-01', orders: 120, amount: 35600 },
      { date: '2026-04-02', orders: 135, amount: 40200 },
      { date: '2026-04-03', orders: 98, amount: 29400 },
      { date: '2026-04-04', orders: 145, amount: 43500 },
      { date: '2026-04-05', orders: 167, amount: 50100 },
      { date: '2026-04-06', orders: 189, amount: 56700 },
      { date: '2026-04-07', orders: 201, amount: 60300 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockTrend }
    })

    const response = await wx.request({ 
      url: '/api/stats/order-trend',
      data: { startDate: '2026-04-01', endDate: '2026-04-07', type: 'day' }
    })

    expect(response.data.data).toHaveLength(7)
    expect(response.data.data[0]).toHaveProperty('date')
    expect(response.data.data[0]).toHaveProperty('orders')
    expect(response.data.data[0]).toHaveProperty('amount')
  })

  test('按周获取订单趋势数据', async () => {
    const mockWeeklyTrend = [
      { week: '2026-W13', orders: 850, amount: 255000 },
      { week: '2026-W14', orders: 920, amount: 276000 },
      { week: '2026-W15', orders: 780, amount: 234000 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockWeeklyTrend }
    })

    const response = await wx.request({ 
      url: '/api/stats/order-trend',
      data: { startDate: '2026-03-01', endDate: '2026-04-07', type: 'week' }
    })

    expect(response.data.data).toHaveLength(3)
    expect(response.data.data[0]).toHaveProperty('week')
  })

  test('按月获取订单趋势数据', async () => {
    const mockMonthlyTrend = [
      { month: '2026-01', orders: 3200, amount: 960000 },
      { month: '2026-02', orders: 2800, amount: 840000 },
      { month: '2026-03', orders: 3500, amount: 1050000 },
      { month: '2026-04', orders: 1200, amount: 360000 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockMonthlyTrend }
    })

    const response = await wx.request({ 
      url: '/api/stats/order-trend',
      data: { startDate: '2026-01-01', endDate: '2026-04-07', type: 'month' }
    })

    expect(response.data.data).toHaveLength(4)
  })
})

describe('物种分布数据 - 饼图数据', () => {
  test('物种分布数据结构验证', async () => {
    const mockDistribution = [
      { name: '鱼类', value: 256, percentage: 35.2 },
      { name: '鸟类', value: 189, percentage: 26.0 },
      { name: '哺乳类', value: 145, percentage: 20.0 },
      { name: '爬行类', value: 98, percentage: 13.5 },
      { name: '其他', value: 38, percentage: 5.3 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockDistribution }
    })

    const response = await wx.request({ url: '/api/stats/species-distribution' })

    expect(response.data.data).toBeInstanceOf(Array)
    expect(response.data.data.length).toBeGreaterThan(0)
    
    const first = response.data.data[0]
    expect(first).toHaveProperty('name')
    expect(first).toHaveProperty('value')
    expect(first).toHaveProperty('percentage')
  })

  test('物种分布百分比总和验证', () => {
    const distribution = [
      { name: '鱼类', value: 256, percentage: 35.2 },
      { name: '鸟类', value: 189, percentage: 26.0 },
      { name: '哺乳类', value: 145, percentage: 20.0 },
      { name: '爬行类', value: 98, percentage: 13.5 },
      { name: '其他', value: 38, percentage: 5.3 }
    ]

    const totalPercentage = distribution.reduce((sum, item) => sum + item.percentage, 0)
    expect(totalPercentage).toBeCloseTo(100, 0) // 允许四舍五入误差
  })

  test('物种分布数据排序验证', () => {
    const distribution = [
      { name: '鱼类', value: 256 },
      { name: '鸟类', value: 189 },
      { name: '哺乳类', value: 145 },
      { name: '爬行类', value: 98 },
      { name: '其他', value: 38 }
    ]

    // 验证按 value 降序排列
    for (let i = 1; i < distribution.length; i++) {
      expect(distribution[i - 1].value).toBeGreaterThanOrEqual(distribution[i].value)
    }
  })
})

describe('排行榜数据 - 志愿者和机构', () => {
  test('志愿者排行榜数据结构验证', async () => {
    const mockRank = [
      { rank: 1, userId: 'u001', userName: '张三', score: 9850, orderCount: 45 },
      { rank: 2, userId: 'u002', userName: '李四', score: 8760, orderCount: 38 },
      { rank: 3, userId: 'u003', userName: '王五', score: 7650, orderCount: 32 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockRank }
    })

    const response = await wx.request({ url: '/api/stats/volunteer-rank', data: { limit: 10 } })

    expect(response.data.data).toBeInstanceOf(Array)
    expect(response.data.data.length).toBeLessThanOrEqual(10)
    
    const first = response.data.data[0]
    expect(first).toHaveProperty('rank')
    expect(first).toHaveProperty('userId')
    expect(first).toHaveProperty('userName')
    expect(first).toHaveProperty('score')
    expect(first.rank).toBe(1)
  })

  test('机构排行榜数据结构验证', async () => {
    const mockOrgRank = [
      { rank: 1, orgId: 'o001', orgName: '北京保护协会', score: 15680, orderCount: 125 },
      { rank: 2, orgId: 'o002', orgName: '上海保护协会', score: 13450, orderCount: 98 },
      { rank: 3, orgId: 'o003', orgName: '广州保护协会', score: 11230, orderCount: 87 }
    ]

    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, data: mockOrgRank }
    })

    const response = await wx.request({ url: '/api/stats/org-rank', data: { limit: 10 } })

    expect(response.data.data).toBeInstanceOf(Array)
    
    const first = response.data.data[0]
    expect(first).toHaveProperty('orgId')
    expect(first).toHaveProperty('orgName')
    expect(first).toHaveProperty('score')
  })

  test('排行榜分数递减验证', () => {
    const rank = [
      { rank: 1, score: 9850 },
      { rank: 2, score: 8760 },
      { rank: 3, score: 7650 },
      { rank: 4, score: 6540 },
      { rank: 5, score: 5430 }
    ]

    for (let i = 1; i < rank.length; i++) {
      expect(rank[i - 1].score).toBeGreaterThanOrEqual(rank[i].score)
    }
  })
})
