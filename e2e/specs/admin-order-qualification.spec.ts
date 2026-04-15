import { test, expect } from '../fixtures/test-fixtures';
import { AdminDashboardPage } from '../pages/admin-dashboard.page';
import { AdminOrderManagementPage } from '../pages/admin-order.page';
import { AdminQualificationAuditPage } from '../pages/admin-qualification.page';

/**
 * P0 - 管理端订单管理与资质审核流程
 * 测试用例：TC006
 * 流程：管理后台首页 → 订单管理 → 资质审核
 */
test.describe('P0 - 管理端订单与审核', () => {
  let dashboardPage: AdminDashboardPage;
  let orderPage: AdminOrderManagementPage;
  let qualificationPage: AdminQualificationAuditPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new AdminDashboardPage(page);
    orderPage = new AdminOrderManagementPage(page);
    qualificationPage = new AdminQualificationAuditPage(page);
  });

  test('TC006 - 管理后台首页 → 订单管理 → 资质审核', async ({ page }) => {
    // 步骤 1: 登录管理后台并进入首页
    test.step('登录管理后台', async () => {
      await dashboardPage.goto();
      await dashboardPage.viewDashboard();
      await page.screenshot({ path: 'test-results/tc006-admin-dashboard.png' });
    });

    // 步骤 2: 查看数据统计
    test.step('查看数据统计', async () => {
      await dashboardPage.verifyDashboardData();
      await expect(dashboardPage.totalOrders).toBeVisible();
      await expect(dashboardPage.totalExecutors).toBeVisible();
      await expect(dashboardPage.totalRevenue).toBeVisible();
    });

    // 步骤 3: 进入订单管理
    test.step('进入订单管理', async () => {
      await dashboardPage.goToOrderManagement();
      await orderPage.viewOrderList();
      await page.screenshot({ path: 'test-results/tc006-order-list.png' });
    });

    // 步骤 4: 查看订单详情
    test.step('查看订单详情', async () => {
      await orderPage.viewOrderDetail(0);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tc006-order-detail.png' });
    });

    // 步骤 5: 进入资质审核
    test.step('进入资质审核', async () => {
      await page.goBack();
      await dashboardPage.goto();
      await dashboardPage.goToQualificationAudit();
      await qualificationPage.viewAuditList();
      await page.screenshot({ path: 'test-results/tc006-audit-list.png' });
    });

    // 步骤 6: 查看资质申请资料
    test.step('查看资质资料', async () => {
      await qualificationPage.viewDocuments(0);
      await page.waitForTimeout(1000);
      await page.screenshot({ path: 'test-results/tc006-documents-preview.png' });
    });
  });

  test('TC006-ALT - 订单筛选功能验证', async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.goToOrderManagement();
    
    // 验证筛选功能
    await expect(orderPage.filterStatus).toBeVisible();
    await expect(orderPage.searchBox).toBeVisible();
    
    // 测试状态筛选
    await orderPage.filterByStatus('pending');
    await page.waitForTimeout(1000);
    
    await page.screenshot({ path: 'test-results/tc006-alt-order-filter.png' });
  });
});
