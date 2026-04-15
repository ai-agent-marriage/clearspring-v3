// 订单详情页面 - Stitch V3.0 规范
Page({
  data: {
    stepIndex: 2, // 当前进度步骤 (0-4)
    progressWidth: 75, // 进度条宽度百分比
    orderId: 'Q16-20231024-8892',
    orderTime: '2023.10.24 09:15',
    execTime: '2023.10.27 14:00',
    waterArea: '太湖自然水域 (No. ZH-0092)',
    species: '中华草龟',
    quantity: '168 尊 (含法物加持)',
    services: '代祈冥福 / 功德碑镌刻',
    wishMessage: '愿法界众生，离苦得乐。家宅安宁，福慧增长。',
    photos: [
      { id: 1, url: '/images/execution-01.jpg', label: '现场照片 01' },
      { id: 2, url: '/images/execution-02.jpg', label: '投放确认单' }
    ],
    orderAmount: '3280.00',
    serviceAmount: '200.00',
    totalAmount: '3480.00',
    transactionId: '4200001928374650091'
  },

  onLoad(options) {
    if (options.orderId) {
      this.setData({
        orderId: options.orderId
      });
    }
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    wx.previewImage({
      urls: this.data.photos.map(p => p.url),
      current: url
    });
  },

  // 申请复核
  onReview() {
    wx.showModal({
      title: '申请复核',
      content: '请说明您需要复核的内容',
      editable: true,
      placeholderText: '请输入复核原因...',
      success: (res) => {
        if (res.confirm && res.content) {
          // TODO: 提交复核申请
          wx.showToast({
            title: '复核申请已提交',
            icon: 'success'
          });
        }
      }
    });
  },

  // 确认圆满完成
  onComplete() {
    wx.showModal({
      title: '确认完成',
      content: '请确认订单已圆满完成？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 提交完成确认
          wx.showToast({
            title: '感谢确认',
            icon: 'success'
          });
          // 跳转到评价页
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/q-17-certificate/q-17-certificate?orderId=' + this.data.orderId
            });
          }, 1500);
        }
      }
    });
  }
});
