Page({
  data: {
    service: {
      name: '静心梵音 · 祈福护生服务',
      orderId: 'BF88293041',
      image: '/images/service-preview.jpg'
    },
    rating: 0,
    ratingFeedback: '',
    feedback: '',
    photos: [],
    isAnonymous: false
  },

  onLoad() {
    // 加载订单信息
    // const orderId = this.options.id
  },

  // 评分
  onRate(e) {
    const rating = e.currentTarget.dataset.rating
    const feedbacks = ['', '感恩相遇', '善心初现', '法喜充满', '功德无量', '善心流转，法喜充满']
    this.setData({
      rating,
      ratingFeedback: feedbacks[rating]
    })
  },

  // 反馈输入
  onFeedbackInput(e) {
    this.setData({
      feedback: e.detail.value
    })
  },

  // 添加照片
  onAddPhoto() {
    wx.chooseMedia({
      count: 6,
      mediaType: ['image'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(file => file.tempFilePath)
        this.setData({
          photos: [...this.data.photos, ...newPhotos]
        })
      }
    })
  },

  // 匿名分享
  onAnonymousChange(e) {
    this.setData({
      isAnonymous: e.detail.value
    })
  },

  // 提交评价
  onSubmit() {
    if (this.data.rating === 0) {
      wx.showToast({
        title: '请先评分',
        icon: 'none'
      })
      return
    }

    wx.showLoading({
      title: '提交中...'
    })

    // TODO: 调用 API 提交评价
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      })
      setTimeout(() => {
        wx.navigateBack()
      }, 1500)
    }, 1000)
  }
})
