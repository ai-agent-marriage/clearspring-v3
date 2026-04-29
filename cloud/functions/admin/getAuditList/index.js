// 云函数入口文件：getAuditList
// 功能：获取内容审核列表（管理后台使用）
// 规范：支持分页、筛选、排序，仅管理员可访问

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
      // 尝试从管理员表查询
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
 * 云函数主入口
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const {
    page = 1,
    pageSize = 20,
    manual_audit_status,
    auto_audit_result,
    type,
    business_type,
    user_openid,
    start_time,
    end_time,
    orderBy = 'create_time',
    order = 'desc'
  } = event;
  
  try {
    // 1. 权限校验
    const permCheck = await checkAdminPermission(openid);
    if (!permCheck.allowed) {
      return {
        success: false,
        errorCode: 'PERMISSION_DENIED',
        message: permCheck.message
      };
    }
    
    // 2. 构建查询条件
    const queryConditions = {};
    
    if (manual_audit_status) {
      queryConditions.manual_audit_status = manual_audit_status;
    }
    
    if (auto_audit_result) {
      queryConditions.auto_audit_result = auto_audit_result;
    }
    
    if (type) {
      queryConditions.type = parseInt(type);
    }
    
    if (business_type) {
      queryConditions.business_type = business_type;
    }
    
    if (user_openid) {
      queryConditions.user_openid = user_openid;
    }
    
    // 时间范围筛选
    if (start_time || end_time) {
      queryConditions.create_time = {};
      if (start_time) {
        queryConditions.create_time['>='] = new Date(start_time);
      }
      if (end_time) {
        queryConditions.create_time['<='] = new Date(end_time);
      }
    }
    
    // 3. 执行查询
    let query = db.collection('content_audit').where(queryConditions);
    
    // 排序
    const orderDirection = order === 'asc' ? 'asc' : 'desc';
    query = query.orderBy(orderBy, orderDirection);
    
    // 分页
    const skip = (page - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);
    
    const result = await query.get();
    
    // 4. 获取总数
    const totalQuery = db.collection('content_audit').where(queryConditions);
    const totalResult = await totalQuery.count();
    const total = totalResult.total;
    
    // 5. 获取待审核数量（用于 badge 显示）
    const pendingQuery = db.collection('content_audit')
      .where({ manual_audit_status: 'pending' })
      .count();
    const pendingCount = (await pendingQuery).total;
    
    // 6. 格式化返回数据
    const list = result.data.map(item => ({
      id: item._id || item.id,
      type: item.type,
      typeName: item.type === 1 ? '文本' : item.type === 2 ? '图片' : '视频',
      content: item.content,
      file_id: item.file_id,
      file_url: item.file_url,
      user_openid: item.user_openid,
      business_type: item.business_type,
      business_id: item.business_id,
      auto_audit_result: item.auto_audit_result,
      autoAuditResultName: item.auto_audit_result === 'pass' ? '通过' : 
                           item.auto_audit_result === 'block' ? '拦截' : '待审',
      manual_audit_status: item.manual_audit_status,
      manualAuditStatusName: item.manual_audit_status === 'pending' ? '待审核' : 
                             item.manual_audit_status === 'passed' ? '已通过' : '已驳回',
      reject_reason: item.reject_reason,
      audit_time: item.audit_time,
      auditor_openid: item.auditor_openid,
      risk_level: item.risk_level,
      riskLevelName: item.risk_level === 'normal' ? '正常' : 
                     item.risk_level === 'medium' ? '中风险' : 
                     item.risk_level === 'high' ? '高风险' : '严重',
      violation_type: item.violation_type,
      create_time: item.create_time,
      update_time: item.update_time
    }));
    
    return {
      success: true,
      data: {
        list,
        pagination: {
          page: parseInt(page),
          pageSize: parseInt(pageSize),
          total,
          totalPages: Math.ceil(total / pageSize)
        },
        stats: {
          pendingCount // 待审核数量
        }
      }
    };
    
  } catch (error) {
    console.error('获取审核列表失败:', error);
    
    return {
      success: false,
      errorCode: 'SYSTEM_ERROR',
      message: '系统繁忙，请稍后重试',
      error: error.message
    };
  }
};
