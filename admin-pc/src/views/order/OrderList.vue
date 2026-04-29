<template>
  <div class="order-list-container">
    <div class="page-header">
      <h2 class="page-title">订单管理</h2>
      <p class="page-description">查看和管理所有订单信息</p>
    </div>
    
    <!-- 搜索筛选 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input v-model="searchForm.orderNo" placeholder="请输入订单号" clearable />
        </el-form-item>
        
        <el-form-item label="执行者">
          <el-input v-model="searchForm.executorName" placeholder="请输入执行者姓名" clearable />
        </el-form-item>
        
        <el-form-item label="订单状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="待接单" value="pending" />
            <el-option label="进行中" value="processing" />
            <el-option label="已完成" value="completed" />
            <el-option label="已取消" value="cancelled" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="searchForm.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    
    <!-- 订单列表 -->
    <el-card shadow="never" class="table-card">
      <el-table
        v-loading="loading"
        :data="orderList"
        stripe
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="customerName" label="客户" width="120" />
        <el-table-column prop="executorName" label="执行者" width="120" />
        <el-table-column prop="serviceType" label="服务类型" width="150" />
        <el-table-column prop="amount" label="金额" width="100" align="right">
          <template #default="{ row }">
            ¥{{ row.amount }}
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
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleView(row)">详情</el-button>
            <el-button type="warning" link @click="handleAssign(row)" v-if="row.status === 'pending'">分配</el-button>
            <el-button type="danger" link @click="handleCancel(row)" v-if="row.status === 'pending'">取消</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <!-- 分页 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="loadOrderList"
          @current-change="loadOrderList"
        />
      </div>
    </el-card>
    
    <!-- 订单详情对话框 -->
    <el-dialog v-model="dialogVisible" title="订单详情" width="600px">
      <el-descriptions :column="2" border v-if="currentOrder">
        <el-descriptions-item label="订单号">{{ currentOrder.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="getStatusType(currentOrder.status)">
            {{ getStatusLabel(currentOrder.status) }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="客户">{{ currentOrder.customerName }}</el-descriptions-item>
        <el-descriptions-item label="客户电话">{{ currentOrder.customerPhone }}</el-descriptions-item>
        <el-descriptions-item label="执行者">{{ currentOrder.executorName || '未分配' }}</el-descriptions-item>
        <el-descriptions-item label="执行者电话">{{ currentOrder.executorPhone || '-' }}</el-descriptions-item>
        <el-descriptions-item label="服务类型">{{ currentOrder.serviceType }}</el-descriptions-item>
        <el-descriptions-item label="金额">¥{{ currentOrder.amount }}</el-descriptions-item>
        <el-descriptions-item label="创建时间" :span="2">{{ currentOrder.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注" :span="2">{{ currentOrder.remark || '无' }}</el-descriptions-item>
      </el-descriptions>
      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 分配订单对话框 -->
    <el-dialog v-model="assignDialogVisible" title="分配订单" width="500px">
      <el-form :model="assignForm" label-width="80px">
        <el-form-item label="选择执行者">
          <el-select v-model="assignForm.executorId" placeholder="请选择执行者" style="width: 100%">
            <el-option
              v-for="item in executorList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="assignForm.remark" type="textarea" :rows="3" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="assignDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleConfirmAssign">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Download } from '@element-plus/icons-vue'
import { getOrderList, updateOrderStatus, assignOrder } from '@/api/order'
import { getExecutorList } from '@/api/executor'

const loading = ref(false)
const orderList = ref([])
const executorList = ref([])
const dialogVisible = ref(false)
const assignDialogVisible = ref(false)
const currentOrder = ref(null)

// 搜索表单
const searchForm = reactive({
  orderNo: '',
  executorName: '',
  status: '',
  dateRange: []
})

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

// 分配表单
const assignForm = reactive({
  executorId: '',
  remark: ''
})

// 获取状态标签类型
const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    processing: 'primary',
    completed: 'success',
    cancelled: 'info'
  }
  return map[status] || 'info'
}

// 获取状态标签
const getStatusLabel = (status) => {
  const map = {
    pending: '待接单',
    processing: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || status
}

// 加载订单列表
const loadOrderList = async () => {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      orderNo: searchForm.orderNo,
      executorName: searchForm.executorName,
      status: searchForm.status,
      startDate: searchForm.dateRange?.[0],
      endDate: searchForm.dateRange?.[1]
    }
    
    const res = await getOrderList(params)
    orderList.value = res.data?.list || []
    pagination.total = res.data?.total || 0
  } catch (error) {
    console.error('加载订单列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 加载执行者列表
const loadExecutorList = async () => {
  try {
    const res = await getExecutorList({ status: 'active' })
    executorList.value = res.data?.list || []
  } catch (error) {
    console.error('加载执行者列表失败:', error)
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadOrderList()
}

// 重置
const handleReset = () => {
  searchForm.orderNo = ''
  searchForm.executorName = ''
  searchForm.status = ''
  searchForm.dateRange = []
  handleSearch()
}

// 导出
const handleExport = () => {
  ElMessage.success('导出功能开发中')
}

// 查看详情
const handleView = (row) => {
  currentOrder.value = row
  dialogVisible.value = true
}

// 分配订单
const handleAssign = (row) => {
  currentOrder.value = row
  assignForm.executorId = ''
  assignForm.remark = ''
  assignDialogVisible.value = true
}

// 确认分配
const handleConfirmAssign = async () => {
  if (!assignForm.executorId) {
    ElMessage.warning('请选择执行者')
    return
  }
  
  try {
    await assignOrder(currentOrder.value.id, {
      executorId: assignForm.executorId,
      remark: assignForm.remark
    })
    ElMessage.success('分配成功')
    assignDialogVisible.value = false
    loadOrderList()
  } catch (error) {
    console.error('分配订单失败:', error)
  }
}

// 取消订单
const handleCancel = (row) => {
  ElMessageBox.confirm('确定要取消该订单吗？', '提示', {
    type: 'warning'
  }).then(async () => {
    try {
      await updateOrderStatus(row.id, {
        status: 'cancelled',
        remark: '管理员取消'
      })
      ElMessage.success('取消成功')
      loadOrderList()
    } catch (error) {
      console.error('取消订单失败:', error)
    }
  }).catch(() => {})
}

// 选择变化
const handleSelectionChange = (selection) => {
  // [CLEANED] console.log('选中的订单:', selection)}

onMounted(() => {
  loadOrderList()
  loadExecutorList()
})
</script>

<style lang="scss" scoped>
.order-list-container {
  .page-header {
    margin-bottom: 20px;
    
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
  
  .search-card {
    margin-bottom: 20px;
    
    .search-form {
      .el-form-item {
        margin-bottom: 0;
        margin-right: 16px;
      }
    }
  }
  
  .table-card {
    .pagination {
      margin-top: 20px;
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>
