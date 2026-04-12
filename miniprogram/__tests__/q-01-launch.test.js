/**
 * Q-01 启动页测试用例
 * 文件：__tests__/q-01-launch.test.js
 */

describe('Q-01 启动页测试', () => {
  beforeEach(() => {
    // 清理缓存
    wx.clearStorageSync();
  });

  test('1. 页面正常加载', () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    expect(page).toBeDefined();
    expect(page.data.version).toBe('3.0.0');
  });

  test('2. 版本号显示正确', () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    page.getVersionInfo();
    expect(page.data.version).toMatch(/^\d+\.\d+\.\d+$/);
  });

  test('3. 未登录状态跳转首页', async () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    wx.setStorageSync('token', '');
    
    await page.initializeApp();
    expect(wx.switchTab).toHaveBeenCalled();
  });

  test('4. 已登录状态跳转首页', async () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    wx.setStorageSync('token', 'test-token');
    wx.setStorageSync('userInfo', { nickname: '测试用户' });
    
    await page.initializeApp();
    expect(wx.switchTab).toHaveBeenCalled();
  });

  test('5. 加载用户数据成功', async () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    const userInfo = { nickname: '测试用户', avatar: '/avatar.png' };
    wx.setStorageSync('userInfo', userInfo);
    
    await page.loadUserData();
    expect(getApp().globalData.userInfo).toEqual(userInfo);
  });

  test('6. 数据预加载功能', async () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    await page.preloadData();
    // 预加载不应抛出异常
    expect(true).toBe(true);
  });

  test('7. 页面生命周期 - onReady', () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    const consoleSpy = jest.spyOn(console, 'log');
    
    page.onReady();
    expect(consoleSpy).toHaveBeenCalledWith('Q-01 启动页渲染完成');
    consoleSpy.mockRestore();
  });

  test('8. 页面生命周期 - onShow', () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    expect(() => page.onShow()).not.toThrow();
  });

  test('9. 页面生命周期 - onHide', () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    expect(() => page.onHide()).not.toThrow();
  });

  test('10. 页面生命周期 - onUnload', () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    expect(() => page.onUnload()).not.toThrow();
  });

  test('11. 初始化失败处理', async () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    
    // 模拟错误
    const originalCheckLogin = page.checkLoginStatus;
    page.checkLoginStatus = jest.fn(() => Promise.reject(new Error('测试错误')));
    
    await page.initializeApp();
    // 即使出错也应该跳转
    expect(wx.switchTab).toHaveBeenCalled();
    
    page.checkLoginStatus = originalCheckLogin;
  });

  test('12. 跳转失败处理', async () => {
    const page = getInstance('/pages/q-01-launch/q-01-launch');
    
    wx.switchTab.mockImplementationOnce(() => {
      throw new Error('跳转失败');
    });
    
    await page.navigateToHome(true);
    // 应该调用 reLaunch 作为降级方案
    expect(wx.reLaunch).toHaveBeenCalled();
  });
});
