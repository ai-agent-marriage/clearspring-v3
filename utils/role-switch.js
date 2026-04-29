/**
 * 角色切换与草稿箱管理
 * 基于 V4.0 规范：角色无感切换 + 草稿箱检测 + 后台任务静默执行
 */

const STORAGE_KEY = {
  USER_INFO: 'userInfo',
  ROLE_STATUS: 'roleStatus',
  DRAFT_DATA: 'draftData',
  BACKGROUND_TASKS: 'backgroundTasks'
}

// 角色类型
const ROLE = {
  PRAYER: 'prayer',      // 祈福者
  EXECUTOR: 'executor',  // 执行者
  ADMIN: 'admin'         // 管理员
}

/**
 * 获取当前角色状态
 */
export function getCurrentRole() {
  const status = wx.getStorageSync(STORAGE_KEY.ROLE_STATUS)
  return status?.currentRole || ROLE.PRAYER
}

/**
 * 设置角色状态
 */
export function setRoleRole(role, userInfo) {
  const status = {
    currentRole: role,
    switchTime: Date.now(),
    userInfo
  }
  wx.setStorageSync(STORAGE_KEY.ROLE_STATUS, status)
}

/**
 * 角色切换（无感切换）
 * @param {string} targetRole - 目标角色
 * @param {function} callback - 切换完成回调
 */
export function switchRole(targetRole, callback) {
  // 1. 检测草稿箱
  const hasDraft = checkDraftExists()
  
  if (hasDraft) {
    // 显示草稿箱检测提示
    wx.showModal({
      title: '检测到未完成任务',
      content: '您有正在进行的执行任务，切换角色后任务将在后台继续执行，完成后将通过服务通知提醒您。',
      confirmText: '继续切换',
      cancelText: '先完成任务',
      success: (res) => {
        if (res.confirm) {
          // 保存草稿，后台静默执行
          saveDraftForBackground()
          performSwitch(targetRole, callback)
        }
      }
    })
  } else {
    performSwitch(targetRole, callback)
  }
}

/**
 * 执行角色切换
 */
function performSwitch(targetRole, callback) {
  const userInfo = wx.getStorageSync(STORAGE_KEY.USER_INFO)
  
  // 更新角色状态
  setRoleRole(targetRole, userInfo)
  
  // 触发后台任务检查
  checkBackgroundTasks()
  
  // 通知切换完成（无需重新加载页面）
  if (callback) {
    callback()
  }
  
  // 发送切换事件
  wx.emit('roleSwitched', { targetRole, userInfo })
}

/**
 * 检查草稿箱是否存在未完成数据
 */
export function checkDraftExists() {
  const draft = wx.getStorageSync(STORAGE_KEY.DRAFT_DATA)
  if (!draft) return false
  
  // 检查是否有未完成的执行者任务
  if (draft.evidence && !draft.evidence.submitted) return true
  if (draft.order && !draft.order.completed) return true
  
  return false
}

/**
 * 保存草稿到后台任务
 */
export function saveDraftForBackground() {
  const draft = wx.getStorageSync(STORAGE_KEY.DRAFT_DATA)
  if (!draft) return
  
  const tasks = wx.getStorageSync(STORAGE_KEY.BACKGROUND_TASKS) || []
  
  // 将草稿转为后台任务
  if (draft.evidence) {
    tasks.push({
      type: 'evidence_upload',
      data: draft.evidence,
      status: 'pending',
      createTime: Date.now()
    })
  }
  
  wx.setStorageSync(STORAGE_KEY.BACKGROUND_TASKS, tasks)
  
  // 清空草稿箱
  wx.removeStorageSync(STORAGE_KEY.DRAFT_DATA)
}

/**
 * 检查后台任务状态
 */
export function checkBackgroundTasks() {
  const tasks = wx.getStorageSync(STORAGE_KEY.BACKGROUND_TASKS) || []
  
  if (tasks.length === 0) return
  
  // 检查任务完成状态（实际应由云函数推送通知）
  tasks.forEach(task => {
    if (task.status === 'pending') {
      // 模拟后台静默执行
      executeBackgroundTask(task)
    }
  })
}

/**
 * 执行后台任务
 */
function executeBackgroundTask(task) {
  // 实际应调用云函数
  // [CLEANED] console.log('[后台任务] 开始执行:', task.type)// 模拟执行
  setTimeout(() => {
    task.status = 'completed'
    task.completeTime = Date.now()
    
    // 保存任务结果
    const tasks = wx.getStorageSync(STORAGE_KEY.BACKGROUND_TASKS)
    wx.setStorageSync(STORAGE_KEY.BACKGROUND_TASKS, tasks)
    
    // 触发服务通知（实际应通过云函数）
    wx.emit('backgroundTaskCompleted', task)
    
    // [CLEANED] console.log('[后台任务] 执行完成:', task.type)}, 1000)
}

/**
 * 保存草稿数据
 */
export function saveDraft(data) {
  wx.setStorageSync(STORAGE_KEY.DRAFT_DATA, {
    ...data,
    updateTime: Date.now()
  })
}

/**
 * 获取草稿数据
 */
export function getDraft() {
  return wx.getStorageSync(STORAGE_KEY.DRAFT_DATA)
}

/**
 * 清除草稿
 */
export function clearDraft() {
  wx.removeStorageSync(STORAGE_KEY.DRAFT_DATA)
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return wx.getStorageSync(STORAGE_KEY.USER_INFO)
}

/**
 * 保存用户信息
 */
export function setUserInfo(info) {
  wx.setStorageSync(STORAGE_KEY.USER_INFO, info)
}

/**
 * 权限检查 - 祈福者视角隐藏执行者功能
 */
export function canAccessExecutorFeature() {
  const role = getCurrentRole()
  return role === ROLE.EXECUTOR
}

/**
 * 权限检查 - 管理员功能
 */
export function canAccessAdminFeature() {
  const role = getCurrentRole()
  return role === ROLE.ADMIN
}

export default {
  ROLE,
  getCurrentRole,
  switchRole,
  checkDraftExists,
  saveDraft,
  getDraft,
  clearDraft,
  getUserInfo,
  setUserInfo,
  canAccessExecutorFeature,
  canAccessAdminFeature
}
