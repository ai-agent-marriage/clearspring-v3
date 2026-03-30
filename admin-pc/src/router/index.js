import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 页面组件
import Login from '../views/Login.vue'
import Dashboard from '../views/Dashboard.vue'
import OrderList from '../views/OrderList.vue'
import QualificationAudit from '../views/QualificationAudit.vue'
import AppealArbitration from '../views/AppealArbitration.vue'
import ProfitSharing from '../views/ProfitSharing.vue'
import ExecutorManage from '../views/ExecutorManage.vue'
import DataExport from '../views/DataExport.vue'
import SystemSettings from '../views/SystemSettings.vue'

// 路由配置
const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', requiresAuth: false }
  },
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: '控制台', requiresAuth: true, icon: 'DataAnalysis' }
  },
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '订单管理', requiresAuth: true, icon: 'List' }
  },
  {
    path: '/qualifications',
    name: 'QualificationAudit',
    component: QualificationAudit,
    meta: { title: '资质审核', requiresAuth: true, icon: 'DocumentChecked' }
  },
  {
    path: '/appeals',
    name: 'AppealArbitration',
    component: AppealArbitration,
    meta: { title: '申诉仲裁', requiresAuth: true, icon: 'ScaleToOriginal' }
  },
  {
    path: '/profit-sharing',
    name: 'ProfitSharing',
    component: ProfitSharing,
    meta: { title: '分账配置', requiresAuth: true, icon: 'Coin' }
  },
  {
    path: '/executors',
    name: 'ExecutorManage',
    component: ExecutorManage,
    meta: { title: '执行者管理', requiresAuth: true, icon: 'User' }
  },
  {
    path: '/export',
    name: 'DataExport',
    component: DataExport,
    meta: { title: '数据导出', requiresAuth: true, icon: 'Download' }
  },
  {
    path: '/settings',
    name: 'SystemSettings',
    component: SystemSettings,
    meta: { title: '系统设置', requiresAuth: true, icon: 'Setting' }
  }
]

// 创建路由实例
const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - 清如 ClearSpring` : '清如 ClearSpring'
  
  // 检查是否需要登录
  if (to.meta.requiresAuth !== false) {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      ElMessage.warning('请先登录')
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
  }
  
  next()
})

export default router
