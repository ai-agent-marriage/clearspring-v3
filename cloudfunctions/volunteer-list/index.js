// 云函数：志愿者列表获取
// 功能：获取机构志愿者列表，支持筛选

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event, context) => {
  const { orgId, filterRegion, filterCompliance, timestamp, page = 1, pageSize = 20 } = event;
  
  try {
    // 验证参数
    if (!orgId) {
      return {
        code: 400,
        msg: '缺少机构 ID 参数'
      };
    }
    
    // 构建查询条件
    const query = { orgId: orgId, status: 'active' };
    
    // 地区筛选
    if (filterRegion) {
      query.region = filterRegion;
    }
    
    // 合规率筛选
    if (filterCompliance) {
      const complianceThreshold = parseInt(filterCompliance);
      if (!isNaN(complianceThreshold)) {
        query.complianceRate = db.command.gte(complianceThreshold);
      }
    }
    
    // 分页计算
    const skip = (page - 1) * pageSize;
    
    // 获取志愿者列表
    const volunteersRes = await db.collection('volunteers')
      .where(query)
      .orderBy('createTime', 'desc')
      .skip(skip)
      .limit(pageSize)
      .get();
    
    // 获取总数
    const totalRes = await db.collection('volunteers').where(query).count();
    
    // 获取活跃志愿者数（最近 30 天有任务）
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeCount = await db.collection('volunteers')
      .where({
        orgId: orgId,
        status: 'active',
        lastTaskTime: db.command.gte(thirtyDaysAgo)
      })
      .count();
    
    // 获取总任务数
    const totalTasksRes = await db.collection('tasks')
      .where({ orgId: orgId })
      .count();
    
    // 格式化志愿者数据
    const volunteers = volunteersRes.data.map(vol => ({
      id: vol.volunteerId || vol._id,
      name: vol.nickname || vol.name,
      certified: vol.certified || false,
      region: vol.region || '',
      totalTasks: vol.totalTasks || 0,
      complianceRate: vol.complianceRate || 100,
      actions: vol.certified ? ['详情', '分配', '解绑'] : ['详情', '分配']
    }));
    
    return {
      code: 0,
      msg: 'success',
      data: {
        volunteers,
        stats: {
          total: totalRes.total,
          active: activeCount,
          totalTasks: totalTasksRes.total
        },
        total: totalRes.total,
        page,
        pageSize,
        hasMore: skip + volunteers.length < totalRes.total
      }
    };
    
  } catch (error) {
    console.error('获取志愿者列表失败:', error);
    return {
      code: 500,
      msg: error.message || '服务器错误',
      error: error.stack
    };
  }
};
