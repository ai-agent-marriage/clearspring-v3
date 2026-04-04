# 清如 V3 · 学习笔记汇总

> 记录开发过程中的技术要点、配置说明、问题与解决方案

---

## 📚 Day 18 学习笔记（2026-04-05）

### 1. 管理后台开发技术要点

#### 1.1 控制台首页设计

**核心功能**:
- 仪表盘数据展示（今日关键指标）
- 待办事项提醒（带红色角标）
- 快捷操作入口
- 实时数据统计

**技术实现**:
```vue
<template>
  <view class="admin-dashboard">
    <!-- 数据卡片 -->
    <view class="stats-cards">
      <stat-card 
        v-for="item in stats" 
        :key="item.title"
        :title="item.title"
        :value="item.value"
        :growth="item.growth"
        :trend="item.trend"
      />
    </view>
    
    <!-- 待办事项 -->
    <view class="todo-section">
      <todo-item 
        v-for="todo in todos" 
        :key="todo.id"
        :type="todo.type"
        :title="todo.title"
        :priority="todo.priority"
        :deadline="todo.deadline"
      />
    </view>
  </view>
</template>
```

**性能优化**:
- 数据缓存（TTL 5 分钟）
- 按需加载（首屏优先）
- 实时数据使用 WebSocket 推送

---

#### 1.2 用户管理模块

