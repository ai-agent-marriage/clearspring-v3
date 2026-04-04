/**
 * 消息记录页面单元测试
 * @pages/admin/message/records
 */

describe('Message Records Page', () => {
  let page = null

  beforeEach(() => {
    page = getCurrentPages()[0]
  })

  test('页面数据初始化正确', () => {
    expect(page.data.showFilter).toBe(false)
    expect(page.data.filterDateRange).toBe('近 7 天')
    expect(page.data.filterType).toBe('all')
    expect(page.data.filterStatus).toBe('all')
  })

  test('消息记录列表配置正确', () => {
    expect(page.data.records).toBeDefined()
    expect(page.data.records.length).toBeGreaterThan(0)
  })

  test('第一条记录数据正确', () => {
    const record = page.data.records[0]
    expect(record.title).toBe('订单创建通知')
    expect(record.recipient).toBe('张三')
    expect(record.status).toBe(1)
    expect(record.statusName).toBe('成功')
  })

  test('日期范围选项配置正确', () => {
    expect(page.data.dateRangeOptions).toHaveLength(3)
    expect(page.data.dateRangeOptions).toContain('近 7 天')
    expect(page.data.dateRangeOptions).toContain('近 30 天')
    expect(page.data.dateRangeOptions).toContain('自定义')
  })

  test('消息类型选项配置正确', () => {
    expect(page.data.typeOptions).toHaveLength(3)
    expect(page.data.typeOptions[0].value).toBe('all')
    expect(page.data.typeOptions[1].value).toBe('order')
  })

  test('发送状态选项配置正确', () => {
    expect(page.data.statusOptions).toHaveLength(3)
    expect(page.data.statusOptions[0].value).toBe('all')
    expect(page.data.statusOptions[1].value).toBe('success')
    expect(page.data.statusOptions[2].value).toBe('failed')
  })

  test('loadRecords 方法存在', () => {
    expect(typeof page.loadRecords).toBe('function')
  })

  test('toggleFilter 方法存在', () => {
    expect(typeof page.toggleFilter).toBe('function')
  })

  test('onDateRangeChange 方法存在', () => {
    expect(typeof page.onDateRangeChange).toBe('function')
  })

  test('onTypeChange 方法存在', () => {
    expect(typeof page.onTypeChange).toBe('function')
  })

  test('onStatusChange 方法存在', () => {
    expect(typeof page.onStatusChange).toBe('function')
  })

  test('applyFilter 方法存在', () => {
    expect(typeof page.applyFilter).toBe('function')
  })

  test('resetFilter 方法存在', () => {
    expect(typeof page.resetFilter).toBe('function')
  })

  test('viewDetail 方法存在', () => {
    expect(typeof page.viewDetail).toBe('function')
  })

  test('resend 方法存在', () => {
    expect(typeof page.resend).toBe('function')
  })

  test('exportData 方法存在', () => {
    expect(typeof page.exportData).toBe('function')
  })
})
