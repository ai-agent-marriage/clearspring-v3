// 云函数入口文件：refund
// 功能：退款处理（幂等性设计）
// 核心：同一退款申请只处理一次，支持部分退款和全额退款

const cloud = require('wx-server-sdk');
const crypto = require('crypto');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 微信支付配置
const WX_PAY_CONFIG = {
  appId: process.env.WX_APP_ID || 'wxXXXXXXXX',
  mchId: process.env.WX_MCH_ID || '1234567890',
  apiKey: process.env.WX_API_KEY || 'your_api_key',
  refundNotifyUrl: process.env.WX_REFUND_NOTIFY_URL || 'https://your-domain.com/pay/refund/callback'
};

/**
 * 生成随机字符串
 * @param {number} length - 长度
 * @returns {string} - 随机字符串
 */
function randomString(length = 32) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * 生成退款单号
 * @returns {string} - 退款单号
 */
function generateOutRefundNo() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = randomString(8);
  return `RF${dateStr}${random}`;
}

/**
 * 生成微信支付签名
 * @param {object} params - 签名参数
 * @returns {string} - 签名
 */
function generateSign(params) {
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys
    .filter(k => params[k] !== undefined && params[k] !== '' && k !== 'sign')
    .map(k => `${k}=${params[k]}`)
    .join('&') + `&key=${WX_PAY_CONFIG.apiKey}`;
  
  return crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
}

/**
 * 检查退款是否已处理（幂等性）
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 原交易 ID
 * @returns {object|null} - 已处理的退款记录
 */
async function checkRefundProcessed(orderNo, transactionId) {
  // 检查 pay_log 中是否有退款成功记录
  const logQuery = await db.collection('pay_log')
    .where({
      order_no: orderNo,
      type: 2, // 2=退款
      status: 1 // 1=成功
    })
    .orderBy('create_time', 'desc')
    .limit(1)
    .get();
  
  if (logQuery.data.length > 0) {
    const refundLog = logQuery.data[0];
    return {
      isProcessed: true,
      refundNo: refundLog.out_refund_no,
      amount: refundLog.amount,
      status: 'success'
    };
  }
  
  // 检查处理中的退款
  const pendingQuery = await db.collection('pay_log')
    .where({
      order_no: orderNo,
      type: 2,
      status: 3 // 3=处理中
    })
    .limit(1)
    .get();
  
  if (pendingQuery.data.length > 0) {
    return {
      isProcessed: true,
      refundNo: pendingQuery.data[0].out_refund_no,
      amount: pendingQuery.data[0].amount,
      status: 'processing'
    };
  }
  
  return null;
}

/**
 * 查询订单已退款金额
 * @param {string} orderNo - 订单号
 * @returns {number} - 已退款金额（元）
 */
async function queryRefundedAmount(orderNo) {
  const refundQuery = await db.collection('pay_log')
    .where({
      order_no: orderNo,
      type: 2, // 2=退款
      status: 1 // 1=成功
    })
    .field({ amount: true })
    .get();
  
  const totalRefunded = refundQuery.data.reduce((sum, log) => sum + (log.amount || 0), 0);
  return totalRefunded;
}

/**
 * 查询订单支付金额
 * @param {string} orderNo - 订单号
 * @returns {number} - 支付金额（元）
 */
async function queryOrderAmount(orderNo) {
  const orderQuery = await db.collection('order_protect')
    .where({ order_no: orderNo })
    .limit(1)
    .get();
  
  if (orderQuery.data.length === 0) {
    return 0;
  }
  
  return orderQuery.data[0].amount || 0;
}

/**
 * 记录退款日志
 * @param {string} orderNo - 订单号
 * @param {string} refundNo - 退款单号
 * @param {string} transactionId - 原交易 ID
 * @param {number} amount - 退款金额
 * @param {string} openid - 用户 openid
 * @param {string} status - 状态
 * @param {string} reason - 退款原因
 */
