/**
 * 支付工具模块
 * 功能：支付调用、结果轮询、超时处理
 */

// 支付配置
const PAY_CONFIG = {
  // 支付超时时间（毫秒）
  TIMEOUT: 15 * 60 * 1000, // 15 分钟
  
  // 轮询间隔（毫秒）
  POLL_INTERVAL: 3000, // 3 秒
  
  // 最大轮询次数
  MAX_POLL_COUNT: 300, // 最多轮询 15 分钟
  
  // 支付云函数名称
  CREATE_PAY_FUNCTION: 'pay/createPay',
  QUERY_PAY_FUNCTION: 'pay/queryPayStatus'
};

/**
 * 支付结果状态
 */
const PAY_STATUS = {
  PENDING: 'pending',     // 待支付
  PROCESSING: 'processing', // 处理中
  SUCCESS: 'success',     // 支付成功
  FAILED: 'failed',       // 支付失败
  TIMEOUT: 'timeout',     // 支付超时
  CANCELLED: 'cancelled'  // 用户取消
};

/**
 * 创建支付订单
 * @param {object} options - 支付选项
 * @param {string} options.orderNo - 订单号
 * @param {number} options.amount - 支付金额（元）
 * @param {string} options.body - 商品描述
 * @returns {Promise<object>} - 支付参数
 */
async function createPayOrder({ orderNo, amount, body = '清如 ClearSpring - 订单支付' }) {
  try {
    const result = await wx.cloud.callFunction({
      name: PAY_CONFIG.CREATE_PAY_FUNCTION,
      data: {
        orderNo,
        amount,
        body
      }
    });
    
    if (result.result && result.result.success) {
      return {
        success: true,
        data: result.result.data
      };
    } else {
      return {
        success: false,
        errorCode: result.result?.errorCode || 'UNKNOWN_ERROR',
        message: result.result?.message || '创建支付订单失败'
      };
    }
  } catch (error) {
    console.error('创建支付订单失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试'
    };
  }
}

/**
 * 发起微信支付
 * @param {object} payParams - 支付参数（从 createPayOrder 返回）
 * @returns {Promise<object>} - 支付结果
 */
async function initiateWechatPay(payParams) {
  return new Promise((resolve) => {
    wx.requestPayment({
      timeStamp: payParams.timeStamp,
      nonceStr: payParams.nonceStr,
      package: payParams.package,
      signType: payParams.signType,
      paySign: payParams.paySign,
      success: (res) => {
        // [CLEANED] console.log('微信支付成功:', res);
        resolve({
          success: true,
          status: PAY_STATUS.SUCCESS,
          data: res
        });
      },
      fail: (res) => {
        console.error('微信支付失败:', res);
        
        // 区分用户取消和其他错误
        if (res.errMsg && res.errMsg.includes('cancel')) {
          resolve({
            success: false,
            status: PAY_STATUS.CANCELLED,
            message: '用户取消支付'
          });
        } else {
          resolve({
            success: false,
            status: PAY_STATUS.FAILED,
            errorCode: res.errCode || 'PAY_FAILED',
            message: res.errMsg || '支付失败'
          });
        }
      },
      complete: () => {
        // 支付完成回调
      }
    });
  });
}

/**
 * 轮询支付结果
 * @param {string} orderNo - 订单号
 * @param {function} onStatusChange - 状态变化回调
 * @returns {Promise<object>} - 最终支付结果
 */
async function pollPayResult(orderNo, onStatusChange) {
  let pollCount = 0;
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const poll = async () => {
      try {
        pollCount++;
        
        // 检查是否超时
        if (Date.now() - startTime > PAY_CONFIG.TIMEOUT) {
          resolve({
            success: false,
            status: PAY_STATUS.TIMEOUT,
            message: '支付超时'
          });
          return;
        }
        
        // 检查是否超过最大轮询次数
        if (pollCount > PAY_CONFIG.MAX_POLL_COUNT) {
          resolve({
            success: false,
            status: PAY_STATUS.TIMEOUT,
            message: '轮询次数超限'
          });
          return;
        }
        
        // 查询订单状态
        const orderQuery = await wx.cloud.callFunction({
          name: 'pay/queryOrderStatus',
          data: { orderNo }
        });
        
        if (orderQuery.result && orderQuery.result.success) {
          const orderStatus = orderQuery.result.data.status;
          
          // 通知状态变化
          if (onStatusChange) {
            onStatusChange(orderStatus, orderQuery.result.data);
          }
          
          // 判断是否完成
          if (orderStatus === 'paid') {
            resolve({
              success: true,
              status: PAY_STATUS.SUCCESS,
              data: orderQuery.result.data
            });
            return;
          } else if (orderStatus === 'cancelled' || orderStatus === 'failed') {
            resolve({
              success: false,
              status: orderStatus === 'cancelled' ? PAY_STATUS.CANCELLED : PAY_STATUS.FAILED,
              data: orderQuery.result.data
            });
            return;
          }
        }
        
        // 继续轮询
        setTimeout(poll, PAY_CONFIG.POLL_INTERVAL);
        
      } catch (error) {
        console.error('轮询支付结果失败:', error);
        
        // 发生错误时继续轮询
        setTimeout(poll, PAY_CONFIG.POLL_INTERVAL);
      }
    };
    
    // 开始轮询
    poll();
  });
}