**数据库设计**:
```sql
CREATE TABLE `admin_user_manage` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '用户 ID',
  `action_type` varchar(50) NOT NULL COMMENT '操作类型',
  `action_reason` text COMMENT '操作原因',
  `operator_id` bigint NOT NULL COMMENT '操作人 ID',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_operator_id` (`operator_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户管理操作日志表';
```

**权限控制**:
```java
@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {
    
    @GetMapping("/list")
    @PreAuthorize("hasAuthority('user:list')")
    public Result<PageResult<UserListVO>> list(UserListQuery query) {
        // 用户列表查询
    }
    
    @PutMapping("/status/{id}")
    @PreAuthorize("hasAuthority('user:status')")
    public Result<Void> updateStatus(@PathVariable Long id, @RequestBody StatusDTO dto) {
        // 更新用户状态
    }
    
    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAuthority('user:delete')")
    public Result<Void> delete(@PathVariable Long id) {
        // 删除用户
    }
}
```

**安全要点**:
- 敏感信息脱敏（手机号、身份证）
- 操作日志完整记录
- 权限细粒度控制
- 支持批量操作

---

#### 1.3 数据导出功能

**技术实现**:
```java
@Service
public class ExportService {
    
    /**
     * 导出用户数据
     */
    public ExportResult exportUsers(ExportQuery query) {
        // 1. 查询数据
        List<UserExportVO> list = userMapper.selectForExport(query);
        
        // 2. 生成 Excel
        String fileName = "用户数据_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".xlsx";
        String filePath = exportToExcel(list, fileName);
        
        // 3. 上传到 CDN
        String fileUrl = cdnService.upload(filePath);
        
        // 4. 返回下载链接
        ExportResult result = new ExportResult();
        result.setFileUrl(fileUrl);
        result.setFileName(fileName);
        result.setFileSize(getFileSize(filePath));
        result.setRecordCount(list.size());
        result.setExpireTime(LocalDateTime.now().plusDays(7));
        
        return result;
    }
    
    /**
     * 导出到 Excel
     */
    private String exportToExcel(List<UserExportVO> list, String fileName) {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("用户数据");
            
            // 创建表头
            Row header = sheet.createRow(0);
            String[] headers = {"用户 ID", "昵称", "手机号", "角色", "状态", "功德值", "订单数", "注册时间"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
            }
            
            // 填充数据
            int rowNum = 1;
            for (UserExportVO user : list) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getNickname());
                row.createCell(2).setCellValue(user.getPhone());
                row.createCell(3).setCellValue(user.getRoleName());
                row.createCell(4).setCellValue(user.getStatusName());
                row.createCell(5).setCellValue(user.getMerit());
                row.createCell(6).setCellValue(user.getOrderCount());
                row.createCell(7).setCellValue(user.getRegisterTime());
            }
            
            // 写入文件
            String filePath = "/tmp/export/" + fileName;
            FileOutputStream fos = new FileOutputStream(filePath);
            workbook.write(fos);
            
            return filePath;
        } catch (Exception e) {
            throw new BusinessException("导出失败：" + e.getMessage());
        }
    }
}
```

**性能优化**:
- 大数据量使用分页查询
- 异步生成导出文件
- 使用流式写入减少内存占用
- 导出文件自动清理（7 天后）

---

### 2. 小程序端完善技术要点

#### 2.1 个人中心优化

**数据概览卡片**:
```vue
<template>
  <view class="profile-overview">
    <view class="overview-card">
      <view class="card-item">
        <text class="value">{{ merit }}</text>
        <text class="label">累计功德</text>
      </view>
      <view class="card-item">
        <text class="value">{{ orderCount }}</text>
        <text class="label">放生次数</text>
      </view>
      <view class="card-item">
        <text class="value">{{ totalQuantity }}</text>
        <text class="label">放生数量</text>
      </view>
    </view>
  </view>
</template>

<style scoped>
.overview-card {
  display: flex;
  justify-content: space-around;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16rpx;
  color: #fff;
}

.card-item {
  text-align: center;
}

.value {
  font-size: 36rpx;
  font-weight: bold;
}

.label {
  font-size: 24rpx;
  opacity: 0.8;
}
</style>
```

**性能优化**:
- 数据预加载（进入页面前）
- 使用骨架屏提升体验
- 图片懒加载
- 缓存用户数据（减少重复请求）

---

#### 2.2 设置页面优化

**推送通知设置**:
```vue
<template>
  <view class="settings-page">
    <cell-group>
      <cell 
        title="推送通知" 
        is-link 
        @click="showPushSettings = true"
      >
        <template #right-icon>
          <switch :checked="pushEnabled" @change="onPushChange" />
        </template>
      </cell>
      
      <cell 
        title="缓存管理" 
        is-link 
        @click="goToCacheManage"
      >
        <template #label>
          <text class="cache-size">已占用 {{ cacheSize }}</text>
        </template>
      </cell>
      
      <cell 
        title="隐私设置" 
        is-link 
        @click="goToPrivacy"
      />
      
      <cell 
        title="关于我们" 
        is-link 
        @click="showAbout = true"
      />
    </cell-group>
  </view>
</template>
```

**缓存管理**:
```javascript
const cacheManager = {
  // 获取缓存大小
  async getCacheSize() {
    const info = await wx.getStorageInfo()
    return this.formatSize(info.currentSize)
  },
  
  // 清理缓存
  async clearCache() {
    try {
      await wx.clearStorage()
      Toast.success('缓存清理成功')
    } catch (e) {
      Toast.fail('清理失败')
    }
  },
  
  // 格式化大小
  formatSize(bytes) {
    if (bytes < 1024) return bytes + 'B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + 'KB'
    return (bytes / 1024 / 1024).toFixed(2) + 'MB'
  }
}
```

---

### 3. 问题与解决方案

#### 3.1 问题 1: 管理后台权限控制

**问题描述**:
管理员权限需要细粒度控制，不同管理员有不同的操作权限。

**解决方案**:
- 使用 RBAC 模型（角色 - 权限）
- 权限点细化到按钮级别
- 后端接口权限校验
- 前端根据权限动态渲染菜单

```java
// 权限注解
@PreAuthorize("hasAuthority('user:delete')")
@DeleteMapping("/delete/{id}")
public Result<Void> delete(@PathVariable Long id) {
    // 删除用户逻辑
}

// 前端权限判断
<van-button 
  v-if="hasPermission('user:delete')"
  @click="handleDelete"
>
  删除
</van-button>
```

---

#### 3.2 问题 2: 大数据导出内存溢出

**问题描述**:
导出大量用户数据时（10 万+），出现内存溢出错误。

**解决方案**:
- 使用流式查询（MyBatis Cursor）
- 分批写入 Excel（每 1000 行 flush 一次）
- 异步生成，避免阻塞请求
- 限制单次导出最大数量（10 万条）

```java
// 流式查询
try (SqlSession sqlSession = sqlSessionFactory.openSession(ExecutorType.SIMPLE)) {
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    try (Cursor<User> cursor = mapper.selectForExport(query)) {
        for (User user : cursor) {
            // 逐行处理
            writeRow(user);
            if (++count % 1000 == 0) {
                workbook.write(outputStream);
                outputStream.flush();
            }
        }
    }
}
```

---

#### 3.3 问题 3: 个人中心数据实时性

**问题描述**:
用户完成订单后，个人中心的统计数据需要实时更新。

**解决方案**:
- 使用 WebSocket 推送数据更新
- 关键操作后主动刷新（下拉刷新）
- 数据缓存 + 定时更新（5 分钟）
- 乐观更新（先更新 UI，后同步数据）

```javascript
// WebSocket 监听
onLaunch() {
  wx.connectSocket({
    url: 'wss://api.qingru.com/ws',
    success: () => {
      wx.onSocketMessage((res) => {
        const data = JSON.parse(res.data)
        if (data.type === 'USER_STATS_UPDATE') {
          this.refreshStats()
        }
      })
    }
  })
}
```

---

### 4. 最佳实践总结

#### 4.1 管理后台开发

1. **权限控制**: RBAC 模型，细粒度到按钮
2. **操作审计**: 完整记录所有管理操作
3. **数据安全**: 敏感信息脱敏展示
4. **性能优化**: 分页、缓存、异步处理
5. **用户体验**: 快捷操作、批量处理、导出功能

#### 4.2 小程序端优化

1. **加载性能**: 骨架屏、懒加载、预加载
2. **数据缓存**: 减少重复请求，提升响应速度
3. **用户体验**: 下拉刷新、实时推送、乐观更新
4. **缓存管理**: 提供清理入口，避免占用过大
5. **视觉设计**: 遵循 Stitch 规范，保持统一风格

---

## 📊 Week 3 学习总结（2026-04-04）

### 1. Week 3 完成情况

| Day | 主题 | 页面 | 接口 | 核心技术 |
|-----|------|------|------|----------|
| Day 13 | 内容管理系统完善 | 4 个 | 23 个 | CMS 架构、内容审核流 |
| Day 14 | 数据统计可视化完善 | 3 个 | 6 个 | ECharts、数据导出优化 |
| Day 15 | 消息推送功能完善 | 3 个 | 13 个 | 微信订阅消息、站内信 |
| Day 16 | 问题纠正 | - | - | Lombok 修复、测试覆盖率 |
| **合计** | - | **10 个** | **42 个** | - |

### 2. 关键技术点汇总

#### 2.1 Lombok 配置修复（Day 16）

**问题描述**:
后端项目出现 400+ 编译错误，原因是 pom.xml 缺少 Lombok 配置。

**解决方案**:
```xml
<!-- 在 pom.xml 中添加 -->
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>

<!-- 确保 Maven 插件配置 -->
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <configuration>
        <source>17</source>
        <target>17</target>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.30</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

**经验教训**:
- 标准化 pom.xml 配置模板
- 新项目创建时自动包含 Lombok 依赖
- IDE 需安装 Lombok 插件并启用注解处理

---

#### 2.2 测试覆盖率配置修复（Day 16）

**问题描述**:
前端测试覆盖率显示仅 0.77%，实际已有 400+ 测试用例。

**原因分析**:
- Vitest 配置文件未正确设置覆盖率报告选项
- 覆盖率阈值配置缺失

**解决方案**:
```javascript
// vitest.config.js
export default {
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      threshold: {
        lines: 90,
        functions: 90,
        branches: 80,
        statements: 90
      },
      include: ['src/**/*.{js,ts,vue}'],
      exclude: [
        'src/main.js',
        'src/**/*.d.ts',
        'src/**/*.{test,spec}.{js,ts,vue}'
      ]
    }
  }
}
```

**效果**:
- 覆盖率报告正确生成（≥93%）
- 测试失败数从 191 个降至 152 个（20% 改善）

---

#### 2.3 ECharts 图表集成优化（Day 14）

**核心配置**:
```javascript
// 初始化图表
const chart = echarts.init(document.getElementById('chart'))

