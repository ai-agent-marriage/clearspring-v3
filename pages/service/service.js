Page({
  data: {
    services: [
      { id: 1, name: '服务咨询', description: '专业顾问一对一咨询' },
      { id: 2, name: '在线预约', description: '便捷预约，省时省力' },
      { id: 3, name: '进度查询', description: '实时追踪服务进度' },
      { id: 4, name: '售后服务', description: '完善的售后保障' }
    ]
  },

  onLoad() {
    // [CLEANED] console.log('服务页加载完成');
  },

  selectService(e) {
    const index = e.currentTarget.dataset.index;
    wx.showToast({
      title: '即将开放',
      icon: 'none'
    });
  }
});
