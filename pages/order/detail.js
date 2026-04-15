// pages/order/detail.js - 委托订单详情页
Page({
  data: {
    order: {
      orderNo: 'PRO202604070001',
      status: 4,
      statusName: '待确认',
      createTime: '2026-04-07 10:00:00',
      payTime: '2026-04-07 10:05:00',
      orgName: 'XX 生态护生协会',
      orgContact: '138****1234',
      executeDate: '2026-04-15',
      waterArea: '珠江广州段',
      species: '鲢鱼',
      quantity: 10,
      extraServices: ['全程视频记录'],
      wish: '平安顺遂',
      executeImages: [
        'https://via.placeholder.com/300x200?text=执行照片1',
        'https://via.placeholder.com/300x200?text=执行照片2',
        'https://via.placeholder.com/300x200?text=执行照片3'
      ],
      amount: 299,
      payMethod: '微信支付',
      payNo: 'WX20260407100500123456'
    },
    progress: [
      { step: '已支付', time: '2026-04-07 10:05:00', active: true },
      { step: '已承接', time: '2026-04-07 14:00:00', active: true },
      { step: '已执行', time: '2026-04-15 15:00:00', active: true },
      { step: '已确认', time: '', active: false },
      { step: '已完成', time: '', active: false }
    ],
    currentImage: '',
    showImagePreview: false
  },

  onLoad(options) {
    const { orderNo } = options;
    // [CLEANED] console.log('订单详情页加载，订单号:', orderNo);

    // 模拟加载订单数据
    this.loadOrderDetail(orderNo);
  },

  // 加载订单详情
  loadOrderDetail(orderNo) {
    // 实际场景中应调用 API 获取数据
    // 这里使用 mock 数据
    wx.showLoading({ title: '加载中...' });
    
    setTimeout(() => {
      wx.hideLoading();
      // [CLEANED] console.log('订单数据加载完成');
    }, 500);
  },

  // 预览图片
  previewImage(e) {
    const url = e.currentTarget.dataset.url;
    const { executeImages } = this.data.order;
    
    wx.previewImage({
      current: url,
      urls: executeImages
    });
  },

  // 确认圆满完成
  confirmComplete() {
    wx.showModal({
      title: '确认圆满完成',
      content: '请确认护生活动已圆满完成，确认后将无法修改。',
      confirmColor: '#D4B87B',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '提交中...' });
          setTimeout(() => {
            wx.hideLoading();
            wx.showToast({
              title: '已确认',
              icon: 'success'
            });
            // 更新进度
            this.updateProgress(4);
          }, 1000);
        }
      }
    });
  },

  // 申请复核
  applyReview() {
    wx.navigateTo({
      url: `/pages/order/review?orderNo=${this.data.order.orderNo}`
    });
  },

  // 联系机构
  contactOrg() {
    const { orgName, orgContact } = this.data.order;
    wx.showModal({
      title: '联系机构',
      content: `${orgName}\n联系电话：${orgContact}`,
      confirmText: '拨打电话',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: orgContact.replace(/\*/g, '0')
          });
        }
      }
    });
  },

  // 更新进度
  updateProgress(stepIndex) {
    const { progress } = this.data;
    progress.forEach((item, index) => {
      if (index <= stepIndex) {
        item.active = true;
      }
    });
    this.setData({ progress });
  },

  // 查看协议
  viewAgreement() {
    wx.showToast({
      title: '协议详情开发中',
      icon: 'none'
    });
  }
});
