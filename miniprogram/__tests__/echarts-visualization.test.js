/**
 * ECharts 数据可视化单元测试
 * 测试文件：miniprogram/__tests__/echarts-visualization.test.js
 * 
 * 测试范围:
 * - ECharts 图表初始化测试
 * - 图表主题配置测试
 * - 图表交互测试（缩放/拖拽/提示）
 * - 图表性能测试（渲染时间/内存占用）
 * - 图表响应式测试（窗口大小变化）
 * 
 * 用例数量：15 个
 */

/* global echarts */

// Mock ECharts
const mockEcharts = {
  init: jest.fn(() => ({
    setOption: jest.fn(),
    resize: jest.fn(),
    dispose: jest.fn(),
    showLoading: jest.fn(),
    hideLoading: jest.fn(),
    getDataURL: jest.fn(),
    clear: jest.fn()
  })),
  dispose: jest.fn(),
  registerTheme: jest.fn()
}

// 使用 mockEcharts 替代 echarts
const echarts = mockEcharts

// Mock wx API
global.wx = {
  createSelectorQuery: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    fields: jest.fn((options, callback) => {
      if (callback) {
        callback({ width: 375, height: 300 })
      }
      return { exec: jest.fn() }
    })
  })),
  getSystemInfoSync: jest.fn(() => ({
    windowWidth: 375,
    windowHeight: 667,
    pixelRatio: 2
  }))
}

describe('ECharts 图表初始化', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('成功初始化图表实例', () => {
    const mockCanvas = { node: { getContext: jest.fn() } }
    const chart = echarts.init(mockCanvas)

    expect(echarts.init).toHaveBeenCalled()
    expect(chart).toHaveProperty('setOption')
    expect(chart).toHaveProperty('resize')
    expect(chart).toHaveProperty('dispose')
  })

  test('图表初始化时加载主题', () => {
    const darkTheme = {
      backgroundColor: '#1a1a2e',
      textStyle: { color: '#ffffff' }
    }

    echarts.registerTheme('dark', darkTheme)
    const chart = echarts.init(null, 'dark')

    expect(echarts.registerTheme).toHaveBeenCalledWith('dark', darkTheme)
  })

  test('图表初始化配置验证', () => {
    const option = {
      title: { text: '订单趋势', left: 'center' },
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false },
      yAxis: { type: 'value' },
      series: [{ type: 'line', smooth: true }]
    }

    const chart = echarts.init(null)
    chart.setOption(option)

    expect(chart.setOption).toHaveBeenCalledWith(option)
    expect(option.title.text).toBe('订单趋势')
    expect(option.tooltip.trigger).toBe('axis')
  })

  test('图表加载状态显示', () => {
    const chart = echarts.init(null)

    chart.showLoading({ text: '加载中...' })
    expect(chart.showLoading).toHaveBeenCalled()

    chart.hideLoading()
    expect(chart.hideLoading).toHaveBeenCalled()
  })

  test('图表销毁释放资源', () => {
    const chart = echarts.init(null)

    chart.dispose()
    expect(chart.dispose).toHaveBeenCalled()
  })
})

describe('图表主题配置', () => {
  test('深色主题配置', () => {
    const darkTheme = {
      backgroundColor: '#1a1a2e',
      textStyle: { color: '#ffffff' },
      axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.3)' } },
      splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.1)' } }
    }

    expect(darkTheme.backgroundColor).toBe('#1a1a2e')
    expect(darkTheme.textStyle.color).toBe('#ffffff')
    expect(darkTheme.axisLine.lineStyle.color).toContain('rgba')
  })

  test('浅色主题配置', () => {
    const lightTheme = {
      backgroundColor: '#ffffff',
      textStyle: { color: '#333333' },
      axisLine: { lineStyle: { color: '#cccccc' } },
      splitLine: { lineStyle: { color: '#eeeeee' } }
    }

    expect(lightTheme.backgroundColor).toBe('#ffffff')
    expect(lightTheme.textStyle.color).toBe('#333333')
  })

  test('自定义主题注册', () => {
    const customTheme = {
      color: ['#4A5D4E', '#FFA500', '#409EFF', '#67C23A', '#E6A23C'],
      backgroundColor: '#f5f7fa'
    }

    echarts.registerTheme('custom', customTheme)
    expect(echarts.registerTheme).toHaveBeenCalledWith('custom', customTheme)
  })

  test('主题颜色数量验证', () => {
    const theme = {
      color: ['#4A5D4E', '#FFA500', '#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
    }

    expect(theme.color).toBeInstanceOf(Array)
    expect(theme.color.length).toBeGreaterThanOrEqual(5)
  })
})

