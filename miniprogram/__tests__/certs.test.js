/**
 * 证书管理页单元测试
 * Day 19 优化新增测试文件
 * 测试证书分类筛选、瀑布流展示、证书详情、批量操作等功能
 */

// Mock wx 对象
const mockWx = {
  showToast: jest.fn(),
  navigateTo: jest.fn(),
  previewImage: jest.fn(),
  showShareMenu: jest.fn(),
  showModal: jest.fn()
};

global.wx = mockWx;

// 模拟证书管理页（优化版）
function createCertsPage() {
  return {
    route: 'pages/profile/certs',
    data: {
      categories: ['全部', '护生证书', '修行证书'],
      activeCategory: 0,
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
      leftColumn: [],
      rightColumn: [],
      showDetail: false,
      currentCert: null,
      selectMode: false,
      selectedIds: [],
      sortOptions: ['最新', '最早', '功德值'],
      activeSort: 0
    },
    setData: function(newData) {
      Object.assign(this.data, newData);
    },
    loadCerts: function() {
      this.initWaterfall();
    },
    initWaterfall: function() {
      const filteredCerts = this.filterCertsByCategory(this.data.activeCategory);
      const leftColumn = [];
      const rightColumn = [];
      
      filteredCerts.forEach((cert, index) => {
        if (index % 2 === 0) {
          leftColumn.push(cert);
        } else {
          rightColumn.push(cert);
        }
      });
      
      this.setData({ leftColumn, rightColumn });
    },
    filterCertsByCategory: function(categoryIndex) {
      if (categoryIndex === 0) {
        return this.data.certs;
      } else if (categoryIndex === 1) {
        return this.data.certs.filter(cert => cert.type === 1);
      } else if (categoryIndex === 2) {
        return this.data.certs.filter(cert => cert.type === 2);
      }
      return this.data.certs;
    },
    switchCategory: function(index) {
      this.data.activeCategory = index;
      this.initWaterfall();
    },
    switchSort: function(index) {
      this.data.activeSort = index;
      this.sortCerts(index);
    },
    sortCerts: function(sortIndex) {
      let sortedCerts = [...this.data.certs];
      
      if (sortIndex === 0) {
        sortedCerts.sort((a, b) => new Date(b.issueDate) - new Date(a.issueDate));
      } else if (sortIndex === 1) {
        sortedCerts.sort((a, b) => new Date(a.issueDate) - new Date(b.issueDate));
      } else if (sortIndex === 2) {
        sortedCerts.sort((a, b) => b.merit - a.merit);
      }
      
      this.setData({ certs: sortedCerts });
      this.initWaterfall();
    },
    viewDetail: function(e) {
      const id = e.id || e.currentTarget?.dataset?.id;
      const cert = this.data.certs.find(c => c.id === id);
      if (cert) {
        this.setData({
          currentCert: cert,
          showDetail: true
        });
      }
    },
    closeDetail: function() {
      this.setData({
        showDetail: false,
        currentCert: null
      });
    },
    previewCertImage: function() {
      if (this.data.currentCert) {
        wx.previewImage({
          current: this.data.currentCert.imageUrl,
          urls: [this.data.currentCert.imageUrl]
        });
      }
    },
    viewQRCode: function() {
      if (this.data.currentCert && this.data.currentCert.qrCode) {
        wx.previewImage({
          current: this.data.currentCert.qrCode,
          urls: [this.data.currentCert.qrCode]
        });
      }
    },
    shareCert: function() {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    },
    exportCert: function() {
      wx.showToast({
        title: '正在生成...',
        icon: 'loading'
      });
    },
    toggleSelectMode: function() {
      this.setData({
        selectMode: !this.data.selectMode,
        selectedIds: []
      });
    },
    toggleSelect: function(e) {
      const id = e.id || e.currentTarget?.dataset?.id;
      const selectedIds = [...this.data.selectedIds];
      const index = selectedIds.indexOf(id);
      
      if (index > -1) {
        selectedIds.splice(index, 1);
      } else {
        selectedIds.push(id);
      }
      
      this.setData({ selectedIds });
    },
    batchExport: function() {
      if (this.data.selectedIds.length === 0) {
        wx.showToast({
          title: '请选择证书',
          icon: 'none'
        });
        return;
      }
      wx.showToast({
        title: '正在导出...',
        icon: 'loading'
      });
    },
    batchShare: function() {
      if (this.data.selectedIds.length === 0) {
        wx.showToast({
          title: '请选择证书',
          icon: 'none'
        });
        return;
      }
      this.shareCert();
    }
  };
}

