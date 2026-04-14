// 清如 ClearSpring - 志愿者详情页 (O-07)

Page({
  data: {
    currentTab: 'execution',
    volunteer: {
      avatar: 'https://example.com/avatar.jpg',
      name: '林清和',
      location: '杭州市·西湖区',
      quote: '静心服务，行善如水。',
      metrics: {
        tasks: 142,
        hours: '680h',
        compliance: '98.5%'
      }
    },
    taskList: [
      {
        id: '#TASK-8821',
        type: '文化导览',
        title: '灵隐景区春季志愿导览',
        date: '2023.10.24 09:00'
      },
      {
        id: '#TASK-7734',
        type: '助残服务',
        title: '阳光社区康复陪伴项目',
        date: '2023.10.18 14:30'
      },
      {
        id: '#TASK-6902',
        type: '环境保护',
        title: '西湖水域环保巡查志愿',
        date: '2023.10.12 08:00'
      }
    ]
  },

  onLoad(options) {
    console.log('志愿者详情页加载，志愿者 ID:', options.id);
    // TODO: 根据 options.id 加载志愿者数据
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    // TODO: 根据 tab 加载不同的数据
  },

  onAssignTask() {
    // TODO: 跳转到分配任务页面
    wx.showToast({
      title: '分配新任务',
      icon: 'none'
    });
  },

  onUnbind() {
    wx.showModal({
      title: '确认解绑',
      content: '确定要解绑该志愿者吗？',
      confirmText: '解绑',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用解绑接口
          wx.showToast({
            title: '已解绑',
            icon: 'success'
          });
        }
      }
    });
  }
});
