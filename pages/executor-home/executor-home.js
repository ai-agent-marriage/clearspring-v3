// 清如 ClearSpring - 执行者首页逻辑

Page({
  data: {
    // 用户信息
    executorName: '张先生',
    qualificationStatus: 'verified', // verified/pending/unverified
    statusText: '已认证',
    hasUnreadNotice: true,
    
    // 今日数据
    todayStats: {
      completed: 3,
      earning: 450,
      hours: 5.5,
      rating: 4.9
    },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
    
    // 进行中任务
    ongoingTasks: [
      {
        id: 1,
        title: '心理疏导服务',
        status: 'processing',
        statusText: '进行中',
        location: '北京市朝阳区',
        startTime: '14:00',
        price: 200,
        timeLeft: '1 小时 30 分'
      },
      {
        id: 2,
        title: '法律咨询服务',
        status: 'pending',
        statusText: '待开始',
        location: '线上视频',
        startTime: '16:30',
        price: 300,
        timeLeft: '3 小时'
      }
    ],
    
    // 公告
    notice: '平台将于今晚 23:00-01:00 进行系统维护，请提前安排好服务时间。'
  },

  onLoad(options) {
    // 页面加载
    this.loadExecutorData();
  },

  onShow() {
    // 页面显示时刷新数据
    this.refreshData();
  },

  onPullDownRefresh() {
    // 下拉刷新
    this.refreshData();
  },

  // ========== 加载数据 ==========
  loadExecutorData() {
    // TODO: 从云数据库加载执行者数据
    // wx.cloud.callFunction({
    //   name: 'getExecutorProfile'
    // })
    // [CLEANED] console.log('加载执行者数据');
  },

  // ========== 刷新数据 ==========
  refreshData() {
    wx.showLoading({ title: '刷新中...' });
    
    // TODO: 调用云函数刷新数据
    setTimeout(() => {
      wx.hideLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '已更新',
        icon: 'success'
      });
    }, 1000);
  },

  // ========== 事件处理 ==========
  onNotification() {
    // 查看通知
    wx.navigateTo({
      url: '/pages/executor-notice/executor-notice'
    });
  },

  onEnterOrderHall() {
    // 进入抢单大厅
    wx.switchTab({
      url: '/pages/executor-order-hall/executor-order-hall'
    });
  },

  onEnterIncome() {
    // 进入收入管理
    wx.navigateTo({
      url: '/pages/executor-income/executor-income'
    });
  },

  onViewAllOngoing() {
    // 查看所有进行中任务
    wx.navigateTo({
      url: '/pages/executor-tasks/executor-tasks'
    });
  },

  onTaskDetail(e) {
    // 查看任务详情
    const taskId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/executor-task-detail/executor-task-detail?id=${taskId}`
    });
  }
});
