import { Page, Locator } from '@playwright/test';

/**
 * 任务助手页面
 * 流程：任务助手 → 查看任务详情 → 导航到地点 → 开始任务
 */
export class TaskAssistantPage {
  readonly page: Page;
  
  // 任务列表
  readonly taskList: Locator;
  readonly taskCard: Locator;
  readonly activeTaskCard: Locator;
  readonly completedTaskCard: Locator;
  
  // 任务信息
  readonly taskTitle: Locator;
  readonly taskLocation: Locator;
  readonly taskStatus: Locator;
  readonly taskTime: Locator;
  
  // 任务详情
  readonly taskDetailModal: Locator;
  readonly taskDetailContent: Locator;
  readonly viewDetailButton: Locator;
  
  // 导航功能
  readonly navigateButton: Locator;
  readonly mapContainer: Locator;
  readonly navigationApp: Locator;
  
  // 任务操作
  readonly startTaskButton: Locator;
  readonly completeTaskButton: Locator;
  readonly submitEvidenceButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 任务列表
    this.taskList = page.locator('.task-list, .task-container');
    this.taskCard = page.locator('.task-card, .task-item');
    this.activeTaskCard = this.taskCard.filter({ hasText: /进行中 | 待执行/i });
    this.completedTaskCard = this.taskCard.filter({ hasText: /已完成 | 已结束/i });
    
    // 任务信息
    this.taskTitle = page.locator('.task-title, .task-name');
    this.taskLocation = page.locator('.task-location, .location');
    this.taskStatus = page.locator('.task-status, .status');
    this.taskTime = page.locator('.task-time, .time');
    
    // 任务详情
    this.taskDetailModal = page.locator('.modal, .dialog, .popup');
    this.taskDetailContent = page.locator('.task-detail-content');
    this.viewDetailButton = page.getByRole('button', { name: /查看详情 | 查看/i });
    
    // 导航功能
    this.navigateButton = page.getByRole('button', { name: /导航 | 前往 | 路线/i });
    this.mapContainer = page.locator('.map, .map-container');
    this.navigationApp = page.getByRole('button', { name: /高德 | 百度 | 腾讯 | 打开/i });
    
    // 任务操作
    this.startTaskButton = page.getByRole('button', { name: /开始任务 | 开始/i });
    this.completeTaskButton = page.getByRole('button', { name: /完成任务 | 完成/i });
    this.submitEvidenceButton = page.getByRole('button', { name: /提交证据 | 上传/i });
  }

  /**
   * 访问任务助手
   */
  async goto() {
    await this.page.goto('/executor/task-assistant');
  }

  /**
   * 获取任务列表
   */
  async getTaskCards() {
    await this.taskList.waitFor({ state: 'visible', timeout: 5000 });
    return this.taskCard.all();
  }

  /**
   * 获取进行中的任务
   */
  async getActiveTask() {
    await this.activeTaskCard.waitFor({ state: 'visible', timeout: 5000 });
    return this.activeTaskCard.first();
  }

  /**
   * 查看任务详情
   */
  async viewTaskDetail(taskIndex: number = 0) {
    const cards = await this.getTaskCards();
    if (cards.length > taskIndex) {
      await cards[taskIndex].click();
      await this.taskDetailModal.waitFor({ state: 'visible', timeout: 3000 });
    }
  }

  /**
   * 关闭任务详情
   */
  async closeDetail() {
    const closeButton = this.taskDetailModal.getByRole('button', { name: /关闭 | 取消/i });
    await closeButton.click();
    await this.taskDetailModal.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * 点击导航
   */
  async navigateToLocation() {
    await this.navigateButton.click();
    // 等待地图或导航应用打开
    await this.page.waitForTimeout(2000);
  }

  /**
   * 开始任务
   */
  async startTask() {
    await this.startTaskButton.click();
    // 等待确认弹窗
    const confirmButton = this.page.getByRole('button', { name: /确认开始 | 确定/i });
    await confirmButton.waitFor({ state: 'visible', timeout: 3000 });
    await confirmButton.click();
  }

  /**
   * 等待任务开始成功
   */
  async waitForTaskStarted() {
    const successToast = this.page.locator('.toast').filter({ hasText: /任务已开始 | 开始成功/i });
    await successToast.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * 前往提交证据
   */
  async goToSubmitEvidence() {
    await this.submitEvidenceButton.click();
  }
}
