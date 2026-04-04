/**
 * ECharts 工具类单元测试
 * 测试图表优化、性能优化、响应式功能
 */

// Mock wx API
global.wx = {
  getSystemInfoSync: jest.fn(() => ({
    pixelRatio: 2,
    windowWidth: 375,
    windowHeight: 812
  })),
  createSelectorQuery: jest.fn(),
  onWindowResize: jest.fn(),
  offWindowResize: jest.fn()
}

// Mock echarts
global.echarts = {
  init: jest.fn(() => ({
    setOption: jest.fn(),
    dispose: jest.fn(),
    resize: jest.fn(),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
    getDataURL: jest.fn(() => 'data:image/png;base64,test'),
    isDisposed: jest.fn(() => false)
  })),
  graphic: {
    LinearGradient: jest.fn(() => ({})),
    RadialGradient: jest.fn(() => ({}))
  }
}

describe('ECharts Utils - Core Functions', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('getStitchThemeColors', () => {
    it('should return Stitch theme colors', () => {
      const colors = echartsUtils.getStitchThemeColors()
      
      expect(colors).toHaveProperty('primary', '#4A5D4E')
      expect(colors).toHaveProperty('secondary', '#8FB396')
      expect(colors).toHaveProperty('accent', '#FFA500')
      expect(colors).toHaveProperty('background', '#EFEEE9')
      expect(colors).toHaveProperty('chartColors')
      expect(Array.isArray(colors.chartColors)).toBe(true)
      expect(colors.chartColors.length).toBeGreaterThan(0)
    })
  })

  describe('createZenTheme', () => {
    it('should create zen theme configuration', () => {
      const theme = echartsUtils.createZenTheme()
      
      expect(theme).toHaveProperty('backgroundColor', '#EFEEE9')
      expect(theme).toHaveProperty('primaryColor', '#4A5D4E')
      expect(theme).toHaveProperty('secondaryColor', '#8FB396')
      expect(theme).toHaveProperty('accentColor', '#FFA500')
    })
  })

  describe('createPrimaryTheme', () => {
    it('should create primary theme configuration', () => {
      const theme = echartsUtils.createPrimaryTheme()
      
      expect(theme).toHaveProperty('primaryColor', '#4A5D4E')
      expect(theme).toHaveProperty('secondaryColor', '#8FB396')
      expect(theme).toHaveProperty('accentColor', '#409EFF')
    })
  })
})

describe('ECharts Utils - Chart Initialization', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('initChart', () => {
    it('should initialize chart successfully', async () => {
      const mockCanvas = {
        node: {
          width: 400,
          height: 300,
          getContext: jest.fn(() => ({}))
        }
      }

      wx.createSelectorQuery.mockReturnValue({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([mockCanvas])
            })
          }))
        }))
      })

      const option = {
        title: { text: '测试图表' },
        series: [{ type: 'line', data: [1, 2, 3] }]
      }

      const chart = await echartsUtils.initChart('testChart', option)
      
      expect(wx.createSelectorQuery).toHaveBeenCalled()
      expect(global.echarts.init).toHaveBeenCalled()
      expect(chart).toBeDefined()
    })

    it('should handle canvas not found error', async () => {
      wx.createSelectorQuery.mockReturnValue({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([null])
            })
          }))
        }))
      })

      await expect(echartsUtils.initChart('nonExistentChart', {}))
        .rejects.toThrow('Canvas element #nonExistentChart not found')
    })

    it('should use custom theme', async () => {
      const mockCanvas = {
        node: {
          width: 400,
          height: 300,
          getContext: jest.fn(() => ({}))
        }
      }

      wx.createSelectorQuery.mockReturnValue({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([mockCanvas])
            })
          }))
        }))
      })

      await echartsUtils.initChart('testChart', {}, { theme: 'dark' })
      
      expect(global.echarts.init).toHaveBeenCalledWith(
        expect.any(Object),
        'dark',
        expect.any(Object)
      )
    })

    it('should execute callback after initialization', async () => {
      const mockCanvas = {
        node: {
          width: 400,
          height: 300,
          getContext: jest.fn(() => ({}))
        }
      }

      wx.createSelectorQuery.mockReturnValue({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([mockCanvas])
            })
          }))
        }))
      })

      const mockCallback = jest.fn()
      await echartsUtils.initChart('testChart', {}, { callback: mockCallback })
      
      expect(mockCallback).toHaveBeenCalled()
    })
  })

  describe('disposeChart', () => {
    it('should dispose chart instance', () => {
      const mockChart = {
        dispose: jest.fn()
      }

      echartsUtils.disposeChart(mockChart)
      
      expect(mockChart.dispose).toHaveBeenCalled()
    })

    it('should handle null chart', () => {
      expect(() => echartsUtils.disposeChart(null)).not.toThrow()
    })

    it('should handle chart without dispose method', () => {
      expect(() => echartsUtils.disposeChart({})).not.toThrow()
    })
  })

  describe('updateChart', () => {
    it('should update chart option', () => {
      const mockChart = {
        setOption: jest.fn()
      }

      const newOption = { series: [{ data: [1, 2, 3] }] }
      echartsUtils.updateChart(mockChart, newOption)
      
      expect(mockChart.setOption).toHaveBeenCalledWith(newOption, false)
    })

    it('should update chart without merging', () => {
      const mockChart = {
        setOption: jest.fn()
      }

      echartsUtils.updateChart(mockChart, {}, true)
      
      expect(mockChart.setOption).toHaveBeenCalledWith({}, true)
    })

    it('should handle null chart', () => {
      expect(() => echartsUtils.updateChart(null, {})).not.toThrow()
    })
  })

  describe('resizeChart', () => {
    it('should resize chart', () => {
      const mockChart = {
        resize: jest.fn()
      }

      echartsUtils.resizeChart(mockChart)
      
      expect(mockChart.resize).toHaveBeenCalled()
    })

    it('should handle null chart', () => {
      expect(() => echartsUtils.resizeChart(null)).not.toThrow()
    })
  })
})

