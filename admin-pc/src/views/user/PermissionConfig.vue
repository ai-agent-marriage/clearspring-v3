<template>
  <div class="permission-config-container">
    <div class="page-header">
      <div class="header-left">
        <el-button type="info" circle @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h2 class="page-title">权限配置</h2>
          <p class="page-description">配置用户的详细权限</p>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleSave">
          <el-icon><Check /></el-icon>
          保存配置
        </el-button>
      </div>
    </div>

    <el-row :gutter="20" v-loading="loading">
      <!-- 左侧：用户信息 -->
      <el-col :span="8">
        <el-card shadow="hover" class="user-info-card">
          <template #header>
            <div class="card-header">
              <span>当前用户</span>
            </div>
          </template>
          <div class="user-summary">
            <el-avatar :size="80" :icon="UserFilled" />
            <div class="user-text">
              <div class="username">{{ userInfo.username }}</div>
              <div class="role">
                <el-tag :type="getRoleTagType(userInfo.role)">
                  {{ getRoleLabel(userInfo.role) }}
                </el-tag>
              </div>
            </div>
          </div>
          <el-divider />
          <el-descriptions :column="1" size="small">
            <el-descriptions-item label="手机号">{{ userInfo.phone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="邮箱">{{ userInfo.email || '-' }}</el-descriptions-item>
            <el-descriptions-item label="状态">
              <el-tag :type="getStatusTagType(userInfo.status)" size="small">
                {{ getStatusLabel(userInfo.status) }}
              </el-tag>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <!-- 快捷操作 -->
        <el-card shadow="hover" class="quick-actions-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>快捷操作</span>
            </div>
          </template>
          <el-space direction="vertical" style="width: 100%">
            <el-button style="width: 100%" @click="handleGrantAll">
              <el-icon><CircleCheck /></el-icon>
              授予全部权限
            </el-button>
            <el-button style="width: 100%" @click="handleRevokeAll">
              <el-icon><CircleClose /></el-icon>
              撤销全部权限
            </el-button>
            <el-button style="width: 100%" @click="handleReset">
              <el-icon><Refresh /></el-icon>
              恢复默认
            </el-button>
          </el-space>
        </el-card>
      </el-col>

      <!-- 右侧：权限树 -->
      <el-col :span="16">
        <el-card shadow="hover" class="permission-tree-card">
          <template #header>
            <div class="card-header">
              <span>权限配置</span>
              <el-checkbox v-model="expandAll" @change="handleExpandChange">
                展开全部
              </el-checkbox>
            </div>
          </template>
          <el-tree
            ref="treeRef"
            :data="permissionTree"
            :props="treeProps"
            show-checkbox
            default-expand-all
            node-key="id"
            :default-checked-keys="checkedPermissions"
            @check="handleTreeCheck"
          >
            <template #default="{ node, data }">
              <span class="tree-node">
                <el-icon v-if="data.icon"><component :is="data.icon" /></el-icon>
                <span>{{ node.label }}</span>
                <el-tag v-if="data.type" size="small" style="margin-left: 8px">
                  {{ data.type }}
                </el-tag>
              </span>
            </template>
          </el-tree>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Check,
  UserFilled,
  CircleCheck,
  CircleClose,
  Refresh,
  User,
  List,
  DocumentChecked,
  Coin,
  Setting
} from '@element-plus/icons-vue'
import { getUserDetail, updateUserPermissions } from '@/api/user'

const route = useRoute()
const router = useRouter()
const treeRef = ref(null)

// 加载状态
const loading = ref(false)

// 用户信息
const userInfo = reactive({
  id: '',
  username: '',
  phone: '',
  email: '',
  role: '',
  status: ''
})

// 权限树
const expandAll = ref(true)
const treeProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled'
}

// 已选中的权限
const checkedPermissions = ref([])

