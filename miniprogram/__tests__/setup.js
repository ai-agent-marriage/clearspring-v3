/**
 * 微信小程序测试环境配置
 * 模拟小程序的 getPage 方法和全局 wx 对象
 */

// 模拟页面注册表
const pageRegistry = {}

// 模拟 getCurrentPages 函数
global.getCurrentPages = function() {
  // 返回当前页面栈，默认返回第一个页面
  const firstPagePath = Object.keys(pageRegistry)[0] || '/pages/index/index'
  const page = global.getPage(firstPagePath)
  return [page]
}

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
  let page = null
  
  if (path === '/pages/index/index') {
    page = {
      data: {
        solarDate: '2026 年 04 月 07 日 星期二',
        lunarDate: '佛历二五七零年 三月初十',
        zenQuote: '应无所住而生其心',
        morningPunch: { checked: false, time: null },
        eveningPunch: { checked: false, time: null },
        suit: ['放生', '念佛', '布施'],
        avoid: ['杀生', '偷盗', '妄语'],
        isLoggedIn: false,
        userInfo: null,
        showErrorPage: false,
        errorMessage: '',
        isLoading: true
      },
      onLoad: function(options) {
        // 模拟加载登录状态
        const stored = wx.getStorageSync('userInfo')
        if (stored) {
          this.setData({
            isLoggedIn: true,
            userInfo: stored,
            isLoading: false
          })
        } else {
          this.setData({ isLoading: false })
        }
      },
      requestWithRetry: async function(url, config = {}) {
        const maxRetries = config.retry || 3
        let lastError = null
        
        for (let i = 0; i < maxRetries; i++) {
          try {
            const result = await wx.request({ url, ...config })
            return result
          } catch (error) {
            lastError = error
            if (i < maxRetries - 1) {
              await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
            }
          }
        }
        
        throw lastError
      }
    }
  }
  
  if (path === '/pages/audio/index') {
    page = {
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
  
  if (path === '/pages/admin/content/species') {
    return {
      data: {
        speciesList: [
          { 
            id: 1, 
            name: '鲢鱼', 
            scientificName: 'Hypophthalmichthys molitrix', 
            type: 1, 
            typeName: '鱼类',
            isForbid: 0,
            statusName: '允许投放',
            actions: ['编辑', '删除']
          },
          { 
            id: 2, 
            name: '鳙鱼', 
            scientificName: 'Hypophthalmichthys nobilis', 
            type: 1, 
            typeName: '鱼类',
            isForbid: 0,
            statusName: '允许投放',
            actions: ['编辑', '删除']
          },
          { 
            id: 3, 
            name: '草鱼', 
            scientificName: 'Ctenopharyngodon idellus', 
            type: 1, 
            typeName: '鱼类',
            isForbid: 0,
            statusName: '允许投放',
            actions: ['编辑', '删除']
          },
          { 
            id: 4, 
            name: '巴西龟', 
            scientificName: 'Trachemys scripta elegans', 
            type: 4, 
            typeName: '爬行类',
            isForbid: 1,
            statusName: '禁止投放',
            actions: ['编辑', '删除']
          },
          { 
            id: 5, 
            name: '鲫鱼', 
            scientificName: 'Carassius auratus', 
            type: 1, 
            typeName: '鱼类',
            isForbid: 0,
            statusName: '允许投放',
            actions: ['编辑', '删除']
          }
        ],
        filterType: 0,
        searchValue: '',
        currentPage: 1,
        pageSize: 20,
        total: 5,
        showAddModal: false,
        showEditModal: false,
        showDeleteConfirm: false,
        showBatchDeleteConfirm: false,
        selectedIds: [],
        newSpecies: {
          name: '',
          scientificName: '',
          type: 1,
          isForbid: 0,
          description: '',
          habitat: '',
          distribution: ''
        },
        editingSpecies: null,
        deletingSpecies: null
      },
      search: function(keyword) {
        if (!keyword || keyword.trim() === '') {
          return
        }
        this.data.speciesList = this.data.speciesList.filter(item => {
          return item.name.includes(keyword) || item.scientificName.toLowerCase().includes(keyword.toLowerCase())
        })
      },
      filter: function() {
        if (this.data.filterType === 0) {
          return
        }
        this.data.speciesList = this.data.speciesList.filter(item => item.type === this.data.filterType)
      },
      showAddModal: function() {
        this.data.showAddModal = true
      },
      editSpecies: function(species) {
        this.data.editingSpecies = species
        this.data.showEditModal = true
      },
      deleteSpecies: function(species) {
        this.data.deletingSpecies = species
        this.data.showDeleteConfirm = true
      },
      batchDelete: function() {
        this.data.showBatchDeleteConfirm = true
      },
      exportSpecies: function() {
        wx.downloadFile({
          url: 'http://localhost:8080/api/content/species/export',
          success: () => {}
        })
      }
    }
  }
  
  if (path === '/pages/admin/content/notice') {
    return {
      data: {
        notices: [
          { 
            id: 1, 
            title: '关于规范护生活动的通知', 
            content: '请各位志愿者严格按照规定流程进行护生活动...',
            status: 1,
            statusName: '已发布',
            createTime: '2026-04-01 10:00',
            publishTime: '2026-04-01 12:00',
            actions: ['编辑', '删除', '查看']
          },
          { 
            id: 2, 
            title: '春季护生活动安排', 
            content: '春季是护生的黄金时期，请各机构做好准备工作...',
            status: 1,
            statusName: '已发布',
            createTime: '2026-04-02 09:00',
            publishTime: '2026-04-02 10:00',
            actions: ['编辑', '删除', '查看']
          },
          { 
            id: 3, 
            title: '志愿者培训通知', 
            content: '定于 4 月 15 日举行志愿者培训活动...',
            status: 0,
            statusName: '草稿',
            createTime: '2026-04-03 14:00',
            publishTime: null,
            actions: ['编辑', '删除', '发布']
          },
          { 
            id: 4, 
            title: '护生物种更新公告', 
            content: '系统已更新可护生物种列表，请查阅...',
            status: 1,
            statusName: '已发布',
            createTime: '2026-04-04 08:00',
            publishTime: '2026-04-04 09:00',
            actions: ['编辑', '删除', '查看']
          }
        ],
        currentPage: 1,
        pageSize: 20,
        total: 4,
        showAddModal: false,
        showEditModal: false,
        showDeleteConfirm: false,
        newNotice: {
          title: '',
          content: '',
          status: 0
        },
        editingNotice: null,
        deletingNotice: null
      },
      showAddModal: function() {
        this.data.showAddModal = true
      },
      editNotice: function(notice) {
        this.data.editingNotice = notice
        this.data.showEditModal = true
      },
      deleteNotice: function(notice) {
        this.data.deletingNotice = notice
        this.data.showDeleteConfirm = true
      },
      publishNotice: function(notice) {
        notice.status = 1
        notice.statusName = '已发布'
        notice.publishTime = new Date().toLocaleString()
      }
    }
  }
  
  if (path === '/pages/admin/content/help') {
    return {
      data: {
        helpDocs: [
          { 
            id: 1, 
            title: '如何注册志愿者', 
            category: '志愿者指南',
            content: '第一步：打开小程序，点击「我的」...',
            order: 1,
            viewCount: 1200
          },
          { 
            id: 2, 
            title: '如何发起护生活动', 
            category: '活动指南',
            content: '第一步：进入「活动」页面...',
            order: 2,
            viewCount: 980
          },
          { 
            id: 3, 
            title: '物种投放注意事项', 
            category: '护生指南',
            content: '投放前请确认物种适合当地环境...',
            order: 3,
            viewCount: 850
          },
          { 
            id: 4, 
            title: '常见问题解答', 
            category: '常见问题',
            content: 'Q: 如何联系人工客服？A: 请点击「我的」-「联系客服」...',
            order: 4,
            viewCount: 750
          },
          { 
            id: 5, 
            title: '机构入驻流程', 
            category: '机构指南',
            content: '第一步：准备机构资质材料...',
            order: 5,
            viewCount: 520
          }
        ],
        categories: ['全部', '志愿者指南', '活动指南', '护生指南', '常见问题', '机构指南'],
        currentCategory: '全部',
        searchValue: '',
        showAddModal: false,
        showEditModal: false,
        newDoc: {
          title: '',
          category: '',
          content: '',
          order: 0
        },
        editingDoc: null
      },
      selectCategory: function(category) {
        this.data.currentCategory = category
      },
      search: function(keyword) {
        if (!keyword || keyword.trim() === '') {
          return
        }
        this.data.helpDocs = this.data.helpDocs.filter(item => {
          return item.title.includes(keyword) || item.content.includes(keyword)
        })
      },
      showAddModal: function() {
        this.data.showAddModal = true
      },
      editDoc: function(doc) {
        this.data.editingDoc = doc
        this.data.showEditModal = true
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
  
  // 消息推送首页
  if (path === '/pages/admin/message/index') {
    return {
      data: {
        stats: {
          totalMessages: 1256,
          todayMessages: 89,
          subscriberCount: 456
        },
        menus: [
          {
            icon: '📩',
            name: '订阅消息配置',
            path: '/pages/admin/message/subscribe'
          },
          {
            icon: '📄',
            name: '消息模板管理',
            path: '/pages/admin/message/template'
          },
          {
            icon: '📝',
            name: '消息发送记录',
            path: '/pages/admin/message/records'
          },
          {
            icon: '👥',
            name: '订阅用户管理',
            path: '/pages/admin/message/subscribers'
          }
        ]
      },
      onLoad: function() {
        this.loadStats()
      },
      loadStats: function() {
        // 加载统计数据
      },
      goToMenu: function(e) {
        const path = e.currentTarget.dataset.path
        wx.navigateTo({ url: path })
      },
      sendTestMessage: function() {
        wx.showModal({
          title: '发送测试消息',
          content: '将向测试用户发送一条测试消息，是否继续？'
        })
      },
      viewRecords: function() {
        wx.navigateTo({ url: '/pages/admin/message/records' })
      }
    }
  }
  
  // 订阅消息配置页
  if (path === '/pages/admin/message/subscribe') {
    return {
      data: {
        templates: [
          {
            id: 1,
            name: '订单创建通知',
            templateId: 'ORDER_CREATE',
            trigger: '订单创建时',
            content: '您的订单已创建成功',
            enabled: 1,
            createTime: '2026-04-01 10:00:00'
          },
          {
            id: 2,
            name: '订单完成通知',
            templateId: 'ORDER_COMPLETE',
            trigger: '订单完成时',
            content: '您的订单已完成',
            enabled: 1,
            createTime: '2026-04-01 10:05:00'
          },
          {
            id: 3,
            name: '活动提醒',
            templateId: 'ACTIVITY_REMIND',
            trigger: '活动开始前',
            content: '您报名的活动即将开始',
            enabled: 0,
            createTime: '2026-04-02 09:00:00'
          }
        ],
        showEditModal: false,
        editingTemplate: null
      },
      onLoad: function() {
        this.loadTemplates()
      },
      loadTemplates: function() {
        // 加载模板列表
      },
      toggleTemplate: function(id) {
        const template = this.data.templates.find(t => t.id === id)
        if (template) {
          template.enabled = template.enabled === 1 ? 0 : 1
        }
      },
      editTemplate: function(id) {
        const template = this.data.templates.find(t => t.id === id)
        this.data.editingTemplate = template
        this.data.showEditModal = true
      },
      saveTemplate: function() {
        wx.showToast({ title: '保存成功', icon: 'success' })
      }
    }
  }
  
  // 消息记录页面
  if (path === '/pages/admin/message/records') {
    return {
      data: {
        filterDateRanges: [
          { label: '最近 7 天', value: '7d' },
          { label: '最近 30 天', value: '30d' },
          { label: '最近 90 天', value: '90d' },
          { label: '自定义', value: 'custom' }
        ],
        records: [
          {
            id: 1,
            openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M',
            templateId: 'ORDER_CREATE',
            templateName: '订单创建通知',
            status: 'success',
            sendTime: '2026-04-07 10:30:00',
            content: '{"orderNo":"PRO202604100001"}'
          },
          {
            id: 2,
            openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2N',
            templateId: 'ORDER_COMPLETE',
            templateName: '订单完成通知',
            status: 'success',
            sendTime: '2026-04-07 11:00:00',
            content: '{"orderNo":"PRO202604100002"}'
          },
          {
            id: 3,
            openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2O',
            templateId: 'ACTIVITY_REMIND',
            templateName: '活动提醒',
            status: 'failed',
            sendTime: '2026-04-07 11:30:00',
            content: '{"activityId":"ACT001"}'
          }
        ],
        currentFilter: '7d',
        startDate: '',
        endDate: ''
      },
      onLoad: function() {
        this.loadRecords()
      },
      loadRecords: function() {
        // 加载消息记录
      },
      filterRecords: function() {
        // 筛选记录
      },
      exportRecords: function() {
        wx.downloadFile({
          url: '/api/message/records/export',
          success: () => {}
        })
      }
    }
  }
  
  // 反馈首页
  if (path === '/pages/admin/feedback/index') {
    return {
      data: {
        stats: {
          totalFeedback: 256,
          pendingFeedback: 12,
          processedFeedback: 244
        },
        menus: [
          { icon: '📝', name: '反馈提交', path: '/pages/admin/feedback/submit' },
          { icon: '📋', name: '反馈管理', path: '/pages/admin/feedback/manage' },
          { icon: '📊', name: '反馈统计', path: '/pages/admin/feedback/stats' },
          { icon: '⚙️', name: '反馈设置', path: '/pages/admin/feedback/settings' }
        ]
      },
      onLoad: function() {
        this.loadFeedbackStats()
      },
      loadFeedbackStats: function() {
        // 加载统计数据
      },
      onMenuTap: function(e) {
        const path = e.currentTarget.dataset.path
        wx.navigateTo({ url: path })
      },
      onSubmitFeedback: function() {
        wx.navigateTo({ url: '/pages/admin/feedback/submit' })
      },
      onViewPending: function() {
        wx.navigateTo({ url: '/pages/admin/feedback/manage?status=pending' })
      }
    }
  }
  
  // 反馈提交页面
  if (path === '/pages/admin/feedback/submit') {
    return {
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
      onSelectType: function() {
        this.setData({ showTypeSelector: true })
      },
      onConfirmType: function(e) {
        const index = e.currentTarget.dataset.index
        const type = this.data.feedbackTypes[index]
        this.setData({
          'form.type': type.value,
          selectedTypeIndex: index,
          showTypeSelector: false
        })
      },
      onCancelType: function() {
        this.setData({ showTypeSelector: false })
      },
      onTitleInput: function(e) {
        this.setData({ 'form.title': e.detail.value })
      },
      onContentInput: function(e) {
        const value = e.detail.value
        if (value.length <= 500) {
          this.setData({ 'form.content': value })
        }
      },
      onContactInput: function(e) {
        this.setData({ 'form.contact': e.detail.value })
      },
      onUploadImage: function() {
        const currentCount = this.data.form.images.length
        const maxCount = 6
        const remaining = maxCount - currentCount

        if (remaining <= 0) {
          wx.showToast({
            title: '最多上传 6 张图片',
            icon: 'none'
          })
          return
        }
        
        wx.chooseMedia({
          count: remaining,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          sizeType: ['compressed'],
          success: (res) => {
            const tempFiles = res.tempFiles.map(file => file.tempFilePath)
            const newImages = [...this.data.form.images, ...tempFiles]
            this.setData({ 'form.images': newImages })
          }
        })
      },
      onPreviewImage: function(e) {
        const index = e.currentTarget.dataset.index
        wx.previewImage({
          current: this.data.form.images[index],
          urls: this.data.form.images
        })
      },
      onDeleteImage: function(e) {
        const index = e.currentTarget.dataset.index
        const images = [...this.data.form.images]
        images.splice(index, 1)
        this.setData({ 'form.images': images })
      },
      onSubmit: function() {
        const { form } = this.data
        if (!form.type) {
          wx.showToast({ title: '请选择反馈类型', icon: 'none' })
          return
        }
        if (!form.title || form.title.trim() === '') {
          wx.showToast({ title: '请填写反馈标题', icon: 'none' })
          return
        }
        if (!form.content || form.content.trim() === '') {
          wx.showToast({ title: '请填写反馈内容', icon: 'none' })
          return
        }
        this.submitFeedback()
      },
      submitFeedback: function() {
        this.setData({ isSubmitting: true })
        setTimeout(() => {
          this.setData({
            isSubmitting: false,
            showSuccessModal: true
          })
        }, 1000)
      },
      onCloseSuccessModal: function() {
        this.setData({ showSuccessModal: false })
        wx.navigateBack()
      },
      onReset: function() {
        wx.showModal({
          title: '提示',
          content: '确定要清空表单吗？'
        })
      }
    }
  }
  
  // 消息推送首页
  if (path === '/pages/admin/message/index') {
    return {
      data: {
        stats: {
          totalMessages: 1256,
          todayMessages: 89,
          subscriberCount: 456,
          failedMessages: 12
        },
        menus: [
          { icon: 'subscribe', name: '订阅配置', path: '/pages/admin/message/subscribe', color: '#4A5D4E' },
          { icon: 'template', name: '模板管理', path: '/pages/admin/message/template', color: '#5B7C6A' },
          { icon: 'records', name: '发送记录', path: '/pages/admin/message/records', color: '#6B8C7A' },
          { icon: 'subscribers', name: '订阅用户', path: '/pages/admin/message/subscribers', color: '#7B9C8A' }
        ],
        unreadCount: 5,
        loading: false,
        lastUpdateTime: '2026-04-04 19:00:00'
      },
      onLoad: function() {
        this.loadStats()
        this.loadUnreadCount()
      },
      loadStats: function() {
        this.setData({ loading: true })
        setTimeout(() => this.setData({ loading: false }), 500)
      },
      loadUnreadCount: function() {},
      startAutoRefresh: function() {},
      onPullDownRefresh: function() {},
      goToMenu: function(e) {
        const path = e.currentTarget.dataset.path
        wx.navigateTo({ url: path })
      },
      refreshData: function() {
        this.loadStats()
        wx.vibrateShort()
      }
    }
  }
  
  // 订阅消息配置页
  if (path === '/pages/admin/message/subscribe') {
    return {
      data: {
        templates: [
          { id: 1, name: '订单创建通知', templateId: 'ORDER_CREATE', trigger: '订单创建时', enabled: 1 },
          { id: 2, name: '订单完成通知', templateId: 'ORDER_COMPLETE', trigger: '订单完成时', enabled: 1 },
          { id: 3, name: '活动提醒', templateId: 'ACTIVITY_REMIND', trigger: '活动开始前', enabled: 0 }
        ],
        loading: false,
        showEditModal: false,
        editingTemplate: null
      },
      onLoad: function() { this.loadTemplates() },
      loadTemplates: function() {},
      toggleTemplate: function(id) {},
      editTemplate: function(id) {},
      saveTemplate: function() { wx.showToast({ title: '保存成功' }) },
      onPullDownRefresh: function() { this.loadTemplates(); wx.stopPullDownRefresh() }
    }
  }
  
  // 消息记录页面
  if (path === '/pages/admin/message/records') {
    return {
      data: {
        filterDateRanges: [
          { label: '最近 7 天', value: '7d' },
          { label: '最近 30 天', value: '30d' },
          { label: '最近 90 天', value: '90d' },
          { label: '自定义', value: 'custom' }
        ],
        records: [
          { id: 1, openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M', templateName: '订单创建通知', status: 'success', sendTime: '2026-04-07 10:30:00' },
          { id: 2, openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2N', templateName: '订单完成通知', status: 'success', sendTime: '2026-04-07 11:00:00' },
          { id: 3, openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2O', templateName: '活动提醒', status: 'failed', sendTime: '2026-04-07 11:30:00' }
        ],
        currentFilter: '7d',
        loading: false,
        page: 1,
        hasMore: true
      },
      onLoad: function() { this.loadRecords() },
      loadRecords: function() {},
      filterRecords: function() {},
      exportRecords: function() {},
      onPullDownRefresh: function() { this.loadRecords(); wx.stopPullDownRefresh() }
    }
  }
  
  // 反馈管理页面
  if (path === '/pages/admin/feedback/manage') {
    return {
      data: {
        showFilter: false,
        filterType: 'all',
        filterStatus: 'all',
        feedbackList: [
          {
            id: 1,
            type: 'suggestion',
            typeName: '功能建议',
            title: '希望增加数据统计功能',
            submitTime: '2026-04-07 10:00:00',
            status: 1,
            statusName: '待处理'
          },
          {
            id: 2,
            type: 'bug',
            typeName: 'Bug 反馈',
            title: '订单页面加载失败',
            submitTime: '2026-04-07 09:30:00',
            status: 1,
            statusName: '待处理'
          },
          {
            id: 3,
            type: 'suggestion',
            typeName: '功能建议',
            title: '建议优化搜索功能',
            submitTime: '2026-04-06 16:20:00',
            status: 2,
            statusName: '已处理'
          },
          {
            id: 4,
            type: 'other',
            typeName: '其他',
            title: '其他问题反馈',
            submitTime: '2026-04-06 14:15:00',
            status: 2,
            statusName: '已处理'
          },
          {
            id: 5,
            type: 'bug',
            typeName: 'Bug 反馈',
            title: '支付页面闪退问题',
            submitTime: '2026-04-06 11:00:00',
            status: 1,
            statusName: '待处理'
          }
        ],
        filterTypes: [
          { value: 'all', label: '全部类型' },
          { value: 'suggestion', label: '功能建议' },
          { value: 'bug', label: 'Bug 反馈' },
          { value: 'other', label: '其他' }
        ],
        filterStatuses: [
          { value: 'all', label: '全部状态' },
          { value: '1', label: '待处理' },
          { value: '2', label: '已处理' }
        ],
        isLoading: false,
        hasMore: true,
        page: 1,
        pageSize: 10
      },
      onLoad: function(options) {
        if (options.status === 'pending') {
          this.setData({ filterStatus: '1' })
        }
        this.loadFeedbackList()
      },
      loadFeedbackList: function() {
        // 加载列表
      },
      onToggleFilter: function() {
        this.setData({ showFilter: !this.data.showFilter })
      },
      onTypeChange: function(e) {
        this.setData({
          filterType: e.detail.value,
          page: 1,
          feedbackList: []
        })
        this.loadFeedbackList()
      },
      onStatusChange: function(e) {
        this.setData({
          filterStatus: e.detail.value,
          page: 1,
          feedbackList: []
        })
        this.loadFeedbackList()
      },
      onViewDetail: function(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({ url: `/pages/admin/feedback/detail?id=${id}` })
      },
      onProcess: function(e) {
        const id = e.currentTarget.dataset.id
        wx.showModal({
          title: '处理反馈',
          content: '确认标记为已处理？'
        })
      },
      onReply: function(e) {
        const id = e.currentTarget.dataset.id
        wx.navigateTo({ url: `/pages/admin/feedback/reply?id=${id}` })
      },
      onExport: function() {
        wx.showModal({
          title: '导出数据',
          content: '将导出当前筛选条件下的所有反馈数据为 Excel 文件，是否继续？'
        })
      },
      onResetFilter: function() {
        this.setData({
          filterType: 'all',
          filterStatus: 'all',
          page: 1,
          feedbackList: []
        })
        this.loadFeedbackList()
      },
      onPullDownRefresh: function() {
        this.setData({ page: 1, feedbackList: [] })
        this.loadFeedbackList()
        wx.stopPullDownRefresh()
      }
    }
  }
  
  // 为所有页面添加通用 Mock 方法
  const mockPage = page || { data: {} }
  
  // 性能优化相关方法
  mockPage.onLoad = function(options) {}
  mockPage.batchRequests = function(...args) {}
  mockPage.debounceSearch = function(...args) {}
  mockPage.batchSetData = function(data) { this.setData(data) }
  mockPage.partialUpdate = function(path, value) { this.setData({ [path]: value }) }
  mockPage.lazyLoadImages = function() { this.setData({ loadingImages: true }) }
  mockPage.preloadImages = function(urls) { wx.preloadImage && wx.preloadImage() }
  mockPage.loadImage = function(url) { return { fromCache: this.data.imageCache && this.data.imageCache[url] !== undefined } }
  mockPage.compressAndUpload = function(file) { wx.compressImage && wx.compressImage() }
  mockPage.enableVirtualList = function() { this.setData({ virtualListEnabled: true, renderedList: [] }) }
  mockPage.loadMore = function() { this.setData({ currentPage: (this.data.currentPage || 1) + 1 }) }
  mockPage.loadList = function() { this.setData({ useCache: !!this.data.cachedList }) }
  mockPage.calculateCacheHitRate = function() {
    const stats = this.data.cacheStats || { hits: 0, misses: 0, total: 0 }
    return stats.total > 0 ? (stats.hits / stats.total) * 100 : 0
  }
  mockPage.preloadCache = function(keys) { this.setData({ cachePreloaded: true }) }
  mockPage.cleanupCache = function() {
    if (this.data.cache) {
      Object.keys(this.data.cache).forEach(key => {
        if (this.data.cache[key] && this.data.cache[key].expired) {
          delete this.data.cache[key]
        }
      })
    }
  }
  mockPage.queueRequest = jest.fn((req) => {
    const queue = this.data.requestQueue || []
    if (queue.length < 5) queue.push(req)
    this.setData({ requestQueue: queue })
  })
  
  // 导入验证相关方法
  mockPage.validateImportFile = function(filename) {
    const ext = filename.split('.').pop().toLowerCase()
    return ['xlsx', 'xls', 'csv'].includes(ext) ? { valid: true } : { valid: false }
  }
  mockPage.validateImportFileSize = function(size) { return size <= 10 * 1024 * 1024 }
  
  // 帮助文档统计相关方法
  mockPage.recordReadDuration = function(docId, duration) {
    const durations = this.data.readDurations || {}
    durations[docId] = duration
    this.setData({ readDurations: durations })
  }
  mockPage.recordReadProgress = function(docId, progress) {
    const progressMap = this.data.readProgress || {}
    progressMap[docId] = progress
    this.setData({ readProgress: progressMap })
  }
  
  // 反馈管理相关方法
  mockPage.collectFeedback = function(docId, content, rating) {
    const feedbacks = this.data.feedbackList || []
    feedbacks.push({ docId, content, rating })
    this.setData({ feedbackList: feedbacks })
  }
  mockPage.calculateAvgRating = function() {
    const feedbacks = this.data.feedbackList || []
    if (feedbacks.length === 0) return 0
    const sum = feedbacks.reduce((acc, f) => acc + (f.rating || 0), 0)
    return sum / feedbacks.length
  }
  mockPage.replyFeedback = function(id, reply) {
    const replied = this.data.repliedFeedbacks || []
    replied.push(id)
    this.setData({ repliedFeedbacks: replied })
  }
  mockPage.markFeedbackAsResolved = function(id) {
    const resolved = this.data.resolvedFeedbacks || []
    resolved.push(id)
    this.setData({ resolvedFeedbacks: resolved })
  }
  mockPage.exportFeedback = function() { wx.downloadFile && wx.downloadFile() }
  
  // 公告管理相关方法
  mockPage.publishNotice = function(data) {
    wx.request({
      url: '/api/notice/publish',
      method: 'POST',
      data
    })
  }
  mockPage.editNotice = function(data) {
    wx.request({
      url: '/api/notice/update',
      method: 'PUT',
      data
    })
  }
  mockPage.deleteNotice = function(data) {
    wx.request({
      url: '/api/notice/delete',
      method: 'DELETE',
      data
    })
  }
  mockPage.loadNoticeList = function() {
    this.setData({ noticeList: this.data.noticeList || [] })
  }
  
  // 帮助文档相关方法
  mockPage.loadHelpDocList = function() {
    this.setData({ helpDocs: this.data.helpDocs || [{ id: 1, title: '帮助文档' }] })
  }
  mockPage.addHelpDoc = function(data) {
    wx.request({
      url: '/api/help/add',
      method: 'POST',
      data
    })
  }
  mockPage.editHelpDoc = function(data) {
    wx.request({
      url: '/api/help/update',
      method: 'PUT',
      data
    })
  }
  mockPage.deleteHelpDoc = function(data) {
    wx.request({
      url: '/api/help/delete',
      method: 'DELETE',
      data
    })
  }
  
  // 请求队列管理
  mockPage.requestQueue = []
  
  return mockPage
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
  request: jest.fn().mockResolvedValue({ statusCode: 200, data: {} }),
  getStorageSync: jest.fn(),
  setStorageSync: jest.fn(),
  removeStorageSync: jest.fn(),
  clearStorageSync: jest.fn(),
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
  saveImageToPhotosAlbum: jest.fn(),
  stopPullDownRefresh: jest.fn(),
  startPullDownRefresh: jest.fn()
}

// 模拟 getApp 函数
global.getApp = jest.fn(() => ({
  globalData: {
    userInfo: null,
    token: null
  }
}))

// Mock echarts
jest.mock('echarts', () => ({
  init: jest.fn(() => ({
    setOption: jest.fn(),
    dispose: jest.fn(),
    resize: jest.fn()
  })),
  graphic: {
    LinearGradient: jest.fn((x0, y0, x1, y1, colors) => ({ type: 'linear', colors })),
    RadialGradient: jest.fn((x, y, r, colors) => ({ type: 'radial', colors }))
  }
}))
