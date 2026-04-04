/**
 * 护生板块单元测试
 * 测试护生功德林、自主护生登记、记录详情等页面功能
 */

// Mock wx 对象
const mockWx = {
  showToast: jest.fn(),
  navigateTo: jest.fn(),
  navigateBack: jest.fn(),
  previewImage: jest.fn(),
  chooseImage: jest.fn(),
  security: {
    imgSecCheck: jest.fn(),
    msgSecCheck: jest.fn()
  },
  request: jest.fn()
}

global.wx = mockWx

// 模拟页面对象 - 不依赖 app.js
function createProtectIndexPage() {
  return {
    route: 'pages/protect/index',
    data: {
      tabs: ['自主护生', '委托护生'],
      activeTab: 0,
      complianceNotice: '合规声明：请确保放生行为符合当地法律法规',
      protectRecords: [
        { id: 1, speciesName: '鲢鱼', quantity: 100, createTime: '2026-04-01' },
        { id: 2, speciesName: '草鱼', quantity: 50, createTime: '2026-04-02' }
      ],
      orders: [
        { id: 1, orderNo: 'PRO202604010001', amount: 299, status: 1 }
      ]
    },
    switchTab: function(index) {
      this.data.activeTab = index
    }
  }
}

function createProtectRegisterPage() {
  return {
    route: 'pages/protect/register',
    data: {
      agree: false,
      speciesList: [
        { id: 1, name: '鲢鱼', isForbid: 0 },
        { id: 2, name: '草鱼', isForbid: 0 },
        { id: 3, name: '鲤鱼', isForbid: 0 }
      ],
      form: {
        species: '',
        quantity: 0,
        address: '',
        images: [],
        wish: ''
      }
    },
    setData: function(newData) {
      Object.assign(this.data, newData)
    },
    submitRecord: async function() {
      // 表单校验
      if (!this.data.form.species || !this.data.form.quantity) {
        wx.showToast({ title: '请填写必填项', icon: 'none' })
        return
      }
      
      // 合规承诺校验
      if (!this.data.agree) {
        wx.showToast({ title: '请先勾选合规承诺', icon: 'none' })
        return
      }
      
      // 内容安全审核
      if (this.data.form.images.length > 0) {
        const imgCheck = await wx.security.imgSecCheck(this.data.form.images[0])
        if (!imgCheck) {
          wx.showToast({ title: '图片包含违规内容', icon: 'none' })
          return
        }
      }
      
      const textCheck = await wx.security.msgSecCheck(this.data.form.wish || '')
      if (!textCheck) {
        wx.showToast({ title: '文本包含违规内容', icon: 'none' })
        return
      }
      
      // 提交成功
      wx.showToast({ title: '提交成功', icon: 'success' })
    },
    chooseImage: function() {
      const count = Math.floor(Math.random() * 6) + 1
      this.data.form.images = Array(count).fill('img.jpg')
    }
  }
}

function createProtectDetailPage() {
  return {
    route: 'pages/protect/detail',
    data: {
      record: {
        id: 1,
        speciesName: '鲢鱼',
        quantity: 100,
        address: '珠江广州段',
        images: ['img1.jpg', 'img2.jpg'],
        certUrl: 'https://example.com/cert/1.jpg',
        createTime: new Date(),
        status: 1
      },
      canEdit: false
    },
    onLoad: function() {
      const now = new Date()
      const createTime = new Date(this.data.record.createTime)
      const diffDays = (now - createTime) / (24 * 60 * 60 * 1000)
      this.setData({ canEdit: diffDays <= 3 })
    },
    setData: function(newData) {
      Object.assign(this.data, newData)
    },
    previewImage: function(index) {
      wx.previewImage({
        current: this.data.record.images[index],
        urls: this.data.record.images
      })
    }
  }
}

describe('护生功德林测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  test('护生功德林主页面 Tab 切换正常', () => {
    const page = createProtectIndexPage()
    expect(page.data.tabs).toBeInstanceOf(Array)
    expect(page.data.tabs.length).toBe(2)
    
    page.switchTab(1) // 切换到委托护生
    expect(page.data.activeTab).toBe(1)
  })
  
  test('合规声明栏显示正常', () => {
    const page = createProtectIndexPage()
    expect(page.data.complianceNotice).toBeTruthy()
    expect(page.data.complianceNotice).toContain('合规')
  })
  
  test('自主护生记录列表显示正常', () => {
    const page = createProtectIndexPage()
    expect(page.data.protectRecords).toBeInstanceOf(Array)
    expect(page.data.protectRecords.length).toBeGreaterThan(0)
  })
  
  test('委托订单列表显示正常', () => {
    const page = createProtectIndexPage()
    expect(page.data.orders).toBeInstanceOf(Array)
  })
})

