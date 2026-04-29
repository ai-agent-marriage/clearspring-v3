// pages/profile/certs.js - 证书管理页面优化

Page({
  data: {
    // 分类筛选
    categories: ['全部', '护生证书', '修行证书'],
    activeCategory: 0,
    
    // 证书列表（瀑布流数据）
    certs: [
      {
        id: 1,
        type: 1,
        typeName: '护生证书',
        title: '鲢鱼护生证书',
        orderNo: 'PRO202604070001',
        issueDate: '2026-04-15',
        imageUrl: '/images/cert1.jpg',
        thumbUrl: '/images/cert1_thumb.jpg',
        quantity: 10,
        species: '鲢鱼',
        location: '珠江广州段',
        merit: 1000,
        qrCode: '/images/qr1.png'
      },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
      {
        id: 2,
        type: 2,
        typeName: '修行证书',
        title: '每日功课证书',
        orderNo: 'DAILY20260407001',
        issueDate: '2026-04-14',
        imageUrl: '/images/cert2.jpg',
        thumbUrl: '/images/cert2_thumb.jpg',
        days: 7,
        merit: 500,
        qrCode: '/images/qr2.png'
      },
      {
        id: 3,
        type: 1,
        typeName: '护生证书',
        title: '草鱼护生证书',
        orderNo: 'PRO202604070002',
        issueDate: '2026-04-12',
        imageUrl: '/images/cert3.jpg',
        thumbUrl: '/images/cert3_thumb.jpg',
        quantity: 5,
        species: '草鱼',
        location: '珠江广州段',
        merit: 500,
        qrCode: '/images/qr3.png'
      },
      {
        id: 4,
        type: 2,
        typeName: '修行证书',
        title: '精进修行证书',
        orderNo: 'PRACTICE202604001',
        issueDate: '2026-04-10',
        imageUrl: '/images/cert4.jpg',
        thumbUrl: '/images/cert4_thumb.jpg',
        days: 30,
        merit: 3000,
        qrCode: '/images/qr4.png'
      },
      {
        id: 5,
        type: 1,
        typeName: '护生证书',
        title: '青鱼护生证书',
        orderNo: 'PRO202604070003',
        issueDate: '2026-04-08',
        imageUrl: '/images/cert5.jpg',
        thumbUrl: '/images/cert5_thumb.jpg',
        quantity: 20,
        species: '青鱼',
        location: '珠江广州段',
        merit: 2000,
        qrCode: '/images/qr5.png'
      },
      {
        id: 6,
        type: 2,
        typeName: '修行证书',
        title: '闻法修行证书',
        orderNo: 'LISTEN202604001',
        issueDate: '2026-04-05',
        imageUrl: '/images/cert6.jpg',
        thumbUrl: '/images/cert6_thumb.jpg',
        count: 36,
        merit: 1800,
        qrCode: '/images/qr6.png'
      }
    ],
    
    // 瀑布流列数据
    leftColumn: [],
    rightColumn: [],
    
    // 证书详情
    showDetail: false,
    currentCert: null,
    
    // 批量操作
    selectMode: false,
    selectedIds: [],
    
    // 排序方式
    sortOptions: ['最新', '最早', '功德值'],
    activeSort: 0
  },

  onLoad(options) {
    // [CLEANED] console.log('证书管理页加载完成', options);
    
    // 如果从订单详情页跳转过来，传入 orderNo
    if (options.orderNo) {
      this.filterByOrderNo(options.orderNo);
    }
    
    this.loadCerts();
  },

  onShow() {
    // 每次显示时刷新数据
    this.loadCerts();
  },

  // 加载证书列表
  loadCerts() {
    // TODO: 从云数据库加载证书
    // 当前使用 mock 数据
    this.initWaterfall();
  },

  // 初始化瀑布流布局
  initWaterfall() {
    const filteredCerts = this.filterCertsByCategory(this.data.activeCategory);
    const leftColumn = [];
    const rightColumn = [];
    
    // 简单瀑布流：交替分配到左右列
    filteredCerts.forEach((cert, index) => {
      // 性能优化：建议收集数据后批量 setData，而不是在循环中每次调用
      if (index % 2 === 0) {
        leftColumn.push(cert);
      } else {
        rightColumn.push(cert);
      }
    });
    
    this.setData({
      leftColumn,
      rightColumn
    });
  },

  // 根据分类筛选证书
  filterCertsByCategory(categoryIndex) {
    if (categoryIndex === 0) {
      // 全部
      return this.data.certs;
    } else if (categoryIndex === 1) {
      // 护生证书
      return this.data.certs.filter(cert => cert.type === 1);
    } else if (categoryIndex === 2) {
      // 修行证书
      return this.data.certs.filter(cert => cert.type === 2);
    }
    return this.data.certs;
  },

  // 切换分类
  switchCategory(e) {
    const index = e.currentTarget.dataset.index;
    if (index === this.data.activeCategory) return;
    
    this.setData({
      activeCategory: index
    });
    
    this.initWaterfall();
  },

  // 切换排序方式
  switchSort(e) {
    const index = e.currentTarget.dataset.index;
    if (index === this.data.activeSort) return;
    
    this.setData({
      activeSort: index
    });
    
    // 根据排序方式重新排序
    this.sortCerts(index);
  },

  // 排序证书
  sortCerts(sortIndex) {
    let sortedCerts = [...this.data.certs];
    
    if (sortIndex === 0) {
      // 最新
      sortedCerts.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
    } else if (sortIndex === 1) {
      // 最早
      sortedCerts.sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
    } else if (sortIndex === 2) {
      // 功德值
      sortedCerts.sort((a, b) => b.merit - a.merit);
    }
    
    this.setData({
      certs: sortedCerts
    });
    
    this.initWaterfall();
  },

  // 根据订单号筛选
  filterByOrderNo(orderNo) {
    const cert = this.data.certs.find(c => c.orderNo === orderNo);
    if (cert) {
      this.setData({
        activeCategory: cert.type === 1 ? 1 : 2
      });
      this.initWaterfall();
    }
  },

  // 查看证书详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    const cert = this.data.certs.find(c => c.id === id);
    
    if (cert) {
      this.setData({
        currentCert: cert,
        showDetail: true
      });
    }
  },

  // 关闭证书详情
  closeDetail() {
    this.setData({
      showDetail: false,
      currentCert: null
    });
  },

  // 预览证书高清图
  previewCertImage() {
    if (this.data.currentCert) {
      wx.previewImage({
        current: this.data.currentCert.imageUrl,
        urls: [this.data.currentCert.imageUrl]
      });
    }
  },

  // 查看二维码
  viewQRCode() {
    if (this.data.currentCert && this.data.currentCert.qrCode) {
      wx.previewImage({
        current: this.data.currentCert.qrCode,
        urls: [this.data.currentCert.qrCode]
      });
    }
  },

  // 分享证书
  shareCert() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 导出证书
  exportCert() {
    if (this.data.currentCert) {
      wx.showToast({
        title: '正在生成...',
        icon: 'loading'
      });
      
      // TODO: 调用导出接口
      setTimeout(() => {
        wx.showToast({
          title: '导出成功',
          icon: 'success'
        });
      }, 1500);
    }
  },

  // 切换批量选择模式
  toggleSelectMode() {
    this.setData({
      selectMode: !this.data.selectMode,
      selectedIds: []
    });
  },

  // 选择/取消选择证书
  toggleSelect(e) {
    const id = e.currentTarget.dataset.id;
    const selectedIds = [...this.data.selectedIds];
    
    const index = selectedIds.indexOf(id);
    if (index > -1) {
      selectedIds.splice(index, 1);
    } else {
      selectedIds.push(id);
    }
    
    this.setData({
      selectedIds
    });
  },

  // 批量导出
  batchExport() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({
        title: '请选择证书',
        icon: 'none'
      });
      return;
    }
    
    wx.showModal({
      title: '批量导出',
      content: `确定导出选中的 ${this.data.selectedIds.length} 个证书？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '正在导出...',
            icon: 'loading'
          });
          
          // TODO: 调用批量导出接口
          setTimeout(() => {
            wx.showToast({
              title: '导出成功',
              icon: 'success'
            });
            this.setData({
              selectMode: false,
              selectedIds: []
            });
          }, 2000);
        }
      }
    });
  },

  // 批量分享
  batchShare() {
    if (this.data.selectedIds.length === 0) {
      wx.showToast({
        title: '请选择证书',
        icon: 'none'
      });
      return;
    }
    
    this.shareCert();
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadCerts();
    wx.stopPullDownRefresh();
  },

  // 上拉加载更多
  onReachBottom() {
    // TODO: 加载更多证书
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '我的证书 - 清如 ClearSpring',
      path: '/pages/profile/certs'
    };
  }
});
