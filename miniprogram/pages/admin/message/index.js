// pages/admin/message/index.js
Page({
  data: {
    stats: {
      totalMessages: 0,
      todayMessages: 0,
      subscriberCount: 0,
      failedMessages: 0
    },
    menus: [
      {
        icon: 'subscribe',
        name: '订阅配置',
        path: '/pages/admin/message/subscribe',
        color: '#4A5D4E'
      },
      {
        icon: 'template',
        name: '模板管理',
        path: '/pages/admin/message/template',
        color: '#5B7C6A'
      },
      {
        icon: 'records',
        name: '发送记录',
        path: '/pages/admin/message/records',
        color: '#6B8C7A'
      },
      {
        icon: 'subscribers',
        name: '订阅用户',
        path: '/pages/admin/message/subscribers',
        color: '#7B9C8A'
      }
    ],
    unreadCount: 0,
    loading: false,
    lastUpdateTime: null
  },

  onLoad() {
    this.loadStats()
    this.loadUnreadCount()
    // 启动定时刷新（每 30 秒）
    this.startAutoRefresh()
  },

  onUnload() {
    // 清理定时器
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer)
    }
  },

  // 启动自动刷新
  startAutoRefresh() {
    this.refreshTimer = setTimeout(() => {
      this.loadStats()
      this.loadUnreadCount()
      this.startAutoRefresh()
    }, 30000)
  },

  // 加载统计数据（实时数据接入）
  loadStats() {
    this.setData({ loading: true })
    
    // 模拟云函数调用（实际使用时取消注释）
    // wx.cloud.callFunction({
    //   name: 'getMessageStats',
    //   success: (res) => {
    //     this.setData({ 
    //       stats: res.result.data,
    //       lastUpdateTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
    //     })
    //   },
    //   fail: () => {
    //     wx.showToast({ title: '数据加载失败', icon: 'none' })
    //   },
    //   complete: () => {
    //     this.setData({ loading: false })
    //   }
    // })
    
    // 模拟数据（演示用）
    setTimeout(() => {
      this.setData({
        stats: {
          totalMessages: 1256,
          todayMessages: 89,
          subscriberCount: 456,
          failedMessages: 3
        },
        lastUpdateTime: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        loading: false
      })
    }, 500)
  },

  // 加载未读消息数
  loadUnreadCount() {
    // wx.cloud.callFunction({
    //   name: 'getUnreadMessageCount',
    //   success: (res) => {
    //     this.setData({ unreadCount: res.result.count || 0 })
    //   }
    // })
    
    // 模拟数据
    this.setData({ unreadCount: 5 })
  },

  // 跳转到菜单页面（带点击反馈）
  goToMenu(e) {
    const path = e.currentTarget.dataset.path
    const name = e.currentTarget.dataset.name
    
    // 点击反馈
    wx.vibrateShort({ type: 'light' })
    
    wx.navigateTo({
      url: path,
      fail: () => {
        wx.showToast({
          title: `${name}页面开发中`,
          icon: 'none'
        })
      }
    })
  },

  // 发送测试消息（优化反馈）
  sendTestMessage() {
    wx.vibrateShort({ type: 'medium' })
    
    wx.showLoading({ title: '发送中...' })
    
    // 模拟发送
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '发送成功',
        icon: 'success',
        duration: 2000
      })
      
      // 刷新统计
      this.loadStats()
    }, 1000)
  },

  // 查看发送记录
  viewRecords() {
    wx.vibrateShort({ type: 'light' })
    
    wx.navigateTo({
      url: '/pages/admin/message/records',
      fail: () => {
        wx.showToast({
          title: '页面开发中',
          icon: 'none'
        })
      }
    })
  },

  // 下拉刷新
  onPullDownRefresh() {
    Promise.all([
      this.loadStats(),
      this.loadUnreadCount()
    ]).then(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      })
    })
  }
})
