// pages/order/create.js - 付费委托护生下单页
Page({
  data: {
    agree: false,
    form: {
      date: '',
      waterArea: '',
      species: '',
      quantity: 1,
      extraServices: [],
      wish: '',
      userInfo: '清如用户'
    },
    waterAreas: [
      { id: 1, name: '珠江广州段', price: 29.9 },
      { id: 2, name: '东江东莞段', price: 29.9 },
      { id: 3, name: '北江清远段', price: 29.9 }
    ],
    species: [
      { id: 1, name: '鲢鱼', price: 29.9, spec: '10 条/份' },
      { id: 2, name: '鳙鱼', price: 39.9, spec: '10 条/份' },
      { id: 3, name: '草鱼', price: 34.9, spec: '10 条/份' }
    ],
    extraServices: [
      { id: 1, name: '全程视频记录', price: 99 },
      { id: 2, name: '定制化心愿标识', price: 49 },
      { id: 3, name: '年度生态监测报告', price: 199 }
    ],
    totalAmount: 0,
    minDate: '',
    maxDate: ''
  },

  onLoad() {
    // 设置日期选择范围（未来 7-30 天）
    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 7);
    const maxDate = new Date(today);
    maxDate.setDate(today.getDate() + 30);

    this.setData({
      minDate: this.formatDate(minDate),
      maxDate: this.formatDate(maxDate)
    });

    // [CLEANED] console.log('委托下单页加载完成');
  },

  // 格式化日期为 YYYY-MM-DD
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 合规承诺勾选
  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      'form.date': e.detail.value
    });
  },

  // 水域选择
  onWaterAreaChange(e) {
    const index = e.detail.value;
    const waterArea = this.data.waterAreas[index];
    this.setData({
      'form.waterArea': waterArea.name
    });
    this.calculateTotal();
  },

  // 物种选择
  onSpeciesChange(e) {
    const index = e.detail.value;
    const species = this.data.species[index];
    this.setData({
      'form.species': species.name
    });
    this.calculateTotal();
  },

  // 数量输入
  onQuantityInput(e) {
    const quantity = parseInt(e.detail.value) || 1;
    this.setData({
      'form.quantity': quantity
    });
    this.calculateTotal();
  },

  // 增值服务选择
  onExtraServiceChange(e) {
    const values = e.detail.value;
    this.setData({
      'form.extraServices': values
    });
    this.calculateTotal();
  },

  // 心愿寄语输入
  onWishInput(e) {
    const wish = e.detail.value;
    if (wish.length <= 200) {
      this.setData({
        'form.wish': wish
      });
    }
  },

  // 计算总金额
  calculateTotal() {
    const { form, species, extraServices } = this.data;
    
    // 基础金额
    let baseAmount = 0;
    const selectedSpecies = species.find(s => s.name === form.species);
    if (selectedSpecies) {
      baseAmount = selectedSpecies.price * form.quantity;
    }

    // 增值服务金额
    let extraAmount = 0;
    form.extraServices.forEach(serviceId => {
      const service = extraServices.find(s => s.id === parseInt(serviceId));
      if (service) {
        extraAmount += service.price;
      }
    });

    this.setData({
      totalAmount: baseAmount + extraAmount
    });
  },

  // 提交订单
  submitOrder() {
    const { agree, form } = this.data;

    if (!agree) {
      wx.showToast({
        title: '请先勾选合规承诺',
        icon: 'none'
      });
      return;
    }

    if (!form.date || !form.waterArea || !form.species) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    // 跳转到确认页
    wx.navigateTo({
      url: `/pages/order/confirm?data=${encodeURIComponent(JSON.stringify({
        form,
        totalAmount: this.data.totalAmount
      }))}`
    });
  }
});
