import { Page, Locator } from '@playwright/test';

/**
 * 消息中心页面
 * 流程：消息中心 → 查看通知 → 查看订单提醒 → 标记已读
 */
export class MessageCenterPage {
  readonly page: Page;
  
  // 消息分类
  readonly allTab: Locator;
  readonly orderTab: Locator;
  readonly systemTab: Locator;
  readonly notificationTab: Locator;
  
  // 消息列表
  readonly messageList: Locator;
  readonly messageItem: Locator;
  readonly unreadMessage: Locator;
  readonly readMessage: Locator;
  
  // 消息内容
  readonly messageTitle: Locator;
  readonly messageContent: Locator;
  readonly messageTime: Locator;
  readonly messageType: Locator;
  
  // 消息操作
  readonly markAsReadButton: Locator;
  readonly markAllAsReadButton: Locator;
  readonly deleteButton: Locator;
  readonly deleteAllButton: Locator;
  
  // 消息详情
  readonly messageDetailModal: Locator;
  readonly messageDetailContent: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // 消息分类
    this.allTab = page.getByRole('tab', { name: /全部 | 所有/i });
    this.orderTab = page.getByRole('tab', { name: /订单 | 通知/i });
    this.systemTab = page.getByRole('tab', { name: /系统 | 公告/i });
    this.notificationTab = page.getByRole('tab', { name: /通知 | 提醒/i });
    
    // 消息列表
    this.messageList = page.locator('.message-list, .notification-list');
    this.messageItem = page.locator('.message-item, .notification-item');
    this.unreadMessage = this.messageItem.filter({ has: page.locator('.unread, .new') });
    this.readMessage = this.messageItem.filter({ has: page.locator('.read') });
    
    // 消息内容
    this.messageTitle = page.locator('.message-title, .notification-title');
    this.messageContent = page.locator('.message-content, .notification-content');
    this.messageTime = page.locator('.message-time, .time');
    this.messageType = page.locator('.message-type, .type');
    
    // 消息操作
    this.markAsReadButton = page.getByRole('button', { name: /标记已读 | 设为已读/i });
    this.markAllAsReadButton = page.getByRole('button', { name: /全部已读 | 标记全部/i });
    this.deleteButton = page.getByRole('button', { name: /删除 | 移除/i });
    this.deleteAllButton = page.getByRole('button', { name: /清空 | 删除全部/i });
    
    // 消息详情
    this.messageDetailModal = page.locator('.modal, .dialog, .popup');
    this.messageDetailContent = page.locator('.message-detail-content');
  }

  /**
   * 访问消息中心
   */
  async goto() {
    await this.page.goto('/executor/messages');
  }

  /**
   * 获取消息列表
   */
  async getMessages() {
    await this.messageList.waitFor({ state: 'visible', timeout: 5000 });
    return this.messageItem.all();
  }

  /**
   * 获取未读消息
   */
  async getUnreadMessages() {
    await this.messageList.waitFor({ state: 'visible', timeout: 5000 });
    return this.unreadMessage.all();
  }

  /**
   * 筛选消息类型
   */
  async filterByType(type: string) {
    const tab = this.page.getByRole('tab', { name: new RegExp(type) });
    await tab.click();
    await this.page.waitForTimeout(500);
  }

  /**
   * 查看消息详情
   */
  async viewMessageDetail(index: number = 0) {
    const messages = await this.getMessages();
    if (messages.length > index) {
      await messages[index].click();
      await this.messageDetailModal.waitFor({ state: 'visible', timeout: 3000 });
    }
  }

  /**
   * 关闭消息详情
   */
  async closeDetail() {
    const closeButton = this.messageDetailModal.getByRole('button', { name: /关闭 | 返回/i });
    await closeButton.click();
    await this.messageDetailModal.waitFor({ state: 'hidden', timeout: 3000 });
  }

  /**
   * 标记单条消息已读
   */
  async markAsRead(index: number = 0) {
    const messages = await this.getMessages();
    if (messages.length > index) {
      await messages[index].locator(this.markAsReadButton).click();
    }
  }

  /**
   * 标记全部已读
   */
  async markAllAsRead() {
    await this.markAllAsReadButton.click();
    await this.page.waitForTimeout(1000);
  }

  /**
   * 删除消息
   */
  async deleteMessage(index: number = 0) {
    const messages = await this.getMessages();
    if (messages.length > index) {
      await messages[index].locator(this.deleteButton).click();
    }
  }

  /**
   * 清空消息
   */
  async deleteAll() {
    await this.deleteAllButton.click();
    // 等待确认
    const confirmButton = this.page.getByRole('button', { name: /确认 | 确定/i });
    await confirmButton.click();
  }

  /**
   * 获取未读消息数量
   */
  async getUnreadCount() {
    const count = await this.unreadMessage.count();
    return count;
  }
}