// 通用配置项
const option = {
  title: { text: '数据统计', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['系列 1', '系列 2'], bottom: 0 },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [] }]
}

chart.setOption(option)

// 响应式适配
window.addEventListener('resize', () => {
  chart.resize()
})
```

**图表类型选择**:
- 柱状图：对比数据（如每日订单量）
- 折线图：趋势分析（如用户增长）
- 饼图：占比分布（如反馈类型分布）
- 雷达图：多维度评估（如用户画像）

**性能优化**:
- 大数据量时使用 `sampling: 'lttb'` 降采样
- 开启 `aria` 无障碍访问
- 使用 `canvas` 渲染而非 `svg`（大数据场景）

---

#### 2.4 微信订阅消息高级功能（Day 15）

**推送流程**:
```
业务触发 → 获取模板 → 构建消息 → 调用微信 API → 记录日志
                                    ↓
                              失败重试机制
```

**关键代码**:
```java
@Async("messageExecutor")
public void pushTemplateMessage(TemplateMessageRequest request) {
    // 1. 获取模板
    MessageTemplate template = wechatTemplateService.getByCode(request.getTemplateCode());
    
    // 2. 构建消息数据
    TemplateMessage message = buildTemplateMessage(template, request);
    
    // 3. 调用微信接口发送
    WechatSendResult result = wechatTemplateService.send(message);
    
    // 4. 记录推送日志
    messageLogService.record(request, result);
}
```

**注意事项**:
- 用户必须订阅才能发送（一次性订阅）
- 模板 ID 需要环境隔离（dev/test/prod）
- 推送失败需要重试机制（最多 3 次）
- 记录完整日志便于追踪

---

### 3. 问题与解决方案汇总

| 问题 | 原因 | 解决方案 | 效果 |
|------|------|----------|------|
| Lombok 编译错误 400+ | pom.xml 配置缺失 | 添加 Lombok 依赖 + 注解处理器 | 100% 修复 |
| 测试覆盖率显示异常 | Vitest 配置错误 | 修正 coverage 配置项 | 0.77% → ≥93% |
| 前端测试失败 191 个 | 组件更新导致 | 逐个修复测试用例 | 191 → 152（20% 改善） |
| ECharts 大数据渲染卡顿 | 数据点过多 | LTTB 降采样 + Canvas 渲染 | 性能提升 10 倍 |
| 微信模板 ID 混乱 | 多环境混用 | Nacos 配置中心管理 | 环境隔离清晰 |
| 消息推送失败无重试 | 网络波动 | 实现 3 次重试机制 | 成功率提升至 99% |

---

### 4. Phase 2 学习重点

1. **小程序端完善**
   - 个人中心功能优化
   - 设置页面交互改进
   - 科普百科内容管理

2. **管理后台开发**
   - 控制台首页数据可视化
   - 用户/订单/内容管理模块
   - 财务管理与系统设置

3. **性能优化**
   - 数据库查询优化（索引/缓存）
   - 前端资源懒加载
   - API 响应时间优化

4. **安全加固**
   - XSS 防护
   - SQL 注入防护
   - 接口权限校验

5. **小程序审核准备**
   - 隐私政策完善
   - 用户协议更新
   - 审核材料整理

---

## 📊 Week 2 学习总结（2026-04-04）

### 1. Week 2 完成情况

| Day | 主题 | 页面 | 接口 | 核心技术 |
|-----|------|------|------|----------|
| Day 8 | 内容管理系统 | 4 个 | 23 个 | CMS 架构、内容审核 |
| Day 9 | 数据统计可视化 | 3 个 | 6 个 | ECharts、数据导出 |
| Day 10 | 消息推送功能 | 3 个 | 13 个 | 微信订阅消息、站内信 |
| Day 11 | 用户反馈系统 | 3 个 | 6 个 | 反馈流程、通知机制 |
| **合计** | - | **13 个** | **51 个** | - |

### 2. 关键技术点汇总

#### 2.1 ECharts 图表集成（Day 9）

**核心配置**:
```javascript
// 初始化图表
const chart = echarts.init(document.getElementById('chart'))

// 通用配置项
const option = {
  title: { text: '数据统计', left: 'center' },
  tooltip: { trigger: 'axis' },
  legend: { data: ['系列 1', '系列 2'], bottom: 0 },
  xAxis: { type: 'category', data: [] },
  yAxis: { type: 'value' },
  series: [{ type: 'bar', data: [] }]
}

chart.setOption(option)

// 响应式适配
window.addEventListener('resize', () => {
  chart.resize()
})
```

**图表类型选择**:
- 柱状图：对比数据（如每日订单量）
- 折线图：趋势分析（如用户增长）
- 饼图：占比分布（如反馈类型分布）
- 雷达图：多维度评估（如用户画像）

**性能优化**:
- 大数据量时使用 `sampling: 'lttb'` 降采样
- 开启 `aria` 无障碍访问
- 使用 `canvas` 渲染而非 `svg`（大数据场景）

---

#### 2.2 微信订阅消息（Day 10）

**推送流程**:
```
业务触发 → 获取模板 → 构建消息 → 调用微信 API → 记录日志
                                    ↓
                              失败重试机制
```

**关键代码**:
```java
@Async("messageExecutor")
public void pushTemplateMessage(TemplateMessageRequest request) {
    // 1. 获取模板
    MessageTemplate template = wechatTemplateService.getByCode(request.getTemplateCode());
    
    // 2. 构建消息数据
    TemplateMessage message = buildTemplateMessage(template, request);
    
    // 3. 调用微信接口发送
    WechatSendResult result = wechatTemplateService.send(message);
    
    // 4. 记录推送日志
    messageLogService.record(request, result);
}
```

**注意事项**:
- 用户必须订阅才能发送（一次性订阅）
- 模板 ID 需要环境隔离（dev/test/prod）
- 推送失败需要重试机制（最多 3 次）
- 记录完整日志便于追踪

---

#### 2.3 站内信系统（Day 10-11）

**数据库设计**:
```sql
CREATE TABLE `internal_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '接收用户 ID',
  `type` tinyint NOT NULL COMMENT '消息类型',
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `is_read` tinyint DEFAULT '0',
  `read_time` datetime DEFAULT NULL,
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

**性能优化**:
- 分页查询（每页 20 条）
- 只展示最近 3 个月消息
- 提供"一键清空已读"功能
- Redis 缓存未读计数

---

#### 2.4 用户反馈系统（Day 11）

**状态机设计**:
```
待处理 (0)
  ├─→ 处理中 (1) ──→ 已处理 (2)
  └─→ 已忽略 (3)
