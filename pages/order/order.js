// pages/order/order.js - 订单管理页面优化

Page({
  data: {
    // 状态筛选 Tabs
    tabs: ['全部', '待承接', '待执行', '执行中', '待确认', '已完成'],
    activeTab: 0,
    
    // 订单列表
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
        createTime: '2026-04-07 10:00',
        orgName: '广州护生协会',
        volunteerName: '张三',
        executeImages: ['img1.jpg', 'img2.jpg', 'img3.jpg']
      },
      {
        orderNo: 'PRO202604070002',
        speciesName: '草鱼',
        quantity: 5,
        amount: 149.5,
        status: 2,
        statusName: '待执行',
        address: '珠江广州段',
        executeDate: '2026-04-12',
        createTime: '2026-04-06 14:30',
        orgName: '广州护生协会',
        volunteerName: '李四',
        executeImages: []
      },
      {
        orderNo: 'PRO202604070003',
        speciesName: '青鱼',
        quantity: 20,
        amount: 598,
        status: 3,
        statusName: '执行中',
        address: '珠江广州段',
        executeDate: '2026-04-10',
        createTime: '2026-04-05 09:15',
        orgName: '广州护生协会',
        volunteerName: '王五',
        executeImages: ['img1.jpg']
      },
      {
        orderNo: 'PRO202604070004',
        speciesName: '鳙鱼',
        quantity: 15,
        amount: 448.5,
        status: 1,
        statusName: '待承接',
        address: '珠江广州段',
        executeDate: '2026-04-18',
        createTime: '2026-04-08 16:20',
        orgName: '广州护生协会',
        volunteerName: '',
        executeImages: []
      },
      {
        orderNo: 'PRO202604070005',
        speciesName: '鲢鱼',
        quantity: 8,
        amount: 239.2,
        status: 4,
        statusName: '待确认',
        address: '珠江广州段',
        executeDate: '2026-04-08',
        createTime: '2026-04-01 11:00',
        orgName: '广州护生协会',
        volunteerName: '赵六',
        executeImages: ['img1.jpg', 'img2.jpg']
      }
    ],
    
    // 状态颜色映射
    statusColors: {
      1: '#FF9800', // 待承接 - 橙色
      2: '#2196F3', // 待执行 - 蓝色
      3: '#9C27B0', // 执行中 - 紫色
      4: '#FF5722', // 待确认 - 红色
      5: '#4CAF50', // 已完成 - 绿色
      6: '#9E9E9E'  // 已取消 - 灰色
    },
    
    // 订单详情展示
    showDetail: false,
    currentOrder: null,
    
    // 进度条数据
    progressSteps: [
      { id: 1, name: '已下单' },
      { id: 2, name: '待承接' },
      { id: 3, name: '待执行' },
      { id: 4, name: '执行中' },
      { id: 5, name: '已完成' }
    ]
  },

  onLoad() {
    console.log('订单管理页加载完成');
    this.loadOrders();
  },

  onShow() {
    // 每次显示时刷新订单数据
    this.loadOrders();
  },

  // 加载订单列表
  loadOrders() {
    // TODO: 从云数据库加载订单
    // 当前使用 mock 数据
    this.filterOrdersByTab(this.data.activeTab);
  },

  // 切换状态 Tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    if (index === this.data.activeTab) return;
    
    this.setData({
      activeTab: index
    });
    
    this.filterOrdersByTab(index);
  },

  // 根据 Tab 筛选订单
  filterOrdersByTab(tabIndex) {
    let filteredOrders = [...this.data.orders];
    
    if (tabIndex > 0) {
      // tabIndex 1-5 对应 status 1-5
      filteredOrders = filteredOrders.filter(order => order.status === tabIndex);
    }
    
    this.setData({
      orders: filteredOrders
    });
  },

  // 获取状态标签样式类
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

  // 获取状态颜色
  getStatusColor(status) {
    return this.data.statusColors[status] || '#9E9E9E';
  },

  // 查看订单详情
  viewDetail(e) {
    const index = e.currentTarget.dataset.index;
    const order = this.data.orders[index];
    
    this.setData({
      currentOrder: order,
      showDetail: true
    });
  },

  // 关闭订单详情
  closeDetail() {
    this.setData({
      showDetail: false,
      currentOrder: null
    });
  },

  // 获取操作按钮列表（根据订单状态动态显示）
  getOrderActions(status) {
    const actionsMap = {
      1: [],                          // 待承接 - 无操作
      2: ['查看进度'],                // 待执行
      3: ['查看进度'],                // 执行中
      4: ['确认完成', '申请复核'],    // 待确认
      5: ['查看证书', '分享'],        // 已完成
      6: []                           // 已取消
    };
    return actionsMap[status] || [];
  },

  // 执行操作
  handleAction(e) {
    const { action, index } = e.currentTarget.dataset;
    const order = this.data.orders[index];
    
    switch (action) {
      case '查看进度':
        this.viewProgress(order);
        break;
      case '确认完成':
        this.confirmOrder(order);
        break;
      case '申请复核':
        this.requestReview(order);
        break;
      case '查看证书':
        this.viewCertificate(order);
        break;
      case '分享':
        this.shareOrder(order);
        break;
      default:
        wx.showToast({
          title: '功能开发中',
          icon: 'none'
        });
    }
  },

  // 查看进度
  viewProgress(order) {
    wx.navigateTo({
      url: `/pages/order/detail?orderNo=${order.orderNo}`,
      fail: () => {
        wx.showToast({
          title: '即将开放',
          icon: 'none'
        });
      }
    });
  },

  // 确认订单完成
  confirmOrder(order) {
    wx.showModal({
      title: '确认完成',
      content: `确认订单 ${order.orderNo} 已完成？`,
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用确认接口
          wx.showToast({
            title: '确认成功',
            icon: 'success'
          });
        }
      }
    });
  },

  // 申请复核
  requestReview(order) {
    wx.showModal({
      title: '申请复核',
      content: '请填写复核原因',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // TODO: 调用复核申请接口
          wx.showToast({
            title: '申请已提交',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看证书
  viewCertificate(order) {
    wx.navigateTo({
      url: `/pages/profile/certs?orderNo=${order.orderNo}`,
      fail: () => {
        wx.showToast({
          title: '即将开放',
          icon: 'none'
        });
      }
    });
  },

  // 分享订单
  shareOrder(order) {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 预览执行图片
  previewImage(e) {
    const { index, orderIndex } = e.currentTarget.dataset;
    const order = this.data.orders[orderIndex];
    
    if (order.executeImages && order.executeImages.length > 0) {
      wx.previewImage({
        current: order.executeImages[index],
        urls: order.executeImages
      });
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadOrders();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    // TODO: 加载更多订单
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '我的订单 - 清如 ClearSpring',
      path: '/pages/order/order'
    };
  }
});
