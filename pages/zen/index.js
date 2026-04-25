Page({
  data: {
    dailyQuote: '菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。',
    zenSource: '六祖坛经',
    zenList: [
      { id: 1, date: '04-24', quote: '行住坐卧，无非是道。' },
      { id: 2, date: '04-23', quote: '一念放下，万般自在。' },
      { id: 3, date: '04-22', quote: '心若无尘，岁月静好。' },
      { id: 4, date: '04-21', quote: '随缘不变，不变随缘。' },
      { id: 5, date: '04-20', quote: '一切有为法，如梦幻泡影。' }
    ]
  },

  onLoad() {
    this.loadDailyZen();
  },

  /**
   * 加载今日禅理
   */
  loadDailyZen() {
    const quotes = [
      { text: '菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。', source: '六祖坛经' },
      { text: '心如工画师，能画诸世间。五蕴悉从生，无法而不造。', source: '华严经' },
      { text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', source: '金刚经' },
      { text: '色不异空，空不异色，色即是空，空即是色。', source: '心经' },
      { text: '应无所住，而生其心。', source: '金刚经' },
      { text: '行住坐卧，无非是道。', source: '禅宗公案' },
      { text: '一念放下，万般自在。', source: '禅宗语录' }
    ];
    const today = new Date();
    const index = today.getDate() % quotes.length;
    this.setData({
      dailyQuote: quotes[index].text,
      zenSource: quotes[index].source
    });
  },

  goToDailyZen() {
    wx.navigateTo({ url: '/pages/zen-daily/zen-daily' });
  },

  goToCalendar() {
    wx.navigateTo({ url: '/pages/lunar-calendar/lunar-calendar' });
  },

  goToCollection() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToShare() {
    wx.showToast({ title: '功能开发中', icon: 'none' });
  },

  goToAudio() {
    wx.switchTab({ url: '/pages/index/index' });
  },

  goToZenDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.showToast({ title: `禅理 ${id} 详情页开发中`, icon: 'none' });
  }
});
