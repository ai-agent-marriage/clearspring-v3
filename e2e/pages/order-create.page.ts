import { Page, Locator, expect } from '@playwright/test';

/**
 * 订单创建与确认 Page Object
 */
export class OrderCreatePage {
  readonly page: Page;
  readonly serviceName: Locator;
  readonly servicePrice: Locator;
  readonly addressInput: Locator;
  readonly phoneInput: Locator;
  readonly remarkInput: Locator;
  readonly submitButton: Locator;
  readonly totalPrice: Locator;
  readonly paymentButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceName = page.getByTestId('service-name');
    this.servicePrice = page.getByTestId('service-price');
    this.addressInput = page.getByPlaceholder(/联系地址/i);
    this.phoneInput = page.getByPlaceholder(/联系电话/i);
    this.remarkInput = page.getByPlaceholder(/备注信息/i);
    this.submitButton = page.getByRole('button', { name: /提交订单/i });
    this.totalPrice = page.getByTestId('total-price');
    this.paymentButton = page.getByRole('button', { name: /立即支付/i });
  }

  async goto() {
    await this.page.goto('/pages/order/create');
  }

  async fillOrderForm(data: {
    address?: string;
    phone?: string;
    remark?: string;
  }) {
    if (data.address) {
      await this.addressInput.fill(data.address);
    }
    if (data.phone) {
      await this.phoneInput.fill(data.phone);
    }
    if (data.remark) {
      await this.remarkInput.fill(data.remark);
    }
  }

  async submitOrder() {
    await this.submitButton.click();
  }

  async goToPayment() {
    await this.paymentButton.click();
  }

  async verifyOrderInfo(expectedService?: string) {
    if (expectedService) {
      await expect(this.serviceName).toContainText(expectedService);
    }
    await expect(this.totalPrice).toBeVisible();
  }
}
