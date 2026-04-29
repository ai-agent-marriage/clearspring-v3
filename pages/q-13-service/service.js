// 服务页面 - Stitch V3.0 规范 (Q-13)
Page({
  data: {
    services: [
      {
        id: 1,
        title: '祈福服务',
        icon: 'prayer',
        description: '在线祈福，传递美好祝愿'
      },
      {
        id: 2,
        title: '功德林',
        icon: 'forest',
        description: '积累功德，滋养心灵'
      },
      {
        id: 3,
        title: '证书申请',
        icon: 'certificate',
        description: '获取公益参与证书'
      },
      {
        id: 4,
        title: '帮助中心',
        icon: 'help',
        description: '常见问题解答'
      }
    ]
  },

  onLoad() {
    // 加载服务列表
  },

  /**
   * 跳转到服务详情页
   */
  navigateToService(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/service-detail/service-detail?id=${id}`
    });
  }
});
