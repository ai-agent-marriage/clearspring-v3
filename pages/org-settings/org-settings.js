// 清如 ClearSpring - 机构设置页 V-10
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // 机构信息
    orgInfo: {
      name: '苏州清如环保服务中心',
      orgNo: 'ORG2025001',
      logo: 'https://example.com/org-logo.jpg',
      phone: '0512-****8888',
      email: 'contact@clearspring.org',
      status: 'verified', // verified, pending, rejected
      statusText: '已认证'
    },
    
    wechatBound: true,
    
    // 通知设置
    notifications: {
      order: true,
      settlement: true,
      volunteer: true,
      system: true
    },
    
    language: '简体中文',
    cacheSize: '3.2 MB',
    version: '4.0.0'
  },

  onLoad() {
    this.loadSettings();
  },

  // 加载设置
  async loadSettings() {
    try {
      // TODO: 从本地存储或云端加载设置
      const settings = wx.getStorageSync('org_settings');
      if (settings) {
        this.setData({
          notifications: settings.notifications || this.data.notifications,
          language: settings.language || this.data.language
        });
      }
      
      // 获取缓存大小
      this.getCacheSize();
    } catch (error) {
      console.error('加载设置失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadSettings',
        showToast: false
      });
    }
  },

  // 获取缓存大小
  async getCacheSize() {
    try {
      // TODO: 计算实际缓存大小
      const cacheSize = '3.2 MB';
      this.setData({ cacheSize });
    } catch (error) {
      console.error('获取缓存大小失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'getCacheSize',
        showToast: false
      });
    }
  },

  // 设置项点击
  onSettingTap(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'phone':
        this.onPhoneChange();
        break;
      case 'email':
        this.onEmailChange();
        break;
      case 'password':
        this.onPasswordChange();
        break;
      case 'wechat':
        this.onWechatBind();
        break;
      case 'language':
        this.onLanguageChange();
        break;
      case 'cache':
        this.onClearCache();
        break;
      case 'version':
        this.onAbout();
        break;
      case 'help':
        this.onHelp();
        break;
      case 'feedback':
        this.onFeedback();
        break;
      case 'contact':
        this.onContact();
        break;
    }
  },

  // 编辑机构信息
  onEditOrgInfo() {
    wx.navigateTo({
      url: '/pages/org-info-edit/org-info-edit'
    });
  },

  // 修改手机号
  onPhoneChange() {
    wx.navigateTo({
      url: '/pages/org-phone-change/org-phone-change'
    });
  },

  // 修改邮箱
  onEmailChange() {
    wx.navigateTo({
      url: '/pages/org-email-change/org-email-change'
    });
  },

  // 修改密码
  onPasswordChange() {
    wx.navigateTo({
      url: '/pages/org-password-change/org-password-change'
    });
  },

  // 绑定微信
  onWechatBind() {
    if (this.data.wechatBound) {
      wx.showModal({
        title: '解除绑定',
        content: '确定要解除微信绑定吗？',
        success: (res) => {
          if (res.confirm) {
            // TODO: 调用微信解绑 API
            this.setData({ wechatBound: false });
            wx.showToast({
              title: '已解绑',
              icon: 'success'
            });
          }
        }
      });
    } else {
      // 绑定微信
      wx.getUserProfile({
        desc: '用于微信绑定',
        success: (res) => {
          console.log('用户信息:', res.userInfo);
          // TODO: 调用云函数绑定微信
          this.setData({ wechatBound: true });
          wx.showToast({
            title: '已绑定',
            icon: 'success'
          });
        },
        fail: (err) => {
          if (err.errMsg !== 'getUserProfile:fail cancel') {
            wx.showToast({
              title: '绑定失败',
              icon: 'none'
            });
          }
        }
      });
    }
  },

  // 通知开关变化
  onNotificationChange(e) {
    const type = e.currentTarget.dataset.type;
    const checked = e.detail.value;
    
    const notifications = {
      ...this.data.notifications,
      [type]: checked
    };
    
    this.setData({ notifications });
    
    // 保存到本地存储
    wx.setStorageSync('org_settings', {
      notifications,
      language: this.data.language
    });
    
    // TODO: 同步到云端
    console.log('通知设置更新:', notifications);
  },

  // 隐私设置
  onPrivacySetting() {
    wx.showActionSheet({
      itemList: ['公开', '仅合作方可见', '私密'],
      success: (res) => {
        wx.showToast({
          title: '已更新',
          icon: 'success'
        });
      }
    });
  },

  // 位置隐私
  onLocationPrivacy() {
    wx.showActionSheet({
      itemList: ['公开', '仅合作方可见', '私密'],
      success: (res) => {
        wx.showToast({
          title: '已更新',
          icon: 'success'
        });
      }
    });
  },

  // 统计数据隐私
  onStatsPrivacy() {
    wx.showActionSheet({
      itemList: ['公开', '仅合作方可见', '私密'],
      success: (res) => {
        wx.showToast({
          title: '已更新',
          icon: 'success'
        });
      }
    });
  },

  // 切换语言
  onLanguageChange() {
    wx.showActionSheet({
      itemList: ['简体中文', '繁體中文', 'English'],
      success: (res) => {
        const languages = ['简体中文', '繁體中文', 'English'];
        this.setData({ language: languages[res.tapIndex] });
        
        // 保存到本地存储
        wx.setStorageSync('org_settings', {
          notifications: this.data.notifications,
          language: languages[res.tapIndex]
        });
        
        wx.showToast({
          title: '语言已切换',
          icon: 'success'
        });
      }
    });
  },

  // 清除缓存
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: `确定要清除 ${this.data.cacheSize} 的缓存吗？`,
      confirmText: '清除',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          // TODO: 清除缓存
          wx.clearStorageSync();
          this.setData({ cacheSize: '0 MB' });
          wx.showToast({
            title: '已清除',
            icon: 'success'
          });
        }
      }
    });
  },

  // 关于我们
  onAbout() {
    wx.showModal({
      title: '关于清如',
      content: '清如 ClearSpring V4.0 - 机构端\n\n心如止水 · 行善积德\n\n让每一次善行都被铭记',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 帮助中心
  onHelp() {
    wx.navigateTo({
      url: '/pages/help/index'
    });
  },

  // 意见反馈
  onFeedback() {
    wx.navigateTo({
      url: '/pages/org-feedback/org-feedback'
    });
  },

  // 联系我们
  onContact() {
    wx.showModal({
      title: '联系我们',
      content: '客服热线：400-888-8888\n服务时间：9:00-21:00\n\n客服邮箱：support@clearspring.com',
      showCancel: false,
      confirmText: '好的'
    });
  },

  // 切换到祈福者端
  onSwitchToPrayer() {
    wx.showModal({
      title: '切换身份',
      content: '确定要切换到祈福者端吗？当前页面将关闭。',
      success: (res) => {
        if (res.confirm) {
          // TODO: 切换身份逻辑
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  // 退出登录
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          // TODO: 清除登录状态
          wx.clearStorageSync();
          
          // 返回登录页或首页
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      }
    });
  }
});