describe('ECharts Utils - Performance Optimization', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('sampleData', () => {
    it('should sample large dataset', () => {
      const largeData = Array.from({ length: 1000 }, (_, i) => i)
      const sampled = echartsUtils.sampleData(largeData, 100)
      
      expect(sampled.length).toBeLessThanOrEqual(100)
      expect(sampled[0]).toBe(0)
      expect(sampled[sampled.length - 1]).toBeGreaterThan(800)
    })

    it('should return original data if within limit', () => {
      const smallData = [1, 2, 3, 4, 5]
      const sampled = echartsUtils.sampleData(smallData, 100)
      
      expect(sampled).toEqual(smallData)
    })

    it('should handle empty data', () => {
      const sampled = echartsUtils.sampleData([], 100)
      expect(sampled).toEqual([])
    })

    it('should handle null data', () => {
      const sampled = echartsUtils.sampleData(null, 100)
      expect(sampled).toBeNull()
    })
  })

  describe('createOptimizedOption', () => {
    it('should add performance optimizations to chart option', () => {
      const baseOption = {
        series: [{ type: 'line', data: [1, 2, 3] }]
      }

      const optimized = echartsUtils.createOptimizedOption(baseOption, {
        large: true,
        largeThreshold: 2000,
        progressive: 400,
        progressiveThreshold: 3000
      })

      expect(optimized.series[0]).toHaveProperty('large', true)
      expect(optimized.series[0]).toHaveProperty('largeThreshold', 2000)
      expect(optimized.series[0]).toHaveProperty('progressive', 400)
      expect(optimized.series[0]).toHaveProperty('progressiveThreshold', 3000)
    })

    it('should use default performance options', () => {
      const baseOption = {
        series: [{ type: 'scatter', data: [] }]
      }

      const optimized = echartsUtils.createOptimizedOption(baseOption)

      expect(optimized.series[0]).toHaveProperty('large', false)
      expect(optimized.series[0]).toHaveProperty('progressive', 400)
    })

    it('should handle option without series', () => {
      const baseOption = { title: { text: 'Test' } }
      const optimized = echartsUtils.createOptimizedOption(baseOption)
      
      expect(optimized).toEqual(baseOption)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', (done) => {
      const mockFn = jest.fn()
      const debouncedFn = echartsUtils.debounce(mockFn, 100)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      setTimeout(() => {
        expect(mockFn).toHaveBeenCalledTimes(1)
        done()
      }, 150)
    })

    it('should use default wait time', () => {
      const mockFn = jest.fn()
      const debouncedFn = echartsUtils.debounce(mockFn)

      debouncedFn()
      
      expect(mockFn).not.toHaveBeenCalled()
    })
  })
})

describe('ECharts Utils - Responsive Charts', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('createResponsiveChart', () => {
    it('should create responsive chart with resize handler', () => {
      const mockChart = {
        resize: jest.fn(),
        isDisposed: jest.fn(() => false)
      }

      const onResize = jest.fn()
      const resizeHandler = echartsUtils.createResponsiveChart(mockChart, { onResize })

      expect(wx.onWindowResize).toHaveBeenCalled()
      expect(resizeHandler).toBeDefined()
    })

    it('should call onResize callback', (done) => {
      const mockChart = {
        resize: jest.fn(),
        isDisposed: jest.fn(() => false)
      }

      const onResize = jest.fn()
      echartsUtils.createResponsiveChart(mockChart, { onResize })

      // Simulate window resize
      const resizeCallback = wx.onWindowResize.mock.calls[0][0]
      resizeCallback()

      setTimeout(() => {
        expect(mockChart.resize).toHaveBeenCalled()
        expect(onResize).toHaveBeenCalledWith(mockChart)
        done()
      }, 350)
    })
  })

  describe('removeResponsiveListener', () => {
    it('should remove resize listener', () => {
      const mockHandler = jest.fn()
      echartsUtils.removeResponsiveListener(mockHandler)

      expect(wx.offWindowResize).toHaveBeenCalledWith(mockHandler)
    })

    it('should handle null handler', () => {
      expect(() => echartsUtils.removeResponsiveListener(null)).not.toThrow()
    })
  })
})

