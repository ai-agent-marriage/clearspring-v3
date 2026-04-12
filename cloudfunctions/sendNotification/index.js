// 云函数入口文件：sendNotification
// 功能：服务通知推送
// 规范：关键操作记录审计日志
// TODO: 接入真实的微信订阅消息 API

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 通知模板配置
 */
const NOTIFICATION_TEMPLATES = {
  // 订单状态变更通知
  ORDER_STATUS_CHANGE: {
    templateId: 'order_status_change',
    pages: {
      prayer: '/pages/prayer/order-detail',
      executor: '/pages/executor/order-detail'
    }
  },
  // 抢单成功通知
  ORDER_GRABBED: {
    templateId: 'order_grabbed',
    pages: {
      prayer: '/pages/prayer/order-detail'
    }
  },
  // 证据提交通知
  EVIDENCE_SUBMITTED: {
    templateId: 'evidence_submitted',
    pages: {
      prayer: '/pages/prayer/order-detail'
    }
  },
  // 证书生成通知
  CERTIFICATE_GENERATED: {
    templateId: 'certificate_generated',
    pages: {
      prayer: '/pages/prayer/certificate'
    }
  },
  // 分账完成通知
  PAYMENT_DIVIDED: {
    templateId: 'payment_divided',
    pages: {
      executor: '/pages/executor/income'
    }
  },
  // 提现申请通知
  WITHDRAWAL_REQUEST: {
    templateId: 'withdrawal_request',
    pages: {
      executor: '/pages/executor/income'
    }
  }
};

/**
 * 获取用户订阅消息权限
 * TODO: 实现真实的订阅次数查询
 * @param {string} openid - 用户 OpenID
 * @param {string} templateId - 模板 ID
 * @returns {number} - 剩余次数
 */
async function getSubscribeCount(openid, templateId) {
  // TODO: 查询微信订阅消息次数
  // 当前为模拟实现，返回 1 表示可以发送
  
  console.log('[TODO] 查询订阅消息次数:', {
    openid: openid.slice(-8),
    templateId
  });
  
  return 1; // 模拟返回有次数
}

/**
 * 扣减订阅消息次数
 * TODO: 实现真实的订阅次数扣减
 * @param {string} openid - 用户 OpenID
 * @param {string} templateId - 模板 ID
 */
async function decreaseSubscribeCount(openid, templateId) {
  // TODO: 扣减用户的订阅消息次数
  console.log('[TODO] 扣减订阅消息次数:', {
    openid: openid.slice(-8),
    templateId
  });
}

/**
 * 构建通知数据
 * @param {string} type - 通知类型
 * @param {object} data - 通知数据
 * @returns {object} - 微信订阅消息格式
 */
