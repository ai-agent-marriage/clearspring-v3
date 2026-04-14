// custom-tab-bar/index.js
Component({
  data: {
    current: 0,
    isIphoneX: false
  },

  methods: {
    onTabTap(e) {
      const index = e.currentTarget.dataset.index;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = currentPage.route;

      const tabPaths = [
        '/pages/audio/audio',
        '/pages/zen/zen',
        '/pages/profile/profile'
      ];

      if (currentPath !== tabPaths[index].replace('/pages/', '').split('/').slice(1).join('/')) {
        wx.switchTab({
          url: tabPaths[index]
        });
      }

      this.setData({ current: index });
    }
  },

  ready() {
    const systemInfo = wx.getSystemInfoSync();
    this.setData({
      isIphoneX: systemInfo.safeArea && systemInfo.safeArea.bottom !== systemInfo.screenHeight
    });
  }
});
