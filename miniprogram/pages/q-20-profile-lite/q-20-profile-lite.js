// pages/q-20-profile-lite/q-20-profile-lite.js

Page({
  data: {
    userInfo: {
      avatar: '/assets/images/default-avatar.png',
      nickname: '',
      userId: '',
      isLoggedIn: false
    },
    stats: {
      meritCount: '0',
      orderCount: '0',
      certificateCount: '0',
      favoriteCount: '0',
      newCertificateCount: 0
    }
  },

  onLoad() {
    this.loadUserInfo();
    this.loadStats();
  },

  onReady() {
    console.log('Q-20 免注册个人中心渲染完成');
  },

  onShow() {
    this.refreshData();
  },

  loadUserInfo() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        userInfo: {
          avatar: userInfo.avatar || '/assets/images/default-avatar.png',
          nickname: userInfo.nickname,
          userId: userInfo.userId,
          isLoggedIn: true
        }
      });
    }
  },

  loadStats() {
    try {
      // 从云函数或本地存储加载统计数据
      const stats = wx.getStorageSync('userStats') || this.data.stats;
      this.setData({ stats });
    } catch (error) {
      console.error('加载统计数据失败:', error);
    }
  },

  refreshData() {
    this.loadUserInfo();
    this.loadStats();
  },

  onAvatarTap() {
    if (!this.data.userInfo.isLoggedIn) {
      this.onLoginTap();
    }
  },

  onLoginTap() {
    wx.navigateTo({
      url: '/pages/login/login'
    });
  },

  goSettings() {
    wx.navigateTo({
      url: '/pages/q-25-settings/q-25-settings'
    });
  },

  onMeritTap() {
    wx.navigateTo({
      url: '/pages/merit-forest/index'
    });
  },

  onOrderTap() {
    wx.navigateTo({
      url: '/pages/order/list'
    });
  },

  onCertificateTap() {
    wx.navigateTo({
      url: '/pages/q-18-certificate-list/q-18-certificate-list'
    });
  },

  onFavoriteTap() {
    wx.navigateTo({
      url: '/pages/favorite/index'
    });
  },

  onAllOrdersTap() {
    wx.navigateTo({
      url: '/pages/order/list'
    });
  },

  onOrderStatusTap(e) {
    const status = e.currentTarget.dataset.status;
    wx.navigateTo({
      url: `/pages/order/list?status=${status}`
    });
  },

  onAudioTap() {
    wx.navigateTo({
      url: '/pages/q-03-audio-home/q-03-audio-home'
    });
  },

  onZenTap() {
    wx.navigateTo({
      url: '/pages/q-05-zen-home/q-05-zen-home'
    });
  },

  onHelpTap() {
    wx.navigateTo({
      url: '/pages/help/index'
    });
  },

  onAboutTap() {
    wx.navigateTo({
      url: '/pages/about/index'
    });
  },

  onSettingsTap() {
    wx.navigateTo({
      url: '/pages/q-25-settings/q-25-settings'
    });
  },

  onShareAppMessage() {
    return {
      title: '我的个人中心 - 清如 ClearSpring',
      path: '/pages/q-20-profile-lite/q-20-profile-lite'
    };
  }
});
