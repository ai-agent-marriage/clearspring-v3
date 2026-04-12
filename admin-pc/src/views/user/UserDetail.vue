<template>
  <div class="user-detail-container">
    <div class="page-header">
      <div class="header-left">
        <el-button type="info" circle @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h2 class="page-title">用户详情</h2>
          <p class="page-description">查看用户详细信息和操作记录</p>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleEdit">
          <el-icon><Edit /></el-icon>
          编辑
        </el-button>
        <el-button type="danger" @click="handleDelete">
          <el-icon><Delete /></el-icon>
          删除
        </el-button>
      </div>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <!-- 左侧：用户基本信息 -->
      <el-col :span="8">
        <el-card shadow="hover" class="info-card">
          <template #header>
            <div class="card-header">
              <span>基本信息</span>
            </div>
          </template>
          <div class="user-avatar">
            <el-avatar :size="100" :icon="UserFilled" />
          </div>
          <div class="user-name">{{ userInfo.username }}</div>
          <div class="user-role">
            <el-tag :type="getRoleTagType(userInfo.role)">
              {{ getRoleLabel(userInfo.role) }}
            </el-tag>
          </div>
          <el-divider />
          <el-descriptions :column="1" border>
            <el-descriptions-item label="用户 ID">{{ userInfo.id }}</el-descriptions-item>
            <el-descriptions-item label="手机号">{{ userInfo.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusTagType(userInfo.status)">
                {{ getStatusLabel(userInfo.status) }}
              </el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="注册时间">{{ userInfo.createTime }}</el-descriptions-item>
            <el-descriptions-item label="最后登录">{{ userInfo.lastLoginTime || '从未登录' }}</el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 用户统计 -->
        <el-card shadow="hover" class="stats-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>数据统计</span>
            </div>
          </template>
          <el-row :gutter="10">
            <el-col :span="12" class="stat-item">
              <div class="stat-value">{{ userInfo.orderCount || 0 }}</div>
              <div class="stat-label">订单数</div>
            </el-col>
            <el-col :span="12" class="stat-item">
              <div class="stat-value">{{ userInfo.loginCount || 0 }}</div>
              <div class="stat-label">登录次数</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <!-- 右侧：详细信息 -->
      <el-col :span="16">
        <!-- 扩展信息 -->
        <el-card shadow="hover" class="detail-card">
          <template #header>
            <div class="card-header">
              <span>扩展信息</span>
            </div>
          </template>
          <el-descriptions :column="2" border>
            <el-descriptions-item label="昵称">{{ userInfo.nickname || '-' }}</el-descriptions-item>
            <el-descriptions-item label="性别">{{ userInfo.gender || '-' }}</el-descriptions-item>
            <el-descriptions-item label="生日">{{ userInfo.birthday || '-' }}</el-descriptions-item>
            <el-descriptions-item label="地区">{{ userInfo.region || '-' }}</el-descriptions-item>
            <el-descriptions-item label="部门" :span="2">{{ userInfo.department || '-' }}</el-descriptions-item>
            <el-descriptions-item label="职位" :span="2">{{ userInfo.position || '-' }}</el-descriptions-item>
            <el-descriptions-item label="备注" :span="2">
              {{ userInfo.remark || '无备注' }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 权限信息 -->
        <el-card shadow="hover" class="permission-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>权限信息</span>
              <el-button type="primary" link @click="handlePermission">
                配置权限
              </el-button>
            </div>
          </template>
          <el-tag
            v-for="perm in userInfo.permissions"
            :key="perm"
            style="margin-right: 8px; margin-bottom: 8px"
          >
            {{ perm }}
          </el-tag>
          <el-empty v-if="!userInfo.permissions || userInfo.permissions.length === 0" description="暂无权限" />
        </el-card>

        <!-- 操作日志 -->
        <el-card shadow="hover" class="log-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>操作日志</span>
              <el-button type="primary" link @click="handleViewLogs">
                查看全部
              </el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="log in recentLogs"
              :key="log.id"
              :timestamp="log.time"
              placement="top"
            >
              <el-card>
                <p>{{ log.action }}</p>
                <p class="log-detail">{{ log.detail }}</p>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Edit,
  Delete,
  UserFilled
} from '@element-plus/icons-vue'
import { getUserDetail, deleteUser } from '@/api/user'

const route = useRoute()
const router = useRouter()

// 加载状态
const loading = ref(false)

// 用户信息
const userInfo = reactive({
  id: '',
  username: '',
  phone: '',
  email: '',
  role: '',
  status: '',
  createTime: '',
  lastLoginTime: '',
  nickname: '',
  gender: '',
  birthday: '',
  region: '',
  department: '',
  position: '',
  remark: '',
  permissions: [],
  orderCount: 0,
  loginCount: 0
})

// 最近操作日志
const recentLogs = ref([])

// 角色标签类型
const getRoleTagType = (role) => {
  const typeMap = {
    super_admin: 'danger',
    admin: 'warning',
    user: ''
  }
  return typeMap[role] || ''
}

// 角色标签文本
const getRoleLabel = (role) => {
  const labelMap = {
    super_admin: '超级管理员',
    admin: '管理员',
    user: '普通用户'
  }
  return labelMap[role] || role
}

// 状态标签类型
const getStatusTagType = (status) => {
  const typeMap = {
    active: 'success',
    disabled: 'danger',
    pending: 'warning'
  }
  return typeMap[status] || ''
}

// 状态标签文本
const getStatusLabel = (status) => {
  const labelMap = {
    active: '启用',
    disabled: '禁用',
    pending: '待审核'
  }
  return labelMap[status] || status
}

// 加载用户详情
const loadUserDetail = async () => {
  loading.value = true
  try {
    const res = await getUserDetail(route.params.id)
    Object.assign(userInfo, res.data)
    recentLogs.value = res.data?.recentLogs || []
  } catch (error) {
    console.error('加载用户详情失败:', error)
    ElMessage.error('加载用户详情失败')
  } finally {
    loading.value = false
  }
}

// 返回
const handleBack = () => {
  router.back()
}

// 编辑
const handleEdit = () => {
  router.push(`/users/${route.params.id}/edit`)
}

// 删除
const handleDelete = async () => {
  try {
    await ElMessageBox.confirm('确定要删除该用户吗？此操作不可恢复！', '警告', {
      type: 'warning'
    })
    await deleteUser(route.params.id)
    ElMessage.success('删除成功')
    router.push('/users')
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 配置权限
const handlePermission = () => {
  router.push(`/users/${route.params.id}/permission`)
}

// 查看日志
const handleViewLogs = () => {
  router.push(`/users/${route.params.id}/logs`)
}

onMounted(() => {
  loadUserDetail()
})
</script>

<style lang="scss" scoped>
.user-detail-container {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .header-left {
      display: flex;
      align-items: center;

      .header-content {
        margin-left: 12px;

        .page-title {
          font-size: 20px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 8px;
        }

        .page-description {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }

  .info-card {
    .user-avatar {
      text-align: center;
      margin-bottom: 16px;
    }

    .user-name {
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #303133;
      margin-bottom: 8px;
    }

    .user-role {
      text-align: center;
      margin-bottom: 16px;
    }
  }

  .stats-card {
    .stat-item {
      text-align: center;
      padding: 10px;

      .stat-value {
        font-size: 24px;
        font-weight: 600;
        color: #4A5D4E;
        margin-bottom: 4px;
      }

      .stat-label {
        font-size: 14px;
        color: #909399;
      }
    }
  }

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .log-detail {
    font-size: 12px;
    color: #909399;
    margin-top: 4px;
  }
}
</style>