describe('证书管理页初始化测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('分类筛选 Tabs 初始化正确', () => {
    const page = createCertsPage();
    expect(page.data.categories).toEqual(['全部', '护生证书', '修行证书']);
    expect(page.data.activeCategory).toBe(0);
  });
  
  test('证书列表加载正常', () => {
    const page = createCertsPage();
    expect(page.data.certs).toBeInstanceOf(Array);
    expect(page.data.certs.length).toBeGreaterThan(0);
  });
  
  test('瀑布流左右列初始化', () => {
    const page = createCertsPage();
    page.loadCerts();
    expect(page.data.leftColumn).toBeInstanceOf(Array);
    expect(page.data.rightColumn).toBeInstanceOf(Array);
    expect(page.data.leftColumn.length + page.data.rightColumn.length).toBe(page.data.certs.length);
  });
  
  test('排序选项初始化正确', () => {
    const page = createCertsPage();
    expect(page.data.sortOptions).toEqual(['最新', '最早', '功德值']);
    expect(page.data.activeSort).toBe(0);
  });
});

describe('证书分类筛选测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('切换分类 - 全部', () => {
    const page = createCertsPage();
    page.switchCategory(0);
    expect(page.data.activeCategory).toBe(0);
    expect(page.data.leftColumn.length + page.data.rightColumn.length).toBe(6);
  });
  
  test('切换分类 - 护生证书', () => {
    const page = createCertsPage();
    page.switchCategory(1);
    expect(page.data.activeCategory).toBe(1);
    page.data.leftColumn.forEach(cert => {
      expect(cert.type).toBe(1);
    });
    page.data.rightColumn.forEach(cert => {
      expect(cert.type).toBe(1);
    });
  });
  
  test('切换分类 - 修行证书', () => {
    const page = createCertsPage();
    page.switchCategory(2);
    expect(page.data.activeCategory).toBe(2);
    page.data.leftColumn.forEach(cert => {
      expect(cert.type).toBe(2);
    });
    page.data.rightColumn.forEach(cert => {
      expect(cert.type).toBe(2);
    });
  });
  
  test('护生证书数量正确', () => {
    const page = createCertsPage();
    const protectCerts = page.data.certs.filter(c => c.type === 1);
    expect(protectCerts.length).toBe(3);
  });
  
  test('修行证书数量正确', () => {
    const page = createCertsPage();
    const practiceCerts = page.data.certs.filter(c => c.type === 2);
    expect(practiceCerts.length).toBe(3);
  });
});

describe('证书排序功能测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('排序 - 最新', () => {
    const page = createCertsPage();
    page.switchSort(0);
    expect(page.data.activeSort).toBe(0);
    const dates = page.data.certs.map(c => new Date(c.issueDate).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeGreaterThanOrEqual(dates[i]);
    }
  });
  
  test('排序 - 最早', () => {
    const page = createCertsPage();
    page.switchSort(1);
    expect(page.data.activeSort).toBe(1);
    const dates = page.data.certs.map(c => new Date(c.issueDate).getTime());
    for (let i = 1; i < dates.length; i++) {
      expect(dates[i - 1]).toBeLessThanOrEqual(dates[i]);
    }
  });
  
  test('排序 - 功德值', () => {
    const page = createCertsPage();
    page.switchSort(2);
    expect(page.data.activeSort).toBe(2);
    const merits = page.data.certs.map(c => c.merit);
    for (let i = 1; i < merits.length; i++) {
      expect(merits[i - 1]).toBeGreaterThanOrEqual(merits[i]);
    }
  });
});

describe('证书详情功能测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('查看证书详情', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 1 });
    expect(page.data.showDetail).toBe(true);
    expect(page.data.currentCert).toBeTruthy();
    expect(page.data.currentCert.id).toBe(1);
  });
  
  test('关闭证书详情', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 1 });
    page.closeDetail();
    expect(page.data.showDetail).toBe(false);
    expect(page.data.currentCert).toBeNull();
  });
  
  test('预览证书高清图', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 1 });
    page.previewCertImage();
    expect(wx.previewImage).toHaveBeenCalled();
  });
  
  test('查看二维码', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 1 });
    page.viewQRCode();
    expect(wx.previewImage).toHaveBeenCalled();
  });
  
  test('证书详情信息完整', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 1 });
    const cert = page.data.currentCert;
    expect(cert.title).toBeTruthy();
    expect(cert.typeName).toBeTruthy();
    expect(cert.issueDate).toBeTruthy();
    expect(cert.merit).toBeGreaterThan(0);
    expect(cert.qrCode).toBeTruthy();
  });
  
  test('护生证书特有字段', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 1 });
    const cert = page.data.currentCert;
    if (cert.type === 1) {
      expect(cert.species).toBeTruthy();
      expect(cert.quantity).toBeGreaterThan(0);
      expect(cert.location).toBeTruthy();
    }
  });
  
  test('修行证书特有字段', () => {
    const page = createCertsPage();
    page.viewDetail({ id: 2 });
    const cert = page.data.currentCert;
    if (cert.type === 2) {
      expect(cert.days || cert.count).toBeTruthy();
    }
  });
});

