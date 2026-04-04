// 清如 ClearSpring - 机构订单管理页

Page({
  data: {
    // Tab 配置
    tabs: ['全部', '待承接', '待执行', '执行中', '待确认', '已完成', '已取消'],
    activeTab: 0,
    
    // 筛选栏
    showFilter: false,
    filterDateRange: null,
    filterWaterArea: '',
    filterVolunteer: '',
    
    // 订单列表
    orders: [
      {
        orderNo: 'PRO202604070001',
        status: 2,
        statusName: '待执行',
        executeDate: '2026-04-15',
        speciesName: '鲢鱼',
        waterArea: '珠江广州段',
        volunteerName: '张三',
        amount: 299
      },
      {
        orderNo: 'PRO202604070002',
        status: 1,
        statusName: '待承接',
        executeDate: '2026-04-16',
        speciesName: '鲫鱼',
        waterArea: '长江武汉段',
        volunteerName: '',
        amount: 199
      },
      {
        orderNo: 'PRO202604070003',
        status: 3,
        statusName: '执行中',
        executeDate: '2026-04-14',
        speciesName: '鲤鱼',
        waterArea: '黄河郑州段',
        volunteerName: '李四',
        amount: 399
      }
    ],
    
    // 空状态
    isEmpty: false
  },

  onLoad(options) {
    console.log('订单管理页加载');
    this.loadOrders();
  },

  onShow() {
    this.refreshOrders();
  },

  onPullDownRefresh() {
    this.refreshOrders().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  async loadOrders() {
    try {
      // TODO: 实际从云函数获取订单列表
      console.log('加载订单列表');
    } catch (error) {
      console.error('加载订单失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshOrders() {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('订单刷新完成');
    } catch (error) {
      console.error('刷新订单失败:', error);
    }
  },

  // ========== Tab 切换 ==========
  onTabChange(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ activeTab: index });
    this.loadOrdersByStatus(index);
  },

  async loadOrdersByStatus(statusIndex) {
    // TODO: 根据状态加载订单
    console.log('加载状态:', statusIndex, this.data.tabs[statusIndex]);
  },

  // ========== 筛选栏 ==========
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  onFilterDateChange(e) {
    this.setData({
      filterDateRange: e.detail.value
    });
  },

  onFilterWaterAreaChange(e) {
    this.setData({
      filterWaterArea: e.detail.value
    });
  },

  onFilterVolunteerChange(e) {
    this.setData({
      filterVolunteer: e.detail.value
    });
  },

  onApplyFilter() {
    console.log('应用筛选:', {
      dateRange: this.data.filterDateRange,
      waterArea: this.data.filterWaterArea,
      volunteer: this.data.filterVolunteer
    });
    this.setData({ showFilter: false });
    wx.showToast({
      title: '筛选已应用',
      icon: 'success'
    });
  },

  onResetFilter() {
    this.setData({
      filterDateRange: null,
      filterWaterArea: '',
      filterVolunteer: ''
    });
    wx.showToast({
      title: '已重置筛选',
      icon: 'none'
    });
  },

  // ========== 订单操作 ==========
  onOrderAction(e) {
    const { action, order } = e.currentTarget.dataset;
    console.log('订单操作:', action, order);
    
    switch (action) {
      case 'accept':
        this.acceptOrder(order);
        break;
      case 'assign':
        this.assignTask(order);
        break;
      case 'audit':
        this.auditMaterial(order);
        break;
      case 'detail':
        this.viewDetail(order);
        break;
    }
  },

  // 承接订单
  acceptOrder(order) {
    wx.showModal({
      title: '承接订单',
      content: `确定要承接订单 ${order.orderNo} 吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '承接成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 分配任务
  assignTask(order) {
    wx.navigateTo({
      url: `/pages/org-home/assign?orderNo=${order.orderNo}`
    });
  },

  // 审核执行材料
  auditMaterial(order) {
    wx.navigateTo({
      url: `/pages/org-home/audit?orderNo=${order.orderNo}`
    });
  },

  // 查看详情
  viewDetail(order) {
    wx.navigateTo({
      url: `/pages/order/detail?orderNo=${order.orderNo}`
    });
  },

  // ========== 状态标签样式 ==========
  getStatusClass(status) {
    const statusMap = {
      1: 'pending-accept',
      2: 'pending-execute',
      3: 'processing',
      4: 'pending-confirm',
      5: 'completed',
      6: 'cancelled'
    };
    return statusMap[status] || '';
  }
});
