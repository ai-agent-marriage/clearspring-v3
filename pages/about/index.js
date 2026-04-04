// pages/about/index.js

Page({
  data: {
    // 版本信息
    version: '1.2.0',
    versionCode: '20260404',
    buildDate: '2026-04-04',
    
    // 更新日志
    updateLogs: [
      {
        version: '1.2.0',
        date: '2026-04-04',
        changes: [
          '新增帮助中心，常见问题随时查阅',
          '优化关于我们页面展示',
          '修复已知问题，提升稳定性'
        ]
      },
      {
        version: '1.1.0',
        date: '2026-03-28',
        changes: [
          '新增护生记录提交功能',
          '优化用户体验',
          '修复部分机型兼容性问题'
        ]
      },
      {
        version: '1.0.0',
        date: '2026-03-20',
        changes: [
          '清如 ClearSpring 正式上线',
          '提供科学放生服务',
          '支持护生记录管理'
        ]
      }
    ],
    
    // 团队成员
    teamMembers: [
      {
        name: '李明',
        role: '创始人 & CEO',
        avatar: '/images/team/ceo.png',
        desc: '10 年互联网产品经验，致力于用科技推动善行'
      },
      {
        name: '王芳',
        role: '技术负责人',
        avatar: '/images/team/cto.png',
        desc: '前大厂技术专家，全栈工程师'
      },
      {
        name: '张伟',
        role: '运营总监',
        avatar: '/images/team/coo.png',
        desc: '资深环保人士，护生活动组织者'
      },
      {
        name: '刘洋',
        role: '产品设计师',
        avatar: '/images/team/designer.png',
        desc: '追求极致用户体验，禅意设计倡导者'
      }
    ],
    
    // 联系方式
    contactInfo: {
      wechat: 'qingru_service',
      email: 'service@clearspring.org',
      phone: '400-888-8888',
      address: '北京市海淀区中关村科技园',
      workTime: '9:00-18:00（周一至周日）'
    },
    
    // 公司信息
    companyInfo: {
      name: '北京清如科技有限公司',
      license: '京 ICP 备 20260001 号',
      registered: '注册资本 1000 万元',
      founded: '成立于 2025 年'
    },
    
    // 当前展开的更新日志
    expandedLogIndex: null
  },

  onLoad() {
    console.log('关于我们页面加载完成');
  },

  // 展开/收起更新日志
  onLogTap(e) {
    const index = e.currentTarget.dataset.index;
    const currentExpanded = this.data.expandedLogIndex;
    
    this.setData({
      expandedLogIndex: currentExpanded === index ? null : index
    });
  },

  // 查看用户协议
  onUserAgreementTap() {
    wx.navigateTo({
      url: '/pages/about/agreement'
    });
  },

  // 查看隐私政策
  onPrivacyPolicyTap() {
    wx.navigateTo({
      url: '/pages/about/privacy'
    });
  },

  // 联系客服
  onContactTap() {
    wx.showModal({
      title: '联系我们',
      content: `微信：${this.data.contactInfo.wechat}\n邮箱：${this.data.contactInfo.email}\n电话：${this.data.contactInfo.phone}\n\n点击确定复制微信号`,
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: this.data.contactInfo.wechat,
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

  // 查看营业执照
  onLicenseTap() {
    wx.previewImage({
      urls: ['/images/license.jpg'],
      current: '/images/license.jpg'
    });
  },

  // 分享小程序
  onShareAppMessage() {
    return {
      title: '清如 ClearSpring - 科学放生平台',
      path: '/pages/about/index',
      imageUrl: ''
    };
  },

  // 检查更新
  onCheckUpdate() {
    const updateManager = wx.getUpdateManager();
    
    wx.showLoading({
      title: '检查更新中...'
    });

    updateManager.onCheckForUpdate((res) => {
      wx.hideLoading();
      
      if (res.hasUpdate) {
        wx.showModal({
          title: '发现新版本',
          content: '检测到新版本，是否立即更新？',
          success: (res) => {
            if (res.confirm) {
              updateManager.onUpdateReady(() => {
                wx.showModal({
                  title: '更新提示',
                  content: '新版本已经准备好，是否重启应用？',
                  success: (res) => {
                    if (res.confirm) {
                      updateManager.applyUpdate();
                    }
                  }
                });
              });
            }
          }
        });
      } else {
        wx.showToast({
          title: '已是最新版本',
          icon: 'none'
        });
      }
    });
  }
});
