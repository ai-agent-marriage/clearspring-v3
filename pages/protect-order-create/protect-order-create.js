// 付费委托护生下单页
const app = getApp();

Page({
  data: {
    // 今日日期
    today: '',
    // 合规声明状态
    isComplianceChecked: false,
    // 水域列表
    waterList: [
      { id: 'water_001', name: '云梦泽生态保护区' },
      { id: 'water_002', name: '澜沧江上游净域' },
      { id: 'water_003', name: '东海近郊自然海域' }
    ],
    // 物种列表
    speciesList: [
      { id: 'species_001', name: '鲫鱼', price: 2.5 },
      { id: 'species_002', name: '鲤鱼', price: 3.0 },
      { id: 'species_003', name: '草鱼', price: 2.8 },
      { id: 'species_004', name: '鲢鱼', price: 2.6 },
      { id: 'species_005', name: '鳙鱼', price: 2.7 },
      { id: 'species_006', name: '泥鳅', price: 1.5 },
      { id: 'species_007', name: '黄鳝', price: 3.5 },
      { id: 'species_008', name: '乌龟', price: 5.0 },
      { id: 'species_009', name: '中华花龟', price: 8.0 },
      { id: 'species_010', name: '巴西龟', price: 4.0 }
    ],
    // 表单数据
    executeDate: '',
    waterIndex: -1,
    speciesIndex: -1,
    quantity: '',
    wish: '',
    // 费用计算
    speciesPrice: 0,
    serviceFee: 0,
    totalPrice: 0
  },

  onLoad() {
    // 设置今日日期
    this.setTodayDate();
  },

  // 设置今日日期
  setTodayDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    this.setData({ today: `${year}-${month}-${day}` });
  },

  // 切换合规声明状态
  toggleCompliance() {
    this.setData({ isComplianceChecked: !this.data.isComplianceChecked });
  },

  // 执行日期变化
  onExecuteDateChange(e) {
    this.setData({ executeDate: e.detail.value });
  },

  // 水域选择变化
  onWaterChange(e) {
    this.setData({ waterIndex: e.detail.value });
  },

  // 物种选择变化
  onSpeciesChange(e) {
    const index = e.detail.value;
    this.setData({ 
      speciesIndex: index,
      speciesPrice: this.data.speciesList[index].price
    });
    this.calculateTotal();
  },

  // 数量输入
  onQuantityInput(e) {
    this.setData({ quantity: e.detail.value });
    this.calculateTotal();
  },

  // 愿望输入
  onWishInput(e) {
    this.setData({ wish: e.detail.value });
  },

  // 计算总费用
  calculateTotal() {
    const quantity = parseInt(this.data.quantity) || 0;
    const speciesPrice = this.data.speciesPrice;
    const serviceFee = quantity > 0 ? 10 : 0; // 固定服务费
    const totalPrice = (quantity * speciesPrice) + serviceFee;
    
    this.setData({
      serviceFee,
      totalPrice
    });
  },

  // 验证表单
  validateForm() {
    if (!this.data.isComplianceChecked) {
      wx.showToast({ title: '请阅读并同意合规声明', icon: 'none' });
      return false;
    }
    if (!this.data.executeDate) {
      wx.showToast({ title: '请选择执行日期', icon: 'none' });
      return false;
    }
    if (this.data.waterIndex < 0) {
      wx.showToast({ title: '请选择执行水域', icon: 'none' });
      return false;
    }
    if (this.data.speciesIndex < 0) {
      wx.showToast({ title: '请选择物种规格', icon: 'none' });
      return false;
    }
    if (!this.data.quantity || parseInt(this.data.quantity) <= 0) {
      wx.showToast({ title: '请输入有效的放生数量', icon: 'none' });
      return false;
    }
    return true;
  },

  // 提交订单
  submitOrder() {
    if (!this.validateForm()) {
      return;
    }

    wx.showLoading({ title: '提交中...' });

    // 构建提交数据
    const submitData = {
      type: 'entrusted',
      executeDate: this.data.executeDate,
      water: this.data.waterList[this.data.waterIndex],
      species: this.data.speciesList[this.data.speciesIndex],
      quantity: parseInt(this.data.quantity),
      wish: this.data.wish,
      fee: {
        speciesPrice: this.data.speciesPrice,
        serviceFee: this.data.serviceFee,
        totalPrice: this.data.totalPrice
      },
      status: 'pending_payment',
      createdAt: new Date().toISOString()
    };

    // 模拟提交（实际项目中需要调用云函数）
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存到本地存储
      const orders = wx.getStorageSync('entrustedOrders') || [];
      orders.push(submitData);
      wx.setStorageSync('entrustedOrders', orders);
      
      wx.showToast({ title: '委托成功', icon: 'success' });
      
      // 跳转到支付页面或订单详情页
      setTimeout(() => {
        wx.navigateTo({ 
          url: `/pages/order-detail/order-detail?id=${orders.length - 1}&type=entrusted` 
        });
      }, 1500);
    }, 1000);
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
