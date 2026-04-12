import request from './request'

/**
 * 获取用户列表
 */
export function getUserList(params) {
  return request({
    url: '/api/users',
    method: 'get',
    params
  })
}

/**
 * 获取用户详情
 */
export function getUserDetail(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'get'
  })
}

/**
 * 创建用户
 */
export function createUser(data) {
  return request({
    url: '/api/users',
    method: 'post',
    data
  })
}

/**
 * 更新用户
 */
export function updateUser(id, data) {
  return request({
    url: `/api/users/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除用户
 */
export function deleteUser(id) {
  return request({
    url: `/api/users/${id}`,
    method: 'delete'
  })
}

/**
 * 批量删除用户
 */
export function batchDeleteUsers(ids) {
  return request({
    url: '/api/users/batch',
    method: 'delete',
    data: { ids }
  })
}

/**
 * 切换用户状态
 */
export function toggleUserStatus(id, status) {
  return request({
    url: `/api/users/${id}/status`,
    method: 'patch',
    data: { status }
  })
}

/**
 * 导出用户数据
 */
export function exportUsers(params) {
  return request({
    url: '/api/users/export',
    method: 'get',
    params,
    responseType: 'blob'
  })
}
