import request from './request'

/**
 * 分账配置 API
 */

/**
 * 获取分账配置列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.type - 配置类型
 * @returns {Promise}
 */
export function getProfitSharingList(params) {
  return request({
    url: '/profit-sharing',
    method: 'get',
    params
  })
}

/**
 * 获取分账配置详情
 * @param {string} id - 配置 ID
 * @returns {Promise}
 */
export function getProfitSharingDetail(id) {
  return request({
    url: `/profit-sharing/${id}`,
    method: 'get'
  })
}

/**
 * 创建分账配置
 * @param {Object} data - 配置数据
 * @returns {Promise}
 */
export function createProfitSharing(data) {
  return request({
    url: '/profit-sharing',
    method: 'post',
    data
  })
}

/**
 * 更新分账配置
 * @param {string} id - 配置 ID
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export function updateProfitSharing(id, data) {
  return request({
    url: `/profit-sharing/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除分账配置
 * @param {string} id - 配置 ID
 * @returns {Promise}
 */
export function deleteProfitSharing(id) {
  return request({
    url: `/profit-sharing/${id}`,
    method: 'delete'
  })
}

/**
 * 启用/禁用分账配置
 * @param {string} id - 配置 ID
 * @param {Object} data - 状态数据
 * @param {boolean} data.enabled - 是否启用
 * @returns {Promise}
 */
export function toggleProfitSharing(id, data) {
  return request({
    url: `/profit-sharing/${id}/toggle`,
    method: 'post',
    data
  })
}

/**
 * 获取分账统计
 * @param {Object} params - 统计参数
 * @returns {Promise}
 */
export function getProfitSharingStats(params) {
  return request({
    url: '/profit-sharing/stats',
    method: 'get',
    params
  })
}
