/**
 * 消息推送功能完整测试套件
 * 覆盖首页、订阅配置页、消息记录页的所有功能
 * 共 20 个测试用例
 */

// Mock wx 对象
const mockWx = {
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  showModal: jest.fn(),
  navigateTo: jest.fn(),
  vibrateShort: jest.fn(),
  showActionSheet: jest.fn(),
  stopPullDownRefresh: jest.fn()
}

global.wx = mockWx

// 辅助函数：创建页面实例
function createPage(path) {
  const pages = {
    '/pages/admin/message/index': require('../pages/admin/message/index.js'),
    '/pages/admin/message/subscribe': require('../pages/admin/message/subscribe.js'),
    '/pages/admin/message/records': require('../pages/admin/message/records.js')
  }
  return pages[path]
}

// ==================== 首页测试 ====================

describe('消息推送首页测试', () => {
  let page = null

  beforeEach(() => {
    mockWx.showToast.mockClear()
    mockWx.navigateTo.mockClear()
    mockWx.vibrateShort.mockClear()
  })

  test('1. 页面初始化加载统计数据', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    expect(page.data.stats).toBeDefined()
    expect(page.data.loading).toBe(false)
  })

  test('2. 数据概览卡片包含所有必需字段', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    expect(page.data.stats.totalMessages).toBeDefined()
    expect(page.data.stats.todayMessages).toBeDefined()
    expect(page.data.stats.subscriberCount).toBeDefined()
    expect(page.data.stats.failedMessages).toBeDefined()
  })

  test('3. 功能入口区显示 4 个菜单项', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    expect(page.data.menus).toHaveLength(4)
    page.data.menus.forEach(menu => {
      expect(menu.icon).toBeDefined()
      expect(menu.name).toBeDefined()
      expect(menu.path).toBeDefined()
      expect(menu.color).toBeDefined()
    })
  })

  test('4. 未读消息提示功能正常', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    expect(page.data.unreadCount).toBeDefined()
    expect(typeof page.data.unreadCount).toBe('number')
  })

  test('5. 点击菜单跳转功能正常', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    const mockEvent = {
      currentTarget: {
        dataset: {
          path: '/pages/admin/message/subscribe',
          name: '订阅配置'
        }
      }
    }
    page.goToMenu(mockEvent)
    expect(mockWx.vibrateShort).toHaveBeenCalledWith({ type: 'light' })
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/admin/message/subscribe'
    })
  })

  test('6. 发送测试消息功能正常', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    page.sendTestMessage()
    expect(mockWx.vibrateShort).toHaveBeenCalledWith({ type: 'medium' })
    expect(mockWx.showLoading).toHaveBeenCalledWith({ title: '发送中...' })
  })

  test('7. 查看记录跳转功能正常', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    page.viewRecords()
    expect(mockWx.vibrateShort).toHaveBeenCalledWith({ type: 'light' })
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/admin/message/records'
    })
  })

  test('8. 自动刷新定时器清理正常', () => {
    const Page = createPage('/pages/admin/message/index')
    page = Page()
    page.refreshTimer = setTimeout(() => {}, 1000)
    const timerId = page.refreshTimer
    page.onUnload()
    expect(page.refreshTimer).toBeNull()
  })
})

// ==================== 订阅配置页测试 ====================

describe('订阅消息配置页测试', () => {
  let page = null

  beforeEach(() => {
    mockWx.showToast.mockClear()
    mockWx.showModal.mockClear()
    mockWx.showLoading.mockClear()
    mockWx.hideLoading.mockClear()
  })

  test('9. 模板列表加载正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    expect(page.data.templates).toBeInstanceOf(Array)
    expect(page.data.triggerOptions).toBeInstanceOf(Array)
    expect(page.data.triggerOptions.length).toBeGreaterThanOrEqual(4)
  })

  test('10. 搜索功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      templates: [
        { id: 1, name: '订单通知', templateId: 'ORDER' },
        { id: 2, name: '系统通知', templateId: 'SYSTEM' }
      ]
    })
    page.onSearch({ detail: { value: '订单' } })
    expect(page.data.searchKeyword).toBe('订单')
    expect(page.data.filteredTemplates.length).toBe(1)
  })

  test('11. 清空搜索功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({ searchKeyword: '测试', filteredTemplates: [] })
    page.clearSearch()
    expect(page.data.searchKeyword).toBe('')
    expect(page.data.filteredTemplates).toEqual(page.data.templates)
  })

  test('12. 切换启用状态功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      templates: [{ id: 1, name: '测试', enabled: true }]
    })
    const mockEvent = { currentTarget: { dataset: { index: 0 } } }
    page.toggleEnable(mockEvent)
    expect(mockWx.showLoading).toHaveBeenCalledWith({ title: '同步中...' })
  })

  test('13. 编辑模板功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      filteredTemplates: [{ id: 1, name: '测试模板', templateId: 'TEST' }]
    })
    const mockEvent = { currentTarget: { dataset: { index: 0 } } }
    page.editTemplate(mockEvent)
    expect(page.data.showEditDialog).toBe(true)
    expect(page.data.isEditing).toBe(true)
    expect(page.data.editingTemplate).toBeDefined()
  })

  test('14. 删除模板功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      filteredTemplates: [{ id: 1, name: '测试模板' }],
      templates: [{ id: 1, name: '测试模板' }]
    })
    const mockEvent = { currentTarget: { dataset: { index: 0 } } }
    
    // 模拟用户确认删除
    mockWx.showModal.mockImplementation((options) => {
      options.success({ confirm: true })
    })
    
    page.deleteTemplate(mockEvent)
    expect(mockWx.showModal).toHaveBeenCalled()
  })

  test('15. 表单验证功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      editingTemplate: { name: '', templateId: '', content: '' }
    })
    const isValid = page.validateForm()
    expect(isValid).toBe(false)
    expect(page.data.formErrors.name).toBeDefined()
    expect(page.data.formErrors.templateId).toBeDefined()
    expect(page.data.formErrors.content).toBeDefined()
  })

  test('16. 保存模板功能正常', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      editingTemplate: {
        id: 1,
        name: '测试模板',
        templateId: 'TEST_TEMPLATE',
        enabled: true,
        trigger: 'order_create',
        content: '测试内容'
      },
      templates: [],
      isEditing: false
    })
    page.saveTemplate()
    expect(mockWx.showLoading).toHaveBeenCalledWith({ title: '保存中...' })
  })

  test('17. 输入框更新清除错误状态', () => {
    const Page = createPage('/pages/admin/message/subscribe')
    page = Page()
    page.setData({
      formErrors: { name: '请输入名称' },
      editingTemplate: { name: '' }
    })
    page.onInputChange({
      currentTarget: { dataset: { field: 'name' } },
      detail: { value: '新名称' }
    })
    expect(page.data.formErrors.name).toBeUndefined()
  })
})

