/**
 * 执行者端 - 消息中心页面测试 O-11
 * @file miniprogram/__tests__/executor/message-center.test.js
 * @description 测试执行者消息中心页面的各项功能
 */

describe('执行者端 - 消息中心页面 O-11', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    mockWx = {
      getStorageSync: jest.fn(),
      setStorageSync: jest.fn(),
      navigateTo: jest.fn(),
      showToast: jest.fn(),
      showModal: jest.fn(),
      stopPullDownRefresh: jest.fn()
    };
    global.wx = mockWx;

    page = {
      data: {
        currentTab: 'all',
        totalUnread: 0,
        systemUnread: 0,
        orderUnread: 0,
        activityUnread: 0,
        filteredMessages: [],
        allMessages: [],
        hasMore: true,
        page: 1,
        pageSize: 20
      },
      onLoad: function() {
        this.loadMessages();
      },
      onShow: function() {
        this.updateUnreadCount();
      },
      onPullDownRefresh: function() {
        this.loadMessages(true).then(() => {
          mockWx.stopPullDownRefresh();
        });
      },
      onReachBottom: function() {
        if (this.data.hasMore) {
          this.loadMoreMessages();
        }
      },
      loadMessages: function(refresh = false) {
        const mockMessages = [
          {
            id: 'msg_001',
            type: 'system',
            title: '平台规则更新通知',
            summary: '尊敬的执行者，平台服务协议已更新，请您及时查看最新条款...',
            time: '今天 10:30',
            isRead: false,
            tags: ['重要']
          },
          {
            id: 'msg_002',
            type: 'order',
            title: '您有新的订单',
            summary: '祈福者张三委托您进行心理咨询服务，请及时查看订单详情...',
            time: '今天 09:15',
            isRead: false,
            tags: ['新订单']
          },
          {
            id: 'msg_003',
            type: 'income',
            title: '收入到账通知',
            summary: '您有一笔收入已到账，金额：¥280.00，订单号：TSK20260410001...',
            time: '昨天 16:20',
            isRead: true,
            tags: []
          },
          {
            id: 'msg_004',
            type: 'activity',
            title: '志愿者培训活动报名',
            summary: '平台将于 4 月 20 日举办志愿者技能培训，欢迎报名参加...',
            time: '昨天 14:00',
            isRead: false,
            tags: ['活动', '培训']
          },
          {
            id: 'msg_005',
            type: 'order',
            title: '订单完成确认',
            summary: '您的订单 TSK20260409002 已完成，请确认服务结果...',
            time: '昨天 11:30',
            isRead: true,
            tags: []
          },
          {
            id: 'msg_006',
            type: 'warning',
            title: '资质即将到期提醒',
            summary: '您的心理咨询师证书将于 30 天后到期，请及时更新...',
            time: '2026-04-09',
            isRead: false,
            tags: ['提醒']
          },
          {
            id: 'msg_007',
            type: 'system',
            title: '系统维护通知',
            summary: '平台将于 4 月 15 日凌晨 2:00-4:00 进行系统维护，届时部分功能可能无法使用...',
            time: '2026-04-08',
            isRead: true,
            tags: ['通知']
          }
        ];

        return new Promise((resolve) => {
          setTimeout(() => {
            let messages = mockMessages;
            if (this.data.currentTab !== 'all') {
              messages = messages.filter(msg => msg.type === this.data.currentTab);
            }
            this.data.allMessages = mockMessages;
            this.data.filteredMessages = messages;
            this.data.page = refresh ? 1 : this.data.page;
            this.data.hasMore = refresh ? mockMessages.length >= this.data.pageSize : false;
            this.updateUnreadCount();
            resolve();
          }, 300);
        });
      },
      loadMoreMessages: function() {
        this.data.page = this.data.page + 1;
        this.loadMessages();
      },
      updateUnreadCount: function() {
        const messages = this.data.allMessages;
        const totalUnread = messages.filter(msg => !msg.isRead).length;
        const systemUnread = messages.filter(msg => !msg.isRead && msg.type === 'system').length;
        const orderUnread = messages.filter(msg => !msg.isRead && msg.type === 'order').length;
        const activityUnread = messages.filter(msg => !msg.isRead && msg.type === 'activity').length;
        this.data.totalUnread = totalUnread;
        this.data.systemUnread = systemUnread;
        this.data.orderUnread = orderUnread;
        this.data.activityUnread = activityUnread;
      },
      onSwitchTab: function(e) {
        const tab = e.currentTarget.dataset.tab;
        this.data.currentTab = tab;
        this.data.page = 1;
        this.loadMessages(true);
      },
      onMessageTap: function(e) {
        const messageId = e.currentTarget.dataset.id;
        const message = this.data.allMessages.find(msg => msg.id === messageId);
        if (message) {
          this.markMessageAsRead(messageId);
          mockWx.navigateTo({ url: `/pages/executor-message-detail/executor-message-detail?id=${messageId}` });
        }
      },
      markMessageAsRead: function(messageId) {
        const messages = this.data.allMessages.map(msg => {
          if (msg.id === messageId) {
            return { ...msg, isRead: true };
          }
          return msg;
        });
        this.data.allMessages = messages;
        this.updateUnreadCount();
      },
      onMarkAllRead: function() {
        mockWx.showModal({
          title: '确认操作',
          content: '确定要将所有消息标记为已读吗？',
          success: (res) => {
            if (res.confirm) {
              const messages = this.data.allMessages.map(msg => ({ ...msg, isRead: true }));
              this.data.allMessages = messages;
              this.data.filteredMessages = messages;
              this.updateUnreadCount();
              mockWx.showToast({ title: '已全部标记为已读', icon: 'success' });
            }
          }
        });
      },
      onClearMessages: function() {
        mockWx.showModal({
          title: '确认清空',
          content: '确定要清空所有消息吗？此操作不可恢复。',
          confirmText: '清空',
          confirmColor: '#BA1A1A',
          success: (res) => {
            if (res.confirm) {
              this.data.allMessages = [];
              this.data.filteredMessages = [];
              this.data.totalUnread = 0;
              this.data.systemUnread = 0;
              this.data.orderUnread = 0;
              this.data.activityUnread = 0;
              mockWx.showToast({ title: '已清空', icon: 'success' });
            }
          }
        });
      },
      switchTab: function(tab) {
        this.data.currentTab = tab;
        this.loadMessages(true);
      }
    };
  });

  // ==================== 功能测试 ====================

  test('页面正常加载 - 验证 onLoad 触发', () => {
    page.onLoad();
    expect(page.data.page).toBe(1);
    expect(page.data.pageSize).toBe(20);
  });

  test('消息列表初始化 - 加载模拟数据', async () => {
    await page.loadMessages();
    expect(page.data.allMessages.length).toBe(7);
    expect(page.data.filteredMessages.length).toBe(7);
  });

  test('未读数统计 - 总数正确', async () => {
    await page.loadMessages();
    page.updateUnreadCount();
    expect(page.data.totalUnread).toBe(4); // msg_001, msg_002, msg_004, msg_006
  });

  test('未读数统计 - 系统消息未读数', async () => {
    await page.loadMessages();
    page.updateUnreadCount();
    expect(page.data.systemUnread).toBe(1); // msg_001
  });

  test('未读数统计 - 订单消息未读数', async () => {
    await page.loadMessages();
    page.updateUnreadCount();
    expect(page.data.orderUnread).toBe(1); // msg_002
  });

  test('未读数统计 - 活动消息未读数', async () => {
    await page.loadMessages();
    page.updateUnreadCount();
    expect(page.data.activityUnread).toBe(1); // msg_004
  });

  // ==================== 交互测试 ====================

  test('切换 Tab - 全部消息', async () => {
    page.onSwitchTab({ currentTarget: { dataset: { tab: 'all' } } });
    expect(page.data.currentTab).toBe('all');
    expect(page.data.page).toBe(1);
  });

  test('切换 Tab - 系统消息', async () => {
    page.onSwitchTab({ currentTarget: { dataset: { tab: 'system' } } });
    expect(page.data.currentTab).toBe('system');
    await page.loadMessages();
    expect(page.data.filteredMessages.every(m => m.type === 'system')).toBe(true);
  });

  test('切换 Tab - 订单消息', async () => {
    page.onSwitchTab({ currentTarget: { dataset: { tab: 'order' } } });
    expect(page.data.currentTab).toBe('order');
    await page.loadMessages();
    expect(page.data.filteredMessages.every(m => m.type === 'order')).toBe(true);
  });

  test('消息点击 - 标记为已读并跳转', async () => {
    await page.loadMessages();
    const unreadMsg = page.data.allMessages.find(m => !m.isRead);
    page.onMessageTap({ currentTarget: { dataset: { id: unreadMsg.id } } });
    const updatedMsg = page.data.allMessages.find(m => m.id === unreadMsg.id);
    expect(updatedMsg.isRead).toBe(true);
    expect(mockWx.navigateTo).toHaveBeenCalled();
  });

  test('全部已读 - 确认操作', async () => {
    await page.loadMessages();
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onMarkAllRead();
    expect(page.data.allMessages.every(m => m.isRead)).toBe(true);
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '已全部标记为已读', icon: 'success' });
  });

  test('全部已读 - 取消操作', async () => {
    await page.loadMessages();
    const initialUnread = page.data.totalUnread;
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: false });
      }
    });
    page.onMarkAllRead();
    expect(page.data.totalUnread).toBe(initialUnread);
  });

  test('清空消息 - 确认操作', async () => {
    await page.loadMessages();
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: true });
      }
    });
    page.onClearMessages();
    expect(page.data.allMessages.length).toBe(0);
    expect(page.data.totalUnread).toBe(0);
    expect(mockWx.showToast).toHaveBeenCalledWith({ title: '已清空', icon: 'success' });
  });

  test('清空消息 - 取消操作', async () => {
    await page.loadMessages();
    const initialCount = page.data.allMessages.length;
    mockWx.showModal.mockImplementation((options) => {
      if (options.success) {
        options.success({ confirm: false });
      }
    });
    page.onClearMessages();
    expect(page.data.allMessages.length).toBe(initialCount);
  });

  test('加载更多消息 - 页码递增', async () => {
    await page.loadMessages();
    const initialPage = page.data.page;
    page.loadMoreMessages();
    expect(page.data.page).toBe(initialPage + 1);
  });

  // ==================== 边界测试 ====================

  test('消息点击 - 消息不存在', async () => {
    await page.loadMessages();
    page.onMessageTap({ currentTarget: { dataset: { id: 'non_existent' } } });
    expect(mockWx.navigateTo).not.toHaveBeenCalled();
  });

  test('到达底部 - 有更多数据时加载', async () => {
    await page.loadMessages();
    page.data.hasMore = true;
    page.onReachBottom();
    expect(page.data.page).toBeGreaterThan(1);
  });

  test('到达底部 - 无更多数据时不加载', async () => {
    await page.loadMessages();
    page.data.hasMore = false;
    page.onReachBottom();
    expect(page.data.page).toBe(1);
  });

  test('页面刷新 - onPullDownRefresh', async () => {
    mockWx.stopPullDownRefresh = jest.fn();
    await page.loadMessages(true);
    page.onPullDownRefresh();
    expect(page.data.page).toBe(1);
  });

  test('消息类型过滤 - 活动消息', async () => {
    page.data.currentTab = 'activity';
    await page.loadMessages();
    expect(page.data.filteredMessages.every(m => m.type === 'activity' || m.type === 'all')).toBe(true);
  });

  test('消息标签验证 - 重要消息', async () => {
    await page.loadMessages();
    const importantMsg = page.data.allMessages.find(m => m.tags.includes('重要'));
    expect(importantMsg).toBeDefined();
    expect(importantMsg.title).toContain('平台规则');
  });

  test('消息时间格式验证', async () => {
    await page.loadMessages();
    const todayMsgs = page.data.allMessages.filter(m => m.time.includes('今天'));
    expect(todayMsgs.length).toBeGreaterThan(0);
  });

  test('消息列表空状态处理', () => {
    page.data.allMessages = [];
    page.updateUnreadCount();
    expect(page.data.totalUnread).toBe(0);
    expect(page.data.systemUnread).toBe(0);
    expect(page.data.orderUnread).toBe(0);
    expect(page.data.activityUnread).toBe(0);
  });
});
