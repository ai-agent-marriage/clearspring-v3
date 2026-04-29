// 云函数入口文件：login
// 功能：用户登录/注册（wx.login）
// 规范：敏感信息脱敏存储，关键操作记录审计日志

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 手机号脱敏处理
 * @param {string} phone - 原始手机号
 * @returns {string} - 脱敏后的手机号（138****1234）
 */
function maskPhone(phone) {
  if (!phone || phone.length !== 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
}

/**
 * 生成用户 ID
 * @param {string} openid - 用户 OpenID
 * @returns {string} - 用户 ID
 */
function generateUserId(openid) {
  return `user_${openid.slice(-8)}_${Date.now()}`;
}

/**
 * 记录审计日志
 * @param {string} operatorId - 操作者 ID
 * @param {string} operationType - 操作类型
 * @param {string} targetId - 目标 ID
 * @param {string} action - 操作动作
 * @param {object} data - 相关数据
 */
async function logAudit(operatorId, operationType, targetId, action, data = {}) {
  try {
    await db.collection('audit_logs').add({
      data: {
        _openid: operatorId,
        operatorId,
        operatorName: '系统',
        operationType,
        targetType: 'user',
        targetId,
        action,
        beforeData: {},
        afterData: data,
        reason: '用户登录/注册',
        ip: '',
        userAgent: '',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
    // 审计日志失败不影响主流程
  }
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.code - wx.login 返回的 code
 * @param {object} event.userInfo - 用户信息（昵称、头像等）
 * @param {string} event.phone - 用户手机号（可选，需按钮授权）
 * @returns {object} - 登录结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { code, userInfo, phone } = event;
  
  try {
    // 1. 校验必填参数
    if (!code) {
      return {
        success: false,
        errorCode: 'INVALID_CODE',
        message: '登录 code 不能为空'
      };
    }
    
    // 2. 通过 code 获取 openid（wx-server-sdk 自动处理）
    const openid = wxContext.OPENID;
    const unionid = wxContext.UNIONID || '';
    
    if (!openid) {
      return {
        success: false,
        errorCode: 'GET_OPENID_FAILED',
        message: '获取 OpenID 失败'
      };
    }
    
    // 3. 查询用户是否已存在
    const userQuery = await db.collection('users')
      .where({ _openid: openid })
      .limit(1)
      .get();
    
    let user;
    let isNewUser = false;
    
    if (userQuery.data.length > 0) {
      // 老用户登录
      user = userQuery.data[0];
      
      // 更新用户信息（如果提供了新的 userInfo）
      if (userInfo) {
        const updateData = {
          'userInfo.nickName': userInfo.nickName || user.userInfo?.nickName,
          'userInfo.avatarUrl': userInfo.avatarUrl || user.userInfo?.avatarUrl,
          'userInfo.gender': userInfo.gender !== undefined ? userInfo.gender : user.userInfo?.gender,
          updatedAt: db.serverDate()
        };
        
        // 如果有手机号，更新脱敏手机号
        if (phone) {
          updateData['userInfo.phone'] = maskPhone(phone);
          updateData['userInfo.encryptedPhone'] = phone; // 加密存储（实际应使用加密算法）
        }
        
        await db.collection('users').doc(user._id).update({
          data: updateData
        });
        
        // 刷新 user 对象
        user = (await db.collection('users').doc(user._id).get()).data;
      }
    } else {
      // 新用户注册
      isNewUser = true;
      const userId = generateUserId(openid);
      const now = Date.now();
      
      // 构建用户数据
      const userData = {
        _id: userId,
        _openid: openid,
        unionid,
        role: 'prayer', // 默认角色为祈福者
        userInfo: {
          nickName: userInfo?.nickName || '微信用户',
          avatarUrl: userInfo?.avatarUrl || '',
          gender: userInfo?.gender || 0,
          phone: phone ? maskPhone(phone) : '',
          encryptedPhone: phone || '' // 实际应加密存储
        },
        prayerProfile: {
          totalOrders: 0,
          totalMerit: 0,
          speciesCount: 0
        },
        createdAt: now,
        updatedAt: now
      };
      
      // 创建用户记录
      await db.collection('users').add({
        data: userData
      });
      
      user = userData;
      
      // 记录审计日志
      await logAudit(openid, 'user_register', userId, 'create', {
        nickName: user.userInfo.nickName,
        role: user.role
      });
    }
    
    // 4. 返回脱敏后的用户信息
    const safeUser = {
      userId: user._id,
      openid: user._openid,
      role: user.role,
      userInfo: {
        nickName: user.userInfo?.nickName,
        avatarUrl: user.userInfo?.avatarUrl,
        gender: user.userInfo?.gender,
        phone: user.userInfo?.phone // 已脱敏
      },
      executorProfile: user.executorProfile || null,
      prayerProfile: user.prayerProfile || null,
      isNewUser,
      createdAt: user.createdAt,
      lastLoginAt: Date.now()
    };
    
    // 记录登录审计日志
    await logAudit(openid, 'user_login', user._id, 'login', {
      isNewUser,
      loginTime: new Date().toISOString()
    });
    
    return {
      success: true,
      message: isNewUser ? '注册成功' : '登录成功',
      data: safeUser
    };
    
  } catch (error) {
    console.error('登录/注册失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
