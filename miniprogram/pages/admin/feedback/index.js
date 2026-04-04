// pages/admin/feedback/index.js
Page({
  data: {
    stats: {
      totalFeedback: 256,
      pendingFeedback: 12,
      processedFeedback: 244
    },
    menus: [
      { icon: '📝', name: '反馈提交', path: '/pages/admin/feedback/submit' },
      { icon: '📋', name: '反馈管理', path: '/pages/admin/feedback/manage' },
      { icon: '📊', name: '反馈统计', path: '/pages/admin/feedback/stats' },
      { icon: '⚙️', name: '反馈设置', path: '/pages/admin/feedback/settings' }
    ]
  },

  onLoad() {
    // 加载反馈统计数据
    this.loadFeedbackStats();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadFeedbackStats();
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.loadFeedbackStats().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载反馈统计数据
  loadFeedbackStats() {
    return new Promise((resolve) => {
      // TODO: 替换为实际 API 调用
      // api.getFeedbackStats().then(res => { ... })
      
      // 模拟数据加载
      setTimeout(() => {
        this.setData({
          stats: {
            totalFeedback: 256,
            pendingFeedback: 12,
            processedFeedback: 244
          }
        });
        resolve();
      }, 300);
    });
  },

  // 菜单点击事件
  onMenuTap(e) {
    const { path } = e.currentTarget.dataset;
    if (path) {
      wx.navigateTo({
        url: path,
        fail: () => {
          wx.showToast({
            title: '页面暂未开放',
            icon: 'none'
          });
        }
      });
    }
  },

  // 提交反馈
  onSubmitFeedback() {
    wx.navigateTo({
      url: '/pages/admin/feedback/submit'
    });
  },

  // 查看待处理
  onViewPending() {
    wx.navigateTo({
      url: '/pages/admin/feedback/manage?status=pending'
    });
  }
});
