// custom-tab-bar/index.js
Component({
  data: {
    selected: 0
  },

  methods: {
    switchTab(e) {
      const index = e.currentTarget.dataset.index;
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = currentPage.route;

      // 3 个 Tab：梵音/禅理/我的
      const tabPaths = [
        'pages/audio/index',
        'pages/zen/index',
        'pages/profile/index'
      ];

      if (currentPath !== tabPaths[index]) {
        wx.switchTab({
          url: '/' + tabPaths[index]
        });
      }

      this.setData({ selected: index });
    }
  }
});
