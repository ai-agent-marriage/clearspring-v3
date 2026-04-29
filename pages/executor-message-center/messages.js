// 清如 ClearSpring - 消息通知页 (O-11)

Page({
  data: {
    currentTab: 'order',
    notificationList: [
      {
        id: 1,
        title: '新订单待承接 - TASK-4021',
        content: '您有一笔新的红锦鲤护生委托订单待承接，请尽快处理。此委托包含三项仪式及配套文疏。',
        time: '2026-04-12 10:30',
        read: false,
        actionType: 'primary',
        actionText: '去处理'
      },
      {
        id: 2,
        title: '订单已完成 - TASK-3988',
        content: '恭喜！您的委托任务"山间禅坐护生"已圆满完成，酬劳已结算至您的钱包。',
        time: '2026-04-11 15:45',
        read: true,
        actionType: 'secondary',
        actionText: '查看详情'
      },
      {
        id: 3,
        title: '护生场地环境预警',
        content: '监测到梵音谷近期水位波动，请在执行任务前务必确认实地安全，佩戴好防护装备。',
        time: '2026-04-11 08:00',
        read: false,
        actionType: 'secondary',
        actionText: '了解风险'
      }
    ]
  },

  onLoad() {
    // [CLEANED] console.log('消息通知页加载');
    // TODO: 加载消息列表
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onMarkAllRead() {
    const list = this.data.notificationList.map(item => ({ ...item, read: true }));
    this.setData({ notificationList: list });
    wx.showToast({ title: '全部已读', icon: 'success' });
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    // TODO: 根据 tab 加载不同消息
  },

  onAction(e) {
    const { id, type } = e.currentTarget.dataset;
    // [CLEANED] console.log('操作消息:', id, type);
    // TODO: 根据消息类型处理
    wx.showToast({ title: '处理中', icon: 'none' });
  }
});
