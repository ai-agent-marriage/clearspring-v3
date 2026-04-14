import { Page, Locator } from '@playwright/test';

export class OrderPage {
  readonly page: Page;
  readonly serviceDetail: Locator;
  readonly orderForm: Locator;
  readonly submitOrderButton: Locator;
  readonly paymentButton: Locator;
  readonly orderSuccess: Locator;
  readonly orderList: Locator;
  readonly orderItem: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceDetail = page.getByTestId('service-detail');
    this.orderForm = page.getByTestId('order-form');
    this.submitOrderButton = page.getByRole('button', { name: /提交订单/i });
    this.paymentButton = page.getByRole('button', { name: /支付/i });
    this.orderSuccess = page.getByTestId('order-success');
    this.orderList = page.getByTestId('order-list');
    this.orderItem = page.getByTestId('order-item');
  }

  async goto() {
    await this.page.goto('/order');
  }

  async fillOrderForm(data: {
    serviceName?: string;
    address?: string;
    phone?: string;
    remark?: string;
  }) {
    if (data.serviceName) {
      await this.page.getByPlaceholder(/服务名称/i).fill(data.serviceName);
    }
    if (data.address) {
      await this.page.getByPlaceholder(/地址/i).fill(data.address);
    }
    if (data.phone) {
      await this.page.getByPlaceholder(/手机号/i).fill(data.phone);
    }
    if (data.remark) {
      await this.page.getByPlaceholder(/备注/i).fill(data.remark);
    }
  }

  async submitOrder() {
    await this.submitOrderButton.click();
  }

  async simulatePayment() {
    await this.paymentButton.click();
    await this.orderSuccess.waitFor({ state: 'visible' });
  }

  async isSuccess(): Promise<boolean> {
    return this.orderSuccess.isVisible();
  }

  async viewOrderList() {
    await this.orderList.waitFor({ state: 'visible' });
    return this.orderList.isVisible();
  }

  async selectOrder(index: number = 0) {
    const orders = await this.orderItem.all();
    if (orders[index]) {
      await orders[index].click();
    }
  }
}
