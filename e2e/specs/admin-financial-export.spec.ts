import { test, expect } from '../fixtures/test-fixtures';
import { AdminDashboardPage } from '../pages/admin-dashboard.page';
import { AdminFinancialReportPage } from '../pages/admin-financial.page';

/**
 * P0 - 管理端财务报表与数据导出流程
 * 测试用例：TC007
 * 流程：财务报表 → 数据导出
 */
test.describe('P0 - 管理端财务报表', () => {
  let dashboardPage: AdminDashboardPage;
  let financialPage: AdminFinancialReportPage;

  test.beforeEach(async ({ page }) => {
    dashboardPage = new AdminDashboardPage(page);
    financialPage = new AdminFinancialReportPage(page);
  });

  test('TC007 - 财务报表 → 数据导出', async ({ page }) => {
    // 步骤 1: 登录管理后台
    test.step('登录管理后台', async () => {
      await dashboardPage.goto();
      await dashboardPage.viewDashboard();
      await page.screenshot({ path: 'test-results/tc007-admin-dashboard.png' });
    });

    // 步骤 2: 进入财务报表页面
    test.step('进入财务报表', async () => {
      await dashboardPage.goToFinancialReport();
      await financialPage.viewFinancialReport();
      await page.screenshot({ path: 'test-results/tc007-financial-report.png' });
    });

    // 步骤 3: 查看财务数据
    test.step('查看财务数据', async () => {
      await financialPage.verifyReportData();
      await expect(financialPage.totalRevenue).toBeVisible();
      await expect(financialPage.totalExpense).toBeVisible();
      await expect(financialPage.netProfit).toBeVisible();
    });

    // 步骤 4: 选择时间范围
    test.step('选择时间范围', async () => {
      // 默认选择最近 30 天（实际测试中可能需要具体日期）
      await page.screenshot({ path: 'test-results/tc007-date-range.png' });
    });

    // 步骤 5: 导出数据
    test.step('导出数据', async () => {
      await financialPage.exportData('xlsx');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: 'test-results/tc007-export.png' });
    });

    // 步骤 6: 验证导出成功
    test.step('验证导出成功', async () => {
      await financialPage.verifyExportSuccess();
    });
  });

  test('TC007-ALT - 财务报表数据验证', async ({ page }) => {
    await dashboardPage.goto();
    await dashboardPage.goToFinancialReport();
    
    // 验证报表元素
    await expect(financialPage.revenueChart).toBeVisible();
    await expect(financialPage.reportTable).toBeVisible();
    await expect(financialPage.dateRangePicker).toBeVisible();
    await expect(financialPage.exportButton).toBeVisible();
    
    await page.screenshot({ path: 'test-results/tc007-alt-report-elements.png' });
  });
});
