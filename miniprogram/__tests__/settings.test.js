/**
 * @file 设置页面测试
 * @description 测试设置页面的功能完整性
 */

const { setupApp, mockWx, clearMocks } = require('./setup');

describe('设置页面 (Settings)', () => {
  let app;
  let page;
  let mockSettings;

  beforeEach(() => {
    app = setupApp();
    mockWx();
    mockSettings = {
      notifications: {
        activity: true,
        merit: false,
        system: true,
        subscribeMessage: true
      },
      appearance: {
        xuanPaper: true,
        themeName: '禅意金系'
      },
      themeIndex: 0
    };
  });

  afterEach(() => {
    clearMocks();
    page = null;
  });

  describe('页面初始化', () => {
    test('页面应该成功加载', () => {
      page = app.loadPage('/pages/settings/settings');
      expect(page).toBeDefined();
      expect(page.data).toBeDefined();
    });

    test('默认数据应该正确初始化', () => {
      page = app.loadPage('/pages/settings/settings');
      expect(page.data.version).toBeDefined();
      expect(page.data.cacheSize).toBeDefined();
      expect(page.data.notifications).toBeDefined();
      expect(page.data.appearance).toBeDefined();
      expect(page.data.themes).toBeDefined();
    });

    test('版本号应该是有效的字符串', () => {
      page = app.loadPage('/pages/settings/settings');
      const version = page.data.version;
      expect(typeof version).toBe('string');
      expect(version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('主题列表应该包含所有预设主题', () => {
      page = app.loadPage('/pages/settings/settings');
      const themes = page.data.themes;
      
      expect(themes.length).toBe(4);
      expect(themes.map(t => t.id)).toEqual(['gold', 'celadon', 'cinnabar', 'ink']);
    });
  });

  describe('设置加载与保存', () => {
    test('加载设置应该读取本地缓存', () => {
      wx.getStorageSync.mockReturnValue(mockSettings);
      
      page = app.loadPage('/pages/settings/settings');
      page.loadSettings();

      expect(wx.getStorageSync).toHaveBeenCalledWith('settings');
      expect(page.data.notifications).toEqual(mockSettings.notifications);
    });

    test('没有缓存时应该使用默认设置', () => {
      wx.getStorageSync.mockReturnValue(null);
      
      page = app.loadPage('/pages/settings/settings');
      page.loadSettings();

      expect(page.data.notifications.activity).toBe(true);
      expect(page.data.notifications.merit).toBe(false);
      expect(page.data.notifications.system).toBe(true);
    });

    test('保存设置应该写入本地缓存', () => {
      page = app.loadPage('/pages/settings/settings');
      page.saveSettings();

      expect(wx.setStorageSync).toHaveBeenCalledWith(
        'settings',
        expect.objectContaining({
          notifications: expect.any(Object),
          appearance: expect.any(Object),
          themeIndex: expect.any(Number)
        })
      );
    });
  });

  describe('通知设置', () => {
    test('切换活动通知应该更新状态并保存', () => {
      page = app.loadPage('/pages/settings/settings');
      
      page.onActivityNotificationChange({ detail: { value: false } });
      
      expect(page.data.notifications.activity).toBe(false);
      expect(wx.setStorageSync).toHaveBeenCalledWith('settings', expect.any(Object));
      expect(wx.showToast).toHaveBeenCalled();
    });

    test('切换功德提醒应该更新状态并保存', () => {
      page = app.loadPage('/pages/settings/settings');
      
      page.onMeritNotificationChange({ detail: { value: true } });
      
      expect(page.data.notifications.merit).toBe(true);
      expect(wx.setStorageSync).toHaveBeenCalled();
    });

    test('切换系统通知应该更新状态并保存', () => {
      page = app.loadPage('/pages/settings/settings');
      
      page.onSystemNotificationChange({ detail: { value: false } });
      
      expect(page.data.notifications.system).toBe(false);
      expect(wx.setStorageSync).toHaveBeenCalled();
    });

    test('切换订阅消息应该请求授权', () => {
      page = app.loadPage('/pages/settings/settings');
      
      wx.requestSubscribeMessage.mockImplementation(({ success }) => {
        success({});
      });

      page.onSubscribeMessageChange({ detail: { value: true } });
      
      expect(wx.requestSubscribeMessage).toHaveBeenCalled();
      expect(page.data.notifications.subscribeMessage).toBe(true);
    });

    test('订阅消息授权失败应该回滚状态', () => {
      page = app.loadPage('/pages/settings/settings');
      
      wx.requestSubscribeMessage.mockImplementation(({ fail }) => {
        fail(new Error('授权失败'));
      });

      page.onSubscribeMessageChange({ detail: { value: true } });
      
      expect(page.data.notifications.subscribeMessage).toBe(false);
    });
  });

  describe('外观设置', () => {
    test('切换宣纸风格应该更新状态', () => {
      page = app.loadPage('/pages/settings/settings');
      
      page.onXuanPaperChange({ detail: { value: false } });
      
      expect(page.data.appearance.xuanPaper).toBe(false);
      expect(wx.setStorageSync).toHaveBeenCalled();
    });

    test('切换主题应该更新主题索引', () => {
      page = app.loadPage('/pages/settings/settings');
      
      page.onThemeChange({ detail: { value: 1 } });
      
      expect(page.data.themeIndex).toBe(1);
      expect(page.data.appearance.themeName).toBe('青瓷系');
      expect(wx.setStorageSync).toHaveBeenCalled();
    });

    test('切换主题应该显示提示信息', () => {
      page = app.loadPage('/pages/settings/settings');
      
      page.onThemeChange({ detail: { value: 2 } });
      
      expect(wx.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('已切换至'),
          icon: 'none'
        })
      );
    });
  });

  describe('缓存管理', () => {
    test('清除缓存应该显示确认弹窗', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onClearCacheTap();

      expect(wx.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '清除缓存',
          content: expect.stringContaining('MB')
        })
      );
    });

    test('确认清除缓存应该清空存储', () => {
      page = app.loadPage('/pages/settings/settings');
      
      wx.showModal.mockImplementation(({ success }) => {
        success({ confirm: true });
      });

      page.onClearCacheTap();

      expect(wx.clearStorageSync).toHaveBeenCalled();
      expect(page.data.cacheSize).toBe(0);
      expect(wx.showToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '缓存已清除',
          icon: 'success'
        })
      );
    });

    test('取消清除缓存不应该执行操作', () => {
      page = app.loadPage('/pages/settings/settings');
      
      wx.showModal.mockImplementation(({ success }) => {
        success({ confirm: false });
      });

      page.onClearCacheTap();

      expect(wx.clearStorageSync).not.toHaveBeenCalled();
    });
  });

  describe('隐私与协议', () => {
    test('点击隐私政策应该跳转到隐私页面', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onPrivacyTap();

      expect(wx.navigateTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/privacy/privacy'
        })
      );
    });

    test('点击用户协议应该跳转到协议页面', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onUserAgreementTap();

      expect(wx.navigateTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/agreement/agreement'
        })
      );
    });

    test('点击授权管理应该请求授权', () => {
      page = app.loadPage('/pages/settings/settings');
      
      wx.authorize.mockImplementation(({ success }) => {
        success();
      });

      page.onAuthorizationTap();

      expect(wx.authorize).toHaveBeenCalledWith(
        expect.objectContaining({
          scope: 'scope.userInfo'
        })
      );
    });

    test('授权失败应该显示提示', () => {
      page = app.loadPage('/pages/settings/settings');
      
      wx.authorize.mockImplementation(({ fail }) => {
        fail(new Error('授权失败'));
      });

      page.onAuthorizationTap();

      expect(wx.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '授权管理'
        })
      );
    });
  });

  describe('其他功能', () => {
    test('关于清如应该显示版本信息', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onAboutTap();

      expect(wx.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '清如 ClearSpring',
          content: expect.stringContaining(page.data.version)
        })
      );
    });

    test('使用帮助应该跳转到帮助页面', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onHelpTap();

      expect(wx.navigateTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/help/help'
        })
      );
    });

    test('意见反馈应该跳转到反馈页面', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onFeedbackTap();

      expect(wx.navigateTo).toHaveBeenCalledWith(
        expect.objectContaining({
          url: '/pages/feedback/feedback'
        })
      );
    });

    test('联系我们应该显示联系方式', () => {
      page = app.loadPage('/pages/settings/settings');
      page.onContactTap();

      expect(wx.showModal).toHaveBeenCalledWith(
        expect.objectContaining({
          title: '联系我们',
          content: expect.stringContaining('客服微信')
        })
      );
    });

    test('分享应该返回正确的分享数据', () => {
      page = app.loadPage('/pages/settings/settings');
      const shareData = page.onShareAppMessage();

      expect(shareData.title).toContain('清如 ClearSpring');
      expect(shareData.path).toBe('/pages/settings/settings');
    });
  });

  describe('数据验证', () => {
    test('缓存大小应该是正数', () => {
      page = app.loadPage('/pages/settings/settings');
      expect(page.data.cacheSize).toBeGreaterThanOrEqual(0);
    });

    test('主题索引应该在有效范围内', () => {
      page = app.loadPage('/pages/settings/settings');
      const { themeIndex, themes } = page.data;
      
      expect(themeIndex).toBeGreaterThanOrEqual(0);
      expect(themeIndex).toBeLessThan(themes.length);
    });

    test('通知设置应该包含所有必要字段', () => {
      page = app.loadPage('/pages/settings/settings');
      const notifications = page.data.notifications;
      
      expect(notifications).toHaveProperty('activity');
      expect(notifications).toHaveProperty('merit');
      expect(notifications).toHaveProperty('system');
      expect(notifications).toHaveProperty('subscribeMessage');
    });
  });
});
