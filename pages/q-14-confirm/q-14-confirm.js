// 订单确认页面 - Stitch V3.0 规范
Page({
  data: {
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDd0X6aJSg23DtVvQ7t5MscrtegcC7xCGy789zsYW27E_J4PvS4IcGYVu6k4RgXINkHwV6eL9n36oS1uwIApKOvGwWtEmCdiYlhBnA0iwO_EYSoGZqUFjoq2P_sGWKvHBtkFo9AynD6fUtje7mwncFhoIbDIYO_rd1GMIYpQ8Df0scue2AuLbN8bTB4wExW5NuidqX3ApPLw0LKYQMN_oVBGqsNelGrt_pxRhf7tFgllG_kpuzpyc2jFB29M35YDuqvn--huIbW7FRD',
    execDate: '2024 年 10 月 15 日 (农历九月十三)',
    waterArea: '浙西天目溪自然保护区',
    species: '本土石斑鱼 (原生鱼种)',
    count: 108,
    quantity: 500,
    requester: '李*华 (认证资深居士)',
    videoRecord: true,
    certificate: true,
    wishMessage: '"愿法界众生，离苦得乐。祈愿家人安康。"',
    agreed: false,
    baseAmount: '1080.00',
    serviceAmount: '199.00',
    monitorAmount: '50.00',
    totalAmount: '1329.00'
  },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },

  onLoad() {
    // 从上一页获取订单数据
  },

  // 协议勾选
  onAgreeChange(e) {
    this.setData({
      agreed: e.detail.value
    });
  },

  // 查看协议
  viewAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // 支付
  onPay() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意协议',
        icon: 'none'
      });
      return;
    }

    // TODO: 调用支付 API
    wx.requestPayment({
      // 支付参数
      success: () => {
        wx.showToast({
          title: '支付成功',
          icon: 'success'
        });
        // 跳转到结果页
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/q-15-result/q-15-result'
          });
        }, 1500);
      },
      fail: () => {
        wx.showToast({
          title: '支付失败',
          icon: 'none'
        });
      }
    });
  }
});
