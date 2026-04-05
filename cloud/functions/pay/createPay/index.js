// 云函数入口文件：createPay
// 功能：创建支付订单（幂等性设计）
// 核心：同一 order_no 多次调用只处理一次，返回相同支付参数

const cloud = require('wx-server-sdk');
const crypto = require('crypto');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

// 微信支付配置（实际使用时从环境变量读取）
const WX_PAY_CONFIG = {
  appId: process.env.WX_APP_ID || 'wxXXXXXXXX',
  mchId: process.env.WX_MCH_ID || '1234567890',
  apiKey: process.env.WX_API_KEY || 'your_api_key',
  notifyUrl: process.env.WX_NOTIFY_URL || 'https://your-domain.com/pay/callback'
};

/**
 * 生成唯一请求 ID（用于幂等性校验）
 * @param {string} orderNo - 订单号
 * @param {string} openid - 用户 openid
 * @returns {string} - 请求 ID
 */
function generateRequestId(orderNo, openid) {
  const str = `${orderNo}_${openid}_${Date.now()}`;
  return crypto.createHash('md5').update(str).digest('hex');
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
 * 生成微信支付订单号
 * @returns {string} - 微信支付订单号
 */
function generateOutTradeNo() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const random = randomString(8);
  return `${dateStr}${random}`;
}

/**
 * 记录支付日志
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 交易 ID
 * @param {number} amount - 金额
 * @param {string} openid - 用户 openid
 * @param {string} status - 状态
 * @param {string} remark - 备注
 */
async function logPay(orderNo, transactionId, amount, openid, status = '3', remark = '') {
  try {
    await db.collection('pay_log').add({
      data: {
        order_no: orderNo,
        transaction_id: transactionId,
        amount: amount,
        type: 1, // 1=支付
        status: parseInt(status), // 3=处理中
        pay_channel: 'wechat',
        operator_openid: openid,
        remark: remark,
        create_time: db.serverDate()
      }
    });
  } catch (error) {
    console.error('记录支付日志失败:', error);
  }
}

/**
 * 检查并处理幂等性
 * @param {string} orderNo - 订单号
 * @param {string} openid - 用户 openid
 * @returns {object|null} - 已存在的支付记录，如果没有则返回 null
 */
async function checkIdempotency(orderNo, openid) {
  // 1. 检查 pay_log 中是否有处理中或成功的记录
  const logQuery = await db.collection('pay_log')
    .where({
      order_no: orderNo,
      operator_openid: openid,
      status: _.in([1, 3]) // 1=成功，3=处理中
    })
    .orderBy('create_time', 'desc')
    .limit(1)
    .get();
  
  if (logQuery.data.length > 0) {
    const existingLog = logQuery.data[0];
    
    // 如果已有成功记录，直接返回
    if (existingLog.status === 1) {
      return {
        isExisting: true,
        transactionId: existingLog.transaction_id,
        status: 'success'
      };
    }
    
    // 如果处理中，返回处理中状态
    if (existingLog.status === 3) {
      return {
        isExisting: true,
        transactionId: existingLog.transaction_id,
        status: 'processing'
      };
    }
  }
  
  // 2. 检查 order_protect 表
  const orderQuery = await db.collection('order_protect')
    .where({ order_no: orderNo })
    .limit(1)
    .get();
  
  if (orderQuery.data.length > 0) {
    const order = orderQuery.data[0];
    
    // 已支付的订单
    if (order.status === 2 && order.transaction_id) {
      return {
        isExisting: true,
        transactionId: order.transaction_id,
        status: 'success'
      };
    }
    
    // 处理中的订单
    if (order.status === 1) {
      return {
        isExisting: true,
        transactionId: order.transaction_id || '',
        status: 'processing'
      };
    }
  }
  
  return null;
}

/**
 * 创建支付订单
 * @param {string} orderNo - 订单号
 * @param {number} amount - 金额（元）
 * @param {string} openid - 用户 openid
 * @param {string} body - 商品描述
 * @returns {object} - 支付参数
 */
