/**
 * ECharts 图表工具类封装
 * 提供统一的图表初始化和清理方法
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
 * 创建深色主题配置
 * @returns {object} 深色主题配置
 */
export function createDarkTheme() {
  return {
    backgroundColor: '#1a1a2e',
    textStyle: {
      color: '#ffffff'
    },
    axisLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.3)'
      }
    },
    splitLine: {
      lineStyle: {
        color: 'rgba(255, 255, 255, 0.1)'
      }
    }
  }
}

/**
 * 创建主色主题配置
 * @returns {object} 主色主题配置
 */
export function createPrimaryTheme() {
  return {
    primaryColor: '#4A5D4E',
    secondaryColor: '#FFA500',
    accentColor: '#409EFF'
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
