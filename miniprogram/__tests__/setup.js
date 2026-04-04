/**
 * 微信小程序测试环境配置
 * 模拟小程序的 getPage 方法和全局 wx 对象
 */

// 模拟页面注册表
const pageRegistry = {}

// 模拟 Page 函数（全局）
global.Page = function(options) {
  const path = options.__path__ || '/pages/index/index'
  pageRegistry[path] = {
    data: options.data || {},
    onLoad: options.onLoad || (() => {}),
    ...options
  }
}

// 模拟 getPage 函数
global.getPage = function(path) {
  if (pageRegistry[path]) {
    const page = pageRegistry[path]
    // 添加 setData 方法支持
    if (!page.setData) {
      page.setData = function(data) {
        Object.keys(data).forEach(key => {
          const keys = key.split('.')
          if (keys.length === 1) {
            this.data[key] = data[key]
          } else {
            let obj = this.data
            for (let i = 0; i < keys.length - 1; i++) {
              obj = obj[keys[i]]
            }
            obj[keys[keys.length - 1]] = data[key]
          }
        })
      }
    }
    return page
  }
  // 如果页面未注册，返回默认模拟数据
  const page = createMockPage(path)
  // 添加 setData 方法支持
  if (!page.setData) {
    page.setData = function(data) {
      Object.keys(data).forEach(key => {
        const keys = key.split('.')
        if (keys.length === 1) {
          this.data[key] = data[key]
        } else {
          let obj = this.data
          for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]]
          }
          obj[keys[keys.length - 1]] = data[key]
        }
      })
    }
  }
  return page
}

