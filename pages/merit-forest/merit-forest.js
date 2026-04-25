// pages/merit-forest/merit-forest.js

Page({
  data: {
    // 功德统计
    totalMerit: 12680,
    totalCount: 156,
    totalDays: 89,
    
    // 证书墙数据（瀑布流分两列）
    columns: [[], []],
    
    // 历史放生记录
    historyList: [
      {
        id: 1,
        day: '28',
        month: '2026.03',
        title: '春季鲤鱼放生',
        location: '钱塘江流域',
        count: 50
      },
      {
        id: 2,
        day: '15',
        month: '2026.03',
        title: '观音诞放生法会',
        location: '西湖水域',
        count: 108
      },
      {
        id: 3,
        day: '01',
        month: '2026.03',
        title: '二月二龙抬头放生',
        location: '富春江',
        count: 66
      },
      {
        id: 4,
        day: '14',
        month: '2026.02',
        title: '情人节慈悲放生',
        location: '京杭大运河',
        count: 33
      },
      {
        id: 5,
        day: '01',
        month: '2026.02',
        title: '春节祈福放生',
        location: '钱塘江流域',
        count: 88
      }
    ],
    
    // 证书预览
    showModal: false,
    currentCert: {}
  },

  onLoad() {
    this.initCertificates();
  },

  // 初始化证书墙（瀑布流布局）
  initCertificates() {
    const certificates = [
      { id: 1, number: '2026032801', userName: '张居士', date: '2026-03-28', count: 50, issueDate: '2026.03.28' },
      { id: 2, number: '2026031502', userName: '李居士', date: '2026-03-15', count: 108, issueDate: '2026.03.15' },
      { id: 3, number: '2026030103', userName: '王居士', date: '2026-03-01', count: 66, issueDate: '2026.03.01' },
      { id: 4, number: '2026021404', userName: '陈居士', date: '2026-02-14', count: 33, issueDate: '2026.02.14' },
      { id: 5, number: '2026020105', userName: '刘居士', date: '2026-02-01', count: 88, issueDate: '2026.02.01' },
      { id: 6, number: '2026012806', userName: '赵居士', date: '2026-01-28', count: 45, issueDate: '2026.01.28' },
      { id: 7, number: '2026011507', userName: '钱居士', date: '2026-01-15', count: 72, issueDate: '2026.01.15' },
      { id: 8, number: '2026010108', userName: '孙居士', date: '2026-01-01', count: 99, issueDate: '2026.01.01' }
    ];

    // 分配到两列
    const column0 = [];
    const column1 = [];
    
    certificates.forEach((cert, index) => {
      // 性能优化：建议收集数据后批量 setData，而不是在循环中每次调用
      if (index % 2 === 0) {
        column0.push(cert);
      } else {
        column1.push(cert);
      }
    });

    this.setData({
      columns: [column0, column1]
    });
  },

  // 点击证书
  onCertificateTap(e) {
    const cert = e.currentTarget.dataset.cert;
    this.setData({
      currentCert: cert,
      showModal: true
    });
  },

  // 点击历史记录
  onHistoryTap(e) {
    const item = e.currentTarget.dataset.item;
    wx.showToast({
      title: '查看详情',
      icon: 'none'
    });
  },

  // 隐藏弹窗
  hideModal() {
    this.setData({
      showModal: false
    });
  },

  // 阻止事件冒泡
  stopPropagation() {
    // 空函数，用于阻止事件冒泡
  },

  // 分享证书
  shareCertificate() {
    const cert = this.data.currentCert;
    
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

  // 分享给好友
  onShareAppMessage() {
    const cert = this.data.currentCert;
    return {
      title: `我的功德证书 - ${cert.userName}`,
      path: `/pages/merit-forest/merit-forest?certId=${cert.id}`,
      imageUrl: ''
    };
  }
});
