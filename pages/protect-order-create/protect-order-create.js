// pages/protect-order-create/protect-order-create.js
const app = getApp();

Page({
  data: {
    formData: {
      species_id: '',
      species_name: '',
      species_spec: '',
      quantity: '',
      protection_date: '',
      water_area_id: '',
      service_items: ['exec', 'feedback', 'certificate'],
      wish: '',
      commitment_accepted: true,
      agreement_accepted: false
    },
    minDate: '',
    maxDate: '',
    waterAreas: [],
    waterAreaIndex: -1,
    serviceItems: [
      { label: '现场执行', value: 'exec', price: 100, desc: '专业团队执行护生' },
      { label: '执行反馈', value: 'feedback', price: 50, desc: '提供现场照片/视频' },
      { label: '圆满证书', value: 'certificate', price: 0, desc: '生成电子证书' }
    ],
    speciesPrice: 0,
    servicePrice: 150,
    totalPrice: 150,
    canSubmit: false,
    submitting: false
  },

  onLoad() {
    // 初始化日期范围
    const today = new Date();
    const minDate = new Date();
    minDate.setDate(today.getDate() + 7);
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);
    
    this.setData({
      minDate: this.formatDate(minDate),
      maxDate: this.formatDate(maxDate)
    });

    this.loadWaterAreas();
    this.calculatePrice();
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 加载合规水域
  async loadWaterAreas() {
    try {
      // 这里可以调用 API 获取合规水域列表
      // 暂时使用模拟数据
      const waterAreas = [
        { id: '1', name: '钱塘江流域' },
        { id: '2', name: '西湖水域' },
        { id: '3', name: '富春江' },
        { id: '4', name: '京杭大运河' }
      ];
      
      this.setData({ waterAreas });
    } catch (error) {
      console.error('加载水域失败:', error);
    }
  },

  // 选择物种
  onSelectSpecies() {
    wx.navigateTo({
      url: '/pages/species-list/species-list?selectMode=true'
    });
  },

  // 规格输入
  onSpecInput(e) {
    this.setData({ 'formData.species_spec': e.detail.value });
    this.checkCanSubmit();
  },

  // 数量输入
  onQuantityInput(e) {
    this.setData({ 'formData.quantity': e.detail.value });
    this.calculatePrice();
    this.checkCanSubmit();
  },

  // 日期选择
  onDateChange(e) {
    this.setData({ 'formData.protection_date': e.detail.value });
    this.checkCanSubmit();
  },

  // 水域选择
  onWaterAreaChange(e) {
    const index = e.detail.value;
    this.setData({
      waterAreaIndex: index,
      'formData.water_area_id': this.data.waterAreas[index].id
    });
    this.checkCanSubmit();
  },

  // 服务选择
  onServiceToggle(e) {
    const value = e.currentTarget.dataset.value;
    let serviceItems = [...this.data.formData.service_items];
    
    if (serviceItems.includes(value)) {
      // 证书服务不可取消
      if (value !== 'certificate') {
        serviceItems = serviceItems.filter(item => item !== value);
      }
    } else {
      serviceItems.push(value);
    }

    this.setData({ 'formData.service_items': serviceItems });
    this.calculatePrice();
  },

  // 心愿输入
  onWishInput(e) {
    this.setData({ 'formData.wish': e.detail.value });
  },

  // 协议勾选
  onAgreementChange(e) {
    const values = e.detail.value;
    this.setData({
      'formData.commitment_accepted': values.includes('commitment'),
      'formData.agreement_accepted': values.includes('agreement')
    });
    this.checkCanSubmit();
  },

  // 计算价格
  calculatePrice() {
    const quantity = parseInt(this.data.formData.quantity) || 0;
    const speciesPrice = quantity * 0.5; // 假设每尾 0.5 元
    
    let servicePrice = 0;
    this.data.serviceItems.forEach(item => {
      if (this.data.formData.service_items.includes(item.value)) {
        servicePrice += item.price;
      }
    });

    const totalPrice = speciesPrice + servicePrice;

    this.setData({
      speciesPrice: speciesPrice.toFixed(2),
      servicePrice: servicePrice.toFixed(2),
      totalPrice: totalPrice.toFixed(2)
    });
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const { species_id, species_spec, quantity, protection_date, water_area_id, commitment_accepted, agreement_accepted } = this.data.formData;
    
    const canSubmit = !!(
      species_id &&
      species_spec &&
      quantity &&
      parseInt(quantity) > 0 &&
      protection_date &&
      water_area_id &&
      commitment_accepted &&
      agreement_accepted
    );

    this.setData({ canSubmit });
  },

  // 提交订单
  async onSubmit() {
    if (!this.data.canSubmit || this.data.submitting) return;

    wx.showLoading({ title: '创建订单中...' });
    this.setData({ submitting: true });

    try {
      const res = await app.api.request({
        url: '/api/v1/order/create',
        method: 'POST',
        data: {
          protection_date: this.data.formData.protection_date,
          water_area_id: this.data.formData.water_area_id,
          species_id: this.data.formData.species_id,
          species_spec: this.data.formData.species_spec,
          quantity: parseInt(this.data.formData.quantity),
          service_items: this.data.formData.service_items,
          wish: this.data.formData.wish,
          commitment_accepted: this.data.formData.commitment_accepted,
          agreement_accepted: this.data.formData.agreement_accepted
        }
      });

      if (res.code === 200) {
        wx.hideLoading();
        
        // 发起支付
        const { order_id, pay_params } = res.data;
        
        wx.requestPayment({
          ...pay_params,
          success: () => {
            wx.showToast({ title: '支付成功', icon: 'success' });
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/protect-record-detail/protect-record-detail?record_id=${order_id}&type=order`
              });
            }, 1500);
          },
          fail: (err) => {
            console.error('支付失败:', err);
            wx.showToast({ title: '支付取消', icon: 'none' });
            this.setData({ submitting: false });
          }
        });
      } else {
        wx.hideLoading();
        this.setData({ submitting: false });
        wx.showToast({ title: res.message || '创建失败', icon: 'none' });
      }
    } catch (error) {
      console.error('创建订单失败:', error);
      wx.hideLoading();
      this.setData({ submitting: false });
      wx.showToast({ title: '创建失败，请稍后重试', icon: 'none' });
    }
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '委托护生下单 - 清如',
      path: '/pages/protect-order-create/protect-order-create'
    };
  }
});
