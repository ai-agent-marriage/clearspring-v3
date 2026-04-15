// pages/help/detail.js

Page({
  methods: {
    // 自动修复：添加缺失的 bindtap 函数
    onContactService(e) {
      // [CLEANED] console.log('onContactService called', e);
    },
      // 自动修复：添加缺失的 bindtap 函数
    onCopyLinkTap(e) {
      console.log('onCopyLinkTap called', e);
    },

    // 自动修复：添加缺失的 bindtap 函数
    onCollectTap(e) {
      console.log('onCollectTap called', e);
    },

    // 自动修复：添加缺失的 bindtap 函数
    onRelatedFaqTap(e) {
      console.log('onRelatedFaqTap called', e);
    },

    // 自动修复：添加缺失的 bindtap 函数
    onFeedbackTap(e) {
      console.log('onFeedbackTap called', e);
    },

  },

  data: {
    faqId: null,
    question: '',
    answer: '',
    category: '',
    relatedFaqs: [],
    
    // 收藏状态
    isCollected: false
  },

  onLoad(options) {
    const faqId = parseInt(options.id);
    this.setData({ faqId });
    this.loadFaqDetail(faqId);
  },

  // 加载 FAQ 详情
  loadFaqDetail(id) {
    // Mock 数据
    const allFaqs = [
      {
        id: 1,
        question: '如何注册账号？',
        answer: '您可以通过微信授权登录快速注册，也可以在登录页面使用手机号进行注册。注册后需要完成实名认证才能使用完整的护生服务。\n\n注册步骤：\n1. 打开小程序，点击「登录/注册」\n2. 选择「微信一键登录」或「手机号注册」\n3. 填写基本信息并完成验证\n4. 进行实名认证（可选，但建议使用完整功能）\n\n实名认证需要提供：\n- 真实姓名\n- 身份证号码\n- 手机号码',
        category: '账户问题'
      },
      {
        id: 2,
        question: '如何提交护生记录？',
        answer: '完成护生活动后，在「我的护生」页面点击「提交记录」，填写护生时间、地点、物种、数量等信息，并上传现场照片作为凭证。\n\n提交步骤：\n1. 进入「我的」页面\n2. 点击「我的护生」\n3. 选择「提交记录」\n4. 填写护生信息\n5. 上传现场照片（至少 1 张）\n6. 提交审核\n\n注意事项：\n- 照片需清晰显示放生物种和环境\n- 信息填写需真实准确\n- 审核时间为 1-3 个工作日',
        category: '护生问题'
      }
    ];

    const faq = allFaqs.find(f => f.id === id) || allFaqs[0];
    
    this.setData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category
    });

    // 加载相关问题
    this.loadRelatedFaqs(faq.category, id);
  },

  // 加载相关问题
  loadRelatedFaqs(category, excludeId) {
    const relatedFaqs = [
      { id: 1, question: '如何修改个人信息？', category: '账户问题' },
      { id: 3, question: '忘记密码怎么办？', category: '账户问题' },
      { id: 5, question: '护生记录审核需要多久？', category: '护生问题' },
      { id: 6, question: '如何选择合适的放生物种？', category: '护生问题' }
    ].filter(f => f.category === category && f.id !== excludeId).slice(0, 3);

    this.setData({ relatedFaqs });
  },

  // 跳转到相关问题
  onRelatedFaqTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/help/detail?id=${id}`
    });
  },

  // 收藏/取消收藏
  onCollectTap() {
    const isCollected = !this.data.isCollected;
    this.setData({ isCollected });
    
    wx.showToast({
      title: isCollected ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.question,
      path: `/pages/help/detail?id=${this.data.faqId}`,
      imageUrl: ''
    };
  },

  // 复制链接
  onCopyLinkTap() {
    const url = `/pages/help/detail?id=${this.data.faqId}`;
    wx.setClipboardData({
      data: url,
      success: () => {
        wx.showToast({
          title: '链接已复制',
          icon: 'success'
        });
      }
    });
  },

  // 反馈问题
  onFeedbackTap() {
    wx.navigateTo({
      url: '/pages/feedback/feedback'
    });
  }
});
