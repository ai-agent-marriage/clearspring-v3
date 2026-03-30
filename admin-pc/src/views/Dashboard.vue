<template>
  <div class="dashboard-container">
    <div class="page-header">
      <h2 class="page-title">控制台</h2>
      <p class="page-description">欢迎使用清如 ClearSpring 管理后台</p>
    </div>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" class="stat-row">
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #e6f7ff;">
              <el-icon size="32" color="#1890ff"><List /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalOrders }}</div>
              <div class="stat-label">总订单数</div>
            </div>
          </div>
          <div class="stat-footer">
            <span :class="stats.orderChange >= 0 ? 'positive' : 'negative'">
              <el-icon><ArrowUp v-if="stats.orderChange >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(stats.orderChange) }}%
            </span>
            <span class="stat-period">较上周</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #f6ffed;">
              <el-icon size="32" color="#52c41a"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.totalExecutors }}</div>
              <div class="stat-label">执行者总数</div>
            </div>
          </div>
          <div class="stat-footer">
            <span :class="stats.executorChange >= 0 ? 'positive' : 'negative'">
              <el-icon><ArrowUp v-if="stats.executorChange >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(stats.executorChange) }}%
            </span>
            <span class="stat-period">较上周</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fff7e6;">
              <el-icon size="32" color="#fa8c16"><Coin /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">¥{{ stats.totalRevenue }}</div>
              <div class="stat-label">总收入</div>
            </div>
          </div>
          <div class="stat-footer">
            <span :class="stats.revenueChange >= 0 ? 'positive' : 'negative'">
              <el-icon><ArrowUp v-if="stats.revenueChange >= 0" /><ArrowDown v-else /></el-icon>
              {{ Math.abs(stats.revenueChange) }}%
            </span>
            <span class="stat-period">较上周</span>
          </div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :sm="12" :lg="6">
        <el-card shadow="hover" class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background-color: #fff1f0;">
              <el-icon size="32" color="#f5222d"><Warning /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.pendingAppeals }}</div>
              <div class="stat-label">待处理申诉</div>
            </div>
          </div>
          <div class="stat-footer">
            <span class="stat-period">需要及时处理</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 图表区域 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button label="week">周</el-radio-button>
                <el-radio-button label="month">月</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div ref="orderChartRef" class="chart"></div>
        </el-card>
      </el-col>
      
      <el-col :xs="24" :lg="12">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>订单状态分布</span>
            </div>
          </template>
          <div ref="statusChartRef" class="chart"></div>
        </el-card>
      </el-col>
    </el-row>
    
    <!-- 执行者排行 -->
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <template #header>
            <div class="card-header">
              <span>执行者排行（按订单完成量）</span>
              <el-button type="primary" link>查看更多</el-button>
            </div>
          </template>
          <el-table :data="executorRanking" stripe style="width: 100%">
            <el-table-column type="index" label="排名" width="60" align="center" />
            <el-table-column prop="name" label="执行者" />
            <el-table-column prop="completedOrders" label="完成订单" width="120" align="center" />
            <el-table-column prop="completionRate" label="完成率" width="120" align="center">
              <template #default="{ row }">
                <el-tag :type="row.completionRate >= 95 ? 'success' : 'warning'">
                  {{ row.completionRate }}%
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="rating" label="评分" width="120" align="center">
              <template #default="{ row }">
                <el-rate v-model="row.rating" disabled show-score text-color="#ff9900" />
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import {
  List,
  User,
  Coin,
  Warning,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'
import { getDashboardStats, getOrderTrend, getOrderStatusDistribution, getExecutorRanking } from '@/api/dashboard'

// 统计数据
const stats = reactive({
  totalOrders: 0,
  orderChange: 0,
  totalExecutors: 0,
  executorChange: 0,
  totalRevenue: 0,
  revenueChange: 0,
  pendingAppeals: 0
})

// 图表类型
const chartType = ref('week')

// 图表引用
const orderChartRef = ref(null)
const statusChartRef = ref(null)
let orderChart = null
let statusChart = null

// 执行者排行
const executorRanking = ref([])

// 加载统计数据
const loadStats = async () => {
  try {
    const res = await getDashboardStats()
    Object.assign(stats, res.data)
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 初始化订单趋势图表
const initOrderChart = async () => {
  if (!orderChartRef.value) return
  
  try {
    const res = await getOrderTrend({ type: chartType.value })
    const data = res.data || []
    
    orderChart = echarts.init(orderChartRef.value)
    orderChart.setOption({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['订单量', '完成量']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: data.map(item => item.date)
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: '订单量',
          type: 'line',
          smooth: true,
          data: data.map(item => item.total),
          itemStyle: { color: '#1890ff' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(24,144,255,0.3)' },
              { offset: 1, color: 'rgba(24,144,255,0.05)' }
            ])
          }
        },
        {
          name: '完成量',
          type: 'line',
          smooth: true,
          data: data.map(item => item.completed),
          itemStyle: { color: '#52c41a' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(82,196,26,0.3)' },
              { offset: 1, color: 'rgba(82,196,26,0.05)' }
            ])
          }
        }
      ]
    })
  } catch (error) {
    console.error('加载订单趋势失败:', error)
  }
}

// 初始化状态分布图表
const initStatusChart = async () => {
  if (!statusChartRef.value) return
  
  try {
    const res = await getOrderStatusDistribution()
    const data = res.data || []
    
    statusChart = echarts.init(statusChartRef.value)
    statusChart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: data.map(item => ({
            name: item.status,
            value: item.count
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            formatter: '{b}: {c} ({d}%)'
          }
        }
      ]
    })
  } catch (error) {
    console.error('加载状态分布失败:', error)
  }
}

// 加载执行者排行
const loadExecutorRanking = async () => {
  try {
    const res = await getExecutorRanking({ limit: 10 })
    executorRanking.value = res.data || []
  } catch (error) {
    console.error('加载执行者排行失败:', error)
  }
}

// 监听图表类型变化
const watchChartType = async () => {
  await nextTick()
  initOrderChart()
}

// 窗口大小变化时重新渲染图表
const handleResize = () => {
  orderChart?.resize()
  statusChart?.resize()
}

onMounted(async () => {
  await loadStats()
  await initOrderChart()
  await initStatusChart()
  await loadExecutorRanking()
  
  window.addEventListener('resize', handleResize)
})
</script>

<style lang="scss" scoped>
.dashboard-container {
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
  
  .stat-row {
    margin-bottom: 20px;
  }
  
  .chart-row {
    margin-bottom: 20px;
  }
  
  .stat-card {
    :deep(.el-card__body) {
      padding: 20px;
    }
    
    .stat-content {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      
      .stat-icon {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 16px;
      }
      
      .stat-info {
        flex: 1;
        
        .stat-value {
          font-size: 28px;
          font-weight: 600;
          color: #303133;
          margin-bottom: 4px;
        }
        
        .stat-label {
          font-size: 14px;
          color: #909399;
        }
      }
    }
    
    .stat-footer {
      border-top: 1px solid #f0f0f0;
      padding-top: 12px;
      font-size: 12px;
      
      .positive {
        color: #67c23a;
        margin-right: 8px;
      }
      
      .negative {
        color: #f56c6c;
        margin-right: 8px;
      }
      
      .stat-period {
        color: #909399;
      }
    }
  }
  
  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  .chart {
    height: 300px;
    width: 100%;
  }
}
</style>
