// 分账配置
const auth = require('../../utils/auth');

Page({
  data: {
    platformRate: 10,
    executorRate: 90,
    settleCycle: 'T+7',
    minWithdraw: 50,
    withdrawFeeRate: 0.5,
    maxFee: 50,
    freeWithdrawEnabled: true,
    freeWithdrawAmount: 1000
  },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },

  onLoad() {
    // 【安全修复】验证管理员登录状态
    if (!auth.requireAdminAuth(this)) {
      return;
    }
    this.loadConfig();
  },

  // 加载配置
  loadConfig() {
    // TODO: 从云函数加载分账配置
    // [CLEANED] console.log('加载分账配置');
  },

  // 平台费率变化
  onPlatformRateChange(e) {
    const platformRate = e.detail.value;
    const executorRate = 100 - platformRate;
    this.setData({ platformRate, executorRate });
  },

  // 选择结算周期
  selectSettleCycle(e) {
    const cycle = e.currentTarget.dataset.cycle;
    this.setData({ settleCycle: cycle });
  },

  // 最低提现金额变化
  onMinWithdrawChange(e) {
    this.setData({ minWithdraw: e.detail.value });
  },

  // 设置最低提现金额
  setMinWithdraw(e) {
    const amount = e.currentTarget.dataset.amount;
    this.setData({ minWithdraw: amount });
  },

  // 手续费率变化
  onFeeRateChange(e) {
    this.setData({ withdrawFeeRate: e.detail.value });
  },

  // 最高手续费变化
  onMaxFeeChange(e) {
    this.setData({ maxFee: e.detail.value });
  },

  // 切换免费提现
  toggleFreeWithdraw(e) {
    this.setData({ freeWithdrawEnabled: e.detail.value });
  },

  // 免费额度变化
  onFreeAmountChange(e) {
    this.setData({ freeWithdrawAmount: e.detail.value });
  },

  // 保存配置
  saveConfig() {
    const { platformRate, executorRate, settleCycle, minWithdraw, withdrawFeeRate, maxFee, freeWithdrawEnabled, freeWithdrawAmount } = this.data;
    
    // 验证配置
    if (platformRate + executorRate !== 100) {
      wx.showModal({
        title: '配置错误',
        content: '平台服务费与执行者所得比例之和必须为 100%',
        showCancel: false
      });
      return;
    }

    wx.showLoading({ title: '保存配置中...' });
    
    // TODO: 调用云函数保存配置
    setTimeout(() => {
      wx.hideLoading();
      wx.showModal({
        title: '保存成功',
        content: '分账配置已更新，新订单将按新配置执行',
        showCancel: false
      });
    }, 1500);
  },

  // 切换菜单
  toggleMenu() {
    // [CLEANED] console.log('切换菜单');
  }
});
