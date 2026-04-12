// 清如 ClearSpring - 机构设置页 V-10
/**
 * @file 机构设置页面
 * @description 管理机构账号设置、通知设置、缓存清理
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    orgInfo: { name: '苏州清如环保服务中心', orgNo: 'ORG2025001', logo: 'https://example.com/org-logo.jpg',
      phone: '0512-****8888', email: 'contact@clearspring.org', status: 'verified', statusText: '已认证' },
    wechatBound: true,
    notifications: { order: true, settlement: true, volunteer: true, system: true },
    language: '简体中文', cacheSize: '3.2 MB', version: '4.0.0'
  },

  onLoad() { this.loadSettings(); },

  /**
   * 加载设置
   * @async
   */
  async loadSettings() {
    try {
      const settings = wx.getStorageSync('org_settings');
      if (settings) {
        this.setData({
          notifications: settings.notifications || this.data.notifications,
          language: settings.language || this.data.language
        });
      }
      this.getCacheSize();
    } catch (error) {
      console.error('加载设置失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'loadSettings', showToast: false });
    }
  },

  /**
   * 获取缓存大小
   * @async
   */
  async getCacheSize() {
    try {
      const cacheSize = '3.2 MB';
      this.setData({ cacheSize });
    } catch (error) {
      console.error('获取缓存大小失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'getCacheSize', showToast: false });
    }
  },

  onSettingTap(e) {
    const action = e.currentTarget.dataset.action;
    switch (action) {
      case 'phone': this.onPhoneChange(); break;
      case 'email': this.onEmailChange(); break;
      case 'password': this.onPasswordChange(); break;
      case 'wechat': this.onWechatBind(); break;
      case 'language': this.onLanguageChange(); break;
      case 'cache': this.onClearCache(); break;
      case 'version': this.onAbout(); break;
      case 'help': this.onHelp(); break;
      case 'feedback': this.onFeedback(); break;
      case 'contact': this.onContact(); break;
    }
  },

  onEditOrgInfo() { wx.navigateTo({ url: '/pages/org-info-edit/org-info-edit' }); },
  onPhoneChange() { wx.navigateTo({ url: '/pages/org-phone-change/org-phone-change' }); },
  onEmailChange() { wx.navigateTo({ url: '/pages/org-email-change/org-email-change' }); },
  onPasswordChange() { wx.navigateTo({ url: '/pages/org-password-change/org-password-change' }); },

  onWechatBind() {
    if (this.data.wechatBound) {
      wx.showModal({
        title: '解除绑定', content: '确定要解除微信绑定吗？',
        success: (res) => {
          if (res.confirm) { this.setData({ wechatBound: false }); wx.showToast({ title: '已解绑', icon: 'success' }); }
        }
      });
    } else {
      wx.getUserProfile({
        desc: '用于微信绑定',
        success: (res) => { this.setData({ wechatBound: true }); wx.showToast({ title: '已绑定', icon: 'success' }); },
        fail: (err) => { if (err.errMsg !== 'getUserProfile:fail cancel') { wx.showToast({ title: '绑定失败', icon: 'none' }); } }
      });
    }
  },

  onNotificationChange(e) {
    const type = e.currentTarget.dataset.type;
    const checked = e.detail.value;
    const notifications = { ...this.data.notifications, [type]: checked };
    this.setData({ notifications });
    wx.setStorageSync('org_settings', { notifications, language: this.data.language });
    console.log('通知设置更新:', notifications);
  },

  onPrivacySetting() { wx.showActionSheet({ itemList: ['公开', '仅合作方可见', '私密'], success: () => wx.showToast({ title: '已更新', icon: 'success' }) }); },
  onLocationPrivacy() { wx.showActionSheet({ itemList: ['公开', '仅合作方可见', '私密'], success: () => wx.showToast({ title: '已更新', icon: 'success' }) }); },
  onStatsPrivacy() { wx.showActionSheet({ itemList: ['公开', '仅合作方可见', '私密'], success: () => wx.showToast({ title: '已更新', icon: 'success' }) }); },

  onLanguageChange() {
    wx.showActionSheet({
      itemList: ['简体中文', '繁體中文', 'English'],
      success: (res) => {
        const languages = ['简体中文', '繁體中文', 'English'];
        this.setData({ language: languages[res.tapIndex] });
        wx.setStorageSync('org_settings', { notifications: this.data.notifications, language: languages[res.tapIndex] });
        wx.showToast({ title: '语言已切换', icon: 'success' });
      }
    });
  },

  /**
   * 清除缓存（优化版）
   */
  onClearCache() {
    wx.showModal({
      title: '清除缓存',
      content: `确定要清除 ${this.data.cacheSize} 的缓存吗？`,
      confirmText: '清除',
      confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
      success: async (res) => {
        if (res.confirm) {
          try {
            const keepKeys = ['org_settings', 'user_info', 'token', 'openid'];
            const storageInfo = wx.getStorageInfoSync();
            for (const key of storageInfo.keys) {
              if (!keepKeys.includes(key)) { wx.removeStorageSync(key); }
            }
            this.setData({ cacheSize: '0 MB' });
            wx.showToast({ title: '已清除', icon: 'success' });
          } catch (error) {
            console.error('清除缓存失败:', error);
            wx.showToast({ title: '清除失败', icon: 'none' });
          }
        }
      }
    });
  },

  onAbout() { wx.showModal({ title: '关于清如', content: '清如 ClearSpring V4.0 - 机构端\n\n心如止水 · 行善积德\n\n让每一次善行都被铭记', showCancel: false, confirmText: '知道了' }); },
  onHelp() { wx.navigateTo({ url: '/pages/help/index' }); },
  onFeedback() { wx.navigateTo({ url: '/pages/org-feedback/org-feedback' }); },
  onContact() { wx.showModal({ title: '联系我们', content: '客服热线：400-888-8888\n服务时间：9:00-21:00\n\n客服邮箱：support@clearspring.com', showCancel: false, confirmText: '好的' }); },

  onSwitchToPrayer() {
    wx.showModal({
      title: '切换身份', content: '确定要切换到祈福者端吗？当前页面将关闭。',
      success: (res) => { if (res.confirm) { wx.switchTab({ url: '/pages/index/index' }); } }
    });
  },

  onLogout() {
    wx.showModal({
      title: '退出登录', content: '确定要退出登录吗？',
      confirmText: '退出', confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
      success: (res) => {
        if (res.confirm) { wx.clearStorageSync(); wx.reLaunch({ url: '/pages/index/index' }); }
      }
    });
  }
});