describe('ECharts Utils - Loading States', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('showChartLoading', () => {
    it('should show loading on chart', () => {
      const mockChart = {
        showLoading: jest.fn()
      }

      echartsUtils.showChartLoading(mockChart)

      expect(mockChart.showLoading).toHaveBeenCalledWith({
        text: '加载中...',
        color: '#4A5D4E',
        textColor: '#333333',
        maskColor: 'rgba(255, 255, 255, 0.8)',
        zlevel: 2
      })
    })

    it('should handle null chart', () => {
      expect(() => echartsUtils.showChartLoading(null)).not.toThrow()
    })
  })

  describe('hideChartLoading', () => {
    it('should hide loading on chart', () => {
      const mockChart = {
        hideLoading: jest.fn()
      }

      echartsUtils.hideChartLoading(mockChart)

      expect(mockChart.hideLoading).toHaveBeenCalled()
    })

    it('should handle null chart', () => {
      expect(() => echartsUtils.hideChartLoading(null)).not.toThrow()
    })
  })
})

describe('ECharts Utils - Export Functions', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('exportChartToDataURL', () => {
    it('should export chart to data URL', () => {
      const mockChart = {
        getDataURL: jest.fn(() => 'data:image/png;base64,test')
      }

      const dataURL = echartsUtils.exportChartToDataURL(mockChart, {
        pixelRatio: 2,
        backgroundColor: '#fff',
        type: 'png'
      })

      expect(mockChart.getDataURL).toHaveBeenCalledWith({
        pixelRatio: 2,
        backgroundColor: '#fff',
        type: 'png'
      })
      expect(dataURL).toBe('data:image/png;base64,test')
    })

    it('should use default export options', () => {
      const mockChart = {
        getDataURL: jest.fn(() => 'data:image/png;base64,test')
      }

      echartsUtils.exportChartToDataURL(mockChart)

      expect(mockChart.getDataURL).toHaveBeenCalledWith({
        pixelRatio: 2,
        backgroundColor: '#fff',
        type: 'png'
      })
    })

    it('should return null for null chart', () => {
      const result = echartsUtils.exportChartToDataURL(null)
      expect(result).toBeNull()
    })
  })
})

describe('ECharts Utils - Batch Operations', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('initCharts', () => {
    it('should initialize multiple charts', async () => {
      const mockCanvas = {
        node: {
          width: 400,
          height: 300,
          getContext: jest.fn(() => ({}))
        }
      }

      wx.createSelectorQuery.mockReturnValue({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([mockCanvas])
            })
          }))
        }))
      })

      const chartConfigs = [
        { id: 'chart1', option: { title: { text: 'Chart 1' } } },
        { id: 'chart2', option: { title: { text: 'Chart 2' } } }
      ]

      const charts = await echartsUtils.initCharts(chartConfigs)

      expect(Object.keys(charts).length).toBe(2)
      expect(charts).toHaveProperty('chart1')
      expect(charts).toHaveProperty('chart2')
    })

    it('should handle initialization errors gracefully', async () => {
      wx.createSelectorQuery.mockReturnValue({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([null])
            })
          }))
        }))
      })

      const chartConfigs = [
        { id: 'chart1', option: {} }
      ]

      const charts = await echartsUtils.initCharts(chartConfigs)

      expect(Object.keys(charts).length).toBe(0)
    })
  })

  describe('disposeCharts', () => {
    it('should dispose multiple charts', () => {
      const charts = {
        chart1: { dispose: jest.fn() },
        chart2: { dispose: jest.fn() },
        chart3: { dispose: jest.fn() }
      }

      echartsUtils.disposeCharts(charts)

      expect(charts.chart1.dispose).toHaveBeenCalled()
      expect(charts.chart2.dispose).toHaveBeenCalled()
      expect(charts.chart3.dispose).toHaveBeenCalled()
    })

    it('should handle empty charts object', () => {
      expect(() => echartsUtils.disposeCharts({})).not.toThrow()
    })
  })
})

describe('ECharts Utils - Gradient Creation', () => {
  let echartsUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    echartsUtils = await import('../utils/echarts')
  })

  describe('createGradient', () => {
    it('should create linear gradient', () => {
      const mockChart = {}
      const colors = [
        { offset: 0, color: '#4A5D4E' },
        { offset: 1, color: '#8FB396' }
      ]

      const gradient = echartsUtils.createGradient(mockChart, 'linear', colors)

      expect(global.echarts.graphic.LinearGradient).toHaveBeenCalledWith(
        0, 0, 0, 1, colors
      )
    })

    it('should create radial gradient', () => {
      const mockChart = {}
      const colors = [
        { offset: 0, color: '#4A5D4E' }
      ]

      echartsUtils.createGradient(mockChart, 'radial', colors)

      expect(global.echarts.graphic.RadialGradient).toHaveBeenCalledWith(
        0.5, 0.5, 1, colors
      )
    })

    it('should return first color for invalid type', () => {
      const mockChart = {}
      const colors = ['#4A5D4E', '#8FB396']

      const result = echartsUtils.createGradient(mockChart, 'invalid', colors)

      expect(result).toBe('#4A5D4E')
    })
  })
})
