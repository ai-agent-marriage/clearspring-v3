import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { SettingsPage } from '../pages/settings.page';

/**
 * 设置流程测试
 * 用例 ID: E2E-EXEC-008
 * 优先级：P1
 * 
 * 流程：系统设置 → 隐私设置 → 外观设置 → 通知开关
 */
test.describe('设置流程', () => {
  let homePage: ExecutorHomePage;
  let settingsPage: SettingsPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    settingsPage = new SettingsPage(page);
    
    // 前置条件：已登录
    await page.goto('/executor/home');
    await homePage.waitForLoad();
  });

  test('E2E-EXEC-008-01: 访问设置页', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 验证设置页加载
    await expect(settingsPage.privacyTab).toBeVisible();
  });

  test('E2E-EXEC-008-02: 隐私设置 - 隐藏手机号', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入隐私设置
    await settingsPage.goToPrivacy();
    
    // 3. 设置隐藏手机号
    await settingsPage.setPrivacyOption('phone', false);
    
    // 4. 验证设置生效
    const toggle = settingsPage.showPhoneToggle;
    const isChecked = await toggle.isChecked();
    expect(isChecked).toBe(false);
  });

  test('E2E-EXEC-008-03: 隐私设置 - 显示位置', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入隐私设置
    await settingsPage.goToPrivacy();
    
    // 3. 设置显示位置
    await settingsPage.setPrivacyOption('location', true);
    
    // 4. 验证设置生效
    const toggle = settingsPage.showLocationToggle;
    const isChecked = await toggle.isChecked();
    expect(isChecked).toBe(true);
  });

  test('E2E-EXEC-008-04: 外观设置 - 切换深色主题', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入外观设置
    await settingsPage.goToAppearance();
    
    // 3. 切换深色主题
    await settingsPage.setTheme('dark');
    
    // 4. 验证主题切换
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    expect(className).toContain('dark');
  });

  test('E2E-EXEC-008-05: 外观设置 - 切换浅色主题', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入外观设置
    await settingsPage.goToAppearance();
    
    // 3. 切换浅色主题
    await settingsPage.setTheme('light');
    
    // 4. 验证主题切换
    const html = page.locator('html');
    const className = await html.getAttribute('class');
    expect(className).not.toContain('dark');
  });

  test('E2E-EXEC-008-06: 通知设置 - 开启订单通知', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入通知设置
    await settingsPage.goToNotifications();
    
    // 3. 开启订单通知
    await settingsPage.setNotificationOption('order', true);
    
    // 4. 验证设置生效
    const toggle = settingsPage.orderNotificationToggle;
    const isChecked = await toggle.isChecked();
    expect(isChecked).toBe(true);
  });

  test('E2E-EXEC-008-07: 通知设置 - 关闭营销通知', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入通知设置
    await settingsPage.goToNotifications();
    
    // 3. 关闭营销通知
    await settingsPage.setNotificationOption('marketing', false);
    
    // 4. 验证设置生效
    const toggle = settingsPage.marketingNotificationToggle;
    const isChecked = await toggle.isChecked();
    expect(isChecked).toBe(false);
  });

  test('E2E-EXEC-008-08: 通知设置 - 开启声音提醒', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 进入通知设置
    await settingsPage.goToNotifications();
    
    // 3. 开启声音提醒
    await settingsPage.setNotificationOption('sound', true);
    
    // 4. 验证设置生效
    const toggle = settingsPage.soundToggle;
    const isChecked = await toggle.isChecked();
    expect(isChecked).toBe(true);
  });

  test('E2E-EXEC-008-09: 清除缓存', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 清除缓存
    await settingsPage.clearCache();
    
    // 3. 验证清除成功提示
    const successToast = page.locator('.toast').filter({ hasText: /清除成功 | 缓存已清理/i });
    await successToast.waitFor({ state: 'visible', timeout: 3000 });
  });

  test('E2E-EXEC-008-10: 查看版本号', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 获取版本号
    const version = await settingsPage.getVersion();
    expect(version).toBeTruthy();
  });

  test('E2E-EXEC-008-11: 退出登录', async ({ page }) => {
    // 1. 访问设置页
    await settingsPage.goto();
    
    // 2. 退出登录
    await settingsPage.logout();
    
    // 3. 验证跳转到登录页
    await expect(page).toHaveURL(/.*login|\/$/);
  });
});
