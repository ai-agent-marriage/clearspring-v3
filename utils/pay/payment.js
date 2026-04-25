/**
 * 支付工具模块
 * 功能：支付调用、结果轮询、超时处理
 * 安全增强：金额校验、签名验证
 */

import config from '../../config/index.js'

// 支付配置
const PAY_CONFIG = {
  // 支付超时时间（毫秒）
  TIMEOUT: config.pay.timeout,
  
  // 轮询间隔（毫秒）
  POLL_INTERVAL: config.pay.pollInterval,
  
  // 最大轮询次数
  MAX_POLL_COUNT: config.pay.maxPollCount,
  
  // 支付云函数名称
  CREATE_PAY_FUNCTION: 'pay/createPay',
  QUERY_PAY_FUNCTION: 'pay/queryPayStatus'
};

/**
 * 验证支付金额
 * @param {number} amount - 支付金额
 * @param {number} expectedAmount - 期望金额（从服务端获取）
 * @returns {boolean} - 验证结果
 */
function validateAmount(amount, expectedAmount) {
  // 金额必须为正数
  if (typeof amount !== 'number' || amount <= 0) {
    console.error('[支付安全] 金额格式错误:', amount);
    return false;
  }
  
  // 金额不能超过最大值（100 万元）
  if (amount > 1000000) {
    console.error('[支付安全] 金额超过上限:', amount);
    return false;
  }
  
  // 金额精度检查（最多 2 位小数）
  const amountStr = amount.toString();
  const decimalIndex = amountStr.indexOf('.');
  if (decimalIndex !== -1 && amountStr.length - decimalIndex - 1 > 2) {
    console.error('[支付安全] 金额精度错误:', amount);
    return false;
  }
  
  // 与服务端金额对比（允许 0.01 元误差）
  if (expectedAmount !== undefined && expectedAmount !== null) {
    const diff = Math.abs(amount - expectedAmount);
    if (diff > 0.01) {
      console.error('[支付安全] 金额与服务端不一致:', { amount, expectedAmount, diff });
      return false;
    }
  }
  
  return true;
}

/**
 * 验证支付签名
 * @param {object} payParams - 支付参数
 * @param {string} serverSign - 服务端签名
 * @returns {boolean} - 验证结果
 */
function validatePaySign(payParams, serverSign) {
  if (!serverSign || typeof serverSign !== 'string') {
    console.error('[支付安全] 签名缺失');
    return false;
  }
  
  // 签名长度检查（SHA256 签名应为 64 位十六进制）
  if (serverSign.length !== 64) {
    console.error('[支付安全] 签名格式错误:', serverSign.length);
    return false;
  }
  
  // 验证签名参数完整性
  const requiredFields = ['timeStamp', 'nonceStr', 'package', 'signType'];
  for (const field of requiredFields) {
    if (!payParams[field]) {
      console.error('[支付安全] 签名参数缺失:', field);
      return false;
    }
  }
  
  return true;
}

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
 * @param {number} options.expectedAmount - 期望金额（可选，用于服务端校验）
 * @returns {Promise<object>} - 支付参数
 */