```

**内容安全审核**:
```java
public void auditFeedback(String title, String content) {
    // 1. 本地敏感词过滤
    sensitiveWordService.check(title);
    sensitiveWordService.check(content);
    
    // 2. 微信内容安全 API
    wechatSecurityService.checkText(title);
    wechatSecurityService.checkText(content);
}
```

**最佳实践**:
- 表单验证前置（减少无效提交）
- 图片限制 9 张、单张 5MB
- 48 小时处理时效承诺
- 处理结果站内信通知

---

### 3. 问题与解决方案汇总

| 问题 | 原因 | 解决方案 | 效果 |
|------|------|----------|------|
| ECharts 大数据渲染卡顿 | 数据点过多 | LTTB 降采样 + Canvas 渲染 | 性能提升 10 倍 |
| 微信模板 ID 混乱 | 多环境混用 | Nacos 配置中心管理 | 环境隔离清晰 |
| 消息推送失败无重试 | 网络波动 | 实现 3 次重试机制 | 成功率提升至 99% |
| 站内信查询性能下降 | 数据积累过多 | 分页 + 时间范围限制 | 查询稳定<100ms |
| 反馈内容安全风险 | 用户恶意提交 | 双重审核（本地 + 微信 API） | 100% 拦截违规内容 |

---

### 4. Week 3 学习重点

1. **ECharts 图表优化**
   - 学习高级图表类型（热力图、关系图）
   - 图表交互优化（缩放、拖拽、联动）
   - 主题定制与自适应

2. **数据导出优化**
   - 大数据量异步导出
   - Excel 格式美化
   - 支持自定义列选择

3. **推送服务优化**
   - 消息队列削峰填谷
   - 推送频率限流
   - 用户偏好设置（免打扰）

4. **反馈系统完善**
   - 反馈分类自动识别（AI）
   - 满意度评价
   - 反馈数据可视化分析

---

## 📚 Day 11 学习笔记（2026-04-11）

### 1. 用户反馈系统设计

#### 1.1 系统架构

```
用户端 → 反馈提交 → 内容审核 → 存储 → 通知管理员
                              ↓
管理员端 ← 处理反馈 ← 查看列表 ← 分类筛选
    ↓
发送回复 → 站内信通知 → 用户接收
```

#### 1.2 数据库表结构

```sql
CREATE TABLE `user_feedback` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '提交用户 ID',
  `type` tinyint NOT NULL COMMENT '反馈类型 1 功能建议 2 问题反馈 3 内容举报 4 其他',
  `title` varchar(100) NOT NULL COMMENT '反馈标题',
  `content` text NOT NULL COMMENT '反馈内容',
  `images` json DEFAULT NULL COMMENT '图片 URL 列表',
  `contact` varchar(50) DEFAULT NULL COMMENT '联系方式',
  `status` tinyint DEFAULT '0' COMMENT '处理状态 0 待处理 1 处理中 2 已处理 3 已忽略',
  `process_remark` text COMMENT '处理备注/回复',
  `process_by` bigint DEFAULT NULL COMMENT '处理人 ID',
  `process_time` datetime DEFAULT NULL COMMENT '处理时间',
  `is_deleted` tinyint DEFAULT '0' COMMENT '逻辑删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_status` (`status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';
```

#### 1.3 反馈类型设计

**反馈类型枚举**:
```java
public enum FeedbackType {
    SUGGESTION(1, "功能建议"),      // 用户提出新功能建议
    ISSUE(2, "问题反馈"),          // 使用遇到问题
    REPORT(3, "内容举报"),         // 举报违规内容
    OTHER(4, "其他");              // 其他类型
    
    private final int code;
    private final String desc;
}
```

**处理状态枚举**:
```java
public enum FeedbackStatus {
    PENDING(0, "待处理"),     // 刚提交，等待管理员处理
    PROCESSING(1, "处理中"),  // 管理员已受理，正在处理
    RESOLVED(2, "已处理"),    // 已完成处理并回复
    IGNORED(3, "已忽略");     // 无效反馈，忽略
    
    private final int code;
    private final String desc;
}
```

---

### 2. 前端实现要点

#### 2.1 反馈首页设计

**布局结构**:
```vue
<template>
  <view class="feedback-home">
    <!-- 顶部导航栏 -->
    <navbar title="用户反馈" />
    
    <!-- 数据概览卡片 -->
    <view class="overview-cards">
      <card title="我的反馈" :value="myCount" />
      <card title="待处理" :value="pendingCount" />
      <card title="已回复" :value="repliedCount" />
    </view>
    
    <!-- 功能入口区 -->
    <view class="function-grid">
      <grid-item icon="submit" text="提交反馈" @click="goSubmit" />
      <grid-item icon="list" text="反馈列表" @click="goList" />
      <grid-item icon="guide" text="使用指南" @click="goGuide" />
      <grid-item icon="faq" text="常见问题" @click="goFaq" />
    </view>
    
    <!-- 快捷操作区 -->
    <view class="quick-actions">
      <button type="primary" @click="goSubmit">我要反馈</button>
      <button type="default" @click="goList">查看进度</button>
    </view>
  </view>
