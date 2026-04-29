import { Page, Locator, expect } from '@playwright/test';

/**
 * 管理端 - 资质审核 Page Object
 */
export class AdminQualificationAuditPage {
  readonly page: Page;
  readonly auditList: Locator;
  readonly auditItem: Locator;
  readonly applicantName: Locator;
  readonly submitTime: Locator;
  readonly documentsPreview: Locator;
  readonly approveButton: Locator;
  readonly rejectButton: Locator;
  readonly filterStatus: Locator;

  constructor(page: Page) {
    this.page = page;
    this.auditList = page.getByTestId('audit-list');
    this.auditItem = page.getByTestId('audit-item');
    this.applicantName = page.getByTestId('applicant-name');
    this.submitTime = page.getByTestId('submit-time');
    this.documentsPreview = page.getByTestId('documents-preview');
    this.approveButton = page.getByRole('button', { name: /通过/i });
    this.rejectButton = page.getByRole('button', { name: /拒绝/i });
    this.filterStatus = page.getByTestId('filter-status');
  }

  async goto() {
    await this.page.goto('/pages/admin-qualification/admin-qualification');
  }

  async viewAuditList() {
    await this.auditList.waitFor({ state: 'visible' });
    return this.auditList.isVisible();
  }

  async filterByStatus(status: 'pending' | 'approved' | 'rejected') {
    await this.filterStatus.selectOption(status);
  }

  async viewDocuments(index: number = 0) {
    const items = await this.auditItem.all();
    if (items[index]) {
      const btn = items[index].getByRole('button', { name: /查看资料/i });
      await btn.click();
    }
  }

  async approveApplication(index: number = 0) {
    const items = await this.auditItem.all();
    if (items[index]) {
      const btn = items[index].getByRole('button', { name: /通过/i });
      await btn.click();
    }
  }

  async rejectApplication(index: number = 0, reason?: string) {
    const items = await this.auditItem.all();
    if (items[index]) {
      const btn = items[index].getByRole('button', { name: /拒绝/i });
      await btn.click();
      if (reason) {
        await this.page.getByPlaceholder(/拒绝原因/i).fill(reason);
        await this.page.getByRole('button', { name: /确认拒绝/i }).click();
      }
    }
  }

  async verifyAuditResult(expectedStatus: string) {
    await expect(this.page.getByText(expectedStatus)).toBeVisible({ timeout: 5000 });
  }
}
