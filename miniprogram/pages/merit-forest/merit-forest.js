// pages/merit-forest/merit-forest.js
Page({
  data: {
    records: [
      {
        id: 1,
        title: '本地原生鱼类放流',
        location: '北京市 · 怀柔水库',
        date: '2023.10.24',
        status: 'approved',
        statusText: '已核准',
        icon: 'water_drop'
      },
      {
        id: 2,
        title: '山林雀类科学回归',
        location: '成都市 · 青城山',
        date: '2023.10.20',
        status: 'checking',
        statusText: '核查中',
        icon: 'nest_eco_leaf'
      },
      {
        id: 3,
        title: '冬日湿地生境维护',
        location: '杭州市 · 西溪湿地',
        date: '2023.09.15',
        status: 'completed',
        statusText: '已圆满',
        icon: 'eco'
      }
    ]
  },

  onInitiateRelease() {
    wx.navigateTo({
      url: '/pages/release/initiate'
    });
  },

  onRecordTap(e) {
    const recordId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/merit-forest/detail?id=${recordId}`
    });
  },

  onSearchLocation() {
    wx.navigateTo({
      url: '/pages/location/search'
    });
  },

  onLoad() {
    console.log('Merit forest page loaded');
  }
});
