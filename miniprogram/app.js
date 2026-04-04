// app.js - 全局入口
App({
  onLaunch() {
    // 微信登录初始化
    wx.login({
      success: (res) => {
        if (res.code) {
          // 发送 code 到后端换取 session
          console.log('微信登录 code:', res.code)
          // TODO: 调用后端接口换取 openid 和 session_key
        } else {
          console.error('微信登录失败:', res.errMsg)
        }
      }
    })

    // 获取系统信息
    const systemInfo = wx.getSystemInfoSync()
    this.globalData.systemInfo = systemInfo

    // 初始化本地存储
    this.initStorage()
  },

  initStorage() {
    // 初始化用户信息
    const userInfo = wx.getStorageSync('userInfo')
    if (!userInfo) {
      wx.setStorageSync('userInfo', {})
    }

    // 初始化 token
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.setStorageSync('token', '')
    }
  },

  globalData: {
    userInfo: null,
    token: '',
    systemInfo: null,
    baseUrl: 'https://api.example.com',
    version: '1.0.0'
  }
})
