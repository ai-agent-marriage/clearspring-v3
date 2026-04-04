/**
 * 帮助中心页面单元测试 - Day 20
 * @pages/help/index
 * 测试覆盖：页面初始化、分类筛选、搜索功能、FAQ 交互、客服功能等
 */

describe('Help Center Index Page - Day 20', () => {
  let page = null;

  beforeEach(() => {
    // 先加载页面文件，注册到 pageRegistry
    require('../pages/help/index.js');
    page = getPage('/pages/help/index');
  });

  // ==================== 页面初始化测试 (1-5) ====================

  // 1. 页面数据初始化
  test('1. 页面数据初始化正确', () => {
    expect(page.data.categories).toBeDefined();
    expect(page.data.categories).toHaveLength(4);
    expect(page.data.categories).toContain('账户问题');
    expect(page.data.categories).toContain('护生问题');
    expect(page.data.categories).toContain('支付问题');
    expect(page.data.categories).toContain('其他');
  });

  // 2. 当前分类默认为全部
  test('2. 当前分类默认为全部', () => {
    expect(page.data.currentCategory).toBe('全部');
  });

  // 3. 搜索关键词默认为空
  test('3. 搜索关键词默认为空', () => {
    expect(page.data.searchKeyword).toBe('');
  });

  // 4. FAQ 列表初始化
  test('4. FAQ 列表初始化正确', () => {
    expect(page.data.faqs).toBeDefined();
    expect(page.data.faqs.length).toBeGreaterThanOrEqual(10);
  });

  // 5. FAQ 数据结构验证
  test('5. FAQ 数据结构验证', () => {
    const faq = page.data.faqs[0];
    expect(faq.id).toBeDefined();
    expect(faq.question).toBeDefined();
    expect(faq.answer).toBeDefined();
    expect(faq.category).toBeDefined();
    expect(faq.expanded).toBe(false);
  });

  // ==================== 搜索功能测试 (6-10) ====================

  // 6. 显示搜索框默认为 false
  test('6. 显示搜索框默认为 false', () => {
    expect(page.data.showSearch).toBe(false);
  });

  // 7. 显示/隐藏搜索框
  test('7. 显示/隐藏搜索框', () => {
    page.onSearchToggle();
    expect(page.data.showSearch).toBe(true);
    
    page.onSearchToggle();
    expect(page.data.showSearch).toBe(false);
  });

  // 8. 搜索输入功能
  test('8. 搜索输入功能测试', () => {
    page.onSearchInput({ detail: { value: '注册' } });
    expect(page.data.searchKeyword).toBe('注册');
  });

  // 9. 分类筛选功能
  test('9. 分类筛选功能测试', () => {
    page.onCategoryTap({ currentTarget: { dataset: { category: '账户问题' } } });
    expect(page.data.currentCategory).toBe('账户问题');
  });

  // 10. FAQ 展开/收起
  test('10. FAQ 展开/收起功能', () => {
    page.setData({ filteredFaqs: [{ id: 1, question: '测试', answer: '答案', expanded: false }] });
    page.onFaqTap({ currentTarget: { dataset: { index: 0 } } });
    expect(page.data.filteredFaqs[0].expanded).toBe(true);
  });

  // ==================== 客服功能测试 (11-15) ====================

  // 11. 联系客服方法存在
  test('11. onContactService 方法存在', () => {
    expect(page.onContactService).toBeDefined();
    expect(typeof page.onContactService).toBe('function');
  });

  // 12. 联系客服调用 wx.showModal
  test('12. 联系客服调用 wx.showModal', () => {
    const showModalSpy = jest.spyOn(wx, 'showModal').mockImplementation();
    page.onContactService();
    expect(wx.showModal).toHaveBeenCalled();
    showModalSpy.mockRestore();
  });

  // 13. 复制微信号
  test('13. 复制微信号功能', () => {
    const setClipboardDataSpy = jest.spyOn(wx, 'setClipboardData').mockImplementation();
    const showToastSpy = jest.spyOn(wx, 'showToast').mockImplementation();
    
    wx.showModal.mockImplementation(({ success }) => {
      success({ confirm: true });
    });
    
    page.onContactService();
    
    expect(wx.setClipboardData).toHaveBeenCalledWith(
      expect.objectContaining({ data: 'qingru_service' })
    );
    
    setClipboardDataSpy.mockRestore();
    showToastSpy.mockRestore();
  });

  // 14. 分享功能方法存在
  test('14. onShareAppMessage 方法存在', () => {
    expect(page.onShareAppMessage).toBeDefined();
    expect(typeof page.onShareAppMessage).toBe('function');
  });

  // 15. 分享返回值验证
  test('15. 分享返回值验证', () => {
    const shareResult = page.onShareAppMessage();
    expect(shareResult).toBeDefined();
    expect(shareResult.title).toContain('清如');
    expect(shareResult.path).toBe('/pages/help/index');
  });

  // ==================== 筛选功能测试 (16-20) ====================

  // 16. FAQ 数量统计
  test('16. FAQ 数量统计正确', () => {
    expect(page.data.faqs.length).toBeGreaterThanOrEqual(15);
  });

  // 17. 筛选 FAQ - 按分类
  test('17. 筛选 FAQ - 按分类', () => {
    page.setData({ currentCategory: '账户问题', searchKeyword: '' });
    page.filterFaqs();
    expect(page.data.filteredFaqs).toBeDefined();
  });

  // 18. 筛选 FAQ - 按关键词
  test('18. 筛选 FAQ - 按关键词', () => {
    page.setData({ currentCategory: '全部', searchKeyword: '注册' });
    page.filterFaqs();
    expect(page.data.filteredFaqs).toBeDefined();
  });

  // 19. 搜索确认功能
  test('19. 搜索确认功能', () => {
    page.onSearchConfirm({ detail: { value: '支付' } });
    expect(page.data.searchKeyword).toBe('支付');
  });

  // 20. 页面加载生命周期
  test('20. 页面加载生命周期', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    page.onLoad();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
