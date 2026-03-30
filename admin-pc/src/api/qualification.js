import request from './request'

/**
 * 资质审核 API
 */

/**
 * 获取资质审核列表
 * @param {Object} params - 查询参数
 * @param {number} params.page - 页码
 * @param {number} params.pageSize - 每页数量
 * @param {string} params.executorName - 执行者姓名
 * @param {string} params.status - 审核状态
 * @param {string} params.type - 资质类型
 * @returns {Promise}
 */
export function getQualificationList(params) {
  return request({
    url: '/qualifications',
    method: 'get',
    params
  })
}

/**
 * 获取资质详情
 * @param {string} id - 资质 ID
 * @returns {Promise}
 */
export function getQualificationDetail(id) {
  return request({
    url: `/qualifications/${id}`,
    method: 'get'
  })
}

/**
 * 审核资质
 * @param {string} id - 资质 ID
 * @param {Object} data - 审核数据
 * @param {string} data.status - 审核状态（approved/rejected）
 * @param {string} data.remark - 审核意见
 * @returns {Promise}
 */
export function auditQualification(id, data) {
  return request({
    url: `/qualifications/${id}/audit`,
    method: 'post',
    data
  })
}

/**
 * 上传资质文件
 * @param {FormData} formData - 文件数据
 * @returns {Promise}
 */
export function uploadQualification(formData) {
  return request({
    url: '/qualifications/upload',
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
}

/**
 * 下载资质文件
 * @param {string} id - 资质 ID
 * @returns {Promise}
 */
export function downloadQualification(id) {
  return request({
    url: `/qualifications/${id}/download`,
    method: 'get',
    responseType: 'blob'
  })
}

/**
 * 获取资质审核统计
 * @param {Object} params - 统计参数
 * @returns {Promise}
 */
export function getQualificationStats(params) {
  return request({
    url: '/qualifications/stats',
    method: 'get',
    params
  })
}
