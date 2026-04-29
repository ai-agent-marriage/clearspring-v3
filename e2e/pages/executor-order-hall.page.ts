import { Page, Locator, expect } from '@playwright/test';

/**
 * 执行者端 - 抢单大厅 Page Object
 */
export class ExecutorOrderHallPage {
  readonly page: Page;
  readonly orderList: Locator;
  readonly orderItem: Locator;
  readonly orderTitle: Locator;
  readonly orderPrice: Locator;
  readonly orderLocation: Locator;
  readonly grabButton: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderList = page.getByTestId('order-list');
    this.orderItem = page.getByTestId('order-item');
    this.orderTitle = page.getByTestId('order-title');
    this.orderPrice = page.getByTestId('order-price');
    this.orderLocation = page.getByTestId('order-location');
    this.grabButton = page.getByRole('button', { name: /抢单/i });
    this.filterButton = page.getByRole('button', { name: /筛选/i });
  }

  async goto() {
    await this.page.goto('/pages/executor-order-hall/executor-order-hall');
  }

  async viewOrderList() {
    await this.orderList.waitFor({ state: 'visible' });
    return this.orderList.isVisible();
  }

  async grabOrder(index: number = 0) {
    const items = await this.orderItem.all();
    if (items[index]) {
      const grabBtn = items[index].getByRole('button', { name: /抢单/i });
      await grabBtn.click();
    }
  }

  async verifyOrderGrabbed() {
    // 验证抢单成功提示或页面跳转
    await expect(this.page.getByText(/抢单成功/i)).toBeVisible({ timeout: 5000 });
  }

  async filterOrders(filter: string) {
    await this.filterButton.click();
    await this.page.getByText(filter).click();
  }
}
