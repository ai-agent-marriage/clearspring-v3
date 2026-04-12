// 云函数：订单列表获取
// 功能：获取机构订单列表，支持状态筛选

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

exports.main = async (event, context) => {
  const { orgId, status, timestamp, page = 1, pageSize = 20 } = event;
  
  try {
    // 验证参数
    if (!orgId) {
      return {
        code: 400,
        msg: '缺少机构 ID 参数'
      };
    }
    
    // 构建查询条件
    const query = { orgId: orgId };
    
    // 状态筛选（0 表示全部）
    if (status !== undefined && status !== null && status !== 0) {
      query.status = parseInt(status);
    }
    
    // 分页计算
    const skip = (page - 1) * pageSize;
    
    // 获取订单列表
    const ordersRes = await db.collection('orders')
      .where(query)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
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
        page,
        pageSize,
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
