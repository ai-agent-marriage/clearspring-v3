Page({
  data: {
    currentTab: 0,
    records: [
      { id: 1, title: '本地原生鱼类放流', location: '北京市 · 怀柔水库', date: '2023.10.24', status: 'approved', icon: 'water_drop' },
      { id: 2, title: '山林雀类科学回归', location: '成都市 · 青城山', date: '2023.10.20', status: 'checking', icon: 'nest_eco_leaf' },
      { id: 3, title: '冬日湿地生境维护', location: '杭州市 · 西溪湿地', date: '2023.09.15', status: 'completed', icon: 'eco' }
    ]
  },

  onLoad() {
    // 加载护生记录
  },

  // 切换 Tab
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({
      currentTab: parseInt(tab)
    })
  },

  // 发起护生登记
  onInitiateProtect() {
    wx.navigateTo({
      url: '/pages/protect/register'
    })
  },

  // 查看记录详情
  onRecordTap(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: `/pages/protect/detail?id=${id}`
    })
  },

  // 合规水域查询
  onSearchWater() {
    wx.navigateTo({
      url: '/pages/protect/water-search'
    })
  }
})