function buildNotificationData(type, data) {
  const templates = {
    ORDER_STATUS_CHANGE: {
      thing1: { value: data.orderId || '' }, // 订单号
      thing2: { value: data.status || '' }, // 状态
      time3: { value: data.time || '' }, // 时间
      thing4: { value: data.note || '' } // 备注
    },
    ORDER_GRABBED: {
      thing1: { value: data.orderId || '' }, // 订单号
      thing2: { value: data.executorName || '' }, // 执行者
      time3: { value: data.time || '' }, // 接单时间
      thing4: { value: data.tip || '' } // 提示
    },
    EVIDENCE_SUBMITTED: {
      thing1: { value: data.orderId || '' }, // 订单号
      thing2: { value: data.evidenceType || '' }, // 证据类型
      time3: { value: data.time || '' }, // 提交时间
      thing4: { value: data.tip || '' } // 提示
    },
    CERTIFICATE_GENERATED: {
      thing1: { value: data.certificateNo || '' }, // 证书编号
      thing2: { value: data.meritPoints || '' }, // 功德值
      time3: { value: data.time || '' }, // 生成时间
      thing4: { value: data.tip || '' } // 提示
    },
    PAYMENT_DIVIDED: {
      thing1: { value: data.orderId || '' }, // 订单号
      thing2: { value: `¥${data.income || '0.00'}` }, // 收入金额
      time3: { value: data.time || '' }, // 分账时间
      thing4: { value: data.tip || '' } // 提示
    },
    WITHDRAWAL_REQUEST: {
      thing1: { value: data.amount || '' }, // 提现金额
      thing2: { value: data.account || '' }, // 账号
      time3: { value: data.time || '' }, // 申请时间
      thing4: { value: data.status || '' } // 状态
    }
  };
  
  return templates[type] || {};
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
        targetType: 'notification',
        targetId,
        action,
        beforeData: {},
        afterData: data,
        reason: '通知推送',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 发送订阅消息
 * TODO: 调用真实的微信订阅消息 API
 * @param {string} toUser - 接收者 OpenID
 * @param {string} templateId - 模板 ID
 * @param {object} data - 消息数据
 * @param {string} page - 跳转页面
 */
async function sendSubscribeMessage(toUser, templateId, data, page) {
  try {
    // 检查订阅次数
    const count = await getSubscribeCount(toUser, templateId);
    if (count <= 0) {
      console.log(`用户 ${toUser} 无订阅消息次数，跳过发送`);
      return { success: false, reason: 'no_subscribe_count' };
    }
    
    // TODO: 调用微信订阅消息 API
    // cloud.openapi.subscribeMessage.send({
    //   touser: toUser,
    //   templateId,
    //   page,
    //   data,
    //   miniprogramState: 'formal'
    // });
    
    console.log('[TODO] 发送订阅消息:', {
      toUser: toUser.slice(-8),
      templateId,
      page,
      data
    });
    
    // 模拟发送成功
    // 扣减次数
    await decreaseSubscribeCount(toUser, templateId);
    
    return { success: true };
  } catch (error) {
    console.error('发送订阅消息失败:', error);
    
    // 错误码 43101 表示用户拒绝接收
    if (error.errCode === 43101) {
      return { success: false, reason: 'user_refused' };
    }
    
    throw error;
  }
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.type - 通知类型
 * @param {string} event.toUser - 接收者 OpenID（可选，不传则根据订单自动判断）
 * @param {string} event.orderId - 订单 ID（可选）
 * @param {object} event.data - 通知数据
 * @returns {object} - 发送结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { type, toUser, orderId, data = {} } = event;
  
  try {
    // 1. 校验通知类型
    if (!type || !NOTIFICATION_TEMPLATES[type]) {
      return {
        success: false,
        errorCode: 'INVALID_TYPE',
        message: '不支持的通知类型'
      };
    }
    
    const template = NOTIFICATION_TEMPLATES[type];
    
    // 2. 如果提供了 orderId，自动获取接收者
    let targetUser = toUser;
    let targetRole = '';
    
    if (orderId && !targetUser) {
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
      
      // 根据通知类型确定接收者
      if (type === 'ORDER_GRABBED' || type === 'EVIDENCE_SUBMITTED') {
        targetUser = order.prayerId;
        targetRole = 'prayer';
      } else if (type === 'PAYMENT_DIVIDED') {
        targetUser = order.executorId;
        targetRole = 'executor';
      } else {
        targetUser = order.prayerId;
        targetRole = 'prayer';
      }
    }
    
    if (!targetUser) {
      return {
        success: false,
        errorCode: 'INVALID_USER',
        message: '未指定接收者'
      };
    }
    
    // 3. 构建通知数据
    const notificationData = buildNotificationData(type, {
      ...data,
      time: data.time || new Date().toLocaleString('zh-CN')
    });
    
    // 4. 确定跳转页面
    let page = template.pages.prayer || '/pages/index/index';
    if (targetRole === 'executor' && template.pages.executor) {
      page = template.pages.executor;
    }
    
    // 5. 发送通知
    const sendResult = await sendSubscribeMessage(
      targetUser,
      template.templateId,
      notificationData,
      page
    );
    
    // 6. 记录审计日志
    await logAudit(openid || 'system', 'notification_send', `notif_${Date.now()}`, 'send', {
      type,
      toUser: targetUser,
      orderId,
      success: sendResult.success
    });
    
    // 7. 返回结果
    if (sendResult.success) {
      return {
        success: true,
        message: '通知发送成功',
        data: {
          type,
          toUser: targetUser,
          templateId: template.templateId
        }
      };
    } else {
      return {
        success: false,
        errorCode: 'SEND_FAILED',
        message: `通知发送失败：${sendResult.reason}`,
        data: {
          type,
          toUser: targetUser,
          reason: sendResult.reason
        }
      };
    }
    
  } catch (error) {
    console.error('发送通知失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