// 权限树数据
const permissionTree = [
  {
    id: 'user',
    label: '用户管理',
    icon: 'User',
    type: '模块',
    children: [
      {
        id: 'user:view',
        label: '查看用户',
        icon: 'View',
        type: '权限'
      },
      {
        id: 'user:create',
        label: '创建用户',
        icon: 'Plus',
        type: '权限'
      },
      {
        id: 'user:edit',
        label: '编辑用户',
        icon: 'Edit',
        type: '权限'
      },
      {
        id: 'user:delete',
        label: '删除用户',
        icon: 'Delete',
        type: '权限'
      },
      {
        id: 'user:role',
        label: '角色管理',
        icon: 'Lock',
        type: '权限'
      },
      {
        id: 'user:permission',
        label: '权限配置',
        icon: 'Key',
        type: '权限'
      }
    ]
  },
  {
    id: 'order',
    label: '订单管理',
    icon: 'List',
    type: '模块',
    children: [
      {
        id: 'order:view',
        label: '查看订单',
        icon: 'View',
        type: '权限'
      },
      {
        id: 'order:create',
        label: '创建订单',
        icon: 'Plus',
        type: '权限'
      },
      {
        id: 'order:edit',
        label: '编辑订单',
        icon: 'Edit',
        type: '权限'
      },
      {
        id: 'order:audit',
        label: '订单审核',
        icon: 'DocumentChecked',
        type: '权限'
      },
      {
        id: 'order:delete',
        label: '删除订单',
        icon: 'Delete',
        type: '权限'
      },
      {
        id: 'order:export',
        label: '订单导出',
        icon: 'Download',
        type: '权限'
      }
    ]
  },
  {
    id: 'content',
    label: '内容管理',
    icon: 'DocumentChecked',
    type: '模块',
    children: [
      {
        id: 'content:view',
        label: '查看内容',
        icon: 'View',
        type: '权限'
      },
      {
        id: 'content:edit',
        label: '编辑内容',
        icon: 'Edit',
        type: '权限'
      },
      {
        id: 'content:audit',
        label: '内容审核',
        icon: 'DocumentChecked',
        type: '权限'
      },
      {
        id: 'content:delete',
        label: '删除内容',
        icon: 'Delete',
        type: '权限'
      },
      {
        id: 'content:recommend',
        label: '内容推荐',
        icon: 'Star',
        type: '权限'
      }
    ]
  },
  {
    id: 'finance',
    label: '财务管理',
    icon: 'Coin',
    type: '模块',
    children: [
      {
        id: 'finance:view',
        label: '查看财务',
        icon: 'View',
        type: '权限'
      },
      {
        id: 'finance:report',
        label: '财务报表',
        icon: 'Document',
        type: '权限'
      },
      {
        id: 'finance:export',
        label: '导出报表',
        icon: 'Download',
        type: '权限'
      },
      {
        id: 'finance:config',
        label: '财务配置',
        icon: 'Setting',
        type: '权限'
      }
    ]
  },
  {
    id: 'system',
    label: '系统管理',
    icon: 'Setting',
    type: '模块',
    children: [
      {
        id: 'system:view',
        label: '查看系统',
        icon: 'View',
        type: '权限'
      },
      {
        id: 'system:config',
        label: '系统配置',
        icon: 'Setting',
        type: '权限'
      },
      {
        id: 'system:log',
        label: '日志管理',
        icon: 'Document',
        type: '权限'
      },
      {
        id: 'system:monitor',
        label: '系统监控',
        icon: 'Monitor',
        type: '权限'
      }
    ]
  }
]

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
    checkedPermissions.value = res.data.permissions || []
  } catch (error) {
    console.error('加载用户详情失败:', error)
    ElMessage.error('加载用户详情失败')
  } finally {
    loading.value = false
  }
}

// 树节点勾选
const handleTreeCheck = (data) => {
  checkedPermissions.value = data.checkedKeys
}

// 展开/收起
const handleExpandChange = (value) => {
  // Tree 组件会自动处理
}

// 授予全部权限
const handleGrantAll = () => {
  const allKeys = []
  const traverse = (nodes) => {
    nodes.forEach(node => {
      if (node.children) {
        traverse(node.children)
      } else {
        allKeys.push(node.id)
      }
    })
  }
  traverse(permissionTree)
  checkedPermissions.value = allKeys
  ElMessage.success('已授予全部权限')
}

// 撤销全部权限
const handleRevokeAll = () => {
  checkedPermissions.value = []
  ElMessage.success('已撤销全部权限')
}

// 恢复默认
const handleReset = async () => {
  await loadUserDetail()
  ElMessage.success('已恢复默认配置')
}

// 保存配置
const handleSave = async () => {
  try {
    await updateUserPermissions(route.params.id, {
      permissions: checkedPermissions.value
    })
    ElMessage.success('权限配置保存成功')
    router.back()
  } catch (error) {
    console.error('保存失败:', error)
    ElMessage.error('保存失败')
  }
}

// 返回
const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadUserDetail()
})
</script>

<style lang="scss" scoped>
.permission-config-container {
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

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .user-info-card {
    .user-summary {
      display: flex;
      align-items: center;
      margin-bottom: 16px;

      .user-text {
        margin-left: 16px;

        .username {
          font-size: 18px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 8px;
        }
      }
    }
  }

  .tree-node {
    display: flex;
    align-items: center;
    
    .el-icon {
      margin-right: 8px;
    }
  }
}
</style>