// ==================== 消息记录页测试 ====================

describe('消息记录页面测试', () => {
  let page = null

  beforeEach(() => {
    mockWx.showToast.mockClear()
    mockWx.showModal.mockClear()
    mockWx.showLoading.mockClear()
    mockWx.hideLoading.mockClear()
  })

  test('18. 消息记录加载正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    expect(page.data.records).toBeInstanceOf(Array)
    expect(page.data.filterDateRange).toBeDefined()
    expect(page.data.filterType).toBeDefined()
    expect(page.data.filterStatus).toBeDefined()
  })

  test('19. 筛选功能正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    page.toggleFilter()
    expect(page.data.showFilter).toBe(true)
    page.toggleFilter()
    expect(page.data.showFilter).toBe(false)
  })

  test('20. 导出功能带进度提示', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    
    // 模拟用户确认导出
    mockWx.showModal.mockImplementation((options) => {
      options.success({ confirm: true })
    })
    
    page.exportData()
    expect(page.data.exporting).toBe(true)
    expect(mockWx.showModal).toHaveBeenCalled()
  })

  test('21. 重新发送功能正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    page.setData({
      filteredRecords: [{
        id: 1,
        title: '测试',
        recipient: '用户',
        status: 0,
        statusName: '失败'
      }],
      records: [{
        id: 1,
        title: '测试',
        recipient: '用户',
        status: 0,
        statusName: '失败'
      }]
    })
    
    const mockEvent = { currentTarget: { dataset: { index: 0 } } }
    
    mockWx.showModal.mockImplementation((options) => {
      options.success({ confirm: true })
    })
    
    page.resend(mockEvent)
    expect(mockWx.vibrateShort).toHaveBeenCalledWith({ type: 'medium' })
    expect(mockWx.showModal).toHaveBeenCalled()
  })

  test('22. 分页加载功能正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    expect(page.data.page).toBe(1)
    expect(page.data.pageSize).toBe(10)
    expect(page.data.hasMore).toBe(true)
  })

  test('23. 下拉刷新功能正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    page.onPullDownRefresh()
    expect(page.data.page).toBe(1)
    expect(page.data.hasMore).toBe(true)
  })

  test('24. 查看详情功能正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    page.setData({
      filteredRecords: [{
        id: 1,
        title: '测试消息',
        content: '测试内容'
      }]
    })
    
    const mockEvent = { currentTarget: { dataset: { index: 0 } } }
    page.viewDetail(mockEvent)
    
    expect(mockWx.vibrateShort).toHaveBeenCalledWith({ type: 'light' })
    expect(mockWx.showModal).toHaveBeenCalled()
  })

  test('25. 筛选条件重置功能正常', () => {
    const Page = createPage('/pages/admin/message/records')
    page = Page()
    page.setData({
      filterDateRange: '近 30 天',
      filterType: 'order',
      filterStatus: 'success'
    })
    page.resetFilter()
    expect(page.data.filterDateRange).toBe('近 7 天')
    expect(page.data.filterType).toBe('all')
    expect(page.data.filterStatus).toBe('all')
  })
})

// ==================== 集成测试 ====================

describe('消息推送功能集成测试', () => {
  test('26. 页面间跳转流程正常', () => {
    const IndexPage = createPage('/pages/admin/message/index')
    const indexPage = IndexPage()
    
    const mockEvent = {
      currentTarget: {
        dataset: { path: '/pages/admin/message/records', name: '发送记录' }
      }
    }
    
    indexPage.goToMenu(mockEvent)
    expect(mockWx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/admin/message/records'
    })
  })

  test('27. 数据一致性检查', () => {
    const RecordsPage = createPage('/pages/admin/message/records')
    const recordsPage = RecordsPage()
    
    // 检查筛选选项完整性
    expect(recordsPage.data.dateRangeOptions.length).toBeGreaterThanOrEqual(3)
    expect(recordsPage.data.typeOptions.length).toBeGreaterThanOrEqual(3)
    expect(recordsPage.data.statusOptions.length).toBeGreaterThanOrEqual(3)
  })
})
