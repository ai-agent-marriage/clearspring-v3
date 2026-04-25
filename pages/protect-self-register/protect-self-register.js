// pages/protect-self-register/protect-self-register.js
const app = getApp();

Page({
  data: {
    formData: {
      species_id: '',
      species_name: '',
      quantity: '',
      protect_date: '',
      water_area: '',
      photos: [],
      wish_message: '',
      commitment_accepted: true
    },
    minDate: '',
    maxDate: '',
    canSubmit: false,
    submitting: false,
    showSuccessModal: false,
    recordId: null
  },

  onLoad(options) {
    // 初始化日期范围
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);
    
    this.setData({
      minDate: this.formatDate(today),
      maxDate: this.formatDate(maxDate)
    });

    // 从上一页传递物种信息
    if (options.species_id && options.species_name) {
      this.setData({
        'formData.species_id': options.species_id,
        'formData.species_name': options.species_name
      });
    }

    this.checkCanSubmit();
  },

  // 格式化日期
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // 选择物种
  onSelectSpecies() {
    wx.navigateTo({
      url: '/pages/species-list/species-list?selectMode=true'
    });
  },

  // 数量输入
  onQuantityInput(e) {
    const value = e.detail.value;
    this.setData({ 'formData.quantity': value });
    this.checkCanSubmit();
  },

  // 日期选择
  onDateChange(e) {
    this.setData({ 'formData.protect_date': e.detail.value });
    this.checkCanSubmit();
  },

  // 水域输入
  onWaterAreaInput(e) {
    this.setData({ 'formData.water_area': e.detail.value });
    this.checkCanSubmit();
  },

  // 上传照片
  onUploadPhoto() {
    const maxCount = 6 - this.data.formData.photos.length;
    
    wx.chooseMedia({
      count: maxCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(file => ({
          path: file.tempFilePath,
          url: file.tempFilePath
        }));

        this.setData({
          'formData.photos': [...this.data.formData.photos, ...newPhotos]
        });
        this.checkCanSubmit();
      }
    });
  },

  // 预览照片
  onPreviewPhoto(e) {
    const index = e.currentTarget.dataset.index;
    const urls = this.data.formData.photos.map(p => p.url);
    
    wx.previewImage({
      urls,
      current: index
    });
  },

  // 删除照片
  onDeletePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photos = this.data.formData.photos;
    photos.splice(index, 1);
    
    this.setData({ 'formData.photos': photos });
    this.checkCanSubmit();
  },

  // 心愿输入
  onWishInput(e) {
    this.setData({ 'formData.wish_message': e.detail.value });
  },

  // 承诺勾选
  onCommitmentChange(e) {
    this.setData({ 
      'formData.commitment_accepted': e.detail.value.length > 0 
    });
    this.checkCanSubmit();
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const { species_id, quantity, protect_date, water_area, photos, commitment_accepted } = this.data.formData;
    
    const canSubmit = !!(
      species_id &&
      quantity &&
      parseInt(quantity) > 0 &&
      protect_date &&
      water_area &&
      photos.length > 0 &&
      commitment_accepted
    );

    this.setData({ canSubmit });
  },

  // 提交登记
  async onSubmit() {
    if (!this.data.canSubmit || this.data.submitting) return;

    wx.showLoading({ title: '提交中...' });
    this.setData({ submitting: true });

    try {
      // 先上传照片
      const photoUrls = await this.uploadPhotos();
      
      // 提交登记
      const res = await app.api.request({
        url: '/api/v1/protect-life/self-submit',
        method: 'POST',
        data: {
          protect_date: this.data.formData.protect_date,
          water_area: this.data.formData.water_area,
          species_id: this.data.formData.species_id,
          quantity: parseInt(this.data.formData.quantity),
          photos: photoUrls,
          wish_message: this.data.formData.wish_message
        }
      });

      if (res.code === 200) {
        wx.hideLoading();
        this.setData({
          submitting: false,
          showSuccessModal: true,
          recordId: res.data.record_id
        });
      } else {
        wx.hideLoading();
        this.setData({ submitting: false });
        wx.showToast({ title: res.message || '提交失败', icon: 'none' });
      }
    } catch (error) {
      console.error('提交失败:', error);
      wx.hideLoading();
      this.setData({ submitting: false });
      wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
    }
  },

  // 上传照片
  async uploadPhotos() {
    const uploadPromises = this.data.formData.photos.map(photo => {
      return new Promise((resolve, reject) => {
        wx.uploadFile({
          url: `${app.api.baseUrl}/api/v1/upload/image`,
          filePath: photo.path,
          name: 'file',
          formData: { scene: 'protect_life' },
          success: (res) => {
            const data = JSON.parse(res.data);
            if (data.code === 200) {
              resolve(data.data.url);
            } else {
              reject(new Error(data.message));
            }
          },
          fail: reject
        });
      });
    });

    return await Promise.all(uploadPromises);
  },

  // 查看记录
  onViewRecord() {
    wx.redirectTo({
      url: `/pages/protect-record-detail/protect-record-detail?record_id=${this.data.recordId}&type=self`
    });
  },

  // 返回首页
  onGoHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '自主护生登记 - 清如',
      path: '/pages/protect-self-register/protect-self-register'
    };
  }
});
