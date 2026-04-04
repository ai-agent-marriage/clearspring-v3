// pages/admin/stats/dashboard.js
import * as echarts from 'echarts'

Page({
  data: {
    stats: {
      totalUsers: 1256,
      totalOrders: 456,
      totalAmount: 125680,
      activeVolunteers: 89
    },
    latestOrders: [
      { id: 1, time: '15:58', info: '鱼类保护 - 张三', amount: '299' },
      { id: 2, time: '15:55', info: '鸟类保护 - 李四', amount: '199' },
      { id: 3, time: '15:52', info: '植被修复 - 王五', amount: '399' },
      { id: 4, time: '15:48', info: '鱼类保护 - 赵六', amount: '299' },
      { id: 5, time: '15:45', info: '鸟类保护 - 钱七', amount: '199' },
      { id: 6, time: '15:42', info: '植被修复 - 孙八', amount: '399' }
    ],
    trendChart: null,
    speciesChart: null,
    statusChart: null,
    rankChart: null
  },

  onLoad() {
    this.initCharts()
    // 定时刷新数据
    this.startAutoRefresh()
  },

  onReady() {
    this.renderCharts()
  },

  onUnload() {
    // 停止定时刷新
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer)
    }
    // 清理图表实例
    const charts = ['trendChart', 'speciesChart', 'statusChart', 'rankChart']
    charts.forEach(key => {
      if (this.data[key]) {
        this.data[key].dispose()
      }
    })
  },

  // 初始化图表
  initCharts() {
    const query = wx.createSelectorQuery()

    // 订单趋势图
    query.select('#trendChart')
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
            backgroundColor: 'transparent',
            textStyle: { color: '#ffffff' },
            tooltip: { trigger: 'axis' },
            xAxis: {
              type: 'category',
              data: ['4-1', '4-2', '4-3', '4-4', '4-5', '4-6', '4-7'],
              axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }
            },
            yAxis: {
              type: 'value',
              axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
              splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            series: [{
              data: [120, 200, 150, 80, 70, 110, 130],
              type: 'line',
              smooth: true,
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#FFD700' },
                  { offset: 1, color: '#FFA500' }
                ])
              },
              areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: 'rgba(255, 215, 0, 0.3)' },
                  { offset: 1, color: 'rgba(255, 165, 0, 0.05)' }
                ])
              }
            }]
          }
          
          chart.setOption(option)
          this.setData({ trendChart: chart })
        }
      })

    // 物种分布图
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
            backgroundColor: 'transparent',
            textStyle: { color: '#ffffff' },
            tooltip: { trigger: 'item' },
            legend: {
              orient: 'horizontal',
              bottom: '0',
              textStyle: { color: '#ffffff' }
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
                color: (params) => {
                  const colors = ['#FFD700', '#FFA500', '#FF8C00']
                  return colors[params.dataIndex]
                }
              }
            }]
          }
          
          chart.setOption(option)
          this.setData({ speciesChart: chart })
        }
      })

    // 订单状态分布（环形图）
    query.select('#statusChart')
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
            backgroundColor: 'transparent',
            textStyle: { color: '#ffffff' },
            tooltip: { trigger: 'item' },
            legend: {
              orient: 'vertical',
              left: 'left',
              textStyle: { color: '#ffffff', fontSize: 12 }
            },
            series: [{
              type: 'pie',
              radius: ['40%', '70%'],
              center: ['60%', '50%'],
              data: [
                { value: 120, name: '待承接' },
                { value: 200, name: '待执行' },
                { value: 150, name: '执行中' },
                { value: 80, name: '待确认' },
                { value: 456, name: '已完成' }
              ],
              itemStyle: {
                borderRadius: 5,
                color: (params) => {
                  const colors = ['#909399', '#E6A23C', '#409EFF', '#F56C6C', '#67C23A']
                  return colors[params.dataIndex]
                }
              },
              label: {
                formatter: '{d}%',
                color: '#ffffff'
              }
            }]
          }
          
          chart.setOption(option)
          this.setData({ statusChart: chart })
        }
      })

    // 志愿者排行榜
    query.select('#rankChart')
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
            backgroundColor: 'transparent',
            textStyle: { color: '#ffffff' },
            tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            xAxis: {
              type: 'value',
              axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } },
              splitLine: { lineStyle: { color: 'rgba(255,255,255,0.1)' } }
            },
            yAxis: {
              type: 'category',
              data: ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周七', '吴八', '郑九', '王十'],
              axisLine: { lineStyle: { color: 'rgba(255,255,255,0.3)' } }
            },
            series: [{
              type: 'bar',
              data: [985, 876, 765, 654, 543, 432, 321, 210, 198, 187],
              itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#FFD700' },
                  { offset: 1, color: '#FFA500' }
                ]),
                borderRadius: [0, 10, 10, 0]
              }
            }]
          }
          
          chart.setOption(option)
          this.setData({ rankChart: chart })
        }
      })
  },

  // 渲染图表
  renderCharts() {
    // 图表已在 initCharts 中渲染
  },

  // 开始自动刷新
  startAutoRefresh() {
    this.refreshTimer = setInterval(() => {
      this.refreshData()
    }, 30000) // 每 30 秒刷新一次
  },

  // 刷新数据
  refreshData() {
    // 模拟数据刷新
    const newOrder = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      info: `鱼类保护 - 用户${Math.floor(Math.random() * 1000)}`,
      amount: `${Math.floor(Math.random() * 500) + 100}`
    }
    
    const orders = this.data.latestOrders
    orders.unshift(newOrder)
    orders.pop()
    
    this.setData({ latestOrders: orders })
  }
})
