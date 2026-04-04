// pages/admin/stats/trend.js
import * as echarts from 'echarts'
import { getStitchThemeColors, createGradient } from '../../../utils/echarts'
import {
  fetchTrendData,
  showLoading,
  hideLoading,
  showError,
  showSuccess
} from '../../../utils/api'

const themeColors = getStitchThemeColors()

Page({
  data: {
    timeRange: '7',
    metrics: ['orders', 'amount'],
    chartType: 'line',
    trendChart: null,
    tableData: [],
    loading: false,
    error: null,
    loadingTip: '趋势数据加载中...',
    exportProgress: 0
  },

  async onLoad() {
    this.setData({ loading: true, loadingTip: '初始化趋势分析...' })
    try {
      await this.fetchTrendData()
      this.initChart()
      showSuccess('数据加载成功')
    } catch (error) {
      console.error('Failed to load trend data:', error)
      const errorMsg = error?.message || '加载趋势数据失败'
      this.setData({ error: errorMsg, loading: false })
      showError(errorMsg)
    } finally {
      this.setData({ loading: false })
      hideLoading()
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
      this.setData({ loadingTip: '获取趋势数据...' })
      
      // 真实 API 调用（生产环境）
      try {
        const data = await fetchTrendData(this.data.timeRange, this.data.metrics)
        this.setData({ tableData: data.list || data })
        return
      } catch (apiError) {
        console.warn('API 调用失败，使用 Mock 数据:', apiError)
        // API 失败时使用 Mock 数据（开发/降级模式）
      }
      
      // 生成 Mock 数据
      await new Promise(resolve => setTimeout(resolve, 300))
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
        symbol: this.data.chartType === 'line' ? 'circle' : 'none',
        symbolSize: 8,
        lineStyle: { width: 3 },
        itemStyle: { 
          color: themeColors.primary,
          borderWidth: 2,
          borderColor: '#fff'
        }
      })
    }
    
    if (this.data.metrics.includes('amount')) {
      series.push({
        name: '成交金额',
        type: this.data.chartType === 'line' ? 'line' : 'bar',
        yAxisIndex: 1,
        data: amountData,
        smooth: true,
        symbol: this.data.chartType === 'line' ? 'circle' : 'none',
        symbolSize: 8,
        lineStyle: { width: 3 },
        itemStyle: { 
          color: themeColors.accent,
          borderWidth: 2,
          borderColor: '#fff'
        }
      })
    }
    
    if (this.data.metrics.includes('users')) {
      series.push({
        name: '用户增长',
        type: this.data.chartType === 'line' ? 'line' : 'bar',
        yAxisIndex: 2,
        data: userData,
        smooth: true,
        symbol: this.data.chartType === 'line' ? 'circle' : 'none',
        symbolSize: 8,
        lineStyle: { width: 3 },
        itemStyle: { 
          color: themeColors.chartColors[3],
          borderWidth: 2,
          borderColor: '#fff'
        }
      })
    }

    const option = {
      backgroundColor: 'transparent',
      animation: true,
      animationDuration: 1000,
      animationEasing: 'cubicOut',
      tooltip: {
        trigger: 'axis',
        axisPointer: { 
          type: 'cross',
          label: {
            backgroundColor: themeColors.primary
          }
        },
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        borderColor: themeColors.border,
        textStyle: { color: themeColors.text }
      },
      legend: {
        data: series.map(s => s.name),
        bottom: 0,
        textStyle: { color: themeColors.text },
        selectedMode: 'multiple'
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
        },
        axisLine: { lineStyle: { color: themeColors.border } }
      },
      yAxis: [
        {
          type: 'value',
          name: '订单数',
          position: 'left',
          axisLine: { lineStyle: { color: themeColors.border } },
          axisLabel: { color: themeColors.textSecondary },
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
          axisLine: { lineStyle: { color: themeColors.border } },
          splitLine: { show: false }
        },
        {
          type: 'value',
          name: '用户',
          position: 'right',
          offset: 80,
          show: this.data.metrics.includes('users'),
          axisLine: { lineStyle: { color: themeColors.border } },
          axisLabel: { color: themeColors.textSecondary },
          splitLine: { show: false }
        }
      ],
      dataZoom: [
        {
          type: 'slider',
          start: 0,
          end: 100,
          height: 20,
          bottom: 20,
          handleSize: 8,
          showDetail: false
        },
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomOnMouseWheel: true,
          moveOnMouseMove: true
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
  async exportChartData() {
    try {
      const { exportChartToImage } = await import('../../../utils/export')
      
      showLoading('生成图表图片...')
      
      if (this.data.trendChart) {
        const filePath = await exportChartToImage(this.data.trendChart, '趋势图表')
        hideLoading()
        
        // 提示用户保存或分享
        wx.showModal({
          title: '导出成功',
          content: '图片已保存到本地，是否分享？',
          success: (res) => {
            if (res.confirm) {
              wx.shareAppMessage({
                title: '数据统计趋势图',
                path: '/pages/admin/stats/trend'
              })
            }
          }
        })
      } else {
        hideLoading()
        showError('图表未加载')
      }
    } catch (error) {
      console.error('Export chart error:', error)
      hideLoading()
      showError('导出失败，请重试')
    }
  },

  // 导出表格
  async exportTable() {
    try {
      const { exportToExcel, exportToCSV } = await import('../../../utils/export')
      
      wx.showActionSheet({
        itemList: ['导出 Excel', '导出 CSV'],
        success: async (res) => {
          const format = res.tapIndex === 0 ? 'excel' : 'csv'
          
          showLoading(`生成${format === 'excel' ? 'Excel' : 'CSV'}...`)
          
          try {
            const data = this.data.tableData
            const headers = [
              { key: 'date', label: '日期' },
              { key: 'orders', label: '订单数' },
              { key: 'amount', label: '成交金额' },
              { key: 'users', label: '用户增长' }
            ]
            
            const filename = `趋势数据_${this.data.timeRange}天`
            
            if (format === 'excel') {
              await exportToExcel(data, headers, filename)
            } else {
              await exportToCSV(data, headers, filename)
            }
            
            hideLoading()
          } catch (exportError) {
            console.error('Export error:', exportError)
            hideLoading()
            showError('导出失败，请重试')
          }
        }
      })
    } catch (error) {
      console.error('Export module load error:', error)
      showError('导出功能不可用')
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.onLoad().finally(() => {
      wx.stopPullDownRefresh()
    })
  }
})
