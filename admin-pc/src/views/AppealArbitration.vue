<template>
  <div class="appeal-arbitration-container">
    <div class="page-header">
      <h2 class="page-title">申诉仲裁</h2>
      <p class="page-description">处理用户和执行者的申诉请求</p>
    </div>
    
    <!-- 搜索筛选 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="申诉单号">
          <el-input v-model="searchForm.appealNo" placeholder="请输入申诉单号" clearable />
        </el-form-item>
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待处理" value="pending" />
            <el-option label="处理中" value="processing" />
            <el-option label="已解决" value="resolved" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 申诉列表 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="appealList" stripe>
        <el-table-column prop="appealNo" label="申诉单号" width="160" />
        <el-table-column prop="orderNo" label="关联订单" width="160" />
        <el-table-column prop="applicantName" label="申请人" width="100" />
        <el-table-column prop="type" label="申诉类型" width="120">
          <template #default="{ row }">
            {{ getTypeLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="申诉原因" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleProcess(row)">处理</el-button>
            <el-button type="info" link @click="handleView(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="loadAppealList"
          @current-change="loadAppealList"
        />
      </div>
    </el-card>
    
    <!-- 处理对话框 -->
    <el-dialog v-model="processDialogVisible" title="处理申诉" width="700px">
      <el-descriptions :column="2" border v-if="currentAppeal">
        <el-descriptions-item label="申诉单号">{{ currentAppeal.appealNo }}</el-descriptions-item>
        <el-descriptions-item label="关联订单">{{ currentAppeal.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ currentAppeal.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="申诉类型">{{ getTypeLabel(currentAppeal.type) }}</el-descriptions-item>
        <el-descriptions-item label="申诉原因" :span="2">{{ currentAppeal.reason }}</el-descriptions-item>
        <el-descriptions-item label="证据材料" :span="2">
          <el-button type="primary" link>查看证据</el-button>
        </el-descriptions-item>
      </el-descriptions>
      
      <el-divider />
      
      <el-form :model="processForm" label-width="80px">
        <el-form-item label="处理结果" required>
          <el-radio-group v-model="processForm.result">
            <el-radio label="support">支持申诉</el-radio>
            <el-radio label="reject">驳回申诉</el-radio>
            <el-radio label="mediate">调解处理</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="处理意见" required>
          <el-input v-model="processForm.opinion" type="textarea" :rows="4" placeholder="请输入处理意见" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="processDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmProcess">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const appealList = ref([])
const processDialogVisible = ref(false)
const currentAppeal = ref(null)

const searchForm = reactive({
  appealNo: '',
  status: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const processForm = reactive({
  result: '',
  opinion: ''
})

const getTypeLabel = (type) => {
  const map = { service: '服务质量', price: '价格争议', cancel: '取消订单', other: '其他' }
  return map[type] || type
}

const getStatusType = (status) => {
  const map = { pending: 'warning', processing: 'primary', resolved: 'success', closed: 'info' }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = { pending: '待处理', processing: '处理中', resolved: '已解决', closed: '已关闭' }
  return map[status] || status
}

const loadAppealList = async () => {
  loading.value = true
  try {
    // TODO: 调用 API
    appealList.value = [
      { id: 1, appealNo: 'AP20240101001', orderNo: 'ORD20240101001', applicantName: '张三', type: 'service', reason: '服务质量不达标', status: 'pending', createTime: '2024-01-01 10:00:00' }
    ]
    pagination.total = 1
  } catch (error) {
    console.error('加载申诉列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadAppealList()
}

const handleReset = () => {
  searchForm.appealNo = ''
  searchForm.status = ''
  handleSearch()
}

const handleProcess = (row) => {
  currentAppeal.value = row
  processForm.result = ''
  processForm.opinion = ''
  processDialogVisible.value = true
}

const handleView = (row) => {
  ElMessage.info('查看详情功能开发中')
}

const handleConfirmProcess = async () => {
  if (!processForm.result) {
    ElMessage.warning('请选择处理结果')
    return
  }
  if (!processForm.opinion) {
    ElMessage.warning('请输入处理意见')
    return
  }
  
  try {
    // TODO: 调用 API
    ElMessage.success('处理成功')
    processDialogVisible.value = false
    loadAppealList()
  } catch (error) {
    console.error('处理申诉失败:', error)
  }
}

onMounted(() => {
  loadAppealList()
})
</script>

<style lang="scss" scoped>
.appeal-arbitration-container {
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
