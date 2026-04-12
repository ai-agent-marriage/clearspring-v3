// 清如 ClearSpring - 执行者系统设置 O-12
/**
 * @file 执行者系统设置页面
 * @description 管理账号设置、通知设置、缓存清理等
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    userInfo: {
      phone: '138****5678'
    },
    wechatBound: true,
    notifications: {
      order: true,
      income: true,
      system: true,
      activity: false
    },
    language: '简体中文',
    cacheSize: '2.5 MB',
    version: '4.0.0'
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.loadSettings();
  },

  /**
   * 加载设置
   * @async
   */
  async loadSettings() {
    try {
      // TODO: 从本地存储或云端加载设置
      const settings = wx.getStorageSync('executor_settings');
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

  /**
   * 获取缓存大小
   * @async
   */
  async getCacheSize() {
    try {
      // TODO: 计算实际缓存大小
      // 这里使用模拟数据
      const cacheSize = '2.5 MB';
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

  /**
   * 设置项点击
   * @param {Event} e - 点击事件
   */
  onSettingTap(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'phone':
        this.onPhoneChange();
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

  /**
   * 修改手机号
   */
  onPhoneChange() {
    wx.navigateTo({
      url: '/pages/executor-phone-change/executor-phone-change'
    });
  },

  /**
   * 修改密码
   */
  onPasswordChange() {
    wx.navigateTo({
      url: '/pages/executor-password-change/executor-password-change'
    });
  },

  /**
   * 绑定微信
   */
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

  /**
   * 通知开关变化
   * @param {Event} e - 开关事件
   */
  onNotificationChange(e) {
    const type = e.currentTarget.dataset.type;
    const checked = e.detail.value;
    
    const notifications = {
      ...this.data.notifications,
      [type]: checked
    };
    
    this.setData({ notifications });
    
    // 保存到本地存储
    wx.setStorageSync('executor_settings', {
      notifications,
      language: this.data.language
    });
    
    // TODO: 同步到云端
    console.log('通知设置更新:', notifications);
  },

  /**
   * 切换语言
   */
  onLanguageChange() {
    wx.showActionSheet({
      itemList: ['简体中文', '繁體中文', 'English'],
      success: (res) => {
        const languages = ['简体中文', '繁體中文', 'English'];
        this.setData({ language: languages[res.tapIndex] });
        
        // 保存到本地存储
        wx.setStorageSync('executor_settings', {
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

  /**
   * 清除缓存（优化版：只清除缓存，保留登录状态）
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
            // 只清除缓存数据，保留登录状态等关键数据
            const keepKeys = ['executor_settings', 'user_info', 'token', 'openid'];
            const storageInfo = wx.getStorageInfoSync();
            
            for (const key of storageInfo.keys) {
              if (!keepKeys.includes(key)) {
                wx.removeStorageSync(key);
              }
            }
            
            this.setData({ cacheSize: '0 MB' });
            wx.showToast({
              title: '已清除',
              icon: 'success'
            });
          } catch (error) {
            console.error('清除缓存失败:', error);
            wx.showToast({
              title: '清除失败',
              icon: 'none'
            });
          }
        }
      }
    });
  },

  /**
   * 关于我们
   */
  onAbout() {
    wx.showModal({
      title: '关于清如',
      content: '清如 ClearSpring V4.0\n\n心如止水 · 行善积德\n\n让每一次善行都被铭记',
      showCancel: false,
      confirmText: '知道了'
    });
  },

  /**
   * 帮助中心
   */
  onHelp() {
    wx.navigateTo({
      url: '/pages/help/index'
    });
  },

  /**
   * 意见反馈
   */
  onFeedback() {
    wx.navigateTo({
      url: '/pages/executor-feedback/executor-feedback'
    });
  },

  /**
   * 联系我们
   */
  onContact() {
    wx.showModal({
      title: '联系我们',
      content: '客服热线：400-888-8888\n服务时间：9:00-21:00\n\n客服邮箱：support@clearspring.com',
      showCancel: false,
      confirmText: '好的'
    });
  },

  /**
   * 切换到祈福者端
   */
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

  /**
   * 退出登录
   */
  onLogout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      confirmText: '退出',
      confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
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
