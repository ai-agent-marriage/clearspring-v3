// 清如 ClearSpring - 任务助手页逻辑

Page({
  data: {
    // 当前任务状态
    taskStatusClass: 'processing',
    taskStatusText: '进行中',
    
    currentTask: {
      name: '心理疏导服务 - 李女士',
      progress: 60
    },
    
    // 提示信息
    tips: '服务过程中请保持专业态度，按时完成服务并及时上传凭证。如有问题请联系客服。'
  },

  onLoad(options) {
    this.loadTaskStatus();
  },

  onShow() {
    // 刷新任务状态
    this.refreshTaskStatus();
  },

  // ========== 加载任务状态 ==========
  loadTaskStatus() {
    // TODO: 从云数据库加载当前任务状态
    // wx.cloud.callFunction({
    //   name: 'getCurrentTaskStatus'
    // })
    // [CLEANED] console.log('加载任务状态');
  },

  // ========== 刷新任务状态 ==========
  refreshTaskStatus() {
    // TODO: 调用云函数刷新
    // [CLEANED] console.log('刷新任务状态');
  },

  // ========== 事件处理 ==========
  onViewTaskDetail() {
    // 查看任务详情
    wx.navigateTo({
      url: '/pages/executor-task-detail/executor-task-detail'
    });
  },

  onContinueTask() {
    // 继续任务
    wx.navigateTo({
      url: '/pages/executor-task-process/executor-task-process'
    });
  },

  onGoToOrderHall() {
    // 去抢单
    wx.switchTab({
      url: '/pages/executor-order-hall/executor-order-hall'
    });
  },

  onNavigate(e) {
    const page = e.currentTarget.dataset.page;
    const pages = {
      qualification: '/pages/executor-qualification/executor-qualification',
      tasks: '/pages/executor-tasks/executor-tasks',
      income: '/pages/executor-income/executor-income',
      profile: '/pages/executor-profile/executor-profile',
      guide: '/pages/executor-guide/executor-guide',
      service: '/pages/executor-service/executor-service'
    };
    
    if (pages[page]) {
      wx.navigateTo({
        url: pages[page]
      });
    }
  },

  onFunction(e) {
    const func = e.currentTarget.dataset.func;
    
    switch(func) {
      case 'scan':
        // 扫码签到
        wx.scanCode({
          success: (res) => {
            // [CLEANED] console.log('扫码结果:', res.result);
            wx.showToast({
              title: '签到成功',
              icon: 'success'
            });
          },
          fail: (err) => {
            if (err.errMsg !== 'scanCode:fail cancel') {
              wx.showToast({
                title: '扫码失败',
                icon: 'none'
              });
            }
          }
        });
        break;
      
      case 'upload':
        // 上传凭证
        wx.navigateTo({
          url: '/pages/executor-evidence/executor-evidence'
        });
        break;
      
      case 'report':
        // 服务报告
        wx.navigateTo({
          url: '/pages/executor-report/executor-report'
        });
        break;
      
      case 'feedback':
        // 问题反馈
        wx.navigateTo({
          url: '/pages/executor-feedback/executor-feedback'
        });
        break;
    }
  }
});
