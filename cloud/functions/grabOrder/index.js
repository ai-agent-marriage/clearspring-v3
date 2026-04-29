// 云函数入口文件：grabOrder
// 功能：抢单（分布式锁，一单一人）
// 规范：分布式锁确保一单一人，关键操作记录审计日志

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 分布式锁相关常量
 */
const LOCK_EXPIRE_TIME = 5000; // 锁过期时间 5 秒
const LOCK_RETRY_INTERVAL = 100; // 重试间隔 100ms
const LOCK_MAX_RETRIES = 50; // 最大重试次数

/**
 * 尝试获取分布式锁
 * 使用云数据库的原子操作实现分布式锁
 * @param {string} orderId - 订单 ID
 * @param {string} executorId - 执行者 ID
 * @returns {object} - { locked: boolean, lockId: string }
 */
async function tryAcquireLock(orderId, executorId) {
  const lockId = `lock_${orderId}`;
  const now = Date.now();
  
  try {
    // 尝试创建或更新锁记录
    const lockQuery = await db.collection('locks').where({
      _id: lockId
    }).get();
    
    if (lockQuery.data.length === 0) {
      // 锁不存在，尝试创建
      try {
        await db.collection('locks').add({
          data: {
            _id: lockId,
            orderId,
            executorId,
            lockedAt: now,
            expiresAt: now + LOCK_EXPIRE_TIME
          }
        });
        return { locked: true, lockId };
      } catch (createError) {
        // 并发创建失败，说明其他请求已创建锁
        if (createError.errMsg?.includes('duplicate')) {
          return { locked: false, lockId };
        }
        throw createError;
      }
    } else {
      // 锁已存在，检查是否过期
      const lock = lockQuery.data[0];
      
      if (lock.expiresAt < now) {
        // 锁已过期，尝试更新
        const updateResult = await db.collection('locks').doc(lockId).update({
          data: {
            executorId,
            lockedAt: now,
            expiresAt: now + LOCK_EXPIRE_TIME
          }
        });
        
        if (updateResult.stats.updated === 1) {
          return { locked: true, lockId };
        }
        return { locked: false, lockId };
      }
      
      // 锁未过期
      return { locked: false, lockId };
    }
  } catch (error) {
    console.error('获取锁失败:', error);
    throw error;
  }
}

/**
 * 释放分布式锁
 * @param {string} lockId - 锁 ID
 */
async function releaseLock(lockId) {
  try {
    await db.collection('locks').doc(lockId).remove();
  } catch (error) {
    console.error('释放锁失败:', error);
    // 释放失败不影响主流程
  }
}

/**
 * 刷新锁的过期时间
 * @param {string} lockId - 锁 ID
 */
async function refreshLock(lockId) {
  try {
    await db.collection('locks').doc(lockId).update({
      data: {
        expiresAt: Date.now() + LOCK_EXPIRE_TIME
      }
    });
  } catch (error) {
    console.error('刷新锁失败:', error);
  }
}

/**
 * 手机号脱敏
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
        reason: '抢单操作',
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
 * @returns {object} - 抢单结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orderId } = event;
  
  let lockAcquired = false;
  let lockId = null;
  
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
    
    // 3. 查询用户信息（必须是执行者）
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
    
    // 检查用户角色
    if (user.role !== 'executor') {
      return {
        success: false,
        errorCode: 'INVALID_ROLE',
        message: '只有执行者才能抢单'
      };
    }
    
    // 检查执行者资质
    if (user.executorProfile?.qualificationStatus !== 'approved') {
      return {
        success: false,
        errorCode: 'QUALIFICATION_NOT_APPROVED',
        message: '您的执行者资质尚未审核通过'
      };
    }
    
    // 4. 查询订单状态
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
    
    // 检查订单状态
    if (order.status !== 'pending') {
      return {
        success: false,
        errorCode: 'ORDER_NOT_AVAILABLE',
        message: `订单已被${order.status === 'grabbed' ? '抢走' : order.status}`
      };
    }
    
    // 5. 尝试获取分布式锁（带重试）
    let retries = 0;
    while (retries < LOCK_MAX_RETRIES) {
      const lockResult = await tryAcquireLock(orderId, openid);
      
      if (lockResult.locked) {
        lockAcquired = true;
        lockId = lockResult.lockId;
        break;
      }
      
      // 等待后重试
      await new Promise(resolve => setTimeout(resolve, LOCK_RETRY_INTERVAL));
      retries++;
    }
    
    if (!lockAcquired) {
      return {
        success: false,
        errorCode: 'LOCK_FAILED',
        message: '抢单失败，订单已被他人抢走'
      };
    }
    
    // 6. 再次检查订单状态（双重检查）
    const orderCheck = await db.collection('orders')
      .where({ orderId })
      .limit(1)
      .get();
    
    if (orderCheck.data.length === 0 || orderCheck.data[0].status !== 'pending') {
      await releaseLock(lockId);
      return {
        success: false,
        errorCode: 'ORDER_TAKEN',
        message: '订单已被他人抢走'
      };
    }
    
    // 7. 更新订单状态
    const now = Date.now();
    await db.collection('orders').doc(order._id).update({
      data: {
        executorId: openid,
        executorInfo: {
          nickName: user.userInfo?.nickName || '执行者',
          avatarUrl: user.userInfo?.avatarUrl || '',
          phone: user.userInfo?.phone || '',
          rating: user.executorProfile?.rating || 5.0
        },
        status: 'grabbed',
        timeline: _.push({
          stage: 'grabbed',
          time: now,
          note: '执行者已接单'
        }),
        updatedAt: now
      }
    });
    
    // 8. 更新执行者接单统计
    await db.collection('users').doc(user._id).update({
      data: {
        'executorProfile.totalOrders': _.inc(1),
        updatedAt: db.serverDate()
      }
    });
    
    // 9. 记录审计日志
    await logAudit(openid, 'order_grab', orderId, 'grab', {
      executorId: openid,
      grabTime: new Date().toISOString()
    });
    
    // 10. 释放锁
    await releaseLock(lockId);
    lockAcquired = false;
    
    // 11. 返回结果
    return {
      success: true,
      message: '抢单成功',
      data: {
        orderId: order.orderId,
        executorId: openid,
        status: 'grabbed',
        grabbedAt: now
      }
    };
    
  } catch (error) {
    console.error('抢单失败:', error);
    
    // 确保释放锁
    if (lockAcquired && lockId) {
      await releaseLock(lockId);
    }
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
