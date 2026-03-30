<template>
  <el-container class="app-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="app-aside">
      <div class="logo">
        <span v-if="!isCollapse" class="logo-text">清如 ClearSpring</span>
        <el-icon v-else size="32"><Setting /></el-icon>
      </div>
      
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        :unique-opened="true"
        router
        class="app-menu"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>控制台</template>
        </el-menu-item>
        
        <el-menu-item index="/orders">
          <el-icon><List /></el-icon>
          <template #title>订单管理</template>
        </el-menu-item>
        
        <el-menu-item index="/qualifications">
          <el-icon><DocumentChecked /></el-icon>
          <template #title>资质审核</template>
        </el-menu-item>
        
        <el-menu-item index="/appeals">
          <el-icon><ScaleToOriginal /></el-icon>
          <template #title>申诉仲裁</template>
        </el-menu-item>
        
        <el-menu-item index="/profit-sharing">
          <el-icon><Coin /></el-icon>
          <template #title>分账配置</template>
        </el-menu-item>
        
        <el-menu-item index="/executors">
          <el-icon><User /></el-icon>
          <template #title>执行者管理</template>
        </el-menu-item>
        
        <el-menu-item index="/export">
          <el-icon><Download /></el-icon>
          <template #title>数据导出</template>
        </el-menu-item>
        
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <template #title>系统设置</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部导航 -->
      <el-header class="app-header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>
        
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="username">{{ adminName }}</span>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="profile">个人信息</el-dropdown-item>
                <el-dropdown-item command="password">修改密码</el-dropdown-item>
                <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <!-- 内容区域 -->
      <el-main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessageBox, ElMessage } from 'element-plus'
import {
  DataAnalysis,
  List,
  DocumentChecked,
  ScaleToOriginal,
  Coin,
  User,
  Download,
  Setting,
  Fold,
  Expand,
  UserFilled
} from '@element-plus/icons-vue'
import { getCurrentUser, logout } from '@/api/auth'

const route = useRoute()
const router = useRouter()

// 侧边栏折叠状态
const isCollapse = ref(false)

// 当前激活的菜单
const activeMenu = computed(() => route.path)

// 管理员信息
const adminName = ref('管理员')

// 切换侧边栏折叠
const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

// 处理下拉菜单命令
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/settings')
      break
    case 'password':
      ElMessageBox.prompt('请输入新密码', '修改密码', {
        inputType: 'password',
        inputPattern: /.{6,}/,
        inputErrorMessage: '密码至少 6 位'
      }).then(async ({ value }) => {
        // TODO: 调用修改密码 API
        ElMessage.success('密码修改成功')
      }).catch(() => {})
      break
    case 'logout':
      try {
        await logout()
      } catch (error) {
        console.error('退出登录失败:', error)
      } finally {
        localStorage.removeItem('admin_token')
        ElMessage.success('已退出登录')
        router.push('/login')
      }
      break
  }
}

// 获取当前用户信息
const loadCurrentUser = async () => {
  try {
    const res = await getCurrentUser()
    adminName.value = res.data?.name || '管理员'
  } catch (error) {
    console.error('获取用户信息失败:', error)
  }
}

onMounted(() => {
  loadCurrentUser()
})
</script>

<style lang="scss" scoped>
.app-container {
  width: 100%;
  height: 100%;
}

.app-aside {
  background-color: #001529;
  transition: width 0.3s;
  overflow-x: hidden;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #002140;
    
    .logo-image {
      height: 32px;
      margin-right: 12px;
    }
    
    .logo-text {
      color: #fff;
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .app-menu {
    border-right: none;
    background-color: #001529;
    
    :deep(.el-menu-item) {
      color: rgba(255, 255, 255, 0.65);
      
      &:hover,
      &.is-active {
        color: #fff;
        background-color: #1890ff !important;
      }
      
      .el-icon {
        color: rgba(255, 255, 255, 0.65);
      }
    }
  }
}

.app-header {
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  .header-left {
    .collapse-btn {
      font-size: 20px;
      cursor: pointer;
      transition: color 0.3s;
      
      &:hover {
        color: #1890ff;
      }
    }
  }
  
  .header-right {
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      
      .username {
        margin-left: 8px;
        color: #303133;
      }
    }
  }
}

.app-main {
  background-color: #f5f7fa;
  padding: 20px;
}

// 路由切换动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
