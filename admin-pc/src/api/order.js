import request from './request'

/**
 * 订单管理 API
 */

/**
 * 获取订单列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.orderNo - 订单号
 * @param {string} params.status - 订单状态
 * @param {string} params.executorId - 执行者 ID
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getOrderList(params) {
  return request({
    url: '/orders',
    method: 'get',
    params
  })
}

/**
 * 获取订单详情
 * @param {string} id - 订单 ID
 * @returns {Promise}
 */
export function getOrderDetail(id) {
  return request({
    url: `/orders/${id}`,
    method: 'get'
  })
}

/**
 * 更新订单状态
 * @param {string} id - 订单 ID
 * @param {Object} data - 更新数据
 * @param {string} data.status - 新状态
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function updateOrderStatus(id, data) {
  return request({
    url: `/orders/${id}/status`,
    method: 'put',
    data
  })
}

/**
 * 分配订单给执行者
 * @param {string} id - 订单 ID
 * @param {Object} data - 分配数据
 * @param {string} data.executorId - 执行者 ID
 * @returns {Promise}
 */
export function assignOrder(id, data) {
  return request({
    url: `/orders/${id}/assign`,
    method: 'post',
    data
  })
}

/**
 * 导出订单数据
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportOrders(params) {
  return request({
    url: '/orders/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 获取订单统计信息
 * @param {Object} params - 统计参数
 * @returns {Promise}
 */
export function getOrderStats(params) {
  return request({
    url: '/orders/stats',
    method: 'get',
    params
  })
}
