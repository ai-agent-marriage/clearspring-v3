// 云函数入口文件：auditContent
// 功能：人工审核内容（管理后台使用）
// 规范：仅管理员可操作，记录审核日志，支持通过/驳回

const cloud = require('wx-server-sdk');

// 初始化云开发环境
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();
const _ = db.command;

/**
 * 管理员权限校验
 */
async function checkAdminPermission(openid) {
  try {
    const userQuery = await db.collection('users')
      .where({ 
        _openid: openid,
        role: _.in(['admin', 'super_admin'])
      })
      .limit(1)
      .get();
    
    if (userQuery.data.length === 0) {
      const adminQuery = await db.collection('administrators')
        .where({ _openid: openid, status: 'active' })
        .limit(1)
        .get();
      
      if (adminQuery.data.length === 0) {
        return { allowed: false, message: '无权限访问' };
      }
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('权限校验失败:', error);
    return { allowed: false, message: '权限校验失败' };
  }
}

/**
 * 记录审核操作日志
 */
async function logAuditAction(auditId, auditorOpenid, action, reason) {
  try {
    await db.collection('audit_logs').add({
      data: {
        _openid: auditorOpenid,
        operatorId: auditorOpenid,
        operatorName: '管理员',
        operationType: 'content_audit',
        targetType: 'content_audit',
        targetId: auditId,
        action: action, // pass/reject
        beforeData: {},
        afterData: { reason },
        reason: reason || '',
        timestamp: db.serverDate()
      }
    });
  } catch (error) {
    console.error('审计日志记录失败:', error);
  }
}

/**
 * 云函数主入口
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { audit_id, action, reason } = event;
  
  try {
    // 1. 参数校验
    if (!audit_id || !action) {
      return {
        success: false,
        errorCode: 'INVALID_PARAMS',
        message: '缺少必填参数'
      };
    }
    
    if (!['pass', 'reject'].includes(action)) {
      return {
        success: false,
        errorCode: 'INVALID_ACTION',
        message: '不支持的操作类型'
      };
    }
    
    if (action === 'reject' && !reason) {
      return {
        success: false,
        errorCode: 'MISSING_REASON',
        message: '驳回时必须填写原因'
      };
    }
    
    // 2. 权限校验
    const permCheck = await checkAdminPermission(openid);
    if (!permCheck.allowed) {
      return {
        success: false,
        errorCode: 'PERMISSION_DENIED',
        message: permCheck.message
      };
    }
    
    // 3. 查询审核记录
    const auditRecord = await db.collection('content_audit')
      .doc(audit_id)
      .get();
    
    if (!auditRecord.data) {
      return {
        success: false,
        errorCode: 'AUDIT_NOT_FOUND',
        message: '审核记录不存在'
      };
    }
    
    const record = auditRecord.data;
    
    // 检查是否已审核
    if (record.manual_audit_status !== 'pending') {
      return {
        success: false,
        errorCode: 'ALREADY_AUDITED',
        message: '该记录已审核，无需重复操作'
      };
    }
    
    // 4. 更新审核记录
    const updateData = {
      manual_audit_status: action === 'pass' ? 'passed' : 'rejected',
      reject_reason: action === 'reject' ? reason : '',
      audit_time: db.serverDate(),
      auditor_openid: openid,
      update_time: db.serverDate()
    };
    
    await db.collection('content_audit')
      .doc(audit_id)
      .update({
        data: updateData
      });
    
    // 5. 记录审计日志
    await logAuditAction(audit_id, openid, action, reason);
    
    // 6. 如果是驳回，可能需要通知用户
    if (action === 'reject') {
      try {
        // 根据业务类型处理后续逻辑
        const businessType = record.business_type;
        const businessId = record.business_id;
        
        // 这里可以根据业务类型触发不同的后续处理
        // 例如：删除违规内容、通知用户等
        // [CLEANED] console.log('内容已驳回，业务类型:', businessType, '业务 ID:', businessId);
        
        // 可选：发送飞书通知给相关人员
        // await cloud.callFunction({
        //   name: 'notifyFeishu',
        //   data: {
        //     type: 'audit_reject',
        //     auditId: audit_id,
        //     businessType: businessType,
        //     businessId: businessId
        //   }
        // });
      } catch (notifyError) {
        console.error('发送通知失败:', notifyError);
        // 通知失败不影响审核结果
      }
    }
    
    // 7. 返回结果
    return {
      success: true,
      message: action === 'pass' ? '审核通过' : '已驳回',
      data: {
        audit_id,
        action,
        audit_time: new Date().toISOString()
      }
    };
    
  } catch (error) {
    console.error('审核操作失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
