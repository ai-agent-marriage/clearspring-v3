import request from './request'

/**
 * 执行者管理 API
 */

/**
 * 获取执行者列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.name - 姓名
 * @param {string} params.phone - 手机号
 * @param {string} params.status - 状态
 * @param {string} params.level - 等级
 * @returns {Promise}
 */
export function getExecutorList(params) {
  return request({
    url: '/executors',
    method: 'get',
    params
  })
}

/**
 * 获取执行者详情
 * @param {string} id - 执行者 ID
 * @returns {Promise}
 */
export function getExecutorDetail(id) {
  return request({
    url: `/executors/${id}`,
    method: 'get'
  })
}

/**
 * 创建执行者
 * @param {Object} data - 执行者信息
 * @returns {Promise}
 */
export function createExecutor(data) {
  return request({
    url: '/executors',
    method: 'post',
    data
  })
}

/**
 * 更新执行者信息
 * @param {string} id - 执行者 ID
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export function updateExecutor(id, data) {
  return request({
    url: `/executors/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新执行者状态
 * @param {string} id - 执行者 ID
 * @param {Object} data - 状态数据
 * @param {string} data.status - 新状态
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function updateExecutorStatus(id, data) {
  return request({
    url: `/executors/${id}/status`,
    method: 'put',
    data
  })
}

/**
 * 删除执行者
 * @param {string} id - 执行者 ID
 * @returns {Promise}
 */
export function deleteExecutor(id) {
  return request({
    url: `/executors/${id}`,
    method: 'delete'
  })
}

/**
 * 批量导入执行者
 * @param {FormData} formData - 导入文件
 * @returns {Promise}
 */
export function importExecutors(formData) {
  return request({
    url: '/executors/import',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 获取执行者统计信息
 * @param {Object} params - 统计参数
 * @returns {Promise}
 */
export function getExecutorStats(params) {
  return request({
    url: '/executors/stats',
    method: 'get',
    params
  })
}
