// 最终版管理后台首页
Page({
  data: {
    stats: {
      pendingOrders: 24,
      pendingQualifications: 12,
      pendingAppeals: 5,
      completionRate: 98.5
    },
    pendingItems: [
      {
        id: '20240501',
        type: 'order',
        title: '订单 #20240501 - 红锦鲤放生活动',
        time: '提交于 10 分钟前',
        priority: 'urgent',
        badge: '高优先级'
      },
      {
        id: 'ORG20240501',
        type: 'qualification',
        title: '资质申请 - 清如公益中心',
        time: '提交于 30 分钟前',
        priority: 'normal',
        badge: '待审核'
      },
      {
        id: 'AP20240501',
        type: 'appeal',
        title: '申诉 #AP20240501 - 订单取消争议',
        time: '提交于 1 小时前',
        priority: 'normal',
        badge: '待处理'
      }
    ],
    notices: [
      {
        id: 1,
        content: '关于五一期间放生活动管理的通知',
        date: '04-12'
      },
      {
        id: 2,
        content: '系统将于 4 月 20 日凌晨进行维护升级',
        date: '04-10'
      }
    ]
  },

  onLoad() {
    // 页面加载时的初始化逻辑
    this.loadDashboardData();
  },

  // 加载仪表盘数据
  loadDashboardData() {
    // 从服务器获取最新数据
    console.log('加载仪表盘数据');
  },

  // 切换侧边栏
  toggleSidebar() {
    console.log('切换侧边栏');
  },

  // 显示通知
  showNotifications() {
    wx.navigateTo({
      url: '/pages/admin-common/notifications'
    });
  },

  // 跳转到个人资料
  goToProfile() {
    wx.navigateTo({
      url: '/pages/admin-common/profile'
    });
  },

  // 查看数据详情
  viewAllStats() {
    wx.navigateTo({
      url: '/pages/admin-statistics/statistics'
    });
  },

  // 跳转到订单审核
  goToOrderReview() {
    wx.navigateTo({
      url: '/pages/admin-order/order'
    });
  },

  // 跳转到资质审核
  goToQualificationReview() {
    wx.navigateTo({
      url: '/pages/admin-qualification/qualification'
    });
  },

  // 跳转到申诉仲裁
  goToAppealReview() {
    wx.navigateTo({
      url: '/pages/admin-appeal/appeal'
    });
  },

  // 创建订单
  createOrder() {
    wx.navigateTo({
      url: '/pages/admin-order/create'
    });
  },

  // 导出报表
  exportReport() {
    wx.showActionSheet({
      itemList: ['导出 Excel', '导出 PDF', '导出 CSV'],
      success: (res) => {
        console.log('导出报表类型:', res.tapIndex);
      }
    });
  },

  // 群发消息
  sendMessage() {
    wx.navigateTo({
      url: '/pages/admin-common/message'
    });
  },

  // 查看系统设置
  viewSettings() {
    wx.navigateTo({
      url: '/pages/admin-common/settings'
    });
  },

  // 查看全部待处理事项
  viewAllPending() {
    wx.navigateTo({
      url: '/pages/admin-common/pending-list'
    });
  },

  // 处理待处理事项
  handlePending(e) {
    const { type, id } = e.currentTarget.dataset;
    const urlMap = {
      order: `/pages/admin-order/detail?id=${id}`,
      qualification: `/pages/admin-qualification/detail?id=${id}`,
      appeal: `/pages/admin-appeal/detail?id=${id}`
    };
    wx.navigateTo({
      url: urlMap[type]
    });
  },

  // 查看全部公告
  viewAllNotices() {
    wx.navigateTo({
      url: '/pages/admin-common/notices'
    });
  }
});
