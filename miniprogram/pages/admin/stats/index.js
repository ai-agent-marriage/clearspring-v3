// pages/admin/stats/index.js
import * as echarts from 'echarts'
import { initChart, disposeChart } from '../../../utils/echarts'

Page({
  data: {
    stats: {
      totalUsers: 1256,
      totalOrders: 456,
      totalAmount: 125680,
      activeVolunteers: 89
    },
    dateRange: '近 7 天',
    orderTrendChart: null,
    speciesChart: null
  },

  onLoad() {
    this.initCharts()
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
            title: { text: '订单趋势' },
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7']
            },
            yAxis: { type: 'value' },
            series: [{
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'line',
              smooth: true,
              itemStyle: { color: '#4A5D4E' }
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
            title: { text: '物种分布' },
            tooltip: { trigger: 'item' },
            legend: {
              orient: 'horizontal',
              bottom: '0'
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
                borderRadius: 8
              },
              label: {
                formatter: '{b}: {d}%'
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
  }
})
