// 系统设置
Page({
  data: {
    notifications: {
      newOrder: true,
      qualReview: true,
      appeal: false,
      system: true
    },
    platformRate: 10,
    executorRate: 90,
    settleCycle: 'T+7',
    cacheSize: 128
  },

  onLoad() {
    // 加载设置
  },

  // 切换新订单通知
  toggleNewOrder(e) {
    this.setData({ 'notifications.newOrder': e.detail.value });
  },

  // 切换资质审核通知
  toggleQualReview(e) {
    this.setData({ 'notifications.qualReview': e.detail.value });
  },

  // 切换申诉仲裁通知
  toggleAppeal(e) {
    this.setData({ 'notifications.appeal': e.detail.value });
  },

  // 切换系统公告通知
  toggleSystem(e) {
    this.setData({ 'notifications.system': e.detail.value });
  },

  // 修改平台名称
  editPlatformName() {
    wx.showModal({
      title: '修改平台名称',
      editable: true,
      placeholderText: '请输入新的平台名称',
      success: (res) => {
        if (res.confirm && res.content) {
          // [CLEANED] console.log('修改平台名称', res.content);
        }
      }
    });
  },

  // 修改客服联系方式
  editContactInfo() {
    wx.showModal({
      title: '修改客服联系方式',
      editable: true,
      placeholderText: '请输入客服联系方式',
      success: (res) => {
        if (res.confirm && res.content) {
          // [CLEANED] console.log('修改客服联系方式', res.content);
        }
      }
    });
  },

  // 编辑平台规则
  editPlatformRules() {
    wx.navigateTo({
      url: '/pages/admin-settings-rules/rules'
    });
  },

  // 修改密码
  changePassword() {
    wx.navigateTo({
      url: '/pages/admin-settings-password/password'
    });
  },

  // 查看登录日志
  viewLoginLog() {
    wx.navigateTo({
      url: '/pages/admin-settings-log/log'
    });
  },

  // 管理设备
  manageDevices() {
    wx.navigateTo({
      url: '/pages/admin-settings-devices/devices'
    });
  },

  // 配置平台费率
  configPlatformRate() {
    wx.showModal({
      title: '修改平台服务费率',
      editable: true,
      placeholderText: '请输入费率百分比',
      success: (res) => {
        if (res.confirm && res.content) {
          // [CLEANED] console.log('修改平台费率', res.content);
        }
      }
    });
  },

  // 配置执行者分成
  configExecutorRate() {
    wx.showModal({
      title: '修改执行者分成比例',
      editable: true,
      placeholderText: '请输入分成百分比',
      success: (res) => {
        if (res.confirm && res.content) {
          // [CLEANED] console.log('修改执行者分成', res.content);
        }
      }
    });
  },

  // 配置结算周期
  configSettleCycle() {
    wx.showActionSheet({
      itemList: ['T+1', 'T+3', 'T+7', '月结'],
      success: (res) => {
        // [CLEANED] console.log('选择结算周期', res.tapIndex);
      }
    });
  },

  // 检查更新
  checkUpdate() {
    wx.showLoading({ title: '检查更新中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '已是最新版本',
        content: '当前版本 v3.0.1，无需更新',
        showCancel: false
      });
    }, 1500);
  },

  // 清除缓存
  clearCache() {
    wx.showModal({
      title: '清除缓存',
      content: `确认清除 ${this.data.cacheSize}MB 缓存？`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '清除中...' });
          setTimeout(() => {
            wx.hideLoading();
            this.setData({ cacheSize: 0 });
            wx.showModal({
              title: '清除成功',
              content: '缓存已清除',
              showCancel: false
            });
          }, 1000);
        }
      }
    });
  },

  // 查看帮助
  viewHelp() {
    wx.navigateTo({
      url: '/pages/admin-settings-help/help'
    });
  },

  // 退出登录
  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出当前账号？',
      success: (res) => {
        if (res.confirm) {
          // [CLEANED] console.log('退出登录');
          // TODO: 清除登录状态
          wx.reLaunch({ url: '/pages/admin-login/login' });
        }
      }
    });
  },

  // 切换菜单
  toggleMenu() {
    // [CLEANED] console.log('切换菜单');
  }
});