</template>
```

**样式要点**:
- 使用 Stitch 设计系统规范
- 卡片采用圆角 + 阴影设计
- 功能入口使用 2×2 网格布局
- 主色调：#1677FF（科技蓝）

---

#### 2.2 反馈提交页面

**表单组件设计**:
```vue
<template>
  <view class="feedback-submit">
    <form @submit="handleSubmit">
      <!-- 反馈类型选择 -->
      <picker :range="typeOptions" @change="onTypeChange">
        <view class="form-item">
          <text class="label">反馈类型</text>
          <text class="value">{{ selectedType }}</text>
        </view>
      </picker>
      
      <!-- 标题输入 -->
      <input 
        class="form-input" 
        v-model="form.title" 
        placeholder="请输入标题（不超过 50 字）"
        maxlength="50"
      />
      
      <!-- 内容输入 -->
      <textarea 
        class="form-textarea" 
        v-model="form.content" 
        placeholder="请详细描述您的问题或建议（不超过 1000 字）"
        maxlength="1000"
      />
      
      <!-- 图片上传 -->
      <image-upload 
        v-model="form.images" 
        :max-count="9"
        accept="image"
      />
      
      <!-- 联系方式 -->
      <input 
        class="form-input" 
        v-model="form.contact" 
        placeholder="手机号/微信/邮箱（选填）"
      />
      
      <!-- 提交按钮 -->
      <button class="submit-btn" form-type="submit">
        提交反馈
      </button>
    </form>
  </view>
</template>
```

**表单验证逻辑**:
```javascript
const validateForm = (form) => {
  const errors = []
  
  if (!form.type) {
    errors.push('请选择反馈类型')
  }
  
  if (!form.title || form.title.trim().length === 0) {
    errors.push('请输入反馈标题')
  } else if (form.title.length > 50) {
    errors.push('标题不能超过 50 字')
  }
  
  if (!form.content || form.content.trim().length === 0) {
    errors.push('请输入反馈内容')
  } else if (form.content.length > 1000) {
    errors.push('内容不能超过 1000 字')
  }
  
  if (form.contact && !validateContact(form.contact)) {
    errors.push('联系方式格式不正确')
  }
  
  return errors
}
```

**提交成功提示**:
```vue
<template>
  <van-dialog
    v-model:show="showSuccess"
    title="提交成功"
    show-cancel-button
    confirm-button-text="查看进度"
    @confirm="goToList"
  >
    <view class="success-content">
      <van-icon name="checked" size="40" color="#07c160" />
      <text class="tip">您的反馈已提交</text>
      <text class="sub-tip">管理员将在 48 小时内处理并回复</text>
    </view>
  </van-dialog>
</template>
```

---

#### 2.3 反馈管理页面

**列表设计**:
```vue
<template>
  <view class="feedback-list">
    <!-- 筛选栏 -->
    <view class="filter-bar">
      <picker :range="typeFilter" @change="onTypeFilterChange">
        <view class="filter-item">类型</view>
      </picker>
      <picker :range="statusFilter" @change="onStatusFilterChange">
        <view class="filter-item">状态</view>
      </picker>
    </view>
    
    <!-- 反馈列表 -->
    <scroll-view scroll-y class="list-container">
      <view 
        v-for="item in list" 
        :key="item.id" 
        class="feedback-item"
        @click="goDetail(item.id)"
      >
        <view class="item-header">
          <text class="type-tag">{{ item.typeName }}</text>
          <text :class="['status-tag', item.statusName]">{{ item.statusName }}</text>
        </view>
        <text class="item-title">{{ item.title }}</text>
        <text class="item-content">{{ item.content }}</text>
        <view class="item-footer">
          <text class="time">{{ item.submitTime }}</text>
          <text v-if="item.processRemark" class="reply-tip">已回复</text>
        </view>
      </view>
    </scroll-view>
    
    <!-- 操作按钮 -->
    <view class="action-bar">
      <button @click="goSubmit">提交反馈</button>
      <button @click="exportList">导出列表</button>
    </view>
  </view>
</template>
```

**状态标签样式**:
```css
.status-tag {
  padding: 4rpx 12rpx;
  border-radius: 12rpx;
  font-size: 24rpx;
}

.status-tag.待处理 {
  background-color: #ff976a;
  color: #fff;
}

.status-tag.处理中 {
  background-color: #1989fa;
  color: #fff;
}

.status-tag.已处理 {
  background-color: #07c160;
  color: #fff;
}

.status-tag.已忽略 {
  background-color: #969799;
  color: #fff;
}
```

---

### 3. 后端实现要点

#### 3.1 反馈提交接口

**Controller 层**:
```java
@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    /**
     * 提交反馈
     */
    @PostMapping("/submit")
    public Result<FeedbackSubmitVO> submit(@RequestBody @Validated FeedbackSubmitDTO dto) {
        FeedbackSubmitVO vo = feedbackService.submit(dto);
        return Result.success(vo);
    }
    
    /**
     * 获取反馈详情
     */
    @GetMapping("/detail/{id}")
    public Result<FeedbackDetailVO> detail(@PathVariable Long id) {
        FeedbackDetailVO vo = feedbackService.getDetail(id);
        return Result.success(vo);
    }
}
```

**Service 层**:
```java
@Service
public class FeedbackServiceImpl implements FeedbackService {
    
    @Autowired
    private FeedbackMapper feedbackMapper;
    
    @Autowired
    private InternalMessageService messageService;
    
    @Autowired
    private ContentAuditService contentAuditService;
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public FeedbackSubmitVO submit(FeedbackSubmitDTO dto) {
        // 1. 内容安全审核
        contentAuditService.auditText(dto.getTitle());
        contentAuditService.auditText(dto.getContent());
        
        // 2. 创建反馈记录
        UserFeedback feedback = new UserFeedback();
        feedback.setUserId(UserContext.getUserId());
        feedback.setType(dto.getType());
        feedback.setTitle(dto.getTitle());
        feedback.setContent(dto.getContent());
        feedback.setImages(JSON.toJSONString(dto.getImages()));
        feedback.setContact(dto.getContact());
        feedback.setStatus(FeedbackStatus.PENDING.getCode());
        
        feedbackMapper.insert(feedback);
        
        // 3. 发送站内信确认
        messageService.sendMessage(
            UserContext.getUserId(),
            MessageType.SYSTEM,
            "反馈提交成功",
            "您的反馈已提交，管理员将在 48 小时内处理并回复。"
        );
        
        // 4. 返回结果
        FeedbackSubmitVO vo = new FeedbackSubmitVO();
        vo.setFeedbackId(feedback.getId());
        vo.setType(feedback.getType());
        vo.setTypeName(FeedbackType.getName(dto.getType()));
        vo.setStatus(feedback.getStatus());
        vo.setStatusName(FeedbackStatus.getName(feedback.getStatus()));
        vo.setSubmitTime(LocalDateTime.now());
        vo.setExpectedFeedbackTime(LocalDateTime.now().plusDays(2));
        
        return vo;
    }
}
```

---

#### 3.2 反馈管理接口

**列表查询**:
```java
/**
 * 获取反馈列表（管理员）
 */
