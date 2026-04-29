// 订单管理页面
const auth = require('../../utils/auth');

Page({
  data: {
    currentTab: 0,
    orders: [
      {
        id: '20240501',
        orderNo: '#20240501',
        title: '红锦鲤放生活动',
        date: '2024-05-15',
        location: '西湖·孤山水域',
        organization: '清如公益中心',
        quantity: '500 尾',
        applyTime: '2024-05-01 14:30',
        status: 'pending'
      },
      {
        id: '20240488',
        orderNo: '#20240488',
        title: '白鹭保护计划',
        date: '2024-05-10',
        location: '九溪十八涧',
        organization: '清如公益中心',
        quantity: '200 亩',
        applyTime: '2024-04-28 09:15',
        status: 'processing'
      },
      {
        id: '20240475',
        orderNo: '#20240475',
        title: '古树名木认养',
        date: '2024-04-20',
        location: '灵隐寺',
        organization: '西湖园林局',
        quantity: '3 株',
        applyTime: '2024-04-15 10:00',
        completeTime: '2024-04-20 16:00',
        status: 'completed'
      }
    ]
  },

  onLoad() {
    // 【安全修复】验证管理员登录状态
    if (!auth.requireAdminAuth(this)) {
      return;
    }
    // 加载订单列表
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 显示筛选
  showFilter() {
    // [CLEANED] console.log('显示筛选');
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    // [CLEANED] console.log('搜索关键词:', keyword);
  },

  // 切换 Tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  // 通过订单
  approveOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认通过',
      content: '确认通过该订单审核？',
      success: (res) => {
        if (res.confirm) {
          // [CLEANED] console.log('通过订单:', orderId);
          wx.showToast({
            title: '已通过',
            icon: 'success'
          });
        }
      }
    });
  },

  // 拒绝订单
  rejectOrder(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认拒绝',
      content: '请填写拒绝原因',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          // [CLEANED] console.log('拒绝订单:', orderId, '原因:', res.content);
          wx.showToast({
            title: '已拒绝',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const orderId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-order/detail?id=${orderId}`
    });
  }
});
