import request from './request'

/**
 * 数据导出 API
 */

/**
 * 获取导出任务列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.type - 导出类型
 * @param {string} params.status - 任务状态
 * @returns {Promise}
 */
export function getExportTasks(params) {
  return request({
    url: '/export/tasks',
    method: 'get',
    params
  })
}

/**
 * 创建导出任务
 * @param {Object} data - 导出参数
 * @param {string} data.type - 导出类型（orders/executors/qualifications）
 * @param {string} data.startDate - 开始日期
 * @param {string} data.endDate - 结束日期
 * @param {string} data.format - 导出格式（xlsx/csv）
 * @returns {Promise}
 */
export function createExportTask(data) {
  return request({
    url: '/export/tasks',
    method: 'post',
    data
  })
}

/**
 * 获取导出任务详情
 * @param {string} id - 任务 ID
 * @returns {Promise}
 */
export function getExportTaskDetail(id) {
  return request({
    url: `/export/tasks/${id}`,
    method: 'get'
  })
}

/**
 * 下载导出文件
 * @param {string} id - 任务 ID
 * @returns {Promise}
 */
export function downloadExportFile(id) {
  return request({
    url: `/export/tasks/${id}/download`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 取消导出任务
 * @param {string} id - 任务 ID
 * @returns {Promise}
 */
export function cancelExportTask(id) {
  return request({
    url: `/export/tasks/${id}/cancel`,
    method: 'post'
  })
}

/**
 * 删除导出任务
 * @param {string} id - 任务 ID
 * @returns {Promise}
 */
export function deleteExportTask(id) {
  return request({
    url: `/export/tasks/${id}`,
    method: 'delete'
  })
}

/**
 * 获取导出模板
 * @param {string} type - 导出类型
 * @returns {Promise}
 */
export function getExportTemplate(type) {
  return request({
    url: `/export/template/${type}`,
    method: 'get',
    responseType: 'blob'
  })
}
