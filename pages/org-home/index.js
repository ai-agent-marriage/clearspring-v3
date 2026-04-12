// 清如 ClearSpring - 机构端首页
/**
 * @file 机构端首页
 * @description 机构数据看板、待办事项、功能入口
 * @version 4.0.1
 * @update 2026-04-12: 添加缓存优化支持
 */

const cache = require('../../utils/cache-optimized');

Page({
  data: {
    // 机构信息
    org: {
      name: 'XX 生态护生协会',
      identity: '合规执行机构',
      audited: true,
      totalOrders: 156
    },
    // 核心数据看板
    stats: {
      pendingOrders: 5,
      todayTasks: 3,
      pendingConfirm: 2,
      completedOrders: 150
    },
    // 待办事项
    todos: [
      { type: 'audit', title: '待审核执行材料', count: 3, action: '去审核' },
      { type: 'settle', title: '待结算订单', count: 5, action: '去结算' },
      { type: 'dispute', title: '待处理用户异议', count: 1, action: '去处理' }
    ],
    // 核心功能入口
    functions: [
      { icon: '📋', name: '订单管理', path: '/pages/org-home/orders' },
      { icon: '👥', name: '志愿者管理', path: '/pages/org-home/volunteers' },
      { icon: '💰', name: '结算管理', path: '/pages/org-home/settlement' },
      { icon: '📜', name: '资质管理', path: '/pages/org-home/qualification' }
    ]
  },

  /**
   * 页面加载
   * @param {Object} options - 页面参数
   */
  onLoad(options) {
    console.log('机构端首页加载');
    this.loadOrgData();
  },

  /**
   * 页面显示
   */
  onShow() {
    // 每次显示时刷新数据
    this.refreshData();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.refreshData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载机构数据（带缓存优化）
   * @async
   * @returns {Promise<void>}
   */
  async loadOrgData() {
    try {
      wx.showLoading({ title: '加载中...', mask: true });
      
      // 使用缓存优化：先检查缓存（5 分钟有效期）
      const cacheKey = `org-data-${this.data.orgId || 'org_001'}`;
      const cached = cache.get(cacheKey, 300000); // 5 分钟缓存
      
      if (cached) {
        console.log('[缓存命中] 机构数据');
        // P2-001 性能优化：批量 setData
        this.setData({ 
          org: cached.org,
          stats: cached.stats,
          todos: cached.todos,
          loading: false,
          fromCache: true
        });
        wx.hideLoading();
        return;
      }
      
      // 缓存未命中，从云函数加载
      console.log('[缓存未命中] 从云函数加载机构数据');
      const res = await wx.cloud.callFunction({
        name: 'org-data',
        data: { 
          orgId: this.data.orgId || 'org_001',
          timestamp: Date.now()
        }
      });
      
      if (res.result && res.result.code === 0 && res.result.data) {
        const orgData = res.result.data;
        const dataToUpdate = {
          org: {
            name: orgData.orgName || orgData.name,
            identity: orgData.identity || '合规执行机构',
            audited: orgData.status === '已认证',
            totalOrders: orgData.orderCount || 0
          },
          stats: {
            pendingOrders: orgData.pendingOrders || 0,
            todayTasks: orgData.todayTasks || 0,
            pendingConfirm: orgData.pendingConfirm || 0,
            completedOrders: orgData.completedOrders || 0
          },
          todos: orgData.todos || [],
          loading: false,
          fromCache: false
        };
        
        this.setData(dataToUpdate);
        
        // 保存到缓存（5 分钟）
        cache.set(cacheKey, {
          org: dataToUpdate.org,
          stats: dataToUpdate.stats,
          todos: dataToUpdate.todos
        }, 300000);
        
        wx.hideLoading();
      } else {
        throw new Error(res.result?.msg || '数据加载失败');
      }
    } catch (error) {
      console.error('加载机构数据失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '加载失败，请重试',
        icon: 'none',
        duration: 2000
      });
      
      // 记录错误日志
      wx.cloud.callFunction({
        name: 'log-error',
        data: { 
          error: error.message, 
          page: 'org-home-index',
          timestamp: Date.now()
        }
      });
      
      this.setData({ loading: false });
    }
  },

  /**
   * 刷新数据
   * @async
   * @returns {Promise<void>}
   */
  async refreshData() {
    try {
      wx.showLoading({ title: '刷新中...', mask: true });
      await this.loadOrgData();
      wx.hideLoading();
      console.log('数据刷新完成');
    } catch (error) {
      wx.hideLoading();
      console.error('刷新数据失败:', error);
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
  },

  /**
   * 切换为祈福者视角
   */
  onSwitchToProtect() {
    wx.showModal({
      title: '切换视角',
      content: '确定要切换为祈福者视角吗？',
      success: (res) => {
        if (res.confirm) {
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    });
  },

  /**
   * 点击待办事项
   * @param {Event} e - 点击事件
   */
  onTodoTap(e) {
    const { type, action } = e.currentTarget.dataset;
    console.log('点击待办:', type, action);
    
    switch (type) {
      case 'audit':
        wx.showToast({
          title: '去审核',
          icon: 'none'
        });
        break;
      case 'settle':
        wx.navigateTo({
          url: '/pages/org-home/settlement'
        });
        break;
      case 'dispute':
        wx.showToast({
          title: '去处理',
          icon: 'none'
        });
        break;
    }
  },

  /**
   * 点击功能入口
   * @param {Event} e - 点击事件
   */
  onFunctionTap(e) {
    const { path } = e.currentTarget.dataset;
    console.log('点击功能入口:', path);
    
    if (path) {
      wx.navigateTo({
        url: path
      });
    }
  },

  /**
   * 查看订单详情
   */
  onViewOrderDetail() {
    wx.navigateTo({
      url: '/pages/org-home/orders'
    });
  },

  /**
   * 通知图标点击
   */
  onNotification() {
    wx.showToast({
      title: '暂无新通知',
      icon: 'none'
    });
  }
});