describe('证书分享导出测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('分享证书', () => {
    const page = createCertsPage();
    page.shareCert();
    expect(wx.showShareMenu).toHaveBeenCalled();
  });
  
  test('导出证书', () => {
    const page = createCertsPage();
    page.exportCert();
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '正在生成...',
      icon: 'loading'
    });
  });
});

describe('批量操作功能测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('切换批量选择模式', () => {
    const page = createCertsPage();
    expect(page.data.selectMode).toBe(false);
    page.toggleSelectMode();
    expect(page.data.selectMode).toBe(true);
    expect(page.data.selectedIds).toEqual([]);
  });
  
  test('取消批量选择模式', () => {
    const page = createCertsPage();
    page.setData({ selectMode: true });
    page.toggleSelectMode();
    expect(page.data.selectMode).toBe(false);
  });
  
  test('选择单个证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.toggleSelect({ id: 1 });
    expect(page.data.selectedIds).toContain(1);
    expect(page.data.selectedIds.length).toBe(1);
  });
  
  test('选择多个证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.toggleSelect({ id: 1 });
    page.toggleSelect({ id: 2 });
    page.toggleSelect({ id: 3 });
    expect(page.data.selectedIds.length).toBe(3);
    expect(page.data.selectedIds).toContain(1);
    expect(page.data.selectedIds).toContain(2);
    expect(page.data.selectedIds).toContain(3);
  });
  
  test('取消选择证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.toggleSelect({ id: 1 });
    page.toggleSelect({ id: 2 });
    page.toggleSelect({ id: 1 }); // 取消选择
    expect(page.data.selectedIds).not.toContain(1);
    expect(page.data.selectedIds).toContain(2);
    expect(page.data.selectedIds.length).toBe(1);
  });
  
  test('批量导出 - 未选择证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.batchExport();
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请选择证书',
      icon: 'none'
    });
  });
  
  test('批量导出 - 已选择证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.toggleSelect({ id: 1 });
    page.toggleSelect({ id: 2 });
    page.batchExport();
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '正在导出...',
      icon: 'loading'
    });
  });
  
  test('批量分享 - 未选择证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.batchShare();
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请选择证书',
      icon: 'none'
    });
  });
  
  test('批量分享 - 已选择证书', () => {
    const page = createCertsPage();
    page.toggleSelectMode();
    page.toggleSelect({ id: 1 });
    page.batchShare();
    expect(wx.showShareMenu).toHaveBeenCalled();
  });
});

describe('证书数据结构测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('证书 ID 唯一性', () => {
    const page = createCertsPage();
    const ids = page.data.certs.map(c => c.id);
    const uniqueIds = [...new Set(ids)];
    expect(ids.length).toBe(uniqueIds.length);
  });
  
  test('证书类型值正确', () => {
    const page = createCertsPage();
    page.data.certs.forEach(cert => {
      expect([1, 2]).toContain(cert.type);
    });
  });
  
  test('证书功德值为正数', () => {
    const page = createCertsPage();
    page.data.certs.forEach(cert => {
      expect(cert.merit).toBeGreaterThan(0);
    });
  });
  
  test('证书日期格式正确', () => {
    const page = createCertsPage();
    page.data.certs.forEach(cert => {
      expect(cert.issueDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });
  
  test('证书图片路径存在', () => {
    const page = createCertsPage();
    page.data.certs.forEach(cert => {
      expect(cert.imageUrl).toBeTruthy();
      expect(cert.thumbUrl).toBeTruthy();
    });
  });
  
  test('证书二维码路径存在', () => {
    const page = createCertsPage();
    page.data.certs.forEach(cert => {
      expect(cert.qrCode).toBeTruthy();
    });
  });
});

describe('瀑布流布局测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('瀑布流左右列数量平衡', () => {
    const page = createCertsPage();
    page.loadCerts();
    const leftCount = page.data.leftColumn.length;
    const rightCount = page.data.rightColumn.length;
    expect(Math.abs(leftCount - rightCount)).toBeLessThanOrEqual(1);
  });
  
  test('瀑布流证书 ID 不重复', () => {
    const page = createCertsPage();
    page.loadCerts();
    const allIds = [...page.data.leftColumn, ...page.data.rightColumn].map(c => c.id);
    const uniqueIds = [...new Set(allIds)];
    expect(allIds.length).toBe(uniqueIds.length);
  });
  
  test('切换分类后瀑布流重新计算', () => {
    const page = createCertsPage();
    page.switchCategory(1); // 护生证书
    const protectCount = page.data.leftColumn.length + page.data.rightColumn.length;
    expect(protectCount).toBe(3);
    
    page.switchCategory(2); // 修行证书
    const practiceCount = page.data.leftColumn.length + page.data.rightColumn.length;
    expect(practiceCount).toBe(3);
  });
});