async function logRefund(orderNo, refundNo, transactionId, amount, openid, status = '3', reason = '') {
  try {
    await db.collection('pay_log').add({
      data: {
        order_no: orderNo,
        transaction_id: transactionId,
        out_refund_no: refundNo,
        amount: amount,
        type: 2, // 2=退款
        status: parseInt(status), // 3=处理中
        pay_channel: 'wechat',
        operator_openid: openid,
        remark: reason,
        create_time: db.serverDate()
      }
    });
  } catch (error) {
    console.error('记录退款日志失败:', error);
  }
}

/**
 * 更新退款日志状态
 * @param {string} refundNo - 退款单号
 * @param {string} status - 状态
 * @param {object} callbackInfo - 回调信息
 */
async function updateRefundLog(refundNo, status, callbackInfo = {}) {
  await db.collection('pay_log')
    .where({ out_refund_no: refundNo })
    .orderBy('create_time', 'desc')
    .limit(1)
    .update({
      data: {
        status: parseInt(status),
        callback_info: JSON.stringify(callbackInfo),
        update_time: db.serverDate()
      }
    });
}

/**
 * 更新订单状态为已退款
 * @param {string} orderNo - 订单号
 */
async function updateOrderToRefunded(orderNo) {
  await db.collection('order_protect')
    .where({ order_no: orderNo })
    .update({
      data: {
        status: 4, // 4=已退款
        update_time: db.serverDate()
      }
    });
}

/**
 * 调用微信退款 API
 * @param {string} transactionId - 原交易 ID
 * @param {string} refundNo - 退款单号
 * @param {number} totalFee - 订单总金额（分）
 * @param {number} refundFee - 退款金额（分）
 * @param {string} refundDesc - 退款说明
 * @returns {object} - 退款结果
 */
async function callWechatRefund(transactionId, refundNo, totalFee, refundFee, refundDesc = '') {
  // 构建退款请求参数
  const refundParams = {
    appid: WX_PAY_CONFIG.appId,
    mch_id: WX_PAY_CONFIG.mchId,
    nonce_str: randomString(32),
    transaction_id: transactionId,
    out_refund_no: refundNo,
    total_fee: totalFee,
    refund_fee: refundFee,
    refund_desc: refundDesc,
    notify_url: WX_PAY_CONFIG.refundNotifyUrl
  };
  
  // 生成签名
  refundParams.sign = generateSign(refundParams);
  
  // 调用微信退款 API（实际环境中需要真实调用）
  // const result = await cloud.http.request({
  //   method: 'POST',
  //   url: 'https://api.mch.weixin.qq.com/secapi/pay/refund',
  //   data: refundParams
  // });
  
  // 模拟返回（实际使用时替换为真实调用）
  const mockResult = {
    return_code: 'SUCCESS',
    return_msg: 'OK',
    result_code: 'SUCCESS',
    refund_id: `rf_mock_${randomString(16)}`,
    refund_status: 'SUCCESS' // SUCCESS=退款成功，CHANGE=退款异常，REFUNDING=退款处理中
  };
  
  return mockResult;
}

/**
 * 发送退款通知
 * @param {string} openid - 用户 openid
 * @param {string} orderNo - 订单号
 * @param {number} amount - 退款金额
 */
