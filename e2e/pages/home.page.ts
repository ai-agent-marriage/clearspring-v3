import { Page, Locator } from '@playwright/test';

export class HomePage {
  readonly page: Page;
  readonly serviceList: Locator;
  readonly serviceItem: Locator;
  readonly navToProfile: Locator;
  readonly navToOrder: Locator;

  constructor(page: Page) {
    this.page = page;
    this.serviceList = page.getByTestId('service-list');
    this.serviceItem = page.getByTestId('service-item');
    this.navToProfile = page.getByRole('tab', { name: /我的/i });
    this.navToOrder = page.getByRole('tab', { name: /订单/i });
  }

  async goto() {
    await this.page.goto('/home');
  }

  async viewServiceList() {
    await this.serviceList.waitFor({ state: 'visible' });
    return this.serviceList.isVisible();
  }

  async selectService(index: number = 0) {
    const services = await this.serviceItem.all();
    if (services[index]) {
      await services[index].click();
    }
  }

  async goToProfile() {
    await this.navToProfile.click();
  }

  async goToOrder() {
    await this.navToOrder.click();
  }
}
