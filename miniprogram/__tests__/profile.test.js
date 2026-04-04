/**
 * @file 个人中心页面测试
 * @description 测试个人中心页面的功能完整性
 */

const { setupApp, mockWx, clearMocks } = require('./setup');

describe('个人中心页面 (Profile)', () => {
  let app;
  let page;
  let mockData;

  beforeEach(() => {
    app = setupApp();
    mockWx();
    mockData = {
      userInfo: {
        avatarUrl: '/images/avatar.png',
        nickName: '测试用户',
        userId: 'test_user_001'
      },
      stats: {
        listenCount: 36,
        protectCount: 5,
        continuousDays: 7,
        certCount: 3
      }
    };
  });

  afterEach(() => {
    clearMocks();
    page = null;
  });

  describe('页面初始化', () => {
    test('页面应该成功加载', () => {
      page = app.loadPage('/pages/profile/profile');
      expect(page).toBeDefined();
      expect(page.data).toBeDefined();
    });

    test('默认数据应该正确初始化', () => {
      page = app.loadPage('/pages/profile/profile');
      expect(page.data.hasUserInfo).toBe(false);
      expect(page.data.userInfo).toBeNull();
      expect(page.data.stats).toBeDefined();
      expect(page.data.menuGroups).toBeDefined();
      expect(page.data.quickActions).toBeDefined();
    });

    test('统计数据应该包含所有必要字段', () => {
      page = app.loadPage('/pages/profile/profile');
      const stats = page.data.stats;
      expect(stats).toHaveProperty('listenCount');
      expect(stats).toHaveProperty('protectCount');
      expect(stats).toHaveProperty('continuousDays');
      expect(stats).toHaveProperty('certCount');
    });

    test('功能菜单应该正确分组', () => {
      page = app.loadPage('/pages/profile/profile');
      const menuGroups = page.data.menuGroups;
      expect(menuGroups.length).toBeGreaterThan(0);
      menuGroups.forEach(group => {
        expect(group).toHaveProperty('title');
        expect(group).toHaveProperty('items');
        expect(Array.isArray(group.items)).toBe(true);
      });
    });

    test('快捷操作应该包含所有必要信息', () => {
      page = app.loadPage('/pages/profile/profile');
      const quickActions = page.data.quickActions;
      expect(quickActions.length).toBe(4);
      quickActions.forEach(action => {
        expect(action).toHaveProperty('icon');
        expect(action).toHaveProperty('name');
        expect(action).toHaveProperty('path');
        expect(action).toHaveProperty('color');
      });
    });
  });

  describe('用户登录功能', () => {
    test('登录成功应该更新用户信息', () => {
      page = app.loadPage('/pages/profile/profile');
      
      const mockUserInfo = mockData.userInfo;
      wx.getUserProfile.mockImplementation(({ success }) => {
        success({ userInfo: mockUserInfo });
      });

      page.login();

      expect(wx.getUserProfile).toHaveBeenCalled();
      expect(wx.setStorageSync).toHaveBeenCalledWith('userInfo', mockUserInfo);
      expect(page.data.hasUserInfo).toBe(true);
      expect(page.data.nickname).toBe(mockUserInfo.nickName);
    });

    test('登录失败应该显示提示', () => {
      page = app.loadPage('/pages/profile/profile');
      
      wx.getUserProfile.mockImplementation(({ fail }) => {
        fail(new Error('用户取消'));
      });

      page.login();

      expect(wx.getUserProfile).toHaveBeenCalled();
      expect(wx.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '取消登录',
          icon: 'none'
        })
      );
    });

    test('检查登录状态应该读取本地缓存', () => {
      wx.getStorageSync.mockReturnValue(mockData.userInfo);
      
      page = app.loadPage('/pages/profile/profile');
      page.checkLoginStatus();

      expect(wx.getStorageSync).toHaveBeenCalledWith('userInfo');
      expect(page.data.hasUserInfo).toBe(true);
    });
  });

  describe('数据统计功能', () => {
    test('加载统计数据应该优先使用本地缓存', () => {
      wx.getStorageSync.mockReturnValue(mockData.stats);
      
      page = app.loadPage('/pages/profile/profile');
      page.loadStats();

      expect(wx.getStorageSync).toHaveBeenCalledWith('userStats');
      expect(page.data.stats).toEqual(mockData.stats);
    });

    test('没有缓存时应该使用默认数据', () => {
      wx.getStorageSync.mockReturnValue(null);
      
      page = app.loadPage('/pages/profile/profile');
      page.loadStats();

      expect(page.data.stats.listenCount).toBe(36);
      expect(page.data.stats.protectCount).toBe(5);
      expect(page.data.stats.continuousDays).toBe(7);
      expect(page.data.stats.certCount).toBe(3);
    });

    test('页面显示时应该刷新统计数据', () => {
      wx.getStorageSync.mockReturnValueOnce(null).mockReturnValueOnce(mockData.stats);
      
      page = app.loadPage('/pages/profile/profile');
      page.onShow();

      expect(wx.getStorageSync).toHaveBeenCalledWith('userStats');
    });
  });

  describe('导航功能', () => {
    test('点击菜单项应该跳转到对应页面', () => {
      page = app.loadPage('/pages/profile/profile');
      
      const mockItem = { name: '我的收听', path: '/pages/profile/listen' };
      page.navigateTo({
        currentTarget: {
          dataset: { item: mockItem }
        }
      });

      expect(wx.navigateTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: mockItem.path
        })
      );
    });

    test('没有路径的菜单项应该显示即将开放', () => {
      page = app.loadPage('/pages/profile/profile');
      
      const mockItem = { name: '测试功能', path: '' };
      page.navigateTo({
        currentTarget: {
          dataset: { item: mockItem }
        }
      });

      expect(wx.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '即将开放',
          icon: 'none'
        })
      );
    });

    test('跳转失败应该显示提示', () => {
      page = app.loadPage('/pages/profile/profile');
      
      wx.navigateTo.mockImplementation(({ fail }) => {
        fail(new Error('页面不存在'));
      });

      const mockItem = { name: '测试功能', path: '/pages/nonexistent' };
      page.navigateTo({
        currentTarget: {
          dataset: { item: mockItem }
        }
      });

      expect(wx.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '即将开放',
          icon: 'none'
        })
      );
    });
  });

  describe('快捷操作', () => {
    test('点击快捷操作应该跳转到对应页面', () => {
      page = app.loadPage('/pages/profile/profile');
      
      const mockAction = { name: '一键放生', path: '/pages/protect/register' };
      page.onQuickActionTap({
        currentTarget: {
          dataset: { action: mockAction }
        }
      });

      expect(wx.navigateTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: mockAction.path
        })
      );
    });

    test('快捷操作跳转失败应该显示提示', () => {
      page = app.loadPage('/pages/profile/profile');
      
      wx.navigateTo.mockImplementation(({ fail }) => {
        fail(new Error('页面不存在'));
      });

      const mockAction = { name: '测试功能', path: '/pages/nonexistent' };
      page.onQuickActionTap({
        currentTarget: {
          dataset: { action: mockAction }
        }
      });

      expect(wx.showToast).toHaveBeenCalled();
    });
  });

  describe('图表功能', () => {
    test('切换图表应该改变显示状态', () => {
      page = app.loadPage('/pages/profile/profile');
      
      expect(page.data.showChart).toBe(false);
      
      page.toggleChart();
      expect(page.data.showChart).toBe(true);
      
      page.toggleChart();
      expect(page.data.showChart).toBe(false);
    });

    test('趋势数据应该包含日期和数值', () => {
      page = app.loadPage('/pages/profile/profile');
      const trendData = page.data.trendData;
      
      expect(trendData.dates).toHaveLength(7);
      expect(trendData.meritValues).toHaveLength(7);
      expect(trendData.protectValues).toHaveLength(7);
    });
  });

  describe('其他功能', () => {
    test('联系客服应该调用电话功能', () => {
      page = app.loadPage('/pages/profile/profile');
      page.contactUs();

      expect(wx.makePhoneCall).toHaveBeenCalledWith(
        expect.objectContaining({
          phoneNumber: '400-xxx-xxxx'
        })
      );
    });

    test('关于我们应该显示弹窗', () => {
      page = app.loadPage('/pages/profile/profile');
      page.aboutUs();

      expect(wx.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '关于清如 ClearSpring',
          showCancel: false
        })
      );
    });

    test('分享应该返回正确的分享数据', () => {
      page = app.loadPage('/pages/profile/profile');
      const shareData = page.onShareAppMessage();

      expect(shareData.title).toContain('我的修行记录');
      expect(shareData.path).toBe('/pages/profile/profile');
    });
  });

  describe('数据验证', () => {
    test('统计数据应该是正整数', () => {
      page = app.loadPage('/pages/profile/profile');
      const stats = page.data.stats;
      
      expect(Number.isInteger(stats.listenCount)).toBe(true);
      expect(stats.listenCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(stats.protectCount)).toBe(true);
      expect(stats.protectCount).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(stats.continuousDays)).toBe(true);
      expect(stats.continuousDays).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(stats.certCount)).toBe(true);
      expect(stats.certCount).toBeGreaterThanOrEqual(0);
    });

    test('菜单项路径应该是有效的字符串', () => {
      page = app.loadPage('/pages/profile/profile');
      
      page.data.menuGroups.forEach(group => {
        group.items.forEach(item => {
          expect(typeof item.path).toBe('string');
          if (item.path) {
            expect(item.path.startsWith('/')).toBe(true);
          }
        });
      });
    });
  });
});
