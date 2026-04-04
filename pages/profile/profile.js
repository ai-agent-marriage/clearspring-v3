// pages/profile/profile.js

Page({
  data: {
    // 用户信息
    hasUserInfo: false,
    userInfo: null,
    avatarUrl: '/images/profile.png',
    nickname: '',
    userId: '',

    // 统计数据
    stats: {
      listenCount: 36,
      protectCount: 5,
      continuousDays: 7,
      certCount: 3
    },

    // 功能菜单分类
    menuGroups: [
      {
        title: '修行数据',
        items: [
          { icon: '🎵', name: '我的收听', path: '/pages/profile/listen', badge: 0 },
          { icon: '🌱', name: '护生台账', path: '/pages/profile/protect', badge: 0 },
          { icon: '📜', name: '证书库', path: '/pages/profile/certs', badge: 3 },
          { icon: '📅', name: '打卡日历', path: '/pages/profile/calendar', badge: 0 }
        ]
      },
      {
        title: '常用功能',
        items: [
          { icon: '📋', name: '我的预约', path: '/pages/order/list', badge: 0 },
          { icon: '💳', name: '功德记录', path: '/pages/profile/merit', badge: 0 },
          { icon: '🎁', name: '优惠券', path: '/pages/profile/coupons', badge: 2 },
          { icon: '⭐', name: '我的收藏', path: '/pages/profile/favorites', badge: 0 }
        ]
      }
    ],

    // 快捷操作
    quickActions: [
      { icon: '📍', name: '一键放生', path: '/pages/protect/register', color: '#07c160' },
      { icon: '📖', name: '科普百科', path: '/pages/wiki/wiki', color: '#D4B87B' },
      { icon: '🙏', name: '每日功课', path: '/pages/zen/home', color: '#B85C5C' },
      { icon: '📊', name: '修行报告', path: '/pages/profile/report', color: '#7BA09E' }
    ],

    // 修行趋势数据 (用于图表)
    trendData: {
      dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
      meritValues: [120, 150, 180, 200, 230, 280, 320],
      protectValues: [0, 1, 0, 2, 0, 1, 1]
    },

    // 是否显示图表
    showChart: false
  },

  onLoad() {
    console.log('个人页加载完成');
    this.checkLoginStatus();
    this.loadStats();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadStats();
  },

  // 检查登录状态
  checkLoginStatus() {
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      this.setData({
        hasUserInfo: true,
        userInfo,
        avatarUrl: userInfo.avatarUrl || '/images/profile.png',
        nickname: userInfo.nickName || '',
        userId: userInfo.userId || ''
      });
    }
  },

  // 加载统计数据
  loadStats() {
    // 从本地或 API 加载统计数据
    const stats = wx.getStorageSync('userStats');
    if (stats) {
      this.setData({ stats });
    } else {
      // 使用默认 mock 数据
      this.setData({
        stats: {
          listenCount: 36,
          protectCount: 5,
          continuousDays: 7,
          certCount: 3
        }
      });
    }
  },

  // 用户登录
  login() {
    wx.getUserProfile({
      desc: '用于完善用户资料',
      success: (res) => {
        const userInfo = res.userInfo;
        wx.setStorageSync('userInfo', userInfo);
        this.setData({
          hasUserInfo: true,
          userInfo,
          avatarUrl: userInfo.avatarUrl,
          nickname: userInfo.nickName
        });
        console.log('用户登录成功', userInfo);
        wx.showToast({
          title: '登录成功',
          icon: 'success'
        });
      },
      fail: (err) => {
        console.log('用户取消登录', err);
        wx.showToast({
          title: '取消登录',
          icon: 'none'
        });
      }
    });
  },

  // 导航到指定页面
  navigateTo(e) {
    const item = e.currentTarget.dataset.item;
    if (item.path) {
      wx.navigateTo({
        url: item.path,
        fail: () => {
          wx.showToast({
            title: '即将开放',
            icon: 'none'
          });
        }
      });
    } else {
      wx.showToast({
        title: '即将开放',
        icon: 'none'
      });
    }
  },

  // 快捷操作
  onQuickActionTap(e) {
    const action = e.currentTarget.dataset.action;
    if (action.path) {
      wx.navigateTo({
        url: action.path,
        fail: () => {
          wx.showToast({
            title: '即将开放',
            icon: 'none'
          });
        }
      });
    }
  },

  // 切换图表显示
  toggleChart() {
    this.setData({
      showChart: !this.data.showChart
    });
  },

  // 联系客服
  contactUs() {
    wx.makePhoneCall({
      phoneNumber: '400-xxx-xxxx',
      fail: () => {
        wx.showToast({
          title: '号码错误',
          icon: 'none'
        });
      }
    });
  },

  // 关于我们
  aboutUs() {
    wx.showModal({
      title: '关于清如 ClearSpring',
      content: '清如 ClearSpring 专业服务小程序\n版本：1.0.0\n\n科学放生，护生护心',
      showCancel: false,
      confirmColor: '#07c160'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '我的修行记录 - 清如 ClearSpring',
      path: '/pages/profile/profile',
      imageUrl: ''
    };
  }
});
