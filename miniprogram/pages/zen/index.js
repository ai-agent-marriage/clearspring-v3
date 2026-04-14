// pages/zen/index.js - 禅理功能页
Page({
  data: {
    zenFeatures: [
      { id: 1, title: '每日禅语', desc: '每日一偈，启迪智慧', icon: '📿' },
      { id: 2, title: '禅修引导', desc: '静心冥想，回归本真', icon: '🧘' },
      { id: 3, title: '经典诵读', desc: '佛经经典，智慧传承', icon: '📖' },
      { id: 4, title: '放生知识', desc: '科学放生，护生护心', icon: '🐟' }
    ]
  },

  onLoad() {
    console.log('禅理页面加载完成');
  },

  // 跳转到每日禅语
  goToDailyZen() {
    wx.navigateTo({
      url: '/pages/zen/daily-zen/daily-zen'
    });
  },

  // 跳转到禅修引导
  goToMeditation() {
    wx.navigateTo({
      url: '/pages/zen/meditation/meditation'
    });
  },

  // 跳转到经典诵读
  goToScripture() {
    wx.navigateTo({
      url: '/pages/zen/scripture/scripture'
    });
  },

  // 跳转到放生知识
  goToKnowledge() {
    wx.navigateTo({
      url: '/pages/wiki/wiki'
    });
  }
});
