/**
 * 清如 ClearSpring - 日志清理工具
 * 定期清理过期日志，防止存储空间占用过大
 * 支持按数量和按时间两种清理方式
 * @module utils/log-cleaner
 * @version 1.0.0
 * @author ClearSpring Team
 */

import constants from '../config/constants.js'

const {
  LOG_RETENTION_DAYS,
  MAX_ERROR_LOGS,
  MAX_ACCESS_LOGS,
  MAX_OPERATION_LOGS,
  LOG_CLEAN_INTERVAL,
  ONE_DAY
} = constants

/**
 * 日志清理配置
 * 使用常量定义，便于统一管理
 */
const LOG_CONFIG = {
  // 日志保留天数
  RETENTION_DAYS: LOG_RETENTION_DAYS,
  // 最大日志条数（错误日志）
  MAX_ERROR_LOGS: MAX_ERROR_LOGS,
  // 最大日志条数（访问日志）
  MAX_ACCESS_LOGS: MAX_ACCESS_LOGS,
  // 最大日志条数（操作日志）
  MAX_OPERATION_LOGS: MAX_OPERATION_LOGS,
  // 日志清理间隔（1 天）
  CLEAN_INTERVAL: LOG_CLEAN_INTERVAL,
  // 日志存储键名
  KEYS: {
    ERROR_LOGS: 'errorLogs',
    ACCESS_LOGS: 'accessLogs',
    OPERATION_LOGS: 'operationLogs',
    LAST_CLEAN_TIME: 'lastLogCleanTime'
  }
}

/**
 * 清理错误日志
 * 保留最近的 MAX_ERROR_LOGS 条记录
 * @returns {number} 清理的日志数量
 */
export function cleanErrorLogs() {
  const logs = wx.getStorageSync(LOG_CONFIG.KEYS.ERROR_LOGS) || []
  const originalLength = logs.length
  
  if (logs.length > LOG_CONFIG.MAX_ERROR_LOGS) {
    const removedCount = logs.length - LOG_CONFIG.MAX_ERROR_LOGS
    logs.splice(0, removedCount)
    wx.setStorageSync(LOG_CONFIG.KEYS.ERROR_LOGS, logs)
    console.log(`[日志清理] 清理了 ${removedCount} 条错误日志`)
    return removedCount
  }
  
  return 0
}

/**
 * 清理访问日志
 * 保留最近的 MAX_ACCESS_LOGS 条记录
 * @returns {number} 清理的日志数量
 */
export function cleanAccessLogs() {
  const logs = wx.getStorageSync(LOG_CONFIG.KEYS.ACCESS_LOGS) || []
  const originalLength = logs.length
  
  if (logs.length > LOG_CONFIG.MAX_ACCESS_LOGS) {
    const removedCount = logs.length - LOG_CONFIG.MAX_ACCESS_LOGS
    logs.splice(0, removedCount)
    wx.setStorageSync(LOG_CONFIG.KEYS.ACCESS_LOGS, logs)
    console.log(`[日志清理] 清理了 ${removedCount} 条访问日志`)
    return removedCount
  }
  
  return 0
}

/**
 * 清理操作日志
 * 保留最近的 MAX_OPERATION_LOGS 条记录
 * @returns {number} 清理的日志数量
 */
export function cleanOperationLogs() {
  const logs = wx.getStorageSync(LOG_CONFIG.KEYS.OPERATION_LOGS) || []
  const originalLength = logs.length
  
  if (logs.length > LOG_CONFIG.MAX_OPERATION_LOGS) {
    const removedCount = logs.length - LOG_CONFIG.MAX_OPERATION_LOGS
    logs.splice(0, removedCount)
    wx.setStorageSync(LOG_CONFIG.KEYS.OPERATION_LOGS, logs)
    console.log(`[日志清理] 清理了 ${removedCount} 条操作日志`)
    return removedCount
  }
  
  return 0
}

/**
 * 清理过期日志（基于时间）
 * 删除超过 RETENTION_DAYS 天的日志
 * @returns {number} 清理的日志数量
 */
