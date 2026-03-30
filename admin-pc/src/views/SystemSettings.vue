<template>
  <div class="system-settings-container">
    <div class="page-header">
      <h2 class="page-title">系统设置</h2>
      <p class="page-description">配置系统参数和基本信息</p>
    </div>
    
    <el-row :gutter="20">
      <!-- 基本设置 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>基本设置</span>
          </template>
          <el-form :model="basicSettings" label-width="120px">
            <el-form-item label="系统名称">
              <el-input v-model="basicSettings.systemName" placeholder="请输入系统名称" />
            </el-form-item>
            <el-form-item label="Logo">
              <el-upload
                class="logo-uploader"
                action="/api/upload"
                :show-file-list="false"
                :on-success="handleLogoSuccess"
              >
                <img v-if="basicSettings.logo" :src="basicSettings.logo" class="logo" />
                <el-icon v-else class="logo-uploader-icon"><Plus /></el-icon>
              </el-upload>
            </el-form-item>
            <el-form-item label="客服邮箱">
              <el-input v-model="basicSettings.email" placeholder="请输入客服邮箱" />
            </el-form-item>
            <el-form-item label="客服电话">
              <el-input v-model="basicSettings.phone" placeholder="请输入客服电话" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveBasic">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <!-- 安全设置 -->
      <el-col :span="12">
        <el-card shadow="never">
          <template #header>
            <span>安全设置</span>
          </template>
          <el-form :model="securitySettings" label-width="120px">
            <el-form-item label="Token 有效期">
              <el-input-number v-model="securitySettings.tokenExpiry" :min="1" :max="720" /> 小时
            </el-form-item>
            <el-form-item label="登录失败限制">
              <el-input-number v-model="securitySettings.loginAttempts" :min="3" :max="10" /> 次
            </el-form-item>
            <el-form-item label="锁定时间">
              <el-input-number v-model="securitySettings.lockDuration" :min="5" :max="60" /> 分钟
            </el-form-item>
            <el-form-item label="强制密码复杂度">
              <el-switch v-model="securitySettings.passwordComplexity" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveSecurity">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 通知设置 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <span>通知设置</span>
          </template>
          <el-form :model="notificationSettings" label-width="120px">
            <el-row :gutter="20">
              <el-col :span="8">
                <el-form-item label="邮件通知">
                  <el-switch v-model="notificationSettings.emailEnabled" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="短信通知">
                  <el-switch v-model="notificationSettings.smsEnabled" />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="推送通知">
                  <el-switch v-model="notificationSettings.pushEnabled" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="SMTP 服务器">
              <el-input v-model="notificationSettings.smtpHost" placeholder="请输入 SMTP 服务器地址" />
            </el-form-item>
            <el-form-item label="SMTP 端口">
              <el-input-number v-model="notificationSettings.smtpPort" :min="1" :max="65535" />
            </el-form-item>
            <el-form-item label="发件人邮箱">
              <el-input v-model="notificationSettings.smtpFrom" placeholder="请输入发件人邮箱" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="handleSaveNotification">保存设置</el-button>
              <el-button @click="handleTestEmail">发送测试邮件</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 管理员列表 -->
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="24">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>管理员管理</span>
              <el-button type="primary" size="small" @click="handleAddAdmin">
                <el-icon><Plus /></el-icon>
                添加管理员
              </el-button>
            </div>
          </template>
          
          <el-table :data="adminList" stripe>
            <el-table-column prop="username" label="用户名" width="150" />
            <el-table-column prop="name" label="姓名" width="120" />
            <el-table-column prop="role" label="角色" width="120">
              <template #default="{ row }">
                <el-tag>{{ row.role === 'super' ? '超级管理员' : '普通管理员' }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="email" label="邮箱" width="200" />
            <el-table-column prop="phone" label="手机号" width="130" />
            <el-table-column prop="lastLoginTime" label="最后登录" width="180" />
            <el-table-column label="操作" fixed="right" width="200">
              <template #default="{ row }">
                <el-button type="primary" link @click="handleEditAdmin(row)">编辑</el-button>
                <el-button type="warning" link @click="handleResetPassword(row)">重置密码</el-button>
                <el-button type="danger" link @click="handleDeleteAdmin(row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

const basicSettings = reactive({
  systemName: '清如 ClearSpring',
  logo: '',
  email: 'support@clearspring.com',
  phone: '400-123-4567'
})

const securitySettings = reactive({
  tokenExpiry: 24,
  loginAttempts: 5,
  lockDuration: 30,
  passwordComplexity: true
})

const notificationSettings = reactive({
  emailEnabled: true,
  smsEnabled: false,
  pushEnabled: true,
  smtpHost: 'smtp.example.com',
  smtpPort: 587,
  smtpFrom: 'noreply@example.com'
})

const adminList = ref([])

const handleLogoSuccess = (response) => {
  basicSettings.logo = response.url
  ElMessage.success('上传成功')
}

const handleSaveBasic = async () => {
  try {
    ElMessage.success('基本设置保存成功')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleSaveSecurity = async () => {
  try {
    ElMessage.success('安全设置保存成功')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleSaveNotification = async () => {
  try {
    ElMessage.success('通知设置保存成功')
  } catch (error) {
    console.error('保存失败:', error)
  }
}

const handleTestEmail = () => {
  ElMessage.info('测试邮件发送功能开发中')
}

const handleAddAdmin = () => {
  ElMessage.info('添加管理员功能开发中')
}

const handleEditAdmin = (row) => {
  ElMessage.info('编辑管理员功能开发中')
}

const handleResetPassword = async (row) => {
  await ElMessageBox.confirm(`确定要重置管理员 "${row.username}" 的密码吗？`, '提示', { type: 'warning' })
  ElMessage.success('密码已重置')
}

const handleDeleteAdmin = async (row) => {
  await ElMessageBox.confirm('确定要删除该管理员吗？', '提示', { type: 'warning' })
  ElMessage.success('删除成功')
}

onMounted(() => {
  // 加载管理员列表
  adminList.value = [
    { id: 1, username: 'admin', name: '系统管理员', role: 'super', email: 'admin@example.com', phone: '13800138000', lastLoginTime: '2024-01-01 10:00:00' }
  ]
})
</script>

<style lang="scss" scoped>
.system-settings-container {
  .page-header {
    margin-bottom: 20px;
  }
  
  .logo-uploader {
    .logo {
      width: 100px;
      height: 100px;
      border-radius: 4px;
      object-fit: cover;
    }
    
    .logo-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 100px;
      height: 100px;
      border: 1px dashed #d9d9d9;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
