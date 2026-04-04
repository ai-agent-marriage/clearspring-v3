// pages/admin/message/index.js
Page({
  data: {
    stats: {
      totalMessages: 1256,
      todayMessages: 89,
      subscriberCount: 456
    },
    menus: [
      {
        icon: '📩',
        name: '订阅消息配置',
        path: '/pages/admin/message/subscribe'
      },
      {
        icon: '📄',
        name: '消息模板管理',
        path: '/pages/admin/message/template'
      },
      {
        icon: '📝',
        name: '消息发送记录',
        path: '/pages/admin/message/records'
      },
      {
        icon: '👥',
        name: '订阅用户管理',
        path: '/pages/admin/message/subscribers'
      }
    ]
  },

  onLoad() {
    this.loadStats()
  },

  // 加载统计数据
  loadStats() {
    // TODO: 从云函数获取真实数据
    // wx.cloud.callFunction({
    //   name: 'getMessageStats',
    //   success: (res) => {
    //     this.setData({ stats: res.result.data })
    //   }
    // })
  },

  // 跳转到菜单页面
  goToMenu(e) {
    const path = e.currentTarget.dataset.path
    wx.navigateTo({
      url: path,
      fail: () => {
        wx.showToast({
          title: '页面开发中',
          icon: 'none'
        })
      }
    })
  },

  // 发送测试消息
  sendTestMessage() {
    wx.showModal({
      title: '发送测试消息',
      content: '将向测试用户发送一条测试消息，是否继续？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '发送成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 查看发送记录
  viewRecords() {
    wx.navigateTo({
      url: '/pages/admin/message/records',
      fail: () => {
        wx.showToast({
          title: '页面开发中',
          icon: 'none'
        })
      }
    })
  }
})
