<template>
  <div class="edit-user-container">
    <div class="page-header">
      <div class="header-left">
        <el-button type="info" circle @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h2 class="page-title">编辑用户</h2>
          <p class="page-description">修改用户信息</p>
        </div>
      </div>
    </div>

    <el-card shadow="hover" class="form-card" v-loading="loading">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        style="max-width: 600px"
      >
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="用户 ID">
          <el-input v-model="formData.id" disabled />
        </el-form-item>

        <el-form-item label="用户名">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="新密码">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="留空则不修改密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="手机号">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱">
          <el-input
            v-model="formData.email"
            placeholder="请输入邮箱地址"
          />
        </el-form-item>

        <el-divider content-position="left">角色权限</el-divider>

        <el-form-item label="角色" prop="role">
          <el-select v-model="formData.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="超级管理员" value="super_admin" />
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="active">启用</el-radio>
            <el-radio label="disabled">禁用</el-radio>
            <el-radio label="pending">待审核</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-divider content-position="left">扩展信息</el-divider>

        <el-form-item label="昵称">
          <el-input
            v-model="formData.nickname"
            placeholder="请输入昵称"
          />
        </el-form-item>

        <el-form-item label="性别">
          <el-radio-group v-model="formData.gender">
            <el-radio label="male">男</el-radio>
            <el-radio label="female">女</el-radio>
            <el-radio label="unknown">未知</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="生日">
          <el-date-picker
            v-model="formData.birthday"
            type="date"
            placeholder="选择生日"
            style="width: 100%"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <el-form-item label="地区">
          <el-cascader
            v-model="formData.region"
            :options="regionOptions"
            placeholder="选择地区"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item label="部门">
          <el-input
            v-model="formData.department"
            placeholder="请输入部门"
          />
        </el-form-item>

        <el-form-item label="职位">
          <el-input
            v-model="formData.position"
            placeholder="请输入职位"
          />
        </el-form-item>

        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            placeholder="请输入备注信息"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="handleSubmit">
            <el-icon><Check /></el-icon>
            保存修改
          </el-button>
          <el-button @click="handleBack">
            <el-icon><Close /></el-icon>
            取消
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Check,
  Close
} from '@element-plus/icons-vue'
import { getUserDetail, updateUser } from '@/api/user'

const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const loading = ref(false)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  id: '',
  username: '',
  password: '',
  phone: '',
  email: '',
  role: 'user',
  status: 'active',
  nickname: '',
  gender: 'unknown',
  birthday: '',
  region: [],
  department: '',
  position: '',
  remark: ''
})

// 地区选项（简化版）
const regionOptions = [
  {
    value: '110000',
    label: '北京市',
    children: [
      { value: '110100', label: '市辖区' }
    ]
  },
  {
    value: '310000',
    label: '上海市',
    children: [
      { value: '310100', label: '市辖区' }
    ]
  },
  {
    value: '440000',
    label: '广东省',
    children: [
      { value: '440100', label: '广州市' },
      { value: '440300', label: '深圳市' }
    ]
  }
]

// 表单验证规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  email: [
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 加载用户信息
const loadUserDetail = async () => {
  loading.value = true
  try {
    const res = await getUserDetail(route.params.id)
    Object.assign(formData, res.data)
  } catch (error) {
    console.error('加载用户信息失败:', error)
    ElMessage.error('加载用户信息失败')
  } finally {
    loading.value = false
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const submitData = { ...formData }
      // 如果密码为空，不提交密码字段
      if (!submitData.password) {
        delete submitData.password
      }
      await updateUser(route.params.id, submitData)
      ElMessage.success('用户信息更新成功')
      router.push(`/users/${route.params.id}`)
    } catch (error) {
      console.error('更新用户失败:', error)
      ElMessage.error(error.message || '更新用户失败')
    } finally {
      submitting.value = false
    }
  })
}

// 返回
const handleBack = () => {
  router.back()
}

onMounted(() => {
  loadUserDetail()
})
</script>

<style lang="scss" scoped>
.edit-user-container {
  .page-header {
    display: flex;
    align-items: center;
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

  .form-card {
    :deep(.el-divider__text) {
      font-weight: 600;
      color: #303133;
    }
  }
}
</style>
