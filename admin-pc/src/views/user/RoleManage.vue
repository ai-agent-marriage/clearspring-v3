<template>
  <div class="role-manage-container">
    <div class="page-header">
      <div class="header-left">
        <el-button type="info" circle @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h2 class="page-title">用户角色管理</h2>
          <p class="page-description">管理用户角色和角色分配</p>
        </div>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleCreateRole">
          <el-icon><Plus /></el-icon>
          新建角色
        </el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：角色列表 -->
      <el-col :span="10">
        <el-card shadow="hover" class="role-list-card">
          <template #header>
            <div class="card-header">
              <span>角色列表</span>
              <el-input
                v-model="roleSearch"
                placeholder="搜索角色"
                prefix-icon="Search"
                clearable
                style="width: 180px"
              />
            </div>
          </template>
          <el-table
            v-loading="loading"
            :data="filteredRoleList"
            highlight-current-row
            @current-change="handleRoleSelect"
          >
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="userCount" label="用户数" width="80" align="center" />
            <el-table-column label="操作" width="120" align="center">
              <template #default="{ row }">
                <el-button type="primary" link @click.stop="handleEditRole(row)">
                  编辑
                </el-button>
                <el-button
                  v-if="!row.isSystem"
                  type="danger"
                  link
                  @click.stop="handleDeleteRole(row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>

        <!-- 角色用户列表 -->
        <el-card shadow="hover" class="role-users-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>角色用户（{{ currentRole?.name || '-' }}）</span>
            </div>
          </template>
          <el-table :data="roleUsers" style="width: 100%">
            <el-table-column prop="username" label="用户名" />
            <el-table-column prop="phone" label="手机号" width="120" />
            <el-table-column label="操作" width="80" align="center">
              <template #default="{ row }">
                <el-button type="danger" link @click="handleRemoveUser(row)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 右侧：角色权限配置 -->
      <el-col :span="14">
        <el-card shadow="hover" class="permission-card">
          <template #header>
            <div class="card-header">
              <span>权限配置（{{ currentRole?.name || '请选择角色' }}）</span>
              <el-button
                type="primary"
                :disabled="!currentRole"
                @click="handleSavePermission"
              >
                <el-icon><Check /></el-icon>
                保存权限
              </el-button>
            </div>
          </template>

          <div v-if="currentRole" class="permission-content">
            <!-- 模块权限 -->
            <div class="permission-section" v-for="module in permissionModules" :key="module.name">
              <div class="module-header">
                <el-checkbox
                  v-model="module.checked"
                  :indeterminate="module.indeterminate"
                  @change="handleModuleCheck(module)"
                >
                  {{ module.label }}
                </el-checkbox>
              </div>
              <div class="permission-items">
                <el-checkbox-group v-model="currentRole.permissions">
                  <el-checkbox
                    v-for="perm in module.permissions"
                    :key="perm.value"
                    :label="perm.value"
                  >
                    {{ perm.label }}
                  </el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>

          <el-empty v-else description="请从左侧选择角色" />
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建/编辑角色对话框 -->
    <el-dialog
      v-model="roleDialogVisible"
      :title="roleDialogMode === 'create' ? '新建角色' : '编辑角色'"
      width="500px"
    >
      <el-form
        ref="roleFormRef"
        :model="roleFormData"
        :rules="roleFormRules"
        label-width="100px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleFormData.name" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <el-form-item label="是否系统角色">
          <el-switch v-model="roleFormData.isSystem" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="roleDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleRoleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  ArrowLeft,
  Plus,
  Search,
  Check
} from '@element-plus/icons-vue'
import { getRoleList, createRole, updateRole, deleteRole, getRoleUsers, removeUserFromRole } from '@/api/role'

const router = useRouter()

// 加载状态
const loading = ref(false)

// 角色搜索
const roleSearch = ref('')

// 角色列表
const roleList = ref([])

// 当前选中的角色
const currentRole = ref(null)

// 角色用户列表
const roleUsers = ref([])

// 角色对话框
const roleDialogVisible = ref(false)
const roleDialogMode = ref('create')
const roleFormRef = ref(null)
const roleFormData = reactive({
  id: '',
  name: '',
  description: '',
  isSystem: false
})

// 角色表单验证规则
const roleFormRules = {
  name: [
    { required: true, message: '请输入角色名称', trigger: 'blur' }
  ]
}

// 权限模块配置
const permissionModules = reactive([
  {
    name: 'user',
    label: '用户管理',
    checked: false,
    indeterminate: false,
    permissions: [
      { value: 'user:view', label: '查看用户' },
      { value: 'user:create', label: '创建用户' },
      { value: 'user:edit', label: '编辑用户' },
      { value: 'user:delete', label: '删除用户' },
      { value: 'user:role', label: '角色管理' }
    ]
  },
  {
    name: 'order',
    label: '订单管理',
    checked: false,
    indeterminate: false,
    permissions: [
      { value: 'order:view', label: '查看订单' },
      { value: 'order:create', label: '创建订单' },
      { value: 'order:edit', label: '编辑订单' },
      { value: 'order:audit', label: '订单审核' },
      { value: 'order:delete', label: '删除订单' }
    ]
  },
  {
    name: 'content',
    label: '内容管理',
    checked: false,
    indeterminate: false,
    permissions: [
      { value: 'content:view', label: '查看内容' },
      { value: 'content:edit', label: '编辑内容' },
      { value: 'content:audit', label: '内容审核' },
      { value: 'content:delete', label: '删除内容' }
    ]
  },
  {
    name: 'finance',
    label: '财务管理',
    checked: false,
    indeterminate: false,
    permissions: [
      { value: 'finance:view', label: '查看财务' },
      { value: 'finance:export', label: '导出报表' },
      { value: 'finance:config', label: '财务配置' }
    ]
  },
  {
    name: 'system',
    label: '系统管理',
    checked: false,
    indeterminate: false,
    permissions: [
      { value: 'system:view', label: '查看系统' },
      { value: 'system:config', label: '系统配置' },
      { value: 'system:log', label: '日志管理' }
    ]
  }
])

