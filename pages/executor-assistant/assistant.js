// 任务助手 - O-05
Page({
  data: {
    currentStep: 2,
    steps: [
      { label: '已承接', completed: true },
      { label: '待分配', active: true },
      { label: '已执行', completed: false },
      { label: '待审核', completed: false },
      { label: '已提交', completed: false },
      { label: '已完成', completed: false }
    ],
    orderInfo: {
      id: 'ORD-2024-001',
      species: '红锦鲤',
      quantity: '5,000 尾',
      date: '2024.05.20',
      location: '翠湖自然保护区'
    },
    volunteerAssigned: false,
    environment: {
      site: '东侧浅滩',
      weather: '晴 24°C',
      phLevel: '7.2 Neutral'
    }
  },

  onLoad() {
    // 页面加载
  },

  onShow() {
    // 页面显示
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 更多操作
  onMore() {
    wx.showActionSheet({
      itemList: ['分享订单', '查看帮助', '联系客服'],
      success: (res) => {
        if (res.tapIndex === 0) {
          wx.showToast({ title: '分享订单', icon: 'none' });
        } else if (res.tapIndex === 1) {
          wx.showToast({ title: '查看帮助', icon: 'none' });
        } else if (res.tapIndex === 2) {
          wx.showToast({ title: '联系客服', icon: 'none' });
        }
      }
    });
  },

  // 分配志愿者
  onAssignVolunteer() {
    wx.navigateTo({
      url: '/pages/executor-qualification/qualification'
    });
  }
});
