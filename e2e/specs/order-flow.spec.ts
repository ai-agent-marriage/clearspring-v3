import { test, expect } from '../fixtures/test-fixtures';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { OrderPage } from '../pages/order.page';
import { ProfilePage } from '../pages/profile.page';
import { ExecutorPage } from '../pages/executor.page';

test.describe('P0 - 核心用户流程', () => {
  let loginPage: LoginPage;
  let homePage: HomePage;
  let orderPage: OrderPage;
  let profilePage: ProfilePage;
  let executorPage: ExecutorPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    homePage = new HomePage(page);
    orderPage = new OrderPage(page);
    profilePage = new ProfilePage(page);
    executorPage = new ExecutorPage(page);
  });

  test('TC003 - 服务浏览流程：首页 → 服务列表 → 服务详情 → 返回', async ({ page }) => {
    // 登录
    await loginPage.goto();
    await loginPage.login();
    
    // 查看服务列表
    await homePage.goto();
    const serviceListVisible = await homePage.viewServiceList();
    expect(serviceListVisible).toBe(true);
    
    // 选择第一个服务
    await homePage.selectService(0);
    
    // 验证服务详情可见
    await expect(orderPage.serviceDetail).toBeVisible();
    
    // 返回
    await page.goBack();
    await expect(homePage.serviceList).toBeVisible();
  });

  test('TC004 - 下单流程：选择服务 → 填写订单 → 提交 → 支付 → 成功', async ({ page }) => {
    // 登录并进入首页
    await loginPage.goto();
    await loginPage.login();
    await homePage.goto();
    
    // 选择服务
    await homePage.selectService(0);
    
    // 填写订单信息
    await orderPage.fillOrderForm({
      serviceName: '测试服务',
      address: '测试地址 123 号',
      phone: '13800138000',
      remark: '测试订单',
    });
    
    // 提交订单
    await orderPage.submitOrder();
    
    // 模拟支付
    await orderPage.simulatePayment();
    
    // 验证订单成功
    const success = await orderPage.isSuccess();
    expect(success).toBe(true);
  });

  test('TC005 - 订单查看流程：个人中心 → 我的订单 → 订单详情 → 查看证据', async ({ page }) => {
    // 登录
    await loginPage.goto();
    await loginPage.login();
    
    // 进入个人中心
    await profilePage.goto();
    await profilePage.viewProfile();
    
    // 进入我的订单
    await profilePage.goToMyOrders();
    
    // 查看订单列表
    const orderListVisible = await orderPage.viewOrderList();
    expect(orderListVisible).toBe(true);
    
    // 选择第一个订单查看详情
    await orderPage.selectOrder(0);
    
    // 验证订单详情可见（包含证据）
    await expect(orderPage.serviceDetail).toBeVisible();
  });

  test('TC006 - 执行者抢单流程：执行者首页 → 抢单大厅 → 抢单 → 提交证据', async ({ page }) => {
    // 执行者登录
    await executorPage.goto();
    await expect(executorPage.executorHome).toBeVisible();
    
    // 进入抢单大厅
    await executorPage.goToOrderHall();
    
    // 抢单
    await executorPage.grabOrder(0);
    
    // 提交证据
    await executorPage.submitEvidence();
    
    // 验证提交成功
    const success = await executorPage.isSuccess();
    expect(success).toBe(true);
  });
});
