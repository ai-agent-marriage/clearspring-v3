<template>
  <div class="data-export-container">
    <div class="page-header">
      <h2 class="page-title">数据导出</h2>
      <p class="page-description">导出订单、执行者等数据</p>
    </div>
    
    <!-- 创建导出任务 -->
    <el-card shadow="never" class="create-card">
      <template #header>
        <span>创建导出任务</span>
      </template>
      <el-form :model="exportForm" label-width="120px">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="导出类型">
              <el-select v-model="exportForm.type" placeholder="请选择导出类型" style="width: 100%">
                <el-option label="订单数据" value="orders" />
                <el-option label="执行者数据" value="executors" />
                <el-option label="资质审核数据" value="qualifications" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="导出格式">
              <el-select v-model="exportForm.format" placeholder="请选择格式" style="width: 100%">
                <el-option label="Excel (.xlsx)" value="xlsx" />
                <el-option label="CSV (.csv)" value="csv" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="时间范围">
              <el-date-picker
                v-model="exportForm.dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="handleCreateExport">
            <el-icon><Download /></el-icon>
            创建导出任务
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 导出任务列表 -->
    <el-card shadow="never" class="task-card">
      <template #header>
        <span>导出任务记录</span>
      </template>
      
      <el-table v-loading="loading" :data="taskList" stripe>
        <el-table-column prop="taskNo" label="任务编号" width="180" />
        <el-table-column prop="type" label="导出类型" width="120">
          <template #default="{ row }">
            {{ getTypeLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="format" label="格式" width="80" align="center">
          <template #default="{ row }">
            {{ row.format.toUpperCase() }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column prop="completeTime" label="完成时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'completed'"
              type="success"
              link
              @click="handleDownload(row)"
            >
              下载
            </el-button>
            <el-button
              v-if="row.status === 'pending' || row.status === 'processing'"
              type="warning"
              link
              @click="handleCancel(row)"
            >
              取消
            </el-button>
            <el-button type="danger" link @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="loadTaskList"
          @current-change="loadTaskList"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Download } from '@element-plus/icons-vue'
import { getExportTasks, createExportTask, downloadExportFile, cancelExportTask, deleteExportTask } from '@/api/export'

const loading = ref(false)
const taskList = ref([])

const exportForm = reactive({
  type: 'orders',
  format: 'xlsx',
  dateRange: []
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const getTypeLabel = (type) => {
  const map = { orders: '订单数据', executors: '执行者数据', qualifications: '资质审核数据' }
  return map[type] || type
}

const getStatusType = (status) => {
  const map = { pending: 'warning', processing: 'primary', completed: 'success', failed: 'danger', cancelled: 'info' }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = { pending: '等待中', processing: '处理中', completed: '已完成', failed: '失败', cancelled: '已取消' }
  return map[status] || status
}

const loadTaskList = async () => {
  loading.value = true
  try {
    const res = await getExportTasks({
      page: pagination.page,
      pageSize: pagination.pageSize
    })
    taskList.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('加载任务列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleCreateExport = async () => {
  if (!exportForm.dateRange || exportForm.dateRange.length !== 2) {
    ElMessage.warning('请选择时间范围')
    return
  }
  
  try {
    await createExportTask({
      type: exportForm.type,
      format: exportForm.format,
      startDate: exportForm.dateRange[0],
      endDate: exportForm.dateRange[1]
    })
    ElMessage.success('导出任务创建成功')
    loadTaskList()
  } catch (error) {
    console.error('创建导出任务失败:', error)
  }
}

const handleDownload = async (row) => {
  try {
    const blob = await downloadExportFile(row.id)
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${row.taskNo}.${row.format}`
    link.click()
    window.URL.revokeObjectURL(url)
    ElMessage.success('下载成功')
  } catch (error) {
    console.error('下载失败:', error)
  }
}

const handleCancel = async (row) => {
  await ElMessageBox.confirm('确定要取消该导出任务吗？', '提示')
  try {
    await cancelExportTask(row.id)
    ElMessage.success('取消成功')
    loadTaskList()
  } catch (error) {
    console.error('取消任务失败:', error)
  }
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除该导出记录吗？', '提示', { type: 'warning' })
  try {
    await deleteExportTask(row.id)
    ElMessage.success('删除成功')
    loadTaskList()
  } catch (error) {
    console.error('删除任务失败:', error)
  }
}

onMounted(() => {
  loadTaskList()
})
</script>

<style lang="scss" scoped>
.data-export-container {
  .page-header {
    margin-bottom: 20px;
  }
  
  .create-card {
    margin-bottom: 20px;
  }
  
  .task-card {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
