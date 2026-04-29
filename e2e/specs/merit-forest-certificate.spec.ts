import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { PrayerProfilePage } from '../pages/prayer-profile.page';
import { MeritForestPage } from '../pages/merit-forest.page';
import { OrderDetailPage } from '../pages/order-detail.page';

/**
 * P0 - 功德林证书查看与分享流程
 * 测试用例：TC003
 * 流程：功德林 → 证书查看 → 分享
 */
test.describe('P0 - 功德林证书流程', () => {
  let loginPage: LoginPage;
  let profilePage: PrayerProfilePage;
  let meritForestPage: MeritForestPage;
  let orderDetailPage: OrderDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    profilePage = new PrayerProfilePage(page);
    meritForestPage = new MeritForestPage(page);
    orderDetailPage = new OrderDetailPage(page);
  });

  test('TC003 - 功德林 → 证书查看 → 分享', async ({ page }) => {
    // 步骤 1: 登录并进入功德林页面
    test.step('登录并进入功德林', async () => {
      await loginPage.goto();
      await loginPage.login();
      await meritForestPage.goto();
      await page.screenshot({ path: 'test-results/tc003-merit-forest.png' });
    });

    // 步骤 2: 查看项目列表
    test.step('查看功德林项目列表', async () => {
      const listVisible = await meritForestPage.viewProjectList();
      expect(listVisible).toBe(true);
    });

    // 步骤 3: 选择已完成的项目
    test.step('选择项目', async () => {
      await meritForestPage.selectProject(0);
      await page.screenshot({ path: 'test-results/tc003-project-detail.png' });
    });

    // 步骤 4: 查看证书
    test.step('查看证书', async () => {
      await meritForestPage.viewCertificate();
      await expect(page.getByText(/证书/i)).toBeVisible({ timeout: 5000 });
      await page.screenshot({ path: 'test-results/tc003-certificate.png' });
    });

    // 步骤 5: 验证分享功能
    test.step('验证分享功能', async () => {
      const shareButton = page.getByRole('button', { name: /分享/i });
      await expect(shareButton).toBeVisible();
      // 点击分享按钮（不实际执行分享，只验证功能存在）
      await shareButton.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tc003-share-panel.png' });
    });
  });

  test('TC003-ALT - 从订单详情页查看证书', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login();
    
    // 进入个人中心
    await profilePage.goto();
    await profilePage.goToMyOrders();
    
    // 选择第一个订单
    await orderDetailPage.goto();
    await orderDetailPage.viewOrderDetail();
    
    // 查看证书
    await orderDetailPage.viewCertificate();
    await expect(page.getByText(/证书/i)).toBeVisible();
    
    await page.screenshot({ path: 'test-results/tc003-alt-order-certificate.png' });
  });
});