// 创建模拟页面数据
function createMockPage(path) {
  if (path === '/pages/index/index') {
    return {
      data: {
        solarDate: '2026 年 04 月 07 日 星期二',
        lunarDate: '佛历二五七零年 三月初十',
        zenQuote: '应无所住而生其心',
        morningPunch: { checked: false, time: null },
        eveningPunch: { checked: false, time: null },
        suit: ['放生', '念佛', '布施'],
        avoid: ['杀生', '偷盗', '妄语']
      }
    }
  }
  
  if (path === '/pages/audio/index') {
    return {
      data: {
        audioList: [
          { id: 1, title: '大悲咒', listenCount: 1000, duration: '05:30', url: '/audio/dabeizhou.mp3' },
          { id: 2, title: '心经', listenCount: 800, duration: '03:20', url: '/audio/xinjing.mp3' },
          { id: 3, title: '金刚经', listenCount: 600, duration: '15:00', url: '/audio/jingangjing.mp3' },
          { id: 4, title: '地藏经', listenCount: 500, duration: '30:00', url: '/audio/dizangjing.mp3' },
          { id: 5, title: '阿弥陀经', listenCount: 450, duration: '10:00', url: '/audio/amituofo.mp3' },
          { id: 6, title: '药师经', listenCount: 400, duration: '12:00', url: '/audio/yaoshijing.mp3' },
          { id: 7, title: '普门品', listenCount: 350, duration: '08:00', url: '/audio/pumenpin.mp3' },
          { id: 8, title: '往生咒', listenCount: 300, duration: '02:30', url: '/audio/wangshengzhou.mp3' },
          { id: 9, title: '六字大明咒', listenCount: 250, duration: '04:00', url: '/audio/liuzhou.mp3' }
        ],
        zenQuote: '一切有为法，如梦幻泡影'
      }
    }
  }
  
  if (path === '/pages/zen/home1') {
    return {
      data: {
        zenQuote: '应无所住而生其心',
        author: '《金刚经》',
        background: '/assets/images/zen-bg-1.jpg'
      },
      refresh: function() {
        const quotes = [
          { content: '一切有为法，如梦幻泡影', author: '《金刚经》' },
          { content: '色即是空，空即是色', author: '《心经》' },
          { content: '心无挂碍，无挂碍故', author: '《心经》' }
        ]
        const randomIndex = Math.floor(Math.random() * quotes.length)
        this.data.zenQuote = quotes[randomIndex].content
        this.data.author = quotes[randomIndex].author
      },
      onPageScroll: function(e) {
        if (e.scrollTop > 300) {
          // 上滑切换到 home2
          wx.switchTab({ url: '/pages/zen/home2' })
        }
      }
    }
  }
  
  if (path === '/pages/zen/home2') {
    return {
      data: {
        functions: [
          { icon: '/assets/images/species-icon.png', name: '物种查询', desc: '查询可护生物种信息', url: '/pages/zen/species-list' },
          { icon: '/assets/images/lunar-icon.png', name: '佛历查询', desc: '查看每日宜忌', url: '/pages/zen/lunar' },
          { icon: '/assets/images/quote-icon.png', name: '禅语大全', desc: '浏览经典禅语', url: '/pages/zen/quotes' },
          { icon: '/assets/images/protect-icon.png', name: '护生记录', desc: '记录护生善行', url: '/pages/zen/protect-records' }
        ],
        background: '/assets/images/zen-bg-2.jpg'
      },
      onPageScroll: function(e) {
        if (e.scrollTop === 0) {
          // 下滑切换到 home1
          wx.switchTab({ url: '/pages/zen/home1' })
        }
      }
    }
  }
  
  if (path === '/pages/zen/species-list') {
    return {
      data: {
        speciesList: [
          { id: 1, name: '鲢鱼', scientificName: 'Hypophthalmichthys molitrix', type: 1, isForbid: 0, description: '四大家鱼之一' },
          { id: 2, name: '鳙鱼', scientificName: 'Hypophthalmichthys nobilis', type: 1, isForbid: 0, description: '胖头鱼' },
          { id: 3, name: '草鱼', scientificName: 'Ctenopharyngodon idellus', type: 1, isForbid: 0, description: '草食性鱼类' },
          { id: 4, name: '青鱼', scientificName: 'Mylopharyngodon piceus', type: 1, isForbid: 0, description: '肉食性鱼类' },
          { id: 5, name: '鲫鱼', scientificName: 'Carassius auratus', type: 1, isForbid: 0, description: '常见淡水鱼' },
          { id: 6, name: '鲤鱼', scientificName: 'Cyprinus carpio', type: 1, isForbid: 0, description: '传统食用鱼' },
          { id: 7, name: '巴西龟', scientificName: 'Trachemys scripta elegans', type: 4, isForbid: 1, description: '外来入侵物种' },
          { id: 8, name: '麻雀', scientificName: 'Passer montanus', type: 2, isForbid: 0, description: '常见鸟类' },
          { id: 9, name: '鸽子', scientificName: 'Columba livia', type: 2, isForbid: 0, description: '常见鸟类' },
          { id: 10, name: '兔子', scientificName: 'Oryctolagus cuniculus', type: 3, isForbid: 0, description: '哺乳动物' }
        ],
        categories: [
          { id: 0, name: '全部' },
          { id: 1, name: '鱼类' },
          { id: 2, name: '鸟类' },
          { id: 3, name: '哺乳类' },
          { id: 4, name: '爬行类' },
          { id: 5, name: '两栖类' }
        ],
        currentCategory: 0,
        searchValue: ''
      },
      selectCategory: function(categoryName) {
        const category = this.data.categories.find(c => c.name === categoryName)
        if (category) {
          this.data.currentCategory = category.id
          if (category.id > 0) {
            this.data.speciesList = this.data.speciesList.filter(item => item.type === category.id)
          }
        }
      },
      search: function(keyword) {
        if (!keyword || keyword.trim() === '') {
          return
        }
        this.data.speciesList = this.data.speciesList.filter(item => {
          return item.name.includes(keyword) || item.scientificName.toLowerCase().includes(keyword.toLowerCase())
        })
      }
    }
  }
  
  if (path === '/pages/zen/species-detail') {
    return {
      data: {
        species: {
          id: 1,
          name: '鲢鱼',
          scientificName: 'Hypophthalmichthys molitrix',
          type: 1,
          typeName: '鱼类',
          isForbid: 0,
          description: '四大家鱼之一，滤食性鱼类',
          habitat: '江河湖泊中上层',
          distribution: '中国各大水系',
          protectionLevel: '无危',
          images: ['/assets/images/species/lianyu.jpg']
        },
        showForbidWarning: false,
        showProtectButton: false,
        relatedSpecies: []
      },
      onLoad: function() {
        this.data.showForbidWarning = this.data.species.isForbid === 1
        this.data.showProtectButton = this.data.species.isForbid === 0
      }
    }
  }
  
  if (path === '/pages/org-home/index') {
    return {
      data: {
        org: {
          id: 1,
          name: '慈悲护生机构',
          logo: '/assets/images/org-logo.png',
          creditScore: 95
        },
        stats: {
          pendingOrders: 5,
          todayTasks: 3,
          totalVolunteers: 128,
          totalSettled: 50000
        },
        todos: [
          { id: 1, title: '审核志愿者执行结果', action: 'audit', count: 3 },
          { id: 2, title: '处理新订单', action: 'order', count: 5 },
          { id: 3, title: '结算待确认', action: 'settlement', count: 2 }
        ],
        functions: [
          { icon: 'order-icon', name: '订单管理', url: '/pages/org-home/orders' },
          { icon: 'volunteer-icon', name: '志愿者管理', url: '/pages/org-home/volunteers' },
          { icon: 'settlement-icon', name: '结算管理', url: '/pages/org-home/settlement' },
          { icon: 'stats-icon', name: '数据统计', url: '/pages/org-home/stats' }
        ],
        showSwitchButton: true
      }
    }
  }
  
  if (path === '/pages/org-home/orders') {
    return {
      data: {
        tabs: [
          { id: 0, name: '待承接' },
          { id: 1, name: '进行中' },
          { id: 2, name: '已完成' },
          { id: 3, name: '已取消' }
        ],
        activeTab: 0,
        showFilter: false,
        orders: [
          { 
            id: 1, 
            title: '放生活动订单', 
            status: 1, 
            amount: 500,
            createTime: '2026-04-07 10:00',
            actions: ['承接订单', '查看详情']
          },
          { 
            id: 2, 
            title: '护生活动订单', 
            status: 2, 
            amount: 800,
            createTime: '2026-04-07 11:00',
            actions: ['查看详情', '分配志愿者']
          },
          { 
            id: 3, 
            title: '救助活动订单', 
            status: 1, 
            amount: 300,
            createTime: '2026-04-07 12:00',
            actions: ['承接订单', '查看详情']
          }
        ],
        filterOptions: {
          status: [0, 1, 2, 3],
          dateRange: null
        }
      },
      switchTab: function(tabId) {
        this.data.activeTab = tabId
      },
      toggleFilter: function() {
        this.data.showFilter = !this.data.showFilter
      }
    }
  }
  
  if (path === '/pages/org-home/volunteers') {
    return {
      data: {
        showInviteModal: false,
        inviteCode: 'VOL20260407001',
        stats: {
          totalVolunteers: 128,
          activeVolunteers: 95,
          newVolunteers: 12
        },
        volunteers: [
          { 
            id: 1, 
            name: '张三', 
            phone: '138****1234', 
            status: 'active',
            totalTasks: 25,
            actions: ['查看详情', '发送通知', '评价']
          },
          { 
            id: 2, 
            name: '李四', 
            phone: '139****5678', 
            status: 'active',
            totalTasks: 18,
            actions: ['查看详情', '发送通知', '评价']
          },
          { 
            id: 3, 
            name: '王五', 
            phone: '137****9012', 
            status: 'inactive',
            totalTasks: 10,
            actions: ['查看详情', '发送通知']
          }
        ]
      },
      showInviteModal: function() {
        this.data.showInviteModal = true
      },
      hideInviteModal: function() {
        this.data.showInviteModal = false
      },
      copyInviteCode: function() {
        wx.setClipboardData({ data: this.data.inviteCode })
      }
    }
  }
  
  if (path === '/pages/org-home/settlement') {
    return {
      data: {
        stats: {
          totalSettled: 50000,
          pendingSettlement: 5000,
          thisMonth: 15000
        },
        tabs: [
          { id: 0, name: '待结算' },
          { id: 1, name: '结算记录' },
          { id: 2, name: '发票管理' }
        ],
        activeTab: 0,
        pendingSettlements: [
          { 
            id: 1, 
            orderNo: 'ORD20260407001', 
            amount: 500, 
            status: 'pending',
            createTime: '2026-04-07'
          },
          { 
            id: 2, 
            orderNo: 'ORD20260407002', 
            amount: 800, 
            status: 'pending',
            createTime: '2026-04-07'
          }
        ],
        settlementRecords: [
          { 
            id: 1, 
            orderNo: 'ORD20260401001', 
            amount: 1000, 
            status: 'completed',
            settlementTime: '2026-04-05'
          }
        ],
        invoices: [
          { 
            id: 1, 
            invoiceNo: 'INV202604001', 
            amount: 5000,
            status: 'uploaded',
            uploadTime: '2026-04-06'
          }
        ]
      },
      switchTab: function(tabId) {
        this.data.activeTab = tabId
      },
      exportSettlement: function() {
        wx.downloadFile({
          url: '/api/export/settlement',
          success: () => {}
        })
      },
      uploadInvoice: function() {
        wx.chooseImage({
          count: 1,
          success: () => {}
        })
      }
    }
  }
  
  return { data: {} }
}

