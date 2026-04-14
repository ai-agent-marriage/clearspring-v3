// 管理后台首页
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
        id: 1,
        title: '订单 #20240501 - 红锦鲤放生活动',
        time: '提交于 10 分钟前',
        priority: 'urgent',
        badge: '高优先级'
      },
      {
        id: 2,
        title: '资质申请 - 清如公益中心',
        time: '提交于 30 分钟前',
        priority: 'normal',
        badge: '待审核'
      },
      {
        id: 3,
        title: '申诉 #AP20240488 - 订单取消争议',
        time: '提交于 1 小时前',
        priority: 'normal',
        badge: '待处理'
      }
    ]
  },

  onLoad() {
    // 页面加载时的初始化逻辑
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

  // 查看全部待处理事项
  viewAllPending() {
    // 可以跳转到待处理事项列表页
    console.log('查看全部待处理事项');
  }
});