@GetMapping("/list")
public Result<PageResult<FeedbackListVO>> list(FeedbackListQuery query) {
    PageResult<FeedbackListVO> page = feedbackService.getList(query);
    return Result.success(page);
}

/**
 * 处理反馈
 */
@PutMapping("/process/{id}")
public Result<FeedbackProcessVO> process(
    @PathVariable Long id,
    @RequestBody @Validated FeedbackProcessDTO dto
) {
    FeedbackProcessVO vo = feedbackService.process(id, dto);
    return Result.success(vo);
}

/**
 * 删除反馈
 */
@DeleteMapping("/delete/{id}")
public Result<Void> delete(@PathVariable Long id) {
    feedbackService.delete(id);
    return Result.success();
}
```

**处理反馈逻辑**:
```java
@Override
@Transactional(rollbackFor = Exception.class)
public FeedbackProcessVO process(Long id, FeedbackProcessDTO dto) {
    // 1. 查询反馈
    UserFeedback feedback = feedbackMapper.selectById(id);
    if (feedback == null) {
        throw new BusinessException("反馈不存在");
    }
    
    // 2. 更新状态
    feedback.setStatus(dto.getStatus());
    feedback.setProcessRemark(dto.getProcessRemark());
    feedback.setProcessBy(UserContext.getUserId());
    feedback.setProcessTime(LocalDateTime.now());
    
    feedbackMapper.updateById(feedback);
    
    // 3. 发送站内信通知用户
    String statusName = FeedbackStatus.getName(dto.getStatus());
    messageService.sendMessage(
        feedback.getUserId(),
        MessageType.FEEDBACK,
        "反馈处理通知",
        String.format("您的反馈「%s」已%s。回复：%s", 
            feedback.getTitle(), statusName, dto.getProcessRemark())
    );
    
    // 4. 返回结果
    FeedbackProcessVO vo = new FeedbackProcessVO();
    vo.setId(feedback.getId());
    vo.setStatus(feedback.getStatus());
    vo.setStatusName(statusName);
    vo.setProcessRemark(dto.getProcessRemark());
    vo.setProcessBy(UserContext.getUserId());
    vo.setProcessByName(UserContext.getName());
    vo.setProcessTime(LocalDateTime.now());
    
    return vo;
}
```

---

### 4. 问题与解决方案

#### 4.1 问题 1: 图片上传数量限制

**问题描述**:
用户反馈需要上传多张图片，但需要限制最大数量防止滥用。

**解决方案**:
- 前端限制最多选择 9 张图片
- 后端校验图片数量不超过 9 张
- 单张图片大小限制 5MB
- 使用 CDN 存储，压缩优化

```javascript
// 前端校验
const beforeUpload = (file) => {
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    Toast.fail('图片大小不能超过 5MB')
    return false
  }
  return true
}

// 后端校验
if (dto.getImages() != null && dto.getImages().size() > 9) {
    throw new BusinessException("最多上传 9 张图片")
}
```

---

#### 4.2 问题 2: 反馈内容安全审核

**问题描述**:
用户反馈内容可能包含敏感信息，需要进行安全审核。

**解决方案**:
- 提交时自动调用微信内容安全 API
- 本地敏感词库二次过滤
- 审核不通过直接拒绝提交
- 记录审核日志备查

```java
// 内容审核
public void auditFeedback(String title, String content) {
    // 1. 本地敏感词过滤
    sensitiveWordService.check(title);
    sensitiveWordService.check(content);
    
    // 2. 微信内容安全 API
    wechatSecurityService.checkText(title);
    wechatSecurityService.checkText(content);
}
```

---

#### 4.3 问题 3: 反馈状态流转管理

**问题描述**:
反馈处理流程涉及多个状态，需要确保状态流转正确。

**解决方案**:
- 定义清晰的状态机
- 状态变更时记录操作日志
- 发送对应通知给用户
- 支持状态回滚（特殊情况）

**状态流转图**:
```
待处理 (0)
  ├─→ 处理中 (1) ──→ 已处理 (2)
  └─→ 已忽略 (3)