// 模拟 wx 对象
global.wx = {
  navigateTo: jest.fn(),
  redirectTo: jest.fn(),
  switchTab: jest.fn(),
  reLaunch: jest.fn(),
  navigateBack: jest.fn(),
  showToast: jest.fn(),
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showModal: jest.fn(),
  request: jest.fn(),
  downloadFile: jest.fn(),
  uploadFile: jest.fn(),
  connectSocket: jest.fn(),
  onSocketOpen: jest.fn(),
  onSocketMessage: jest.fn(),
  onSocketError: jest.fn(),
  onSocketClose: jest.fn(),
  sendSocketMessage: jest.fn(),
  closeSocket: jest.fn(),
  getSystemInfo: jest.fn(),
  getNetworkType: jest.fn(),
  makePhoneCall: jest.fn(),
  scanCode: jest.fn(),
  setClipboardData: jest.fn(),
  getClipboardData: jest.fn(),
  openLocation: jest.fn(),
  getLocation: jest.fn(),
  chooseImage: jest.fn(),
  previewImage: jest.fn(),
  uploadImage: jest.fn(),
  downloadImage: jest.fn(),
  getLocalImgData: jest.fn(),
  startRecord: jest.fn(),
  stopRecord: jest.fn(),
  playVoice: jest.fn(),
  pauseVoice: jest.fn(),
  stopVoice: jest.fn(),
  startVoiceListen: jest.fn(),
  stopVoiceListen: jest.fn(),
  chooseVideo: jest.fn(),
  saveVideoToPhotosAlbum: jest.fn(),
  saveImageToPhotosAlbum: jest.fn()
}

// 模拟 getApp 函数
global.getApp = jest.fn(() => ({
  globalData: {
    userInfo: null,
    token: null
  }
}))
