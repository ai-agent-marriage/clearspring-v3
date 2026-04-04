/**
 * 用户反馈首页单元测试
 * @pages/admin/feedback/index
 */

describe('Feedback Index Page', () => {
  let page = null

  beforeEach(() => {
    page = getPage('/pages/admin/feedback/index')
  })

  test('页面数据初始化正确', () => {
    expect(page.data.stats).toBeDefined()
    expect(page.data.stats.totalFeedback).toBe(256)
    expect(page.data.stats.pendingFeedback).toBe(12)
    expect(page.data.stats.processedFeedback).toBe(244)
  })

  test('菜单列表配置正确', () => {
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

  test('loadFeedbackStats 方法存在', () => {
    expect(typeof page.loadFeedbackStats).toBe('function')
  })

  test('onMenuTap 跳转方法存在', () => {
    expect(typeof page.onMenuTap).toBe('function')
  })

  test('onSubmitFeedback 方法存在', () => {
    expect(typeof page.onSubmitFeedback).toBe('function')
  })

  test('onViewPending 方法存在', () => {
    expect(typeof page.onViewPending).toBe('function')
  })

  test('统计数据计算正确', () => {
    const { totalFeedback, pendingFeedback, processedFeedback } = page.data.stats
    expect(totalFeedback).toBe(pendingFeedback + processedFeedback)
  })

  test('菜单图标和名称匹配', () => {
    const menuIcons = ['📝', '📋', '📊', '⚙️']
    const menuNames = ['反馈提交', '反馈管理', '反馈统计', '反馈设置']
    
    page.data.menus.forEach((menu, index) => {
      expect(menu.icon).toBe(menuIcons[index])
      expect(menu.name).toBe(menuNames[index])
    })
  })
})
