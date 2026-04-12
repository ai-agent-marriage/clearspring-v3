// 云函数：错误日志记录
// 功能：记录客户端错误日志，便于问题排查

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { error, page, timestamp, userInfo, extra } = event;
  
  try {
    // 获取用户信息
    const wxContext = cloud.getWXContext();
    const userId = userInfo?.userId || wxContext.OPENID || 'unknown';
    
    // 创建错误日志记录
    const errorLog = {
      error: error || '未知错误',
      page: page || 'unknown',
      timestamp: timestamp || Date.now(),
      userId,
      openid: wxContext.OPENID,
      unionid: wxContext.UNIONID,
      env: cloud.DYNAMIC_CURRENT_ENV,
      extra: extra || {},
      createTime: db.serverDate()
    };
    
    // 存入错误日志集合
    await db.collection('error_logs').add({
      data: errorLog
    });
    
    // 如果是严重错误，发送告警通知（可选）
    if (error && (error.includes('数据库') || error.includes('权限') || error.includes('服务器'))) {
      // TODO: 发送告警通知到管理员
      console.warn('严重错误告警:', error);
    }
    
    return {
      code: 0,
      msg: '日志记录成功',
      data: {
        logId: errorLog.timestamp
      }
    };
    
  } catch (err) {
    console.error('记录错误日志失败:', err);
    return {
      code: 500,
      msg: '日志记录失败',
      error: err.message
    };
  }
};
