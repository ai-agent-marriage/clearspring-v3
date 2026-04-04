/**
 * ECharts 图表工具类封装
 * 提供统一的图表初始化、清理和性能优化方法
 */

/**
 * 初始化图表
 * @param {string} canvasId - Canvas 元素 ID
 * @param {object} option - ECharts 配置项
 * @param {object} options - 可选配置
 * @param {string} options.theme - 主题名称
 * @param {function} options.callback - 初始化完成回调
 * @returns {object} ECharts 实例
 */
export function initChart(canvasId, option, options = {}) {
  const { theme = null, callback = null } = options
  
  return new Promise((resolve, reject) => {
    const query = wx.createSelectorQuery()
    
    query.select(`#${canvasId}`)
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res[0]) {
          reject(new Error(`Canvas element #${canvasId} not found`))
          return
        }

        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        
        // 设置 Canvas 尺寸
        canvas.width = res[0].width * dpr
        canvas.height = res[0].height * dpr
        
        // 初始化 ECharts 实例
        const chart = echarts.init(canvas, theme, {
          renderer: 'canvas',
          devicePixelRatio: dpr
        })
        
        // 设置配置项
        chart.setOption(option)
        
        // 执行回调
        if (callback && typeof callback === 'function') {
          callback(chart)
        }
        
        resolve(chart)
      })
  })
}

/**
 * 同步方式初始化图表（适用于 Page.onReady）
 * @param {object} canvasInfo - Canvas 信息（从 createSelectorQuery 获取）
 * @param {object} option - ECharts 配置项
 * @param {string} theme - 主题名称
 * @returns {object|null} ECharts 实例
 */
export function initChartSync(canvasInfo, option, theme = null) {
  if (!canvasInfo) {
    console.warn('Canvas info is null')
    return null
  }

  const canvas = canvasInfo.node
  const ctx = canvas.getContext('2d')
  const dpr = wx.getSystemInfoSync().pixelRatio
  
  // 设置 Canvas 尺寸
  canvas.width = canvasInfo.width * dpr
  canvas.height = canvasInfo.height * dpr
  
  // 初始化 ECharts 实例
  const chart = echarts.init(canvas, theme, {
    renderer: 'canvas',
    devicePixelRatio: dpr
  })
  
  // 设置配置项
  chart.setOption(option)
  
  return chart
}

/**
 * 销毁图表实例
 * @param {object} chart - ECharts 实例
 */
export function disposeChart(chart) {
  if (chart && typeof chart.dispose === 'function') {
    chart.dispose()
  }
}

/**
 * 更新图表配置
 * @param {object} chart - ECharts 实例
 * @param {object} option - 新的配置项
 * @param {boolean} notMerge - 是否不合并配置（默认 false）
 */
export function updateChart(chart, option, notMerge = false) {
  if (chart && typeof chart.setOption === 'function') {
    chart.setOption(option, notMerge)
  }
}

/**
 * 调整图表大小
 * @param {object} chart - ECharts 实例
 */
export function resizeChart(chart) {
  if (chart && typeof chart.resize === 'function') {
    chart.resize()
  }
}

/**
 * 创建禅意主题配置（浅色米白风格）
 * @returns {object} 禅意主题配置
 */
export function createZenTheme() {
  return {
    backgroundColor: '#EFEEE9',
    textStyle: {
      color: '#333333'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(74, 93, 78, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(74, 93, 78, 0.1)'
      }
    },
    primaryColor: '#4A5D4E',
    secondaryColor: '#8FB396',
    accentColor: '#FFA500'
  }
}

/**
 * 创建深色主题配置（已弃用，改用禅意主题）
 * @deprecated 使用 createZenTheme 代替
 * @returns {object} 深色主题配置
 */
export function createDarkTheme() {
  return createZenTheme()
}

/**
 * 创建主色主题配置
 * @returns {object} 主色主题配置
 */
export function createPrimaryTheme() {
  return {
    primaryColor: '#4A5D4E',
    secondaryColor: '#8FB396',
    accentColor: '#409EFF'
  }
}

/**
 * 获取 Stitch 主题色板
 * @returns {object} 主题色板配置
 */
export function getStitchThemeColors() {
  return {
    primary: '#4A5D4E',      // 主色 - 深绿
    secondary: '#8FB396',    // 辅助色 - 浅绿
    accent: '#FFA500',       // 强调色 - 橙色
    background: '#EFEEE9',   // 背景色 - 米白
    card: '#FFFFFF',         // 卡片色 - 纯白
    text: '#333333',         // 主文字
    textSecondary: '#666666',// 次要文字
    border: 'rgba(74, 93, 78, 0.1)', // 边框色
    chartColors: [           // 图表色板
      '#4A5D4E',
      '#8FB396',
      '#FFA500',
      '#409EFF',
      '#67C23A',
      '#E6A23C',
      '#F56C6C',
      '#909399'
    ]
  }
}

