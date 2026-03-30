<template>
  <div class="profit-sharing-container">
    <div class="page-header">
      <h2 class="page-title">分账配置</h2>
      <p class="page-description">配置订单分账规则和比例</p>
    </div>
    
    <!-- 配置列表 -->
    <el-card shadow="never">
      <div class="table-header">
        <el-button type="primary" @click="handleAdd">
          <el-icon><Plus /></el-icon>
          新增配置
        </el-button>
      </div>
      
      <el-table v-loading="loading" :data="configList" stripe>
        <el-table-column prop="name" label="配置名称" width="200" />
        <el-table-column prop="type" label="适用类型" width="150">
          <template #default="{ row }">
            {{ getTypeLabel(row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="platformRate" label="平台比例" width="120" align="center">
          <template #default="{ row }">
            {{ row.platformRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="executorRate" label="执行者比例" width="120" align="center">
          <template #default="{ row }">
            {{ row.executorRate }}%
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100" align="center">
          <template #default="{ row }">
            <el-tag :type="row.enabled ? 'success' : 'info'">
              {{ row.enabled ? '启用' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="180" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link @click="handleToggle(row)">
              {{ row.enabled ? '禁用' : '启用' }}
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
          @size-change="loadConfigList"
          @current-change="loadConfigList"
        />
      </div>
    </el-card>
    
    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px">
        <el-form-item label="配置名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入配置名称" />
        </el-form-item>
        <el-form-item label="适用类型" prop="type">
          <el-select v-model="form.type" placeholder="请选择适用类型" style="width: 100%">
            <el-option label="全部类型" value="all" />
            <el-option label="家政服务" value="housekeeping" />
            <el-option label="维修服务" value="repair" />
            <el-option label="搬家服务" value="moving" />
          </el-select>
        </el-form-item>
        <el-form-item label="平台分账比例" prop="platformRate">
          <el-input-number v-model="form.platformRate" :min="0" :max="100" :precision="2" /> %
        </el-form-item>
        <el-form-item label="执行者分账比例" prop="executorRate">
          <el-input-number v-model="form.executorRate" :min="0" :max="100" :precision="2" /> %
        </el-form-item>
        <el-form-item label="备注说明">
          <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注说明" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const loading = ref(false)
const configList = ref([])
const dialogVisible = ref(false)
const dialogTitle = ref('新增配置')
const formRef = ref(null)

const searchForm = reactive({
  type: ''
})

const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0
})

const form = reactive({
  id: null,
  name: '',
  type: '',
  platformRate: 20,
  executorRate: 80,
  remark: ''
})

const rules = {
  name: [{ required: true, message: '请输入配置名称', trigger: 'blur' }],
  type: [{ required: true, message: '请选择适用类型', trigger: 'change' }],
  platformRate: [{ required: true, message: '请输入平台分账比例', trigger: 'blur' }],
  executorRate: [{ required: true, message: '请输入执行者分账比例', trigger: 'blur' }]
}

const getTypeLabel = (type) => {
  const map = { all: '全部类型', housekeeping: '家政服务', repair: '维修服务', moving: '搬家服务' }
  return map[type] || type
}

const loadConfigList = async () => {
  loading.value = true
  try {
    // TODO: 调用 API
    configList.value = [
      { id: 1, name: '默认分账配置', type: 'all', platformRate: 20, executorRate: 80, enabled: true, updateTime: '2024-01-01 10:00:00' }
    ]
    pagination.total = 1
  } catch (error) {
    console.error('加载配置列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  dialogTitle.value = '新增配置'
  Object.assign(form, { id: null, name: '', type: '', platformRate: 20, executorRate: 80, remark: '' })
  dialogVisible.value = true
}

const handleEdit = (row) => {
  dialogTitle.value = '编辑配置'
  Object.assign(form, { ...row })
  dialogVisible.value = true
}

const handleToggle = async (row) => {
  const action = row.enabled ? '禁用' : '启用'
  await ElMessageBox.confirm(`确定要${action}该配置吗？`, '提示')
  ElMessage.success(`${action}成功`)
  loadConfigList()
}

const handleDelete = async (row) => {
  await ElMessageBox.confirm('确定要删除该配置吗？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
  loadConfigList()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    // 验证比例总和
    if (form.platformRate + form.executorRate !== 100) {
      ElMessage.warning('平台比例和执行者比例之和必须为 100%')
      return
    }
    
    try {
      ElMessage.success(form.id ? '更新成功' : '创建成功')
      dialogVisible.value = false
      loadConfigList()
    } catch (error) {
      console.error('提交失败:', error)
    }
  })
}

onMounted(() => {
  loadConfigList()
})
</script>

<style lang="scss" scoped>
.profit-sharing-container {
  .page-header {
    margin-bottom: 20px;
  }
  
  .table-header {
    margin-bottom: 16px;
  }
  
  .pagination {
    margin-top: 20px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
