// 审核状态 - O-03
Page({
  data: {
    complianceChecked: false,
    orderInfo: {
      status: '待承接',
      orderNo: '202311048892',
      paid: true,
      time: '2023-11-04 14:30',
      releaseDate: '2023 年 11 月 10 日',
      waterArea: '翠湖生态自然保护区',
      species: '锦鲤 (精品红白) / 30-35cm',
      quantity: '20 尾',
      services: ['全程影像', '加持仪轨', '纸质证书'],
      wish: '"愿众生离苦得乐，家人身体安康，岁岁平安。"',
      contact: '李先生',
      totalAmount: '3,200.00',
      purchaseFee: '2,800.00',
      serviceFee: '400.00',
      commission: '480.00'
    }

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
  },

  onLoad() {
    // 页面加载
  },

  onShow() {
    // 页面显示
  },

  // 返回
  onBack() {
    wx.navigateBack();
  },

  // 合规勾选
  onComplianceChange(e) {
    this.setData({
      complianceChecked: e.detail.value
    });
  },

  // 查看承诺书
  onViewCommitment() {
    wx.showToast({
      title: '查看承诺书',
      icon: 'none'
    });
  },

  // 查看联系方式
  onViewContact() {
    wx.showToast({
      title: '查看联系方式',
      icon: 'none'
    });
  },

  // 承接订单
  onAcceptOrder() {
    if (!this.data.complianceChecked) {
      wx.showToast({
        title: '请先阅读并同意承诺书',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认承接',
      content: '确定要承接此订单吗？',
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '承接成功',
            icon: 'success'
          });
          // 跳转到执行页面
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/executor-assistant/assistant'
            });
          }, 1500);
        }
      }
    });
  }
});
