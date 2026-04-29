// 云函数入口文件：checkImage
// 功能：图片内容安全审核（自动审核）
// 规范：集成微信内容安全 API，记录审核日志到 content_audit 表

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 判定风险等级
 */
function getRiskLevel(label) {
  if (label === 100) return 'normal';
  if (label === 200) return 'medium';
  if (label >= 201) return 'critical';
  return 'normal';
}

/**
 * 判定违规类型
 */
function getViolationType(labelStr) {
  const typeMap = {
    'porn': 'porn',
    '色情': 'porn',
    'politics': 'politics',
    '政治': 'politics',
    'violence': 'violence',
    '暴力': 'violence',
    'ads': 'ads',
    '广告': 'ads',
    'illegal': 'illegal',
    '违法': 'illegal'
  };
  
  for (const [key, value] of Object.entries(typeMap)) {
    if (labelStr.toLowerCase().includes(key)) {
      return value;
    }
  }
  return 'other';
}

/**
 * 记录审核日志到数据库
 */
async function logAudit(data) {
  try {
    await db.collection('content_audit').add({
      data: {
        type: 2, // 图片
        content: '',
        file_id: data.file_id,
        file_url: data.file_url,
        user_openid: data.user_openid,
        business_type: data.business_type,
        business_id: data.business_id,
        auto_audit_result: data.auto_audit_result,
        manual_audit_status: data.manual_audit_status,
        reject_reason: data.reject_reason || '',
        audit_time: db.serverDate(),
        auditor_openid: '',
        risk_level: data.risk_level,
        violation_type: data.violation_type
      }
    });
  } catch (error) {
    console.error('审核日志记录失败:', error);
  }
}

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { file_id, file_url, business_type, business_id } = event;
  
  try {
    // 1. 参数校验
    if (!file_id && !file_url) {
      return {
        success: false,
        errorCode: 'INVALID_PARAMS',
        message: '缺少文件 ID 或文件 URL'
      };
    }
    
    if (!business_type || !business_id) {
      return {
        success: false,
        errorCode: 'INVALID_PARAMS',
        message: '缺少业务参数'
      };
    }
    
    if (!openid) {
      return {
        success: false,
        errorCode: 'NOT_LOGGED_IN',
        message: '请先登录'
      };
    }
    
    // 2. 准备图片数据
    let mediaUrl = file_url;
    
    // 如果是 file_id，获取临时 URL
    if (file_id && !file_url) {
      try {
        const tempUrlResult = await cloud.getTempFileURL({
          fileList: [file_id]
        });
        
        if (tempUrlResult.fileList && tempUrlResult.fileList.length > 0) {
          mediaUrl = tempUrlResult.fileList[0].tempURL;
        }
      } catch (urlError) {
        console.error('获取临时 URL 失败:', urlError);
        return {
          success: false,
          errorCode: 'FILE_ACCESS_ERROR',
          message: '无法访问图片文件'
        };
      }
    }
    
    if (!mediaUrl) {
      return {
        success: false,
        errorCode: 'INVALID_FILE',
        message: '无效的文件'
      };
    }
    
    // 3. 调用微信内容安全 API
    const security = cloud.openapi.security;
    let auditResult;
    
    try {
      auditResult = await security.imgSecCheck({
        mediaUrl: mediaUrl,
        version: 2 // 使用 v2 版本
      });
    } catch (securityError) {
      console.error('微信内容安全 API 调用失败:', securityError);
      
      // API 失败时，默认转入人工审核
      const auditData = {
        file_id,
        file_url: mediaUrl,
        user_openid: openid,
        business_type,
        business_id,
        auto_audit_result: 'review',
        manual_audit_status: 'pending',
        reject_reason: '自动审核 API 异常，转入人工审核',
        risk_level: 'medium',
        violation_type: 'other'
      };
      
      await logAudit(auditData);
      
      return {
        success: true,
        result: 'review',
        message: '自动审核服务异常，已转入人工审核',
        riskLevel: 'medium',
        needManualAudit: true
      };
    }
    
    // 4. 解析审核结果
    const label = auditResult.label;
    const detail = auditResult.detail || [];
    
    let autoAuditResult, manualAuditStatus, rejectReason, riskLevel, violationType;
    
    if (label === 100) {
      autoAuditResult = 'pass';
      manualAuditStatus = 'passed';
      rejectReason = '';
      riskLevel = 'normal';
      violationType = '';
    } else if (label === 200) {
      autoAuditResult = 'review';
      manualAuditStatus = 'pending';
      rejectReason = '图片疑似违规，等待人工审核';
      riskLevel = 'medium';
      violationType = detail[0]?.label || 'other';
    } else {
      autoAuditResult = 'block';
      manualAuditStatus = 'rejected';
      rejectReason = '图片包含违规内容';
      riskLevel = 'critical';
      violationType = getViolationType(detail[0]?.label || '');
    }
    
    // 5. 记录审核日志
    await logAudit({
      file_id,
      file_url: mediaUrl,
      user_openid: openid,
      business_type,
      business_id,
      auto_audit_result: autoAuditResult,
      manual_audit_status: manualAuditStatus,
      reject_reason: rejectReason,
      risk_level: riskLevel,
      violation_type: violationType
    });
    
    // 6. 返回结果
    return {
      success: true,
      result: autoAuditResult,
      message: autoAuditResult === 'pass' ? '图片审核通过' : 
               autoAuditResult === 'block' ? '图片包含违规内容' : 
               '图片疑似违规，已转入人工审核',
      riskLevel,
      violationType,
      needManualAudit: autoAuditResult === 'review',
      wxLabel: label,
      wxDetail: detail
    };
    
  } catch (error) {
    console.error('图片审核失败:', error);
    
    // 系统异常时，默认转入人工审核
    try {
      await logAudit({
        file_id,
        file_url: file_url || '',
        user_openid: openid,
        business_type,
        business_id,
        auto_audit_result: 'review',
        manual_audit_status: 'pending',
        reject_reason: '系统异常，转入人工审核',
        risk_level: 'medium',
        violation_type: 'other'
      });
    } catch (logError) {
      console.error('异常日志记录失败:', logError);
    }
    
    return {
      success: true,
      result: 'review',
      message: '系统繁忙，已转入人工审核',
      riskLevel: 'medium',
      needManualAudit: true,
      error: error.message
    };
  }
};