async function createPayOrder(orderNo, amount, openid, body = '清如 ClearSpring - 订单支付') {
  const outTradeNo = generateOutTradeNo();
  const totalFee = Math.round(amount * 100); // 转为分
  
  // 构建统一下单参数
  const unifiedOrderParams = {
    appid: WX_PAY_CONFIG.appId,
    mch_id: WX_PAY_CONFIG.mchId,
    nonce_str: randomString(32),
    body: body,
    out_trade_no: outTradeNo,
    total_fee: totalFee,
    spbill_create_ip: '127.0.0.1',
    notify_url: WX_PAY_CONFIG.notifyUrl,
    trade_type: 'JSAPI',
    openid: openid
  };
  
  // 生成签名
  unifiedOrderParams.sign = generateSign(unifiedOrderParams);
  
  // 调用微信统一下单 API（实际环境中需要真实调用）
  // const result = await cloud.http.request({
  //   method: 'POST',
  //   url: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
  //   data: unifiedOrderParams
  // });
  
  // 模拟返回（实际使用时替换为真实调用）
  const mockResult = {
    return_code: 'SUCCESS',
    return_msg: 'OK',
    appid: WX_PAY_CONFIG.appId,
    mch_id: WX_PAY_CONFIG.mchId,
    nonce_str: randomString(32),
    sign: generateSign({
      appid: WX_PAY_CONFIG.appId,
      mch_id: WX_PAY_CONFIG.mchId,
      nonce_str: randomString(32),
      prepay_id: `wx_mock_${randomString(16)}`
    }),
    result_code: 'SUCCESS',
    prepay_id: `wx_mock_${randomString(16)}`
  };
  
  if (mockResult.return_code !== 'SUCCESS' || mockResult.result_code !== 'SUCCESS') {
    throw new Error('微信支付下单失败：' + (mockResult.return_msg || '未知错误'));
  }
  
  // 构建前端支付参数
  const payParams = {
    appId: mockResult.appid,
    timeStamp: Math.floor(Date.now() / 1000).toString(),
    nonceStr: randomString(32),
    package: `prepay_id=${mockResult.prepay_id}`,
    signType: 'MD5'
  };
  payParams.paySign = generateSign(payParams);
  
  return {
    outTradeNo,
    prepayId: mockResult.prepay_id,
    payParams
  };
}

/**
 * 更新订单状态为待支付
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 交易 ID
 * @param {number} amount - 金额
 * @param {string} openid - 用户 openid
 */
async function updateOrderToPending(orderNo, transactionId, amount, openid) {
  const expireTime = new Date(Date.now() + 15 * 60 * 1000); // 15 分钟后过期
  
  // 检查订单是否存在
  const orderQuery = await db.collection('order_protect')
    .where({ order_no: orderNo })
    .limit(1)
    .get();
  
  if (orderQuery.data.length === 0) {
    // 创建新订单
    await db.collection('order_protect').add({
      data: {
        order_no: orderNo,
        user_id: openid,
        amount: amount,
        status: 1, // 1=待支付
        transaction_id: transactionId,
        expire_time: expireTime,
        create_time: db.serverDate()
      }
    });
  } else {
    // 更新现有订单
    await db.collection('order_protect')
      .where({ order_no: orderNo })
      .update({
        data: {
          user_id: openid,
          amount: amount,
          status: 1,
          transaction_id: transactionId,
          expire_time: expireTime,
          update_time: db.serverDate()
        }
      });
  }
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.orderNo - 订单号
 * @param {number} event.amount - 金额（元）
 * @param {string} event.body - 商品描述（可选）
 * @returns {object} - 支付参数
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orderNo, amount, body } = event;
  
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
    
    if (!amount || amount <= 0) {
      return {
        success: false,
        errorCode: 'INVALID_AMOUNT',
        message: '支付金额无效'
      };
    }
    
    // 3. 【幂等性核心】检查是否已存在支付记录
    const idempotencyCheck = await checkIdempotency(orderNo, openid);
    
    if (idempotencyCheck) {
      if (idempotencyCheck.status === 'success') {
        // 已支付成功，返回成功状态
        return {
          success: true,
          message: '订单已支付',
          isExisting: true,
          data: {
            transactionId: idempotencyCheck.transactionId,
            status: 'paid'
          }
        };
      } else if (idempotencyCheck.status === 'processing') {
        // 处理中，返回处理中状态
        return {
          success: true,
          message: '支付处理中',
          isExisting: true,
          data: {
            transactionId: idempotencyCheck.transactionId,
            status: 'processing'
          }
        };
      }
    }
    
    // 4. 生成交易 ID
    const transactionId = generateRequestId(orderNo, openid);
    
    // 5. 记录支付日志（处理中状态）
    await logPay(orderNo, transactionId, amount, openid, '3', '创建支付订单');
    
    // 6. 创建支付订单
    const payResult = await createPayOrder(orderNo, amount, openid, body);
    
    // 7. 更新订单状态为待支付
    await updateOrderToPending(orderNo, payResult.outTradeNo, amount, openid);
    
    // 8. 返回支付参数
    return {
      success: true,
      message: '支付订单创建成功',
      data: {
        orderNo,
        transactionId: payResult.outTradeNo,
        amount,
        payParams: payResult.payParams,
        expireTime: Date.now() + 15 * 60 * 1000 // 15 分钟过期
      }
    };
    
  } catch (error) {
    console.error('创建支付订单失败:', error);
    
    // 记录失败日志
    await logPay(orderNo, '', amount, openid, '2', `创建失败：${error.message}`);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '创建支付订单失败，请稍后重试',
      error: error.message
    };
  }
};
