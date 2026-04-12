// pages/q-01-launch/q-01-launch.js

Page({
  data: {
    version: '3.0.0'
  },

  onLoad(options) {
    // 页面加载时执行初始化
    this.initializeApp();
  },

  onReady() {
    // 页面初次渲染完成
    console.log('Q-01 启动页渲染完成');
  },

  onShow() {
    // 页面显示
  },

  onHide() {
    // 页面隐藏
  },

  onUnload() {
    // 页面卸载
  },

  /**
   * 初始化应用
   */
  async initializeApp() {
    try {
      // 1. 检查登录状态
      const isLoggedIn = await this.checkLoginStatus();
      
      // 2. 加载用户数据
      if (isLoggedIn) {
        await this.loadUserData();
      }

      // 3. 预加载必要数据
      await this.preloadData();

      // 4. 延迟跳转（展示启动页动画）
      setTimeout(() => {
        this.navigateToHome(isLoggedIn);
      }, 2000);

    } catch (error) {
      console.error('启动页初始化失败:', error);
      // 发生错误时仍然跳转到首页（未登录状态）
      setTimeout(() => {
        this.navigateToHome(false);
      }, 2000);
    }
  },

  /**
   * 检查登录状态
   * @returns {Promise<boolean>} 是否已登录
   */
  async checkLoginStatus() {
    return new Promise((resolve) => {
      const token = wx.getStorageSync('token');
      const userInfo = wx.getStorageSync('userInfo');
      resolve(!!token && !!userInfo);
    });
  },

  /**
   * 加载用户数据
   */
  async loadUserData() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        // 更新全局用户数据
        getApp().globalData.userInfo = userInfo;
      }
    } catch (error) {
      console.error('加载用户数据失败:', error);
    }
  },

  /**
   * 预加载必要数据
   */
  async preloadData() {
    try {
      // 预加载首页数据
      // 预加载配置数据
      // 预加载缓存数据
      console.log('数据预加载完成');
    } catch (error) {
      console.error('数据预加载失败:', error);
    }
  },

  /**
   * 跳转到首页
   * @param {boolean} isLoggedIn 是否已登录
   */
  navigateToHome(isLoggedIn) {
    if (isLoggedIn) {
      wx.switchTab({
        url: '/pages/index/index',
        fail: (err) => {
          console.error('跳转到首页失败:', err);
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      });
    } else {
      // 未登录，跳转到首页（游客模式）
      wx.switchTab({
        url: '/pages/index/index',
        fail: (err) => {
          console.error('跳转到首页失败:', err);
          wx.reLaunch({
            url: '/pages/index/index'
          });
        }
      });
    }
  },

  /**
   * 获取版本信息
   */
  getVersionInfo() {
    const accountInfo = wx.getAccountInfoSync();
    const version = accountInfo.miniProgram.version || '3.0.0';
    this.setData({ version });
  }
});
