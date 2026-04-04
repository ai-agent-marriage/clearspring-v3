/**
 * Day 16 用户反馈系统完整测试套件
 * 测试文件：miniprogram/__tests__/feedback-system.test.js
 * 
 * 测试范围:
 * - 反馈首页测试
 * - 反馈提交测试
 * - 反馈管理测试
 * - 反馈服务测试
 * 
 * 用例数量：15 个
 */

describe('用户反馈系统 - 首页测试', () => {
  let page = null

  beforeEach(() => {
    page = getPage('/pages/admin/feedback/index')
  })

  test('1. 页面初始化加载统计数据', () => {
    expect(page.data.stats).toBeDefined()
    expect(page.data.stats.totalFeedback).toBe(256)
    expect(page.data.stats.pendingFeedback).toBe(12)
    expect(page.data.stats.processedFeedback).toBe(244)
  })

  test('2. 菜单列表配置正确', () => {
    expect(page.data.menus).toHaveLength(4)
    expect(page.data.menus[0].name).toBe('反馈提交')
    expect(page.data.menus[0].path).toBe('/pages/admin/feedback/submit')
    expect(page.data.menus[1].name).toBe('反馈管理')
    expect(page.data.menus[1].path).toBe('/pages/admin/feedback/manage')
    expect(page.data.menus[2].name).toBe('反馈统计')
    expect(page.data.menus[2].path).toBe('/pages/admin/feedback/stats')
    expect(page.data.menus[3].name).toBe('反馈设置')
    expect(page.data.menus[3].path).toBe('/pages/admin/feedback/settings')
  })

  test('3. 菜单图标和名称匹配', () => {
    const menuIcons = ['📝', '📋', '📊', '⚙️']
    const menuNames = ['反馈提交', '反馈管理', '反馈统计', '反馈设置']
    
    page.data.menus.forEach((menu, index) => {
      expect(menu.icon).toBe(menuIcons[index])
      expect(menu.name).toBe(menuNames[index])
    })
  })

  test('4. 统计数据计算正确', () => {
    const { totalFeedback, pendingFeedback, processedFeedback } = page.data.stats
    expect(totalFeedback).toBe(pendingFeedback + processedFeedback)
  })

  test('5. 菜单点击跳转功能', () => {
    const mockNavigateTo = jest.fn()
    wx.navigateTo = mockNavigateTo
    
    page.onMenuTap({
      currentTarget: {
        dataset: { path: '/pages/admin/feedback/submit' }
      }
    })
    
    expect(mockNavigateTo).toHaveBeenCalledWith({
      url: '/pages/admin/feedback/submit'
    })
  })
})

describe('用户反馈系统 - 提交测试', () => {
  let page = null

  beforeEach(() => {
    page = getPage('/pages/admin/feedback/submit')
  })

  test('6. 表单数据初始化正确', () => {
    expect(page.data.form).toBeDefined()
    expect(page.data.form.type).toBe('')
    expect(page.data.form.title).toBe('')
    expect(page.data.form.content).toBe('')
    expect(page.data.form.images).toEqual([])
    expect(page.data.form.contact).toBe('')
  })

  test('7. 反馈类型列表配置正确', () => {
    expect(page.data.feedbackTypes).toHaveLength(3)
    expect(page.data.feedbackTypes[0].value).toBe('suggestion')
    expect(page.data.feedbackTypes[0].label).toBe('功能建议')
    expect(page.data.feedbackTypes[1].value).toBe('bug')
    expect(page.data.feedbackTypes[1].label).toBe('Bug 反馈')
    expect(page.data.feedbackTypes[2].value).toBe('other')
    expect(page.data.feedbackTypes[2].label).toBe('其他')
  })

  test('8. 图片上传数量限制', () => {
    const mockShowToast = jest.fn()
    wx.showToast = mockShowToast
    
    page.setData({
      'form.images': ['img1.jpg', 'img2.jpg', 'img3.jpg', 'img4.jpg', 'img5.jpg', 'img6.jpg']
    })
    
    page.onUploadImage()
    
    expect(mockShowToast).toHaveBeenCalledWith({
      title: '最多上传 6 张图片',
      icon: 'none'
    })
  })

  test('9. 删除图片功能', () => {
    page.setData({
      'form.images': ['img1.jpg', 'img2.jpg', 'img3.jpg']
    })
    
    page.onDeleteImage({
      currentTarget: {
        dataset: { index: 1 }
      }
    })
    
    expect(page.data.form.images).toHaveLength(2)
    expect(page.data.form.images).toEqual(['img1.jpg', 'img3.jpg'])
  })

  test('10. 表单验证 - 缺少类型', () => {
    const mockShowToast = jest.fn()
    wx.showToast = mockShowToast
    
    page.setData({
      'form.type': '',
      'form.title': '测试标题',
      'form.content': '测试内容'
    })
    
    page.onSubmit()
    
    expect(mockShowToast).toHaveBeenCalledWith({
      title: '请选择反馈类型',
      icon: 'none'
    })
  })

  test('11. 表单验证 - 缺少标题', () => {
    const mockShowToast = jest.fn()
    wx.showToast = mockShowToast
    
    page.setData({
      'form.type': 'suggestion',
      'form.title': '',
      'form.content': '测试内容'
    })
    
    page.onSubmit()
    
    expect(mockShowToast).toHaveBeenCalledWith({
      title: '请填写反馈标题',
      icon: 'none'
    })
  })

  test('12. 表单验证 - 缺少内容', () => {
    const mockShowToast = jest.fn()
    wx.showToast = mockShowToast
    
    page.setData({
      'form.type': 'suggestion',
      'form.title': '测试标题',
      'form.content': ''
    })
    
    page.onSubmit()
    
    expect(mockShowToast).toHaveBeenCalledWith({
      title: '请填写反馈内容',
      icon: 'none'
    })
  })
})

describe('用户反馈系统 - 管理测试', () => {
  let page = null

  beforeEach(() => {
    page = getPage('/pages/admin/feedback/manage')
  })

  test('13. 筛选栏切换功能', () => {
    const initialShowFilter = page.data.showFilter
    page.onToggleFilter()
    expect(page.data.showFilter).toBe(!initialShowFilter)
  })

  test('14. 反馈类型筛选功能', () => {
    page.onTypeChange({
      detail: { value: 'suggestion' }
    })
    
    expect(page.data.filterType).toBe('suggestion')
    expect(page.data.page).toBe(1)
  })

  test('15. 反馈状态筛选功能', () => {
    page.onStatusChange({
      detail: { value: '1' }
    })
    
    expect(page.data.filterStatus).toBe('1')
    expect(page.data.page).toBe(1)
  })
})
