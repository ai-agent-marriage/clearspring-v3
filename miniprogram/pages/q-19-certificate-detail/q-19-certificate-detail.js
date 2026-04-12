// pages/q-19-certificate-detail/q-19-certificate-detail.js

Page({
  data: {
    certificate: {
      certNo: 'CR-2026-001234',
      recipientName: '张三',
      title: '东北虎保护使者',
      speciesImage: '/assets/images/species-tiger.jpg',
      speciesName: '东北虎',
      speciesLatin: 'Panthera tigris altaica',
      protectionLevel: '国家一级保护动物',
      amount: '199.00',
      donationDate: '2026-04-10',
      issueDate: '2026-04-11',
      statusText: '有效',
      statusClass: 'valid',
      validUntil: '2027-04-11',
      meritCount: '520',
      impactCount: '1280',
      message: '感谢您对东北虎保护事业的支持，您的善举将帮助保护这片森林中的生灵。'
    },
    achievement: {
      protectedArea: '1200',
      trackedCount: '15',
      dataCount: '3680',
      volunteerCount: '256'
    },
    relatedCertificates: []
  },

  onLoad(options) {
    if (options.certId) {
      this.loadCertificate(options.certId);
    }
  },

  onReady() {
    console.log('Q-19 证书详情页渲染完成');
  },

  async loadCertificate(certId) {
    try {
      // 调用云函数加载证书详情
      console.log('加载证书:', certId);
    } catch (error) {
      console.error('加载证书失败:', error);
    }
  },

  showMore() {
    wx.showActionSheet({
      itemList: ['查看证书详情', '下载高清版本', '分享证书', '举报'],
      success: (res) => {
        console.log('用户选择:', res.tapIndex);
      }
    });
  },

  downloadCertificate() {
    wx.showLoading({ title: '下载中...' });
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: '下载成功', icon: 'success' });
    }, 1500);
  },

  shareCertificate() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
    wx.showToast({ title: '点击右上角分享', icon: 'none' });
  },

  onRelatedTap(e) {
    const certId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/q-19-certificate-detail/q-19-certificate-detail?certId=${certId}`
    });
  },

  goBack() {
    wx.navigateBack({ delta: 1 });
  },

  onShareAppMessage() {
    return {
      title: `我的保护证书 - ${this.data.certificate.title}`,
      path: `/pages/q-19-certificate-detail/q-19-certificate-detail?certId=${this.data.certificate.certNo}`
    };
  }
});
