// 清如 ClearSpring - 结算管理页 (O-09)

Page({
  data: {
    currentTab: 'pending',
    orderList: [
      {
        id: 'ORD-20231024-001',
        series: '禅意茶修系列',
        title: '深山寂静·冥想工作坊 (A-12)',
        time: '2023-10-24 14:30',
        settlement: '预计结算：T+3',
        amount: '¥ 1,280.00'
      },
      {
        id: 'ORD-20231024-042',
        series: '自然疗愈项目',
        title: '晨间梵音·林间呼吸课程',
        time: '2023-10-24 09:15',
        settlement: '预计结算：T+3',
        amount: '¥ 860.00'
      }
    ]
  },

  onLoad() {
    // [CLEANED] console.log('结算管理页加载');
    // TODO: 加载结算数据
  },

  onMenu() {
    wx.showToast({ title: '菜单', icon: 'none' });
  },

  onSettings() {
    wx.showToast({ title: '设置', icon: 'none' });
  },

  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab });
    // TODO: 根据 tab 加载不同数据
  },

  onFilter() {
    wx.showToast({ title: '筛选', icon: 'none' });
  },

  onDetail(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('查看详情:', id);
    // TODO: 跳转到订单详情
    wx.showToast({ title: '查看详情', icon: 'none' });
  },

  onLoadMore() {
    wx.showToast({ title: '加载更多', icon: 'none' });
  }
});