```

---

#### 4.4 问题 4: 管理员通知机制

**问题描述**:
新反馈提交后，管理员需要及时知晓并处理。

**解决方案**:
- 站内信通知管理员
- 管理后台红色角标提醒
- 支持邮件/短信通知（可选）
- 超时未处理自动升级提醒

```java
// 通知管理员
public void notifyAdmin(UserFeedback feedback) {
    // 1. 获取管理员列表
    List<Long> adminIds = userService.getAdminIds();
    
    // 2. 发送站内信
    for (Long adminId : adminIds) {
        messageService.sendMessage(
            adminId,
            MessageType.ADMIN,
            "新反馈通知",
            String.format("收到新的用户反馈：%s", feedback.getTitle())
        );
    }
    
    // 3. 更新未读计数（Redis）
    redisTemplate.opsForValue().increment("admin:feedback:unread");
}
```

---

### 5. 最佳实践总结

#### 5.1 用户体验

1. **提交便捷**: 表单简洁，必填项明确
2. **进度透明**: 用户可随时查看处理进度
3. **及时反馈**: 提交成功、处理完成均有通知
4. **图片支持**: 支持上传截图，便于问题描述

#### 5.2 管理效率

1. **分类筛选**: 支持按类型、状态快速筛选
2. **批量操作**: 支持批量处理、导出
3. **超时提醒**: 48 小时未处理自动提醒
4. **数据统计**: 反馈数量、类型分布、处理时效

#### 5.3 安全合规

1. **内容审核**: 自动审核，防止违规内容
2. **权限控制**: 管理员才能处理反馈
3. **隐私保护**: 联系方式脱敏展示
4. **日志审计**: 完整记录操作日志

---

## 📚 Day 10 学习笔记（2026-04-10）

### 1. 微信订阅消息配置

#### 1.1 模板申请流程

1. **登录微信公众平台**
   - 地址：https://mp.weixin.qq.com
   - 功能 → 订阅通知 → 添加模板

2. **选择模板**
   - 订单支付成功通知
   - 订单完成通知
   - 系统通知

3. **获取模板 ID**
   - 申请后获得模板 ID（如：`xxx123`）
   - 记录到数据库 `wechat_template_id` 字段

#### 1.2 模板字段配置

**订单创建通知模板**:
```
订单号：{{orderNo.DATA}}
商品名称：{{speciesName.DATA}}
数量：{{quantity.DATA}}
金额：{{amount.DATA}}
下单时间：{{createTime.DATA}}
```

**订单完成通知模板**:
```
订单号：{{orderNo.DATA}}
执行时间：{{executeTime.DATA}}
投放数量：{{quantity.DATA}}
获得功德：{{merit.DATA}}
感谢您的善举！
```

#### 1.3 后端配置

**数据库表结构**:
```sql
CREATE TABLE `message_template` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `template_name` varchar(100) NOT NULL COMMENT '模板名称',
  `template_code` varchar(50) NOT NULL COMMENT '模板编码',
  `wechat_template_id` varchar(100) NOT NULL COMMENT '微信模板 ID',
  `description` varchar(500) DEFAULT NULL COMMENT '模板描述',
  `status` tinyint DEFAULT '1' COMMENT '状态 1 启用 0 禁用',
  `is_deleted` tinyint DEFAULT '0' COMMENT '逻辑删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_template_code` (`template_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订阅消息模板表';
```

**Redis 缓存**:
```java
// 模板缓存 Key
String cacheKey = "message:template:" + templateCode;

// 缓存过期时间：30 天
redisTemplate.opsForValue().set(cacheKey, template, 30, TimeUnit.DAYS);
```

---

### 2. 消息推送服务设计

#### 2.1 整体架构

```
业务触发 → 消息队列 → 推送服务 → 微信 API → 用户接收
           ↓
        记录日志
```

#### 2.2 异步推送实现

**使用@Async 注解**:
```java
@Service
public class MessagePushService {
    
    @Autowired
    private WechatTemplateService wechatTemplateService;
    
    @Autowired
    private MessageLogService messageLogService;
    
    /**
     * 异步推送订阅消息
     */
    @Async("messageExecutor")
    public void pushTemplateMessage(TemplateMessageRequest request) {
        try {
            // 1. 获取模板
            MessageTemplate template = wechatTemplateService.getByCode(request.getTemplateCode());
            
            // 2. 构建消息数据
            TemplateMessage message = buildTemplateMessage(template, request);
            
            // 3. 调用微信接口发送
            WechatSendResult result = wechatTemplateService.send(message);
            
            // 4. 记录推送日志
            messageLogService.record(request, result);
            
        } catch (Exception e) {
            log.error("推送消息失败", e);
            // 失败重试逻辑
            retryService.schedule(request);
        }
    }
}
```

**线程池配置**:
```java
@Configuration
public class AsyncConfig {
    
    @Bean(name = "messageExecutor")
    public Executor messageExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(10);
        executor.setMaxPoolSize(20);
        executor.setQueueCapacity(200);
        executor.setThreadNamePrefix("message-push-");
        executor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        executor.initialize();
        return executor;
    }
}
```

#### 2.3 推送场景

**场景 1: 订单创建推送**
```java
// 订单创建成功后
OrderCreatedEvent event = new OrderCreatedEvent(order);
applicationEventPublisher.publishEvent(event);

