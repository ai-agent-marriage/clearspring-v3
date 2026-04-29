import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly userProfile: Locator;
  readonly myOrdersButton: Locator;
  readonly myInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userProfile = page.getByTestId('user-profile');
    this.myOrdersButton = page.getByRole('button', { name: /我的订单/i });
    this.myInfo = page.getByTestId('my-info');
  }

  async goto() {
    await this.page.goto('/profile');
  }

  async viewProfile() {
    await this.userProfile.waitFor({ state: 'visible' });
    return this.userProfile.isVisible();
  }

  async goToMyOrders() {
    await this.myOrdersButton.click();
  }

  async viewMyInfo() {
    await this.myInfo.waitFor({ state: 'visible' });
    return this.myInfo.isVisible();
  }
}
