import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'

// 系统模块
import Login from '../views/system/Login.vue'
import Dashboard from '../views/system/Dashboard.vue'
import SystemSettings from '../views/system/SystemSettings.vue'

// 用户管理模块
import UserList from '../views/user/UserList.vue'
import UserDetail from '../views/user/UserDetail.vue'
import CreateUser from '../views/user/CreateUser.vue'
import EditUser from '../views/user/EditUser.vue'
import RoleManage from '../views/user/RoleManage.vue'

// 订单管理模块
import OrderList from '../views/order/OrderList.vue'

// 内容管理模块
import ContentAudit from '../views/content/ContentAudit.vue'

// 合规与风控模块
import QualificationAudit from '../views/compliance/QualificationAudit.vue'
import AppealArbitration from '../views/compliance/AppealArbitration.vue'

// 财务管理模块
import ProfitSharing from '../views/finance/ProfitSharing.vue'
import DataExport from '../views/finance/DataExport.vue'

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
  
  // 用户管理模块
  {
    path: '/users',
    name: 'UserList',
    component: UserList,
    meta: { title: '用户列表', requiresAuth: true, icon: 'User' }
  },
  {
    path: '/users/:id',
    name: 'UserDetail',
    component: UserDetail,
    meta: { title: '用户详情', requiresAuth: true, hidden: true }
  },
  {
    path: '/users/create',
    name: 'CreateUser',
    component: CreateUser,
    meta: { title: '创建用户', requiresAuth: true, hidden: true }
  },
  {
    path: '/users/:id/edit',
    name: 'EditUser',
    component: EditUser,
    meta: { title: '编辑用户', requiresAuth: true, hidden: true }
  },
  {
    path: '/users/:id/permission',
    name: 'UserPermission',
    component: RoleManage,
    meta: { title: '权限配置', requiresAuth: true, hidden: true }
  },
  {
    path: '/roles',
    name: 'RoleManage',
    component: RoleManage,
    meta: { title: '角色管理', requiresAuth: true, icon: 'Lock' }
  },
  
  // 订单管理模块
  {
    path: '/orders',
    name: 'OrderList',
    component: OrderList,
    meta: { title: '订单管理', requiresAuth: true, icon: 'List' }
  },
  
  // 内容管理模块
  {
    path: '/content',
    name: 'ContentAudit',
    component: ContentAudit,
    meta: { title: '内容审核', requiresAuth: true, icon: 'DocumentChecked' }
  },
  
  // 合规与风控模块
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
  
  // 财务管理模块
  {
    path: '/profit-sharing',
    name: 'ProfitSharing',
    component: ProfitSharing,
    meta: { title: '分账配置', requiresAuth: true, icon: 'Coin' }
  },
  {
    path: '/export',
    name: 'DataExport',
    component: DataExport,
    meta: { title: '数据导出', requiresAuth: true, icon: 'Download' }
  },
  
  // 系统设置
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
