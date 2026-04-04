Page({
  data: {
    record: {
      id: 1,
      speciesName: '鲢鱼',
      quantity: 100,
      address: '珠江广州段',
      date: '2026-04-04',
      wish: '平安顺遂',
      images: ['/images/protect1.jpg', '/images/protect2.jpg'],
      status: 1, // 1 已完成 2 已驳回
      certUrl: '/images/cert_1001.jpg',
      submitTime: '2026-04-04 10:30'
    },
    canEdit: true // 3 天内可编辑
  },

  onLoad(options) {
    console.log('记录详情页加载，recordId:', options.id);
    // 实际场景中应根据 options.id 从后端获取数据
  },

  // 预览图片
  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.record.images[index],
      urls: this.data.record.images
    });
  },

  // 查看证书
  viewCertificate() {
    wx.navigateTo({
      url: `/pages/protect/cert-preview?id=${this.data.record.id}`
    });
  },

  // 编辑修改
  editRecord() {
    if (!this.data.canEdit) {
      wx.showToast({
        title: '超过 3 天无法编辑',
        icon: 'none'
      });
      return;
    }

    wx.navigateTo({
      url: `/pages/protect/register?id=${this.data.record.id}`
    });
  }
});
