// pages/admin/feedback/submit.js
Page({
  data: {
    form: {
      type: '',
      title: '',
      content: '',
      images: [],
      contact: ''
    },
    feedbackTypes: [
      { value: 'suggestion', label: '功能建议' },
      { value: 'bug', label: 'Bug 反馈' },
      { value: 'other', label: '其他' }
    ],
    showTypeSelector: false,
    selectedTypeIndex: -1,
    isSubmitting: false,
    showSuccessModal: false
  },

  onLoad() {
    // 初始化页面
  },

  // 选择反馈类型
  onSelectType() {
    this.setData({
      showTypeSelector: true
    });
  },

  // 确认选择类型
  onConfirmType(e) {
    const { index } = e.currentTarget.dataset;
    const type = this.data.feedbackTypes[index];
    
    this.setData({
      'form.type': type.value,
      selectedTypeIndex: index,
      showTypeSelector: false
    });
  },

  // 取消选择类型
  onCancelType() {
    this.setData({
      showTypeSelector: false
    });
  },

  // 标题输入
  onTitleInput(e) {
    this.setData({
      'form.title': e.detail.value
    });
  },

  // 内容输入
  onContentInput(e) {
    const value = e.detail.value;
    if (value.length <= 500) {
      this.setData({
        'form.content': value
      });
    }
  },

  // 联系方式输入
  onContactInput(e) {
    this.setData({
      'form.contact': e.detail.value
    });
  },

  // 上传图片
  onUploadImage() {
    const currentCount = this.data.form.images.length;
    const maxCount = 6;
    const remaining = maxCount - currentCount;

    if (remaining <= 0) {
      wx.showToast({
        title: '最多上传 6 张图片',
        icon: 'none'
      });
      return;
    }

    wx.chooseMedia({
      count: remaining,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath);
        const newImages = [...this.data.form.images, ...tempFiles];
        
        this.setData({
          'form.images': newImages
        });
      },
      fail: (err) => {
        if (err.errMsg !== 'chooseMedia:fail cancel') {
          wx.showToast({
            title: '选择失败',
            icon: 'none'
          });
        }
      }
    });
  },

  // 预览图片
  onPreviewImage(e) {
    const { index } = e.currentTarget.dataset;
    wx.previewImage({
      current: this.data.form.images[index],
      urls: this.data.form.images
    });
  },

  // 删除图片
  onDeleteImage(e) {
    const { index } = e.currentTarget.dataset;
    const images = [...this.data.form.images];
    images.splice(index, 1);
    
    this.setData({
      'form.images': images
    });
  },

  // 提交表单
  onSubmit() {
    const { form } = this.data;
    
    // 表单验证
    if (!form.type) {
      wx.showToast({
        title: '请选择反馈类型',
        icon: 'none'
      });
      return;
    }

    if (!form.title || form.title.trim() === '') {
      wx.showToast({
        title: '请填写反馈标题',
        icon: 'none'
      });
      return;
    }

    if (!form.content || form.content.trim() === '') {
      wx.showToast({
        title: '请填写反馈内容',
        icon: 'none'
      });
      return;
    }

    if (form.content.length > 500) {
      wx.showToast({
        title: '内容不能超过 500 字',
        icon: 'none'
      });
      return;
    }

    // 提交数据
    this.submitFeedback();
  },

  // 提交反馈到服务器
  submitFeedback() {
    this.setData({
      isSubmitting: true
    });

    // TODO: 替换为实际 API 调用
    // api.submitFeedback(this.data.form).then(res => { ... })

    // 模拟提交
    setTimeout(() => {
      this.setData({
        isSubmitting: false,
        showSuccessModal: true
      });
    }, 1000);
  },

  // 关闭成功弹窗
  onCloseSuccessModal() {
    this.setData({
      showSuccessModal: false
    });
    
    // 返回上一页
    wx.navigateBack();
  },

  // 重置表单
  onReset() {
    wx.showModal({
      title: '提示',
      content: '确定要清空表单吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            form: {
              type: '',
              title: '',
              content: '',
              images: [],
              contact: ''
            },
            selectedTypeIndex: -1
          });
        }
      }
    });
  }
});
