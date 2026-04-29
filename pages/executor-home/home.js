// 执行者首页 - O-01
Page({
  data: {
    metrics: {
      pendingTasks: 12,
      todayAppointments: 48,
      pendingPayments: 6,
      totalCompleted: 1284
    },
    todos: [
      {
        id: 1,
        title: '法会场地确认',
        time: '截止 14:00',
        type: 'urgent'
      },
      {
        id: 2,
        title: '义工审核 (8 名)',
        time: '待系统初筛完毕',
        type: 'normal'
      },
      {
        id: 3,
        title: '财务周报复核',
        time: '第 42 周数据汇总',
        type: 'low'
      }
    ]
  },

  onLoad() {
    // 页面加载时的初始化逻辑
  },

  onShow() {
    // 页面显示时的逻辑
  },

  // 订单管理
  onOrderManage() {
    wx.navigateTo({
      url: '/pages/executor-order-hall/hall'
    });
  },

  // 资质审核
  onQualification() {
    wx.navigateTo({
      url: '/pages/executor-qualification/qualification'
    });
  },

  // 财务对账
  onFinance() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 法务合规
  onCompliance() {
    wx.showToast({
      title: '功能开发中',
      icon: 'none'
    });
  },

  // 查看全部待办
  onViewAll() {
    wx.showToast({
      title: '查看全部',
      icon: 'none'
    });
  },

  // 处理待办
  onHandleTodo(e) {
    const index = e.currentTarget.dataset.index;
    const todo = this.data.todos[index];
    wx.showToast({
      title: `处理：${todo.title}`,
      icon: 'none'
    });
  },

  // 以信众视角查看
  onViewAsBeliever() {
    wx.showToast({
      title: '切换视角',
      icon: 'none'
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    // 刷新数据
    wx.stopPullDownRefresh();
  }
});
