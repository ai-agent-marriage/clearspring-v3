import { Page, Locator, expect } from '@playwright/test';

/**
 * 管理端 - 首页仪表盘 Page Object
 */
export class AdminDashboardPage {
  readonly page: Page;
  readonly totalOrders: Locator;
  readonly totalExecutors: Locator;
  readonly totalRevenue: Locator;
  readonly pendingAudits: Locator;
  readonly recentOrders: Locator;
  readonly orderChart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalOrders = page.getByTestId('total-orders');
    this.totalExecutors = page.getByTestId('total-executors');
    this.totalRevenue = page.getByTestId('total-revenue');
    this.pendingAudits = page.getByTestId('pending-audits');
    this.recentOrders = page.getByTestId('recent-orders');
    this.orderChart = page.getByTestId('order-chart');
  }

  async goto() {
    await this.page.goto('/pages/admin-dashboard/admin-dashboard');
  }

  async viewDashboard() {
    await this.totalOrders.waitFor({ state: 'visible' });
    await this.totalExecutors.waitFor({ state: 'visible' });
    await this.totalRevenue.waitFor({ state: 'visible' });
  }

  async verifyDashboardData() {
    await expect(this.totalOrders).toBeVisible();
    await expect(this.totalExecutors).toBeVisible();
    await expect(this.totalRevenue).toBeVisible();
  }

  async goToOrderManagement() {
    await this.page.getByRole('button', { name: /订单管理/i }).click();
  }

  async goToQualificationAudit() {
    await this.page.getByRole('button', { name: /资质审核/i }).click();
  }

  async goToFinancialReport() {
    await this.page.getByRole('button', { name: /财务报表/i }).click();
  }
}