/**
 * 完整的支付流程
 * @param {object} options - 支付选项
 * @param {string} options.orderNo - 订单号
 * @param {number} options.amount - 支付金额（元）
 * @param {string} options.body - 商品描述
 * @param {function} options.onStatusChange - 状态变化回调
 * @returns {Promise<object>} - 支付结果
 */
async function completePayFlow({ orderNo, amount, body, onStatusChange }) {
  try {
    // 1. 创建支付订单
    const createResult = await createPayOrder({ orderNo, amount, body });
    
    if (!createResult.success) {
      return {
        success: false,
        status: PAY_STATUS.FAILED,
        errorCode: createResult.errorCode,
        message: createResult.message
      };
    }
    
    // 检查是否已支付（幂等性）
    if (createResult.isExisting && createResult.data.status === 'paid') {
      return {
        success: true,
        status: PAY_STATUS.SUCCESS,
        isExisting: true,
        data: createResult.data
      };
    }
    
    // 2. 发起微信支付
    const payResult = await initiateWechatPay(createResult.data.payParams);
    
    if (!payResult.success) {
      // 支付失败或取消，开始轮询确认最终状态
      const pollResult = await pollPayResult(orderNo, onStatusChange);
      return pollResult;
    }
    
    // 3. 支付成功，轮询确认订单状态
    const pollResult = await pollPayResult(orderNo, onStatusChange);
    return pollResult;
    
  } catch (error) {
    console.error('支付流程失败:', error);
    
    return {
      success: false,
      status: PAY_STATUS.FAILED,
      errorCode: 'SYSTEM_ERROR',
      message: '支付流程异常，请稍后重试'
    };
  }
}

/**
 * 查询订单支付状态
 * @param {string} orderNo - 订单号
 * @returns {Promise<object>} - 订单状态
 */
async function queryOrderStatus(orderNo) {
  try {
    const result = await wx.cloud.callFunction({
      name: 'pay/queryOrderStatus',
      data: { orderNo }
    });
    
    if (result.result && result.result.success) {
      return {
        success: true,
        data: result.result.data
      };
    } else {
      return {
        success: false,
        message: result.result?.message || '查询失败'
      };
    }
  } catch (error) {
    console.error('查询订单状态失败:', error);
    
    return {
      success: false,
      message: '系统繁忙，请稍后重试'
    };
  }
}

/**
 * 申请退款
 * @param {object} options - 退款选项
 * @param {string} options.orderNo - 订单号
 * @param {number} options.amount - 退款金额（元，可选）
 * @param {string} options.reason - 退款原因
 * @returns {Promise<object>} - 退款结果
 */
async function requestRefund({ orderNo, amount, reason = '用户申请退款' }) {
  try {
    const result = await wx.cloud.callFunction({
      name: 'pay/refund',
      data: {
        orderNo,
        amount,
        reason
      }
    });
    
    if (result.result && result.result.success) {
      return {
        success: true,
        data: result.result.data
      };
    } else {
      return {
        success: false,
        errorCode: result.result?.errorCode || 'REFUND_FAILED',
        message: result.result?.message || '退款失败'
      };
    }
  } catch (error) {
    console.error('申请退款失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '退款申请失败，请稍后重试'
    };
  }
}

/**
 * 格式化支付金额
 * @param {number} amount - 金额（元）
 * @returns {string} - 格式化后的金额
 */
function formatAmount(amount) {
  return `¥${amount.toFixed(2)}`;
}

/**
 * 获取支付状态文本
 * @param {string} status - 支付状态
 * @returns {string} - 状态文本
 */
function getStatusText(status) {
  const statusMap = {
    [PAY_STATUS.PENDING]: '待支付',
    [PAY_STATUS.PROCESSING]: '处理中',
    [PAY_STATUS.SUCCESS]: '支付成功',
    [PAY_STATUS.FAILED]: '支付失败',
    [PAY_STATUS.TIMEOUT]: '支付超时',
    [PAY_STATUS.CANCELLED]: '已取消'
  };
  
  return statusMap[status] || '未知状态';
}

module.exports = {
  PAY_CONFIG,
  PAY_STATUS,
  createPayOrder,
  initiateWechatPay,
  pollPayResult,
  completePayFlow,
  queryOrderStatus,
  requestRefund,
  formatAmount,
  getStatusText
};
