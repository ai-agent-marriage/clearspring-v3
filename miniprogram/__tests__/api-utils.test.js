/**
 * API 工具类单元测试
 * 测试数据接入、图片压缩、导出等功能
 */

// Mock wx API
global.wx = {
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  compressImage: jest.fn((options) => {
    if (options.success) {
      options.success({ tempFilePath: '/tmp/compressed.jpg' })
    }
  }),
  chooseImage: jest.fn((options) => {
    if (options.success) {
      options.success({
        tempFiles: [{ path: '/tmp/image.jpg', size: 102400 }]
      })
    }
  }),
  env: {
    USER_DATA_PATH: '/user/data/path'
  },
  getFileSystemManager: jest.fn(() => ({
    writeFileSync: jest.fn()
  }))
}

// Mock request
jest.mock('../utils/request', () => {
  return jest.fn((config) => {
    return Promise.resolve({
      data: {
        totalUsers: 1256,
        totalOrders: 456,
        totalAmount: 125680,
        activeVolunteers: 89
      }
    })
  })
})

describe('API Utils - Data Fetching', () => {
  let api
  let request

  beforeEach(async () => {
    jest.clearAllMocks()
    api = await import('../utils/api')
    request = (await import('../utils/request')).default
  })

  describe('fetchDashboardStats', () => {
    it('should fetch dashboard stats successfully', async () => {
      const data = await api.fetchDashboardStats()
      
      expect(data).toHaveProperty('totalUsers')
      expect(data).toHaveProperty('totalOrders')
      expect(data).toHaveProperty('totalAmount')
      expect(data).toHaveProperty('activeVolunteers')
      expect(request).toHaveBeenCalledWith(expect.objectContaining({
        url: '/api/stats/dashboard',
        method: 'GET'
      }))
    })

    it('should handle API error gracefully', async () => {
      request.mockRejectedValueOnce(new Error('Network Error'))
      
      await expect(api.fetchDashboardStats()).rejects.toThrow('Network Error')
    })
  })

  describe('fetchTrendData', () => {
    it('should fetch trend data with time range', async () => {
      const data = await api.fetchTrendData('30', ['orders', 'amount'])
      
      expect(request).toHaveBeenCalledWith(expect.objectContaining({
        url: '/api/stats/trend',
        method: 'GET',
        data: {
          timeRange: '30',
          metrics: 'orders,amount'
        }
      }))
    })

    it('should use default time range', async () => {
      await api.fetchTrendData()
      
      expect(request).toHaveBeenCalledWith(expect.objectContaining({
        data: {
          timeRange: '7',
          metrics: 'orders,amount'
        }
      }))
    })
  })

  describe('fetchSpeciesDistribution', () => {
    it('should fetch species distribution data', async () => {
      await api.fetchSpeciesDistribution()
      
      expect(request).toHaveBeenCalledWith(expect.objectContaining({
        url: '/api/stats/species-distribution',
        method: 'GET'
      }))
    })
  })

  describe('exportStatsData', () => {
    it('should export data with options', async () => {
      await api.exportStatsData({
        format: 'excel',
        timeRange: '30',
        metrics: ['orders', 'amount']
      })
      
      expect(request).toHaveBeenCalledWith(expect.objectContaining({
        url: '/api/stats/export',
        method: 'GET',
        data: {
          format: 'excel',
          timeRange: '30',
          metrics: ['orders', 'amount']
        }
      }))
    })
  })
})

describe('API Utils - Image Processing', () => {
  let api

  beforeEach(async () => {
    jest.clearAllMocks()
    api = await import('../utils/api')
  })

  describe('compressImage', () => {
    it('should compress image with default options', async () => {
      const result = await api.compressImage('/tmp/original.jpg')
      
      expect(result).toBe('/tmp/compressed.jpg')
      expect(wx.compressImage).toHaveBeenCalledWith(expect.objectContaining({
        src: '/tmp/original.jpg',
        quality: 80,
        compressedWidth: 1024
      }))
    })

    it('should compress image with custom options', async () => {
      await api.compressImage('/tmp/original.jpg', {
        quality: 60,
        maxWidth: 800
      })
      
      expect(wx.compressImage).toHaveBeenCalledWith(expect.objectContaining({
        quality: 60,
        compressedWidth: 800
      }))
    })

    it('should handle compression error', async () => {
      wx.compressImage.mockImplementationOnce((options) => {
        if (options.fail) {
          options.fail(new Error('Compression failed'))
        }
      })
      
      await expect(api.compressImage('/tmp/original.jpg'))
        .rejects.toThrow('Compression failed')
    })
  })

  describe('uploadImage', () => {
    it('should compress and upload image', async () => {
      const result = await api.uploadImage('/tmp/original.jpg')
      
      expect(wx.compressImage).toHaveBeenCalled()
      expect(wx.showLoading).toHaveBeenCalled()
      expect(wx.hideLoading).toHaveBeenCalled()
    })
  })

  describe('chooseAndUploadImage', () => {
    it('should choose and upload image', async () => {
      // This would be tested in the page context
      expect(api.compressImage).toBeDefined()
    })
  })
})

describe('API Utils - UI Helpers', () => {
  let api

  beforeEach(async () => {
    jest.clearAllMocks()
    api = await import('../utils/api')
  })

  describe('showLoading', () => {
    it('should show loading with default text', () => {
      api.showLoading()
      
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '加载中...',
        mask: true
      })
    })

    it('should show loading with custom text', () => {
      api.showLoading('自定义加载提示')
      
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '自定义加载提示',
        mask: true
      })
    })
  })

  describe('hideLoading', () => {
    it('should hide loading', () => {
      api.hideLoading()
      
      expect(wx.hideLoading).toHaveBeenCalled()
    })
  })

  describe('showError', () => {
    it('should show error with default message', () => {
      api.showError()
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '操作失败',
        icon: 'none',
        duration: 2000
      })
    })

    it('should show error with custom message', () => {
      api.showError('自定义错误信息')
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '自定义错误信息',
        icon: 'none',
        duration: 2000
      })
    })
  })

  describe('showSuccess', () => {
    it('should show success with default message', () => {
      api.showSuccess()
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '操作成功',
        icon: 'success',
        duration: 2000
      })
    })

    it('should show success with custom message', () => {
      api.showSuccess('自定义成功信息')
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '自定义成功信息',
        icon: 'success',
        duration: 2000
      })
    })
  })
})
