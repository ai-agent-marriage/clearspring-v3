// pages/order/confirm.js - 委托订单确认&支付页
Page({
  data: {
    agree: false,
    order: {
      orderNo: 'PRO202604070001',
      date: '2026-04-15',
      waterArea: '珠江广州段',
      species: '鲢鱼',
      quantity: 10,
      extraServices: ['全程视频记录'],
      wish: '平安顺遂',
      userInfo: '清如用户'
    },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
    amount: {
      baseAmount: 299,
      extraAmount: 99,
      totalAmount: 398
    },
    extraServicesMap: {
      1: '全程视频记录',
      2: '定制化心愿标识',
      3: '年度生态监测报告'
    }
  },

  onLoad(options) {
    // 从上一页接收数据
    if (options.data) {
      try {
        const data = JSON.parse(decodeURIComponent(options.data));
        const { form, totalAmount } = data;
        
        // 生成订单号
        const orderNo = 'PRO' + this.formatDate(new Date()).replace(/-/g, '') + 
          String(Math.floor(Math.random() * 10000)).padStart(4, '0');
        
        // 计算基础金额
        const speciesPrice = {
          '鲢鱼': 29.9,
          '鳙鱼': 39.9,
          '草鱼': 34.9
        };
        const baseAmount = Math.round(speciesPrice[form.species] * form.quantity);
        
        // 计算增值服务金额
        const extraServicesData = [
          { id: 1, name: '全程视频记录', price: 99 },
          { id: 2, name: '定制化心愿标识', price: 49 },
          { id: 3, name: '年度生态监测报告', price: 199 }
        ];
        let extraAmount = 0;
        form.extraServices.forEach(id => {
          const service = extraServicesData.find(s => s.id === parseInt(id));
          if (service) extraAmount += service.price;
        });

        this.setData({
          order: {
            orderNo,
            date: form.date,
            waterArea: form.waterArea,
            species: form.species,
            quantity: form.quantity,
            extraServices: form.extraServices.map(id => 
              extraServicesData.find(s => s.id === parseInt(id))?.name || ''
            ).filter(Boolean),
            wish: form.wish,
            userInfo: form.userInfo
          },
          amount: {
            baseAmount,
            extraAmount,
            totalAmount: baseAmount + extraAmount
          }
        });
      } catch (e) {
        console.error('解析订单数据失败', e);
      }
    }

    // [CLEANED] console.log('订单确认页加载完成');
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 协议勾选
  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  // 查看协议详情
  viewAgreement() {
    wx.showToast({
      title: '协议详情开发中',
      icon: 'none'
    });
  },

  // 提交并支付
  submitAndPay() {
    const { agree } = this.data;

    if (!agree) {
      wx.showToast({
        title: '请先勾选协议',
        icon: 'none'
      });
      return;
    }

    // 模拟支付流程
    wx.showLoading({
      title: '正在支付...'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '支付成功',
        icon: 'success'
      });

      // 跳转到订单详情页
      setTimeout(() => {
        wx.redirectTo({
          url: `/pages/order/detail?orderNo=${this.data.order.orderNo}`
        });
      }, 1500);
    }, 1500);
  }
});
