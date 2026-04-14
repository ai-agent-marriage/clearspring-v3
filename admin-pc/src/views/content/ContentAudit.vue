<template>
  <div class="content-audit">
    <!-- 页面标题 -->
    <div class="page-header">
      <h2>内容安全审核</h2>
      <el-badge :value="stats.pendingCount" :hidden="stats.pendingCount === 0" class="pending-badge">
        <el-button type="primary" icon="Refresh" @click="loadData">刷新</el-button>
      </el-badge>
    </div>

    <!-- 筛选条件 -->
    <el-card class="filter-card" shadow="hover">
      <el-form :inline="true" :model="filterForm" class="filter-form">
        <el-form-item label="审核状态">
          <el-select v-model="filterForm.manual_audit_status" placeholder="全部" clearable>
            <el-option label="待审核" value="pending" />
            <el-option label="已通过" value="passed" />
            <el-option label="已驳回" value="rejected" />
          </el-select>
        </el-form-item>

        <el-form-item label="自动审核">
          <el-select v-model="filterForm.auto_audit_result" placeholder="全部" clearable>
            <el-option label="通过" value="pass" />
            <el-option label="拦截" value="block" />
            <el-option label="待审" value="review" />
          </el-select>
        </el-form-item>

        <el-form-item label="内容类型">
          <el-select v-model="filterForm.type" placeholder="全部" clearable>
            <el-option label="文本" :value="1" />
            <el-option label="图片" :value="2" />
            <el-option label="视频" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item label="业务类型">
          <el-select v-model="filterForm.business_type" placeholder="全部" clearable>
            <el-option label="订单" value="order" />
            <el-option label="证据" value="evidence" />
            <el-option label="反馈" value="feedback" />
            <el-option label="评论" value="comment" />
          </el-select>
        </el-form-item>

        <el-form-item label="风险等级">
          <el-select v-model="filterForm.risk_level" placeholder="全部" clearable>
            <el-option label="正常" value="normal" />
            <el-option label="中风险" value="medium" />
            <el-option label="高风险" value="high" />
            <el-option label="严重" value="critical" />
          </el-select>
        </el-form-item>

        <el-form-item label="时间范围">
          <el-date-picker
            v-model="dateRange"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleFilter">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 审核列表 -->
    <el-card class="table-card" shadow="hover">
      <el-table
        :data="auditList"
        v-loading="loading"
        style="width: 100%"
        border
        stripe
      >
        <el-table-column prop="id" label="ID" width="80" />
        
        <el-table-column label="内容类型" width="80">
          <template #default="{ row }">
            <el-tag :type="getTypeTag(row.type)" size="small">
              {{ row.typeName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="内容预览" min-width="200">
          <template #default="{ row }">
            <div v-if="row.type === 1" class="text-preview">
              {{ row.content?.substring(0, 50) || '-' }}
              <el-tooltip v-if="row.content?.length > 50" :content="row.content" placement="top">
                <el-icon><ZoomIn /></el-icon>
              </el-tooltip>
            </div>
            <div v-else-if="row.type === 2" class="image-preview">
              <el-image
                v-if="row.file_url"
                :src="row.file_url"
                :preview-src-list="[row.file_url]"
                fit="cover"
                style="width: 60px; height: 60px"
              />
              <span v-else>-</span>
            </div>
            <div v-else-if="row.type === 3" class="video-preview">
              <el-tag type="warning" size="small">视频</el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="business_type" label="业务类型" width="100" />
        
        <el-table-column prop="business_id" label="业务 ID" width="150" />

        <el-table-column label="自动审核" width="100">
          <template #default="{ row }">
            <el-tag :type="getAutoAuditTag(row.auto_audit_result)" size="small">
              {{ row.autoAuditResultName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="人工审核" width="100">
          <template #default="{ row }">
            <el-tag :type="getManualAuditTag(row.manual_audit_status)" size="small">
              {{ row.manualAuditStatusName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="风险等级" width="90">
          <template #default="{ row }">
            <el-tag :type="getRiskTag(row.risk_level)" size="small">
              {{ row.riskLevelName }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="violation_type" label="违规类型" width="100" />

        <el-table-column prop="create_time" label="提交时间" width="160" />

        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.manual_audit_status === 'pending'"
              type="success"
              size="small"
              @click="handleAudit(row, 'pass')"
            >
              通过
            </el-button>
            <el-button
              v-if="row.manual_audit_status === 'pending'"
              type="danger"
              size="small"
              @click="handleAudit(row, 'reject')"
            >
              驳回
            </el-button>
            <el-button
              type="primary"
              size="small"
              @click="handleViewDetail(row)"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="loadData"
        @current-change="loadData"
        class="pagination"
      />
    </el-card>

    <!-- 审核详情对话框 -->
    <el-dialog
      v-model="detailVisible"
      title="审核详情"
      width="600px"
    >
      <el-descriptions :column="1" border v-if="currentDetail">
        <el-descriptions-item label="ID">{{ currentDetail.id }}</el-descriptions-item>
        <el-descriptions-item label="内容类型">{{ currentDetail.typeName }}</el-descriptions-item>
        <el-descriptions-item label="业务类型">{{ currentDetail.business_type }}</el-descriptions-item>
        <el-descriptions-item label="业务 ID">{{ currentDetail.business_id }}</el-descriptions-item>
        <el-descriptions-item label="用户 OpenID">{{ currentDetail.user_openid }}</el-descriptions-item>
        <el-descriptions-item label="自动审核结果">
          <el-tag :type="getAutoAuditTag(currentDetail.auto_audit_result)">
            {{ currentDetail.autoAuditResultName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="人工审核状态">
          <el-tag :type="getManualAuditTag(currentDetail.manual_audit_status)">
            {{ currentDetail.manualAuditStatusName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="风险等级">
          <el-tag :type="getRiskTag(currentDetail.risk_level)">
            {{ currentDetail.riskLevelName }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="违规类型">{{ currentDetail.violation_type || '-' }}</el-descriptions-item>
        <el-descriptions-item label="提交时间">{{ currentDetail.create_time }}</el-descriptions-item>
        <el-descriptions-item label="审核时间">{{ currentDetail.audit_time || '-' }}</el-descriptions-item>
        <el-descriptions-item label="审核员">{{ currentDetail.auditor_openid || '-' }}</el-descriptions-item>
        <el-descriptions-item label="驳回原因">{{ currentDetail.reject_reason || '-' }}</el-descriptions-item>
        <el-descriptions-item label="内容">
          <div v-if="currentDetail.type === 1" class="detail-content">
            {{ currentDetail.content || '-' }}
          </div>
          <div v-else-if="currentDetail.type === 2" class="detail-content">
            <el-image
              v-if="currentDetail.file_url"
              :src="currentDetail.file_url"
              fit="contain"
              style="max-width: 100%; max-height: 300px"
            />
          </div>
          <div v-else-if="currentDetail.type === 3" class="detail-content">
            <video v-if="currentDetail.file_url" :src="currentDetail.file_url" controls style="max-width: 100%" />
          </div>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 驳回原因对话框 -->
    <el-dialog
      v-model="rejectVisible"
      title="填写驳回原因"
      width="400px"
    >
      <el-input
        v-model="rejectReason"
        type="textarea"
        :rows="4"
        placeholder="请输入驳回原因（必填）"
        maxlength="255"
        show-word-limit
      />
      <template #footer>
        <el-button @click="rejectVisible = false">取消</el-button>
        <el-button type="danger" @click="confirmReject" :disabled="!rejectReason.trim">
          确认驳回
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { ZoomIn, Refresh } from '@element-plus/icons-vue';
import request from '@/api/request';

// 加载状态
const loading = ref(false);

// 统计数据
const stats = reactive({
  pendingCount: 0
});

// 筛选表单
const filterForm = reactive({
  manual_audit_status: '',
  auto_audit_result: '',
  type: '',
  business_type: '',
  risk_level: ''
});

// 日期范围
const dateRange = ref([]);

// 列表数据
const auditList = ref([]);

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0
});

// 详情对话框
const detailVisible = ref(false);
const currentDetail = ref(null);

// 驳回对话框
const rejectVisible = ref(false);
const rejectReason = ref('');
const currentAuditId = ref(null);

// 获取类型标签
const getTypeTag = (type) => {
  const map = { 1: '', 2: 'success', 3: 'warning' };
  return map[type] || '';
};

// 获取自动审核标签
const getAutoAuditTag = (result) => {
  const map = { pass: 'success', block: 'danger', review: 'warning' };
  return map[result] || '';
};

// 获取人工审核标签
const getManualAuditTag = (status) => {
  const map = { pending: 'warning', passed: 'success', rejected: 'danger' };
  return map[status] || '';
};

// 获取风险等级标签
const getRiskTag = (level) => {
  const map = { normal: '', medium: 'warning', high: 'danger', critical: 'danger' };
  return map[level] || '';
};

// 加载数据
const loadData = async () => {
  loading.value = true;
  
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filterForm
    };
    
    if (dateRange.value && dateRange.value.length === 2) {
      params.start_time = dateRange.value[0];
      params.end_time = dateRange.value[1];
    }
    
    const result = await request({
      name: 'getAuditList',
      data: params
    });
    
    if (result.success) {
      auditList.value = result.data.list;
      pagination.total = result.data.pagination.total;
      pagination.totalPages = result.data.pagination.totalPages;
      stats.pendingCount = result.data.stats.pendingCount;
    } else {
      ElMessage.error(result.message || '加载失败');
    }
  } catch (error) {
    console.error('加载审核列表失败:', error);
    ElMessage.error('加载失败，请稍后重试');
  } finally {
    loading.value = false;
  }
};

// 筛选
const handleFilter = () => {
  pagination.page = 1;
  loadData();
};

// 重置
const handleReset = () => {
  filterForm.manual_audit_status = '';
  filterForm.auto_audit_result = '';
  filterForm.type = '';
  filterForm.business_type = '';
  filterForm.risk_level = '';
  dateRange.value = [];
  pagination.page = 1;
  loadData();
};

// 查看详情
const handleViewDetail = (row) => {
  currentDetail.value = row;
  detailVisible.value = true;
};

// 审核操作
const handleAudit = (row, action) => {
  if (action === 'reject') {
    currentAuditId.value = row.id;
    rejectReason.value = '';
    rejectVisible.value = true;
  } else {
    confirmAudit(row.id, 'pass', '');
  }
};

// 确认审核
const confirmAudit = async (auditId, action, reason) => {
  try {
    const result = await request({
      name: 'auditContent',
      data: {
        audit_id: auditId,
        action,
        reason
      }
    });
    
    if (result.success) {
      ElMessage.success(action === 'pass' ? '审核通过' : '已驳回');
      loadData();
    } else {
      ElMessage.error(result.message || '操作失败');
    }
  } catch (error) {
    console.error('审核操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  }
};

// 确认驳回
const confirmReject = () => {
  if (!rejectReason.value.trim) {
    ElMessage.warning('请填写驳回原因');
    return;
  }
  
  confirmAudit(currentAuditId.value, 'reject', rejectReason.value.trim);
  rejectVisible.value = false;
};

// 生命周期
onMounted(() => {
  loadData();
});
</script>

<style scoped lang="scss">
.content-audit {
  padding: 20px;

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;

    h2 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }

    .pending-badge {
      .el-button {
        margin-left: 10px;
      }
    }
  }

  .filter-card {
    margin-bottom: 20px;

    .filter-form {
      .el-form-item {
        margin-bottom: 10px;
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

  .text-preview {
    display: flex;
    align-items: center;
    gap: 5px;
    color: #666;
    font-size: 13px;
  }

  .image-preview,
  .video-preview {
    display: flex;
    align-items: center;
  }

  .detail-content {
    max-width: 100%;
    word-break: break-all;
  }
}
</style>
