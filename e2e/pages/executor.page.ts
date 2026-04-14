import { Page, Locator } from '@playwright/test';

export class ExecutorPage {
  readonly page: Page;
  readonly executorHome: Locator;
  readonly orderHallButton: Locator;
  readonly orderList: Locator;
  readonly grabOrderButton: Locator;
  readonly submitEvidenceButton: Locator;
  readonly evidenceSuccess: Locator;

  constructor(page: Page) {
    this.page = page;
    this.executorHome = page.getByTestId('executor-home');
    this.orderHallButton = page.getByRole('button', { name: /抢单大厅/i });
    this.orderList = page.getByTestId('executor-order-list');
    this.grabOrderButton = page.getByRole('button', { name: /抢单/i });
    this.submitEvidenceButton = page.getByRole('button', { name: /提交证据/i });
    this.evidenceSuccess = page.getByTestId('evidence-success');
  }

  async goto() {
    await this.page.goto('/executor');
  }

  async goToOrderHall() {
    await this.orderHallButton.click();
    await this.orderList.waitFor({ state: 'visible' });
  }

  async grabOrder(index: number = 0) {
    const grabButtons = await this.grabOrderButton.all();
    if (grabButtons[index]) {
      await grabButtons[index].click();
    }
  }

  async submitEvidence(evidencePath?: string) {
    if (evidencePath) {
      await this.page.locator('input[type="file"]').setInputFiles(evidencePath);
    }
    await this.submitEvidenceButton.click();
    await this.evidenceSuccess.waitFor({ state: 'visible' });
  }

  async isSuccess(): Promise<boolean> {
    return this.evidenceSuccess.isVisible();
  }
}
