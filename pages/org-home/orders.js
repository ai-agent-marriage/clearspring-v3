// 清如 ClearSpring - 机构订单管理页
/**
 * @file 机构订单管理页面
 * @description 管理订单列表、订单状态筛选、订单操作
 * @version 4.0.1
 * @update 2026-04-12: 添加缓存优化支持
 */

const ErrorHandler = require('../../utils/error-handler');
const cache = require('../../utils/cache-optimized');

Page({
  data: {
    // Tab 配置
    tabs: ['全部', '待承接', '待执行', '执行中', '待确认', '已完成', '已取消'],
    activeTab: 0,
    
    // 筛选栏
    showFilter: false,
    filterDateRange: null,
    filterWaterArea: '',
    filterVolunteer: '',
    
    // 订单列表
    orders: [
      {
        orderNo: 'PRO202604070001',
        status: 2,
        statusName: '待执行',
        executeDate: '2026-04-15',
        speciesName: '鲢鱼',
        waterArea: '珠江广州段',
        volunteerName: '张三',
        amount: 299
      },
      {
        orderNo: 'PRO202604070002',
        status: 1,
        statusName: '待承接',
        executeDate: '2026-04-16',
        speciesName: '鲫鱼',
        waterArea: '长江武汉段',
        volunteerName: '',
        amount: 199
      },
      {
        orderNo: 'PRO202604070003',
        status: 3,
        statusName: '执行中',
        executeDate: '2026-04-14',
        speciesName: '鲤鱼',
        waterArea: '黄河郑州段',
        volunteerName: '李四',
        amount: 399
      }
    ],
    
    // 空状态
    isEmpty: false
  },

  /**
   * 页面加载
   */
  onLoad() {
    // [CLEANED] console.log('订单管理页加载');
    this.loadOrders();
  },

  /**
   * 页面显示
   */
  onShow() {
    this.refreshOrders();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.refreshOrders().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载订单列表（带缓存优化）
   * @async
   * @returns {Promise<void>}
   */
  async loadOrders() {
    try {
      ErrorHandler.showLoading('加载中...');
      
      // 使用缓存优化：先检查缓存（3 分钟有效期）
      const cacheKey = `order-list-${this.data.orgId || 'org_001'}-${this.data.activeTab}`;
      const cached = cache.get(cacheKey, 180000); // 3 分钟缓存
      
      if (cached) {
        // [CLEANED] console.log('[缓存命中] 订单列表');
        this.setData({ 
          orders: cached.orders,
          isEmpty: cached.isEmpty,
          loading: false,
          fromCache: true
        });
        ErrorHandler.hideLoading();
        return;
      }
      
      // 缓存未命中，从云函数加载
      // [CLEANED] console.log('[缓存未命中] 从云函数加载订单列表');
      const res = await wx.cloud.callFunction({
        name: 'order-list',
        data: { 
          orgId: this.data.orgId || 'org_001',
          status: this.data.activeTab,
          timestamp: Date.now()
        }
      });
      
      if (res.result && res.result.code === 0 && res.result.data) {
        const orders = res.result.data.orders || [];
        const isEmpty = orders.length === 0;
        
        this.setData({ 
          orders: orders,
          isEmpty: isEmpty,
          loading: false,
          fromCache: false
        });
        
        // 保存到缓存（3 分钟）
        cache.set(cacheKey, { orders, isEmpty }, 180000);
        
        ErrorHandler.hideLoading();
      } else {
        throw new Error(res.result?.msg || '订单加载失败');
      }
    } catch (error) {
      console.error('加载订单失败:', error);
      ErrorHandler.hideLoading();
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
          page: 'org-home-orders',
          timestamp: Date.now()
        }
      });
      
      this.setData({ 
        orders: [],
        isEmpty: true,
        loading: false 
      });
    }
  },

  /**
   * 刷新订单
   * @async
   * @returns {Promise<void>}
   */
  async refreshOrders() {
    try {
      ErrorHandler.showLoading('刷新中...');
      await this.loadOrders();
      ErrorHandler.hideLoading();
      // [CLEANED] console.log('订单刷新完成');
    } catch (error) {
      ErrorHandler.hideLoading();
      console.error('刷新订单失败:', error);
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
  },

  /**
   * Tab 切换
   * @param {Event} e - 点击事件
   */
  onTabChange(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ activeTab: index });
    this.loadOrdersByStatus(index);
  },

  /**
   * 按状态加载订单
   * @async
   * @param {number} statusIndex - 状态索引
   */
  async loadOrdersByStatus(statusIndex) {
    try {
      ErrorHandler.showLoading('加载中...');
      
      const res = await wx.cloud.callFunction({
        name: 'order-list',
        data: { 
          orgId: this.data.orgId || 'org_001',
          status: statusIndex,
          timestamp: Date.now()
        }
      });
      
      if (res.result && res.result.code === 0 && res.result.data) {
        const orders = res.result.data.orders || [];
        this.setData({ 
          orders: orders,
          isEmpty: orders.length === 0
        });
        ErrorHandler.hideLoading();
      } else {
        throw new Error(res.result?.msg || '订单加载失败');
      }
    } catch (error) {
      ErrorHandler.hideLoading();
      console.error('加载状态订单失败:', error);
      wx.showToast({
        title: error.message || '加载失败',
        icon: 'none'
      });
    }
  },

  /**
   * 切换筛选栏
   */
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  /**
   * 筛选日期变化
   * @param {Event} e - 事件对象
   */
  onFilterDateChange(e) {
    this.setData({
      filterDateRange: e.detail.value
    });
  },

  /**
   * 筛选水域变化
   * @param {Event} e - 事件对象
   */
  onFilterWaterAreaChange(e) {
    this.setData({
      filterWaterArea: e.detail.value
    });
  },

  /**
   * 筛选志愿者变化
   * @param {Event} e - 事件对象
   */
  onFilterVolunteerChange(e) {
    this.setData({
      filterVolunteer: e.detail.value
    });
  },

  /**
   * 应用筛选
   */
  onApplyFilter() {
    // [CLEANED] console.log('应用筛选:', {
      dateRange: this.data.filterDateRange,
      waterArea: this.data.filterWaterArea,
      volunteer: this.data.filterVolunteer
    });
    this.setData({ showFilter: false });
    wx.showToast({
      title: '筛选已应用',
      icon: 'success'
    });
  },

  /**
   * 重置筛选
   */
  onResetFilter() {
    this.setData({
      filterDateRange: null,
      filterWaterArea: '',
      filterVolunteer: ''
    });
    wx.showToast({
      title: '已重置筛选',
      icon: 'none'
    });
  },

  /**
   * 订单操作
   * @param {Event} e - 点击事件
   */
  onOrderAction(e) {
    const { action, order } = e.currentTarget.dataset;
    // [CLEANED] console.log('订单操作:', action, order);
    
    switch (action) {
      case 'accept':
        this.acceptOrder(order);
        break;
      case 'assign':
        this.assignTask(order);
        break;
      case 'audit':
        this.auditMaterial(order);
        break;
      case 'detail':
        this.viewDetail(order);
        break;
    }
  },

  /**
   * 承接订单
   * @param {Object} order - 订单信息
   */
  acceptOrder(order) {
    wx.showModal({
      title: '承接订单',
      content: `确定要承接订单 ${order.orderNo} 吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '承接成功',
            icon: 'success'
          });
        }
      }
    });
  },

  /**
   * 分配任务
   * @param {Object} order - 订单信息
   */
  assignTask(order) {
    wx.navigateTo({
      url: `/pages/org-home/assign?orderNo=${order.orderNo}`
    });
  },

  /**
   * 审核执行材料
   * @param {Object} order - 订单信息
   */
  auditMaterial(order) {
    wx.navigateTo({
      url: `/pages/org-home/audit?orderNo=${order.orderNo}`
    });
  },

  /**
   * 查看详情
   * @param {Object} order - 订单信息
   */
  viewDetail(order) {
    wx.navigateTo({
      url: `/pages/order/detail?orderNo=${order.orderNo}`
    });
  },

  /**
   * 获取状态标签样式
   * @param {number} status - 状态值
   * @returns {string} 样式类名
   */
  getStatusClass(status) {
    const statusMap = {
      1: 'pending-accept',
      2: 'pending-execute',
      3: 'processing',
      4: 'pending-confirm',
      5: 'completed',
      6: 'cancelled'
    };
    return statusMap[status] || '';
  }
});
