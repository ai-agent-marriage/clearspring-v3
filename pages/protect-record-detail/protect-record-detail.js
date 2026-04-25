// pages/protect-record-detail/protect-record-detail.js
const app = getApp();

Page({
  data: {
    loading: true,
    record_id: '',
    type: 'self',
    record: {
      record_id: '',
      type: 'self',
      record_no: '',
      protection_date: '',
      water_area: '',
      species_name: '',
      species_scientific_name: '',
      quantity: '',
      photos: [],
      wish: '',
      status: 'pending',
      status_text: '待审核',
      audit_time: null,
      has_certificate: false,
      certificate: null
    },
    formatAuditTime: ''
  },

  onLoad(options) {
    if (options.record_id && options.type) {
      this.setData({
        record_id: options.record_id,
        type: options.type
      });
      this.fetchRecordDetail();
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  // 获取记录详情
  async fetchRecordDetail() {
    try {
      const res = await app.api.request({
        url: '/api/v1/protection/detail',
        method: 'GET',
        data: {
          record_id: this.data.record_id,
          type: this.data.type
        }
      });

      if (res.code === 200) {
        const record = res.data;
        let formatAuditTime = '';
        
        if (record.audit_time) {
          const date = new Date(record.audit_time);
          formatAuditTime = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
        }

        this.setData({
          record,
          formatAuditTime,
          loading: false
        });
      } else {
        this.handleError(res.message || '加载失败');
      }
    } catch (error) {
      console.error('获取记录详情失败:', error);
      this.handleError('网络异常，请稍后重试');
    }
  },

  // 预览照片
  onPreviewPhoto(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.record.photos,
      current: index
    });
  },

  // 查看证书
  onViewCertificate() {
    if (this.data.record.certificate && this.data.record.certificate.image_url) {
      wx.previewImage({
        urls: [this.data.record.certificate.image_url]
      });
    }
  },

  // 分享证书
  onShareCertificate() {
    wx.showShareMenu({
      withShareTicket: true,
      showShareItems: ['wechatFriends', 'wechatMoment']
    });

    wx.showToast({
      title: '点击右上角分享',
      icon: 'none',
      duration: 2000
    });
  },

  // 返回
  onGoBack() {
    wx.navigateBack();
  },

  // 错误处理
  handleError(message) {
    this.setData({ loading: false });
    wx.showModal({
      title: '加载失败',
      content: message,
      showCancel: false,
      confirmText: '返回',
      success: () => {
        wx.navigateBack();
      }
    });
  },

  // 分享给好友
  onShareAppMessage() {
    const record = this.data.record;
    return {
      title: `我的护生记录 - ${record.species_name} ${record.quantity}尾`,
      path: `/pages/protect-record-detail/protect-record-detail?record_id=${record.record_id}&type=${record.type}`,
      imageUrl: record.certificate?.image_url || record.photos[0]
    };
  }
});
