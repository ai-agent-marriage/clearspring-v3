// 云函数入口文件：queryOrderStatus
// 功能：查询订单支付状态（供前端轮询使用）

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.orderNo - 订单号
 * @returns {object} - 订单状态
 */
exports.main = async (event, context) => {
  const { orderNo } = event;
  
  try {
    // 1. 校验参数
    if (!orderNo) {
      return {
        success: false,
        message: '订单号不能为空'
      };
    }
    
    // 2. 查询订单信息
    const orderQuery = await db.collection('order_protect')
      .where({ order_no: orderNo })
      .limit(1)
      .get();
    
    if (orderQuery.data.length === 0) {
      return {
        success: false,
        message: '订单不存在'
      };
    }
    
    const order = orderQuery.data[0];
    
    // 3. 查询支付日志
    const payLogQuery = await db.collection('pay_log')
      .where({
        order_no: orderNo,
        status: 1 // 1=成功
      })
      .orderBy('create_time', 'desc')
      .limit(1)
      .get();
    
    const payLog = payLogQuery.data.length > 0 ? payLogQuery.data[0] : null;
    
    // 4. 构建返回数据
    const statusMap = {
      1: 'pending',    // 待支付
      2: 'paid',       // 已支付
      3: 'cancelled',  // 已取消
      4: 'refunded'    // 已退款
    };
    
    return {
      success: true,
      data: {
        orderNo: order.order_no,
        status: statusMap[order.status] || 'unknown',
        statusText: getOrderStatusText(order.status),
        amount: order.amount || 0,
        transactionId: order.transaction_id || '',
        payTime: order.pay_time ? new Date(order.pay_time).getTime() : null,
        expireTime: order.expire_time ? new Date(order.expire_time).getTime() : null,
        hasPaidLog: !!payLog,
        paidAmount: payLog ? payLog.amount : 0
      }
    };
    
  } catch (error) {
    console.error('查询订单状态失败:', error);
    
    return {
      success: false,
      message: '查询失败，请稍后重试',
      error: error.message
    };
  }
};

/**
 * 获取订单状态文本
 * @param {number} status - 状态码
 * @returns {string} - 状态文本
 */
function getOrderStatusText(status) {
  const statusMap = {
    1: '待支付',
    2: '已支付',
    3: '已取消',
    4: '已退款'
  };
  
  return statusMap[status] || '未知状态';
}
