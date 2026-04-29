/**
 * 清如 ClearSpring - 小程序入口文件
 * 负责初始化、登录态检查、更新检查、日志清理等
 * @module app
 * @version 2.0.0
 */

import constants from './config/constants.js'

const { MAX_ERROR_LOGS } = constants

App({
  /**
   * 小程序启动时执行
   */
  onLaunch() {
    // [CLEANED] console.log('清如 ClearSpring 小程序启动');
    
    try {
      // 1. 初始化云开发
      this.initCloud();
      
      // 2. 检查登录态
      this.checkSession();
      
      // 3. 检查更新
      this.checkUpdate();
      
      // 4. 加载用户信息
      this.loadUserInfo();
      
      // 5. 检查并清理日志（防止存储空间占用过大）
      this.checkLogClean();
      
    } catch (e) {
      console.error('[启动异常]', e);
    }
  },
  
  /**
   * 检查并清理日志
   * 每天自动清理一次，保留最近 7 天的日志
   */
  checkLogClean() {
    try {
      const { checkAndClean } = require('./utils/log-cleaner.js')
      checkAndClean()
    } catch (e) {
      console.error('[日志清理异常]', e)
    }
  },
  
  /**
   * 初始化云开发
   */
  initCloud() {
    wx.cloud.init({
      env: this.globalData.cloudEnv,
      traceUser: true
    });
    // [CLEANED] console.log('[云开发] 初始化完成');
  },
  
  /**
   * 检查登录态
   */
  checkSession() {
    wx.checkSession({
      success: () => {
        // [CLEANED] console.log('[登录态] 有效');
      },
      fail: () => {
        // [CLEANED] console.log('[登录态] 已过期');
        // 清除本地缓存
        wx.removeStorageSync('token');
        wx.removeStorageSync('userInfo');
      }
    });
  },
  
  /**
   * 检查更新
   */
  checkUpdate() {
    try {
      const updateManager = wx.getUpdateManager();
      
      updateManager.onCheckForUpdate({
        success: (res) => {
          if (res.hasUpdate) {
            updateManager.onUpdateReady(() => {
              wx.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: (res) => {
                  if (res.confirm) {
                    updateManager.applyUpdate();
                  }
                }
              });
            });
            
            updateManager.onUpdateFailed(() => {
              wx.showToast({
                title: '更新失败',
                icon: 'none'
              });
            });
          }
        },
        fail: (err) => {
          console.error('[检查更新失败]', err);
        }
      });
    } catch (e) {
      console.error('[更新检查异常]', e);
    }
  },
  
  /**
   * 加载用户信息
   */
  loadUserInfo() {
    try {
      const userInfo = wx.getStorageSync('userInfo');
      if (userInfo) {
        this.globalData.userInfo = userInfo;
        this.globalData.hasUserInfo = true;
      }
    } catch (e) {
      console.error('[加载用户信息失败]', e);
    }
  },
  
  /**
   * 全局错误处理
   */
  onError(error) {
    console.error('[全局错误]', error);
    
    // 记录错误日志
    const logs = wx.getStorageSync('errorLogs') || [];
    logs.push({
      timestamp: Date.now(),
      error: error,
      page: getCurrentPages()[pages.length - 1]?.route || 'unknown'
    });
    
    // 只保留最近 MAX_ERROR_LOGS 条
    if (logs.length > MAX_ERROR_LOGS) {
      logs.splice(0, logs.length - MAX_ERROR_LOGS);
    }
    
    wx.setStorageSync('errorLogs', logs);
    
    // TODO: 上报到服务端
  },
  
  globalData: {
    userInfo: null,
    hasUserInfo: false,
    // 云服务配置（从配置文件读取）
    cloudEnv: require('./config/index.js').cloudEnv,
    // API 基础地址（从配置文件读取）
    apiBase: require('./config/index.js').apiBase
  }
});
