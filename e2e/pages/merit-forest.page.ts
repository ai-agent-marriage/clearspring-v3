import { Page, Locator, expect } from '@playwright/test';

/**
 * 功德林与证书 Page Object
 */
export class MeritForestPage {
  readonly page: Page;
  readonly projectList: Locator;
  readonly projectItem: Locator;
  readonly projectName: Locator;
  readonly projectStatus: Locator;
  readonly certificateButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.projectList = page.getByTestId('project-list');
    this.projectItem = page.getByTestId('project-item');
    this.projectName = page.getByTestId('project-name');
    this.projectStatus = page.getByTestId('project-status');
    this.certificateButton = page.getByRole('button', { name: /查看证书/i });
    this.backButton = page.getByRole('button', { name: /返回/i });
  }

  async goto() {
    await this.page.goto('/pages/merit-forest/merit-forest');
  }

  async viewProjectList() {
    await this.projectList.waitFor({ state: 'visible' });
    return this.projectList.isVisible();
  }

  async selectProject(index: number = 0) {
    const items = await this.projectItem.all();
    if (items[index]) {
      await items[index].click();
    }
  }

  async viewCertificate() {
    await this.certificateButton.click();
  }

  async verifyProjectStatus(index: number, expectedStatus: string) {
    const items = await this.projectItem.all();
    if (items[index]) {
      await expect(items[index]).toContainText(expectedStatus);
    }
  }
}
