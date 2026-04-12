// 云函数：结算数据获取
// 功能：获取机构结算管理数据

const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();
const _ = db.command;

// Tab 类型映射
const TAB_MAP = {
  0: 'pendingSettlements',
  1: 'settlementRecords',
  2: 'invoiceHistory'
};

exports.main = async (event, context) => {
  const { orgId, tabType = 0, timestamp } = event;
  
  try {
    // 验证参数
    if (!orgId) {
      return {
        code: 400,
        msg: '缺少机构 ID 参数'
      };
    }
    
    // 获取待结算订单（状态为已完成但未结算）
    const pendingSettlementsRes = await db.collection('orders')
      .where({
        orgId: orgId,
        status: 5, // 已完成
        settlementStatus: 0 // 未结算
      })
      .orderBy('completeTime', 'desc')
      .limit(50)
      .get();
    
    const pendingSettlements = pendingSettlementsRes.data.map(order => ({
      orderNo: order.orderNo,
      completeTime: order.completeTime ? formatDateTime(order.completeTime) : '',
      amount: order.amount,
      settleDeadline: calculateSettleDeadline(order.completeTime)
    }));
    
    // 获取结算记录
    const settlementRecordsRes = await db.collection('settlements')
      .where({ orgId: orgId })
      .orderBy('settleTime', 'desc')
      .limit(50)
      .get();
    
    const settlementRecords = settlementRecordsRes.data.map(record => ({
      settleNo: record.settleNo,
      settleTime: record.settleTime ? formatDate(record.settleTime) : '',
      amount: record.amount,
      invoiceStatus: record.invoiceStatus || '未开票',
      transferStatus: record.transferStatus || '未转账'
    }));
    
    // 获取发票信息
    const invoiceRes = await db.collection('invoices')
      .where({ orgId: orgId })
      .orderBy('createTime', 'desc')
      .limit(1)
      .get();
    
    const invoiceInfo = invoiceRes.data.length > 0 ? {
      company: invoiceRes.data[0].company || '',
      taxNo: invoiceRes.data[0].taxNo || '',
      address: invoiceRes.data[0].address || '',
      phone: invoiceRes.data[0].phone || '',
      bank: invoiceRes.data[0].bank || '',
      bankAccount: invoiceRes.data[0].bankAccount || '',
      status: invoiceRes.data[0].status || '未提交'
    } : {
      company: '',
      taxNo: '',
      address: '',
      phone: '',
      bank: '',
      bankAccount: '',
      status: '未提交'
    };
    
    // 获取历史发票记录
    const invoiceHistoryRes = await db.collection('invoices')
      .where({ orgId: orgId })
      .orderBy('createTime', 'desc')
      .limit(50)
      .get();
    
    const invoiceHistory = invoiceHistoryRes.data.map(inv => ({
      invoiceNo: inv.invoiceNo,
      invoiceTime: inv.createTime ? formatDate(inv.createTime) : '',
      amount: inv.amount,
      status: inv.status || '审核中'
    }));
    
    // 计算统计数据
    const totalSettled = settlementRecords.reduce((sum, r) => sum + r.amount, 0);
    const pendingSettle = pendingSettlements.reduce((sum, o) => sum + o.amount, 0);
    
    return {
      code: 0,
      msg: 'success',
      data: {
        stats: {
          totalSettled,
          pendingSettle,
          settledOrders: settlementRecords.length
        },
        pendingSettlements,
        settlementRecords,
        invoiceInfo,
        invoiceHistory
      }
    };
    
  } catch (error) {
    console.error('获取结算数据失败:', error);
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

// 日期时间格式化
function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hour = String(d.getHours()).padStart(2, '0');
  const minute = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
}

// 计算结算截止日期（完成后 7 天）
function calculateSettleDeadline(completeTime) {
  if (!completeTime) return '';
  const d = new Date(completeTime);
  d.setDate(d.getDate() + 7);
  return formatDate(d);
}
