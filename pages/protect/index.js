Page({
  data: {
    tabs: ['自主护生登记', '委托护生服务'],
    activeTab: 0,
    protectRecords: [
      { id: 1, speciesName: '鲢鱼', quantity: 100, address: '珠江广州段', date: '2026-04-04' },
      { id: 2, speciesName: '鳙鱼', quantity: 50, address: '东江东莞段', date: '2026-04-03' }
    ],
    orders: [
      { orderNo: 'PRO202604040001', speciesName: '鲢鱼', quantity: 10, amount: 299, status: 5 }
    ]
  },

  onLoad() {
    console.log('护生功德林页面加载完成');
  },

  // Tab 切换
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({ activeTab: index });
  },

  // 发起自主护生登记
  goToRegister() {
    wx.navigateTo({
      url: '/pages/protect/register'
    });
  },

  // 发起护生委托
  goToOrder() {
    // 二次合规承诺确认弹窗前置
    wx.showModal({
      title: '合规承诺确认',
      content: '请确认您已了解并承诺遵守《科学护生合规承诺书》的所有条款，委托护生服务需确保物种、水域、数量均符合当地法规要求。',
      confirmText: '我已知晓',
      cancelText: '再看看',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/order/order'
          });
        }
      }
    });
  },

  // 查看记录详情
  viewRecord(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/protect/detail?id=${id}`
    });
  },

  // 合规水域查询
  goToWaterAreaQuery() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  }
});
