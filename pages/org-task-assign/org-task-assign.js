// 清如 ClearSpring - 机构任务分配页 V-06
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // 订单信息
    orderInfo: null,
    
    // 筛选类型
    filterType: 'all', // all, available, busy, offline
    
    // 志愿者列表
    volunteers: [
      {
        id: 'vol_001',
        name: '李明',
        avatar: 'https://example.com/avatar1.jpg',
        verified: true,
        level: 5,
        status: 'available', // available, busy, offline
        statusText: '可接单',
        completedOrders: 56,
        rating: 98,
        skills: ['护生执行', '活动组织', '摄影记录'],
        distance: '2.5km'
      },
      {
        id: 'vol_002',
        name: '王芳',
        avatar: 'https://example.com/avatar2.jpg',
        verified: true,
        level: 4,
        status: 'available',
        statusText: '可接单',
        completedOrders: 42,
        rating: 96,
        skills: ['护生执行', '文案写作'],
        distance: '3.8km'
      },
      {
        id: 'vol_003',
        name: '张伟',
        avatar: 'https://example.com/avatar3.jpg',
        verified: true,
        level: 6,
        status: 'busy',
        statusText: '忙碌中',
        completedOrders: 78,
        rating: 99,
        skills: ['护生执行', '活动组织', '应急救援'],
        distance: '1.2km'
      },
      {
        id: 'vol_004',
        name: '刘娜',
        avatar: 'https://example.com/avatar4.jpg',
        verified: false,
        level: 2,
        status: 'offline',
        statusText: '离线',
        completedOrders: 15,
        rating: 92,
        skills: ['护生执行'],
        distance: '5.0km'
      },
      {
        id: 'vol_005',
        name: '陈杰',
        avatar: 'https://example.com/avatar5.jpg',
        verified: true,
        level: 5,
        status: 'available',
        statusText: '可接单',
        completedOrders: 63,
        rating: 97,
        skills: ['护生执行', '摄影记录', '翻译服务'],
        distance: '4.1km'
      }
    ],
    
    // 分配记录
    assignmentHistory: [
      {
        id: 'assign_001',
        volunteerName: '李明',
        assignTime: '2026-04-11 14:30',
        status: 'accepted',
        statusText: '已接受'
      },
      {
        id: 'assign_002',
        volunteerName: '王芳',
        assignTime: '2026-04-10 09:15',
        status: 'completed',
        statusText: '已完成'
      }
    ],
    
    // 加载状态
    loading: false,
    hasMore: true
  },

  onLoad(options) {
    if (options.orderId) {
      this.loadOrderInfo(options.orderId);
    }
    if (options.volunteerId) {
      // 高亮指定志愿者
      this.highlightVolunteer(options.volunteerId);
    }
  },

  onPullDownRefresh() {
    this.loadVolunteers().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载订单信息
  async loadOrderInfo(orderId) {
    try {
      // TODO: 调用云函数获取订单信息
      const mockOrder = {
        orderNo: 'ORD20260412001',
        status: 'pending',
        statusText: '待分配',
        speciesName: '鲫鱼',
        speciesQuantity: '50',
        speciesUnit: '斤',
        waterArea: '太湖',
        executeDate: '2026-04-13',
        amount: '299.00'
      };
      
      this.setData({ orderInfo: mockOrder });
    } catch (error) {
      console.error('加载订单信息失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadOrderInfo',
        showToast: false
      });
    }
  },

  // 加载志愿者列表
  async loadVolunteers() {
    this.setData({ loading: true });
    
    try {
      // TODO: 调用云函数获取志愿者列表
      await new Promise((resolve) => {
        setTimeout(() => {
          this.setData({ loading: false });
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error('加载志愿者列表失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadVolunteers',
        showToast: true
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 筛选志愿者
  onFilterChange(e) {
    const type = e.currentTarget.dataset.type;
    this.setData({ filterType: type });
    
    // TODO: 根据筛选类型重新加载志愿者列表
    this.filterVolunteers(type);
  },

  // 筛选志愿者逻辑
  filterVolunteers(type) {
    let filtered = [];
    
    if (type === 'all') {
      filtered = this.data.volunteers;
    } else {
      filtered = this.data.volunteers.filter(v => v.status === type);
    }
    
    // 这里简单处理，实际应该从服务器获取
    this.setData({ volunteers: filtered });
  },

  // 刷新列表
  onRefresh() {
    this.loadVolunteers();
    wx.showToast({
      title: '已刷新',
      icon: 'success'
    });
  },

  // 加载更多
  onLoadMore() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreVolunteers();
    }
  },

  // 加载更多志愿者
  async loadMoreVolunteers() {
    this.setData({ loading: true });
    
    try {
      // TODO: 调用云函数加载更多志愿者
      await new Promise((resolve) => {
        setTimeout(() => {
          this.setData({ 
            loading: false,
            hasMore: false // 模拟没有更多数据
          });
          resolve();
        }, 500);
      });
    } catch (error) {
      console.error('加载更多失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadMoreVolunteers',
        showToast: true
      });
    } finally {
      this.setData({ loading: false });
    }
  },

  // 查看志愿者详情
  onViewDetail(e) {
    const volunteerId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/org-volunteer-detail/org-volunteer-detail?volunteerId=' + volunteerId
    });
  },

  // 分配志愿者
  onAssignVolunteer(e) {
    const volunteerId = e.currentTarget.dataset.id;
    const volunteer = this.data.volunteers.find(v => v.id === volunteerId);
    
    if (!volunteer) return;
    
    wx.showModal({
      title: '确认分配',
      content: `确定要将任务分配给 ${volunteer.name} 吗？`,
      confirmText: '分配',
      confirmColor: '#4A5D4E',
      success: (res) => {
        if (res.confirm) {
          this.doAssignVolunteer(volunteerId);
        }
      }
    });
  },

  // 执行分配
  async doAssignVolunteer(volunteerId) {
    try {
      ErrorHandler.showLoading('分配中...');
      
      // TODO: 调用云函数分配任务
      // const res = await wx.cloud.callFunction({
      //   name: 'assignTask',
      //   data: {
      //     orderId: this.data.orderInfo?.orderNo,
      //     volunteerId
      //   }
      // });
      
      wx.showToast({
        title: '分配成功',
        icon: 'success'
      });
      
      // 添加到分配记录
      const newRecord = {
        id: 'assign_' + Date.now(),
        volunteerName: this.data.volunteers.find(v => v.id === volunteerId)?.name || '未知',
        assignTime: this.formatDate(new Date()),
        status: 'pending',
        statusText: '待接受'
      };
      
      this.setData({
        assignmentHistory: [newRecord, ...this.data.assignmentHistory]
      });
      
      // 延迟返回
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      console.error('分配任务失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'doAssignVolunteer',
        showToast: true
      });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  // 高亮指定志愿者
  highlightVolunteer(volunteerId) {
    // TODO: 滚动到指定志愿者并高亮
    console.log('高亮志愿者:', volunteerId);
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