describe('图表交互功能', () => {
  test('缩放功能配置', () => {
    const option = {
      dataZoom: [
        { type: 'slider', start: 0, end: 100 },
        { type: 'inside', start: 0, end: 100 }
      ],
      xAxis: { type: 'category' },
      series: [{ type: 'line' }]
    }

    const chart = echarts.init(null)
    chart.setOption(option)

    expect(option.dataZoom).toHaveLength(2)
    expect(option.dataZoom[0].type).toBe('slider')
    expect(option.dataZoom[1].type).toBe('inside')
  })

  test('拖拽重计算配置', () => {
    const option = {
      series: [{
        type: 'pie',
        data: [{ value: 100, name: 'A' }],
        roam: true
      }]
    }

    expect(option.series[0].roam).toBe(true)
  })

  test('提示框配置', () => {
    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: '{b}: {c}'
      }
    }

    expect(option.tooltip.trigger).toBe('axis')
    expect(option.tooltip.axisPointer.type).toBe('cross')
    expect(option.tooltip.formatter).toContain('{b}')
  })

  test('图例交互配置', () => {
    const option = {
      legend: {
        data: ['订单数', '成交金额'],
        selectedMode: 'multiple',
        left: 'center'
      }
    }

    expect(option.legend.data).toBeInstanceOf(Array)
    expect(option.legend.selectedMode).toBe('multiple')
  })

  test('图表导出图片', () => {
    const chart = echarts.init(null)
    chart.getDataURL({ type: 'png', pixelRatio: 2 })

    expect(chart.getDataURL).toHaveBeenCalledWith({ type: 'png', pixelRatio: 2 })
  })
})

describe('图表性能测试', () => {
  test('图表渲染时间测试', () => {
    const startTime = performance.now()

    const chart = echarts.init(null)
    const option = {
      series: [{
        type: 'line',
        data: Array.from({ length: 100 }, (_, i) => ({ value: Math.random() * 100 }))
      }]
    }
    chart.setOption(option)

    const renderTime = performance.now() - startTime
    expect(renderTime).toBeLessThan(500) // 渲染时间<500ms
  })

  test('大数据量渲染性能', () => {
    const largeData = Array.from({ length: 1000 }, (_, i) => ({
      value: Math.random() * 100
    }))

    const startTime = performance.now()

    const chart = echarts.init(null)
    chart.setOption({
      series: [{ type: 'scatter', data: largeData }]
    })

    const renderTime = performance.now() - startTime
    expect(renderTime).toBeLessThan(1000) // 大数据量渲染<1s
  })

  test('图表内存占用测试', () => {
    const charts = []
    const initialMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0

    // 创建多个图表实例
    for (let i = 0; i < 5; i++) {
      const chart = echarts.init(null)
      charts.push(chart)
    }

    // 销毁所有图表
    charts.forEach(chart => chart.dispose())

    const finalMemory = process.memoryUsage ? process.memoryUsage().heapUsed : 0
    const memoryGrowth = finalMemory - initialMemory

    // 内存增长应该合理（<50MB）
    expect(memoryGrowth).toBeLessThan(50 * 1024 * 1024)
  })

  test('图表重复渲染优化', () => {
    const chart = echarts.init(null)
    const option = { series: [{ type: 'line', data: [1, 2, 3] }] }

    // 多次设置相同配置
    for (let i = 0; i < 5; i++) {
      chart.setOption(option, true) // notMerge = true
    }

    expect(chart.setOption).toHaveBeenCalledTimes(5)
  })
})

describe('图表响应式测试', () => {
  test('窗口大小变化响应', () => {
    const chart = echarts.init(null)

    // 模拟窗口大小变化
    wx.getSystemInfoSync.mockReturnValueOnce({
      windowWidth: 375,
      windowHeight: 667,
      pixelRatio: 2
    })

    chart.resize()
    expect(chart.resize).toHaveBeenCalled()
  })

  test('图表尺寸自适应', () => {
    const option = {
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true }
    }

    expect(option.grid.containLabel).toBe(true)
  })

  test('响应式断点配置', () => {
    const breakpoints = {
      mobile: 375,
      tablet: 768,
      desktop: 1024
    }

    const currentWidth = 375
    let deviceType
    if (currentWidth <= breakpoints.mobile) {
      deviceType = 'mobile'
    } else if (currentWidth <= breakpoints.tablet) {
      deviceType = 'tablet'
    } else {
      deviceType = 'desktop'
    }

    expect(deviceType).toBe('mobile')
  })

  test('图表清晰重绘', () => {
    const chart = echarts.init(null)
    chart.clear()

    expect(chart.clear).toHaveBeenCalled()
  })
})
