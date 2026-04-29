import { Page, Locator, expect } from '@playwright/test';

/**
 * 执行者端 - 任务助手与证据提交 Page Object
 */
export class ExecutorTaskAssistantPage {
  readonly page: Page;
  readonly taskTitle: Locator;
  readonly taskDescription: Locator;
  readonly taskRequirements: Locator;
  readonly uploadEvidenceButton: Locator;
  readonly submitEvidenceButton: Locator;
  readonly evidenceList: Locator;
  readonly cameraButton: Locator;
  readonly galleryButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.taskTitle = page.getByTestId('task-title');
    this.taskDescription = page.getByTestId('task-description');
    this.taskRequirements = page.getByTestId('task-requirements');
    this.uploadEvidenceButton = page.getByRole('button', { name: /上传证据/i });
    this.submitEvidenceButton = page.getByRole('button', { name: /提交证据/i });
    this.evidenceList = page.getByTestId('evidence-list');
    this.cameraButton = page.getByRole('button', { name: /拍照/i });
    this.galleryButton = page.getByRole('button', { name: /相册/i });
  }

  async goto(taskId?: string) {
    const url = taskId 
      ? `/pages/executor-assistant/executor-assistant?id=${taskId}`
      : '/pages/executor-assistant/executor-assistant';
    await this.page.goto(url);
  }

  async viewTaskDetail() {
    await this.taskTitle.waitFor({ state: 'visible' });
    await this.taskDescription.waitFor({ state: 'visible' });
  }

  async uploadEvidence(evidenceType: 'photo' | 'video' | 'file') {
    await this.uploadEvidenceButton.click();
    if (evidenceType === 'photo') {
      await this.cameraButton.click();
    } else if (evidenceType === 'video') {
      await this.page.getByRole('button', { name: /视频/i }).click();
    } else {
      await this.galleryButton.click();
    }
  }

  async submitEvidence() {
    await this.submitEvidenceButton.click();
  }

  async verifyEvidenceUploaded(count: number) {
    const items = await this.evidenceList.locator('>*').all();
    expect(items.length).toBeGreaterThanOrEqual(count);
  }

  async verifySubmitSuccess() {
    await expect(this.page.getByText(/提交成功/i)).toBeVisible({ timeout: 5000 });
  }
}
