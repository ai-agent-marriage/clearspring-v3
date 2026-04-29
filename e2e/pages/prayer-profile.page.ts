import { Page, Locator, expect } from '@playwright/test';

/**
 * 祈福者端 - 个人中心 Page Object
 */
export class PrayerProfilePage {
  readonly page: Page;
  readonly userInfo: Locator;
  readonly userAvatar: Locator;
  readonly userName: Locator;
  readonly myOrders: Locator;
  readonly myCertificates: Locator;
  readonly settings: Locator;
  readonly helpCenter: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userInfo = page.getByTestId('user-info');
    this.userAvatar = page.getByTestId('user-avatar');
    this.userName = page.getByTestId('user-name');
    this.myOrders = page.getByRole('button', { name: /我的订单/i });
    this.myCertificates = page.getByRole('button', { name: /我的证书/i });
    this.settings = page.getByRole('button', { name: /设置/i });
    this.helpCenter = page.getByRole('button', { name: /帮助中心/i });
  }

  async goto() {
    await this.page.goto('/pages/profile/profile');
  }

  async viewProfile() {
    await this.userInfo.waitFor({ state: 'visible' });
  }

  async goToMyOrders() {
    await this.myOrders.click();
  }

  async goToMyCertificates() {
    await this.myCertificates.click();
  }

  async verifyUserInfoDisplayed(expectedName?: string) {
    await expect(this.userAvatar).toBeVisible();
    if (expectedName) {
      await expect(this.userName).toContainText(expectedName);
    }
  }
}
