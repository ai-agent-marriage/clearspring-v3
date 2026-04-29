import { Page, Locator, expect } from '@playwright/test';

/**
 * 执行者端 - 首页 Page Object
 */
export class ExecutorHomePage {
  readonly page: Page;
  readonly welcomeMessage: Locator;
  readonly orderHallButton: Locator;
  readonly taskAssistantButton: Locator;
  readonly incomeButton: Locator;
  readonly qualificationButton: Locator;
  readonly messageButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.welcomeMessage = page.getByTestId('welcome-message');
    this.orderHallButton = page.getByRole('button', { name: /抢单大厅/i });
    this.taskAssistantButton = page.getByRole('button', { name: /任务助手/i });
    this.incomeButton = page.getByRole('button', { name: /收入管理/i });
    this.qualificationButton = page.getByRole('button', { name: /资质管理/i });
    this.messageButton = page.getByRole('button', { name: /消息中心/i });
  }

  async goto() {
    await this.page.goto('/pages/executor-home/executor-home');
  }

  async verifyHomePageLoaded() {
    await expect(this.welcomeMessage).toBeVisible();
    await expect(this.orderHallButton).toBeVisible();
  }

  async goToOrderHall() {
    await this.orderHallButton.click();
  }

  async goToTaskAssistant() {
    await this.taskAssistantButton.click();
  }

  async goToIncome() {
    await this.incomeButton.click();
  }

  async goToQualification() {
    await this.qualificationButton.click();
  }
}
