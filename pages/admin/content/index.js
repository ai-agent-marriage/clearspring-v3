// 清如 ClearSpring - 内容管理系统首页

Page({
  data: {
    // 数据概览
    stats: {
      speciesCount: 52,
      noticeCount: 15,
      helpDocCount: 28
    },
    // 功能菜单
    menus: [
      { icon: '🐟', name: '物种管理', count: 52, path: '/pages/admin/content/species' },
      { icon: '📢', name: '公告管理', count: 15, path: '/pages/admin/content/notice' },
      { icon: '📖', name: '帮助文档', count: 28, path: '/pages/admin/content/help' }
    ]
  },

  onLoad(options) {
    // [CLEANED] console.log('内容管理系统首页加载');
    this.loadStats();
  },

  onShow() {
    // 每次显示时刷新数据
    this.refreshStats();
  },

  onPullDownRefresh() {
    this.refreshStats().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  
  async loadStats() {
    try {
      // TODO: 实际从云函数获取统计数据
      // [CLEANED] console.log('加载统计数据');
    } catch (error) {
      console.error('加载统计数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshStats() {
    try {
      // TODO: 实际从云函数刷新统计数据
      await new Promise(resolve => setTimeout(resolve, 500));
      // [CLEANED] console.log('统计数据刷新完成');
    } catch (error) {
      console.error('刷新统计数据失败:', error);
    }
  },

  // ========== 事件处理 ==========
  
  // 点击功能菜单
  onMenuTap(e) {
    const { path } = e.currentTarget.dataset;
    // [CLEANED] console.log('点击功能菜单:', path);
    
    if (path) {
      wx.navigateTo({
        url: path
      });
    }
  },

  // 新增物种
  onAddSpecies() {
    wx.navigateTo({
      url: '/pages/admin/content/species-edit?action=add'
    });
  },

  // 发布公告
  onAddNotice() {
    wx.navigateTo({
      url: '/pages/admin/content/notice-edit?action=add'
    });
  },

  // 返回上一页
  onBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
