/**
 * 清如 ClearSpring - 性能优化示例页面
 * 
 * 展示如何正确使用：
 * 1. 虚拟列表组件
 * 2. 懒加载图片组件
 * 3. 公共函数库
 * 4. 请求缓存
 * 
 * @version 1.0.0
 * @date 2026-04-15
 */

const { 
  formatDate, 
  formatMoney, 
  getStatusName, 
  getStatusClass 
} = require('../../utils/common.js');

Page({
  data: {
    // 列表数据
    orders: [],
    
    // 虚拟列表配置
    virtualListConfig: {
      itemHeight: 120,
      bufferSize: 1,
      threshold: 30,
      containerHeight: 600
    }
  },

  /**
   * 页面加载
   */
  onLoad() {
    this.loadOrders();
  },

  /**
   * 加载订单列表（带缓存）
   */
  async loadOrders() {
    try {
      const request = require('../../utils/request.js').default;
      
      // GET 请求会自动缓存（5 分钟）
      const res = await request.get('/order/list', {
        page: 1,
        pageSize: 100
      });
      
      // 使用公共函数格式化数据
      const formattedOrders = (res.data || []).map(order => ({
        ...order,
        formatDate: formatDate(order.createTime),
        formatMoney: formatMoney(order.amount),
        statusName: getStatusName(order.status),
        statusClass: getStatusClass(order.status)
      }));
      
      this.setData({
        orders: formattedOrders
      });
    } catch (error) {
      console.error('加载订单失败:', error);
    }
  },

  /**
   * 虚拟列表项目点击
   */
  onOrderTap(e) {
    const { item, index } = e.detail;
    console.log('点击了订单:', item, index);
    
    wx.navigateTo({
      url: `/pages/order/detail?orderNo=${item.orderNo}`
    });
  },

  /**
   * 懒加载图片加载成功
   */
  onImageLoad(e) {
    // [CLEANED] console.log('图片加载成功');
  },

  /**
   * 懒加载图片加载失败
   */
  onImageError(e) {
    console.warn('图片加载失败:', e.detail);
  },

  /**
   * 下拉刷新（会触发新的缓存）
   */
  onPullDownRefresh() {
    // 清除缓存后重新加载
    const request = require('../../utils/request.js').default;
    request.clearCacheByUrl('/order/list');
    
    this.loadOrders().then(() => {
      wx.stopPullDownRefresh();
    });
  }
});
