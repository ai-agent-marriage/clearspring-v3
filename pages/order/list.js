// pages/order/list.js - 我的委托订单列表页
Page({
  data: {
    tabs: ['全部', '待承接', '待执行', '执行中', '待确认', '已完成', '已取消'],
    activeTab: 0,
    orders: [
      {
        orderNo: 'PRO202604070001',
        speciesName: '鲢鱼',
        quantity: 10,
        amount: 299,
        status: 5,
        statusName: '已完成',
        address: '珠江广州段',
        executeDate: '2026-04-15',
        orgName: 'XX 生态护生协会'
      },
      {
        orderNo: 'PRO202604060002',
        speciesName: '鳙鱼',
        quantity: 5,
        amount: 199,
        status: 3,
        statusName: '执行中',
        address: '东江东莞段',
        executeDate: '2026-04-10',
        orgName: 'XX 生态保护中心'
      },
      {
        orderNo: 'PRO202604050003',
        speciesName: '草鱼',
        quantity: 8,
        amount: 279,
        status: 1,
        statusName: '待承接',
        address: '北江清远段',
        executeDate: '2026-04-20',
        orgName: ''
      }
    ]
  },

  onLoad() {
    console.log('订单列表页加载完成');
  },

  // Tab 切换
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeTab: index
    });
  },

  // 获取状态对应的样式类
  getStatusClass(status) {
    const statusMap = {
      1: 'status-pending',    // 待承接
      2: 'status-waiting',    // 待执行
      3: 'status-processing', // 执行中
      4: 'status-confirm',    // 待确认
      5: 'status-completed',  // 已完成
      6: 'status-cancelled'   // 已取消
    };
    return statusMap[status] || '';
  },

  // 筛选订单
  getFilteredOrders() {
    const { activeTab, orders } = this.data;
    if (activeTab === 0) return orders;
    return orders.filter(order => order.status === activeTab);
  },

  // 取消订单
  cancelOrder(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '确认取消',
      content: '确定要取消该订单吗？取消后无法恢复。',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已取消',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看详情
  viewDetail(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/order/detail?orderNo=${orderNo}`
    });
  },

  // 确认完成
  confirmComplete(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.showModal({
      title: '确认完成',
      content: '请确认护生活动已圆满完成，确认后将无法修改。',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '已确认',
            icon: 'success'
          });
        }
      }
    });
  },

  // 申请复核
  applyReview(e) {
    const orderNo = e.currentTarget.dataset.orderno;
    wx.navigateTo({
      url: `/pages/order/review?orderNo=${orderNo}`
    });
  },

  // 联系机构
  contactOrg(e) {
    const order = e.currentTarget.dataset.order;
    wx.showModal({
      title: '联系机构',
      content: `请拨打 ${order.orgName} 联系电话`,
      confirmText: '拨打电话',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: '138****1234'
          });
        }
      }
    });
  },

  // 创建新订单
  createOrder() {
    wx.navigateTo({
      url: '/pages/order/create'
    });
  }
});
