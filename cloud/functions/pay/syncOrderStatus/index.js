// 云函数入口文件：syncOrderStatus
// 功能：定时同步订单支付状态
// 用途：每 10 分钟执行一次，同步处理中订单的状态，处理超时订单

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 配置
const SYNC_CONFIG = {
  batchSize: 100, // 每次同步的订单数量
  timeoutMinutes: 15, // 支付超时时间（分钟）
  maxRetryCount: 3 // 最大重试次数
};

/**
 * 查询处理中的订单
 * @returns {Array} - 订单列表
 */
async function queryPendingOrders() {
  const now = Date.now();
  const timeoutTime = new Date(now - SYNC_CONFIG.timeoutMinutes * 60 * 1000);
  
  // 查询待支付且未超时的订单
  const pendingQuery = await db.collection('order_protect')
    .where({
      status: 1, // 1=待支付
      expire_time: _.gt(new Date(now)) // 未过期
    })
    .limit(SYNC_CONFIG.batchSize)
    .get();
  
  return pendingQuery.data;
}

/**
 * 查询已超时的订单
 * @returns {Array} - 订单列表
 */
async function queryTimeoutOrders() {
  const now = new Date();
  
  // 查询待支付且已过期的订单
  const timeoutQuery = await db.collection('order_protect')
    .where({
      status: 1, // 1=待支付
      expire_time: _.lte(now) // 已过期
    })
    .limit(SYNC_CONFIG.batchSize)
    .get();
  
  return timeoutQuery.data;
}

/**
 * 同步单个订单状态（调用微信查询订单 API）
 * @param {object} order - 订单数据
 * @returns {object} - 同步结果
 */
async function syncOrderStatus(order) {
  const transactionId = order.transaction_id;
  
  if (!transactionId) {
    return {
      success: false,
      reason: '无交易号'
    };
  }
  
  try {
    // 调用微信查询订单 API
    // 实际环境中需要实现真实的 API 调用
    // const result = await cloud.http.request({
    //   method: 'POST',
    //   url: 'https://api.mch.weixin.qq.com/pay/orderquery',
    //   data: {
    //     transaction_id: transactionId,
    //     // ... 签名等参数
    //   }
    // });
    
    // 模拟查询结果（实际使用时替换为真实调用）
    const mockResult = {
      return_code: 'SUCCESS',
      result_code: 'SUCCESS',
      trade_state: 'SUCCESS', // SUCCESS=支付成功，NOTPAY=未支付，REFUND=转入退款
      trade_state_desc: '支付成功'
    };
    
    if (mockResult.return_code !== 'SUCCESS' || mockResult.result_code !== 'SUCCESS') {
      return {
        success: false,
        reason: '查询失败：' + (mockResult.return_msg || '未知错误')
      };
    }
    
    // 根据微信返回更新订单状态
    if (mockResult.trade_state === 'SUCCESS') {
      // 支付成功
      await updateOrderToPaid(order.order_no, transactionId);
      await updatePayLogToSuccess(order.order_no, transactionId, mockResult);
      
      return {
        success: true,
        newStatus: 'paid'
      };
    } else if (mockResult.trade_state === 'NOTPAY') {
      // 未支付，继续等待
      return {
        success: true,
        newStatus: 'pending'
      };
    } else if (mockResult.trade_state === 'REFUND') {
      // 已退款
      await updateOrderToRefunded(order.order_no);
      
      return {
        success: true,
        newStatus: 'refunded'
      };
    } else {
      return {
        success: false,
        reason: '未知状态：' + mockResult.trade_state
      };
    }
    
  } catch (error) {
    console.error(`同步订单 ${order.order_no} 状态失败:`, error);
    
    return {
      success: false,
      reason: error.message
    };
  }
}

/**
 * 更新订单为已支付
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 交易 ID
 */
async function updateOrderToPaid(orderNo, transactionId) {
  await db.collection('order_protect')
    .where({ order_no: orderNo })
    .update({
      data: {
        status: 2, // 2=已支付
        transaction_id: transactionId,
        pay_time: db.serverDate(),
        update_time: db.serverDate()
      }
    });
}

/**
 * 更新支付日志为成功
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 交易 ID
 * @param {object} callbackInfo - 回调信息
 */
