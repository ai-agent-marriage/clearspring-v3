#!/usr/bin/env node
/**
 * 数据统计分析脚本
 * 生成详细的数据统计报告
 */

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data', 'mock');

function loadData(file) {
  const filePath = path.join(DATA_DIR, file);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function analyzeData() {
  // [CLEANED] console.log('📊 开始数据分析...\n');
  
  // 加载数据
  const users = loadData('users.json');
  const executors = loadData('executors.json');
  const organizations = loadData('organizations.json');
  const volunteers = loadData('volunteers.json');
  const orders = loadData('orders.json');
  const reviews = loadData('reviews.json');
  
  // 用户分析
  // [CLEANED] console.log('👤 用户数据分析:');
  const userLevels = {};
  users.forEach(u => {
    userLevels[u.level] = (userLevels[u.level] || 0) + 1;
  });
  // [CLEANED] console.log('  用户等级分布:');
  Object.entries(userLevels).forEach(([level, count]) => {
    // [CLEANED] console.log(`    ${level}: ${count}人 (${(count/users.length*100).toFixed(1)}%)`);
  });
  
  const totalOrders = users.reduce((sum, u) => sum + u.totalOrders, 0);
  const totalMerit = users.reduce((sum, u) => sum + u.totalMerit, 0);
  // [CLEANED] console.log(`  总订单数：${totalOrders}`);
  // [CLEANED] console.log(`  总功德值：${totalMerit}`);
  // [CLEANED] console.log(`  人均订单：${(totalOrders/users.length).toFixed(1)}`);
  // [CLEANED] console.log(`  人均功德：${(totalMerit/users.length).toFixed(1)}\n`);
  
  // 执行者分析
  // [CLEANED] console.log('🎯 执行者数据分析:');
  const certifiedExecutors = executors.filter(e => e.qualificationStatus === '已认证').length;
  // [CLEANED] console.log(`  已认证：${certifiedExecutors}人 (${(certifiedExecutors/executors.length*100).toFixed(1)}%)`);
  // [CLEANED] console.log(`  审核中：${executors.length - certifiedExecutors}人`);
  
  const avgRating = executors.reduce((sum, e) => sum + e.rating, 0) / executors.length;
  const avgCompleted = executors.reduce((sum, e) => sum + e.totalCompleted, 0) / executors.length;
  // [CLEANED] console.log(`  平均评分：${avgRating.toFixed(2)}`);
  // [CLEANED] console.log(`  平均完成订单：${avgCompleted.toFixed(1)}\n`);
  
  // 机构分析
  // [CLEANED] console.log('🏢 机构数据分析:');
  const orgTypes = {};
  organizations.forEach(o => {
    orgTypes[o.orgType] = (orgTypes[o.orgType] || 0) + 1;
  });
  // [CLEANED] console.log('  机构类型分布:');
  Object.entries(orgTypes).forEach(([type, count]) => {
    // [CLEANED] console.log(`    ${type}: ${count}个`);
  });
  
  const totalVolunteers = organizations.reduce((sum, o) => sum + o.volunteerCount, 0);
  const avgOrgRating = organizations.reduce((sum, o) => sum + o.rating, 0) / organizations.length;
  // [CLEANED] console.log(`  总志愿者数：${totalVolunteers}`);
  // [CLEANED] console.log(`  平均评分：${avgOrgRating.toFixed(2)}\n`);
  
  // 志愿者分析
  // [CLEANED] console.log('🙋 志愿者数据分析:');
  const totalServiceHours = volunteers.reduce((sum, v) => sum + v.serviceHours, 0);
  const totalTasks = volunteers.reduce((sum, v) => sum + v.totalTasks, 0);
  const avgVolRating = volunteers.reduce((sum, v) => sum + v.rating, 0) / volunteers.length;
  // [CLEANED] console.log(`  总服务时长：${totalServiceHours}小时`);
  // [CLEANED] console.log(`  总任务数：${totalTasks}`);
  // [CLEANED] console.log(`  平均评分：${avgVolRating.toFixed(2)}`);
  // [CLEANED] console.log(`  人均服务时长：${(totalServiceHours/volunteers.length).toFixed(1)}小时\n`);
  
  // 订单分析
  // [CLEANED] console.log('📦 订单数据分析:');
  const orderStatuses = {};
  orders.forEach(o => {
    orderStatuses[o.status] = (orderStatuses[o.status] || 0) + 1;
  });
  // [CLEANED] console.log('  订单状态分布:');
  Object.entries(orderStatuses).forEach(([status, count]) => {
    // [CLEANED] console.log(`    ${status}: ${count}单 (${(count/orders.length*100).toFixed(1)}%)`);
  });
  
  const serviceTypes = {};
  orders.forEach(o => {
    serviceTypes[o.serviceType] = (serviceTypes[o.serviceType] || 0) + 1;
  });
  // [CLEANED] console.log('  服务类型分布:');
  Object.entries(serviceTypes).forEach(([type, count]) => {
    // [CLEANED] console.log(`    ${type}: ${count}单 (${(count/orders.length*100).toFixed(1)}%)`);
  });
  
  const speciesCount = {};
  orders.forEach(o => {
    speciesCount[o.species] = (speciesCount[o.species] || 0) + 1;
  });
  // [CLEANED] console.log('  物种分布 (前 10):');
  Object.entries(speciesCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .forEach(([species, count]) => {
      // [CLEANED] console.log(`    ${species}: ${count}单`);
    });
  
  const totalAmount = orders.reduce((sum, o) => sum + o.amount, 0);
  const avgAmount = totalAmount / orders.length;
  const minAmount = Math.min(...orders.map(o => o.amount));
  const maxAmount = Math.max(...orders.map(o => o.amount));
  // [CLEANED] console.log(`  总金额：${totalAmount}元`);
  // [CLEANED] console.log(`  平均金额：${avgAmount.toFixed(2)}元`);
  // [CLEANED] console.log(`  金额范围：${minAmount}-${maxAmount}元\n`);
  
  // 评价分析
  // [CLEANED] console.log('⭐ 评价数据分析:');
  const ratings = {};
  reviews.forEach(r => {
    ratings[r.rating] = (ratings[r.rating] || 0) + 1;
  });
  // [CLEANED] console.log('  评分分布:');
  Object.entries(ratings).sort((a, b) => a[0] - b[0]).forEach(([rating, count]) => {
    const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
    // [CLEANED] console.log(`    ${stars} (${rating}星): ${count}条 (${(count/reviews.length*100).toFixed(1)}%)`);
  });
  
  const avgRating_review = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const withReply = reviews.filter(r => r.reply).length;
  // [CLEANED] console.log(`  平均评分：${avgRating_review.toFixed(2)}`);
  // [CLEANED] console.log(`  有回复的评价：${withReply}条 (${(withReply/reviews.length*100).toFixed(1)}%)\n`);
  
  // 数据一致性检查
  // [CLEANED] console.log('🔍 数据一致性检查:');
  const userIds = new Set(users.map(u => u.userId));
  const executorIds = new Set(executors.map(e => e.executorId));
  const orgIds = new Set(organizations.map(o => o.orgId));
  const orderIds = new Set(orders.map(o => o.orderId));
  
  let consistencyErrors = 0;
  
  // 检查订单关联
  orders.forEach(o => {
    if (!userIds.has(o.userId)) consistencyErrors++;
    if (!executorIds.has(o.executorId)) consistencyErrors++;
    if (!orgIds.has(o.orgId)) consistencyErrors++;
  });
  
  // 检查评价关联
  reviews.forEach(r => {
    if (!orderIds.has(r.orderId)) consistencyErrors++;
    if (!userIds.has(r.userId)) consistencyErrors++;
  });
  
  // 检查志愿者关联
  volunteers.forEach(v => {
    if (!orgIds.has(v.orgId)) consistencyErrors++;
  });
  
  if (consistencyErrors === 0) {
    // [CLEANED] console.log('  ✅ 所有数据关联正确');
  } else {
    // [CLEANED] console.log(`  ❌ 发现 ${consistencyErrors} 个关联错误`);
  }
  
  // 时间逻辑检查
  let timeErrors = 0;
  orders.forEach(o => {
    if (o.createDate && o.acceptDate) {
      if (new Date(o.createDate) > new Date(o.acceptDate)) timeErrors++;
    }
    if (o.acceptDate && o.completeDate) {
      if (new Date(o.acceptDate) > new Date(o.completeDate)) timeErrors++;
    }
  });
  
  reviews.forEach(r => {
    const order = orders.find(o => o.orderId === r.orderId);
    if (order && order.completeDate) {
      if (new Date(r.createDate) < new Date(order.completeDate)) timeErrors++;
    }
  });
  
  if (timeErrors === 0) {
    // [CLEANED] console.log('  ✅ 时间逻辑正确');
  } else {
    // [CLEANED] console.log(`  ❌ 发现 ${timeErrors} 个时间逻辑错误`);
  }
  
  // [CLEANED] console.log('\n✅ 数据分析完成!\n');
  
  return {
    users: users.length,
    executors: executors.length,
    organizations: organizations.length,
    volunteers: volunteers.length,
    orders: orders.length,
    reviews: reviews.length,
    totalAmount,
    avgRating: avgRating_review
  };
}

// 运行
if (require.main === module) {
  analyzeData();
}

module.exports = { analyzeData };
