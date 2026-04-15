// 云函数入口文件：payCallback
// 功能：微信支付回调处理（幂等性核心）
// 核心：同一 transaction_id 多次回调只处理一次，确保不重复入账

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
  apiKey: process.env.WX_API_KEY || 'your_api_key'
};

/**
 * 验证微信支付签名
 * @param {object} data - 回调数据
 * @returns {boolean} - 签名是否有效
 */
function verifySign(data) {
  if (!data.sign) return false;
  
  const sign = data.sign;
  const params = { ...data };
  delete params.sign;
  
  const sortedKeys = Object.keys(params).sort();
  const signStr = sortedKeys
    .filter(k => params[k] !== undefined && params[k] !== '' && k !== 'sign')
    .map(k => `${k}=${params[k]}`)
    .join('&') + `&key=${WX_PAY_CONFIG.apiKey}`;
  
  const calculatedSign = crypto.createHash('md5').update(signStr).digest('hex').toUpperCase();
  
  return sign === calculatedSign;
}

/**
 * XML 转 JSON
 * @param {string} xml - XML 字符串
 * @returns {object} - JSON 对象
 */
function xmlToJson(xml) {
  const result = {};
  const regex = /<([^>]+)>([^<]*)<\/\1>/g;
  let match;
  
  while ((match = regex.exec(xml)) !== null) {
    result[match[1]] = match[2];
  }
  
  return result;
}

/**
 * 检查回调是否已处理（幂等性核心）
 * @param {string} transactionId - 微信交易号
 * @returns {object|null} - 已处理的回调记录，如果没有则返回 null
 */
async function checkCallbackProcessed(transactionId) {
  // 检查 pay_log 中是否有成功处理的记录
  const logQuery = await db.collection('pay_log')
    .where({
      transaction_id: transactionId,
      status: 1 // 1=成功
    })
    .limit(1)
    .get();
  
  if (logQuery.data.length > 0) {
    return {
      isProcessed: true,
      logId: logQuery.data[0].id,
      orderNo: logQuery.data[0].order_no
    };
  }
  
  return null;
}

/**
 * 获取支付日志记录（处理中状态）
 * @param {string} orderNo - 订单号
 * @returns {object|null} - 支付日志记录
 */
async function getPendingPayLog(orderNo) {
  const logQuery = await db.collection('pay_log')
    .where({
      order_no: orderNo,
      status: 3 // 3=处理中
    })
    .orderBy('create_time', 'desc')
    .limit(1)
    .get();
  
  return logQuery.data.length > 0 ? logQuery.data[0] : null;
}

/**
 * 更新支付日志为成功
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 交易 ID
 * @param {object} callbackInfo - 回调信息
 */
async function updatePayLogSuccess(orderNo, transactionId, callbackInfo) {
  // 先尝试更新处理中的记录
  const pendingLog = await getPendingPayLog(orderNo);
  
  if (pendingLog) {
    // 更新现有记录
    await db.collection('pay_log')
      .doc(pendingLog.id)
      .update({
        data: {
          transaction_id: transactionId,
          status: 1, // 1=成功
          callback_info: JSON.stringify(callbackInfo),
          update_time: db.serverDate()
        }
      });
    return pendingLog.id;
  } else {
    // 创建新记录
    const result = await db.collection('pay_log').add({
      data: {
        order_no: orderNo,
        transaction_id: transactionId,
        amount: parseFloat(callbackInfo.total_fee || 0) / 100,
        type: 1, // 1=支付
        status: 1, // 1=成功
        pay_channel: 'wechat',
        callback_info: JSON.stringify(callbackInfo),
        operator_openid: callbackInfo.openid || '',
        create_time: db.serverDate()
      }
    });
    return result._id;
  }
}

/**
 * 更新订单状态为已支付
 * @param {string} orderNo - 订单号
 * @param {string} transactionId - 交易 ID
 * @param {string} openid - 用户 openid
 */
