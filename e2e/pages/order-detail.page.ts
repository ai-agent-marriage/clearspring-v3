import { Page, Locator, expect } from '@playwright/test';

/**
 * 订单详情 Page Object
 */
export class OrderDetailPage {
  readonly page: Page;
  readonly orderNumber: Locator;
  readonly orderStatus: Locator;
  readonly serviceInfo: Locator;
  readonly executorInfo: Locator;
  readonly evidenceSection: Locator;
  readonly certificateButton: Locator;
  readonly shareButton: Locator;
  readonly contactButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.orderNumber = page.getByTestId('order-number');
    this.orderStatus = page.getByTestId('order-status');
    this.serviceInfo = page.getByTestId('service-info');
    this.executorInfo = page.getByTestId('executor-info');
    this.evidenceSection = page.getByTestId('evidence-section');
    this.certificateButton = page.getByRole('button', { name: /查看证书/i });
    this.shareButton = page.getByRole('button', { name: /分享/i });
    this.contactButton = page.getByRole('button', { name: /联系执行者/i });
  }

  async goto(orderId?: string) {
    const url = orderId 
      ? `/pages/order/detail?id=${orderId}`
      : '/pages/order/detail';
    await this.page.goto(url);
  }

  async viewOrderDetail() {
    await this.orderNumber.waitFor({ state: 'visible' });
    await this.orderStatus.waitFor({ state: 'visible' });
  }

  async viewEvidence() {
    await this.evidenceSection.waitFor({ state: 'visible' });
  }

  async viewCertificate() {
    await this.certificateButton.click();
  }

  async shareOrder() {
    await this.shareButton.click();
  }

  async verifyOrderStatus(expectedStatus: string) {
    await expect(this.orderStatus).toContainText(expectedStatus);
  }
}
