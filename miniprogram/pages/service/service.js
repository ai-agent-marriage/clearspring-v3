// pages/service/service.js
Page({
  data: {
    services: [
      { type: 'release', title: '自主放生', desc: '自行选择物种，合规放生', icon: 'water_drop' },
      { type: 'entrust', title: '委托放生', desc: '专业团队，科学执行', icon: 'assignment' },
      { type: 'query', title: '合规查询', desc: '查询可放生物种及水域', icon: 'search' },
      { type: 'certificate', title: '证书获取', desc: '查看电子功德证书', icon: 'workspace_premium' }
    ]
  },

  onCategoryTap(e) {
    const type = e.currentTarget.dataset.type;
    switch (type) {
      case 'release':
        wx.navigateTo({ url: '/pages/release/initiate' });
        break;
      case 'entrust':
        wx.navigateTo({ url: '/pages/entrust/list' });
        break;
      case 'query':
        wx.navigateTo({ url: '/pages/location/search' });
        break;
      case 'certificate':
        wx.navigateTo({ url: '/pages/certificate/list' });
        break;
    }
  },

  onContact() {
    wx.makePhoneCall({
      phoneNumber: '400-123-4567'
    });
  },

  onLoad() {
    console.log('Service page loaded');
  }
});
