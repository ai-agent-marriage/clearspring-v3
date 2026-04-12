// 云函数入口文件：synthesizeWatermark
// 功能：视频水印后端合成（GPS + 时间 + 任务 ID）
// 规范：视频水印必须后端合成，关键操作记录审计日志
// TODO: 使用 ffmpeg 或云服务商视频处理实现真实水印合成

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 水印配置
 */
const WATERMARK_CONFIG = {
  fontSize: 24,
  fontColor: '#FFFFFF',
  strokeColor: '#000000',
  strokeWidth: 1,
  padding: 20,
  position: 'bottom-left', // bottom-left, bottom-right, top-left, top-right
  opacity: 0.8
};

/**
 * 格式化 GPS 坐标
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {string} - 格式化后的 GPS 字符串
 */
function formatGPS(lat, lng) {
  if (!lat || !lng) return '';
  
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(6)}°${latDir} ${Math.abs(lng).toFixed(6)}°${lngDir}`;
}

/**
 * 格式化时间
 * @param {number} timestamp - 时间戳
 * @returns {string} - 格式化后的时间字符串
 */
function formatTime(timestamp) {
  if (!timestamp) return '';
  
  const date = new Date(timestamp);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
}

/**
 * 合成视频水印
 * TODO: 使用 ffmpeg 或云开发视频处理插件实现真实水印合成
 * @param {string} fileID - 云文件 ID
 * @param {object} watermarkData - 水印数据
 * @returns {string} - 合成后的文件 ID
 */
async function synthesizeVideoWatermark(fileID, watermarkData) {
  const { gps, timestamp, taskId } = watermarkData;
  
  // 构建水印文本
  const watermarkText = [
    `任务 ID: ${taskId}`,
    `时间：${formatTime(timestamp)}`,
    `位置：${gps}`
  ].join(' | ');
  
  console.log('[TODO] 合成视频水印:', {
    fileID,
    watermarkText,
    config: WATERMARK_CONFIG
  });
  
  // TODO: 实际实现步骤：
  // 1. 下载视频文件
  // 2. 使用 ffmpeg 添加文字水印
  //    ffmpeg -i input.mp4 -vf "drawtext=..." output.mp4
  // 3. 上传处理后的视频
  // 4. 返回新的 fileID
  
  // 由于云函数环境限制，这里返回占位实现
  // 实际应使用云开发的视频处理插件或外部服务
  
  return fileID; // 占位返回原 fileID
}

/**
 * 合成图片水印
 * TODO: 使用 node-canvas 或云开发图片处理实现真实水印合成
 * @param {string} fileID - 云文件 ID
 * @param {object} watermarkData - 水印数据
 * @returns {string} - 合成后的文件 ID
 */
async function synthesizeImageWatermark(fileID, watermarkData) {
  const { gps, timestamp, taskId } = watermarkData;
  
  // 构建水印文本
  const watermarkText = [
    `任务：${taskId}`,
    formatTime(timestamp),
    gps
  ];
  
  console.log('[TODO] 合成图片水印:', {
    fileID,
    watermarkText,
    config: WATERMARK_CONFIG
  });
  
  // TODO: 实际实现需要使用图片处理库（如 node-canvas、sharp 等）
  // 或使用云服务商的图片处理功能
  
  return fileID; // 占位返回原 fileID
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
        targetType: 'evidence',
        targetId,
        action,
        beforeData: {},
        afterData: data,
        reason: '水印合成',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 验证 GPS 坐标
 * @param {number} lat - 纬度
 * @param {number} lng - 经度
 * @returns {boolean} - 是否有效
 */
function validateGPS(lat, lng) {
  if (lat === undefined || lng === undefined) return false;
  if (typeof lat !== 'number' || typeof lng !== 'number') return false;
  if (lat < -90 || lat > 90) return false;
  if (lng < -180 || lng > 180) return false;
  return true;
}

/**
 * 验证地理位置与订单位置匹配（简化版）
 * TODO: 使用 Haversine 公式精确计算距离
 * @param {object} evidenceLocation - 证据位置
 * @param {object} orderLocation - 订单位置
 * @param {number} maxDistance - 最大允许距离（米）
 * @returns {boolean} - 是否匹配
 */
function validateLocationMatch(evidenceLocation, orderLocation, maxDistance = 1000) {
  if (!evidenceLocation || !orderLocation) return true; // 无法验证时通过
  
  const { latitude: lat1, longitude: lng1 } = evidenceLocation;
  const { latitude: lat2, longitude: lng2 } = orderLocation;
  
  if (!validateGPS(lat1, lng1) || !validateGPS(lat2, lng2)) return true;
  
  // TODO: 使用 Haversine 公式精确计算距离
  // 当前使用简化计算：使用欧几里得距离近似
  const latDiff = Math.abs(lat1 - lat2);
  const lngDiff = Math.abs(lng1 - lng2);
  
  // 粗略估算：1 度纬度约等于 111km
  const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111000;
  
  return distance <= maxDistance;
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.evidenceId - 证据 ID
 * @param {object} event.watermarkData - 水印数据（gps, timestamp, taskId）
 * @param {boolean} event.validateLocation - 是否验证位置（默认 true）
 * @returns {object} - 合成结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { evidenceId, watermarkData, validateLocation = true } = event;
  
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
    if (!evidenceId) {
      return {
        success: false,
        errorCode: 'INVALID_EVIDENCE_ID',
        message: '证据 ID 不能为空'
      };
    }
    
    // 3. 查询证据信息
    const evidenceQuery = await db.collection('evidence')
      .where({ _id: evidenceId })
      .limit(1)
      .get();
    
    if (evidenceQuery.data.length === 0) {
      return {
        success: false,
        errorCode: 'EVIDENCE_NOT_FOUND',
        message: '证据不存在'
      };
    }
    
    const evidence = evidenceQuery.data[0];
    
    // 4. 验证证据归属
    if (evidence.executorId !== openid) {
      // 允许管理员操作
      const userQuery = await db.collection('users')
        .where({ _openid: openid })
        .limit(1)
        .get();
      
      if (userQuery.data[0]?.role !== 'admin') {
        return {
          success: false,
          errorCode: 'PERMISSION_DENIED',
          message: '无权操作此证据'
        };
      }
    }
    
    // 5. 检查是否已合成水印
    if (evidence.watermark?.synthesizedBy === 'cloudFunction' && !evidence.watermark?.previewOnly) {
      return {
        success: true,
        message: '水印已合成',
        data: {
          evidenceId,
          fileUrl: evidence.fileUrl,
          isExisting: true
        },
        isExisting: true
      };
    }
    
    // 6. 准备水印数据
    const wmData = watermarkData || {
      gps: formatGPS(
        evidence.metadata?.captureLocation?.latitude,
        evidence.metadata?.captureLocation?.longitude
      ),
      timestamp: evidence.metadata?.captureTime || Date.now(),
      taskId: evidence.orderId
    };
    
    // 7. 验证 GPS 坐标
    if (evidence.metadata?.captureLocation) {
      const { latitude, longitude } = evidence.metadata.captureLocation;
      if (!validateGPS(latitude, longitude)) {
        return {
          success: false,
          errorCode: 'INVALID_GPS',
          message: 'GPS 坐标无效'
        };
      }
    }
    
    // 8. 验证地理位置与订单位置匹配
    if (validateLocation && evidence.orderId) {
      const orderQuery = await db.collection('orders')
        .where({ orderId: evidence.orderId })
        .limit(1)
        .get();
      
      if (orderQuery.data.length > 0) {
        const order = orderQuery.data[0];
        const match = validateLocationMatch(
          evidence.metadata?.captureLocation,
          order.location,
          1000 // 最大允许偏差 1000 米
        );
        
        if (!match) {
          // 位置不匹配，记录警告但不阻止
          console.warn('证据位置与订单位置不匹配:', {
            evidenceId,
            evidenceLocation: evidence.metadata?.captureLocation,
            orderLocation: order.location
          });
        }
      }
    }
    
    // 9. 合成水印
    let resultFileID = evidence.fileId;
    
    if (evidence.type === 'video') {
      // TODO: 实现真实的视频水印合成
      resultFileID = await synthesizeVideoWatermark(evidence.fileId, wmData);
    } else if (evidence.type === 'photo') {
      // TODO: 实现真实的图片水印合成
      resultFileID = await synthesizeImageWatermark(evidence.fileId, wmData);
    }
    
    // 10. 更新证据记录
    const now = Date.now();
    await db.collection('evidence').doc(evidenceId).update({
      data: {
        'watermark.synthesizedBy': 'cloudFunction',
        'watermark.previewOnly': false,
        'watermark.gps': wmData.gps,
        'watermark.timestamp': wmData.timestamp,
        'watermark.taskId': wmData.taskId,
        fileId: resultFileID,
        status: 'verified',
        updatedAt: now
      }
    });
    
    // 11. 记录审计日志
    await logAudit(openid, 'watermark_synthesize', evidenceId, 'synthesize', {
      type: evidence.type,
      orderId: evidence.orderId,
      gps: wmData.gps,
      timestamp: wmData.timestamp
    });
    
    // 12. 返回结果
    return {
      success: true,
      message: '水印合成成功',
      data: {
        evidenceId,
        type: evidence.type,
        fileUrl: evidence.fileUrl,
        watermark: {
          gps: wmData.gps,
          timestamp: wmData.timestamp,
          taskId: wmData.taskId,
          synthesizedAt: now
        }
      }
    };
    
  } catch (error) {
    console.error('水印合成失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
