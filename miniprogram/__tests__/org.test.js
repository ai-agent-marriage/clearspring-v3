/**
 * 机构端单元测试
 * 测试机构端首页、订单管理、志愿者管理、结算管理等功能
 */

describe('机构端首页测试', () => {
  test('机构信息展示正常', () => {
    const page = getPage('/pages/org-home/index')
    expect(page.data.org).toBeTruthy()
    expect(page.data.org.name).toBeTruthy()
  })
  
  test('数据看板展示正常', () => {
    const page = getPage('/pages/org-home/index')
    expect(page.data.stats).toBeTruthy()
    expect(page.data.stats.pendingOrders).toBeDefined()
    expect(page.data.stats.todayTasks).toBeDefined()
  })
  
  test('待办事项显示正常', () => {
    const page = getPage('/pages/org-home/index')
    expect(page.data.todos).toBeInstanceOf(Array)
    page.data.todos.forEach(todo => {
      expect(todo.title).toBeTruthy()
      expect(todo.action).toBeTruthy()
    })
  })
  
  test('功能入口显示正常', () => {
    const page = getPage('/pages/org-home/index')
    expect(page.data.functions).toBeInstanceOf(Array)
    expect(page.data.functions.length).toBe(4)
  })
  
  test('切换视角按钮显示正常', () => {
    const page = getPage('/pages/org-home/index')
    expect(page.data.showSwitchButton).toBe(true)
  })
})

describe('机构订单管理页测试', () => {
  test('Tab 切换正常', () => {
    const page = getPage('/pages/org-home/orders')
    expect(page.data.tabs).toBeInstanceOf(Array)
    page.switchTab(1)
    expect(page.data.activeTab).toBe(1)
  })
  
  test('筛选栏展开/收起正常', () => {
    const page = getPage('/pages/org-home/orders')
    expect(page.data.showFilter).toBe(false)
    page.toggleFilter()
    expect(page.data.showFilter).toBe(true)
  })
  
  test('订单列表显示正常', () => {
    const page = getPage('/pages/org-home/orders')
    expect(page.data.orders).toBeInstanceOf(Array)
  })
  
  test('操作按钮根据状态显示', () => {
    const page = getPage('/pages/org-home/orders')
    const order = page.data.orders.find(o => o.status === 1)
    expect(order.actions).toContain('承接订单')
  })
})

describe('机构志愿者管理页测试', () => {
  test('邀请码弹窗显示正常', () => {
    const page = getPage('/pages/org-home/volunteers')
    page.showInviteModal()
    expect(page.data.showInviteModal).toBe(true)
    expect(page.data.inviteCode).toBeTruthy()
  })
  
  test('数据卡片展示正常', () => {
    const page = getPage('/pages/org-home/volunteers')
    expect(page.data.stats).toBeTruthy()
    expect(page.data.stats.totalVolunteers).toBeDefined()
  })
  
  test('志愿者列表显示正常', () => {
    const page = getPage('/pages/org-home/volunteers')
    expect(page.data.volunteers).toBeInstanceOf(Array)
  })
  
  test('操作按钮显示正常', () => {
    const page = getPage('/pages/org-home/volunteers')
    const volunteer = page.data.volunteers[0]
    expect(volunteer.actions).toBeInstanceOf(Array)
  })
})

describe('机构结算管理页测试', () => {
  test('数据卡片展示正常', () => {
    const page = getPage('/pages/org-home/settlement')
    expect(page.data.stats).toBeTruthy()
    expect(page.data.stats.totalSettled).toBeDefined()
  })
  
  test('Tab 切换正常', () => {
    const page = getPage('/pages/org-home/settlement')
    expect(page.data.tabs).toBeInstanceOf(Array)
    page.switchTab(1)
    expect(page.data.activeTab).toBe(1)
  })
  
  test('待结算订单列表显示正常', () => {
    const page = getPage('/pages/org-home/settlement')
    page.setData({ activeTab: 0 })
    expect(page.data.pendingSettlements).toBeInstanceOf(Array)
  })
  
  test('结算记录导出功能正常', () => {
    const page = getPage('/pages/org-home/settlement')
    page.setData({ activeTab: 1 })
    page.exportSettlement()
    expect(wx.downloadFile).toHaveBeenCalled()
  })
  
  test('发票上传功能正常', () => {
    const page = getPage('/pages/org-home/settlement')
    page.setData({ activeTab: 2 })
    page.uploadInvoice()
    expect(wx.chooseImage).toHaveBeenCalled()
  })
})
