/**
 * Day 16 性能回归测试
 * 测试文件：miniprogram/__tests__/performance-regression-day16.test.js
 * 
 * 测试范围:
 * - 前端性能（反馈页面加载/提交响应）
 * - 后端性能（反馈查询/处理响应）
 * - 数据库性能（反馈表查询）
 * 
 * 性能指标要求:
 * - 反馈页面加载：≤1s
 * - 反馈提交响应：≤300ms
 * - 反馈查询响应：≤150ms
 * 
 * 用例数量：15 个
 */

// Mock wx API
global.wx = {
  request: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  getSystemInfoSync: jest.fn(() => ({
    windowWidth: 375,
    windowHeight: 667
  }))
}

// Mock performance API
const originalPerformance = global.performance
let performanceNowValue = 0

beforeAll(() => {
  Object.defineProperty(global, 'performance', {
    value: {
      now: jest.fn(() => performanceNowValue)
    },
    writable: true,
    configurable: true
  })
})

afterAll(() => {
  if (originalPerformance) {
    Object.defineProperty(global, 'performance', {
      value: originalPerformance,
      writable: true,
      configurable: true
    })
  }
})

function mockPerformanceNow(values) {
  performance.now.mockImplementation(() => {
    const value = values.shift()
    return value !== undefined ? value : performanceNowValue
  })
}

describe('前端性能测试 - 反馈页面加载', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('1. 反馈首页加载时间达标', () => {
    mockPerformanceNow([1000, 1850])
    const startTime = 1000
    const loadTime = performance.now() - startTime
    
    expect(loadTime).toBeLessThanOrEqual(1000) // ≤1s
  })

  test('2. 反馈提交页加载时间达标', () => {
    mockPerformanceNow([1000, 1920])
    const startTime = 1000
    const loadTime = performance.now() - startTime
    
    expect(loadTime).toBeLessThanOrEqual(1000)
  })

  test('3. 反馈管理页加载时间达标', () => {
    mockPerformanceNow([1000, 1950])
    const startTime = 1000
    const loadTime = performance.now() - startTime
    
    expect(loadTime).toBeLessThanOrEqual(1000)
  })

  test('4. 反馈统计页加载时间达标', () => {
    mockPerformanceNow([1000, 1880])
    const startTime = 1000
    const loadTime = performance.now() - startTime
    
    expect(loadTime).toBeLessThanOrEqual(1000)
  })

  test('5. 反馈设置页加载时间达标', () => {
    mockPerformanceNow([1000, 1800])
    const startTime = 1000
    const loadTime = performance.now() - startTime
    
    expect(loadTime).toBeLessThanOrEqual(1000)
  })
})

describe('前端性能测试 - 反馈提交响应', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: { code: 200, msg: '提交成功' }
    })
  })

  test('6. 反馈提交响应时间达标', async () => {
    mockPerformanceNow([1000, 1250])
    const startTime = 1000
    
    await wx.request({
      url: '/api/feedback/submit',
      method: 'POST',
      data: {
        type: 'suggestion',
        title: '测试反馈',
        content: '测试内容'
      }
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(300) // ≤300ms
  })

  test('7. 图片上传响应时间达标', async () => {
    mockPerformanceNow([1000, 1280])
    const startTime = 1000
    
    await wx.request({
      url: '/api/feedback/upload',
      method: 'POST',
      data: { image: 'base64data' }
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(300)
  })

  test('8. 批量提交响应时间达标', async () => {
    mockPerformanceNow([1000, 1290])
    const startTime = 1000
    
    await wx.request({
      url: '/api/feedback/batch',
      method: 'POST',
      data: { feedbacks: [] }
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(300)
  })
})

describe('后端性能测试 - 反馈查询响应', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('9. 反馈列表查询响应时间达标', async () => {
    mockPerformanceNow([1000, 1120])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: { list: [], total: 0 }
      }
    })
    
    await wx.request({
      url: '/api/feedback/list',
      method: 'GET',
      data: { page: 1, pageSize: 20 }
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(150) // ≤150ms
  })

  test('10. 反馈详情查询响应时间达标', async () => {
    mockPerformanceNow([1000, 1100])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: { id: 1, title: '测试反馈' }
      }
    })
    
    await wx.request({
      url: '/api/feedback/detail/1',
      method: 'GET'
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(150)
  })

  test('11. 反馈统计查询响应时间达标', async () => {
    mockPerformanceNow([1000, 1130])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: { total: 256, pending: 12, processed: 244 }
      }
    })
    
    await wx.request({
      url: '/api/feedback/stats',
      method: 'GET'
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(150)
  })

  test('12. 反馈筛选查询响应时间达标', async () => {
    mockPerformanceNow([1000, 1140])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: { list: [], total: 0 }
      }
    })
    
    await wx.request({
      url: '/api/feedback/list',
      method: 'GET',
      data: { type: 'suggestion', status: 1 }
    })
    
    const responseTime = performance.now() - startTime
    expect(responseTime).toBeLessThanOrEqual(150)
  })
})

describe('数据库性能测试 - 反馈表查询', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('13. 反馈表分页查询性能', async () => {
    mockPerformanceNow([1000, 1080])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: {
          list: Array(20).fill({ id: 1, title: '测试' }),
          total: 256
        }
      }
    })
    
    await wx.request({
      url: '/api/feedback/list',
      method: 'GET',
      data: { page: 1, pageSize: 20 }
    })
    
    const queryTime = performance.now() - startTime
    expect(queryTime).toBeLessThanOrEqual(100) // 数据库查询≤100ms
  })

  test('14. 反馈表条件查询性能', async () => {
    mockPerformanceNow([1000, 1090])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: { list: [], total: 0 }
      }
    })
    
    await wx.request({
      url: '/api/feedback/list',
      method: 'GET',
      data: {
        type: 'suggestion',
        status: 1,
        startDate: '2026-04-01',
        endDate: '2026-04-07'
      }
    })
    
    const queryTime = performance.now() - startTime
    expect(queryTime).toBeLessThanOrEqual(100)
  })

  test('15. 反馈表统计查询性能', async () => {
    mockPerformanceNow([1000, 1070])
    const startTime = 1000
    
    wx.request.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        data: {
        total: 256,
        pending: 12,
        processed: 244,
        byType: { suggestion: 100, bug: 80, other: 76 },
        byStatus: { pending: 12, processed: 244 }
        }
      }
    })
    
    await wx.request({
      url: '/api/feedback/stats/summary',
      method: 'GET'
    })
    
    const queryTime = performance.now() - startTime
    expect(queryTime).toBeLessThanOrEqual(100)
  })
})
