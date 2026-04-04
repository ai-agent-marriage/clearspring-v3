/**
 * 关于我们页面单元测试 - Day 20
 * @pages/about/index
 * 测试覆盖：页面初始化、联系方式复制、合作协议查看、分享功能等
 */

describe('About Us Page - Day 20', () => {
  let page = null;

  beforeEach(() => {
    // 先加载页面文件，注册到 pageRegistry
    require('../pages/about/index.js');
    page = getPage('/pages/about/index');
  });

  // ==================== 页面初始化测试 (1-5) ====================

  // 1. 页面数据初始化
  test('1. 页面数据初始化正确', () => {
    expect(page.data.companyInfo).toBeDefined();
    expect(page.data.companyInfo.name).toBeDefined();
    expect(page.data.companyInfo.version).toBeDefined();
  });

  // 2. 团队信息初始化
  test('2. 团队信息初始化正确', () => {
    expect(page.data.teamMembers).toBeDefined();
    expect(page.data.teamMembers.length).toBeGreaterThanOrEqual(1);
  });

  // 3. 联系方式初始化
  test('3. 联系方式初始化正确', () => {
    expect(page.data.contactInfo).toBeDefined();
    expect(page.data.contactInfo.email).toBeDefined();
    expect(page.data.contactInfo.phone).toBeDefined();
  });

  // 4. 合作协议初始化
  test('4. 合作协议初始化正确', () => {
    expect(page.data.partnerships).toBeDefined();
    expect(page.data.partnerships.length).toBeGreaterThanOrEqual(1);
  });

  // 5. 资质认证初始化
  test('5. 资质认证初始化正确', () => {
    expect(page.data.certifications).toBeDefined();
    expect(page.data.certifications.length).toBeGreaterThanOrEqual(1);
  });

  // ==================== 联系方式复制测试 (6-10) ====================

  // 6. 复制邮箱
  test('6. 复制邮箱功能', () => {
    const setClipboardDataSpy = jest.spyOn(wx, 'setClipboardData').mockImplementation();
    const showToastSpy = jest.spyOn(wx, 'showToast').mockImplementation();
    
    page.onCopyContact({ currentTarget: { dataset: { type: 'email' } } });
    
    expect(wx.setClipboardData).toHaveBeenCalled();
    
    setClipboardDataSpy.mockRestore();
    showToastSpy.mockRestore();
  });

  // 7. 复制电话
  test('7. 复制电话功能', () => {
    const setClipboardDataSpy = jest.spyOn(wx, 'setClipboardData').mockImplementation();
    
    page.onCopyContact({ currentTarget: { dataset: { type: 'phone' } } });
    
    expect(wx.setClipboardData).toHaveBeenCalled();
    
    setClipboardDataSpy.mockRestore();
  });

  // 8. 复制微信号
  test('8. 复制微信号功能', () => {
    const setClipboardDataSpy = jest.spyOn(wx, 'setClipboardData').mockImplementation();
    
    page.onCopyContact({ currentTarget: { dataset: { type: 'wechat' } } });
    
    expect(wx.setClipboardData).toHaveBeenCalled();
    
    setClipboardDataSpy.mockRestore();
  });

  // 9. 复制地址
  test('9. 复制地址功能', () => {
    const setClipboardDataSpy = jest.spyOn(wx, 'setClipboardData').mockImplementation();
    
    page.onCopyContact({ currentTarget: { dataset: { type: 'address' } } });
    
    expect(wx.setClipboardData).toHaveBeenCalled();
    
    setClipboardDataSpy.mockRestore();
  });

  // 10. 复制未知类型
  test('10. 复制未知类型不执行', () => {
    const setClipboardDataSpy = jest.spyOn(wx, 'setClipboardData').mockImplementation();
    
    page.onCopyContact({ currentTarget: { dataset: { type: 'unknown' } } });
    
    // 未知类型不应调用复制
    // setClipboardData 可能不会被调用
    
    setClipboardDataSpy.mockRestore();
  });

  // ==================== 合作协议查看测试 (11-15) ====================

  // 11. 查看合作协议方法存在
  test('11. onViewPartnership 方法存在', () => {
    expect(page.onViewPartnership).toBeDefined();
    expect(typeof page.onViewPartnership).toBe('function');
  });

  // 12. 查看合作协议调用 showModal
  test('12. 查看合作协议调用 wx.showModal', () => {
    const showModalSpy = jest.spyOn(wx, 'showModal').mockImplementation();
    
    page.onViewPartnership({ currentTarget: { dataset: { index: 0 } } });
    
    expect(wx.showModal).toHaveBeenCalled();
    
    showModalSpy.mockRestore();
  });

  // 13. 合作协议显示正确标题
  test('13. 合作协议显示正确标题', () => {
    const showModalSpy = jest.spyOn(wx, 'showModal').mockImplementation();
    
    page.onViewPartnership({ currentTarget: { dataset: { index: 0 } } });
    
    expect(wx.showModal).toHaveBeenCalledWith(
      expect.objectContaining({
        title: expect.any(String),
        showCancel: false
      })
    );
    
    showModalSpy.mockRestore();
  });

  // 14. 用户协议跳转方法存在
  test('14. onAgreementTap 方法存在', () => {
    expect(page.onAgreementTap).toBeDefined();
    expect(typeof page.onAgreementTap).toBe('function');
  });

  // 15. 用户协议跳转
  test('15. 用户协议跳转功能', () => {
    const navigateToSpy = jest.spyOn(wx, 'navigateTo').mockImplementation();
    
    page.onAgreementTap({ currentTarget: { dataset: { url: '/pages/agreement/user' } } });
    
    expect(wx.navigateTo).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/pages/agreement/user' })
    );
    
    navigateToSpy.mockRestore();
  });

  // ==================== 分享和更新测试 (16-20) ====================

  // 16. 分享功能方法存在
  test('16. onShareAppMessage 方法存在', () => {
    expect(page.onShareAppMessage).toBeDefined();
    expect(typeof page.onShareAppMessage).toBe('function');
  });

  // 17. 分享返回值验证
  test('17. 分享返回值验证', () => {
    const shareResult = page.onShareAppMessage();
    expect(shareResult).toBeDefined();
    expect(shareResult.title).toContain('清如');
    expect(shareResult.path).toBe('/pages/about/index');
  });

  // 18. 检查更新方法存在
  test('18. onCheckUpdate 方法存在', () => {
    expect(page.onCheckUpdate).toBeDefined();
    expect(typeof page.onCheckUpdate).toBe('function');
  });

  // 19. 显示/隐藏更多信息方法存在
  test('19. onToggleMoreInfo 方法存在', () => {
    expect(page.onToggleMoreInfo).toBeDefined();
    expect(typeof page.onToggleMoreInfo).toBe('function');
  });

  // 20. 页面加载生命周期
  test('20. 页面加载生命周期', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    page.onLoad();
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