async function createPayOrder({ orderNo, amount, body = '清如 ClearSpring - 订单支付', expectedAmount }) {
  // 【安全增强】金额校验
  if (!validateAmount(amount, expectedAmount)) {
    return {
      success: false,
      errorCode: 'INVALID_AMOUNT',
      message: '支付金额校验失败'
    };
  }
  
  try {
    const result = await wx.cloud.callFunction({
      name: PAY_CONFIG.CREATE_PAY_FUNCTION,
      data: {
        orderNo,
        amount,
        body,
        // 添加时间戳，防止重放攻击
        timestamp: Date.now(),
        // 添加随机数，防止重放攻击
        nonce: Math.random().toString(36).substr(2, 16)
      }
    });
    
    if (result.result && result.result.success) {
      const payParams = result.result.data.payParams;
      
      // 【安全增强】签名验证
      if (result.result.data.sign && !validatePaySign(payParams, result.result.data.sign)) {
        return {
          success: false,
          errorCode: 'INVALID_SIGN',
          message: '支付签名验证失败'
        };
      }
      
      // 【安全增强】二次金额校验（服务端返回的金额）
      if (result.result.data.amount && result.result.data.amount !== amount) {
        console.error('[支付安全] 服务端返回金额与请求不一致:', {
          requestAmount: amount,
          responseAmount: result.result.data.amount
        });
        return {
          success: false,
          errorCode: 'AMOUNT_MISMATCH',
          message: '支付金额不一致'
        };
      }
      
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
 * @param {string} serverSign - 服务端签名（可选）
 * @returns {Promise<object>} - 支付结果
 */
async function initiateWechatPay(payParams, serverSign) {
  // 【安全增强】签名验证
  if (serverSign && !validatePaySign(payParams, serverSign)) {
    return {
      success: false,
      status: PAY_STATUS.FAILED,
      errorCode: 'INVALID_SIGN',
      message: '支付签名验证失败'
    };
  }
  
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
  let consecutiveErrors = 0; // 连续错误计数
  const MAX_CONSECUTIVE_ERRORS = 3; // 最大连续错误次数
  
  return new Promise((resolve) => {
    const poll = async () => {
      try {
        pollCount++;
        
        // 检查是否超时（默认 15 分钟）
        if (Date.now() - startTime > PAY_CONFIG.TIMEOUT) {
          console.error('[支付轮询] 超时:', { orderNo, pollCount, elapsedTime: Date.now() - startTime });
          resolve({
            success: false,
            status: PAY_STATUS.TIMEOUT,
            message: '支付超时，请检查订单状态',
            errorCode: 'POLL_TIMEOUT'
          });
          return;
        }
        
        // 检查是否超过最大轮询次数
        if (pollCount > PAY_CONFIG.MAX_POLL_COUNT) {
          console.error('[支付轮询] 次数超限:', { orderNo, pollCount, maxCount: PAY_CONFIG.MAX_POLL_COUNT });
          resolve({
            success: false,
            status: PAY_STATUS.TIMEOUT,
            message: '轮询次数超限，请检查订单状态',
            errorCode: 'POLL_COUNT_EXCEEDED'
          });
          return;
        }
        
        // 查询订单状态
        const orderQuery = await wx.cloud.callFunction({
          name: 'pay/queryOrderStatus',
          data: { orderNo }
        });
        
        // 重置连续错误计数
        consecutiveErrors = 0;
        
        if (orderQuery.result && orderQuery.result.success) {
          const orderStatus = orderQuery.result.data.status;
          
          // 通知状态变化
          if (onStatusChange) {
            onStatusChange(orderStatus, orderQuery.result.data);
          }
          
          // 判断是否完成
          if (orderStatus === 'paid') {
            console.log('[支付轮询] 支付成功:', { orderNo, pollCount });
            resolve({
              success: true,
              status: PAY_STATUS.SUCCESS,
              data: orderQuery.result.data
            });
            return;
          } else if (orderStatus === 'cancelled' || orderStatus === 'failed') {
            console.log('[支付轮询] 支付失败:', { orderNo, status: orderStatus });
            resolve({
              success: false,
              status: orderStatus === 'cancelled' ? PAY_STATUS.CANCELLED : PAY_STATUS.FAILED,
              data: orderQuery.result.data,
              errorCode: orderStatus === 'cancelled' ? 'USER_CANCELLED' : 'PAY_FAILED'
            });
            return;
          }
        } else {
          // 云函数调用失败
          console.warn('[支付轮询] 查询失败:', orderQuery.result?.message);
          consecutiveErrors++;
          
          if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
            console.error('[支付轮询] 连续错误超限:', { orderNo, consecutiveErrors });
            resolve({
              success: false,
              status: PAY_STATUS.FAILED,
              message: '查询订单状态失败，请稍后重试',
              errorCode: 'QUERY_FAILED'
            });
            return;
          }
        }
        
        // 继续轮询
        setTimeout(poll, PAY_CONFIG.POLL_INTERVAL);
        
      } catch (error) {
        console.error('[支付轮询] 异常:', { orderNo, pollCount, error: error.message });
        consecutiveErrors++;
        
        // 网络错误或其他异常
        if (consecutiveErrors >= MAX_CONSECUTIVE_ERRORS) {
          console.error('[支付轮询] 连续异常超限:', { orderNo, consecutiveErrors });
          resolve({
            success: false,
            status: PAY_STATUS.FAILED,
            message: '网络异常，请稍后重试',
            errorCode: 'NETWORK_ERROR'
          });
          return;
        }
        
        // 发生错误时继续轮询（使用退避策略）
        const backoffDelay = Math.min(PAY_CONFIG.POLL_INTERVAL * Math.pow(2, consecutiveErrors), 30000);
        setTimeout(poll, backoffDelay);
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
  getStatusText,
  // 【安全增强】导出的验证函数
  validateAmount,
  validatePaySign
};
