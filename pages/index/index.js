Page({
  data: {
    services: [
      { id: 1, name: '服务咨询', icon: '/images/service.png' },
      { id: 2, name: '在线预约', icon: '/images/service.png' },
      { id: 3, name: '进度查询', icon: '/images/service.png' },
      { id: 4, name: '客户服务', icon: '/images/service.png' }
    ],
    notices: [
      { id: 1, title: '欢迎使用清如 ClearSpring 服务', date: '2026-03-28' }
    ]
  },

  onLoad() {
    // [CLEANED] console.log('首页加载完成');
  },

  goToService(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/service/service'
    });
  }
});
