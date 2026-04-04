// pages/admin/stats/trend.js
import * as echarts from 'echarts'
import { getStitchThemeColors } from '../../../utils/echarts'

const themeColors = getStitchThemeColors()

Page({
  data: {
    timeRange: '7',
    metrics: ['orders', 'amount'],
    chartType: 'line',
    trendChart: null,
    tableData: [],
    loading: false,
    error: null
  },

  async onLoad() {
    this.setData({ loading: true })
    try {
      await this.fetchTrendData()
    } catch (error) {
      console.error('Failed to load trend data:', error)
      this.setData({ error: '加载趋势数据失败' })
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  onReady() {
    this.initChart()
  },

  onUnload() {
    if (this.data.trendChart) {
      this.data.trendChart.dispose()
    }
  },

  // 获取趋势数据
  async fetchTrendData() {
    try {
      // TODO: 替换为真实 API 调用
      // const res = await wx.cloud.callFunction({
      //   name: 'stats',
      //   data: { action: 'getTrendData', timeRange: this.data.timeRange }
      // })
      
      // 模拟 API 延迟
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 生成 Mock 数据
      this.generateTableData()
    } catch (error) {
      console.error('Fetch trend error:', error)
      throw error
    }
  },

  // 生成表格数据
  generateTableData() {
    const days = this.data.timeRange === '7' ? 7 : this.data.timeRange === '30' ? 30 : 90
    const data = []
    
    for (let i = days; i >= 1; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = `${date.getMonth() + 1}-${date.getDate()}`
      
      data.push({
        date: dateStr,
        orders: Math.floor(Math.random() * 200) + 50,
        amount: Math.floor(Math.random() * 50000) + 10000,
        users: Math.floor(Math.random() * 50) + 10
      })
    }
    
    this.setData({ tableData: data })
  },

  // 初始化图表
  initChart() {
    const query = wx.createSelectorQuery()
    
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
          
          this.renderChart(chart)
          this.setData({ trendChart: chart })
        }
      })
  },

  // 渲染图表
  renderChart(chart) {
    const data = this.data.tableData
    const dates = data.map(item => item.date)
    const orderData = data.map(item => item.orders)
    const amountData = data.map(item => item.amount)
    const userData = data.map(item => item.users)

    const series = []
    
    if (this.data.metrics.includes('orders')) {
      series.push({
        name: '订单数',
        type: this.data.chartType === 'line' ? 'line' : 'bar',
        data: orderData,
        smooth: true,
        itemStyle: { color: themeColors.primary }
      })
    }
    
    if (this.data.metrics.includes('amount')) {
      series.push({
        name: '成交金额',
        type: this.data.chartType === 'line' ? 'line' : 'bar',
        yAxisIndex: 1,
        data: amountData,
        smooth: true,
        itemStyle: { color: themeColors.accent }
      })
    }
    
    if (this.data.metrics.includes('users')) {
      series.push({
        name: '用户增长',
        type: this.data.chartType === 'line' ? 'line' : 'bar',
        yAxisIndex: 2,
        data: userData,
        smooth: true,
        itemStyle: { color: themeColors.chartColors[3] }
      })
    }

    const option = {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0,
        textStyle: { color: themeColors.text }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          rotate: 45,
          color: themeColors.textSecondary
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '订单数',
          position: 'left',
          axisLine: { lineStyle: { color: themeColors.border } },
          splitLine: { lineStyle: { color: 'rgba(74, 93, 78, 0.1)' } }
        },
        {
          type: 'value',
          name: '金额',
          position: 'right',
          axisLabel: {
            formatter: '{value}元',
            color: themeColors.textSecondary
          },
          axisLine: { lineStyle: { color: themeColors.border } }
        },
        {
          type: 'value',
          name: '用户',
          position: 'right',
          offset: 80,
          show: this.data.metrics.includes('users'),
          axisLine: { lineStyle: { color: themeColors.border } }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100
        },
        {
          type: 'inside',
          start: 0,
          end: 100
        }
      ],
      series: series
    }

    chart.setOption(option)
  },

  // 选择时间范围
  selectTimeRange(e) {
    const range = e.currentTarget.dataset.range
    this.setData({ timeRange: range })
    this.generateTableData()
    
    if (this.data.trendChart) {
      this.renderChart(this.data.trendChart)
    }
  },

  // 切换指标
  toggleMetric(e) {
    const metric = e.currentTarget.dataset.metric
    const metrics = this.data.metrics
    
    const index = metrics.indexOf(metric)
    if (index > -1) {
      metrics.splice(index, 1)
    } else {
      metrics.push(metric)
    }
    
    this.setData({ metrics })
    
    if (this.data.trendChart) {
      this.renderChart(this.data.trendChart)
    }
  },

  // 切换图表类型
  toggleChartType() {
    const type = this.data.chartType === 'line' ? 'bar' : 'line'
    this.setData({ chartType: type })
    
    if (this.data.trendChart) {
      this.renderChart(this.data.trendChart)
    }
  },

  // 导出图表数据
  exportChartData() {
    wx.showToast({
      title: '导出成功',
      icon: 'success'
    })
  },

  // 导出表格
  exportTable() {
    wx.showToast({
      title: 'Excel 导出成功',
      icon: 'success'
    })
  }
})
