// 清如 ClearSpring - 执行者消息中心 O-11
/**
 * @file 执行者消息中心页面
 * @description 管理系统消息、订单通知、活动通知等
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');
const { debounce } = require('../../utils/debounce');

Page({
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

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.loadMessages();
  },

  /**
   * 页面显示
   */
  onShow() {
    // 页面显示时刷新未读数
    this.updateUnreadCount();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadMessages(true).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 触底加载更多
   */
  onReachBottom() {
    if (this.data.hasMore) {
      this.loadMoreMessages();
    }
  },

  /**
   * 加载消息列表
   * @async
   * @param {boolean} refresh - 是否刷新
   * @returns {Promise<void>}
   */
  async loadMessages(refresh = false) {
    try {
      if (!refresh) {
        ErrorHandler.showLoading('加载中...');
      }
      
      // TODO: 调用云函数获取消息列表
      // const res = await wx.cloud.callFunction({
      //   name: 'getExecutorMessages',
      //   data: {
      //     page: refresh ? 1 : this.data.page,
      //     pageSize: this.data.pageSize,
      //     type: this.data.currentTab === 'all' ? undefined : this.data.currentTab
      //   }
      // });

      // 模拟数据
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
          
          // 按类型过滤
          if (this.data.currentTab !== 'all') {
            messages = messages.filter(msg => msg.type === this.data.currentTab);
          }
          
          this.setData({
            allMessages: mockMessages,
            filteredMessages: messages,
            page: refresh ? 1 : this.data.page,
            hasMore: refresh ? mockMessages.length >= this.data.pageSize : false
          });
          
          this.updateUnreadCount();
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('加载消息失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadMessages',
        showToast: true
      });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  /**
   * 加载更多消息
   * @async
   */
  async loadMoreMessages() {
    this.setData({ page: this.data.page + 1 });
    await this.loadMessages();
  },

  /**
   * 更新未读数
   */
  updateUnreadCount() {
    const messages = this.data.allMessages;
    const totalUnread = messages.filter(msg => !msg.isRead).length;
    const systemUnread = messages.filter(msg => !msg.isRead && msg.type === 'system').length;
    const orderUnread = messages.filter(msg => !msg.isRead && msg.type === 'order').length;
    const activityUnread = messages.filter(msg => !msg.isRead && msg.type === 'activity').length;

    this.setData({
      totalUnread,
      systemUnread,
      orderUnread,
      activityUnread
    });
  },

  /**
   * 切换 Tab（防抖处理）
   * @param {Event} e - 点击事件
   */
  onSwitchTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ currentTab: tab, page: 1 });
    this.loadMessages(true);
  },

  /**
   * 消息点击
   * @param {Event} e - 点击事件
   */
  onMessageTap(e) {
    const messageId = e.currentTarget.dataset.id;
    const message = this.data.allMessages.find(msg => msg.id === messageId);
    
    if (message) {
      // 标记为已读
      this.markMessageAsRead(messageId);
      
      // 跳转到消息详情页
      wx.navigateTo({
        url: `/pages/executor-message-detail/executor-message-detail?id=${messageId}`
      });
    }
  },

  /**
   * 标记消息为已读
   * @param {string} messageId - 消息 ID
   */
  markMessageAsRead(messageId) {
    const messages = this.data.allMessages.map(msg => {
      if (msg.id === messageId) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    
    this.setData({ allMessages: messages });
    this.updateUnreadCount();
    
    // TODO: 调用云函数标记已读
  },

  /**
   * 全部已读
   */
  onMarkAllRead() {
    wx.showModal({
      title: '确认操作',
      content: '确定要将所有消息标记为已读吗？',
      success: (res) => {
        if (res.confirm) {
          const messages = this.data.allMessages.map(msg => ({ ...msg, isRead: true }));
          this.setData({ allMessages: messages, filteredMessages: messages });
          this.updateUnreadCount();
          
          // TODO: 调用云函数全部标记已读
          wx.showToast({
            title: '已全部标记为已读',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 清空消息
   */
  onClearMessages() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有消息吗？此操作不可恢复。',
      confirmText: '清空',
      confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用云函数清空消息
          this.setData({
            allMessages: [],
            filteredMessages: [],
            totalUnread: 0,
            systemUnread: 0,
            orderUnread: 0,
            activityUnread: 0
          });
          
          wx.showToast({
            title: '已清空',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 切换到 Tab
   * @param {string} tab - Tab 类型
   */
  switchTab(tab) {
    this.setData({ currentTab: tab });
    this.loadMessages(true);
  }
});
