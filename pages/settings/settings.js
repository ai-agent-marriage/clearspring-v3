// pages/settings/settings.js

Page({
  data: {
    // 版本号
    version: '1.0.0',
    
    // 缓存大小
    cacheSize: 24.5,
    
    // 通知设置
    notifications: {
      activity: true,
      merit: false,
      system: true,
      subscribeMessage: true
    },
    
    // 外观设置
    appearance: {
      xuanPaper: true,
      themeName: '禅意金系'
    },
    
    // 主题列表
    themes: [
      { id: 'gold', name: '禅意金系' },
      { id: 'celadon', name: '青瓷系' },
      { id: 'cinnabar', name: '朱砂系' },
      { id: 'ink', name: '墨色系' }
    ],
    
    // 当前主题索引
    themeIndex: 0
  },

  onLoad() {
    this.loadSettings();
  },

  // 加载设置
  loadSettings() {
    const settings = wx.getStorageSync('settings');
    if (settings) {
      this.setData({
        notifications: settings.notifications || this.data.notifications,
        appearance: settings.appearance || this.data.appearance,
        themeIndex: settings.themeIndex || 0
      });
      
      // 更新主题名称
      const currentTheme = this.data.themes[this.data.themeIndex];
      if (currentTheme) {
        this.setData({
          'appearance.themeName': currentTheme.name
        });
      }
    }
  },

  // 保存设置
  saveSettings() {
    const settings = {
      notifications: this.data.notifications,
      appearance: this.data.appearance,
      themeIndex: this.data.themeIndex
    };
    wx.setStorageSync('settings', settings);
  },

  // 活动通知开关
  onActivityNotificationChange(e) {
    this.setData({
      'notifications.activity': e.detail.value
    });
    this.saveSettings();
    wx.showToast({
      title: e.detail.value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 功德提醒开关
  onMeritNotificationChange(e) {
    this.setData({
      'notifications.merit': e.detail.value
    });
    this.saveSettings();
    wx.showToast({
      title: e.detail.value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 系统通知开关
  onSystemNotificationChange(e) {
    this.setData({
      'notifications.system': e.detail.value
    });
    this.saveSettings();
    wx.showToast({
      title: e.detail.value ? '已开启' : '已关闭',
      icon: 'none'
    });
  },

  // 订阅消息开关
  onSubscribeMessageChange(e) {
    const value = e.detail.value;
    this.setData({
      'notifications.subscribeMessage': value
    });
    this.saveSettings();
    
    if (value) {
      // 请求订阅消息授权
      wx.requestSubscribeMessage({
        tmplIds: ['MESSAGE_TEMPLATE_ID'],
        success: (res) => {
          console.log('订阅消息授权成功', res);
          wx.showToast({
            title: '已开启推送',
            icon: 'success'
          });
        },
        fail: (err) => {
          console.log('订阅消息授权失败', err);
          this.setData({
            'notifications.subscribeMessage': false
          });
          this.saveSettings();
        }
      });
    } else {
      wx.showToast({
        title: '已关闭推送',
        icon: 'none'
      });
    }
  },

  // 宣纸风格开关
  onXuanPaperChange(e) {
    this.setData({
      'appearance.xuanPaper': e.detail.value
    });
    this.saveSettings();
    
    // 应用宣纸纹理
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    if (e.detail.value) {
      wx.createSelectorQuery().in(currentPage).select('.container').addClass('xuan-paper-mode');
    } else {
      wx.createSelectorQuery().in(currentPage).select('.container').removeClass('xuan-paper-mode');
    }
    
    wx.showToast({
      title: e.detail.value ? '已启用宣纸风格' : '已关闭宣纸风格',
      icon: 'none'
    });
  },

  // 主题切换
  onThemeChange(e) {
    const index = e.detail.value;
    const theme = this.data.themes[index];
    
    this.setData({
      themeIndex: index,
      'appearance.themeName': theme.name
    });
    this.saveSettings();
    
    // 应用主题
    this.applyTheme(theme.id);
    
    wx.showToast({
      title: `已切换至${theme.name}`,
      icon: 'none'
    });
  },

  // 应用主题
  applyTheme(themeId) {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const container = wx.createSelectorQuery().in(currentPage).select('.container');
    
    // 移除所有主题类
    container.removeClass('theme-gold')
      .removeClass('theme-celadon')
      .removeClass('theme-cinnabar')
      .removeClass('theme-ink');
    
    // 添加新主题类
    container.addClass(`theme-${themeId}`);
  },

  // 隐私政策
  onPrivacyTap() {
    wx.navigateTo({
      url: '/pages/privacy/privacy'
    });
  },

  // 用户协议
  onUserAgreementTap() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // 授权管理
  onAuthorizationTap() {
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        wx.showToast({
          title: '已授权',
          icon: 'success'
        });
      },
      fail() {
        wx.showModal({
          title: '授权管理',
          content: '请在小程序设置中管理授权',
          showCancel: false
        });
      }
    });
  },

  // 清除缓存
  onClearCacheTap() {
    wx.showModal({
      title: '清除缓存',
      content: `确定清除 ${this.data.cacheSize}MB 缓存吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.clearStorageSync();
          this.setData({
            cacheSize: 0
          });
          wx.showToast({
            title: '缓存已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 关于清如
  onAboutTap() {
    wx.showModal({
      title: '清如 ClearSpring',
      content: `版本：${this.data.version}\n\n清如是一个专业的放生服务平台，致力于推广科学放生、如法放生的理念，让每一次善行都更有意义。`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 使用帮助
  onHelpTap() {
    wx.navigateTo({
      url: '/pages/help/help'
    });
  },

  // 意见反馈
  onFeedbackTap() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  },

  // 联系我们
  onContactTap() {
    wx.showModal({
      title: '联系我们',
      content: '客服微信：qingru_service\n\n服务时间：9:00-18:00',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '清如 ClearSpring - 科学放生平台',
      path: '/pages/settings/settings',
      imageUrl: ''
    };
  }
});
