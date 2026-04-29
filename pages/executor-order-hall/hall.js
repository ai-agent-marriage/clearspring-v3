// 抢单大厅 - O-04
Page({
  data: {
    activeFilter: 'all',
    filters: ['全部订单', '植物类', '菌类', '地理标本'],
    orders: [
      {
        id: '1',
        code: 'DS-8842-X',
        title: '高山雪莲采集',
        price: '2,400',
        time: '02:45:12',
        location: '阿勒泰地区',
        urgent: true,
        team: 4,
        published: '30 分钟前'
      },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
      {
        id: '2',
        code: 'DS-9102-Y',
        title: '原始森林地衣采样',
        price: '850',
        time: '23 小时后截止',
        location: '神农架林区',
        urgent: false,
        published: '2 小时前'
      },
      {
        id: '3',
        code: 'DS-1120-Z',
        title: '珍稀真菌孢子监测',
        price: '5,200',
        time: '2 天后截止',
        location: '云南西双版纳',
        urgent: false,
        highlight: true,
        requirement: '高级资质',
        difficulty: '高难度'
      }
    ]
  },

  onLoad() {
    // 页面加载
  },

  onShow() {
    // 页面显示
  },

  // 切换筛选
  onFilterTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeFilter: index
    });
  },

  // 订单点击
  onOrderTap(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/executor-status/status?id=${orderId}`
    });
  },

  // 承接订单
  onAccept(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认承接',
      content: '确定要承接此订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '承接成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 刷新订单列表
    setTimeout(() => {
      wx.stopPullDownRefresh();
    }, 1000);
  }
});
