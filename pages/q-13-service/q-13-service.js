// 护生委托服务页面 - Stitch V3.0 规范
Page({
  data: {
    agreed: false,
    execDate: '',
    waterOptions: [
      { id: 1, name: '云梦泽生态保护区' },
      { id: 2, name: '澜沧江上游净域' },
      { id: 3, name: '东海近郊自然海域' }
    ],
    waterIndex: 0,
    speciesOptions: [
      { id: 1, name: '原生青鱼 (3-5cm)' },
      { id: 2, name: '锦鲤苗 (精选品级)' },
      { id: 3, name: '中华圆田螺 (成年)' }
    ],
    speciesIndex: 0,
    count: 1,
    videoRecord: false,
    wishTag: false,
    report: false,
    wishMessage: '',
    wishMessageLength: 0,
    userAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDJTEsav7symK1NzBcYRhtz2Td2AuiFgWXdlqSWjCW07cuvBE4f8B6r2WZNCoRaE3lr0CGkxifVwH-LmZ9I05XogmcxgIEzpisCgG5No7N_x0fmG9k4Pd4m4iIoTiFQYKmahOCbQ6_q8CUv8sHnlph7Ar377LD7NUr9nx4uvYoVDt8yhxNg1scDSLFgkJUT1IYc9Suo0uCXk7D1ThigRnq2xgnJPRR-kdN6SBJKBPQgyy5UrAndtAvZ6wFEn8FvcnNj8ldyBw356RfG',
    userName: '云水禅心',
    totalPrice: '0.00'
  },

  onLoad() {
    // 初始化页面
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      execDate: e.detail.value
    });
  },

  // 水域选择
  onWaterChange(e) {
    this.setData({
      waterIndex: e.detail.value
    });
  },

  // 物种选择
  onSpeciesChange(e) {
    this.setData({
      speciesIndex: e.detail.value
    });
  },

  // 数量输入
  onCountInput(e) {
    this.setData({
      count: e.detail.value
    });
    this.calculatePrice();
  },

  // 切换视频记录
  toggleVideoRecord() {
    this.setData({
      videoRecord: !this.data.videoRecord
    });
    this.calculatePrice();
  },

  // 切换心愿标识
  toggleWishTag() {
    this.setData({
      wishTag: !this.data.wishTag
    });
    this.calculatePrice();
  },

  // 切换监测报告
  toggleReport() {
    this.setData({
      report: !this.data.report
    });
    this.calculatePrice();
  },

  // 心愿输入
  onWishInput(e) {
    this.setData({
      wishMessage: e.detail.value,
      wishMessageLength: e.detail.value.length
    });
  },

  // 计算价格
  calculatePrice() {
    const basePrice = this.data.count * 10;
    const videoPrice = this.data.videoRecord ? 99 : 0;
    const wishPrice = this.data.wishTag ? 50 : 0;
    const reportPrice = this.data.report ? 50 : 0;
    const total = basePrice + videoPrice + wishPrice + reportPrice;
    this.setData({
      totalPrice: total.toFixed(2)
    });
  },

  // 提交委托单
  onSubmit() {
    if (!this.data.agreed) {
      wx.showToast({
        title: '请先同意合规声明',
        icon: 'none'
      });
      return;
    }

    if (!this.data.execDate) {
      wx.showToast({
        title: '请选择执行日期',
        icon: 'none'
      });
      return;
    }

    // TODO: 提交委托单
    wx.showToast({
      title: '提交成功',
      icon: 'success'
    });
  }
});
