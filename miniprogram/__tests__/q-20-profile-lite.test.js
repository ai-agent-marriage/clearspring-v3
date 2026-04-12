/**
 * Q-20 免注册个人中心测试用例
 * 文件：__tests__/q-20-profile-lite.test.js
 */

describe('Q-20 免注册个人中心测试', () => {
  beforeEach(() => {
    wx.clearStorageSync();
  });

  test('1. 页面正常加载', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    expect(page).toBeDefined();
    expect(page.data.userInfo.isLoggedIn).toBe(false);
  });

  test('2. 加载用户信息 - 未登录', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.loadUserInfo();
    
    expect(page.data.userInfo.isLoggedIn).toBe(false);
    expect(page.data.userInfo.nickname).toBe('');
  });

  test('3. 加载用户信息 - 已登录', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    wx.setStorageSync('userInfo', {
      avatar: '/avatar.png',
      nickname: '测试用户',
      userId: 'USER001'
    });
    
    page.loadUserInfo();
    expect(page.data.userInfo.isLoggedIn).toBe(true);
    expect(page.data.userInfo.nickname).toBe('测试用户');
  });

  test('4. 加载统计数据', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    wx.setStorageSync('userStats', {
      meritCount: '1000',
      orderCount: '5',
      certificateCount: '3',
      favoriteCount: '10'
    });
    
    page.loadStats();
    expect(page.data.stats.meritCount).toBe('1000');
  });

  test('5. 刷新数据', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    const loadUserSpy = jest.spyOn(page, 'loadUserInfo');
    const loadStatsSpy = jest.spyOn(page, 'loadStats');
    
    page.refreshData();
    expect(loadUserSpy).toHaveBeenCalled();
    expect(loadStatsSpy).toHaveBeenCalled();
    
    loadUserSpy.mockRestore();
    loadStatsSpy.mockRestore();
  });

  test('6. 头像点击 - 未登录', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onAvatarTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/login'
    });
  });

  test('7. 登录按钮点击', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onLoginTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/login/login'
    });
  });

  test('8. 功德统计点击', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onMeritTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/merit-forest/index'
    });
  });

  test('9. 订单统计点击', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onOrderTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/order/list'
    });
  });

  test('10. 证书统计点击', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onCertificateTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/q-18-certificate-list/q-18-certificate-list'
    });
  });

  test('11. 订单状态筛选', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    
    page.onOrderStatusTap({ currentTarget: { dataset: { status: 'completed' } } });
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/order/list?status=completed'
    });
  });

  test('12. 梵音播放入口', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onAudioTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/q-03-audio-home/q-03-audio-home'
    });
  });

  test('13. 禅理收藏入口', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onZenTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/q-05-zen-home/q-05-zen-home'
    });
  });

  test('14. 帮助中心入口', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onHelpTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/help/index'
    });
  });

  test('15. 设置入口', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    page.onSettingsTap();
    expect(wx.navigateTo).toHaveBeenCalledWith({
      url: '/pages/q-25-settings/q-25-settings'
    });
  });

  test('16. 页面分享', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    const shareMessage = page.onShareAppMessage();
    
    expect(shareMessage.title).toContain('个人中心');
    expect(shareMessage.path).toBe('/pages/q-20-profile-lite/q-20-profile-lite');
  });

  test('17. 页面渲染完成', () => {
    const page = getInstance('/pages/q-20-profile-lite/q-20-profile-lite');
    const consoleSpy = jest.spyOn(console, 'log');
    
    page.onReady();
    expect(consoleSpy).toHaveBeenCalledWith('Q-20 免注册个人中心渲染完成');
    consoleSpy.mockRestore();
  });
});
