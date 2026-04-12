/**
 * Q-19 证书详情页测试用例
 * 文件：__tests__/q-19-certificate-detail.test.js
 */

describe('Q-19 证书详情页测试', () => {
  beforeEach(() => {
    wx.clearStorageSync();
  });

  test('1. 页面正常加载', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    expect(page).toBeDefined();
    expect(page.data.certificate.certNo).toBe('CR-2026-001234');
  });

  test('2. 加载证书详情', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    page.loadCertificate('CERT001');
    expect(page.data.certificate.certNo).toBeDefined();
  });

  test('3. 证书信息完整', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    
    expect(page.data.certificate).toHaveProperty('certNo');
    expect(page.data.certificate).toHaveProperty('recipientName');
    expect(page.data.certificate).toHaveProperty('title');
    expect(page.data.certificate).toHaveProperty('speciesName');
    expect(page.data.certificate).toHaveProperty('amount');
  });

  test('4. 保护成果数据', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    
    expect(page.data.achievement.protectedArea).toBe('1200');
    expect(page.data.achievement.trackedCount).toBe('15');
    expect(page.data.achievement.dataCount).toBe('3680');
    expect(page.data.achievement.volunteerCount).toBe('256');
  });

  test('5. 下载证书', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    page.downloadCertificate();
    expect(wx.showLoading).toHaveBeenCalled();
  });

  test('6. 分享证书', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    page.shareCertificate();
    expect(wx.showShareMenu).toHaveBeenCalled();
  });

  test('7. 显示更多选项', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    page.showMore();
    expect(wx.showActionSheet).toHaveBeenCalled();
  });

  test('8. 相关证书点击', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    page.onRelatedTap({ currentTarget: { dataset: { id: 'CERT002' } } });
    expect(wx.navigateTo).toHaveBeenCalled();
  });

  test('9. 返回功能', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    page.goBack();
    expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 1 });
  });

  test('10. 页面分享', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    const shareMessage = page.onShareAppMessage();
    
    expect(shareMessage.title).toContain('保护证书');
    expect(shareMessage.path).toContain('certId');
  });

  test('11. 证书状态显示', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    expect(page.data.certificate.statusText).toBe('有效');
    expect(page.data.certificate.statusClass).toBe('valid');
  });

  test('12. 功德数显示', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    expect(page.data.certificate.meritCount).toBe('520');
  });

  test('13. 影响人数显示', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    expect(page.data.certificate.impactCount).toBe('1280');
  });

  test('14. 证书有效期', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    expect(page.data.certificate.validUntil).toBe('2027-04-11');
  });

  test('15. 页面渲染完成', () => {
    const page = getInstance('/pages/q-19-certificate-detail/q-19-certificate-detail');
    const consoleSpy = jest.spyOn(console, 'log');
    
    page.onReady();
    expect(consoleSpy).toHaveBeenCalledWith('Q-19 证书详情页渲染完成');
    consoleSpy.mockRestore();
  });
});
