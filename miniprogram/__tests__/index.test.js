/**
 * 首页单元测试
 * 测试首页页面数据初始化和功能
 */

describe('首页测试', () => {
  
  test('页面数据初始化正确', () => {
    const page = getPage('/pages/index/index')
    expect(page.data.solarDate).toContain('2026 年')
    expect(page.data.lunarDate).toContain('佛历')
    expect(page.data.zenQuote).toBeTruthy()
  })
  
  test('打卡按钮存在', () => {
    const page = getPage('/pages/index/index')
    expect(page.data.morningPunch).toBeDefined()
    expect(page.data.eveningPunch).toBeDefined()
  })
  
  test('佛历数据格式正确', () => {
    const page = getPage('/pages/index/index')
    expect(page.data.suit).toBeInstanceOf(Array)
    expect(page.data.avoid).toBeInstanceOf(Array)
  })
  
  test('宜忌数据内容正确', () => {
    const page = getPage('/pages/index/index')
    expect(page.data.suit.length).toBeGreaterThan(0)
    expect(page.data.avoid.length).toBeGreaterThan(0)
    // 验证宜忌内容为字符串
    page.data.suit.forEach(item => {
      expect(typeof item).toBe('string')
    })
    page.data.avoid.forEach(item => {
      expect(typeof item).toBe('string')
    })
  })
  
  test('禅语存在且非空', () => {
    const page = getPage('/pages/index/index')
    expect(page.data.zenQuote).toBeTruthy()
    expect(page.data.zenQuote.length).toBeGreaterThan(0)
    expect(typeof page.data.zenQuote).toBe('string')
  })
  
  test('打卡对象结构正确', () => {
    const page = getPage('/pages/index/index')
    expect(page.data.morningPunch).toHaveProperty('checked')
    expect(page.data.morningPunch).toHaveProperty('time')
    expect(page.data.eveningPunch).toHaveProperty('checked')
    expect(page.data.eveningPunch).toHaveProperty('time')
  })
  
  test('日期格式包含完整信息', () => {
    const page = getPage('/pages/index/index')
    // 验证阳历日期格式
    expect(page.data.solarDate).toContain('年')
    expect(page.data.solarDate).toContain('月')
    expect(page.data.solarDate).toContain('日')
    // 验证农历日期格式
    expect(page.data.lunarDate).toContain('佛历')
  })
})
