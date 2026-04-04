// pages/admin/message/records.js
Page({
  data: {
    showFilter: false,
    filterDateRange: '近 7 天',
    filterType: 'all',
    filterStatus: 'all',
    records: [
      {
        id: 1,
        title: '订单创建通知',
        recipient: '张三',
        sendTime: '2026-04-07 10:00:00',
        status: 1,
        statusName: '成功',
        content: '您有新的护生订单，订单号：PRO202604070001'
      },
      {
        id: 2,
        title: '订单完成通知',
        recipient: '李四',
        sendTime: '2026-04-07 09:30:00',
        status: 1,
        statusName: '成功',
        content: '您的护生订单已完成，感谢您的参与！'
      },
      {
        id: 3,
        title: '系统通知',
        recipient: '王五',
        sendTime: '2026-04-06 15:20:00',
        status: 0,
        statusName: '失败',
        content: '系统维护通知'
      },
      {
        id: 4,
        title: '订单创建通知',
        recipient: '赵六',
        sendTime: '2026-04-06 11:00:00',
        status: 1,
        statusName: '成功',
        content: '您有新的护生订单，订单号：PRO202604060001'
      },
      {
        id: 5,
        title: '订单取消通知',
        recipient: '孙七',
        sendTime: '2026-04-05 16:45:00',
        status: 1,
        statusName: '成功',
        content: '您的订单已取消，如有问题请联系客服'
      }
    ],
    dateRangeOptions: ['近 7 天', '近 30 天', '自定义'],
    typeOptions: [
      { label: '全部', value: 'all' },
      { label: '订单通知', value: 'order' },
      { label: '系统通知', value: 'system' }
    ],
    statusOptions: [
      { label: '全部', value: 'all' },
      { label: '成功', value: 'success' },
      { label: '失败', value: 'failed' }
    ]
  },

  onLoad() {
    this.loadRecords()
  },

  // 加载消息记录
  loadRecords() {
    // TODO: 从云函数获取真实数据
    // wx.cloud.callFunction({
    //   name: 'getMessageRecords',
    //   data: {
    //     dateRange: this.data.filterDateRange,
    //     type: this.data.filterType,
    //     status: this.data.filterStatus
    //   },
    //   success: (res) => {
    //     this.setData({ records: res.result.data })
    //   }
    // })
  },

  // 切换筛选栏
  toggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    })
  },

  // 日期范围选择
  onDateRangeChange(e) {
    const value = e.detail.value
    const range = this.data.dateRangeOptions[value]
    this.setData({ filterDateRange: range })
  },

  // 消息类型选择
  onTypeChange(e) {
    const value = e.detail.value
    this.setData({ filterType: value })
  },

  // 发送状态选择
  onStatusChange(e) {
    const value = e.detail.value
    this.setData({ filterStatus: value })
  },

  // 应用筛选
  applyFilter() {
    this.setData({ showFilter: false })
    this.loadRecords()
    
    wx.showToast({
      title: '筛选完成',
      icon: 'success'
    })
  },

  // 重置筛选
  resetFilter() {
    this.setData({
      filterDateRange: '近 7 天',
      filterType: 'all',
      filterStatus: 'all'
    })
  },

  // 查看详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index
    const record = this.data.records[index]
    
    wx.showModal({
      title: record.title,
      content: record.content,
      showCancel: false,
      confirmText: '关闭',
      confirmColor: '#4A5D4E'
    })
  },

  // 重新发送
  resend(e) {
    const index = e.currentTarget.dataset.index
    const record = this.data.records[index]
    
    wx.showModal({
      title: '重新发送',
      content: `将向"${record.recipient}"重新发送消息，是否继续？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '发送成功',
            icon: 'success'
          })
          
          // 更新状态
          const key = `records[${index}].status`
          const statusNameKey = `records[${index}].statusName`
          this.setData({
            [key]: 1,
            [statusNameKey]: '成功'
          })
        }
      }
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
