import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { PrayerHomePage } from '../pages/prayer-home.page';
import { SpeciesPage } from '../pages/species.page';
import { OrderCreatePage } from '../pages/order-create.page';
import { OrderDetailPage } from '../pages/order-detail.page';

/**
 * P0 - 物种查询与委托服务流程
 * 测试用例：TC002
 * 流程：物种查询 → 详情 → 委托服务 → 订单确认 → 订单详情
 */
test.describe('P0 - 物种查询与委托服务', () => {
  let loginPage: LoginPage;
  let homePage: PrayerHomePage;
  let speciesPage: SpeciesPage;
  let orderCreatePage: OrderCreatePage;
  let orderDetailPage: OrderDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new PrayerHomePage(page);
    speciesPage = new SpeciesPage(page);
    orderCreatePage = new OrderCreatePage(page);
    orderDetailPage = new OrderDetailPage(page);
  });

  test('TC002 - 物种查询 → 详情 → 委托服务 → 订单确认 → 订单详情', async ({ page }) => {
    // 步骤 1: 登录并进入物种查询页面
    test.step('登录并进入物种查询', async () => {
      await loginPage.goto();
      await loginPage.login();
      await homePage.goto();
      await speciesPage.goto();
      await page.screenshot({ path: 'test-results/tc002-species-search.png' });
    });

    // 步骤 2: 搜索/查看物种列表
    test.step('查看物种列表', async () => {
      const listVisible = await speciesPage.viewSpeciesList();
      expect(listVisible).toBe(true);
    });

    // 步骤 3: 选择第一个物种查看详情
    test.step('查看物种详情', async () => {
      await speciesPage.selectSpecies(0);
      await speciesPage.viewSpeciesDetail();
      await page.screenshot({ path: 'test-results/tc002-species-detail.png' });
    });

    // 步骤 4: 点击委托保护按钮
    test.step('进入委托服务', async () => {
      await speciesPage.goToProtectService();
      await orderCreatePage.verifyOrderInfo();
      await page.screenshot({ path: 'test-results/tc002-order-create.png' });
    });

    // 步骤 5: 填写订单信息
    test.step('填写订单表单', async () => {
      await orderCreatePage.fillOrderForm({
        address: '测试地址 123 号',
        phone: '13800138000',
        remark: 'E2E 测试订单',
      });
    });

    // 步骤 6: 提交订单
    test.step('提交订单', async () => {
      await orderCreatePage.submitOrder();
      await page.waitForTimeout(2000); // 等待订单创建
      await page.screenshot({ path: 'test-results/tc002-order-submitted.png' });
    });

    // 步骤 7: 验证订单详情
    test.step('查看订单详情', async () => {
      await orderDetailPage.viewOrderDetail();
      await orderDetailPage.verifyOrderStatus('待支付');
      await page.screenshot({ path: 'test-results/tc002-order-detail.png' });
    });
  });

  test('TC002-ALT - 物种搜索功能验证', async ({ page }) => {
    await loginPage.goto();
    await loginPage.login();
    await speciesPage.goto();

    // 测试搜索功能
    await speciesPage.searchSpecies('测试物种');
    await page.waitForTimeout(1000);
    
    // 验证搜索结果
    const listVisible = await speciesPage.viewSpeciesList();
    expect(listVisible).toBe(true);

    await page.screenshot({ path: 'test-results/tc002-alt-species-search.png' });
  });
});