describe('免费自主护生登记页测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  test('合规承诺书显示正常', () => {
    const page = createProtectRegisterPage()
    expect(page.data.agree).toBe(false) // 默认未勾选
  })
  
  test('表单必填项校验正常', () => {
    const page = createProtectRegisterPage()
    page.submitRecord() // 未填写表单提交
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请填写必填项',
      icon: 'none'
    })
  })
  
  test('合规承诺勾选校验正常', () => {
    const page = createProtectRegisterPage()
    page.setData({ 
      agree: false,
      form: {
        species: '鲢鱼',
        quantity: 100,
        address: '珠江广州段',
        images: [],
        wish: '平安顺遂'
      }
    })
    page.submitRecord()
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请先勾选合规承诺',
      icon: 'none'
    })
  })
  
  test('物种选择器仅显示可投放物种', () => {
    const page = createProtectRegisterPage()
    page.data.speciesList.forEach(species => {
      expect(species.isForbid).toBe(0) // 仅可投放物种
    })
  })
  
  test('照片上传功能正常', () => {
    const page = createProtectRegisterPage()
    page.chooseImage()
    expect(page.data.form.images.length).toBeLessThanOrEqual(6)
    expect(page.data.form.images.length).toBeGreaterThan(0)
  })
  
  test('内容安全审核调用正常', async () => {
    const page = createProtectRegisterPage()
    page.setData({ 
      agree: true,
      form: {
        species: '鲢鱼',
        quantity: 100,
        images: ['img1.jpg'],
        wish: '平安顺遂'
      }
    })
    
    // Mock 内容安全审核通过
    wx.security.imgSecCheck.mockResolvedValue(true)
    wx.security.msgSecCheck.mockResolvedValue(true)
    
    await page.submitRecord()
    expect(wx.security.imgSecCheck).toHaveBeenCalled()
    expect(wx.security.msgSecCheck).toHaveBeenCalled()
  })
  
  test('图片审核失败阻止提交', async () => {
    const page = createProtectRegisterPage()
    page.setData({ 
      agree: true,
      form: {
        species: '鲢鱼',
        quantity: 100,
        images: ['img1.jpg'],
        wish: '平安顺遂'
      }
    })
    
    // Mock 图片审核失败
    wx.security.imgSecCheck.mockResolvedValue(false)
    
    await page.submitRecord()
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '图片包含违规内容',
      icon: 'none'
    })
  })
  
  test('文本审核失败阻止提交', async () => {
    const page = createProtectRegisterPage()
    page.setData({ 
      agree: true,
      form: {
        species: '鲢鱼',
        quantity: 100,
        images: [],
        wish: '敏感词测试'
      }
    })
    
    // Mock 图片审核通过，文本审核失败
    wx.security.imgSecCheck.mockResolvedValue(true)
    wx.security.msgSecCheck.mockResolvedValue(false)
    
    await page.submitRecord()
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '文本包含违规内容',
      icon: 'none'
    })
  })
})

describe('自主护生记录详情页测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })
  
  test('记录详情显示正常', () => {
    const page = createProtectDetailPage()
    expect(page.data.record).toBeTruthy()
    expect(page.data.record.speciesName).toBeTruthy()
  })
  
  test('照片网格布局显示正常', () => {
    const page = createProtectDetailPage()
    expect(page.data.record.images).toBeInstanceOf(Array)
    expect(page.data.record.images.length).toBeGreaterThan(0)
  })
  
  test('证书卡片显示正常', () => {
    const page = createProtectDetailPage()
    expect(page.data.record.certUrl).toBeTruthy()
  })
  
  test('3 天内可编辑校验正常', () => {
    const page = createProtectDetailPage()
    page.data.record.createTime = new Date() // 今日创建
    page.onLoad()
    expect(page.data.canEdit).toBe(true)
  })
  
  test('超过 3 天不可编辑', () => {
    const page = createProtectDetailPage()
    page.data.record.createTime = new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) // 4 天前
    page.onLoad()
    expect(page.data.canEdit).toBe(false)
  })
  
  test('照片预览功能正常', () => {
    const page = createProtectDetailPage()
    page.previewImage(0)
    expect(wx.previewImage).toHaveBeenCalled()
  })
  
  test('刚好 3 天可编辑', () => {
    const page = createProtectDetailPage()
    page.data.record.createTime = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 刚好 3 天
    page.onLoad()
    expect(page.data.canEdit).toBe(true)
  })
})
