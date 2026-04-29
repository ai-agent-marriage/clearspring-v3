// 免费自主护生登记页
const app = getApp();

Page({
  data: {
    // 今日日期
    today: '',
    // 物种列表
    speciesList: [
      { id: 'species_001', name: '鲫鱼', category: '鱼类' },
      { id: 'species_002', name: '鲤鱼', category: '鱼类' },
      { id: 'species_003', name: '草鱼', category: '鱼类' },
      { id: 'species_004', name: '鲢鱼', category: '鱼类' },
      { id: 'species_005', name: '鳙鱼', category: '鱼类' },
      { id: 'species_006', name: '泥鳅', category: '鱼类' },
      { id: 'species_007', name: '黄鳝', category: '鱼类' },
      { id: 'species_008', name: '乌龟', category: '爬行类' },
      { id: 'species_009', name: '中华花龟', category: '爬行类' },
      { id: 'species_010', name: '巴西龟', category: '爬行类' }
    ],
    // 表单数据
    speciesIndex: -1,
    quantity: '',
    location: [],
    address: '',
    date: '',
    wish: '',
    photos: []
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

  // 物种选择变化
  onSpeciesChange(e) {
    this.setData({ speciesIndex: e.detail.value });
  },

  // 数量输入
  onQuantityInput(e) {
    this.setData({ quantity: e.detail.value });
  },

  // 地点选择变化
  onLocationChange(e) {
    this.setData({ location: e.detail.value });
  },

  // 详细地址输入
  onAddressInput(e) {
    this.setData({ address: e.detail.value });
  },

  // 日期选择变化
  onDateChange(e) {
    this.setData({ date: e.detail.value });
  },

  // 愿望输入
  onWishInput(e) {
    this.setData({ wish: e.detail.value });
  },

  // 选择照片
  choosePhoto() {
    wx.chooseImage({
      count: 9 - this.data.photos.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newPhotos = [...this.data.photos, ...res.tempFilePaths];
        this.setData({ photos: newPhotos });
      }
    });
  },

  // 删除照片
  deletePhoto(e) {
    const index = e.currentTarget.dataset.index;
    const photos = this.data.photos.filter((_, i) => i !== index);
    this.setData({ photos });
  },

  // 验证表单
  validateForm() {
    if (this.data.speciesIndex < 0) {
      wx.showToast({ title: '请选择放生物种', icon: 'none' });
      return false;
    }
    if (!this.data.quantity || parseInt(this.data.quantity) <= 0) {
      wx.showToast({ title: '请输入有效的放生数量', icon: 'none' });
      return false;
    }
    if (this.data.location.length === 0) {
      wx.showToast({ title: '请选择放生地点', icon: 'none' });
      return false;
    }
    if (!this.data.date) {
      wx.showToast({ title: '请选择放生日期', icon: 'none' });
      return false;
    }
    return true;
  },

  // 提交表单
  submitForm() {
    if (!this.validateForm()) {
      return;
    }

    wx.showLoading({ title: '提交中...' });

    // 构建提交数据
    const submitData = {
      species: this.data.speciesList[this.data.speciesIndex],
      quantity: parseInt(this.data.quantity),
      location: this.data.location,
      address: this.data.address,
      date: this.data.date,
      wish: this.data.wish,
      photos: this.data.photos,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // 模拟提交（实际项目中需要调用云函数）
    setTimeout(() => {
      wx.hideLoading();
      
      // 保存到本地存储
      const records = wx.getStorageSync('selfProtectRecords') || [];
      records.push(submitData);
      wx.setStorageSync('selfProtectRecords', records);
      
      wx.showToast({ title: '登记成功', icon: 'success' });
      
      // 跳转到记录详情页
      setTimeout(() => {
        wx.navigateTo({ 
          url: `/pages/protect-record-detail/protect-record-detail?id=${records.length - 1}` 
        });
      }, 1500);
    }, 1000);
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
