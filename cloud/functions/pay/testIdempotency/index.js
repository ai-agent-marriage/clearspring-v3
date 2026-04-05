/**
 * 支付系统幂等性测试脚本
 * 用途：验证支付幂等性、重复支付防护、状态同步
 */

const cloud = require('wx-server-sdk');

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
});

const db = cloud.database();

/**
 * 测试用例 1：重复调用 createPay（幂等性测试）
 */
async function testCreatePayIdempotency() {
  console.log('=== 测试用例 1：重复调用 createPay ===');
  
  const testOrderNo = `TEST_${Date.now()}`;
  const testAmount = 0.01;
  
  try {
    // 第一次调用
    console.log('第一次调用 createPay...');
    const result1 = await cloud.callFunction({
      name: 'pay/createPay',
      data: {
        orderNo: testOrderNo,
        amount: testAmount
      }
    });
    
    console.log('第一次调用结果:', JSON.stringify(result1.result, null, 2));
    
    // 第二次调用（相同订单号）
    console.log('\n第二次调用 createPay（相同订单号）...');
    const result2 = await cloud.callFunction({
      name: 'pay/createPay',
      data: {
        orderNo: testOrderNo,
        amount: testAmount
      }
    });
    
    console.log('第二次调用结果:', JSON.stringify(result2.result, null, 2));
    
    // 验证
    if (result2.result && result2.result.isExisting) {
      console.log('\n✅ 幂等性测试通过：重复调用返回已存在记录');
      return true;
    } else {
      console.log('\n❌ 幂等性测试失败：重复调用未返回已存在记录');
      return false;
    }
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

/**
 * 测试用例 2：重复回调 payCallback（幂等性核心测试）
 */
async function testPayCallbackIdempotency() {
  console.log('\n=== 测试用例 2：重复回调 payCallback ===');
  
  const testTransactionId = `TEST_TXN_${Date.now()}`;
  const testOrderNo = `TEST_ORDER_${Date.now()}`;
  
  try {
    // 第一次回调
    console.log('第一次回调 payCallback...');
    const callback1 = await cloud.callFunction({
      name: 'pay/payCallback',
      data: {
        transaction_id: testTransactionId,
        out_trade_no: testOrderNo,
        total_fee: 1,
        openid: 'test_openid',
        return_code: 'SUCCESS',
        result_code: 'SUCCESS'
      }
    });
    
    console.log('第一次回调结果:', callback1.result);
    
    // 查询 pay_log 记录数
    const logCount1 = await db.collection('pay_log')
      .where({ transaction_id: testTransactionId })
      .count();
    
    console.log('第一次回调后 pay_log 记录数:', logCount1.total);
    
    // 第二次回调（相同 transaction_id）
    console.log('\n第二次回调 payCallback（相同 transaction_id）...');
    const callback2 = await cloud.callFunction({
      name: 'pay/payCallback',
      data: {
        transaction_id: testTransactionId,
        out_trade_no: testOrderNo,
        total_fee: 1,
        openid: 'test_openid',
        return_code: 'SUCCESS',
        result_code: 'SUCCESS'
      }
    });
    
    console.log('第二次回调结果:', callback2.result);
    
    // 查询 pay_log 记录数
    const logCount2 = await db.collection('pay_log')
      .where({ transaction_id: testTransactionId })
      .count();
    
    console.log('第二次回调后 pay_log 记录数:', logCount2.total);
    
    // 验证
    if (logCount2.total === 1 && callback2.result && callback2.result.includes('已处理')) {
      console.log('\n✅ 回调幂等性测试通过：重复回调只处理一次');
      return true;
    } else {
      console.log('\n❌ 回调幂等性测试失败：重复回调产生多条记录');
      return false;
    }
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

/**
 * 测试用例 3：支付状态同步测试
 */
async function testSyncOrderStatus() {
  console.log('\n=== 测试用例 3：支付状态同步 ===');
  
  try {
    // 创建测试订单（待支付状态）
    const testOrderNo = `TEST_SYNC_${Date.now()}`;
    await db.collection('order_protect').add({
      data: {
        order_no: testOrderNo,
        user_id: 'test_openid',
        amount: 0.01,
        status: 1, // 待支付
        transaction_id: `TEST_TXN_SYNC_${Date.now()}`,
        expire_time: new Date(Date.now() + 15 * 60 * 1000),
        create_time: db.serverDate()
      }
    });
    
    console.log('创建测试订单:', testOrderNo);
    
    // 调用同步函数
    console.log('调用 syncOrderStatus...');
    const syncResult = await cloud.callFunction({
      name: 'pay/syncOrderStatus'
    });
    
    console.log('同步结果:', JSON.stringify(syncResult.result, null, 2));
    
    // 查询订单状态
    const orderQuery = await db.collection('order_protect')
      .where({ order_no: testOrderNo })
      .get();
    
    console.log('订单状态:', orderQuery.data[0]?.status);
    
    console.log('\n✅ 状态同步测试完成');
    return true;
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

/**
 * 测试用例 4：超时订单自动取消测试
 */
async function testTimeoutCancel() {
  console.log('\n=== 测试用例 4：超时订单自动取消 ===');
  
  try {
    // 创建测试订单（已过期）
    const testOrderNo = `TEST_TIMEOUT_${Date.now()}`;
    await db.collection('order_protect').add({
      data: {
        order_no: testOrderNo,
        user_id: 'test_openid',
        amount: 0.01,
        status: 1, // 待支付
        transaction_id: `TEST_TXN_TIMEOUT_${Date.now()}`,
        expire_time: new Date(Date.now() - 60 * 1000), // 1 分钟前过期
        create_time: db.serverDate()
      }
    });
    
    console.log('创建过期测试订单:', testOrderNo);
    
    // 调用同步函数（会取消超时订单）
    console.log('调用 syncOrderStatus...');
    const syncResult = await cloud.callFunction({
      name: 'pay/syncOrderStatus'
    });
    
    // 查询订单状态
    const orderQuery = await db.collection('order_protect')
      .where({ order_no: testOrderNo })
      .get();
    
    console.log('订单状态:', orderQuery.data[0]?.status, '(3=已取消)');
    
    if (orderQuery.data[0]?.status === 3) {
      console.log('\n✅ 超时取消测试通过：超时订单已自动取消');
      return true;
    } else {
      console.log('\n❌ 超时取消测试失败：超时订单未取消');
      return false;
    }
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

/**
 * 测试用例 5：退款幂等性测试
 */
async function testRefundIdempotency() {
  console.log('\n=== 测试用例 5：退款幂等性 ===');
  
  const testOrderNo = `TEST_REFUND_${Date.now()}`;
  
  try {
    // 创建已支付订单
    await db.collection('order_protect').add({
      data: {
        order_no: testOrderNo,
        user_id: 'test_openid',
        amount: 0.01,
        status: 2, // 已支付
        transaction_id: `TEST_TXN_REFUND_${Date.now()}`,
        pay_time: db.serverDate(),
        create_time: db.serverDate()
      }
    });
    
    console.log('创建已支付测试订单:', testOrderNo);
    
    // 第一次退款
    console.log('第一次调用 refund...');
    const refund1 = await cloud.callFunction({
      name: 'pay/refund',
      data: {
        orderNo: testOrderNo,
        reason: '测试退款'
      }
    });
    
    console.log('第一次退款结果:', JSON.stringify(refund1.result, null, 2));
    
    // 第二次退款（相同订单）
    console.log('\n第二次调用 refund（相同订单）...');
    const refund2 = await cloud.callFunction({
      name: 'pay/refund',
      data: {
        orderNo: testOrderNo,
        reason: '测试退款'
      }
    });
    
    console.log('第二次退款结果:', JSON.stringify(refund2.result, null, 2));
    
    // 验证
    if (refund2.result && refund2.result.isExisting) {
      console.log('\n✅ 退款幂等性测试通过：重复退款返回已处理');
      return true;
    } else {
      console.log('\n❌ 退款幂等性测试失败');
      return false;
    }
    
  } catch (error) {
    console.error('测试失败:', error);
    return false;
  }
}

/**
 * 主测试函数
 */
exports.main = async (event, context) => {
  console.log('========================================');
  console.log('支付系统幂等性测试开始');
  console.log('========================================\n');
  
  const results = {
    createPayIdempotency: false,
    payCallbackIdempotency: false,
    syncOrderStatus: false,
    timeoutCancel: false,
    refundIdempotency: false
  };
  
  // 执行测试
  results.createPayIdempotency = await testCreatePayIdempotency();
  results.payCallbackIdempotency = await testPayCallbackIdempotency();
  results.syncOrderStatus = await testSyncOrderStatus();
  results.timeoutCancel = await testTimeoutCancel();
  results.refundIdempotency = await testRefundIdempotency();
  
  // 汇总结果
  console.log('\n========================================');
  console.log('测试结果汇总');
  console.log('========================================');
  console.log('1. createPay 幂等性:', results.createPayIdempotency ? '✅ 通过' : '❌ 失败');
  console.log('2. payCallback 幂等性:', results.payCallbackIdempotency ? '✅ 通过' : '❌ 失败');
  console.log('3. 状态同步:', results.syncOrderStatus ? '✅ 通过' : '❌ 失败');
  console.log('4. 超时取消:', results.timeoutCancel ? '✅ 通过' : '❌ 失败');
  console.log('5. 退款幂等性:', results.refundIdempotency ? '✅ 通过' : '❌ 失败');
  
  const allPassed = Object.values(results).every(r => r === true);
  
  console.log('\n总体结果:', allPassed ? '✅ 全部通过' : '❌ 部分失败');
  console.log('========================================\n');
  
  return {
    success: allPassed,
    results
  };
};
