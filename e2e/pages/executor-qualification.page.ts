import { Page, Locator, expect } from '@playwright/test';

/**
 * 执行者端 - 资质管理 Page Object
 */
export class ExecutorQualificationPage {
  readonly page: Page;
  readonly qualificationStatus: Locator;
  readonly uploadButton: Locator;
  readonly submitButton: Locator;
  readonly auditStatus: Locator;
  readonly auditTime: Locator;
  readonly documentList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.qualificationStatus = page.getByTestId('qualification-status');
    this.uploadButton = page.getByRole('button', { name: /上传资料/i });
    this.submitButton = page.getByRole('button', { name: /提交审核/i });
    this.auditStatus = page.getByTestId('audit-status');
    this.auditTime = page.getByTestId('audit-time');
    this.documentList = page.getByTestId('document-list');
  }

  async goto() {
    await this.page.goto('/pages/executor-qualification-manage/manage');
  }

  async viewQualificationStatus() {
    await this.qualificationStatus.waitFor({ state: 'visible' });
  }

  async uploadDocuments(documentType: string) {
    await this.uploadButton.click();
    await this.page.getByText(documentType).click();
  }

  async submitQualification() {
    await this.submitButton.click();
  }

  async viewAuditStatus() {
    await this.auditStatus.waitFor({ state: 'visible' });
    return this.auditStatus.textContent();
  }

  async verifyDocumentUploaded(count: number) {
    const items = await this.documentList.locator('>*').all();
    expect(items.length).toBeGreaterThanOrEqual(count);
  }
}
