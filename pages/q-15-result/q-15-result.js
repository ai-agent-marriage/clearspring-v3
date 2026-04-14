// 委托结果页面 - Stitch V3.0 规范
Page({
  data: {
    orderId: 'Q20241015001',
    species: '本土石斑鱼',
    execDate: '2024 年 10 月 15 日',
    waterArea: '浙西天目溪自然保护区',
    count: 108,
    totalAmount: '1329.00',
    certificateImage: '/images/certificate-sample.png'
  },

  onLoad(options) {
    // 从上一页获取订单数据
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      })
    }
  },

  // 保存证书
  saveCertificate() {
    wx.showToast({
      title: '正在保存...',
      icon: 'loading'
    })
    
    // TODO: 保存图片到相册
    setTimeout(() => {
      wx.showToast({
        title: '保存成功',
        icon: 'success'
      })
    }, 1000)
  },

  // 查看订单详情
  viewDetails() {
    wx.navigateTo({
      url: `/pages/order-detail/order-detail?orderId=${this.data.orderId}`
    })
  },

  // 分享功德
  shareMerit() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '我刚刚完成了一次护生委托，功德无量！',
      path: `/pages/index/index?inviter=${this.data.orderId}`,
      imageUrl: this.data.certificateImage
    }
  },

  // 分享到朋友圈
  onShareTimeline() {
    return {
      title: '护生功德 · 善缘广结',
      query: `orderId=${this.data.orderId}`,
      imageUrl: this.data.certificateImage
    }
  }
})
