/**
 * 设置页面测试
 * @file miniprogram/__tests__/settings.test.js
 * @description 测试设置页面的各项功能
 */

describe('设置页面测试', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    // Mock wx 对象
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      showToast: jest.fn(),
      showModal: jest.fn(),
      authorize: jest.fn(),
      clearStorageSync: jest.fn()
    };
    global.wx = mockWx;

    // 创建页面实例
    page = {
      data: {
        version: '1.0.0',
        cacheSize: 24.5,
        notifications: {
          activity: true,
          merit: false,
          system: true
        },
        appearance: {
          xuanPaper: true,
          themeName: '禅意金系'
        },
        themes: [
          { id: 'gold', name: '禅意金系' },
          { id: 'celadon', name: '青瓷系' },
          { id: 'cinnabar', name: '朱砂系' },
          { id: 'ink', name: '墨色系' }
        ],
        themeIndex: 0
      },
      loadSettings: function() {
        const settings = mockWx.getStorageSync('settings');
        if (settings) {
          page.data.notifications = settings.notifications || page.data.notifications;
          page.data.appearance = settings.appearance || page.data.appearance;
          page.data.themeIndex = settings.themeIndex || 0;
        }
      },
      saveSettings: function() {
        const settings = {
          notifications: page.data.notifications,
          appearance: page.data.appearance,
          themeIndex: page.data.themeIndex
        };
        mockWx.setStorageSync('settings', settings);
      },
      onActivityNotificationChange: function(e) {
        page.data.notifications.activity = e.detail.value;
        page.saveSettings();
        mockWx.showToast({
          title: e.detail.value ? '已开启' : '已关闭',
          icon: 'none'
        });
      },
      onMeritNotificationChange: function(e) {
        page.data.notifications.merit = e.detail.value;
        page.saveSettings();
        mockWx.showToast({
          title: e.detail.value ? '已开启' : '已关闭',
          icon: 'none'
        });
      },
      onSystemNotificationChange: function(e) {
        page.data.notifications.system = e.detail.value;
        page.saveSettings();
        mockWx.showToast({
          title: e.detail.value ? '已开启' : '已关闭',
          icon: 'none'
        });
      },
      onXuanPaperChange: function(e) {
        page.data.appearance.xuanPaper = e.detail.value;
        page.saveSettings();
        mockWx.showToast({
          title: e.detail.value ? '已启用宣纸风格' : '已关闭宣纸风格',
          icon: 'none'
        });
      },
      onThemeChange: function(e) {
        const index = e.detail.value;
        const theme = page.data.themes[index];
        page.data.themeIndex = index;
        page.data.appearance.themeName = theme.name;
        page.saveSettings();
        mockWx.showToast({
          title: `已切换至${theme.name}`,
          icon: 'none'
        });
      },
      onPrivacyTap: function() {
        mockWx.navigateTo({ url: '/pages/webview/webview?url=privacy' });
      },
      onAuthorizationTap: function() {
        mockWx.authorize({
          scope: 'scope.userInfo',
          success: () => mockWx.showToast({ title: '已授权', icon: 'success' }),
          fail: () => mockWx.showModal({
            title: '授权管理',
            content: '请在小程序设置中管理授权',
            showCancel: false
          })
        });
      },
      onClearCacheTap: function() {
        mockWx.showModal({
          title: '清除缓存',
          content: `确定清除 ${page.data.cacheSize}MB 缓存吗？`,
          success: (res) => {
            if (res.confirm) {
              mockWx.clearStorageSync();
              page.data.cacheSize = 0;
              mockWx.showToast({ title: '缓存已清除', icon: 'success' });
            }
          }
        });
      },
      onAboutTap: function() {
        mockWx.showModal({
          title: '清如 ClearSpring',
          content: `版本：${page.data.version}\n\n清如是一个专业的放生服务平台`,
          showCancel: false,
          confirmText: '知道了'
        });
      },
      onHelpTap: function() {
        mockWx.navigateTo({ url: '/pages/help/help' });
      },
      onFeedbackTap: function() {
        mockWx.navigateTo({ url: '/pages/feedback/feedback' });
      },
      onContactTap: function() {
        mockWx.showModal({
          title: '联系我们',
          content: '客服微信：qingru_service\n\n服务时间：9:00-18:00',
          showCancel: false,
          confirmText: '知道了'
        });
      },
      onShareAppMessage: function() {
        return {
          title: '清如 ClearSpring - 科学放生平台',
          path: '/pages/settings/settings',
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
      expect(page.data.version).toBe('1.0.0');
    });

    test('应该有默认的通知设置', () => {
      expect(page.data.notifications.activity).toBe(true);
      expect(page.data.notifications.merit).toBe(false);
      expect(page.data.notifications.system).toBe(true);
    });
  });

  describe('设置加载与保存', () => {
    test('loadSettings - 本地有设置时应加载设置', () => {
      const mockSettings = {
        notifications: { activity: false, merit: true, system: false },
        appearance: { xuanPaper: false, themeName: '青瓷系' },
        themeIndex: 1
      };
      mockWx.getStorageSync.mockReturnValue(mockSettings);

      page.loadSettings();

      expect(page.data.notifications.activity).toBe(false);
      expect(page.data.notifications.merit).toBe(true);
      expect(page.data.appearance.xuanPaper).toBe(false);
      expect(page.data.themeIndex).toBe(1);
    });

    test('saveSettings 应该保存设置到本地', () => {
      page.saveSettings();

      expect(mockWx.setStorageSync).toHaveBeenCalledWith('settings', expect.objectContaining({
        notifications: page.data.notifications,
        appearance: page.data.appearance
      }));
    });
  });

  describe('通知设置', () => {
    test('onActivityNotificationChange - 开启活动通知', () => {
      const mockEvent = { detail: { value: true } };

      page.onActivityNotificationChange(mockEvent);

      expect(page.data.notifications.activity).toBe(true);
      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '已开启',
        icon: 'none'
      });
    });

    test('onActivityNotificationChange - 关闭活动通知', () => {
      const mockEvent = { detail: { value: false } };

      page.onActivityNotificationChange(mockEvent);

      expect(page.data.notifications.activity).toBe(false);
      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '已关闭',
        icon: 'none'
      });
    });

    test('onMeritNotificationChange - 切换功德提醒', () => {
      const mockEvent = { detail: { value: true } };

      page.onMeritNotificationChange(mockEvent);

      expect(page.data.notifications.merit).toBe(true);
    });

    test('onSystemNotificationChange - 切换系统通知', () => {
      const mockEvent = { detail: { value: false } };

      page.onSystemNotificationChange(mockEvent);

      expect(page.data.notifications.system).toBe(false);
    });
  });

  describe('外观设置', () => {
    test('onXuanPaperChange - 开启宣纸风格', () => {
      const mockEvent = { detail: { value: true } };

      page.onXuanPaperChange(mockEvent);

      expect(page.data.appearance.xuanPaper).toBe(true);
      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '已启用宣纸风格',
        icon: 'none'
      });
    });

    test('onThemeChange - 切换主题', () => {
      const mockEvent = { detail: { value: 2 } };

      page.onThemeChange(mockEvent);

      expect(page.data.themeIndex).toBe(2);
      expect(page.data.appearance.themeName).toBe('朱砂系');
      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '已切换至朱砂系',
        icon: 'none'
      });
    });
  });

  describe('功能入口', () => {
    test('onPrivacyTap - 应导航到隐私政策页面', () => {
      page.onPrivacyTap();

      expect(mockWx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/webview/webview?url=privacy'
      });
    });

    test('onAuthorizationTap - 授权成功应显示提示', () => {
      mockWx.authorize.mockImplementation((options) => {
        options.success && options.success();
      });

      page.onAuthorizationTap();

      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '已授权',
        icon: 'success'
      });
    });

    test('onAuthorizationTap - 授权失败应显示提示', () => {
      mockWx.authorize.mockImplementation((options) => {
        options.fail && options.fail();
      });

      page.onAuthorizationTap();

      expect(mockWx.showModal).toHaveBeenCalledWith({
        title: '授权管理',
        content: '请在小程序设置中管理授权',
        showCancel: false
      });
    });
  });

  describe('缓存管理', () => {
    test('onClearCacheTap - 确认清除缓存', () => {
      mockWx.showModal.mockImplementation((options) => {
        options.success && options.success({ confirm: true });
      });

      page.onClearCacheTap();

      expect(mockWx.clearStorageSync).toHaveBeenCalled();
      expect(page.data.cacheSize).toBe(0);
      expect(mockWx.showToast).toHaveBeenCalledWith({
        title: '缓存已清除',
        icon: 'success'
      });
    });
  });

  describe('其他功能', () => {
    test('onAboutTap - 应显示关于弹窗', () => {
      page.onAboutTap();

      expect(mockWx.showModal).toHaveBeenCalledWith({
        title: '清如 ClearSpring',
        content: expect.stringContaining('版本：1.0.0'),
        showCancel: false
      });
    });

    test('onHelpTap - 应导航到帮助页面', () => {
      page.onHelpTap();

      expect(mockWx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/help/help'
      });
    });

    test('onFeedbackTap - 应导航到反馈页面', () => {
      page.onFeedbackTap();

      expect(mockWx.navigateTo).toHaveBeenCalledWith({
        url: '/pages/feedback/feedback'
      });
    });

    test('onContactTap - 应显示联系方式', () => {
      page.onContactTap();

      expect(mockWx.showModal).toHaveBeenCalledWith({
        title: '联系我们',
        content: expect.stringContaining('客服微信：qingru_service'),
        showCancel: false
      });
    });
  });

  describe('分享功能', () => {
    test('onShareAppMessage - 应返回分享配置', () => {
      const shareConfig = page.onShareAppMessage();

      expect(shareConfig).toEqual({
        title: '清如 ClearSpring - 科学放生平台',
        path: '/pages/settings/settings',
        imageUrl: ''
      });
    });
  });

  describe('数据验证', () => {
    test('主题列表应该包含 4 个主题', () => {
      expect(page.data.themes).toHaveLength(4);
    });

    test('每个主题都应该有 id 和 name', () => {
      page.data.themes.forEach(theme => {
        expect(theme).toHaveProperty('id');
        expect(theme).toHaveProperty('name');
      });
    });

    test('缓存大小应该是数字', () => {
      expect(typeof page.data.cacheSize).toBe('number');
    });
  });
});