export function cleanExpiredLogs() {
  const now = Date.now()
  const maxAge = LOG_CONFIG.RETENTION_DAYS * ONE_DAY
  let totalCleaned = 0
  
  // 清理错误日志
  const errorLogs = wx.getStorageSync(LOG_CONFIG.KEYS.ERROR_LOGS) || []
  const filteredErrorLogs = errorLogs.filter(log => {
    const logTime = log.timestamp || 0
    return (now - logTime) < maxAge
  })
  
  if (filteredErrorLogs.length < errorLogs.length) {
    const removedCount = errorLogs.length - filteredErrorLogs.length
    totalCleaned += removedCount
    wx.setStorageSync(LOG_CONFIG.KEYS.ERROR_LOGS, filteredErrorLogs)
    console.log(`[日志清理] 清理了 ${removedCount} 条过期错误日志`)
  }
  
  // 清理访问日志
  const accessLogs = wx.getStorageSync(LOG_CONFIG.KEYS.ACCESS_LOGS) || []
  const filteredAccessLogs = accessLogs.filter(log => {
    const logTime = log.timestamp || 0
    return (now - logTime) < maxAge
  })
  
  if (filteredAccessLogs.length < accessLogs.length) {
    const removedCount = accessLogs.length - filteredAccessLogs.length
    totalCleaned += removedCount
    wx.setStorageSync(LOG_CONFIG.KEYS.ACCESS_LOGS, filteredAccessLogs)
    console.log(`[日志清理] 清理了 ${removedCount} 条过期访问日志`)
  }
  
  return totalCleaned
}

/**
 * 执行完整日志清理
 * 包括数量限制清理和过期清理
 * @returns {Object} 清理结果统计
 */
export function cleanAllLogs() {
  const errorCleaned = cleanErrorLogs()
  const accessCleaned = cleanAccessLogs()
  const operationCleaned = cleanOperationLogs()
  const expiredCleaned = cleanExpiredLogs()
  
  // 记录最后清理时间
  wx.setStorageSync(LOG_CONFIG.KEYS.LAST_CLEAN_TIME, Date.now())
  
  const result = {
    errorLogsCleaned: errorCleaned,
    accessLogsCleaned: accessCleaned,
    operationLogsCleaned: operationCleaned,
    expiredLogsCleaned: expiredCleaned,
    totalCleaned: errorCleaned + accessCleaned + operationCleaned + expiredCleaned,
    cleanTime: new Date().toISOString()
  }
  
  console.log('[日志清理] 清理完成', result)
  return result
}

/**
 * 检查是否需要清理日志
 * 如果距离上次清理超过 1 天，则执行清理
 * @returns {boolean} 是否执行了清理
 */
export function checkAndClean() {
  const lastCleanTime = wx.getStorageSync(LOG_CONFIG.KEYS.LAST_CLEAN_TIME) || 0
  const now = Date.now()
  
  if (now - lastCleanTime > LOG_CONFIG.CLEAN_INTERVAL) {
    console.log('[日志清理] 检测到超过 1 天未清理，开始清理')
    cleanAllLogs()
    return true
  }
  
  return false
}

/**
 * 获取日志统计信息
 * @returns {Object} 日志统计
 */
export function getLogStats() {
  const errorLogs = wx.getStorageSync(LOG_CONFIG.KEYS.ERROR_LOGS) || []
  const accessLogs = wx.getStorageSync(LOG_CONFIG.KEYS.ACCESS_LOGS) || []
  const operationLogs = wx.getStorageSync(LOG_CONFIG.KEYS.OPERATION_LOGS) || []
  const lastCleanTime = wx.getStorageSync(LOG_CONFIG.KEYS.LAST_CLEAN_TIME) || 0
  
  return {
    errorLogs: {
      count: errorLogs.length,
      max: LOG_CONFIG.MAX_ERROR_LOGS
    },
    accessLogs: {
      count: accessLogs.length,
      max: LOG_CONFIG.MAX_ACCESS_LOGS
    },
    operationLogs: {
      count: operationLogs.length,
      max: LOG_CONFIG.MAX_OPERATION_LOGS
    },
    lastCleanTime: lastCleanTime ? new Date(lastCleanTime).toISOString() : '从未清理',
    retentionDays: LOG_CONFIG.RETENTION_DAYS
  }
}

export default {
  LOG_CONFIG,
  cleanErrorLogs,
  cleanAccessLogs,
  cleanOperationLogs,
  cleanExpiredLogs,
  cleanAllLogs,
  checkAndClean,
  getLogStats
}
