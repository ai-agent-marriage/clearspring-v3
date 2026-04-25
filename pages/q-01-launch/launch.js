Page({
  data: {
    
  },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },

  onLoad() {
    // 启动页逻辑：可在此处添加初始化逻辑
    // 例如：检查用户登录状态、加载配置等
    setTimeout(() => {
      // 模拟加载完成后跳转到首页
      // wx.reLaunch({
      //   url: '/pages/index/index'
      // })
    }, 3000);
  }
});