/**
 * 生成渐变色
 * @param {object} chart - ECharts 实例
 * @param {string} type - 渐变类型（linear/radial）
 * @param {array} colors - 颜色数组
 * @returns {object} 渐变色对象
 */
export function createGradient(chart, type = 'linear', colors = []) {
  if (type === 'linear') {
    return new echarts.graphic.LinearGradient(0, 0, 0, 1, colors)
  } else if (type === 'radial') {
    return new echarts.graphic.RadialGradient(0.5, 0.5, 1, colors)
  }
  return colors[0]
}

/**
 * 优化大数据集渲染（数据采样）
 * @param {array} data - 原始数据
 * @param {number} maxPoints - 最大点数
 * @returns {array} 采样后的数据
 */
export function sampleData(data, maxPoints = 100) {
  if (!data || data.length <= maxPoints) {
    return data
  }
  
  const step = Math.ceil(data.length / maxPoints)
  const sampled = []
  
  for (let i = 0; i < data.length; i += step) {
    sampled.push(data[i])
  }
  
  return sampled
}

/**
 * 创建性能优化的图表配置
 * @param {object} baseOption - 基础配置
 * @param {object} options - 性能选项
 * @returns {object} 优化后的配置
 */
export function createOptimizedOption(baseOption, options = {}) {
  const {
    large = false,
    largeThreshold = 2000,
    progressive = 400,
    progressiveThreshold = 3000
  } = options
  
  // 为 series 添加性能优化配置
  const optimizedOption = { ...baseOption }
  
  if (optimizedOption.series) {
    optimizedOption.series = optimizedOption.series.map(series => ({
      ...series,
      large,
      largeThreshold,
      progressive,
      progressiveThreshold
    }))
  }
  
  return optimizedOption
}

/**
 * 防抖函数（用于图表 resize）
 * @param {function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {function} 防抖后的函数
 */
export function debounce(func, wait = 300) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * 创建响应式图表（自动适应屏幕）
 * @param {object} chart - ECharts 实例
 * @param {object} options - 选项
 */
export function createResponsiveChart(chart, options = {}) {
  const { onResize = null } = options
  
  // 监听窗口大小变化
  const resizeHandler = debounce(() => {
    if (chart && !chart.isDisposed()) {
      chart.resize()
      if (onResize) {
        onResize(chart)
      }
    }
  }, 300)
  
  // 微信小程序中使用 onWindowResize
  if (wx.onWindowResize) {
    wx.onWindowResize(resizeHandler)
  }
  
  return resizeHandler
}

/**
 * 移除响应式监听
 * @param {function} resizeHandler - resize 处理函数
 */
export function removeResponsiveListener(resizeHandler) {
  if (wx.offWindowResize && resizeHandler) {
    wx.offWindowResize(resizeHandler)
  }
}

/**
 * 创建加载动画
 * @param {object} chart - ECharts 实例
 */
export function showChartLoading(chart) {
  if (chart && typeof chart.showLoading === 'function') {
    chart.showLoading({
      text: '加载中...',
      color: themeColors.primary,
      textColor: themeColors.text,
      maskColor: 'rgba(255, 255, 255, 0.8)',
      zlevel: 2
    })
  }
}

/**
 * 隐藏加载动画
 * @param {object} chart - ECharts 实例
 */
export function hideChartLoading(chart) {
  if (chart && typeof chart.hideLoading === 'function') {
    chart.hideLoading()
  }
}

/**
 * 图表导出为图片
 * @param {object} chart - ECharts 实例
 * @param {object} options - 导出选项
 * @returns {string} Base64 图片数据
 */
export function exportChartToDataURL(chart, options = {}) {
  if (!chart) return null
  
  const {
    pixelRatio = 2,
    backgroundColor = '#fff',
    type = 'png'
  } = options
  
  return chart.getDataURL({
    pixelRatio,
    backgroundColor,
    type
  })
}

/**
 * 批量初始化多个图表
 * @param {array} chartConfigs - 图表配置数组
 * @returns {Promise<object>} 图表实例映射
 */
export async function initCharts(chartConfigs) {
  const charts = {}
  
  for (const config of chartConfigs) {
    const { id, option, theme } = config
    try {
      const chart = await initChart(id, option, { theme })
      charts[id] = chart
    } catch (error) {
      console.error(`Failed to init chart ${id}:`, error)
    }
  }
  
  return charts
}

/**
 * 批量销毁图表
 * @param {object} charts - 图表实例映射
 */
export function disposeCharts(charts) {
  Object.values(charts).forEach(chart => {
    disposeChart(chart)
  })
}
