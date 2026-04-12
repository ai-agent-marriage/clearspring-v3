<template>
  <div class="user-group-container">
    <div class="page-header">
      <div class="header-left">
        <h2 class="page-title">用户分组</h2>
        <p class="page-description">管理用户分组和组成员</p>
      </div>
      <div class="header-right">
        <el-button type="primary" @click="handleCreateGroup">
          <el-icon><Plus /></el-icon>
          新建分组
        </el-button>
      </div>
    </div>

    <el-row :gutter="20">
      <!-- 左侧：分组列表 -->
      <el-col :span="8">
        <el-card shadow="hover" class="group-list-card">
          <template #header>
            <div class="card-header">
              <span>分组列表</span>
              <el-input
                v-model="groupSearch"
                placeholder="搜索分组"
                prefix-icon="Search"
                clearable
                style="width: 180px"
              />
            </div>
          </template>
          <el-tree
            :data="filteredGroupList"
            node-key="id"
            :expand-on-click-node="false"
            @node-click="handleGroupSelect"
          >
            <template #default="{ node, data }">
              <div class="tree-node-content">
                <span class="node-label">
                  <el-icon><Folder /></el-icon>
                  {{ node.label }}
                </span>
                <el-tag size="small" type="info">{{ data.userCount || 0 }}人</el-tag>
                <div class="node-actions">
                  <el-button type="primary" link @click.stop="handleEditGroup(data)">
                    <el-icon><Edit /></el-icon>
                  </el-button>
                  <el-button
                    v-if="!data.isSystem"
                    type="danger"
                    link
                    @click.stop="handleDeleteGroup(data)"
                  >
                    <el-icon><Delete /></el-icon>
                  </el-button>
                </div>
              </div>
            </template>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧：组成员管理 -->
      <el-col :span="16">
        <el-card shadow="hover" class="group-members-card">
          <template #header>
            <div class="card-header">
              <span>组成员（{{ currentGroup?.name || '-' }}）</span>
              <div class="header-actions">
                <el-button type="primary" :disabled="!currentGroup" @click="handleAddMember">
                  <el-icon><Plus /></el-icon>
                  添加成员
                </el-button>
                <el-button :disabled="!currentGroup" @click="handleBatchRemove">
                  <el-icon><Delete /></el-icon>
                  批量移除
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="groupMembers"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="id" label="ID" width="80" align="center" />
            <el-table-column prop="username" label="用户名" min-width="120" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column prop="email" label="邮箱" min-width="180" />
            <el-table-column prop="role" label="角色" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="getRoleTagType(row.role)" size="small">
                  {{ getRoleLabel(row.role) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="joinTime" label="加入时间" width="180" />
            <el-table-column label="操作" width="100" align="center">
              <template #default="{ row }">
                <el-button type="danger" link @click="handleRemoveMember(row)">
                  移除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-empty v-if="!currentGroup" description="请从左侧选择分组" />
        </el-card>

        <!-- 分组统计 -->
        <el-card shadow="hover" class="group-stats-card" style="margin-top: 20px">
          <template #header>
            <div class="card-header">
              <span>分组统计</span>
            </div>
          </template>
          <el-row :gutter="20" v-if="currentGroup">
            <el-col :span="6" class="stat-item">
              <div class="stat-value">{{ currentGroup.userCount || 0 }}</div>
              <div class="stat-label">成员总数</div>
            </el-col>
            <el-col :span="6" class="stat-item">
              <div class="stat-value">{{ activeCount }}</div>
              <div class="stat-label">活跃成员</div>
            </el-col>
            <el-col :span="6" class="stat-item">
              <div class="stat-value">{{ adminCount }}</div>
              <div class="stat-label">管理员</div>
            </el-col>
            <el-col :span="6" class="stat-item">
              <div class="stat-value">{{ thisWeekJoin }}</div>
              <div class="stat-label">本周新增</div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>

    <!-- 新建/编辑分组对话框 -->
    <el-dialog
      v-model="groupDialogVisible"
      :title="groupDialogMode === 'create' ? '新建分组' : '编辑分组'"
      width="500px"
    >
      <el-form
        ref="groupFormRef"
        :model="groupFormData"
        :rules="groupFormRules"
        label-width="100px"
      >
        <el-form-item label="分组名称" prop="name">
          <el-input v-model="groupFormData.name" placeholder="请输入分组名称" />
        </el-form-item>
        <el-form-item label="父级分组" prop="parentId">
          <el-tree-select
            v-model="groupFormData.parentId"
            :data="groupTreeData"
            placeholder="选择父级分组"
            clearable
            check-strictly
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item label="分组描述" prop="description">
          <el-input
            v-model="groupFormData.description"
            type="textarea"
            :rows="3"
            placeholder="请输入分组描述"
          />
        </el-form-item>
        <el-form-item label="是否系统分组">
          <el-switch v-model="groupFormData.isSystem" disabled />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="groupDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleGroupSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 添加成员对话框 -->
    <el-dialog
      v-model="memberDialogVisible"
      title="添加成员"
      width="600px"
    >
      <el-transfer
        v-model="selectedMemberIds"
        :data="availableMembers"
        :titles="['可选用户', '已选用户']"
        filterable
        filter-placeholder="搜索用户"
      />
      <template #footer>
        <el-button @click="memberDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleAddMemberSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Plus,
  Search,
  Folder,
  Edit,
  Delete
} from '@element-plus/icons-vue'
import {
  getGroupList,
  createGroup,
  updateGroup,
  deleteGroup,
  getGroupMembers,
  addGroupMembers,
  removeGroupMember
} from '@/api/group'
import { getUserList } from '@/api/user'

// 加载状态
const loading = ref(false)

// 分组搜索
const groupSearch = ref('')

// 分组列表
const groupList = ref([])

// 当前选中的分组
const currentGroup = ref(null)

// 组成员列表
const groupMembers = ref([])

// 选中的成员
const selectedMembers = ref([])

// 分组对话框
const groupDialogVisible = ref(false)
const groupDialogMode = ref('create')
const groupFormRef = ref(null)
const groupFormData = reactive({
  id: '',
  name: '',
  parentId: '',
  description: '',
  isSystem: false
})

// 成员对话框
const memberDialogVisible = ref(false)
const selectedMemberIds = ref([])
const availableMembers = ref([])

// 分组表单验证规则
const groupFormRules = {
  name: [
    { required: true, message: '请输入分组名称', trigger: 'blur' }
  ]
}

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

// 过滤后的分组列表
const filteredGroupList = computed(() => {
  if (!groupSearch.value) return groupList.value
  return groupList.value.filter(group =>
    group.name.toLowerCase().includes(groupSearch.value.toLowerCase())
  )
})

// 分组树形数据
const groupTreeData = computed(() => {
  return groupList.value.filter(g => g.id !== currentGroup.value?.id)
})

// 统计数据
const activeCount = computed(() => {
  return groupMembers.value.filter(m => m.status === 'active').length
})

const adminCount = computed(() => {
  return groupMembers.value.filter(m => ['super_admin', 'admin'].includes(m.role)).length
})

const thisWeekJoin = computed(() => {
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  return groupMembers.value.filter(m => {
    const joinTime = new Date(m.joinTime)
    return joinTime >= oneWeekAgo
  }).length
})

// 加载分组列表
const loadGroupList = async () => {
  try {
    const res = await getGroupList()
    groupList.value = res.data || []
  } catch (error) {
    console.error('加载分组列表失败:', error)
    ElMessage.error('加载分组列表失败')
  }
}

// 选择分组
const handleGroupSelect = async (group) => {
  currentGroup.value = group
  await loadGroupMembers(group.id)
}

// 加载组成员
const loadGroupMembers = async (groupId) => {
  loading.value = true
  try {
    const res = await getGroupMembers(groupId)
    groupMembers.value = res.data || []
  } catch (error) {
    console.error('加载组成员失败:', error)
  } finally {
    loading.value = false
  }
}

// 选择变化
const handleSelectionChange = (selection) => {
  selectedMembers.value = selection
}

// 新建分组
const handleCreateGroup = () => {
  groupDialogMode.value = 'create'
  Object.assign(groupFormData, {
    id: '',
    name: '',
    parentId: '',
    description: '',
    isSystem: false
  })
  groupDialogVisible.value = true
}

// 编辑分组
const handleEditGroup = (group) => {
  groupDialogMode.value = 'edit'
  Object.assign(groupFormData, group)
  groupDialogVisible.value = true
}

// 删除分组
const handleDeleteGroup = async (group) => {
  try {
    await ElMessageBox.confirm(`确定要删除分组"${group.name}"吗？`, '警告', {
      type: 'warning'
    })
    await deleteGroup(group.id)
    ElMessage.success('删除成功')
    loadGroupList()
    if (currentGroup.value?.id === group.id) {
      currentGroup.value = null
      groupMembers.value = []
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  }
}

// 提交分组
const handleGroupSubmit = async () => {
  if (!groupFormRef.value) return

  await groupFormRef.value.validate(async (valid) => {
    if (!valid) return

    try {
      if (groupDialogMode.value === 'create') {
        await createGroup(groupFormData)
        ElMessage.success('分组创建成功')
      } else {
        await updateGroup(groupFormData.id, groupFormData)
        ElMessage.success('分组更新成功')
      }
      groupDialogVisible.value = false
      loadGroupList()
    } catch (error) {
      console.error('操作失败:', error)
      ElMessage.error('操作失败')
    }
  })
}

// 添加成员
const handleAddMember = async () => {
  try {
    const res = await getUserList({ status: 'active' })
    const allUsers = res.data?.list || []
    const memberIds = groupMembers.value.map(m => m.id)
    availableMembers.value = allUsers
      .filter(u => !memberIds.includes(u.id))
      .map(u => ({
        key: u.id,
        label: `${u.username} (${u.phone || u.email})`
      }))
    selectedMemberIds.value = []
    memberDialogVisible.value = true
  } catch (error) {
    console.error('加载用户失败:', error)
  }
}

// 提交添加成员
const handleAddMemberSubmit = async () => {
  try {
    await addGroupMembers(currentGroup.value.id, selectedMemberIds.value)
    ElMessage.success('添加成功')
    memberDialogVisible.value = false
    loadGroupMembers(currentGroup.value.id)
  } catch (error) {
    console.error('添加失败:', error)
    ElMessage.error('添加失败')
  }
}

// 移除成员
const handleRemoveMember = async (member) => {
  try {
    await ElMessageBox.confirm(`确定要将"${member.username}"从分组移除吗？`, '提示', {
      type: 'warning'
    })
    await removeGroupMember(currentGroup.value.id, member.id)
    ElMessage.success('移除成功')
    loadGroupMembers(currentGroup.value.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除失败:', error)
      ElMessage.error('移除失败')
    }
  }
}

// 批量移除
const handleBatchRemove = async () => {
  if (selectedMembers.value.length === 0) {
    ElMessage.warning('请先选择要移除的成员')
    return
  }

  try {
    await ElMessageBox.confirm(`确定要移除选中的 ${selectedMembers.value.length} 个成员吗？`, '警告', {
      type: 'warning'
    })
    for (const member of selectedMembers.value) {
      await removeGroupMember(currentGroup.value.id, member.id)
    }
    ElMessage.success('移除成功')
    loadGroupMembers(currentGroup.value.id)
  } catch (error) {
    if (error !== 'cancel') {
      console.error('移除失败:', error)      ElMessage.error('移除失败')
    }
  }
}

onMounted(() => {
  loadGroupList()
})
</script>

<style lang="scss" scoped>
.user-group-container {
  .page-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .header-left {
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

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-actions {
      display: flex;
      gap: 8px;
    }
  }

  .tree-node-content {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-right: 8px;

    .node-label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .node-actions {
      display: flex;
      gap: 4px;
    }
  }

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
</style>
