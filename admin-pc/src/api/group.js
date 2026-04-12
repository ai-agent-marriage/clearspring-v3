import request from './request'

/**
 * 获取分组列表
 */
export function getGroupList(params) {
  return request({
    url: '/api/groups',
    method: 'get',
    params
  })
}

/**
 * 获取分组详情
 */
export function getGroupDetail(id) {
  return request({
    url: `/api/groups/${id}`,
    method: 'get'
  })
}

/**
 * 创建分组
 */
export function createGroup(data) {
  return request({
    url: '/api/groups',
    method: 'post',
    data
  })
}

/**
 * 更新分组
 */
export function updateGroup(id, data) {
  return request({
    url: `/api/groups/${id}`,
    method: 'put',
    data
  })
}

/**
 * 删除分组
 */
export function deleteGroup(id) {
  return request({
    url: `/api/groups/${id}`,
    method: 'delete'
  })
}

/**
 * 获取分组成员列表
 */
export function getGroupMembers(groupId) {
  return request({
    url: `/api/groups/${groupId}/members`,
    method: 'get'
  })
}

/**
 * 添加分组成员
 */
export function addGroupMembers(groupId, userIds) {
  return request({
    url: `/api/groups/${groupId}/members`,
    method: 'post',
    data: { userIds }
  })
}

/**
 * 移除分组成员
 */
export function removeGroupMember(groupId, userId) {
  return request({
    url: `/api/groups/${groupId}/members/${userId}`,
    method: 'delete'
  })
}