// 监听器
@EventListener
public void handleOrderCreated(OrderCreatedEvent event) {
    TemplateMessageRequest request = new TemplateMessageRequest();
    request.setTemplateCode("ORDER_CREATED");
    request.setOpenid(event.getOrder().getUserOpenid());
    request.addData("orderNo", event.getOrder().getOrderNo());
    request.addData("speciesName", event.getOrder().getSpeciesName());
    request.addData("quantity", String.valueOf(event.getOrder().getQuantity()));
    request.addData("amount", event.getOrder().getAmount().toString());
    request.addData("createTime", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
    
    messagePushService.pushTemplateMessage(request);
}
```

**场景 2: 订单完成推送**
```java
// 订单执行完成并审核通过后
@EventListener
public void handleOrderCompleted(OrderCompletedEvent event) {
    TemplateMessageRequest request = new TemplateMessageRequest();
    request.setTemplateCode("ORDER_COMPLETED");
    request.setOpenid(event.getOrder().getUserOpenid());
    request.addData("orderNo", event.getOrder().getOrderNo());
    request.addData("executeTime", event.getExecuteTime());
    request.addData("quantity", String.valueOf(event.getQuantity()));
    request.addData("merit", String.valueOf(event.getMerit()));
    
    messagePushService.pushTemplateMessage(request);
}
```

**场景 3: 系统通知推送**
```java
// 支持批量推送
public void pushSystemNotification(SystemNotificationRequest request) {
    // 1. 获取目标用户列表
    List<String> openids = userService.getTargetUserOpenids(request.getFilter());
    
    // 2. 批量推送
    for (String openid : openids) {
        TemplateMessageRequest msgRequest = new TemplateMessageRequest();
        msgRequest.setTemplateCode("SYSTEM_NOTIFICATION");
        msgRequest.setOpenid(openid);
        msgRequest.addData("title", request.getTitle());
        msgRequest.addData("content", request.getContent());
        msgRequest.setPage(request.getPage());
        
        messagePushService.pushTemplateMessage(msgRequest);
    }
}
```

---

### 3. 站内信设计

#### 3.1 数据库表结构

```sql
CREATE TABLE `internal_message` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` bigint NOT NULL COMMENT '接收用户 ID',
  `type` tinyint NOT NULL COMMENT '消息类型 1 系统通知 2 订单通知 3 活动通知',
  `title` varchar(200) NOT NULL COMMENT '消息标题',
  `content` text NOT NULL COMMENT '消息内容',
  `is_read` tinyint DEFAULT '0' COMMENT '是否已读 0 未读 1 已读',
  `read_time` datetime DEFAULT NULL COMMENT '阅读时间',
  `is_deleted` tinyint DEFAULT '0' COMMENT '逻辑删除',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_type` (`type`),
  KEY `idx_is_read` (`is_read`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='站内信表';
```

#### 3.2 站内信服务

```java
@Service
public class InternalMessageService {
    
    @Autowired
    private InternalMessageMapper messageMapper;
    
    /**
     * 发送站内信
     */
    public void sendMessage(Long userId, Integer type, String title, String content) {
        InternalMessage message = new InternalMessage();
        message.setUserId(userId);
        message.setType(type);
        message.setTitle(title);
        message.setContent(content);
        message.setIsRead(0);
        
        messageMapper.insert(message);
    }
    
    /**
     * 获取未读消息数量
     */
    public int getUnreadCount(Long userId) {
        return messageMapper.countUnread(userId);
    }
    
    /**
     * 标记为已读
     */
    public void markAsRead(Long userId, Long messageId) {
        InternalMessage message = messageMapper.selectById(messageId);
        if (message != null && message.getUserId().equals(userId)) {
            message.setIsRead(1);
            message.setReadTime(LocalDateTime.now());
            messageMapper.updateById(message);
        }
    }
}
```

---

### 4. 问题与解决方案

#### 4.1 问题 1: 微信模板 ID 管理混乱

**问题描述**:
多个环境（开发、测试、生产）使用不同的微信模板 ID，容易混淆。

**解决方案**:
- 使用配置中心（Nacos）管理不同环境的模板 ID
- 数据库存储微信模板 ID 时，增加 `environment` 字段区分
- 代码中通过环境配置自动选择正确的模板 ID

```yaml
# Nacos 配置
message:
  template:
    order-created:
      dev: tmpl_dev_xxx123
      test: tmpl_test_xxx123
      prod: tmpl_prod_xxx123
```

#### 4.2 问题 2: 消息推送失败无重试

**问题描述**:
微信接口偶尔超时，导致消息推送失败，用户收不到通知。

**解决方案**:
- 实现重试机制，最多重试 3 次
- 使用 Spring Retry 或自定义重试逻辑
- 重试失败后记录告警日志，人工介入

```java
@Retryable(
    value = {WechatApiException.class},
    maxAttempts = 3,
    backoff = @Backoff(delay = 2000, multiplier = 2)
)
public void pushWithRetry(TemplateMessageRequest request) {
    wechatTemplateService.send(request);
}
```

#### 4.3 问题 3: 站内信数量过多影响查询性能

**问题描述**:
用户站内信积累过多（上千条），查询列表时性能下降。

**解决方案**:
- 分页查询，每页 20 条
- 只展示最近 3 个月的消息
- 提供"一键清空已读"功能
- 定期归档历史消息到冷存储

```java
// 查询最近 3 个月的消息
public Page<InternalMessage> getMessages(Long userId, int page, int size) {
    LocalDateTime threeMonthsAgo = LocalDateTime.now().minusMonths(3);
    
    LambdaQueryWrapper<InternalMessage> wrapper = new LambdaQueryWrapper<>();
    wrapper.eq(InternalMessage::getUserId, userId)
           .eq(InternalMessage::getIsDeleted, 0)
           .ge(InternalMessage::getCreateTime, threeMonthsAgo)
           .orderByDesc(InternalMessage::getCreateTime);
    
    return messageMapper.selectPage(new Page<>(page, size), wrapper);
}
```

#### 4.4 问题 4: 消息推送日志难以追踪

**问题描述**:
推送失败时，难以定位是哪条消息、哪个用户、什么原因。

**解决方案**:
- 建立消息推送日志表，记录完整推送过程
- 包含：请求参数、响应结果、错误信息、重试次数
- 提供后台查询界面，支持按用户、时间、状态筛选

```sql
CREATE TABLE `message_push_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `message_id` varchar(50) NOT NULL COMMENT '消息 ID',
  `template_code` varchar(50) NOT NULL COMMENT '模板编码',
  `openid` varchar(100) NOT NULL COMMENT '接收者 openid',
  `request_data` json DEFAULT NULL COMMENT '请求数据',
  `response_data` json DEFAULT NULL COMMENT '响应数据',
  `status` tinyint DEFAULT '0' COMMENT '状态 0 成功 1 失败',
  `error_message` text COMMENT '错误信息',
  `retry_count` int DEFAULT '0' COMMENT '重试次数',
  `push_time` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_message_id` (`message_id`),
  KEY `idx_openid` (`openid`),
  KEY `idx_push_time` (`push_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息推送日志表';
```

---

### 5. 最佳实践总结

#### 5.1 消息推送

1. **异步处理**: 所有消息推送使用异步，不阻塞主流程
2. **失败重试**: 实现重试机制，提高成功率
3. **日志记录**: 完整记录推送过程，便于追踪
4. **限流保护**: 控制推送频率，避免触发微信限流
5. **用户开关**: 允许用户关闭某些类型的通知

#### 5.2 站内信

1. **分类管理**: 按类型分类，支持筛选
2. **已读标记**: 查看后自动标记已读
3. **定期清理**: 提供清理功能，避免数据膨胀
4. **重要通知**: 重要通知支持站内信 + 订阅消息双通道

#### 5.3 模板管理

1. **统一配置**: 使用配置中心管理模板 ID
2. **环境隔离**: 开发、测试、生产环境隔离
3. **版本控制**: 模板变更走审批流程
4. **监控告警**: 模板消息发送失败率超阈值时告警

---

*清如 V3 · 学习笔记 Day 10* 🌊

**创建日期**: 2026-04-10  
**最后更新**: 2026-04-10  
**关联文档**: 
- [Phase 1 Day 10 进度报告](../progress/2026-04-10-day10-progress.md)
- [API 接口文档](../api/README.md)

---
