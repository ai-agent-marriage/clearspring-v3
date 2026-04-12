import request from './request'

/**
 * 获取操作日志列表
 */
export function getOperationLogs(params) {
  return request({
    url: '/api/logs',
    method: 'get',
    params
  })
}

/**
 * 获取日志详情
 */
export function getLogDetail(id) {
  return request({
    url: `/api/logs/${id}`,
    method: 'get'
  })
}

/**
 * 清空日志
 */
export function clearLogs() {
  return request({
    url: '/api/logs/clear',
    method: 'delete'
  })
}

/**
 * 导出日志
 */
export function exportLogs(params) {
  return request({
    url: '/api/logs/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
