import { ElMessage } from 'element-plus'
import router from '@/router'
import { validateToken } from '@/utils/security'

/**
 * 路由权限守卫
 * 负责：
 * 1. JWT Token 验证
 * 2. 白名单管理
 * 3. 动态设置页面标题
 * 4. 未登录重定向
 */

// 不需要登录的白名单路由
const whiteList = ['/login']

// 路由前置守卫
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  if (to.meta.title) {
    document.title = `${to.meta.title} - 清如 ClearSpring`
  }
  
  // 检查是否在白名单中
  if (whiteList.includes(to.path)) {
    // 如果已登录，访问登录页则重定向到首页
    const token = localStorage.getItem('admin_token')
    if (token && to.path === '/login') {
      next({ path: '/dashboard' })
    } else {
      next()
    }
    return
  }
  
  // 获取 Token
  const token = localStorage.getItem('admin_token')
  
  if (!token) {
    // 未登录，重定向到登录页
    ElMessage.warning('请先登录')
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }
  
  // Token 有效性验证
  try {
    const valid = validateToken(token)
    if (!valid) {
      console.warn('Token 无效或已过期，尝试自动刷新')
      // Token 无效，尝试刷新（request.js 中会处理 401 自动刷新）
      // 这里直接清除本地 Token，让后续请求触发刷新机制
      localStorage.removeItem('admin_token')
      ElMessage.warning('登录已过期，正在重新验证...')
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    next()
  } catch (error) {
    console.error('路由守卫错误:', error)
    localStorage.removeItem('admin_token')
    ElMessage.error('登录已过期，请重新登录')
    next({ path: '/login' })
  }
})

// 路由后置守卫
router.afterEach((to, from) => {
  // 可以在这里添加埋点统计等操作
  // [CLEANED] console.log('路由变化:', from.path, '->', to.path)})

export default router
