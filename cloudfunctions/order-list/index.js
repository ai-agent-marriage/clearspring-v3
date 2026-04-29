// 云函数：订单列表获取
// 功能：获取机构订单列表，支持状态筛选
// 【安全修复】添加用户身份验证和权限校验

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// 订单状态映射
const STATUS_MAP = {
  0: '全部',
  1: '待承接',
  2: '待执行',
  3: '执行中',
  4: '待确认',
  5: '已完成',
  6: '已取消'
};

/**
 * 验证用户身份和权限
 * @param {string} openid - 用户 OpenID
 * @param {string} orgId - 机构 ID
 * @returns {object} - 验证结果
 */
async function verifyPermission(openid, orgId) {
  // 1. 检查用户是否登录
  if (!openid) {
    return {
      success: false,
      code: 'NOT_LOGGED_IN',
      msg: '请先登录'
    };
  }
  
  // 2. 检查机构 ID
  if (!orgId) {
    return {
      success: false,
      code: 'INVALID_PARAMS',
      msg: '缺少机构 ID 参数'
    };
  }
  
  // 3. 查询用户信息，验证是否属于该机构
  const userQuery = await db.collection('users')
    .where({
      _openid: openid,
      orgId: orgId
    })
    .limit(1)
    .get();
  
  if (userQuery.data.length === 0) {
    // 检查是否为管理员
    const adminQuery = await db.collection('admins')
      .where({
        _openid: openid,
        status: 'active'
      })
      .limit(1)
      .get();
    
    if (adminQuery.data.length === 0) {
      return {
        success: false,
        code: 'PERMISSION_DENIED',
        msg: '无权访问该机构数据'
      };
    }
  }
  
  return {
    success: true,
    code: 'OK'
  };
}

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const { orgId, status, timestamp, page = 1, pageSize = 20 } = event;
  
  try {
    // 【安全修复】验证用户身份和权限
    const permissionCheck = await verifyPermission(openid, orgId);
    if (!permissionCheck.success) {
      return {
        code: permissionCheck.code === 'NOT_LOGGED_IN' ? 401 : 403,
        msg: permissionCheck.msg
      };
    }
    
    // 【安全增强】参数验证 - 防止 NoSQL 注入
    // orgId 必须是字符串，且长度合理
    if (typeof orgId !== 'string' || orgId.length > 100) {
      return {
        code: 400,
        msg: '机构 ID 格式错误'
      };
    }
    
    // pageSize 必须在合理范围内（1-100）
    const safePageSize = Math.min(Math.max(parseInt(pageSize) || 20, 1), 100);
    const safePage = Math.max(parseInt(page) || 1, 1);
    
    // 构建查询条件（使用参数化查询）
    const query = { orgId: orgId };
    
    // 状态筛选（0 表示全部）
    if (status !== undefined && status !== null && status !== 0) {
      // 【安全增强】状态值必须是有效数字
      const statusNum = parseInt(status);
      if (isNaN(statusNum) || statusNum < 0 || statusNum > 6) {
        return {
          code: 400,
          msg: '订单状态参数错误'
        };
      }
      query.status = statusNum;
    }
    
    // 分页计算（使用验证后的值）
    const skip = (safePage - 1) * safePageSize;
    
    // 获取订单列表（使用验证后的 pageSize）
    const ordersRes = await db.collection('orders')
      .where(query)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(safePageSize)
      .get();
    
    // 获取总数
    const totalRes = await db.collection('orders').where(query).count();
    
    // 格式化订单数据
    const orders = ordersRes.data.map(order => ({
      orderNo: order.orderNo,
      status: order.status,
      statusName: STATUS_MAP[order.status] || '未知',
      executeDate: order.executeDate ? formatDate(order.executeDate) : '',
      speciesName: order.speciesName,
      waterArea: order.waterArea,
      volunteerName: order.volunteerName || '',
      amount: order.amount,
      createTime: order.createTime ? formatDate(order.createTime) : ''
    }));
    
    return {
      code: 0,
      msg: 'success',
      data: {
        orders,
        total: totalRes.total,
        page: safePage,
        pageSize: safePageSize,
        hasMore: skip + orders.length < totalRes.total
      }
    };
    
  } catch (error) {
    console.error('获取订单列表失败:', error);
    return {
      code: 500,
      msg: error.message || '服务器错误',
      error: error.stack
    };
  }
};

// 日期格式化
function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
