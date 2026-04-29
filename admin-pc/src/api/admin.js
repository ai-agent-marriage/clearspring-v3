import request from './request'

/**
 * 管理员 API
 */

/**
 * 获取管理员列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.username - 用户名
 * @param {string} params.role - 角色
 * @returns {Promise}
 */
export function getAdminList(params) {
  return request({
    url: '/admins',
    method: 'get',
    params
  })
}

/**
 * 获取管理员详情
 * @param {string} id - 管理员 ID
 * @returns {Promise}
 */
export function getAdminDetail(id) {
  return request({
    url: `/admins/${id}`,
    method: 'get'
  })
}

/**
 * 创建管理员
 * @param {Object} data - 管理员信息
 * @returns {Promise}
 */
export function createAdmin(data) {
  return request({
    url: '/admins',
    method: 'post',
    data
  })
}

/**
 * 更新管理员信息
 * @param {string} id - 管理员 ID
 * @param {Object} data - 更新数据
 * @returns {Promise}
 */
export function updateAdmin(id, data) {
  return request({
    url: `/admins/${id}`,
    method: 'put',
    data
  })
}

/**
 * 更新管理员角色
 * @param {string} id - 管理员 ID
 * @param {Object} data - 角色数据
 * @param {string} data.role - 新角色
 * @returns {Promise}
 */
export function updateAdminRole(id, data) {
  return request({
    url: `/admins/${id}/role`,
    method: 'put',
    data
  })
}

/**
 * 删除管理员
 * @param {string} id - 管理员 ID
 * @returns {Promise}
 */
export function deleteAdmin(id) {
  return request({
    url: `/admins/${id}`,
    method: 'delete'
  })
}

/**
 * 重置管理员密码
 * @param {string} id - 管理员 ID
 * @param {Object} data - 密码数据
 * @returns {Promise}
 */
export function resetAdminPassword(id, data) {
  return request({
    url: `/admins/${id}/reset-password`,
    method: 'post',
    data
  })
}

/**
 * 获取管理员操作日志
 * @param {string} id - 管理员 ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getAdminLogs(id, params) {
  return request({
    url: `/admins/${id}/logs`,
    method: 'get',
    params
  })
}
