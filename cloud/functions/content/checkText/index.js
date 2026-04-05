// 云函数入口文件：checkText
// 功能：文本内容安全审核（自动审核）
// 规范：集成微信内容安全 API，记录审核日志到 content_audit 表

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 判定风险等级
 * @param {number} label - 微信返回的标签
 * @returns {string} - 风险等级
 */
function getRiskLevel(label) {
  // 微信标签：100 正常，200 初审疑似，201 审核确定违规
  if (label === 100) return 'normal';
  if (label === 200) return 'medium';
  if (label >= 201) return 'critical';
  return 'normal';
}

/**
 * 判定违规类型
 * @param {string} labelStr - 微信返回的标签字符串
 * @returns {string} - 违规类型
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
        type: 1, // 文本
        content: data.content?.substring(0, 1000), // 只存前 1000 字符
        file_id: '',
        file_url: '',
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
  const { content, business_type, business_id } = event;
  
  try {
    // 1. 参数校验
    if (!content || !business_type || !business_id) {
      return {
        success: false,
        errorCode: 'INVALID_PARAMS',
        message: '缺少必填参数'
      };
    }
    
    if (!openid) {
      return {
        success: false,
        errorCode: 'NOT_LOGGED_IN',
        message: '请先登录'
      };
    }
    
    // 2. 调用微信内容安全 API
    const security = cloud.openapi.security;
    let auditResult;
    
    try {
      auditResult = await security.msgSecCheck({
        content: content,
        version: 2 // 使用 v2 版本，支持更多检测场景
      });
    } catch (securityError) {
      console.error('微信内容安全 API 调用失败:', securityError);
      
      // API 失败时，默认转入人工审核
      const auditData = {
        content,
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
    
    // 3. 解析审核结果
    const label = auditResult.label; // 100=正常，200=疑似，201+=违规
    const detail = auditResult.detail || [];
    
    let autoAuditResult, manualAuditStatus, rejectReason, riskLevel, violationType;
    
    if (label === 100) {
      // 审核通过
      autoAuditResult = 'pass';
      manualAuditStatus = 'passed'; // 自动通过的不需要人工审核
      rejectReason = '';
      riskLevel = 'normal';
      violationType = '';
    } else if (label === 200) {
      // 疑似内容，转入人工审核
      autoAuditResult = 'review';
      manualAuditStatus = 'pending';
      rejectReason = '内容疑似违规，等待人工审核';
      riskLevel = 'medium';
      violationType = detail[0]?.label || 'other';
    } else {
      // 确定违规，直接拦截
      autoAuditResult = 'block';
      manualAuditStatus = 'rejected';
      rejectReason = '内容包含违规信息';
      riskLevel = 'critical';
      violationType = getViolationType(detail[0]?.label || '');
    }
    
    // 4. 记录审核日志
    await logAudit({
      content,
      user_openid: openid,
      business_type,
      business_id,
      auto_audit_result: autoAuditResult,
      manual_audit_status: manualAuditStatus,
      reject_reason: rejectReason,
      risk_level: riskLevel,
      violation_type: violationType
    });
    
    // 5. 返回结果
    return {
      success: true,
      result: autoAuditResult, // pass/review/block
      message: autoAuditResult === 'pass' ? '审核通过' : 
               autoAuditResult === 'block' ? '内容包含违规信息' : 
               '内容疑似违规，已转入人工审核',
      riskLevel,
      violationType,
      needManualAudit: autoAuditResult === 'review',
      wxLabel: label,
      wxDetail: detail
    };
    
  } catch (error) {
    console.error('文本审核失败:', error);
    
    // 系统异常时，默认转入人工审核（保证业务不中断）
    try {
      await logAudit({
        content: content?.substring(0, 1000),
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
      success: true, // 返回 success=true 避免阻塞业务
      result: 'review',
      message: '系统繁忙，已转入人工审核',
      riskLevel: 'medium',
      needManualAudit: true,
      error: error.message
    };
  }
};
