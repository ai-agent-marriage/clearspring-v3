<template>
  <div class="qualification-audit-container">
    <div class="page-header">
      <h2 class="page-title">资质审核</h2>
      <p class="page-description">审核执行者提交的资质材料</p>
    </div>
    
    <!-- 搜索筛选 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="执行者">
          <el-input v-model="searchForm.executorName" placeholder="请输入执行者姓名" clearable />
        </el-form-item>
        <el-form-item label="审核状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item label="资质类型">
          <el-select v-model="searchForm.type" placeholder="请选择类型" clearable>
            <el-option label="身份证" value="id_card" />
            <el-option label="健康证" value="health_cert" />
            <el-option label="技能证书" value="skill_cert" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 审核列表 -->
    <el-card shadow="never">
      <el-table v-loading="loading" :data="auditList" stripe>
        <el-table-column prop="executorName" label="执行者" width="120" />
        <el-table-column prop="type" label="资质类型" width="120">
          <template #default="{ row }">
            {{ getTypeLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="files" label="资质文件" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleViewFile(row)">查看文件</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="submitTime" label="提交时间" width="180" />
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button v-if="row.status === 'pending'" type="success" link @click="handleApprove(row)">通过</el-button>
            <el-button v-if="row.status === 'pending'" type="danger" link @click="handleReject(row)">拒绝</el-button>
            <el-button type="primary" link @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next"
          @size-change="loadAuditList"
          @current-change="loadAuditList"
        />
      </div>
    </el-card>
    
    <!-- 审核对话框 -->
    <el-dialog v-model="auditDialogVisible" :title="auditAction === 'approve' ? '通过审核' : '拒绝审核'" width="500px">
      <el-form :model="auditForm" label-width="80px">
        <el-form-item label="审核意见" required>
          <el-input v-model="auditForm.remark" type="textarea" :rows="4" placeholder="请输入审核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="auditDialogVisible = false">取消</el-button>
        <el-button :type="auditAction === 'approve' ? 'success' : 'danger'" @click="handleConfirmAudit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getQualificationList, auditQualification } from '@/api/qualification'

const loading = ref(false)
const auditList = ref([])
const auditDialogVisible = ref(false)
const auditAction = ref('approve')
const currentAudit = ref(null)

const searchForm = reactive({
  executorName: '',
  status: '',
  type: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const auditForm = reactive({
  remark: ''
})

const getTypeLabel = (type) => {
  const map = { id_card: '身份证', health_cert: '健康证', skill_cert: '技能证书' }
  return map[type] || type
}

const getStatusType = (status) => {
  const map = { pending: 'warning', approved: 'success', rejected: 'danger' }
  return map[status] || 'info'
}

const getStatusLabel = (status) => {
  const map = { pending: '待审核', approved: '已通过', rejected: '已拒绝' }
  return map[status] || status
}

const loadAuditList = async () => {
  loading.value = true
  try {
    const res = await getQualificationList({
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...searchForm
    })
    auditList.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('加载审核列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadAuditList()
}

const handleReset = () => {
  searchForm.executorName = ''
  searchForm.status = ''
  searchForm.type = ''
  handleSearch()
}

const handleViewFile = (row) => {
  ElMessage.info('查看文件功能开发中')
}

const handleApprove = (row) => {
  currentAudit.value = row
  auditAction.value = 'approve'
  auditForm.remark = ''
  auditDialogVisible.value = true
}

const handleReject = (row) => {
  currentAudit.value = row
  auditAction.value = 'reject'
  auditForm.remark = ''
  auditDialogVisible.value = true
}

const handleDetail = (row) => {
  ElMessage.info('查看详情功能开发中')
}

const handleConfirmAudit = async () => {
  if (!auditForm.remark) {
    ElMessage.warning('请输入审核意见')
    return
  }
  
  try {
    await auditQualification(currentAudit.value.id, {
      status: auditAction.value === 'approve' ? 'approved' : 'rejected',
      remark: auditForm.remark
    })
    ElMessage.success('审核成功')
    auditDialogVisible.value = false
    loadAuditList()
  } catch (error) {
    console.error('审核失败:', error)
  }
}

onMounted(() => {
  loadAuditList()
})
</script>

<style lang="scss" scoped>
.qualification-audit-container {
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
