// 清如 ClearSpring - 执行者资质审核页逻辑

Page({
  data: {
    // 表单数据
    realName: '',
    idCard: '',
    phone: '',
    idCardFront: '',
    idCardBack: '',
    handheld: '',
    skillIndex: -1,
    skillOptions: ['心理咨询', '法律援助', '职业规划', '情感疏导', '健康指导', '其他'],
    certificates: [],
    agreementAccepted: false,
    
    // 状态
    submitting: false,
    canSubmit: false
  },

  onLoad(options) {
    // 页面加载
    // [CLEANED] console.log('资质审核页加载');
  },

  onShow() {
    // 页面显示
    this.validateForm();
  },

  // ========== 输入事件 ==========
  onRealNameInput(e) {
    this.setData({
      realName: e.detail.value.trim()
    });
    this.validateForm();
  },

  onIdCardInput(e) {
    let value = e.detail.value.toUpperCase().trim();
    // 身份证号格式验证
    if (value.length === 18) {
      const regex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dX]$/;
      if (!regex.test(value)) {
        wx.showToast({
          title: '身份证号格式不正确',
          icon: 'none'
        });
      }
    }
    this.setData({ idCard: value });
    this.validateForm();
  },

  onPhoneInput(e) {
    let value = e.detail.value.trim();
    // 手机号格式验证
    if (value.length === 11) {
      const regex = /^1[3-9]\d{9}$/;
      if (!regex.test(value)) {
        wx.showToast({
          title: '手机号格式不正确',
          icon: 'none'
        });
      }
    }
    this.setData({ phone: value });
    this.validateForm();
  },

  onSkillChange(e) {
    this.setData({
      skillIndex: parseInt(e.detail.value)
    });
  },

  onAgreementToggle() {
    this.setData({
      agreementAccepted: !this.data.agreementAccepted
    });
    this.validateForm();
  },

  onViewAgreement() {
    wx.navigateTo({
      url: '/pages/agreement/agreement'
    });
  },

  // ========== 上传事件 ==========
  onUploadIdCardFront() {
    this.chooseAndUploadImage('idCardFront');
  },

  onUploadIdCardBack() {
    this.chooseAndUploadImage('idCardBack');
  },

  onUploadHandheld() {
    this.chooseAndUploadImage('handheld');
  },

  onUploadCertificates() {
    this.chooseAndUploadImage('certificates', 9);
  },

  chooseAndUploadImage(field, count = 1) {
    wx.chooseMedia({
      count: count,
      mediaType: ['image'],
      sourceType: ['camera'], // 仅允许相机拍摄，禁止相册
      sizeType: ['compressed'],
      camera: 'back',
      success: (res) => {
        const tempFiles = res.tempFiles.map(file => file.tempFilePath);
        
        if (count === 1) {
          // 单图上传
          this.uploadImage(tempFiles[0], field);
        } else {
          // 多图上传
          const newCerts = [...this.data.certificates, ...tempFiles];
          this.setData({ certificates: newCerts });
        }
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

  uploadImage(filePath, field) {
    wx.showLoading({ title: '上传中...' });
    
    // TODO: 实际项目中替换为云存储上传
    // wx.cloud.uploadFile(...)
    
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ [field]: filePath });
      wx.showToast({
        title: '上传成功',
        icon: 'success'
      });
      this.validateForm();
    }, 1000);
  },

  // ========== 表单验证 ==========
  validateForm() {
    const { realName, idCard, phone, idCardFront, idCardBack, handheld, agreementAccepted } = this.data;
    
    const isValid = 
      realName.length >= 2 &&
      idCard.length === 18 &&
      phone.length === 11 &&
      idCardFront &&
      idCardBack &&
      handheld &&
      agreementAccepted;
    
    this.setData({ canSubmit: isValid });
  },

  // ========== 提交 ==========
  onSubmit() {
    if (!this.data.canSubmit || this.data.submitting) return;

    this.setData({ submitting: true });

    const formData = {
      realName: this.data.realName,
      idCard: this.data.idCard,
      phone: this.data.phone,
      idCardFront: this.data.idCardFront,
      idCardBack: this.data.idCardBack,
      handheld: this.data.handheld,
      skill: this.data.skillOptions[this.data.skillIndex] || '',
      certificates: this.data.certificates,
      submitTime: new Date().getTime()
    };

    // [CLEANED] console.log('提交资质审核:', formData);

    // TODO: 实际项目中调用云函数提交
    // wx.cloud.callFunction({
    //   name: 'submitQualification',
    //   data: formData
    // })

    // 模拟提交
    setTimeout(() => {
      this.setData({ submitting: false });
      
      wx.showToast({
        title: '提交成功',
        icon: 'success',
        duration: 2000
      });

      // 跳转到审核状态页
      setTimeout(() => {
        wx.navigateTo({
          url: '/pages/executor-status/executor-status'
        });
      }, 1500);
    }, 2000);
  }
});
