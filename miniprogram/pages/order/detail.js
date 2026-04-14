// pages/order/detail.js
Page({
  data: {
    complianceChecked: false,
    order: {
      id: '202311048892',
      status: 'pending',
      statusText: '待承接',
      paid: true,
      createTime: '2023-11-04 14:30',
      releaseDate: '2023 年 11 月 10 日',
      waterArea: '翠湖生态自然保护区',
      species: '锦鲤 (精品红白) / 30-35cm',
      quantity: '20 尾',
      services: ['全程影像', '加持仪轨', '纸质证书'],
      wish: '愿众生离苦得乐，家人身体安康，岁岁平安。',
      contact: '李先生',
      amount: {
        bioCost: 2800.00,
        serviceCost: 400.00,
        total: 3200.00,
        commission: 480.00
      }
    }
  },

  onComplianceChange(e) {
    this.setData({
      complianceChecked: e.detail.value
    });
  },

  onAcceptOrder() {
    if (!this.data.complianceChecked) {
      wx.showToast({
        title: '请先阅读并同意合规承诺',
        icon: 'none'
      });
      return;
    }

    wx.showModal({
      title: '确认承接',
      content: '确认承接此订单后，您将负责执行此次护生活动。',
      success: (res) => {
        if (res.confirm) {
          wx.navigateTo({
            url: '/pages/execute/confirm?id=' + this.data.order.id
          });
        }
      }
    });
  },

  onLoad(options) {
    console.log('Order detail page loaded', options);
  }
});
