/**
 * 禅理板块首页单元测试
 * 测试禅理首页 1 和首页 2 的功能
 */

describe('禅理板块首页测试', () => {
  
  test('首页 1 禅理短句存在', () => {
    const page = getPage('/pages/zen/home1')
    expect(page.data.zenQuote).toBeTruthy()
    expect(page.data.author).toBeTruthy()
  })
  
  test('首页 1 刷新功能正常', () => {
    const page = getPage('/pages/zen/home1')
    const oldQuote = page.data.zenQuote
    page.refresh()
    expect(page.data.zenQuote).not.toBe(oldQuote)
  })
  
  test('首页 2 功能入口正确', () => {
    const page = getPage('/pages/zen/home2')
    expect(page.data.functions).toBeInstanceOf(Array)
    expect(page.data.functions.length).toBe(4)
  })
  
  test('首页 2 功能对象结构正确', () => {
    const page = getPage('/pages/zen/home2')
    const func = page.data.functions[0]
    expect(func).toHaveProperty('icon')
    expect(func).toHaveProperty('name')
    expect(func).toHaveProperty('desc')
  })
  
  test('首页 1 上滑切换功能', () => {
    const page = getPage('/pages/zen/home1')
    // 模拟上滑事件
    page.onPageScroll({ scrollTop: 500 })
    // 验证切换到首页 2（通过 wx.switchTab 调用）
    expect(wx.switchTab).toHaveBeenCalled()
  })
  
  test('首页 2 下滑切换功能', () => {
    const page = getPage('/pages/zen/home2')
    // 模拟下滑事件
    page.onPageScroll({ scrollTop: 0 })
    // 验证切换到首页 1（通过 wx.switchTab 调用）
    expect(wx.switchTab).toHaveBeenCalled()
  })
  
  test('首页 1 禅理短句格式正确', () => {
    const page = getPage('/pages/zen/home1')
    expect(typeof page.data.zenQuote).toBe('string')
    expect(page.data.zenQuote.length).toBeGreaterThan(0)
    expect(typeof page.data.author).toBe('string')
  })
  
  test('首页 2 功能 URL 正确', () => {
    const page = getPage('/pages/zen/home2')
    const func = page.data.functions[0]
    expect(func.url).toBeTruthy()
    expect(func.url.startsWith('/')).toBe(true)
  })
  
  test('首页 1 背景图片存在', () => {
    const page = getPage('/pages/zen/home1')
    expect(page.data.background).toBeTruthy()
    expect(page.data.background).toContain('/assets/')
  })
  
  test('首页 2 背景图片存在', () => {
    const page = getPage('/pages/zen/home2')
    expect(page.data.background).toBeTruthy()
    expect(page.data.background).toContain('/assets/')
  })
})
