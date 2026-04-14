import { Page, Locator } from '@playwright/test';

/**
 * 抢单大厅页面
 * 流程：抢单大厅 → 查看订单详情 → 抢单 → 抢单成功
 */
export class OrderHallPage {
  readonly page: Page;
  
  // 筛选元素
  readonly distanceFilter: Locator;
  readonly priceFilter: Locator;
  readonly statusFilter: Locator;
  readonly refreshButton: Locator;
  
  // 订单列表
  readonly orderList: Locator;
  readonly orderCard: Locator;
  readonly orderTitle: Locator;
  readonly orderPrice: Locator;
  readonly orderDistance: Locator;
  readonly orderLocation: Locator;
  
  // 订单详情
  readonly orderDetailModal: Locator;
  readonly orderDetailContent: Locator;
  readonly viewDetailButton: Locator;
  readonly closeButton: Locator;
  
  // 抢单操作
  readonly grabOrderButton: Locator;
  readonly confirmGrabButton: Locator;
  readonly grabSuccessToast: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 筛选器
    this.distanceFilter = page.getByRole('button', { name: /距离 | 附近/i });
    this.priceFilter = page.getByRole('button', { name: /价格 | 金额/i });
    this.statusFilter = page.getByRole('button', { name: /状态 | 类型/i });
    this.refreshButton = page.getByRole('button', { name: /刷新 | 更新/i });
    
    // 订单列表
    this.orderList = page.locator('.order-list, .available-orders');
    this.orderCard = page.locator('.order-card, .order-item');
    this.orderTitle = page.locator('.order-title, .order-name');
    this.orderPrice = page.locator('.order-price, .price');
    this.orderDistance = page.locator('.order-distance, .distance');
    this.orderLocation = page.locator('.order-location, .location');
    
    // 订单详情
    this.orderDetailModal = page.locator('.modal, .dialog, .popup');
    this.orderDetailContent = page.locator('.order-detail-content');
    this.viewDetailButton = page.getByRole('button', { name: /查看详情 | 查看/i });
    this.closeButton = page.getByRole('button', { name: /关闭 | 取消/i });
    
    // 抢单按钮
    this.grabOrderButton = page.getByRole('button', { name: /抢单 | 立即抢 | 接单/i });
    this.confirmGrabButton = page.getByRole('button', { name: /确认抢单 | 确定接单/i });
    this.grabSuccessToast = page.locator('.toast, .success-message').filter({ hasText: /抢单成功 | 接单成功/i });
  }

  /**
   * 访问抢单大厅
   */
  async goto() {
    await this.page.goto('/executor/order-hall');
  }

  /**
   * 筛选订单
   */
  async filterByDistance(distance: string) {
    await this.distanceFilter.click();
    await this.page.getByText(distance).click();
  }

  /**
   * 刷新订单列表
   */
  async refreshOrders() {
    await this.refreshButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 获取订单列表
   */
  async getOrderCards() {
    await this.orderList.waitFor({ state: 'visible', timeout: 5000 });
    return this.orderCard.all();
  }

  /**
   * 查看订单详情
   */
  async viewOrderDetail(orderIndex: number = 0) {
    const cards = await this.getOrderCards();
    if (cards.length > orderIndex) {
      await cards[orderIndex].click();
      await this.orderDetailModal.waitFor({ state: 'visible', timeout: 3000 });
    }
  }

  /**
   * 关闭订单详情
   */
  async closeDetail() {
    await this.closeButton.click();
    await this.orderDetailModal.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * 抢单
   */
  async grabOrder() {
    await this.grabOrderButton.click();
    // 等待确认弹窗
    await this.confirmGrabButton.waitFor({ state: 'visible', timeout: 3000 });
    await this.confirmGrabButton.click();
  }

  /**
   * 等待抢单成功
   */
  async waitForGrabSuccess() {
    await this.grabSuccessToast.waitFor({ state: 'visible', timeout: 5000 });
    return await this.grabSuccessToast.isVisible();
  }

  /**
   * 获取抢单成功消息
   */
  async getSuccessMessage() {
    await this.grabSuccessToast.waitFor({ state: 'visible', timeout: 5000 });
    return await this.grabSuccessToast.textContent();
  }
}
