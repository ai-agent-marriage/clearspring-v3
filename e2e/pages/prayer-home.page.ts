import { Page, Locator, expect } from '@playwright/test';

/**
 * 祈福者端 - 首页 Page Object
 */
export class PrayerHomePage {
  readonly page: Page;
  readonly serviceList: Locator;
  readonly serviceItem: Locator;
  readonly fanYinEntry: Locator; // 梵音入口
  readonly chanLiEntry: Locator; // 禅理入口
  readonly meritForestEntry: Locator; // 功德林入口
  readonly wikiEntry: Locator; // 百科入口
  readonly searchBox: Locator; // 搜索框

  constructor(page: Page) {
    this.page = page;
    this.serviceList = page.getByTestId('service-list');
    this.serviceItem = page.getByTestId('service-item');
    this.fanYinEntry = page.getByRole('button', { name: /梵音/i });
    this.chanLiEntry = page.getByRole('button', { name: /禅理/i });
    this.meritForestEntry = page.getByRole('button', { name: /功德林/i });
    this.wikiEntry = page.getByRole('button', { name: /百科/i });
    this.searchBox = page.getByPlaceholder(/搜索/i);
  }

  async goto() {
    await this.page.goto('/pages/index/index');
  }

  async viewServiceList() {
    await this.serviceList.waitFor({ state: 'visible', timeout: 10000 });
    return this.serviceList.isVisible();
  }

  async selectService(index: number = 0) {
    const services = await this.serviceItem.all();
    if (services[index]) {
      await services[index].click();
    }
  }

  async goToFanYin() {
    await this.fanYinEntry.click();
  }

  async goToChanLi() {
    await this.chanLiEntry.click();
  }

  async goToMeritForest() {
    await this.meritForestEntry.click();
  }

  async searchSpecies(keyword: string) {
    await this.searchBox.fill(keyword);
    await this.page.keyboard.press('Enter');
  }

  async verifyHomePageLoaded() {
    await expect(this.serviceList).toBeVisible();
    await expect(this.fanYinEntry).toBeVisible();
    await expect(this.chanLiEntry).toBeVisible();
  }
}
