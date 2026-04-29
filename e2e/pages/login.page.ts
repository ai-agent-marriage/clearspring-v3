import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly loginButton: Locator;
  readonly authButton: Locator;
  readonly userInfo: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginButton = page.getByRole('button', { name: /登录/i });
    this.authButton = page.getByRole('button', { name: /授权/i });
    this.userInfo = page.getByTestId('user-info');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login() {
    await this.loginButton.click();
    await this.authButton.click();
    await this.userInfo.waitFor({ state: 'visible' });
  }

  async isLoggedIn(): Promise<boolean> {
    return this.userInfo.isVisible();
  }
}
