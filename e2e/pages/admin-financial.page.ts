import { Page, Locator, expect } from '@playwright/test';

/**
 * 管理端 - 财务报表 Page Object
 */
export class AdminFinancialReportPage {
  readonly page: Page;
  readonly totalRevenue: Locator;
  readonly totalExpense: Locator;
  readonly netProfit: Locator;
  readonly revenueChart: Locator;
  readonly dateRangePicker: Locator;
  readonly exportButton: Locator;
  readonly exportFormat: Locator;
  readonly reportTable: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalRevenue = page.getByTestId('total-revenue');
    this.totalExpense = page.getByTestId('total-expense');
    this.netProfit = page.getByTestId('net-profit');
    this.revenueChart = page.getByTestId('revenue-chart');
    this.dateRangePicker = page.getByTestId('date-range-picker');
    this.exportButton = page.getByRole('button', { name: /导出数据/i });
    this.exportFormat = page.getByTestId('export-format');
    this.reportTable = page.getByTestId('report-table');
  }

  async goto() {
    await this.page.goto('/pages/admin-financial/admin-financial');
  }

  async viewFinancialReport() {
    await this.totalRevenue.waitFor({ state: 'visible' });
    await this.totalExpense.waitFor({ state: 'visible' });
    await this.netProfit.waitFor({ state: 'visible' });
  }

  async selectDateRange(startDate: string, endDate: string) {
    await this.dateRangePicker.click();
    await this.page.getByText(startDate).click();
    await this.page.getByText(endDate).click();
  }

  async exportData(format: 'xlsx' | 'csv' | 'pdf') {
    await this.exportButton.click();
    await this.page.getByText(format.toUpperCase()).click();
  }

  async verifyExportSuccess() {
    await expect(this.page.getByText(/导出成功/i)).toBeVisible({ timeout: 5000 });
  }

  async verifyReportData() {
    await expect(this.reportTable).toBeVisible();
    await expect(this.revenueChart).toBeVisible();
  }
}