// 过滤后的角色列表
const filteredRoleList = computed(() => {
  if (!roleSearch.value) return roleList.value
  return roleList.value.filter(role =>
    role.name.toLowerCase().includes(roleSearch.value.toLowerCase())
  )
})

// 加载角色列表
const loadRoleList = async () => {
  loading.value = true
  try {
    const res = await getRoleList()
    roleList.value = res.data || []
  } catch (error) {
    console.error('加载角色列表失败:', error)
    ElMessage.error('加载角色列表失败')
  } finally {
    loading.value = false
  }
}

// 选择角色
const handleRoleSelect = async (role) => {
  currentRole.value = role ? { ...role, permissions: [...role.permissions] } : null
  if (role) {
    await loadRoleUsers(role.id)
    updateModuleCheckState()
  }
}

// 加载角色用户
const loadRoleUsers = async (roleId) => {
  try {
    const res = await getRoleUsers(roleId)
    roleUsers.value = res.data || []
  } catch (error) {
    console.error('加载角色用户失败:', error)
  }
}

// 更新模块勾选状态
const updateModuleCheckState = () => {
  if (!currentRole.value) return

  permissionModules.forEach(module => {
    const modulePerms = module.permissions.map(p => p.value)
    const checkedCount = modulePerms.filter(p =>
      currentRole.value.permissions.includes(p)
    ).length

    module.checked = checkedCount === modulePerms.length
    module.indeterminate = checkedCount > 0 && checkedCount < modulePerms.length
  })
}

// 模块勾选
const handleModuleCheck = (module) => {
  if (!currentRole.value) return

  const modulePerms = module.permissions.map(p => p.value)

  if (module.checked) {
    // 全选
    modulePerms.forEach(perm => {
      if (!currentRole.value.permissions.includes(perm)) {
        currentRole.value.permissions.push(perm)
      }
    })
  } else {
    // 全不选
    currentRole.value.permissions = currentRole.value.permissions.filter(
      p => !modulePerms.includes(p)
    )
  }

  module.indeterminate = false
}

// 新建角色
const handleCreateRole = () => {
  roleDialogMode.value = 'create'
  Object.assign(roleFormData, {
    id: '',
    name: '',
    description: '',
    isSystem: false
  })
  roleDialogVisible.value = true
}

// 编辑角色
const handleEditRole = (role) => {
  roleDialogMode.value = 'edit'
  Object.assign(roleFormData, role)
  roleDialogVisible.value = true
}

// 删除角色
const handleDeleteRole = async (role) => {
  try {
    await ElMessageBox.confirm(`确定要删除角色"${role.name}"吗？`, '警告', {
      type: 'warning'
    })
    await deleteRole(role.id)
    ElMessage.success('删除成功')
    loadRoleList()
    if (currentRole.value?.id === role.id) {
      currentRole.value = null
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交角色
const handleRoleSubmit = async () => {
  if (!roleFormRef.value) return

  await roleFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (roleDialogMode.value === 'create') {
        await createRole(roleFormData)
        ElMessage.success('角色创建成功')
      } else {
        await updateRole(roleFormData.id, roleFormData)
        ElMessage.success('角色更新成功')
      }
      roleDialogVisible.value = false
      loadRoleList()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  })
}

// 移除用户
const handleRemoveUser = async (user) => {
  try {
    await ElMessageBox.confirm(`确定要将"${user.username}"从该角色移除吗？`, '提示', {
      type: 'warning'
    })
    await removeUserFromRole(currentRole.value.id, user.id)
    ElMessage.success('移除成功')
    loadRoleUsers(currentRole.value.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除失败:', error)
      ElMessage.error('移除失败')
    }
  }
}

// 保存权限
const handleSavePermission = async () => {
  if (!currentRole.value) return

  try {
    await updateRole(currentRole.value.id, {
      ...currentRole.value,
      permissions: currentRole.value.permissions
    })
    ElMessage.success('权限保存成功')
    loadRoleList()
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
  loadRoleList()
})
</script>

<style lang="scss" scoped>
.role-manage-container {
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

  .permission-content {
    .permission-section {
      margin-bottom: 20px;

      .module-header {
        margin-bottom: 12px;
        font-weight: 600;
      }

      .permission-items {
        margin-left: 24px;

        :deep(.el-checkbox) {
          margin-right: 16px;
          margin-bottom: 8px;
        }
      }
    }
  }
}
</style>