async function updatePayLogToSuccess(orderNo, transactionId, callbackInfo) {
  const logQuery = await db.collection('pay_log')
    .where({
      order_no: orderNo,
      status: _.in([2, 3]) // 2=失败，3=处理中
    })
    .limit(1)
    .get();
  
  if (logQuery.data.length > 0) {
    // 更新现有记录
    await db.collection('pay_log')
      .doc(logQuery.data[0].id)
      .update({
        data: {
          transaction_id: transactionId,
          status: 1, // 1=成功
          callback_info: JSON.stringify(callbackInfo),
          update_time: db.serverDate()
        }
      });
  } else {
    // 创建新记录
    await db.collection('pay_log').add({
      data: {
        order_no: orderNo,
        transaction_id: transactionId,
        amount: 0,
        type: 1,
        status: 1,
        pay_channel: 'wechat',
        callback_info: JSON.stringify(callbackInfo),
        create_time: db.serverDate()
      }
    });
  }
}

/**
 * 更新订单为已退款
 * @param {string} orderNo - 订单号
 */
async function updateOrderToRefunded(orderNo) {
  await db.collection('order_protect')
    .where({ order_no: orderNo })
    .update({
      data: {
        status: 3, // 3=已取消/退款
        update_time: db.serverDate()
      }
    });
}

/**
 * 取消超时订单
 * @param {object} order - 订单数据
 */
async function cancelTimeoutOrder(order) {
  try {
    // 更新订单状态为已取消
    await db.collection('order_protect')
      .where({ order_no: order.order_no })
      .update({
        data: {
          status: 3, // 3=已取消
          remark: '支付超时自动取消',
          update_time: db.serverDate()
        }
      });
    
    // 记录取消日志
    await db.collection('pay_log').add({
      data: {
        order_no: order.order_no,
        transaction_id: order.transaction_id || '',
        amount: order.amount || 0,
        type: 1,
        status: 2, // 2=失败
        pay_channel: 'wechat',
        remark: '支付超时自动取消',
        operator_openid: order.user_id || '',
        create_time: db.serverDate()
      }
    });
    
    return {
      success: true,
      action: 'cancelled'
    };
    
  } catch (error) {
    console.error(`取消超时订单 ${order.order_no} 失败:`, error);
    
    return {
      success: false,
      reason: error.message
    };
  }
}

/**
 * 发送超时取消通知
 * @param {string} openid - 用户 openid
 * @param {string} orderNo - 订单号
 */
async function sendTimeoutNotification(openid, orderNo) {
  try {
    await cloud.callFunction({
      name: 'sendNotification',
      data: {
        openid,
        templateId: 'order_timeout',
        page: 'pages/order/list',
        data: {
          orderNo: { value: orderNo },
          time: { value: new Date().toLocaleString() }
        }
      }
    });
  } catch (error) {
    console.error('发送超时通知失败:', error);
  }
}

/**
 * 云函数主入口（定时触发器调用）
 */
exports.main = async (event, context) => {
  const startTime = Date.now();
  const stats = {
    totalProcessed: 0,
    syncSuccess: 0,
    syncFailed: 0,
    timeoutCancelled: 0,
    duration: 0
  };
  
  try {
    // [CLEANED] console.log('开始同步订单状态...');
    
    // 1. 同步处理中的订单
    const pendingOrders = await queryPendingOrders();
    // [CLEANED] console.log(`待同步订单数：${pendingOrders.length}`);
    
    for (const order of pendingOrders) {
      stats.totalProcessed++;
      
      const result = await syncOrderStatus(order);
      
      if (result.success) {
        stats.syncSuccess++;
        // [CLEANED] console.log(`订单 ${order.order_no} 同步成功：${result.newStatus}`);
      } else {
        stats.syncFailed++;
        console.error(`订单 ${order.order_no} 同步失败：${result.reason}`);
      }
    }
    
    // 2. 取消超时订单
    const timeoutOrders = await queryTimeoutOrders();
    // [CLEANED] console.log(`超时订单数：${timeoutOrders.length}`);
    
    for (const order of timeoutOrders) {
      const result = await cancelTimeoutOrder(order);
      
      if (result.success) {
        stats.timeoutCancelled++;
        // [CLEANED] console.log(`订单 ${order.order_no} 已取消（超时）`);
        
        // 发送超时通知
        if (order.user_id) {
          await sendTimeoutNotification(order.user_id, order.order_no);
        }
      }
    }
    
    // 3. 记录同步日志
    const duration = Date.now() - startTime;
    stats.duration = duration;
    
    // [CLEANED] console.log('订单状态同步完成:', stats);
    
    return {
      success: true,
      message: '订单状态同步完成',
      stats
    };
    
  } catch (error) {
    console.error('订单状态同步失败:', error);
    
    const duration = Date.now() - startTime;
    
    return {
      success: false,
      message: '订单状态同步失败',
      error: error.message,
      stats: { ...stats, duration }
    };
  }
};
