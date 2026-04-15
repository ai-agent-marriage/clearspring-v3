import { checkImage, checkText } from '../../utils/security';

Page({
  methods: {
    // 自动修复：添加缺失的 bindtap 函数
    submitRecord(e) {
      // [CLEANED] console.log('submitRecord called', e);
    },
    // 自动修复：添加缺失的 bindtap 函数
    uploadImages(e) {
      // [CLEANED] console.log('uploadImages called', e);
    },
      // 自动修复：添加缺失的 bindtap 函数
    toggleAgree(e) {
      console.log('toggleAgree called', e);
    },

    // 自动修复：添加缺失的 bindtap 函数
    deleteImage(e) {
      console.log('deleteImage called', e);
    },

    // 自动修复：添加缺失的 bindtap 函数
    previewImage(e) {
      console.log('previewImage called', e);
    },

  },

  data: {
    agree: false, // 合规承诺勾选
    form: {
      date: '2026-04-04',
      waterArea: '',
      species: '',
      quantity: 0,
      images: [],
      wish: ''
    },
    speciesList: [
      { id: 1, name: '鲢鱼' },
      { id: 2, name: '鳙鱼' },
      { id: 3, name: '草鱼' },
      { id: 4, name: '青鱼' }
    ],
    waterAreas: ['珠江广州段', '东江东莞段', '北江清远段', '西江肇庆段']
  },

  onLoad() {
    // 设置默认日期为当天
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    this.setData({
      'form.date': dateStr
    });
  },

  // 合规承诺勾选
  toggleAgree() {
    this.setData({
      agree: !this.data.agree
    });
  },

  // 日期选择
  onDateChange(e) {
    this.setData({
      'form.date': e.detail.value
    });
  },

  // 水域选择
  onWaterAreaChange(e) {
    this.setData({
      'form.waterArea': e.detail.value
    });
  },

  // 物种选择
  onSpeciesChange(e) {
    this.setData({
      'form.species': e.detail.value
    });
  },

  // 数量输入
  onQuantityInput(e) {
    const value = parseInt(e.detail.value) || 0;
    this.setData({
      'form.quantity': value
    });
  },

  // 心愿输入
  onWishInput(e) {
    const value = e.detail.value;
    if (value.length <= 200) {
      this.setData({
        'form.wish': value
      });
    }
  },

  // 上传图片
  async uploadImages() {
    const maxCount = 6;
    const currentCount = this.data.form.images.length;
    const remainCount = maxCount - currentCount;

    if (remainCount <= 0) {
      wx.showToast({
        title: '最多上传 6 张照片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remainCount,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: async (res) => {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath);
        
        // 内容安全审核
        for (const image of tempFiles) {
          const pass = await checkImage(image);
          if (!pass) {
            return;
          }
        }

        this.setData({
          'form.images': [...this.data.form.images, ...tempFiles]
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.form.images;
    images.splice(index, 1);
    this.setData({
      'form.images': images
    });
  },

  // 预览图片
  previewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: this.data.form.images[index],
      urls: this.data.form.images
    });
  },

  // 提交护生记录
  async submitRecord() {
    // 校验合规承诺
    if (!this.data.agree) {
      wx.showToast({
        title: '请先勾选合规承诺',
        icon: 'none'
      });
      return;
    }

    // 校验表单必填项
    if (!this.data.form.species || !this.data.form.quantity || !this.data.form.waterArea) {
      wx.showToast({
        title: '请填写必填项',
        icon: 'none'
      });
      return;
    }

    if (this.data.form.quantity <= 0) {
      wx.showToast({
        title: '投放数量必须大于 0',
        icon: 'none'
      });
      return;
    }

    if (this.data.form.images.length === 0) {
      wx.showToast({
        title: '请上传现场照片',
        icon: 'none'
      });
      return;
    }

    // 图片内容安全审核（如果还有未审核的）
    for (const image of this.data.form.images) {
      const pass = await checkImage(image);
      if (!pass) return;
    }

    // 文本内容安全审核
    if (this.data.form.wish) {
      const pass = await checkText(this.data.form.wish);
      if (!pass) return;
    }

    // 显示加载提示
    wx.showLoading({
      title: '提交中...',
      mask: true
    });

    // 模拟提交到后端
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '提交成功',
        icon: 'success'
      });
      
      // 跳转到详情页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }, 1000);
  }
});
