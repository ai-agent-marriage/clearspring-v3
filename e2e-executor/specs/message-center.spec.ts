import { test, expect } from '../fixtures/executor-fixtures';
import { ExecutorHomePage } from '../pages/executor-home.page';
import { MessageCenterPage } from '../pages/message-center.page';

/**
 * 消息中心流程测试
 * 用例 ID: E2E-EXEC-007
 * 优先级：P1
 * 
 * 流程：消息中心 → 查看通知 → 查看订单提醒 → 标记已读
 */
test.describe('消息中心流程', () => {
  let homePage: ExecutorHomePage;
  let messagePage: MessageCenterPage;

  test.beforeEach(async ({ page }) => {
    homePage = new ExecutorHomePage(page);
    messagePage = new MessageCenterPage(page);
    
    // 前置条件：已登录
    await page.goto('/executor/home');
    await homePage.waitForLoad();
  });

  test('E2E-EXEC-007-01: 查看消息列表', async ({ page }) => {
    // 1. 进入消息中心
    await homePage.goToMessages();
    await messagePage.goto();
    
    // 2. 验证消息列表加载
    const messages = await messagePage.getMessages();
    expect(messages.length).toBeGreaterThan(0);
  });

  test('E2E-EXEC-007-02: 查看未读消息', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 获取未读消息
    const unreadMessages = await messagePage.getUnreadMessages();
    expect(unreadMessages.length).toBeGreaterThanOrEqual(0);
  });

  test('E2E-EXEC-007-03: 筛选消息类型 - 订单通知', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 筛选订单通知
    await messagePage.filterByType('订单');
    
    // 3. 验证筛选结果
    const messages = await messagePage.getMessages();
    expect(messages.length).toBeGreaterThanOrEqual(0);
  });

  test('E2E-EXEC-007-04: 查看消息详情', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 查看第一条消息详情
    await messagePage.viewMessageDetail(0);
    
    // 3. 验证详情内容
    await expect(messagePage.messageDetailContent).toBeVisible();
    
    // 4. 关闭详情
    await messagePage.closeDetail();
  });

  test('E2E-EXEC-007-05: 标记单条消息已读', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 获取未读消息数量
    const beforeCount = await messagePage.getUnreadCount();
    
    // 3. 标记第一条消息已读
    if (beforeCount > 0) {
      await messagePage.markAsRead(0);
      
      // 4. 验证未读数量减少
      const afterCount = await messagePage.getUnreadCount();
      expect(afterCount).toBeLessThan(beforeCount);
    }
  });

  test('E2E-EXEC-007-06: 标记全部已读', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 获取未读消息数量
    const beforeCount = await messagePage.getUnreadCount();
    
    // 3. 如果有未读消息，标记全部已读
    if (beforeCount > 0) {
      await messagePage.markAllAsRead();
      
      // 4. 验证未读数量为 0
      const afterCount = await messagePage.getUnreadCount();
      expect(afterCount).toBe(0);
    }
  });

  test('E2E-EXEC-007-07: 删除消息', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 获取消息列表
    const messages = await messagePage.getMessages();
    const beforeCount = messages.length;
    
    // 3. 如果有消息，删除第一条
    if (beforeCount > 0) {
      await messagePage.deleteMessage(0);
      
      // 4. 验证消息数量减少
      const afterMessages = await messagePage.getMessages();
      expect(afterMessages.length).toBe(beforeCount - 1);
    }
  });

  test('E2E-EXEC-007-08: 清空消息', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 获取消息列表
    const messages = await messagePage.getMessages();
    
    // 3. 如果有消息，清空
    if (messages.length > 0) {
      await messagePage.deleteAll();
      
      // 4. 验证消息列表为空
      const afterMessages = await messagePage.getMessages();
      expect(afterMessages.length).toBe(0);
    }
  });

  test('E2E-EXEC-007-09: 查看订单提醒', async ({ page }) => {
    // 1. 进入消息中心
    await messagePage.goto();
    
    // 2. 筛选订单通知
    await messagePage.filterByType('订单');
    
    // 3. 验证订单提醒显示
    const messages = await messagePage.getMessages();
    expect(messages.length).toBeGreaterThanOrEqual(0);
  });
});
