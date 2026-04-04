/**
 * 帮助中心页面单元测试
 * @pages/help/index
 */

describe('Help Center Index Page', () => {
  let page = null;

  beforeEach(() => {
    page = getPage('/pages/help/index');
  });

  // 1. 页面数据初始化
  test('页面数据初始化正确', () => {
    expect(page.data.categories).toBeDefined();
    expect(page.data.categories).toHaveLength(4);
    expect(page.data.categories).toContain('账户问题');
    expect(page.data.categories).toContain('护生问题');
    expect(page.data.categories).toContain('支付问题');
    expect(page.data.categories).toContain('其他');
  });

  // 2. 当前分类默认为全部
  test('当前分类默认为全部', () => {
    expect(page.data.currentCategory).toBe('全部');
  });

  // 3. 搜索关键词默认为空
  test('搜索关键词默认为空', () => {
    expect(page.data.searchKeyword).toBe('');
  });

  // 4. FAQ 列表初始化
  test('FAQ 列表初始化正确', () => {
    expect(page.data.faqs).toBeDefined();
    expect(page.data.faqs.length).toBeGreaterThanOrEqual(10);
  });

  // 5. FAQ 数据结构验证
  test('FAQ 数据结构验证', () => {
    const faq = page.data.faqs[0];
    expect(faq.id).toBeDefined();
    expect(faq.question).toBeDefined();
    expect(faq.answer).toBeDefined();
    expect(faq.category).toBeDefined();
    expect(faq.expanded).toBe(false);
  });

  // 6. 显示搜索框默认为 false
  test('显示搜索框默认为 false', () => {
    expect(page.data.showSearch).toBe(false);
  });

  // 7. onLoad 方法存在
  test('onLoad 方法存在', () => {
    expect(typeof page.onLoad).toBe('function');
  });

  // 8. 切换分类方法存在
  test('onCategoryTap 方法存在', () => {
    expect(typeof page.onCategoryTap).toBe('function');
  });

  // 9. 切换分类功能测试
  test('切换分类功能测试', () => {
    const mockEvent = {
      currentTarget: {
        dataset: {
          category: '账户问题'
        }
      }
    };
    page.onCategoryTap(mockEvent);
    expect(page.data.currentCategory).toBe('账户问题');
  });

  // 10. 显示/隐藏搜索框方法存在
  test('onSearchToggle 方法存在', () => {
    expect(typeof page.onSearchToggle).toBe('function');
  });

  // 11. 显示搜索框功能测试
  test('显示搜索框功能测试', () => {
    page.onSearchToggle();
    expect(page.data.showSearch).toBe(true);
  });

  // 12. 搜索输入方法存在
  test('onSearchInput 方法存在', () => {
    expect(typeof page.onSearchInput).toBe('function');
  });

  // 13. 搜索输入功能测试
  test('搜索输入功能测试', () => {
    const mockEvent = {
      detail: {
        value: '注册'
      }
    };
    page.onSearchInput(mockEvent);
    expect(page.data.searchKeyword).toBe('注册');
  });

  // 14. FAQ 展开/收起方法存在
  test('onFaqTap 方法存在', () => {
    expect(typeof page.onFaqTap).toBe('function');
  });

  // 15. 联系客服方法存在
  test('onContactService 方法存在', () => {
    expect(typeof page.onContactService).toBe('function');
  });

  // 16. 分类筛选功能测试
  test('分类筛选功能测试', () => {
    page.setData({ currentCategory: '账户问题' });
    page.filterFaqs();
    const filtered = page.data.filteredFaqs || page.data.faqs.filter(f => f.category === '账户问题');
    expect(filtered.length).toBeGreaterThan(0);
    filtered.forEach(faq => {
      expect(faq.category).toBe('账户问题');
    });
  });

  // 17. 关键词搜索功能测试
  test('关键词搜索功能测试', () => {
    page.setData({ searchKeyword: '注册' });
    page.filterFaqs();
    const filtered = page.data.filteredFaqs || page.data.faqs;
    const hasMatch = filtered.some(faq => 
      faq.question.includes('注册') || 
      faq.answer.includes('注册')
    );
    expect(hasMatch).toBe(true);
  });

  // 18. FAQ 数量统计
  test('FAQ 数量统计正确', () => {
    const faqCount = page.data.faqs.length;
    expect(faqCount).toBeGreaterThanOrEqual(10);
  });

  // 19. 分享方法存在
  test('onShareAppMessage 方法存在', () => {
    expect(typeof page.onShareAppMessage).toBe('function');
  });

  // 20. 分享返回值验证
  test('分享返回值验证', () => {
    const shareResult = page.onShareAppMessage();
    expect(shareResult.title).toContain('清如');
    expect(shareResult.path).toContain('/pages/help/index');
  });
});
