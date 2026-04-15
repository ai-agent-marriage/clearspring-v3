import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { PrayerHomePage } from '../pages/prayer-home.page';
import { PrayerProfilePage } from '../pages/prayer-profile.page';

/**
 * P0 - 祈福者端核心导航流程
 * 测试用例：TC001
 * 流程：启动 → 首页 → 梵音 → 禅理 → 我的
 */
test.describe('P0 - 祈福者端核心流程', () => {
  let loginPage: LoginPage;
  let homePage: PrayerHomePage;
  let profilePage: PrayerProfilePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new PrayerHomePage(page);
    profilePage = new PrayerProfilePage(page);
  });

  test('TC001 - 启动 → 首页 → 梵音 → 禅理 → 我的', async ({ page }) => {
    // 步骤 1: 启动小程序，验证首页加载
    test.step('启动小程序并验证首页', async () => {
      await homePage.goto();
      await homePage.verifyHomePageLoaded();
      await page.screenshot({ path: 'test-results/tc001-homepage.png' });
    });

    // 步骤 2: 验证服务列表可见
    test.step('查看首页服务列表', async () => {
      const serviceListVisible = await homePage.viewServiceList();
      expect(serviceListVisible).toBe(true);
    });

    // 步骤 3: 点击梵音入口
    test.step('进入梵音页面', async () => {
      await homePage.goToFanYin();
      await expect(page.getByText(/梵音/i)).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: 'test-results/tc001-fanyin.png' });
    });

    // 步骤 4: 返回首页并点击禅理入口
    test.step('进入禅理页面', async () => {
      await page.goBack();
      await homePage.goToChanLi();
      await expect(page.getByText(/禅理/i)).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: 'test-results/tc001-chanli.png' });
    });

    // 步骤 5: 进入个人中心
    test.step('进入个人中心页面', async () => {
      await page.goBack();
      await profilePage.goto();
      await profilePage.viewProfile();
      await page.screenshot({ path: 'test-results/tc001-profile.png' });
    });

    // 步骤 6: 验证用户信息显示
    test.step('验证用户信息', async () => {
      await profilePage.verifyUserInfoDisplayed();
      expect(profilePage.userAvatar).toBeVisible();
      expect(profilePage.userName).toBeVisible();
    });
  });

  test('TC001-ALT - 首页功能入口验证', async ({ page }) => {
    // 验证首页所有功能入口都可见
    await homePage.goto();
    await homePage.verifyHomePageLoaded();

    // 验证各个功能入口
    await expect(homePage.fanYinEntry).toBeVisible();
    await expect(homePage.chanLiEntry).toBeVisible();
    await expect(homePage.meritForestEntry).toBeVisible();
    await expect(homePage.wikiEntry).toBeVisible();
    await expect(homePage.searchBox).toBeVisible();

    await page.screenshot({ path: 'test-results/tc001-alt-homepage-entries.png' });
  });
});
