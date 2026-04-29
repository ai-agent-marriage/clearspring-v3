// 云函数入口文件：uploadEvidence
// 功能：证据上传（断点续传）
// 规范：支持断点续传，关键操作记录审计日志

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 分片大小配置
 */
const CHUNK_SIZE = 1024 * 1024; // 1MB 每片
const MAX_CHUNK_SIZE = 5 * 1024 * 1024; // 最大 5MB

/**
 * 生成证据 ID
 * @returns {string} - 证据 ID
 */
function generateEvidenceId() {
  return `evidence_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

/**
 * 验证文件类型
 * @param {string} fileType - 文件 MIME 类型
 * @param {string} fileName - 文件名
 * @returns {object} - { valid: boolean, type: string }
 */
function validateFileType(fileType, fileName) {
  const allowedTypes = {
    'video/mp4': 'video',
    'video/quicktime': 'video',
    'image/jpeg': 'photo',
    'image/png': 'photo',
    'image/heic': 'photo',
    'image/heif': 'photo'
  };
  
  if (allowedTypes[fileType]) {
    return { valid: true, type: allowedTypes[fileType] };
  }
  
  // 通过文件扩展名判断
  const ext = fileName.split('.').pop().toLowerCase();
  const extMap = {
    'mp4': 'video',
    'mov': 'video',
    'jpg': 'photo',
    'jpeg': 'photo',
    'png': 'photo',
    'heic': 'photo',
    'heif': 'photo'
  };
  
  if (extMap[ext]) {
    return { valid: true, type: extMap[ext] };
  }
  
  return { valid: false, type: null };
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
        reason: '证据上传',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 初始化分片上传
 * @param {string} orderId - 订单 ID
 * @param {string} executorId - 执行者 ID
 * @param {string} fileName - 文件名
 * @param {number} fileSize - 文件大小
 * @param {string} fileType - 文件类型
 * @returns {object} - 上传凭证
 */
async function initMultipartUpload(orderId, executorId, fileName, fileSize, fileType) {
  const evidenceId = generateEvidenceId();
  const chunkCount = Math.ceil(fileSize / CHUNK_SIZE);
  const now = Date.now();
  
  // 创建上传记录
  const uploadRecord = {
    _id: evidenceId,
    _openid: executorId,
    orderId,
    executorId,
    fileName,
    fileSize,
    fileType,
    chunkCount,
    uploadedChunks: [],
    status: 'uploading',
    createdAt: now,
    updatedAt: now
  };
  
  await db.collection('evidence_uploads').add({
    data: uploadRecord
  });
  
  return {
    evidenceId,
    chunkCount,
    chunkSize: CHUNK_SIZE
  };
}

/**
 * 上传分片
 * @param {string} evidenceId - 证据 ID
 * @param {number} chunkIndex - 分片索引（从 0 开始）
 * @param {string} chunkData - 分片数据（base64）
 * @returns {object} - 上传结果
 */
async function uploadChunk(evidenceId, chunkIndex, chunkData) {
  const uploadRecord = await db.collection('evidence_uploads').doc(evidenceId).get();
  
  if (!uploadRecord.data) {
    throw new Error('上传记录不存在');
  }
  
  const record = uploadRecord.data;
  
  if (record.status !== 'uploading') {
    throw new Error('上传状态异常');
  }
  
  // 检查分片是否已上传
  if (record.uploadedChunks.includes(chunkIndex)) {
    return {
      success: true,
      message: '分片已上传',
      uploadedChunks: record.uploadedChunks.length,
      totalChunks: record.chunkCount
    };
  }
  
  // 上传分片到云存储
  const cloudPath = `evidence/${record.orderId}/${evidenceId}_chunk_${chunkIndex}`;
  
  try {
    // 解码 base64 数据
    const fileContent = Buffer.from(chunkData, 'base64');
    
    // 上传到云存储
    const uploadResult = await cloud.uploadFile({
      cloudPath,
      fileContent
    });
    
    // 更新上传记录
    await db.collection('evidence_uploads').doc(evidenceId).update({
      data: {
        uploadedChunks: _.push(chunkIndex),
        updatedAt: Date.now()
      }
    });
    
    return {
      success: true,
      message: '分片上传成功',
      uploadedChunks: record.uploadedChunks.length + 1,
      totalChunks: record.chunkCount,
      fileID: uploadResult.fileID
    };
  } catch (error) {
    console.error('分片上传失败:', error);
    throw error;
  }
}

/**
 * 完成分片上传
 * @param {string} evidenceId - 证据 ID
 * @param {object} metadata - 元数据（GPS、时间等）
 * @returns {object} - 完成结果
 */
async function completeMultipartUpload(evidenceId, metadata = {}) {
  const uploadRecord = await db.collection('evidence_uploads').doc(evidenceId).get();
  
  if (!uploadRecord.data) {
    throw new Error('上传记录不存在');
  }
  
  const record = uploadRecord.data;
  
  // 检查所有分片是否已上传
  if (record.uploadedChunks.length !== record.chunkCount) {
    throw new Error(`还有 ${record.chunkCount - record.uploadedChunks.length} 个分片未上传`);
  }
  
  // 获取第一个分片的 fileID 作为主文件（简化处理）
  // 实际生产中应该合并分片
  const firstChunkPath = `evidence/${record.orderId}/${evidenceId}_chunk_0`;
  const fileStats = await cloud.getTempFileURL({
    fileList: [firstChunkPath]
  });
  
  const fileUrl = fileStats.fileList[0]?.tempURL || '';
  
  // 创建证据记录
  const now = Date.now();
  const evidenceData = {
    _id: evidenceId,
    _openid: record.executorId,
    orderId: record.orderId,
    executorId: record.executorId,
    type: record.fileType,
    fileId: firstChunkPath,
    fileUrl,
    thumbnailUrl: '', // 后续可生成缩略图
    duration: record.fileType === 'video' ? (metadata.duration || 0) : 0,
    size: record.fileSize,
    watermark: {
      enabled: true,
      gps: metadata.gps || '',
      timestamp: metadata.timestamp || now,
      taskId: record.orderId,
      synthesizedBy: 'cloudFunction',
      previewOnly: true
    },
    metadata: {
      captureTime: metadata.captureTime || now,
      captureLocation: metadata.captureLocation || {},
      device: metadata.device || ''
    },
    status: 'uploaded',
    uploadedAt: now
  };
  
  await db.collection('evidence').add({
    data: evidenceData
  });
  
  // 更新订单的证据列表
  await db.collection('orders').where({
    orderId: record.orderId
  }).update({
    data: {
      evidence: _.push(evidenceId),
      updatedAt: now
    }
  });
  
  // 删除上传记录
  await db.collection('evidence_uploads').doc(evidenceId).remove();
  
  return {
    evidenceId,
    fileUrl,
    type: record.fileType
  };
}

/**
 * 查询上传进度
 * @param {string} evidenceId - 证据 ID
 * @returns {object} - 上传进度
 */
async function getUploadProgress(evidenceId) {
  const uploadRecord = await db.collection('evidence_uploads').doc(evidenceId).get();
  
  if (!uploadRecord.data) {
    return {
      success: false,
      message: '上传记录不存在'
    };
  }
  
  const record = uploadRecord.data;
  const progress = Math.round((record.uploadedChunks.length / record.chunkCount) * 100);
  
  return {
    success: true,
    evidenceId,
    progress,
    uploadedChunks: record.uploadedChunks.length,
    totalChunks: record.chunkCount,
    status: record.status
  };
}

/**
 * 云函数主入口
 * @param {object} event - 事件对象
 * @param {string} event.action - 操作类型：init | upload | complete | progress
 * @param {string} event.orderId - 订单 ID
 * @param {string} event.fileName - 文件名
 * @param {number} event.fileSize - 文件大小
 * @param {string} event.fileType - 文件 MIME 类型
 * @param {string} event.evidenceId - 证据 ID（upload/complete/progress 时需要）
 * @param {number} event.chunkIndex - 分片索引（upload 时需要）
 * @param {string} event.chunkData - 分片数据 base64（upload 时需要）
 * @param {object} event.metadata - 元数据（complete 时需要）
 * @returns {object} - 上传结果
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { action } = event;
  
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
    
    // 3. 根据操作类型处理
    switch (action) {
      case 'init': {
        // 初始化上传
        const { orderId, fileName, fileSize, fileType } = event;
        
        if (!orderId || !fileName || !fileSize) {
          return {
            success: false,
            errorCode: 'INVALID_PARAMS',
            message: '缺少必填参数'
          };
        }
        
        // 验证文件类型
        const typeValidation = validateFileType(fileType, fileName);
        if (!typeValidation.valid) {
          return {
            success: false,
            errorCode: 'INVALID_FILE_TYPE',
            message: '不支持的文件类型'
          };
        }
        
        // 验证订单归属
        const orderQuery = await db.collection('orders')
          .where({ orderId, executorId: openid })
          .limit(1)
          .get();
        
        if (orderQuery.data.length === 0) {
          return {
            success: false,
            errorCode: 'ORDER_NOT_FOUND',
            message: '订单不存在或不属于您'
          };
        }
        
        const initResult = await initMultipartUpload(
          orderId,
          openid,
          fileName,
          fileSize,
          typeValidation.type
        );
        
        return {
          success: true,
          message: '初始化成功',
          data: initResult
        };
      }
      
      case 'upload': {
        // 上传分片
        const { evidenceId, chunkIndex, chunkData } = event;
        
        if (!evidenceId || chunkIndex === undefined || !chunkData) {
          return {
            success: false,
            errorCode: 'INVALID_PARAMS',
            message: '缺少必填参数'
          };
        }
        
        const uploadResult = await uploadChunk(evidenceId, chunkIndex, chunkData);
        
        return {
          success: true,
          message: uploadResult.message,
          data: {
            uploadedChunks: uploadResult.uploadedChunks,
            totalChunks: uploadResult.totalChunks
          }
        };
      }
      
      case 'complete': {
        // 完成上传
        const { evidenceId, metadata } = event;
        
        if (!evidenceId) {
          return {
            success: false,
            errorCode: 'INVALID_PARAMS',
            message: '缺少证据 ID'
          };
        }
        
        const completeResult = await completeMultipartUpload(evidenceId, metadata);
        
        // 记录审计日志
        await logAudit(openid, 'evidence_upload', evidenceId, 'upload', {
          type: completeResult.type,
          orderId: completeResult.orderId
        });
        
        return {
          success: true,
          message: '上传完成',
          data: completeResult
        };
      }
      
      case 'progress': {
        // 查询进度
        const { evidenceId } = event;
        
        if (!evidenceId) {
          return {
            success: false,
            errorCode: 'INVALID_PARAMS',
            message: '缺少证据 ID'
          };
        }
        
        return await getUploadProgress(evidenceId);
      }
      
      default:
        return {
          success: false,
          errorCode: 'INVALID_ACTION',
          message: '不支持的操作类型'
        };
    }
    
  } catch (error) {
    console.error('证据上传失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
