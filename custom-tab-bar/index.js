/**
 * 自定义 TabBar 组件逻辑
 * Stitch V3.0 规范
 */

Component({
  data: {
    currentIndex: 0,
    animationClass: 'tab-bar-animation',
    // 页面路径配置（需要是 TabBar 页面）
    pages: [
      '/pages/index/index',      // 首页（梵音）
      '/pages/zen/index',        // 禅理
      '/pages/profile/profile'   // 我的
    ]
  },

  lifetimes: {
    attached() {
      // 获取当前页面路径，设置选中状态
      const pages = getCurrentPages();
      const currentPage = pages[pages.length - 1];
      const currentPath = currentPage ? currentPage.route : '';
      
      // 根据当前页面设置选中的 tab
      const index = this.data.pages.findIndex(page => currentPath.includes(page.replace('/pages/', '')));
      if (index !== -1) {
        this.setData({ currentIndex: index });
      }
    }
  },

  methods: {
    /**
     * Tab 点击事件处理
     * @param {Object} e - 事件对象
     */
    onTabTap(e) {
      const { index } = e.currentTarget.dataset;
      const targetPage = this.data.pages[index];
      
      // 如果点击的是当前页面，不重复跳转
      if (index === this.data.currentIndex) {
        return;
      }

      // 切换 Tab
      this.setData({ 
        currentIndex: index,
        animationClass: ''
      });

      // 跳转到目标页面
      wx.switchTab({
        url: targetPage,
        fail: (err) => {
          console.error('Tab 跳转失败:', err);
          wx.showToast({
            title: '页面跳转失败',
            icon: 'none'
          });
        }
      });
    },

    /**
     * 外部调用：设置当前选中的 Tab
     * @param {Number} index - Tab 索引
     */
    setCurrent(index) {
      this.setData({ 
        currentIndex: index,
        animationClass: ''
      });
    }
  }
});
