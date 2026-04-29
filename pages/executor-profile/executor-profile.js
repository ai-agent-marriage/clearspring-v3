// 清如 ClearSpring - 执行者个人中心逻辑

Page({
  data: {
    // 用户信息
    userInfo: {
      avatar: '/images/default-avatar.png',
      nickname: '张先生',
      verified: true,
      level: 3,
      id: 'EXE20260001',
      skills: '心理咨询、情感疏导'
    },
    
    // 统计数据
    stats: {
      serviceDays: 128,
      totalOrders: 342,
      totalIncome: '25,680'
    },
    
    // 资质状态
    qualificationStatus: 'verified', // verified/pending/rejected
    qualificationTitle: '已认证执行者',
    qualificationDesc: '认证有效期：2026-12-31',
    
    // 未读消息数
    unreadCount: 3
  },

  onLoad(options) {
    this.loadProfileData();
  },

  onShow() {
    this.refreshProfileData();
  },

  // ========== 加载数据 ==========
  loadProfileData() {
    // TODO: 调用云函数获取个人资料
    // wx.cloud.callFunction({
    //   name: 'getExecutorProfile'
    // })
    // [CLEANED] console.log('加载个人资料');
  },

  // ========== 刷新数据 ==========
  refreshProfileData() {
    // TODO: 刷新数据
    // [CLEANED] console.log('刷新个人资料');
  },

  // ========== 菜单点击 ==========
  onMenuTap(e) {
    const action = e.currentTarget.dataset.action;
    
    switch(action) {
      case 'order':
        // 我的订单
        wx.navigateTo({
          url: '/pages/executor-tasks/executor-tasks'
        });
        break;
      
      case 'wallet':
        // 我的钱包
        wx.navigateTo({
          url: '/pages/executor-income/executor-income'
        });
        break;
      
      case 'notice':
        // 消息通知
        wx.navigateTo({
          url: '/pages/executor-notice/executor-notice'
        });
        break;
      
      case 'help':
        // 帮助中心
        wx.navigateTo({
          url: '/pages/executor-help/executor-help'
        });
        break;
      
      case 'settings':
        // 设置
        wx.navigateTo({
          url: '/pages/executor-settings/executor-settings'
        });
        break;
      
      case 'feedback':
        // 意见反馈
        wx.navigateTo({
          url: '/pages/executor-feedback/executor-feedback'
        });
        break;
      
      case 'about':
        // 关于我们
        wx.navigateTo({
          url: '/pages/executor-about/executor-about'
        });
        break;
    }
  },

  // ========== 更新资质 ==========
  onUpdateQualification() {
    wx.navigateTo({
      url: '/pages/executor-qualification/executor-qualification'
    });
  },

  // ========== 切换身份 ==========
  onSwitchRole() {
    wx.showModal({
      title: '切换身份',
      content: '确定要切换到祈福者端吗？当前页面将关闭。',
      success: (res) => {
        if (res.confirm) {
          // 切换到祈福者端 - 跳转到主首页
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // ========== 退出登录 ==========
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 清除登录状态
          // wx.cloud.callFunction({
          //   name: 'logout'
          // })
          
          wx.clearStorageSync();
          
          wx.reLaunch({
            url: '/pages/login/login'
          });
        }
      }
    });
  }
});
