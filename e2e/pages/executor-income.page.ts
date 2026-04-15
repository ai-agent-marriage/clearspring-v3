import { Page, Locator, expect } from '@playwright/test';

/**
 * 执行者端 - 收入管理 Page Object
 */
export class ExecutorIncomePage {
  readonly page: Page;
  readonly totalIncome: Locator;
  readonly monthIncome: Locator;
  readonly incomeList: Locator;
  readonly incomeItem: Locator;
  readonly incomeAmount: Locator;
  readonly incomeDate: Locator;
  readonly incomeStatus: Locator;
  readonly withdrawButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.totalIncome = page.getByTestId('total-income');
    this.monthIncome = page.getByTestId('month-income');
    this.incomeList = page.getByTestId('income-list');
    this.incomeItem = page.getByTestId('income-item');
    this.incomeAmount = page.getByTestId('income-amount');
    this.incomeDate = page.getByTestId('income-date');
    this.incomeStatus = page.getByTestId('income-status');
    this.withdrawButton = page.getByRole('button', { name: /提现/i });
  }

  async goto() {
    await this.page.goto('/pages/executor-income/income');
  }

  async viewIncomeSummary() {
    await this.totalIncome.waitFor({ state: 'visible' });
    await this.monthIncome.waitFor({ state: 'visible' });
  }

  async viewIncomeList() {
    await this.incomeList.waitFor({ state: 'visible' });
    return this.incomeList.isVisible();
  }

  async verifyIncomeData(expectedTotal?: string) {
    if (expectedTotal) {
      await expect(this.totalIncome).toContainText(expectedTotal);
    }
    await expect(this.incomeList).toBeVisible();
  }

  async goToWithdraw() {
    await this.withdrawButton.click();
  }
}
