// 清如 ClearSpring - 机构端首页

Page({
  data: {
    // 机构信息
    org: {
      name: 'XX 生态护生协会',
      identity: '合规执行机构',
      audited: true,
      totalOrders: 156
    },
    // 核心数据看板
    stats: {
      pendingOrders: 5,
      todayTasks: 3,
      pendingConfirm: 2,
      completedOrders: 150
    },
    // 待办事项
    todos: [
      { type: 'audit', title: '待审核执行材料', count: 3, action: '去审核' },
      { type: 'settle', title: '待结算订单', count: 5, action: '去结算' },
      { type: 'dispute', title: '待处理用户异议', count: 1, action: '去处理' }
    ],
    // 核心功能入口
    functions: [
      { icon: '📋', name: '订单管理', path: '/pages/org-home/orders' },
      { icon: '👥', name: '志愿者管理', path: '/pages/org-home/volunteers' },
      { icon: '💰', name: '结算管理', path: '/pages/org-home/settlement' },
      { icon: '📜', name: '资质管理', path: '/pages/org-home/qualification' }
    ]
  },

  onLoad(options) {
    console.log('机构端首页加载');
    this.loadOrgData();
  },

  onShow() {
    // 每次显示时刷新数据
    this.refreshData();
  },

  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  async loadOrgData() {
    try {
      // TODO: 实际从云函数获取机构数据
      console.log('加载机构数据');
    } catch (error) {
      console.error('加载机构数据失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshData() {
    try {
      // TODO: 实际从云函数刷新数据
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('数据刷新完成');
    } catch (error) {
      console.error('刷新数据失败:', error);
    }
  },

  // ========== 事件处理 ==========
  
  // 切换为祈福者视角
  onSwitchToProtect() {
    wx.showModal({
      title: '切换视角',
      content: '确定要切换为祈福者视角吗？',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 点击待办事项
  onTodoTap(e) {
    const { type, action } = e.currentTarget.dataset;
    console.log('点击待办:', type, action);
    
    switch (type) {
      case 'audit':
        // 跳转到审核页面
        wx.showToast({
          title: '去审核',
          icon: 'none'
        });
        break;
      case 'settle':
        // 跳转到结算页面
        wx.navigateTo({
          url: '/pages/org-home/settlement'
        });
        break;
      case 'dispute':
        // 跳转到异议处理页面
        wx.showToast({
          title: '去处理',
          icon: 'none'
        });
        break;
    }
  },

  // 点击功能入口
  onFunctionTap(e) {
    const { path } = e.currentTarget.dataset;
    console.log('点击功能入口:', path);
    
    if (path) {
      wx.navigateTo({
        url: path
      });
    }
  },

  // 查看订单详情
  onViewOrderDetail() {
    wx.navigateTo({
      url: '/pages/org-home/orders'
    });
  },

  // 通知图标点击
  onNotification() {
    wx.showToast({
      title: '暂无新通知',
      icon: 'none'
    });
  }
});
