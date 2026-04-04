/**
 * 统一 API 请求封装
 * 提供统计相关的数据接口调用
 */

import request from './request'

/**
 * 获取仪表盘统计数据
 * @returns {Promise<object>} 统计数据
 */
export async function fetchDashboardStats() {
  try {
    const res = await request({
      url: '/api/stats/dashboard',
      method: 'GET'
    })
    return res.data
  } catch (error) {
    console.error('Fetch dashboard stats error:', error)
    throw error
  }
}

/**
 * 获取仪表盘详细数据
 * @returns {Promise<object>} 仪表盘数据
 */
export async function fetchDashboardData() {
  try {
    const res = await request({
      url: '/api/stats/dashboard',
      method: 'GET'
    })
    return res.data
  } catch (error) {
    console.error('Fetch dashboard data error:', error)
    throw error
  }
}

/**
 * 获取趋势数据
 * @param {string} timeRange - 时间范围 (7|30|90)
 * @param {array} metrics - 指标列表
 * @returns {Promise<object>} 趋势数据
 */
export async function fetchTrendData(timeRange = '7', metrics = ['orders', 'amount']) {
  try {
    const res = await request({
      url: '/api/stats/trend',
      method: 'GET',
      data: {
        timeRange,
        metrics: metrics.join(',')
      }
    })
    return res.data
  } catch (error) {
    console.error('Fetch trend data error:', error)
    throw error
  }
}

/**
 * 获取物种分布数据
 * @returns {Promise<object>} 物种分布数据
 */
export async function fetchSpeciesDistribution() {
  try {
    const res = await request({
      url: '/api/stats/species-distribution',
      method: 'GET'
    })
    return res.data
  } catch (error) {
    console.error('Fetch species distribution error:', error)
    throw error
  }
}

/**
 * 导出统计数据
 * @param {object} options - 导出选项
 * @param {string} options.format - 导出格式 (excel|csv)
 * @param {string} options.timeRange - 时间范围
 * @param {array} options.metrics - 指标列表
 * @returns {Promise<object>} 导出结果
 */
export async function exportStatsData(options = {}) {
  try {
    const res = await request({
      url: '/api/stats/export',
      method: 'GET',
      data: options
    })
    return res.data
  } catch (error) {
    console.error('Export stats data error:', error)
    throw error
  }
}

/**
 * 上传图片（带压缩）
 * @param {string} filePath - 图片路径
 * @param {object} options - 压缩选项
 * @returns {Promise<object>} 上传结果
 */
export async function uploadImage(filePath, options = {}) {
  try {
    // 先压缩图片
    const compressedPath = await compressImage(filePath, options)
    
    // 上传到云存储
    const res = await request({
      url: '/api/upload/image',
      method: 'POST',
      filePath: compressedPath,
      name: 'image'
    })
    return res.data
  } catch (error) {
    console.error('Upload image error:', error)
    throw error
  }
}

/**
 * 压缩图片
 * @param {string} src - 源图片路径
 * @param {object} options - 压缩选项
 * @param {number} options.quality - 压缩质量 (0-100)
 * @param {number} options.maxWidth - 最大宽度
 * @returns {Promise<string>} 压缩后的图片路径
 */
export function compressImage(src, options = {}) {
  const { quality = 80, maxWidth = 1024 } = options
  
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src,
      quality,
      compressedWidth: maxWidth,
      success: (res) => {
        resolve(res.tempFilePath)
      },
      fail: (error) => {
        reject(error)
      }
    })
  })
}

/**
 * 显示加载提示
 * @param {string} title - 提示文字
 */
export function showLoading(title = '加载中...') {
  wx.showLoading({
    title,
    mask: true
  })
}

/**
 * 隐藏加载提示
 */
export function hideLoading() {
  wx.hideLoading()
}

/**
 * 显示错误提示
 * @param {string} message - 错误信息
 */
export function showError(message = '操作失败') {
  wx.showToast({
    title: message,
    icon: 'none',
    duration: 2000
  })
}

/**
 * 显示成功提示
 * @param {string} message - 成功信息
 */
export function showSuccess(message = '操作成功') {
  wx.showToast({
    title: message,
    icon: 'success',
    duration: 2000
  })
}
