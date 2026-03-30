<template>
  <div class="executor-manage-container">
    <div class="page-header">
      <h2 class="page-title">执行者管理</h2>
      <p class="page-description">管理执行者信息和状态</p>
    </div>
    
    <!-- 搜索筛选 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="searchForm.phone" placeholder="请输入手机号" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="活跃" value="active" />
            <el-option label="禁用" value="disabled" />
            <el-option label="审核中" value="pending" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
          <el-button type="success" @click="handleImport">
            <el-icon><Upload /></el-icon>
            导入
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 执行者列表 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="executorList" stripe>
        <el-table-column prop="name" label="姓名" width="100" />
        <el-table-column prop="phone" label="手机号" width="130" />
        <el-table-column prop="level" label="等级" width="100" align="center">
          <template #default="{ row }">
            <el-tag>{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="completedOrders" label="完成订单" width="100" align="center" />
        <el-table-column prop="rating" label="评分" width="100" align="center">
          <template #default="{ row }">
            {{ row.rating }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="joinTime" label="加入时间" width="180" />
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button type="warning" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" link @click="handleToggleStatus(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="loadExecutorList"
          @current-change="loadExecutorList"
        />
      </div>
    </el-card>
    
    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="执行者详情" width="700px">
      <el-descriptions :column="2" border v-if="currentExecutor">
        <el-descriptions-item label="姓名">{{ currentExecutor.name }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentExecutor.phone }}</el-descriptions-item>
        <el-descriptions-item label="等级">{{ currentExecutor.level }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentExecutor.status)">
            {{ getStatusLabel(currentExecutor.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="完成订单">{{ currentExecutor.completedOrders }}</el-descriptions-item>
        <el-descriptions-item label="评分">{{ currentExecutor.rating }}</el-descriptions-item>
        <el-descriptions-item label="加入时间" :span="2">{{ currentExecutor.joinTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentExecutor.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="detailDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Upload } from '@element-plus/icons-vue'
import { getExecutorList, updateExecutorStatus } from '@/api/executor'

const loading = ref(false)
const executorList = ref([])
const detailDialogVisible = ref(false)
const currentExecutor = ref(null)

const searchForm = reactive({
  name: '',
  phone: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const getStatusType = (status) => {
  const map = { active: 'success', disabled: 'danger', pending: 'warning' }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = { active: '活跃', disabled: '禁用', pending: '审核中' }
  return map[status] || status
}

const loadExecutorList = async () => {
  loading.value = true
  try {
    const res = await getExecutorList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    executorList.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('加载执行者列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadExecutorList()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.phone = ''
  searchForm.status = ''
  handleSearch()
}

const handleImport = () => {
  ElMessage.info('导入功能开发中')
}

const handleView = (row) => {
  currentExecutor.value = row
  detailDialogVisible.value = true
}

const handleEdit = (row) => {
  ElMessage.info('编辑功能开发中')
}

const handleToggleStatus = async (row) => {
  const action = row.status === 'active' ? '禁用' : '启用'
  await ElMessageBox.confirm(`确定要${action}该执行者吗？`, '提示')
  
  try {
    await updateExecutorStatus(row.id, {
      status: row.status === 'active' ? 'disabled' : 'active',
      remark: `${action}操作`
    })
    ElMessage.success(`${action}成功`)
    loadExecutorList()
  } catch (error) {
    console.error('更新状态失败:', error)
  }
}

onMounted(() => {
  loadExecutorList()
})
</script>

<style lang="scss" scoped>
.executor-manage-container {
  .page-header {
    margin-bottom: 20px;
  }
  
  .search-card {
    margin-bottom: 20px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
