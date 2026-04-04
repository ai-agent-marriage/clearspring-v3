/**
 * 消息推送首页单元测试
 * @pages/admin/message/index
 */

describe('Message Index Page', () => {
  let page = null

  beforeEach(() => {
    page = getCurrentPages()[0]
  })

  test('页面数据初始化正确', () => {
    expect(page.data.stats).toBeDefined()
    expect(page.data.stats.totalMessages).toBe(1256)
    expect(page.data.stats.todayMessages).toBe(89)
    expect(page.data.stats.subscriberCount).toBe(456)
  })

  test('菜单列表配置正确', () => {
    expect(page.data.menus).toHaveLength(4)
    expect(page.data.menus[0].name).toBe('订阅消息配置')
    expect(page.data.menus[0].path).toBe('/pages/admin/message/subscribe')
    expect(page.data.menus[1].name).toBe('消息模板管理')
    expect(page.data.menus[2].name).toBe('消息发送记录')
    expect(page.data.menus[3].name).toBe('订阅用户管理')
  })

  test('loadStats 方法存在', () => {
    expect(typeof page.loadStats).toBe('function')
  })

  test('goToMenu 跳转方法存在', () => {
    expect(typeof page.goToMenu).toBe('function')
  })

  test('sendTestMessage 方法存在', () => {
    expect(typeof page.sendTestMessage).toBe('function')
  })

  test('viewRecords 方法存在', () => {
    expect(typeof page.viewRecords).toBe('function')
  })
})
