/**
 * 反馈管理页面单元测试
 * @pages/admin/feedback/manage
 */

describe('Feedback Manage Page', () => {
  let page = null;

  beforeEach(() => {
    page = getPage('/pages/admin/feedback/manage');
  });

  test('页面筛选数据初始化正确', () => {
    expect(page.data.showFilter).toBeDefined();
    expect(page.data.filterType).toBeDefined();
    expect(page.data.filterStatus).toBeDefined();
  });

  test('反馈列表初始化有数据', () => {
    expect(page.data.feedbackList).toBeDefined();
    expect(page.data.feedbackList.length).toBeGreaterThan(0);
  });

  test('反馈类型筛选列表配置正确', () => {
    expect(page.data.filterTypes).toBeDefined();
    expect(Array.isArray(page.data.filterTypes)).toBe(true);
  });

  test('处理状态筛选列表配置正确', () => {
    expect(page.data.filterStatuses).toBeDefined();
    expect(Array.isArray(page.data.filterStatuses)).toBe(true);
  });

  test('loadFeedbackList 方法存在', () => {
    expect(typeof page.loadFeedbackList).toBe('function');
  });

  test('onToggleFilter 方法存在', () => {
    expect(typeof page.onToggleFilter).toBe('function');
  });

  test('onTypeChange 方法存在', () => {
    expect(typeof page.onTypeChange).toBe('function');
  });

  test('onStatusChange 方法存在', () => {
    expect(typeof page.onStatusChange).toBe('function');
  });

  test('onViewDetail 方法存在', () => {
    expect(typeof page.onViewDetail).toBe('function');
  });

  test('onProcess 方法存在', () => {
    expect(typeof page.onProcess).toBe('function');
  });

  test('onReply 方法存在', () => {
    expect(typeof page.onReply).toBe('function');
  });

  test('onExport 方法存在', () => {
    expect(typeof page.onExport).toBe('function');
  });

  test('onResetFilter 方法存在', () => {
    expect(typeof page.onResetFilter).toBe('function');
  });

  test('切换筛选栏显示状态', () => {
    const initialShowFilter = page.data.showFilter;
    page.onToggleFilter();
    expect(page.data.showFilter).toBe(!initialShowFilter);
  });

  test('反馈列表项结构完整', () => {
    const firstItem = page.data.feedbackList[0];
    expect(firstItem.id).toBeDefined();
    expect(firstItem.type).toBeDefined();
    expect(firstItem.typeName).toBeDefined();
    expect(firstItem.title).toBeDefined();
    expect(firstItem.submitTime).toBeDefined();
    expect(firstItem.status).toBeDefined();
    expect(firstItem.statusName).toBeDefined();
  });

  test('待处理反馈数量统计正确', () => {
    const pendingCount = page.data.feedbackList.filter(
      item => item.status === 1
    ).length;
    expect(pendingCount).toBeGreaterThan(0);
  });

  test('已处理反馈数量统计正确', () => {
    const processedCount = page.data.feedbackList.filter(
      item => item.status === 2
    ).length;
    expect(processedCount).toBeGreaterThan(0);
  });
});
