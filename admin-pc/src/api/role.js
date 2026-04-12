import request from './request'

/**
 * 获取角色列表
 */
export function getRoleList(params) {
  return request({
    url: '/api/roles',
    method: 'get',
    params
  })
}

/**
 * 获取角色详情
 */
export function getRoleDetail(id) {
  return request({
    url: `/api/roles/${id}`,
    method: 'get'
  })
}

/**
 * 创建角色
 */
export function createRole(data) {
  return request({
    url: '/api/roles',
    method: 'post',
    data
  })
}

/**
 * 更新角色
 */
export function updateRole(id, data) {
  return request({
    url: `/api/roles/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除角色
 */
export function deleteRole(id) {
  return request({
    url: `/api/roles/${id}`,
    method: 'delete'
  })
}

/**
 * 获取角色用户列表
 */
export function getRoleUsers(roleId) {
  return request({
    url: `/api/roles/${roleId}/users`,
    method: 'get'
  })
}

/**
 * 添加用户到角色
 */
export function addUserToRole(roleId, userId) {
  return request({
    url: `/api/roles/${roleId}/users/${userId}`,
    method: 'post'
  })
}

/**
 * 从角色移除用户
 */
export function removeUserFromRole(roleId, userId) {
  return request({
    url: `/api/roles/${roleId}/users/${userId}`,
    method: 'delete'
  })
}
