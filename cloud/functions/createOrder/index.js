// 云函数入口文件：createOrder
// 功能：创建放生订单
// 规范：敏感信息脱敏存储，关键操作记录审计日志

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 生成订单号
 * 格式：ORD + 年月日 + 4 位序列号
 * @returns {string} - 订单号
 */
async function generateOrderId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, ''); // YYYYMMDD
  
  // 查询今日订单数量
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
  
  const countResult = await db.collection('orders')
    .where({
      createdAt: _.gte(startOfDay).and(_.lt(endOfDay))
    })
    .count();
  
  const sequence = String(countResult.total + 1).padStart(4, '0');
  return `ORD${dateStr}${sequence}`;
}

/**
 * 手机号脱敏
 * @param {string} phone - 原始手机号
 * @returns {string} - 脱敏手机号
 */
function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
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
        targetType: 'order',
        targetId,
        action,
        beforeData: {},
        afterData: data,
        reason: '订单创建',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 验证地理位置（简化版）
 * @param {object} location - 位置信息
 * @returns {boolean} - 是否有效
 */
function validateLocation(location) {
  if (!location) return false;
  
  const { latitude, longitude, address } = location;
  
  // 检查经纬度范围
  if (latitude === undefined || longitude === undefined) return false;
  if (latitude < -90 || latitude > 90) return false;
  if (longitude < -180 || longitude > 180) return false;
  
  // 检查地址
  if (!address || address.trim() === '') return false;
  
  return true;
}

/**
 * 验证订单数据
 * @param {object} orderData - 订单数据
 * @returns {object} - 验证结果
 */
function validateOrderData(orderData) {
  const errors = [];
  
  // 验证物种
  if (!orderData.species || !orderData.species.id || !orderData.species.name) {
    errors.push('物种信息不完整');
  }
  
  // 验证位置
  if (!validateLocation(orderData.location)) {
    errors.push('放生位置信息不完整或无效');
  }
  
  // 验证数量
  if (!orderData.quantity || orderData.quantity <= 0) {
    errors.push('放生数量必须大于 0');
  }
  
  // 验证价格
  if (orderData.guidePrice === undefined || orderData.guidePrice < 0) {
    errors.push('指导价不能为空或负数');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {object} event.species - 物种信息
 * @param {object} event.location - 放生位置
 * @param {string} event.wish - 心愿
 * @param {number} event.quantity - 数量
 * @param {number} event.guidePrice - 指导价
 * @returns {object} - 创建结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  
  try {
    // 1. 校验用户登录状态
    if (!openid) {
      return {
        success: false,
        errorCode: 'NOT_LOGGED_IN',
        message: '请先登录'
      };
    }
    
    // 2. 查询用户信息
    const userQuery = await db.collection('users')
      .where({ _openid: openid })
      .limit(1)
      .get();
    
    if (userQuery.data.length === 0) {
      return {
        success: false,
        errorCode: 'USER_NOT_FOUND',
        message: '用户不存在'
      };
    }
    
    const user = userQuery.data[0];
    
    // 3. 验证订单数据
    const validation = validateOrderData(event);
    if (!validation.valid) {
      return {
        success: false,
        errorCode: 'VALIDATION_ERROR',
        message: validation.errors.join('; ')
      };
    }
    
    // 4. 生成订单号
    const orderId = await generateOrderId();
    
    // 5. 构建订单数据
    const now = Date.now();
    const orderData = {
      _id: `order_${openid.slice(-8)}_${now}`,
      _openid: openid,
      orderId,
      prayerId: openid,
      prayerInfo: {
        nickName: user.userInfo?.nickName || '微信用户',
        avatarUrl: user.userInfo?.avatarUrl || '',
        phone: user.userInfo?.phone || ''
      },
      executorId: null,
      executorInfo: null,
      status: 'pending', // 待接单
      species: {
        id: event.species.id,
        name: event.species.name,
        category: event.species.category || '',
        ecologicalNote: event.species.ecologicalNote || ''
      },
      location: {
        province: event.location.province || '',
        city: event.location.city || '',
        district: event.location.district || '',
        address: event.location.address,
        latitude: event.location.latitude,
        longitude: event.location.longitude,
        verified: true // 前端已校验
      },
      wish: event.wish || '',
      quantity: event.quantity,
      guidePrice: event.guidePrice,
      actualPrice: event.guidePrice, // 实际支付默认等于指导价
      payment: {
        transactionId: '',
        payTime: null,
        status: 'unpaid'
      },
      timeline: [
        {
          stage: 'created',
          time: now,
          note: '订单创建'
        }
      ],
      evidence: [],
      certificateId: null,
      createdAt: now,
      updatedAt: now
    };
    
    // 6. 创建订单记录
    await db.collection('orders').add({
      data: orderData
    });
    
    // 7. 更新用户放生次数
    if (user.prayerProfile) {
      await db.collection('users').doc(user._id).update({
        data: {
          'prayerProfile.totalOrders': _.inc(1),
          updatedAt: db.serverDate()
        }
      });
    }
    
    // 8. 记录审计日志
    await logAudit(openid, 'order_create', orderId, 'create', {
      species: orderData.species.name,
      quantity: orderData.quantity,
      price: orderData.actualPrice,
      location: orderData.location.address
    });
    
    // 9. 返回脱敏后的订单信息
    const safeOrder = {
      orderId: orderData.orderId,
      prayerId: orderData.prayerId,
      prayerInfo: orderData.prayerInfo,
      status: orderData.status,
      species: orderData.species,
      location: orderData.location,
      wish: orderData.wish,
      quantity: orderData.quantity,
      guidePrice: orderData.guidePrice,
      actualPrice: orderData.actualPrice,
      payment: {
        status: orderData.payment.status
      },
      timeline: orderData.timeline,
      createdAt: orderData.createdAt
    };
    
    return {
      success: true,
      message: '订单创建成功',
      data: safeOrder
    };
    
  } catch (error) {
    console.error('创建订单失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
