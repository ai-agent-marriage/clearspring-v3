Page({
  data: {
    isAgreed: false,
    date: '',
    waterBody: '',
    speciesOptions: ['草鱼', '白鲢', '鲫鱼', '本土草龟'],
    speciesIndex: -1,
    quantity: '',
    photos: [],
    wishes: '',
    wishesLength: 0
  },

  onLoad() {
    // 初始化表单
  },

  // 同意合规承诺
  onAgreeChange(e) {
    this.setData({
      isAgreed: e.detail.value.length > 0
    });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  // 水域输入
  onWaterBodyInput(e) {
    this.setData({
      waterBody: e.detail.value
    });
  },

  // 物种选择
  onSpeciesChange(e) {
    this.setData({
      speciesIndex: e.detail.value
    });
  },

  // 数量输入
  onQuantityInput(e) {
    this.setData({
      quantity: e.detail.value
    });
  },

  // 添加照片
  onAddPhoto() {
    if (this.data.photos.length >= 6) {
      wx.showToast({
        title: '最多上传 6 张照片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: 6 - this.data.photos.length,
      mediaType: ['image'],
      success: (res) => {
        const newPhotos = res.tempFiles.map(file => file.tempFilePath);
        this.setData({
          photos: [...this.data.photos, ...newPhotos]
        });
      }
    });
  },

  // 删除照片
  onDeletePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photos = this.data.photos.filter((_, i) => i !== index);
    this.setData({
      photos
    });
  },

  // 心愿输入
  onWishesInput(e) {
    const wishes = e.detail.value;
    this.setData({
      wishes,
      wishesLength: wishes.length
    });
  },

  // 提交表单
  onSubmit() {
    if (!this.data.isAgreed) {
      wx.showToast({
        title: '请先同意合规承诺',
        icon: 'none'
      });
      return;
    }

    if (!this.data.date || !this.data.waterBody || this.data.speciesIndex < 0 || !this.data.quantity) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (this.data.photos.length === 0) {
      wx.showToast({
        title: '请至少上传一张照片',
        icon: 'none'
      });
      return;
    }

    // 提交数据
    wx.showLoading({
      title: '提交中...'
    });

    // TODO: 调用 API 提交数据
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  }
});
