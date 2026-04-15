import { Page, Locator, expect } from '@playwright/test';

/**
 * 物种查询与详情 Page Object
 */
export class SpeciesPage {
  readonly page: Page;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly speciesList: Locator;
  readonly speciesItem: Locator;
  readonly speciesName: Locator;
  readonly speciesImage: Locator;
  readonly speciesDescription: Locator;
  readonly protectButton: Locator; // 委托保护按钮
  readonly backButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchBox = page.getByPlaceholder(/搜索物种/i);
    this.searchButton = page.getByRole('button', { name: /搜索/i });
    this.speciesList = page.getByTestId('species-list');
    this.speciesItem = page.getByTestId('species-item');
    this.speciesName = page.getByTestId('species-name');
    this.speciesImage = page.getByTestId('species-image');
    this.speciesDescription = page.getByTestId('species-description');
    this.protectButton = page.getByRole('button', { name: /委托保护/i });
    this.backButton = page.getByRole('button', { name: /返回/i });
  }

  async goto() {
    await this.page.goto('/pages/wiki/wiki');
  }

  async searchSpecies(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.searchButton.click();
  }

  async viewSpeciesList() {
    await this.speciesList.waitFor({ state: 'visible' });
    return this.speciesList.isVisible();
  }

  async selectSpecies(index: number = 0) {
    const items = await this.speciesItem.all();
    if (items[index]) {
      await items[index].click();
    }
  }

  async viewSpeciesDetail() {
    await this.speciesName.waitFor({ state: 'visible' });
    await this.speciesImage.waitFor({ state: 'visible' });
    await this.speciesDescription.waitFor({ state: 'visible' });
  }

  async goToProtectService() {
    await this.protectButton.click();
  }

  async verifyDetailPage(keyword: string) {
    await expect(this.speciesName).toContainText(keyword);
  }
}
