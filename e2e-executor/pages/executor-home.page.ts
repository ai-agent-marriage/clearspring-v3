import { Page, Locator } from '@playwright/test';

/**
 * 执行者首页
 * 展示：抢单入口、任务助手、收入概览、消息通知
 */
export class ExecutorHomePage {
  readonly page: Page;
  
  // 导航元素
  readonly orderHallTab: Locator;
  readonly taskAssistantTab: Locator;
  readonly incomeTab: Locator;
  readonly messageTab: Locator;
  readonly profileTab: Locator;
  
  // 抢单区域
  readonly grabOrderButton: Locator;
  readonly availableOrders: Locator;
  readonly orderCard: Locator;
  
  // 任务区域
  readonly activeTask: Locator;
  readonly startTaskButton: Locator;
  
  // 收入概览
  readonly incomeSummary: Locator;
  readonly totalIncome: Locator;
  readonly pendingIncome: Locator;
  
  // 消息通知
  readonly notificationBadge: Locator;
  readonly unreadCount: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 底部导航
    this.orderHallTab = page.getByRole('tab', { name: /抢单 | 大厅 | 订单/i });
    this.taskAssistantTab = page.getByRole('tab', { name: /任务 | 助手/i });
    this.incomeTab = page.getByRole('tab', { name: /收入 | 钱包/i });
    this.messageTab = page.getByRole('tab', { name: /消息 | 通知/i });
    this.profileTab = page.getByRole('tab', { name: /我的 | 个人/i });
    
    // 抢单元素
    this.grabOrderButton = page.getByRole('button', { name: /抢单 | 立即抢/i });
    this.availableOrders = page.locator('.order-list, .available-orders');
    this.orderCard = page.locator('.order-card, .order-item');
    
    // 任务元素
    this.activeTask = page.locator('.active-task, .task-card');
    this.startTaskButton = page.getByRole('button', { name: /开始任务 | 前往/i });
    
    // 收入元素
    this.incomeSummary = page.locator('.income-summary');
    this.totalIncome = page.getByText(/总收入 | 累计收入/i);
    this.pendingIncome = page.getByText(/待结算 | 可提现/i);
    
    // 消息元素
    this.notificationBadge = page.locator('.badge, .notification-dot');
    this.unreadCount = page.getByText(/\d+\+?/).first();
  }

  /**
   * 访问首页
   */
  async goto() {
    await this.page.goto('/executor/home');
  }

  /**
   * 点击抢单大厅
   */
  async goToOrderHall() {
    await this.orderHallTab.click();
  }

  /**
   * 点击任务助手
   */
  async goToTaskAssistant() {
    await this.taskAssistantTab.click();
  }

  /**
   * 点击收入管理
   */
  async goToIncome() {
    await this.incomeTab.click();
  }

  /**
   * 点击消息中心
   */
  async goToMessages() {
    await this.messageTab.click();
  }

  /**
   * 查看可抢订单列表
   */
  async getAvailableOrders() {
    await this.availableOrders.waitFor({ state: 'visible', timeout: 5000 });
    return this.orderCard.all();
  }

  /**
   * 等待首页加载完成
   */
  async waitForLoad() {
    await this.incomeSummary.waitFor({ state: 'visible', timeout: 5000 });
  }
}
