import request from './request'

/**
 * 系统日志 API
 */

/**
 * 获取操作日志列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.module - 模块
 * @param {string} params.action - 操作类型
 * @param {string} params.adminId - 管理员 ID
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getOperationLogs(params) {
  return request({
    url: '/logs/operations',
    method: 'get',
    params
  })
}

/**
 * 获取登录日志列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.adminId - 管理员 ID
 * @param {string} params.status - 登录状态
 * @returns {Promise}
 */
export function getLoginLogs(params) {
  return request({
    url: '/logs/logins',
    method: 'get',
    params
  })
}

/**
 * 获取系统日志列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.level - 日志级别
 * @param {string} params.startDate - 开始日期
 * @param {string} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getSystemLogs(params) {
  return request({
    url: '/logs/system',
    method: 'get',
    params
  })
}

/**
 * 导出日志
 * @param {Object} params - 导出参数
 * @returns {Promise}
 */
export function exportLogs(params) {
  return request({
    url: '/logs/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}

/**
 * 获取日志统计信息
 * @param {Object} params - 统计参数
 * @returns {Promise}
 */
export function getLogStats(params) {
  return request({
    url: '/logs/stats',
    method: 'get',
    params
  })
}

/**
 * 清理日志
 * @param {Object} data - 清理参数
 * @param {string} data.type - 日志类型
 * @param {string} data.beforeDate - 清理该日期之前的日志
 * @returns {Promise}
 */
export function clearLogs(data) {
  return request({
    url: '/logs/clear',
    method: 'post',
    data
  })
}
