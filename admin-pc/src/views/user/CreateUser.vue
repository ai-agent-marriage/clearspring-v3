<template>
  <div class="create-user-container">
    <div class="page-header">
      <div class="header-left">
        <el-button type="info" circle @click="handleBack">
          <el-icon><ArrowLeft /></el-icon>
        </el-button>
        <div class="header-content">
          <h2 class="page-title">创建用户</h2>
          <p class="page-description">添加新的系统用户</p>
        </div>
      </div>
    </div>

    <el-card shadow="hover" class="form-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="120px"
        style="max-width: 600px"
      >
        <el-divider content-position="left">基本信息</el-divider>

        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="formData.username"
            placeholder="请输入用户名（3-20 个字符）"
            maxlength="20"
            show-word-limit
          />
        </el-form-item>

        <el-form-item label="密码" prop="password">
          <el-input
            v-model="formData.password"
            type="password"
            placeholder="请输入密码（至少 6 位）"
            show-password
          />
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="formData.confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            show-password
          />
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input
            v-model="formData.phone"
            placeholder="请输入手机号"
            maxlength="11"
          />
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
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
            创建用户
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
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  ArrowLeft,
  Check,
  Close
} from '@element-plus/icons-vue'
import { createUser } from '@/api/user'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)

// 表单数据
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
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
const validateConfirmPassword = (rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3-20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { validator: validateConfirmPassword, trigger: 'blur' }
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

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    submitting.value = true
    try {
      const { confirmPassword, ...submitData } = formData
      await createUser(submitData)
      ElMessage.success('用户创建成功')
      router.push('/users')
    } catch (error) {
      console.error('创建用户失败:', error)
      ElMessage.error(error.message || '创建用户失败')
    } finally {
      submitting.value = false
    }
  })
}

// 返回
const handleBack = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.create-user-container {
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
