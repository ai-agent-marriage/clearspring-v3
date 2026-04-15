import { Page, Locator, expect } from '@playwright/test';

/**
 * 管理端 - 订单管理 Page Object
 */
export class AdminOrderManagementPage {
  readonly page: Page;
  readonly orderList: Locator;
  readonly orderItem: Locator;
  readonly filterStatus: Locator;
  readonly filterDate: Locator;
  readonly searchBox: Locator;
  readonly exportButton: Locator;
  readonly detailButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderList = page.getByTestId('order-list');
    this.orderItem = page.getByTestId('order-item');
    this.filterStatus = page.getByTestId('filter-status');
    this.filterDate = page.getByTestId('filter-date');
    this.searchBox = page.getByPlaceholder(/搜索订单/i);
    this.exportButton = page.getByRole('button', { name: /导出/i });
    this.detailButton = page.getByRole('button', { name: /详情/i });
  }

  async goto() {
    await this.page.goto('/pages/admin-order/admin-order');
  }

  async viewOrderList() {
    await this.orderList.waitFor({ state: 'visible' });
    return this.orderList.isVisible();
  }

  async filterByStatus(status: string) {
    await this.filterStatus.selectOption(status);
  }

  async searchOrder(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.page.keyboard.press('Enter');
  }

  async viewOrderDetail(index: number = 0) {
    const items = await this.orderItem.all();
    if (items[index]) {
      const btn = items[index].getByRole('button', { name: /详情/i });
      await btn.click();
    }
  }

  async exportOrders() {
    await this.exportButton.click();
  }

  async verifyOrderCount(expectedCount: number) {
    const items = await this.orderItem.all();
    expect(items.length).toBe(expectedCount);
  }
}
