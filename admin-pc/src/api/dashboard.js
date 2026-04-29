import request from './request'

/**
 * 数据统计 API
 */

/**
 * 获取控制台统计数据
 * @param {Object} params - 查询参数
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getDashboardStats(params) {
  return request({
    url: '/dashboard/stats',
    method: 'get',
    params
  })
}

/**
 * 获取订单趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.type - 类型（day/week/month）
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getOrderTrend(params) {
  return request({
    url: '/dashboard/order-trend',
    method: 'get',
    params
  })
}

/**
 * 获取执行者排行数据
 * @param {Object} params - 查询参数
 * @param {number} params.limit - 返回数量
 * @param {string} params.type - 排行类型（orderCount/completionRate）
 * @returns {Promise}
 */
export function getExecutorRanking(params) {
  return request({
    url: '/dashboard/executor-ranking',
    method: 'get',
    params
  })
}

/**
 * 获取订单状态分布
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getOrderStatusDistribution(params) {
  return request({
    url: '/dashboard/order-status',
    method: 'get',
    params
  })
}

/**
 * 获取收入趋势数据
 * @param {Object} params - 查询参数
 * @param {string} params.type - 类型（day/week/month）
 * @returns {Promise}
 */
export function getRevenueTrend(params) {
  return request({
    url: '/dashboard/revenue-trend',
    method: 'get',
    params
  })
}

/**
 * 获取区域分布数据
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getRegionDistribution(params) {
  return request({
    url: '/dashboard/region-distribution',
    method: 'get',
    params
  })
}
