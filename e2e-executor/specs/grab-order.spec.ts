import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { OrderHallPage } from '../pages/order-hall.page';

/**
 * 抢单流程测试
 * 用例 ID: E2E-EXEC-002
 * 优先级：P0
 * 
 * 流程：抢单大厅 → 查看订单详情 → 抢单 → 抢单成功
 */
test.describe('抢单流程', () => {
  let homePage: ExecutorHomePage;
  let orderHallPage: OrderHallPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    orderHallPage = new OrderHallPage(page);
    
    // 前置条件：已登录
    await page.goto('/executor/home');
    await homePage.waitForLoad();
  });

  test('E2E-EXEC-002-01: 查看可抢订单列表', async ({ page }) => {
    // 1. 进入抢单大厅
    await homePage.goToOrderHall();
    await orderHallPage.goto();
    
    // 2. 验证订单列表加载
    const orders = await orderHallPage.getOrderCards();
    expect(orders.length).toBeGreaterThan(0);
  });

  test('E2E-EXEC-002-02: 查看订单详情', async ({ page }) => {
    // 1. 进入抢单大厅
    await orderHallPage.goto();
    
    // 2. 查看第一个订单详情
    await orderHallPage.viewOrderDetail(0);
    
    // 3. 验证详情内容显示
    await expect(orderHallPage.orderDetailContent).toBeVisible();
    
    // 4. 关闭详情
    await orderHallPage.closeDetail();
  });

  test('E2E-EXEC-002-03: 筛选订单 - 按距离', async ({ page }) => {
    // 1. 进入抢单大厅
    await orderHallPage.goto();
    
    // 2. 按距离筛选
    await orderHallPage.filterByDistance('5km 内');
    
    // 3. 验证筛选结果
    const orders = await orderHallPage.getOrderCards();
    expect(orders.length).toBeGreaterThan(0);
  });

  test('E2E-EXEC-002-04: 刷新订单列表', async ({ page }) => {
    // 1. 进入抢单大厅
    await orderHallPage.goto();
    
    // 2. 获取刷新前订单数
    const beforeRefresh = await orderHallPage.getOrderCards();
    
    // 3. 刷新订单
    await orderHallPage.refreshOrders();
    
    // 4. 获取刷新后订单数
    const afterRefresh = await orderHallPage.getOrderCards();
    
    // 5. 验证刷新成功（列表更新）
    expect(afterRefresh.length).toBeGreaterThanOrEqual(beforeRefresh.length);
  });

  test('E2E-EXEC-002-05: 抢单成功', async ({ page }) => {
    // 1. 进入抢单大厅
    await orderHallPage.goto();
    
    // 2. 等待订单列表加载
    const orders = await orderHallPage.getOrderCards();
    expect(orders.length).toBeGreaterThan(0);
    
    // 3. 点击第一个订单抢单
    await orderHallPage.grabOrder();
    
    // 4. 等待抢单成功提示
    const success = await orderHallPage.waitForGrabSuccess();
    expect(success).toBeTruthy();
    
    // 5. 验证成功消息
    const message = await orderHallPage.getSuccessMessage();
    expect(message).toContain('抢单成功');
  });

  test('E2E-EXEC-002-06: 抢单失败 - 订单已被抢', async ({ page }) => {
    // 1. 进入抢单大厅
    await orderHallPage.goto();
    
    // 2. 模拟抢一个已被抢的订单
    // 这里需要 mock 数据或选择特定状态的订单
    // 暂时跳过具体实现
    test.skip();
  });

  test('E2E-EXEC-002-07: 抢单失败 - 资质不符', async ({ page }) => {
    // 1. 使用资质不符的账号登录
    // 2. 尝试抢单
    // 3. 验证资质不符提示
    test.skip();
  });
});
