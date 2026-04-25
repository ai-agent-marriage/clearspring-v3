// 清如 ClearSpring - 机构订单详情页 V-03
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // 订单基本信息
    orderInfo: {
      orderNo: 'ORD20260412001',
      status: 'assigned', // pending, assigned, executing, completed, cancelled
      statusName: '已分配',
      statusDesc: '志愿者已分配，等待执行',
      updateTime: '2026-04-12 08:30',
      createTime: '2026-04-11 14:20',
      executeDate: '2026-04-13',
      typeName: '委托护生',
      amount: '299.00',
      speciesName: '鲫鱼',
      speciesDesc: '常见淡水鱼类，适合投放于江河湖泊',
      speciesQuantity: '50',
      speciesUnit: '斤',
      speciesImage: '',
      waterArea: '太湖',
      waterAddress: '江苏省苏州市吴中区太湖大道',
      remark: '请选择上午执行，水温适宜',
      assignTime: '2026-04-12 08:30',
      executeTime: '',
      completeTime: '',
      evidence: []
    },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
    
    // 志愿者信息
    volunteer: {
      name: '李明',
      avatar: 'https://example.com/avatar.jpg',
      verified: true,
      level: 5,
      serviceDays: 128,
      completedOrders: 56,
      rating: 98
    },
    
    // 订单进度
    currentStep: 2, // 1: 订单创建，2: 志愿者分配，3: 开始执行，4: 执行完成
    
    // 操作按钮显示
    showActions: true,
    showBottomBar: true,
    primaryActionText: '确认完成'
  },

  onLoad(options) {
    if (options.orderId) {
      this.loadOrderDetail(options.orderId);
    } else {
      this.loadMockData();
    }
  },

  onPullDownRefresh() {
    this.loadOrderDetail(this.data.orderInfo.orderNo).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载订单详情
  async loadOrderDetail(orderId) {
    try {
      ErrorHandler.showLoading('加载中...');
      
      // TODO: 调用云函数获取订单详情
      // const res = await wx.cloud.callFunction({
      //   name: 'getOrderDetail',
      //   data: { orderId }
      // });
      
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('加载订单详情失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadOrderDetail',
        showToast: true
      });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  // 加载模拟数据
  loadMockData() {
    this.setData({
      orderInfo: {
        ...this.data.orderInfo,
        volunteer: this.data.volunteer
      },
      volunteer: this.data.volunteer
    });
  },

  // 分配志愿者
  onAssignVolunteer() {
    wx.navigateTo({
      url: '/pages/org-task-assign/org-task-assign?orderId=' + this.data.orderInfo.orderNo
    });
  },

  // 取消订单
  onCancelOrder() {
    wx.showModal({
      title: '取消订单',
      content: '确定要取消这个订单吗？取消后无法恢复。',
      confirmText: '取消',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用云函数取消订单
          wx.showToast({
            title: '订单已取消',
            icon: 'success'
          });
          
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
      }
    });
  },

  // 确认完成
  onConfirmComplete() {
    wx.showModal({
      title: '确认完成',
      content: '确认订单已完成执行吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用云函数确认完成
          wx.showToast({
            title: '已确认完成',
            icon: 'success'
          });
          
          // 更新状态
          this.setData({
            'orderInfo.status': 'completed',
            'orderInfo.statusName': '已完成',
            'orderInfo.statusDesc': '订单已圆满执行完成',
            'orderInfo.completeTime': this.formatDate(new Date()),
            currentStep: 4,
            showActions: false
          });
        }
      }
    });
  },

  // 查看志愿者详情
  onViewVolunteer() {
    if (this.data.volunteer) {
      wx.navigateTo({
        url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=' + this.data.volunteer.id
      });
    }
  },

  // 预览证据图片
  onPreviewEvidence(e) {
    const index = e.currentTarget.dataset.index;
    const evidence = this.data.orderInfo.evidence;
    
    wx.previewImage({
      current: evidence[index],
      urls: evidence
    });
  },

  // 联系志愿者
  onContactVolunteer() {
    if (this.data.volunteer && this.data.volunteer.phone) {
      wx.makePhoneCall({
        phoneNumber: this.data.volunteer.phone
      });
    } else {
      wx.showToast({
        title: '暂无联系方式',
        icon: 'none'
      });
    }
  },

  // 主操作按钮点击
  onPrimaryAction() {
    if (this.data.orderInfo.status === 'completed') {
      this.onConfirmComplete();
    } else {
      wx.showToast({
        title: '请先确认执行完成',
        icon: 'none'
      });
    }
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
});
