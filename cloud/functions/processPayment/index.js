// 云函数入口文件：processPayment
// 功能：支付分账处理（90% 执行者/10% 平台）
// 规范：敏感信息脱敏存储，关键操作记录审计日志

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 分账配置
 */
const DIVISION_CONFIG = {
  EXECUTOR_RATIO: 0.9,  // 执行者 90%
  PLATFORM_RATIO: 0.1,  // 平台 10%
  MIN_AMOUNT: 0.01      // 最小金额（分）
};

/**
 * 生成交易 ID
 * @returns {string} - 交易 ID
 */
function generateTransactionId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TXN${dateStr}${random}`;
}

/**
 * 手机号脱敏
 */
function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 金额格式化（元转分）
 * @param {number} yuan - 金额（元）
 * @returns {number} - 金额（分）
 */
function yuanToFen(yuan) {
  return Math.round(yuan * 100);
}

/**
 * 金额格式化（分转元）
 * @param {number} fen - 金额（分）
 * @returns {number} - 金额（元）
 */
function fenToYuan(fen) {
  return fen / 100;
}

/**
 * 记录审计日志
 */
async function logAudit(operatorId, operationType, targetId, action, data = {}) {
  try {
    await db.collection('audit_logs').add({
      data: {
        _openid: operatorId,
        operatorId,
        operatorName: '系统',
        operationType,
        targetType: 'transaction',
        targetId,
        action,
        beforeData: {},
        afterData: data,
        reason: '支付分账',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 计算分账金额
 * @param {number} totalAmount - 总金额（元）
 * @returns {object} - 分账结果
 */
function calculateDivision(totalAmount) {
  const totalFen = yuanToFen(totalAmount);
  
  const executorFen = Math.floor(totalFen * DIVISION_CONFIG.EXECUTOR_RATIO);
  const platformFen = totalFen - executorFen; // 剩余给平台，避免精度问题
  
  return {
    totalAmount,
    executorIncome: fenToYuan(executorFen),
    platformFee: fenToYuan(platformFen),
    ratio: '90_10'
  };
}

/**
 * 创建交易记录
 * @param {object} order - 订单数据
 * @param {object} division - 分账计算结果
 * @returns {string} - 交易 ID
 */
async function createTransaction(order, division) {
  const transactionId = generateTransactionId();
  const now = Date.now();
  
  const transactionData = {
    _id: `txn_${order.orderId}_${now}`,
    _openid: order.prayerId,
    transactionId,
    orderId: order.orderId,
    type: 'division',
    amount: division.totalAmount,
    platformFee: division.platformFee,
    executorIncome: division.executorIncome,
    parties: [
      {
        userId: order.prayerId,
        role: 'prayer',
        amount: -division.totalAmount,
        status: 'paid'
      },
      {
        userId: order.executorId,
        role: 'executor',
        amount: division.executorIncome,
        status: 'withdrawable'
      },
      {
        userId: 'platform',
        role: 'platform',
        amount: division.platformFee,
        status: 'settled'
      }
    ],
    division: {
      rule: division.ratio,
      executedAt: now,
      status: 'completed'
    },
    withdrawal: {
      method: 'wechat_wallet',
      account: order.executorInfo?.phone ? maskPhone(order.executorInfo.phone) : '',
      executedAt: null,
      status: 'pending'
    },
    status: 'completed',
    createdAt: now,
    completedAt: now
  };
  
  await db.collection('transactions').add({
    data: transactionData
  });
  
  return transactionId;
}

/**
 * 更新订单支付状态
 * @param {string} orderId - 订单 ID
 * @param {string} transactionId - 交易 ID
 */
async function updateOrderPayment(orderId, transactionId) {
  const now = Date.now();
  
  await db.collection('orders').where({
    orderId
  }).update({
    data: {
      'payment.transactionId': transactionId,
      'payment.payTime': now,
      'payment.status': 'divided',
      updatedAt: now
    }
  });
}

/**
 * 更新执行者收入
 * @param {string} executorId - 执行者 ID
 * @param {number} income - 收入金额
 */
async function updateExecutorIncome(executorId, income) {
  await db.collection('users').where({
    _openid: executorId
  }).update({
    data: {
      'executorProfile.totalIncome': _.inc(income),
      updatedAt: db.serverDate()
    }
  });
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.orderId - 订单 ID
 * @param {string} event.transactionId - 微信支付交易 ID（可选，已有支付时提供）
 * @returns {object} - 分账结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orderId, transactionId: externalTransactionId } = event;
  
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
    if (!orderId) {
      return {
        success: false,
        errorCode: 'INVALID_ORDER_ID',
        message: '订单 ID 不能为空'
      };
    }
    
    // 3. 查询订单信息
    const orderQuery = await db.collection('orders')
      .where({ orderId })
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
    
    // 4. 验证订单状态
    if (order.status !== 'completed') {
      return {
        success: false,
        errorCode: 'ORDER_NOT_COMPLETED',
        message: '订单尚未完成，无法分账'
      };
    }
    
    // 5. 检查是否已分账
    if (order.payment?.status === 'divided') {
      const existingTxn = await db.collection('transactions')
        .where({ orderId })
        .limit(1)
        .get();
      
      if (existingTxn.data.length > 0) {
        return {
          success: true,
          message: '已分账',
          data: existingTxn.data[0],
          isExisting: true
        };
      }
    }
    
    // 6. 验证订单金额
    if (!order.actualPrice || order.actualPrice <= 0) {
      return {
        success: false,
        errorCode: 'INVALID_AMOUNT',
        message: '订单金额无效'
      };
    }
    
    // 7. 计算分账
    const division = calculateDivision(order.actualPrice);
    
    // 8. 创建交易记录
    const transactionId = await createTransaction(order, division);
    
    // 9. 更新订单支付状态
    await updateOrderPayment(orderId, externalTransactionId || transactionId);
    
    // 10. 更新执行者收入
    await updateExecutorIncome(order.executorId, division.executorIncome);
    
    // 11. 记录审计日志
    await logAudit(openid, 'payment_division', transactionId, 'division', {
      orderId,
      totalAmount: division.totalAmount,
      executorIncome: division.executorIncome,
      platformFee: division.platformFee
    });
    
    // 12. 返回分账结果
    return {
      success: true,
      message: '分账成功',
      data: {
        transactionId,
        orderId: order.orderId,
        totalAmount: division.totalAmount,
        executorIncome: division.executorIncome,
        platformFee: division.platformFee,
        ratio: division.ratio,
        executorAccount: order.executorInfo?.phone ? maskPhone(order.executorInfo.phone) : '',
        completedAt: Date.now()
      }
    };
    
  } catch (error) {
    console.error('支付分账失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
