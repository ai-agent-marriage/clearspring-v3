import { Page, Locator } from '@playwright/test';

/**
 * 设置页面
 * 流程：系统设置 → 隐私设置 → 外观设置 → 通知开关
 */
export class SettingsPage {
  readonly page: Page;
  
  // 设置分类
  readonly privacyTab: Locator;
  readonly appearanceTab: Locator;
  readonly notificationTab: Locator;
  readonly accountTab: Locator;
  readonly aboutTab: Locator;
  
  // 隐私设置
  readonly showPhoneToggle: Locator;
  readonly showLocationToggle: Locator;
  readonly showOnlineStatusToggle: Locator;
  readonly allowStrangerMessageToggle: Locator;
  
  // 外观设置
  readonly themeSelector: Locator;
  readonly lightTheme: Locator;
  readonly darkTheme: Locator;
  readonly systemTheme: Locator;
  readonly fontSizeSelector: Locator;
  readonly languageSelector: Locator;
  
  // 通知设置
  readonly orderNotificationToggle: Locator;
  readonly systemNotificationToggle: Locator;
  readonly marketingNotificationToggle: Locator;
  readonly soundToggle: Locator;
  readonly vibrationToggle: Locator;
  
  // 账户设置
  readonly changePasswordButton: Locator;
  readonly bindPhoneButton: Locator;
  readonly logoutButton: Locator;
  
  // 其他
  readonly versionInfo: Locator;
  readonly clearCacheButton: Locator;
  readonly feedbackButton: Locator;
  readonly helpButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 设置分类
    this.privacyTab = page.getByRole('tab', { name: /隐私 | 隐私设置/i });
    this.appearanceTab = page.getByRole('tab', { name: /外观 | 显示/i });
    this.notificationTab = page.getByRole('tab', { name: /通知 | 消息/i });
    this.accountTab = page.getByRole('tab', { name: /账户 | 账号/i });
    this.aboutTab = page.getByRole('tab', { name: /关于 | 帮助/i });
    
    // 隐私设置
    this.showPhoneToggle = page.locator('.toggle').filter({ hasText: /手机号 | 电话/i });
    this.showLocationToggle = page.locator('.toggle').filter({ hasText: /位置 | 地点/i });
    this.showOnlineStatusToggle = page.locator('.toggle').filter({ hasText: /在线状态/i });
    this.allowStrangerMessageToggle = page.locator('.toggle').filter({ hasText: /陌生人消息/i });
    
    // 外观设置
    this.themeSelector = page.locator('.theme-selector');
    this.lightTheme = page.getByRole('button', { name: /浅色 | 明亮/i });
    this.darkTheme = page.getByRole('button', { name: /深色 | 黑暗/i });
    this.systemTheme = page.getByRole('button', { name: /系统 | 跟随/i });
    this.fontSizeSelector = page.locator('.font-size-selector, select').filter({ hasText: /字体/i });
    this.languageSelector = page.locator('.language-selector, select').filter({ hasText: /语言/i });
    
    // 通知设置
    this.orderNotificationToggle = page.locator('.toggle').filter({ hasText: /订单 | 接单/i });
    this.systemNotificationToggle = page.locator('.toggle').filter({ hasText: /系统/i });
    this.marketingNotificationToggle = page.locator('.toggle').filter({ hasText: /营销 | 活动/i });
    this.soundToggle = page.locator('.toggle').filter({ hasText: /声音 | 提示音/i });
    this.vibrationToggle = page.locator('.toggle').filter({ hasText: /振动/i });
    
    // 账户设置
    this.changePasswordButton = page.getByRole('button', { name: /修改密码 | 更改密码/i });
    this.bindPhoneButton = page.getByRole('button', { name: /绑定手机 | 更换手机/i });
    this.logoutButton = page.getByRole('button', { name: /退出登录 | 登出/i });
    
    // 其他
    this.versionInfo = page.locator('.version-info, .version');
    this.clearCacheButton = page.getByRole('button', { name: /清除缓存 | 清理缓存/i });
    this.feedbackButton = page.getByRole('button', { name: /反馈 | 意见反馈/i });
    this.helpButton = page.getByRole('button', { name: /帮助 | 帮助中心/i });
  }

  /**
   * 访问设置页
   */
  async goto() {
    await this.page.goto('/executor/settings');
  }

  /**
   * 切换到隐私设置
   */
  async goToPrivacy() {
    await this.privacyTab.click();
  }

  /**
   * 切换到外观设置
   */
  async goToAppearance() {
    await this.appearanceTab.click();
  }

  /**
   * 切换到通知设置
   */
  async goToNotifications() {
    await this.notificationTab.click();
  }

  /**
   * 设置隐私选项
   */
  async setPrivacyOption(option: string, enable: boolean) {
    let toggle: Locator;
    switch (option) {
      case 'phone':
        toggle = this.showPhoneToggle;
        break;
      case 'location':
        toggle = this.showLocationToggle;
        break;
      case 'online':
        toggle = this.showOnlineStatusToggle;
        break;
      case 'stranger':
        toggle = this.allowStrangerMessageToggle;
        break;
      default:
        return;
    }
    
    const isChecked = await toggle.isChecked();
    if (enable !== isChecked) {
      await toggle.click();
    }
  }

  /**
   * 设置主题
   */
  async setTheme(theme: string) {
    switch (theme) {
      case 'light':
        await this.lightTheme.click();
        break;
      case 'dark':
        await this.darkTheme.click();
        break;
      case 'system':
        await this.systemTheme.click();
        break;
    }
  }

  /**
   * 设置通知开关
   */
  async setNotificationOption(option: string, enable: boolean) {
    let toggle: Locator;
    switch (option) {
      case 'order':
        toggle = this.orderNotificationToggle;
        break;
      case 'system':
        toggle = this.systemNotificationToggle;
        break;
      case 'marketing':
        toggle = this.marketingNotificationToggle;
        break;
      case 'sound':
        toggle = this.soundToggle;
        break;
      case 'vibration':
        toggle = this.vibrationToggle;
        break;
      default:
        return;
    }
    
    const isChecked = await toggle.isChecked();
    if (enable !== isChecked) {
      await toggle.click();
    }
  }

  /**
   * 清除缓存
   */
  async clearCache() {
    await this.clearCacheButton.click();
    const confirmButton = this.page.getByRole('button', { name: /确认 | 确定/i });
    await confirmButton.click();
  }

  /**
   * 退出登录
   */
  async logout() {
    await this.logoutButton.click();
    const confirmButton = this.page.getByRole('button', { name: /确认 | 确定/i });
    await confirmButton.click();
  }

  /**
   * 获取版本号
   */
  async getVersion() {
    return await this.versionInfo.textContent();
  }
}