async function sendRefundNotification(openid, orderNo, amount) {
  try {
    await cloud.callFunction({
      name: 'sendNotification',
      data: {
        openid,
        templateId: 'refund_success',
        page: 'pages/order/detail',
        data: {
          orderNo: { value: orderNo },
          amount: { value: `¥${amount.toFixed(2)}` },
          time: { value: new Date().toLocaleString() }
        }
      }
    });
  } catch (error) {
    console.error('发送退款通知失败:', error);
  }
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.orderNo - 订单号
 * @param {number} event.amount - 退款金额（元，可选，不传则全额退款）
 * @param {string} event.reason - 退款原因
 * @returns {object} - 退款结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orderNo, amount, reason = '用户申请退款' } = event;
  
  try {
    // 1. 校验用户登录状态
    if (!openid) {
      return {
        success: false,
        errorCode: 'NOT_LOGGED_IN',
        message: '请先登录'
      };
    }
    
    // 2. 校验必填参数
    if (!orderNo) {
      return {
        success: false,
        errorCode: 'INVALID_ORDER_NO',
        message: '订单号不能为空'
      };
    }
    
    // 3. 查询订单信息
    const orderQuery = await db.collection('order_protect')
      .where({ order_no: orderNo })
      .limit(1)
      .get();
    
    if (orderQuery.data.length === 0) {
      return {
        success: false,
        errorCode: 'ORDER_NOT_FOUND',
        message: '订单不存在'
      };
    }
    
    const order = orderQuery.data[0];
    
    // 4. 验证订单状态（只有已支付的订单才能退款）
    if (order.status !== 2) {
      return {
        success: false,
        errorCode: 'ORDER_NOT_PAID',
        message: '订单尚未支付，无法退款'
      };
    }
    
    // 5. 【幂等性核心】检查是否已退款
    const refundCheck = await checkRefundProcessed(orderNo, order.transaction_id);
    
    if (refundCheck && refundCheck.isProcessed) {
      if (refundCheck.status === 'success') {
        return {
          success: true,
          message: '订单已退款',
          isExisting: true,
          data: {
            refundNo: refundCheck.refundNo,
            amount: refundCheck.amount,
            status: 'refunded'
          }
        };
      } else if (refundCheck.status === 'processing') {
        return {
          success: true,
          message: '退款处理中',
          isExisting: true,
          data: {
            refundNo: refundCheck.refundNo,
            amount: refundCheck.amount,
            status: 'processing'
          }
        };
      }
    }
    
    // 6. 计算退款金额
    const orderAmount = order.amount || await queryOrderAmount(orderNo);
    const refundedAmount = await queryRefundedAmount(orderNo);
    const maxRefundAmount = orderAmount - refundedAmount;
    
    let refundAmount = amount !== undefined ? amount : maxRefundAmount;
    
    // 校验退款金额
    if (refundAmount <= 0) {
      return {
        success: false,
        errorCode: 'INVALID_REFUND_AMOUNT',
        message: '退款金额无效'
      };
    }
    
    if (refundAmount > maxRefundAmount) {
      return {
        success: false,
        errorCode: 'REFUND_AMOUNT_EXCEEDED',
        message: `退款金额超过可退金额（最多可退¥${maxRefundAmount.toFixed(2)}）`
      };
    }
    
    // 7. 生成退款单号
    const refundNo = generateOutRefundNo();
    
    // 8. 记录退款日志（处理中状态）
    await logRefund(orderNo, refundNo, order.transaction_id, refundAmount, openid, '3', reason);
    
    // 9. 调用微信退款 API
    const refundResult = await callWechatRefund(
      order.transaction_id,
      refundNo,
      Math.round(orderAmount * 100), // 转为分
      Math.round(refundAmount * 100), // 转为分
      reason
    );
    
    if (refundResult.return_code !== 'SUCCESS' || refundResult.result_code !== 'SUCCESS') {
      // 退款失败，更新日志
      await updateRefundLog(refundNo, '2', refundResult); // 2=失败
      
      return {
        success: false,
        errorCode: 'REFUND_FAILED',
        message: '退款失败：' + (refundResult.return_msg || '未知错误')
      };
    }
    
    // 10. 更新退款日志为成功
    await updateRefundLog(refundNo, '1', { // 1=成功
      ...refundResult,
      refund_amount: refundAmount
    });
    
    // 11. 如果是全额退款，更新订单状态
    if (refundAmount >= maxRefundAmount) {
      await updateOrderToRefunded(orderNo);
    }
    
    // 12. 发送退款通知
    await sendRefundNotification(openid, orderNo, refundAmount);
    
    // 13. 返回退款结果
    return {
      success: true,
      message: '退款申请成功',
      data: {
        refundNo,
        orderNo,
        refundAmount,
        refundId: refundResult.refund_id,
        refundStatus: refundResult.refund_status,
        isFullRefund: refundAmount >= maxRefundAmount,
        appliedAt: Date.now()
      }
    };
    
  } catch (error) {
    console.error('退款处理失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '退款处理失败，请稍后重试',
      error: error.message
    };
  }
};
