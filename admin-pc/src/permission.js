import { ElMessage } from 'element-plus'
import router from '@/router'

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
  
  // Token 验证（可选：可以在这里添加 Token 有效性验证）
  try {
    // TODO: 可以在这里添加 Token 验证逻辑
    // const valid = await validateToken(token)
    // if (!valid) {
    //   localStorage.removeItem('admin_token')
    //   ElMessage.error('登录已过期，请重新登录')
    //   next({ path: '/login' })
    //   return
    // }
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
  console.log('路由变化:', from.path, '->', to.path)
})

export default router
