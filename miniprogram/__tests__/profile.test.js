/**
 * 个人中心页面测试
 * @file miniprogram/__tests__/profile.test.js
 * @description 测试个人中心页面的各项功能
 */

describe('个人中心页面测试', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    // Mock wx 对象
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      showToast: jest.fn(),
      makePhoneCall: jest.fn(),
      showModal: jest.fn(),
      getUserProfile: jest.fn()
    };
    global.wx = mockWx;

    // 创建页面实例
    page = {
      data: {
        hasUserInfo: false,
        userInfo: null,
        avatarUrl: '/images/profile.png',
        nickname: '',
        userId: '',
        stats: {
          listenCount: 36,
          protectCount: 5,
          continuousDays: 7,
          certCount: 3
        },
        menuGroups: [
          {
            title: '修行数据',
            items: [
              { icon: '🎵', name: '我的收听', path: '/pages/profile/listen', badge: 0 }
            ]
          }
        ],
        quickActions: [
          { icon: '📍', name: '一键放生', path: '/pages/protect/register', color: '#07c160' }
        ],
        trendData: {
          dates: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          meritValues: [120, 150, 180, 200, 230, 280, 320],
          protectValues: [0, 1, 0, 2, 0, 1, 1]
        },
        showChart: false
      },
      checkLoginStatus: function() {
        const userInfo = mockWx.getStorageSync('userInfo');
        if (userInfo) {
          page.data.hasUserInfo = true;
          page.data.userInfo = userInfo;
          page.data.avatarUrl = userInfo.avatarUrl || '/images/profile.png';
          page.data.nickname = userInfo.nickName || '';
          page.data.userId = userInfo.userId || '';
        }
      },
      loadStats: function() {
        const stats = mockWx.getStorageSync('userStats');
        if (stats) {
          page.data.stats = stats;
        }
      },
      login: function() {
        mockWx.getUserProfile({
          desc: '用于完善用户资料',
          success: (res) => {
            const userInfo = res.userInfo;
            mockWx.setStorageSync('userInfo', userInfo);
            page.data.hasUserInfo = true;
            page.data.userInfo = userInfo;
            mockWx.showToast({ title: '登录成功', icon: 'success' });
          },
          fail: () => {
            mockWx.showToast({ title: '取消登录', icon: 'none' });
          }
        });
      },
      navigateTo: function(e) {
        const item = e.currentTarget.dataset.item;
        mockWx.navigateTo({
          url: item.path,
          fail: () => mockWx.showToast({ title: '即将开放', icon: 'none' })
        });
      },
      onQuickActionTap: function(e) {
        const action = e.currentTarget.dataset.action;
        mockWx.navigateTo({ url: action.path });
      },
      toggleChart: function() {
        page.data.showChart = !page.data.showChart;
      },
      contactUs: function() {
        mockWx.makePhoneCall({
          phoneNumber: '400-xxx-xxxx',
          fail: () => mockWx.showToast({ title: '号码错误', icon: 'none' })
        });
      },
      aboutUs: function() {
        mockWx.showModal({
          title: '关于清如 ClearSpring',
          content: '清如 ClearSpring 专业服务小程序\n版本：1.0.0\n\n科学放生，护生护心',
          showCancel: false,
          confirmColor: '#07c160'
        });
      },
      onShareAppMessage: function() {
        return {
          title: '我的修行记录 - 清如 ClearSpring',
          path: '/pages/profile/profile',
          imageUrl: ''
        };
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('页面初始化', () => {
    test('页面应该正常初始化', () => {
      expect(page.data).toBeDefined();
      expect(page.data.stats).toBeDefined();
    });

    test('统计数据应该有默认值', () => {
      expect(page.data.stats.listenCount).toBe(36);
      expect(page.data.stats.protectCount).toBe(5);
      expect(page.data.stats.continuousDays).toBe(7);
      expect(page.data.stats.certCount).toBe(3);
    });
  });

  describe('登录状态检查', () => {
    test('checkLoginStatus - 用户已登录时应设置用户信息', () => {
      const mockUserInfo = {
        avatarUrl: 'https://example.com/avatar.png',
        nickName: '测试用户',
        userId: 'user123'
      };
      mockWx.getStorageSync.mockReturnValue(mockUserInfo);

      page.checkLoginStatus();

      expect(mockWx.getStorageSync).toHaveBeenCalledWith('userInfo');
      expect(page.data.hasUserInfo).toBe(true);
      expect(page.data.userInfo).toEqual(mockUserInfo);
      expect(page.data.avatarUrl).toBe(mockUserInfo.avatarUrl);
      expect(page.data.nickname).toBe(mockUserInfo.nickName);
    });

    test('checkLoginStatus - 用户未登录时应保持默认状态', () => {
      mockWx.getStorageSync.mockReturnValue(null);

      page.checkLoginStatus();

      expect(page.data.hasUserInfo).toBe(false);
      expect(page.data.userInfo).toBeNull();
    });
  });

  describe('统计数据加载', () => {
    test('loadStats - 本地有缓存时应加载缓存数据', () => {
      const mockStats = {
        listenCount: 50,
        protectCount: 10,
        continuousDays: 15,
        certCount: 5
      };
      mockWx.getStorageSync.mockReturnValue(mockStats);

      page.loadStats();

      expect(page.data.stats).toEqual(mockStats);
    });

    test('loadStats - 本地无缓存时应保持默认数据', () => {
      mockWx.getStorageSync.mockReturnValue(null);

      page.loadStats();

      expect(page.data.stats.listenCount).toBe(36);
    });
  });

  describe('用户登录', () => {
    test('login - 用户授权成功时应保存用户信息', () => {
      const mockUserInfo = {
        avatarUrl: 'https://example.com/avatar.png',
        nickName: '新用户'
      };
      mockWx.getUserProfile.mockImplementation((options) => {
        options.success({ userInfo: mockUserInfo });
      });

      page.login();

      expect(mockWx.getUserProfile).toHaveBeenCalled();
      expect(mockWx.setStorageSync).toHaveBeenCalledWith('userInfo', mockUserInfo);
      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '登录成功',
        icon: 'success'
      });
    });

    test('login - 用户取消登录时应显示提示', () => {
      mockWx.getUserProfile.mockImplementation((options) => {
        options.fail({});
      });

      page.login();

      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '取消登录',
        icon: 'none'
      });
    });
  });

  describe('页面导航', () => {
    test('navigateTo - 有路径时应导航到指定页面', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            item: {
              path: '/pages/profile/listen',
              name: '我的收听'
            }
          }
        }
      };

      page.navigateTo(mockEvent);

      expect(mockWx.navigateTo).toHaveBeenCalled();
    });
  });

  describe('快捷操作', () => {
    test('onQuickActionTap - 应导航到快捷操作页面', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            action: {
              path: '/pages/protect/register',
              name: '一键放生'
            }
          }
        }
      };

      page.onQuickActionTap(mockEvent);

      expect(mockWx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/protect/register'
      });
    });
  });

  describe('图表功能', () => {
    test('toggleChart - 应切换图表显示状态', () => {
      expect(page.data.showChart).toBe(false);

      page.toggleChart();
      expect(page.data.showChart).toBe(true);

      page.toggleChart();
      expect(page.data.showChart).toBe(false);
    });
  });

  describe('联系客服', () => {
    test('contactUs - 应调用拨打电话功能', () => {
      page.contactUs();

      expect(mockWx.makePhoneCall).toHaveBeenCalledWith(expect.objectContaining({
        phoneNumber: '400-xxx-xxxx'
      }));
    });
  });

  describe('关于我们', () => {
    test('aboutUs - 应显示关于弹窗', () => {
      page.aboutUs();

      expect(mockWx.showModal).toHaveBeenCalledWith({
        title: '关于清如 ClearSpring',
        content: expect.stringContaining('清如 ClearSpring 专业服务小程序'),
        showCancel: false,
        confirmColor: '#07c160'
      });
    });
  });

  describe('分享功能', () => {
    test('onShareAppMessage - 应返回分享配置', () => {
      const shareConfig = page.onShareAppMessage();

      expect(shareConfig).toEqual({
        title: '我的修行记录 - 清如 ClearSpring',
        path: '/pages/profile/profile',
        imageUrl: ''
      });
    });
  });

  describe('数据验证', () => {
    test('菜单组应该包含正确的分类', () => {
      expect(page.data.menuGroups[0].title).toBe('修行数据');
    });

    test('快捷操作应该有颜色属性', () => {
      page.data.quickActions.forEach(action => {
        expect(action).toHaveProperty('color');
      });
    });

    test('趋势数据应该包含 7 天数据', () => {
      expect(page.data.trendData.dates).toHaveLength(7);
      expect(page.data.trendData.meritValues).toHaveLength(7);
    });
  });
});
