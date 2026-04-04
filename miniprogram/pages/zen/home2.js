// pages/zen/home2.js
// 功能聚合主页

Page({
  data: {
    todayZen: '积善成德，而神明自得，圣心备焉',
    functions: [
      { icon: '📿', name: '每日一禅', desc: '每日禅理分享', path: '/pages/zen/share' },
      { icon: '🐟', name: '物种查询', desc: '护生物种查询', path: '/pages/zen/species-list' },
      { icon: '📅', name: '佛历吉日', desc: '佛历宜忌查询', path: '' },
      { icon: '📜', name: '功德证书', desc: '我的证书库', path: '' }
    ]
  },

  onLoad() {
    this.loadTodayZen();
  },

  /**
   * 加载今日禅理
   */
  loadTodayZen() {
    const zenQuotes = [
      '积善成德，而神明自得，圣心备焉',
      '勿以恶小而为之，勿以善小而不为',
      '诸恶莫作，众善奉行',
      '慈悲为本，方便为门',
      '随缘消旧业，莫更造新殃'
    ];

    const today = new Date().getDate();
    const index = today % zenQuotes.length;

    this.setData({
      todayZen: zenQuotes[index]
    });
  },

  /**
   * 跳转功能页面
   */
  onFunctionTap(e) {
    const { path } = e.currentTarget.dataset;
    
    if (path) {
      wx.navigateTo({
        url: path
      });
    } else {
      wx.showToast({
        icon: 'none',
        title: '功能开发中'
      });
    }
  },

  /**
   * 跳转护生科普
   */
  onScienceTap() {
    wx.navigateTo({
      url: '/pages/zen/science'
    });
  }
});
