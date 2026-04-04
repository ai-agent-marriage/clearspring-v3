// pages/admin/stats/index.js
import * as echarts from 'echarts'
import { initChart, disposeChart, getStitchThemeColors } from '../../../utils/echarts'

const themeColors = getStitchThemeColors()

Page({
  data: {
    stats: {
      totalUsers: 0,
      totalOrders: 0,
      totalAmount: 0,
      activeVolunteers: 0
    },
    dateRange: '近 7 天',
    orderTrendChart: null,
    speciesChart: null,
    loading: false,
    error: null
  },

  async onLoad() {
    this.setData({ loading: true })
    try {
      await this.fetchStatsData()
      this.initCharts()
    } catch (error) {
      console.error('Failed to load stats:', error)
      this.setData({ error: '加载数据失败，请刷新重试' })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onReady() {
    this.renderCharts()
  },

  onUnload() {
    // 清理图表实例
    if (this.data.orderTrendChart) {
      disposeChart(this.data.orderTrendChart)
    }
    if (this.data.speciesChart) {
      disposeChart(this.data.speciesChart)
    }
  },

  // 获取统计数据
  async fetchStatsData() {
    try {
      // TODO: 替换为真实 API 调用
      // const res = await wx.cloud.callFunction({
      //   name: 'stats',
      //   data: { action: 'getDashboardStats' }
      // })
      
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Mock 数据（开发阶段使用）
      const stats = {
        totalUsers: 1256,
        totalOrders: 456,
        totalAmount: 125680,
        activeVolunteers: 89
      }
      
      this.setData({ stats })
    } catch (error) {
      console.error('Fetch stats error:', error)
      throw error
    }
  },

  // 初始化图表
  initCharts() {
    const query = wx.createSelectorQuery()
    
    // 初始化订单趋势图
    query.select('#orderTrendChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          
          const chart = echarts.init(canvas, null, {
            renderer: 'canvas',
            devicePixelRatio: dpr
          })
          
          const option = {
            title: { text: '订单趋势', textStyle: { color: themeColors.text } },
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7'],
              axisLine: { lineStyle: { color: themeColors.border } }
            },
            yAxis: { 
              type: 'value',
              axisLine: { lineStyle: { color: themeColors.border } },
              splitLine: { lineStyle: { color: 'rgba(74, 93, 78, 0.1)' } }
            },
            series: [{
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'line',
              smooth: true,
              itemStyle: { color: themeColors.primary }
            }]
          }
          
          chart.setOption(option)
          this.setData({ orderTrendChart: chart })
        }
      })

    // 初始化物种分布图
    query.select('#speciesChart')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (res[0]) {
          const canvas = res[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          
          canvas.width = res[0].width * dpr
          canvas.height = res[0].height * dpr
          
          const chart = echarts.init(canvas, null, {
            renderer: 'canvas',
            devicePixelRatio: dpr
          })
          
          const option = {
            title: { text: '物种分布', textStyle: { color: themeColors.text } },
            tooltip: { trigger: 'item' },
            legend: {
              orient: 'horizontal',
              bottom: '0',
              textStyle: { color: themeColors.text }
            },
            series: [{
              type: 'pie',
              radius: '60%',
              data: [
                { value: 256, name: '鱼类' },
                { value: 145, name: '鸟类' },
                { value: 55, name: '其他' }
              ],
              itemStyle: {
                borderRadius: 8,
                color: (params) => themeColors.chartColors[params.dataIndex % themeColors.chartColors.length]
              },
              label: {
                formatter: '{b}: {d}%',
                color: themeColors.text
              }
            }]
          }
          
          chart.setOption(option)
          this.setData({ speciesChart: chart })
        }
      })
  },

  // 渲染图表（兼容模式）
  renderCharts() {
    // 图表已在 initCharts 中渲染
  },

  // 切换日期范围
  switchDateRange(e) {
    const range = e.currentTarget.dataset.range
    this.setData({ dateRange: range })
    
    // 更新图表数据
    this.updateOrderTrendChart(range)
  },

  // 更新订单趋势图
  updateOrderTrendChart(range) {
    const chart = this.data.orderTrendChart
    if (!chart) return

    let data = []
    let dates = []

    if (range === '近 7 天') {
      dates = ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7']
      data = [120, 200, 150, 80, 70, 110, 130]
    } else if (range === '近 30 天') {
      // 生成 30 天数据
      for (let i = 1; i <= 30; i++) {
        dates.push(`3-${i}`)
        data.push(Math.floor(Math.random() * 200) + 50)
      }
    }

    chart.setOption({
      xAxis: { data: dates },
      series: [{ data: data }]
    })
  },

  // 查看大屏
  goToDashboard() {
    wx.navigateTo({
      url: '/pages/admin/stats/dashboard'
    })
  },

  // 导出数据
  exportData() {
    wx.showModal({
      title: '导出数据',
      content: '数据将导出为 Excel 文件，是否继续？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '导出成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.onLoad().finally(() => {
      wx.stopPullDownRefresh()
    })
  },

  // 图片上传压缩
  async uploadCompressedImage(imagePath) {
    try {
      // 压缩图片
      const compressedPath = await this.compressImage(imagePath, {
        quality: 80,
        maxWidth: 1024
      })
      
      // TODO: 上传到云存储
      // const uploadResult = await wx.cloud.uploadFile({
      //   cloudPath: `stats/${Date.now()}.jpg`,
      //   filePath: compressedPath
      // })
      
      return compressedPath
    } catch (error) {
      console.error('Image upload error:', error)
      throw error
    }
  },

  // 压缩图片
  compressImage(imagePath, options = {}) {
    const { quality = 80, maxWidth = 1024 } = options
    
    return new Promise((resolve, reject) => {
      wx.compressImage({
        src: imagePath,
        quality,
        compressedWidth: maxWidth,
        success: (res) => {
          resolve(res.tempFilePath)
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }
})
