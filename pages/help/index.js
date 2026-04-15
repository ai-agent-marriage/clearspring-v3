// pages/help/index.js

Page({
  data: {
    // 常见问题分类
    categories: ['账户问题', '护生问题', '支付问题', '其他'],
    
    // 当前选中的分类
    currentCategory: '全部',
    
    // 搜索关键词
    searchKeyword: '',
    
    // FAQ 列表
    faqs: [
      {
        id: 1,
        question: '如何注册账号？',
        answer: '您可以通过微信授权登录快速注册，也可以在登录页面使用手机号进行注册。注册后需要完成实名认证才能使用完整的护生服务。',
        category: '账户问题',
        expanded: false
      },
      {
        id: 2,
        question: '如何修改个人信息？',
        answer: '进入「我的」页面，点击右上角的「编辑」按钮，即可修改您的昵称、头像等个人信息。实名认证信息暂不支持修改。',
        category: '账户问题',
        expanded: false
      },
      {
        id: 3,
        question: '忘记密码怎么办？',
        answer: '在登录页面点击「忘记密码」，通过手机验证码即可重置密码。如果手机号已更换，请联系客服处理。',
        category: '账户问题',
        expanded: false
      },
      {
        id: 4,
        question: '如何提交护生记录？',
        answer: '完成护生活动后，在「我的护生」页面点击「提交记录」，填写护生时间、地点、物种、数量等信息，并上传现场照片作为凭证。',
        category: '护生问题',
        expanded: false
      },
      {
        id: 5,
        question: '护生记录审核需要多久？',
        answer: '护生记录提交后，工作人员会在 1-3 个工作日内完成审核。审核通过后，相应的功德值将计入您的账户。',
        category: '护生问题',
        expanded: false
      },
      {
        id: 6,
        question: '如何选择合适的放生物种？',
        answer: '我们建议您选择本地物种，避免外来物种入侵。在「护生指南」页面可以查看适合不同季节和地区的物种推荐。',
        category: '护生问题',
        expanded: false
      },
      {
        id: 7,
        question: '如何申请护生证书？',
        answer: '累计完成 10 次有效护生记录后，您可以在「我的证书」页面申请电子护生证书。证书将包含您的护生统计信息和专属编号。',
        category: '护生问题',
        expanded: false
      },
      {
        id: 8,
        question: '支持哪些支付方式？',
        answer: '目前支持微信支付。支付成功后，您可以在「订单记录」中查看支付详情和电子发票。',
        category: '支付问题',
        expanded: false
      },
      {
        id: 9,
        question: '如何申请退款？',
        answer: '如护生活动因天气等原因取消，系统将自动发起退款。其他情况请联系客服，我们将在 3-5 个工作日内处理。',
        category: '支付问题',
        expanded: false
      },
      {
        id: 10,
        question: '支付失败怎么办？',
        answer: '请检查网络连接和微信支付设置，确认余额充足后重试。如多次失败，建议更换支付方式或联系客服。',
        category: '支付问题',
        expanded: false
      },
      {
        id: 11,
        question: '如何开具发票？',
        answer: '在「订单记录」页面找到对应订单，点击「申请开票」，填写发票抬头和税号后提交，电子发票将发送至您的邮箱。',
        category: '支付问题',
        expanded: false
      },
      {
        id: 12,
        question: '如何联系客服？',
        answer: '您可以在「我的」页面点击「联系客服」，或通过小程序首页的「客服」按钮与我们联系。服务时间：9:00-18:00。',
        category: '其他',
        expanded: false
      },
      {
        id: 13,
        question: '如何邀请好友加入？',
        answer: '在「我的」页面点击「邀请好友」，分享小程序给微信好友。好友通过您的链接注册后，双方都将获得功德值奖励。',
        category: '其他',
        expanded: false
      },
      {
        id: 14,
        question: '功德值有什么用？',
        answer: '功德值可用于兑换护生用品、参与专属活动、升级会员等级等。功德值永久有效，不会过期。',
        category: '其他',
        expanded: false
      },
      {
        id: 15,
        question: '小程序闪退怎么办？',
        answer: '请尝试以下方法：1.退出小程序重新进入 2.删除小程序后重新搜索添加 3.检查微信是否为最新版本 4.重启手机。如问题仍存在，请联系客服。',
        category: '其他',
        expanded: false
      }
    ],
    
    // 是否显示搜索框
    showSearch: false
  },

  onLoad() {
    // [CLEANED] console.log('帮助中心页面加载完成');
  },

  // 切换分类
  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category
    });
  },

  // 显示/隐藏搜索框
  onSearchToggle() {
    this.setData({
      showSearch: !this.data.showSearch
    });
    if (this.data.showSearch) {
      // 聚焦搜索框
      setTimeout(() => {
        this.setData({ searchFocus: true });
      }, 100);
    } else {
      this.setData({
        searchKeyword: '',
        searchFocus: false
      });
    }
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value.trim();
    this.setData({
      searchKeyword: keyword
    });
    this.filterFaqs();
  },

  // 搜索确认
  onSearchConfirm(e) {
    const keyword = e.detail.value.trim();
    this.setData({
      searchKeyword: keyword
    });
    this.filterFaqs();
  },

  // 筛选 FAQ
  filterFaqs() {
    const { currentCategory, searchKeyword, faqs } = this.data;
    
    let filtered = faqs.map(faq => ({ ...faq, expanded: false }));
    
    // 按分类筛选
    if (currentCategory !== '全部') {
      filtered = filtered.filter(faq => faq.category === currentCategory);
    }
    
    // 按关键词筛选
    if (searchKeyword) {
      filtered = filtered.filter(faq => 
        faq.question.includes(searchKeyword) || 
        faq.answer.includes(searchKeyword) ||
        faq.category.includes(searchKeyword)
      );
    }
    
    this.setData({ filteredFaqs: filtered });
  },

  // 展开/收起问题详情
  onFaqTap(e) {
    const index = e.currentTarget.dataset.index;
    const key = `filteredFaqs[${index}].expanded`;
    const isExpanded = this.data.filteredFaqs[index].expanded;
    
    this.setData({
      [key]: !isExpanded
    });
  },

  // 联系客服
  onContactService() {
    wx.showModal({
      title: '联系客服',
      content: '客服微信：qingru_service\n\n服务时间：9:00-18:00\n\n点击确定复制微信号',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: 'qingru_service',
            success: () => {
              wx.showToast({
                title: '已复制微信号',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '清如 ClearSpring - 科学放生平台',
      path: '/pages/help/index',
      imageUrl: ''
    };
  }
});
