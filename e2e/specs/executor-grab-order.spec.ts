import { test, expect } from '../fixtures/test-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { ExecutorOrderHallPage } from '../pages/executor-order-hall.page';
import { ExecutorTaskAssistantPage } from '../pages/executor-task-assistant.page';

/**
 * P0 - 执行者端抢单与证据提交流程
 * 测试用例：TC004
 * 流程：执行者首页 → 抢单大厅 → 任务助手 → 证据提交
 */
test.describe('P0 - 执行者端抢单流程', () => {
  let homePage: ExecutorHomePage;
  let orderHallPage: ExecutorOrderHallPage;
  let taskAssistantPage: ExecutorTaskAssistantPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    orderHallPage = new ExecutorOrderHallPage(page);
    taskAssistantPage = new ExecutorTaskAssistantPage(page);
  });

  test('TC004 - 执行者首页 → 抢单大厅 → 抢单 → 任务助手 → 证据提交', async ({ page }) => {
    // 步骤 1: 执行者登录并进入首页
    test.step('执行者登录', async () => {
      await homePage.goto();
      await homePage.verifyHomePageLoaded();
      await page.screenshot({ path: 'test-results/tc004-executor-home.png' });
    });

    // 步骤 2: 进入抢单大厅
    test.step('进入抢单大厅', async () => {
      await homePage.goToOrderHall();
      await orderHallPage.viewOrderList();
      await page.screenshot({ path: 'test-results/tc004-order-hall.png' });
    });

    // 步骤 3: 抢单
    test.step('抢单', async () => {
      await orderHallPage.grabOrder(0);
      await orderHallPage.verifyOrderGrabbed();
      await page.screenshot({ path: 'test-results/tc004-order-grabbed.png' });
    });

    // 步骤 4: 进入任务助手
    test.step('进入任务助手', async () => {
      await taskAssistantPage.goto();
      await taskAssistantPage.viewTaskDetail();
      await page.screenshot({ path: 'test-results/tc004-task-detail.png' });
    });

    // 步骤 5: 上传证据
    test.step('上传证据', async () => {
      // 模拟上传证据（实际测试中可能需要 mock 文件上传）
      await taskAssistantPage.uploadEvidence('photo');
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tc004-evidence-upload.png' });
    });

    // 步骤 6: 提交证据
    test.step('提交证据', async () => {
      await taskAssistantPage.submitEvidence();
      await taskAssistantPage.verifySubmitSuccess();
      await page.screenshot({ path: 'test-results/tc004-evidence-submitted.png' });
    });
  });

  test('TC004-ALT - 抢单大厅订单列表验证', async ({ page }) => {
    await homePage.goto();
    await homePage.goToOrderHall();
    
    // 验证订单列表
    const listVisible = await orderHallPage.viewOrderList();
    expect(listVisible).toBe(true);
    
    // 验证订单项包含必要信息
    await expect(orderHallPage.orderTitle).toBeVisible();
    await expect(orderHallPage.orderPrice).toBeVisible();
    await expect(orderHallPage.orderLocation).toBeVisible();
    
    await page.screenshot({ path: 'test-results/tc004-alt-order-list.png' });
  });
});
