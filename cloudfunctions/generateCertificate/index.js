// 云函数入口文件：generateCertificate
// 功能：功德证书异步生成（Canvas）
// 规范：后端 Canvas 生成，关键操作记录审计日志
// TODO: 实现真实的 Canvas 图片生成功能

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 生成证书编号
 * 格式：CERT + 年月日 + 4 位序列号
 * @returns {string} - 证书编号
 */
async function generateCertificateNo() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000;
  
  const countResult = await db.collection('certificates')
    .where({
      generateTime: _.gte(startOfDay).and(_.lt(endOfDay))
    })
    .count();
  
  const sequence = String(countResult.total + 1).padStart(4, '0');
  return `CERT${dateStr}${sequence}`;
}

/**
 * 公历转农历（简化版）
 * TODO: 使用专业农历库实现精确转换
 * @param {Date} date - 公历日期
 * @returns {string} - 农历日期字符串
 */
function convertToLunar(date) {
  // 简化实现，实际应使用专业农历库
  const lunarMonths = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
  const lunarDays = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                     '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                     '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
  
  const day = date.getDate();
  const month = date.getMonth();
  
  return `农历${lunarMonths[month]}月${lunarDays[Math.min(day - 1, 29)]}`;
}

/**
 * 获取黄历宜忌（简化版）
 * TODO: 接入专业黄历 API
 * @param {Date} date - 日期
 * @returns {object} - 宜忌信息
 */
function getLunarGoodDay(date) {
  // 简化实现，实际应查询专业黄历数据
  return {
    suit: ['放生', '祈福', '祭祀', '行善'],
    avoid: ['杀生', '争吵', '恶语']
  };
}

/**
 * 计算功德值
 * @param {string} species - 物种
 * @param {number} quantity - 数量
 * @returns {number} - 功德值
 */
function calculateMeritPoints(species, quantity) {
  // 根据物种和数量计算功德值
  const basePoints = {
    '鱼类': 10,
    '鸟类': 15,
    '龟类': 20,
    '其他': 5
  };
  
  const category = species?.category || '其他';
  const base = basePoints[category] || 5;
  
  // 数量加成
  const quantityBonus = Math.floor(quantity / 10);
  
  return base + quantityBonus;
}

/**
 * 生成证书图片（使用 Canvas）
 * TODO: 使用 node-canvas 或云开发图片处理实现真实图片生成
 * @param {object} certificateData - 证书数据
 * @returns {string} - 图片文件路径
 */
async function generateCertificateImage(certificateData) {
  // TODO: 真实实现需要使用 node-canvas 生成图片
  // 当前为模拟实现，返回占位路径
  
  const cloudPath = `certificates/${certificateData.orderId}/${certificateData.certificateNo}.png`;
  
  // [CLEANED] console.log('[TODO] 证书图片生成:', {
    certificateNo: certificateData.certificateNo,
    species: certificateData.species,
    quantity: certificateData.quantity,
    meritPoints: certificateData.meritPoints
  });
  
  return cloudPath;
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
        targetType: 'certificate',
        targetId,
        action,
        beforeData: {},
        afterData: data,
        reason: '证书生成',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.orderId - 订单 ID
 * @returns {object} - 生成结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orderId } = event;
  
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
    
    // 4. 验证订单状态（必须已完成或已确认）
    if (!['confirmed', 'completed'].includes(order.status)) {
      return {
        success: false,
        errorCode: 'ORDER_NOT_COMPLETED',
        message: '订单尚未完成，无法生成证书'
      };
    }
    
    // 5. 检查是否已生成证书
    if (order.certificateId) {
      const existingCert = await db.collection('certificates').doc(order.certificateId).get();
      if (existingCert.data) {
        return {
          success: true,
          message: '证书已生成',
          data: existingCert.data,
          isExisting: true
        };
      }
    }
    
    // 6. 生成证书编号
    const certificateNo = await generateCertificateNo();
    
    // 7. 准备证书数据
    const now = Date.now();
    const orderDate = new Date(order.createdAt);
    const dateStr = orderDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const lunarDate = convertToLunar(orderDate);
    const goodDay = getLunarGoodDay(orderDate);
    const meritPoints = calculateMeritPoints(order.species, order.quantity);
    
    const certificateData = {
      _id: `cert_${openid.slice(-8)}_${now}`,
      _openid: openid,
      orderId: order.orderId,
      prayerId: order.prayerId,
      certificateNo,
      species: order.species.name,
      quantity: order.quantity,
      location: `${order.location.city}${order.location.district}${order.location.address}`,
      date: dateStr,
      lunarDate,
      goodDay,
      wish: order.wish,
      meritPoints,
      imageUrl: '', // Canvas 生成后填充
      thumbnailUrl: '',
      generatedBy: 'cloudFunction',
      generatedAt: now,
      shared: false,
      saved: false
    };
    
    // 8. 生成证书图片（Canvas）
    // TODO: 实现真实的 Canvas 图片生成
    const cloudPath = await generateCertificateImage(certificateData);
    certificateData.imageUrl = cloudPath;
    certificateData.thumbnailUrl = cloudPath;
    
    // 9. 创建证书记录
    await db.collection('certificates').add({
      data: certificateData
    });
    
    // 10. 更新订单的证书 ID
    await db.collection('orders').doc(order._id).update({
      data: {
        certificateId: certificateData._id,
        updatedAt: now
      }
    });
    
    // 11. 更新祈福者的功德值
    await db.collection('users').where({
      _openid: order.prayerId
    }).update({
      data: {
        'prayerProfile.totalMerit': _.inc(meritPoints),
        'prayerProfile.speciesCount': _.inc(1),
        updatedAt: db.serverDate()
      }
    });
    
    // 12. 记录审计日志
    await logAudit(openid, 'certificate_generate', certificateData._id, 'generate', {
      orderId: order.orderId,
      certificateNo,
      meritPoints
    });
    
    // 13. 返回证书信息
    return {
      success: true,
      message: '证书生成成功',
      data: {
        certificateId: certificateData._id,
        certificateNo: certificateData.certificateNo,
        species: certificateData.species,
        quantity: certificateData.quantity,
        location: certificateData.location,
        date: certificateData.date,
        lunarDate: certificateData.lunarDate,
        meritPoints: certificateData.meritPoints,
        imageUrl: certificateData.imageUrl,
        generatedAt: certificateData.generatedAt
      }
    };
    
  } catch (error) {
    console.error('证书生成失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