async function updateOrderPaid(orderNo, transactionId, openid) {
  const orderQuery = await db.collection('order_protect')
    .where({ order_no: orderNo })
    .limit(1)
    .get();
  
  if (orderQuery.data.length === 0) {
    // 订单不存在，创建订单记录
    await db.collection('order_protect').add({
      data: {
        order_no: orderNo,
        user_id: openid,
        amount: 0, // 金额从回调中获取
        status: 2, // 2=已支付
        transaction_id: transactionId,
        pay_time: db.serverDate(),
        create_time: db.serverDate()
      }
    });
  } else {
    // 更新订单状态
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
}

/**
 * 发送支付成功通知
 * @param {string} openid - 用户 openid
 * @param {string} orderNo - 订单号
 * @param {number} amount - 金额
 */
async function sendPaySuccessNotification(openid, orderNo, amount) {
  try {
    // 调用 sendNotification 云函数发送通知
    await cloud.callFunction({
      name: 'sendNotification',
      data: {
        openid,
        templateId: 'pay_success',
        page: 'pages/order/detail',
        data: {
          orderNo: { value: orderNo },
          amount: { value: `¥${amount.toFixed(2)}` },
          time: { value: new Date().toLocaleString() }
        }
      }
    });
  } catch (error) {
    console.error('发送支付通知失败:', error);
  }
}

/**
 * 生成成功响应 XML
 * @param {string} returnCode - 返回码
 * @param {string} returnMsg - 返回消息
 * @returns {string} - XML 字符串
 */
function generateSuccessXml(returnCode = 'SUCCESS', returnMsg = 'OK') {
  return `<xml>
  <return_code><![CDATA[${returnCode}]]></return_code>
  <return_msg><![CDATA[${returnMsg}]]></return_msg>
</xml>`;
}

/**
 * 生成失败响应 XML
 * @param {string} returnCode - 返回码
 * @param {string} returnMsg - 返回消息
 * @returns {string} - XML 字符串
 */
function generateFailXml(returnCode = 'FAIL', returnMsg = '处理失败') {
  return `<xml>
  <return_code><![CDATA[${returnCode}]]></return_code>
  <return_msg><![CDATA[${returnMsg}]]></return_msg>
</xml>`;
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象（包含 HTTP 请求）
 * @returns {string} - XML 响应
 */
exports.main = async (event, context) => {
  try {
    // 1. 解析回调数据
    let callbackData;
    
    if (event.body && typeof event.body === 'string') {
      // HTTP 触发模式（从 API 网关）
      callbackData = xmlToJson(event.body);
    } else if (event.xml) {
      // 直接 XML 模式
      callbackData = event.xml;
    } else {
      // 测试模式（直接传对象）
      callbackData = event;
    }
    
    // 2. 校验必填字段
    const { return_code, result_code, transaction_id, out_trade_no, total_fee, openid } = callbackData;
    
    if (!transaction_id) {
      console.error('回调数据缺少 transaction_id');
      return generateFailXml('FAIL', '缺少交易号');
    }
    
    // 3. 【幂等性核心】检查是否已处理
    const processedCheck = await checkCallbackProcessed(transaction_id);
    
    if (processedCheck && processedCheck.isProcessed) {
      // [CLEANED] console.log(`交易 ${transaction_id} 已处理，返回成功（幂等性）`);
      // 已处理，直接返回成功（确保微信不再重复回调）
      return generateSuccessXml('SUCCESS', '已处理');
    }
    
    // 4. 验证支付结果
    if (return_code !== 'SUCCESS' || result_code !== 'SUCCESS') {
      console.error('支付失败:', callbackData);
      
      // 记录失败日志
      await updatePayLogSuccess(out_trade_no || '', transaction_id, {
        ...callbackData,
        status: 'failed'
      });
      
      return generateFailXml('FAIL', '支付失败');
    }
    
    // 5. 验证签名（生产环境必须开启）
    // if (!verifySign(callbackData)) {
    //   console.error('签名验证失败');
    //   return generateFailXml('FAIL', '签名失败');
    // }
    
    // 6. 更新支付日志为成功
    const orderNo = out_trade_no || `ORDER_${transaction_id}`;
    await updatePayLogSuccess(orderNo, transaction_id, callbackData);
    
    // 7. 更新订单状态为已支付
    await updateOrderPaid(orderNo, transaction_id, openid || '');
    
    // 8. 发送支付成功通知
    const amount = parseFloat(total_fee || 0) / 100;
    await sendPaySuccessNotification(openid || '', orderNo, amount);
    
    // [CLEANED] console.log(`支付回调处理成功：orderNo=${orderNo}, transactionId=${transaction_id}, amount=${amount}`);
    
    // 9. 返回成功响应
    return generateSuccessXml('SUCCESS', 'OK');
    
  } catch (error) {
    console.error('支付回调处理失败:', error);
    
    // 记录错误日志
    try {
      await db.collection('pay_log').add({
        data: {
          order_no: event.out_trade_no || 'UNKNOWN',
          transaction_id: event.transaction_id || '',
          amount: 0,
          type: 1,
          status: 2, // 2=失败
          pay_channel: 'wechat',
          callback_info: JSON.stringify({ error: error.message, stack: error.stack }),
          remark: '回调处理异常',
          create_time: db.serverDate()
        }
      });
    } catch (logError) {
      console.error('记录错误日志失败:', logError);
    }
    
    return generateFailXml('FAIL', `处理失败：${error.message}`);
  }
};
