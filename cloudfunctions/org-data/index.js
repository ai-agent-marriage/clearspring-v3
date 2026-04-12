// 云函数：机构数据获取
// 功能：获取机构工作台的核心数据

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  const { orgId, timestamp } = event;
  
  try {
    // 验证参数
    if (!orgId) {
      return {
        code: 400,
        msg: '缺少机构 ID 参数'
      };
    }
    
    // 获取机构基本信息
    const orgRes = await db.collection('organizations').where({
      orgId: orgId
    }).get();
    
    if (orgRes.data.length === 0) {
      return {
        code: 404,
        msg: '机构不存在'
      };
    }
    
    const org = orgRes.data[0];
    
    // 获取订单统计数据
    const orderStats = await db.collection('orders').where({
      orgId: orgId
    }).field({
      status: true
    }).get();
    
    const pendingOrders = orderStats.data.filter(o => o.status === 1).length;
    const completedOrders = orderStats.data.filter(o => o.status === 5).length;
    
    // 获取待办事项
    const todos = [
      {
        type: 'audit',
        title: '待审核执行材料',
        count: await db.collection('materials').where({ orgId, status: 'pending' }).count(),
        action: '去审核'
      },
      {
        type: 'settle',
        title: '待结算订单',
        count: await db.collection('orders').where({ orgId, status: 4 }).count(),
        action: '去结算'
      },
      {
        type: 'dispute',
        title: '待处理用户异议',
        count: await db.collection('disputes').where({ orgId, status: 'pending' }).count(),
        action: '去处理'
      }
    ];
    
    // 获取今日任务数
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTasks = await db.collection('tasks').where({
      orgId: orgId,
      executeDate: _.gte(today)
    }).count();
    
    // 获取待确认订单数
    const pendingConfirm = await db.collection('orders').where({
      orgId: orgId,
      status: 4
    }).count();
    
    return {
      code: 0,
      msg: 'success',
      data: {
        orgId: org.orgId,
        orgName: org.name,
        identity: org.identity || '合规执行机构',
        status: org.status || '已认证',
        orderCount: orderStats.data.length,
        pendingOrders,
        completedOrders,
        todayTasks,
        pendingConfirm,
        todos: todos.filter(t => t.count > 0)
      }
    };
    
  } catch (error) {
    console.error('获取机构数据失败:', error);
    return {
      code: 500,
      msg: error.message || '服务器错误',
      error: error.stack
    };
  }
};
