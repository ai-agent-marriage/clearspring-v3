// 我的委托订单列表页
const app = getApp();

Page({
  data: {
    // 当前筛选状态
    currentFilter: 'all',
    // 筛选选项
    filters: [
      { label: '全部', value: 'all', count: 0 },
      { label: '待支付', value: 'pending_payment', count: 0 },
      { label: '进行中', value: 'executing', count: 0 },
      { label: '已完成', value: 'completed', count: 0 },
      { label: '已取消', value: 'cancelled', count: 0 }
    ],
    // 订单列表
    orders: [],
    // 筛选后的订单列表
    filteredOrders: []
  },

  onLoad() {
    this.loadOrders();
  },

  onShow() {
    // 页面显示时刷新数据
    this.loadOrders();
  },

  // 加载订单列表
  loadOrders() {
    // 从本地存储或云函数加载订单
    const orders = wx.getStorageSync('entrustedOrders') || [];
    
    // 为每个订单添加序号和状态
    const processedOrders = orders.map((order, index) => ({
      id: index,
      orderNo: `ORD${String(index + 1).padStart(6, '0')}`,
      ...order
    }));
    
    this.setData({ 
      orders: processedOrders,
      filteredOrders: processedOrders
    });
    
    // 更新筛选计数
    this.updateFilterCounts(processedOrders);
  },

  // 更新筛选计数
  updateFilterCounts(orders) {
    const counts = {
      all: orders.length,
      pending_payment: 0,
      executing: 0,
      completed: 0,
      cancelled: 0
    };
    
    orders.forEach(order => {
      if (counts[order.status] !== undefined) {
        counts[order.status]++;
      }
    });
    
    const filters = this.data.filters.map(filter => ({
      ...filter,
      count: counts[filter.value] || 0
    }));
    
    this.setData({ filters });
  },

  // 选择筛选条件
  selectFilter(e) {
    const value = e.currentTarget.dataset.value;
    this.setData({ currentFilter: value });
    
    // 筛选订单
    if (value === 'all') {
      this.setData({ filteredOrders: this.data.orders });
    } else {
      const filtered = this.data.orders.filter(order => order.status === value);
      this.setData({ filteredOrders: filtered });
    }
  },

  // 获取状态文本
  getStatusText(status) {
    const statusMap = {
      'pending': '待处理',
      'pending_payment': '待支付',
      'executing': '进行中',
      'completed': '已完成',
      'cancelled': '已取消'
    };
    return statusMap[status] || '未知状态';
  },

  // 查看订单详情
  viewOrderDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: `/pages/order-detail/order-detail?id=${id}&type=entrusted` 
    });
  },

  // 取消订单
  cancelOrder(e) {
    const id = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认取消',
      content: '确定要取消这个订单吗？',
      success: (res) => {
        if (res.confirm) {
          // 更新订单状态
          const orders = this.data.orders.map((order, index) => {
            if (index === id) {
              return { ...order, status: 'cancelled' };
            }
            return order;
          });
          
          wx.setStorageSync('entrustedOrders', orders);
          this.loadOrders();
          
          wx.showToast({ title: '已取消', icon: 'success' });
        }
      }
    });
  },

  // 支付订单
  payOrder(e) {
    const id = e.currentTarget.dataset.id;
    const order = this.data.orders[id];
    
    // 跳转到支付页面
    wx.navigateTo({ 
      url: `/pages/pay/pay?orderId=${id}&amount=${order.totalPrice}` 
    });
  },

  // 查看进度
  viewProgress(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ 
      url: `/pages/order-progress/order-progress?id=${id}` 
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    return;
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
