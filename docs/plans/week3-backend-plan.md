# Week 3 后端开发计划

**计划日期**: 2026-04-04  
**制定人**: AI Agent  
**执行周期**: 2026-04-05 ~ 2026-04-11

---

## 一、Week 3 目标

### 1.1 总体目标

完成 Phase 1 收尾工作，启动 Phase 2 准备工作，确保系统稳定性和可扩展性。

### 1.2 核心任务

| 任务类别 | 工作量 | 优先级 | 状态 |
|---------|-------|--------|------|
| 内容管理系统完善 | 8 小时 | P0 | 待开始 |
| 数据统计 API 完善 | 6 小时 | P0 | 待开始 |
| 消息推送服务完善 | 6 小时 | P1 | 待开始 |
| 用户反馈系统完善 | 4 小时 | P1 | 待开始 |
| Phase 2 技术预研 | 8 小时 | P0 | 待开始 |
| Week 2 问题修复 | 6 小时 | P1 | 待开始 |
| **总计** | **38 小时** | - | - |

---

## 二、详细任务规划

### 2.1 内容管理系统完善（8 小时）

#### 任务 2.1.1: 帮助文档系统数据库化（3 小时）

**背景**: HelpDocService 当前使用 ConcurrentHashMap 内存存储，需改为数据库存储

**工作内容**:
- [ ] 创建 help_doc 表（参考预留脚本）
- [ ] 创建 HelpDocMapper 接口
- [ ] 创建 HelpDocMapper.xml
- [ ] 重构 HelpDocService 使用数据库
- [ ] 添加单元测试
- [ ] 数据迁移（内存数据→数据库）

**技术要点**:
```java
// HelpDocMapper.java
@Mapper
public interface HelpDocMapper {
    List<HelpDoc> selectByCondition(@Param("category") String category,
                                    @Param("keyword") String keyword,
                                    @Param("offset") Integer offset,
                                    @Param("limit") Integer limit);
    HelpDoc selectById(@Param("id") Long id);
    int insert(HelpDoc helpDoc);
    int update(HelpDoc helpDoc);
    int deleteById(@Param("id") Long id);
    List<String> selectCategories();
}
```

**验收标准**:
- ✅ 帮助文档 CRUD 功能正常
- ✅ 分类筛选和关键词搜索功能正常
- ✅ 浏览次数统计功能正常
- ✅ 单元测试覆盖率 > 80%

#### 任务 2.1.2: 敏感词系统数据库化（2 小时）

**背景**: SensitiveWordService 需改为数据库存储

**工作内容**:
- [ ] 创建 sensitive_word 表
- [ ] 创建 SensitiveWordMapper 接口和 XML
- [ ] 重构 SensitiveWordService
- [ ] 添加批量导入优化（分批插入）

**验收标准**:
- ✅ 敏感词 CRUD 功能正常
- ✅ 批量导入支持 1000+ 条
- ✅ 敏感词检测功能正常

#### 任务 2.1.3: 公告系统数据库化（2 小时）

**背景**: NoticeService 需改为数据库存储

**工作内容**:
- [ ] 创建 notice 表
- [ ] 创建 NoticeMapper 接口和 XML
- [ ] 重构 NoticeService
- [ ] 添加公告发布/下架功能

**验收标准**:
- ✅ 公告 CRUD 功能正常
- ✅ 公告状态管理正常
- ✅ 公告列表支持状态筛选

#### 任务 2.1.4: 内容审核功能（1 小时）

**背景**: 新增内容审核功能，确保内容安全

**工作内容**:
- [ ] 创建 ContentAuditService
- [ ] 集成敏感词检测
- [ ] 添加内容审核接口

**API 设计**:
```java
@PostMapping("/content/audit")
public R<AuditResult> auditContent(@RequestBody AuditRequest request) {
    // 敏感词检测
    // 图片 OCR 检测（预留）
    // 返回审核结果
}
```

---

### 2.2 数据统计 API 完善（6 小时）

#### 任务 2.2.1: 仪表盘数据聚合查询优化（2 小时）

**背景**: 解决 OrgManageService.getOrgDashboard() N+1 查询问题

**工作内容**:
- [ ] 创建聚合查询 SQL
- [ ] 修改 OrderProtectMapper
- [ ] 重构 OrgManageService.getOrgDashboard()
- [ ] 性能测试对比

**SQL 优化**:
```sql
SELECT 
    SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END) AS pending_orders,
    SUM(CASE WHEN execute_date = CURDATE() AND status = 1 THEN 1 ELSE 0 END) AS today_tasks,
    SUM(CASE WHEN user_confirm_status = 0 THEN 1 ELSE 0 END) AS pending_confirm,
    SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END) AS completed_orders
FROM order_protect
WHERE org_id = #{orgId};
```

**验收标准**:
- ✅ 查询次数从 8 次降至 2 次
- ✅ 响应时间从 850ms 降至 200ms 以内

#### 任务 2.2.2: 统计接口缓存实现（2 小时）

**背景**: 实现 Redis 缓存，提升统计接口性能

**工作内容**:
- [ ] 配置 RedisTemplate
- [ ] 实现 StatsService 缓存逻辑
- [ ] 添加缓存更新机制
- [ ] 缓存命中率监控

**缓存策略**:
| 接口 | 缓存时间 | 更新策略 |
|------|---------|---------|
| /stats/dashboard | 5 分钟 | 定时刷新 |
| /stats/trend | 1 小时 | 定时刷新 |
| /stats/species-distribution | 24 小时 | 事件触发 |

**验收标准**:
- ✅ 缓存命中率 > 80%
- ✅ 缓存失效时自动刷新
- ✅ 支持手动清除缓存

#### 任务 2.2.3: 新增统计接口（2 小时）

**背景**: 补充缺失的统计接口

**工作内容**:
- [ ] 新增反馈分类统计接口
- [ ] 新增用户行为统计接口
- [ ] 新增机构排名统计接口

**API 设计**:
```java
// 反馈分类统计
@GetMapping("/feedback/statistics")
public R<Map<String, Integer>> getFeedbackStatistics(
    @RequestParam String startDate,
    @RequestParam String endDate);

// 用户行为统计
@GetMapping("/user/activity-statistics")
public R<UserActivityStats> getUserActivityStatistics(
    @RequestParam Long userId,
    @RequestParam String startDate,
    @RequestParam String endDate);

// 机构排名
@GetMapping("/org/ranking")
public R<List<OrgRanking>> getOrgRanking(
    @RequestParam(required = false) Integer limit);
```

---

### 2.3 消息推送服务完善（6 小时）

#### 任务 2.3.1: 站内信系统数据库化（2 小时）

**背景**: MessageService 站内信功能需改为数据库存储

**工作内容**:
- [ ] 创建 internal_message 表
- [ ] 创建 InternalMessageMapper 接口和 XML
- [ ] 重构 MessageService 站内信功能
- [ ] 添加消息已读/未读状态管理

**验收标准**:
- ✅ 站内信 CRUD 功能正常
- ✅ 未读消息数量统计准确
- ✅ 批量操作功能正常

#### 任务 2.3.2: 消息发送异步化（2 小时）

**背景**: 微信消息发送改为异步处理，提升接口响应速度

**工作内容**:
- [ ] 优化 AsyncConfig 配置
- [ ] 创建 messageExecutor 线程池
- [ ] 实现 sendSubscribeMessageAsync 方法
- [ ] 添加失败消息重试机制

**代码实现**:
```java
@Async("messageExecutor")
public void sendSubscribeMessageAsync(String openid, String templateId, Map<String, String> data) {
    try {
        sendSubscribeMessage(openid, templateId, data);
        log.info("消息发送成功，openid: {}", openid);
    } catch (Exception e) {
        log.error("消息发送失败，openid: {}", openid, e);
        // 记录失败消息，支持重试
        saveFailedMessage(openid, templateId, data);
    }
}
```

**验收标准**:
- ✅ 消息发送不阻塞主线程
- ✅ 失败消息自动记录
- ✅ 支持手动重试失败消息

#### 任务 2.3.3: 消息模板管理优化（2 小时）

**背景**: 优化消息模板管理功能

**工作内容**:
- [ ] 新增消息模板分类
- [ ] 新增消息模板预览功能
- [ ] 新增消息发送记录查询

**API 设计**:
```java
// 消息发送记录查询
@GetMapping("/send-history")
public R<List<MessageSendRecord>> getSendHistory(
    @RequestParam(required = false) String openid,
    @RequestParam(required = false) String startDate,
    @RequestParam(required = false) String endDate,
    @RequestParam(required = false) Integer pageNum,
    @RequestParam(required = false) Integer pageSize);
```

---

### 2.4 用户反馈系统完善（4 小时）

#### 任务 2.4.1: 反馈分类统计（1 小时）

**工作内容**:
- [ ] 新增反馈分类统计接口
- [ ] 新增反馈趋势统计接口

**API 设计**:
```java
// 反馈分类统计
@GetMapping("/feedback/category-stats")
public R<Map<String, Integer>> getCategoryStatistics(
    @RequestParam String startDate,
    @RequestParam String endDate);

// 反馈趋势统计
@GetMapping("/feedback/trend")
public R<List<TrendData>> getFeedbackTrend(
    @RequestParam String startDate,
    @RequestParam String endDate,
    @RequestParam(defaultValue = "day") String groupBy);
```

#### 任务 2.4.2: 用户历史反馈查询（1 小时）

**工作内容**:
- [ ] 新增用户历史反馈查询接口
- [ ] 添加 FeedbackMapper 查询方法

**API 设计**:
```java
@GetMapping("/feedback/user/{userId}")
public R<List<Feedback>> getUserFeedbackHistory(
    @PathVariable Long userId,
    @RequestParam(required = false) Integer pageNum,
    @RequestParam(required = false) Integer pageSize);
```

#### 任务 2.4.3: 反馈图片存储优化（2 小时）

**背景**: 当前反馈图片存储方案未明确，需确定存储策略

**工作内容**:
- [ ] 评估本地存储 vs 云存储（MinIO）
- [ ] 实现图片上传接口
- [ ] 实现图片访问接口
- [ ] 添加图片大小/格式限制

**API 设计**:
```java
// 图片上传
@PostMapping("/feedback/image/upload")
public R<List<String>> uploadFeedbackImages(
    @RequestParam("files") MultipartFile[] files);

// 图片访问
@GetMapping("/feedback/image/{filename}")
public void getFeedbackImage(
    @PathVariable String filename,
    HttpServletResponse response);
```

---

### 2.5 Phase 2 技术预研（8 小时）

#### 任务 2.5.1: MinIO 文件存储服务（3 小时）

**背景**: Phase 2 需要支持大规模文件存储，评估 MinIO 方案

**调研内容**:
- [ ] MinIO 架构和特性调研
- [ ] MinIO 与 AWS S3 兼容性分析
- [ ] MinIO 部署方案（Docker/K8s）
- [ ] 成本评估

**技术方案**:
```yaml
# Docker Compose 部署
version: '3.8'
services:
  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: admin
      MINIO_ROOT_PASSWORD: admin123
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
```

**集成方案**:
```java
@Configuration
public class MinioConfig {
    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
            .endpoint("http://localhost:9000")
            .credentials("admin", "admin123")
            .build();
    }
}

@Service
public class MinioFileService {
    @Autowired
    private MinioClient minioClient;
    
    public String uploadFile(MultipartFile file, String bucket, String objectName) {
        // 上传文件到 MinIO
        // 返回文件访问 URL
    }
}
```

**输出文档**: `docs/study-notes/minio-integration-guide.md`

#### 任务 2.5.2: Redis 消息队列（3 小时）

**背景**: Phase 2 需要支持异步任务处理，评估 Redis 消息队列方案

**调研内容**:
- [ ] Redis Stream 特性调研
- [ ] Redis Pub/Sub 对比分析
- [ ] 消息可靠性保证方案
- [ ] 与 RabbitMQ/Kafka 对比

**技术方案**:
```java
// Redis Stream 实现
@Service
public class RedisStreamService {
    @Autowired
    private RedisTemplate<String, Object> redisTemplate;
    
    // 发送消息
    public void send(String stream, Map<String, Object> message) {
        redisTemplate.opsForStream().add(stream, message);
    }
    
    // 消费消息
    @StreamListener("order-stream")
    public void consumeOrderMessage(OrderMessage message) {
        // 处理订单消息
    }
}
```

**输出文档**: `docs/study-notes/redis-message-queue-guide.md`

#### 任务 2.5.3: 定时任务优化（2 小时）

**背景**: 当前使用 Quartz，评估优化方案

**调研内容**:
- [ ] Quartz 集群模式配置
- [ ] Spring Scheduler 对比分析
- [ ] XXL-JOB 分布式任务调度
- [ ] 任务执行监控方案

**优化方案**:
```java
// XXL-JOB 集成
@XxlJob("orderAutoCancelJob")
public void orderAutoCancelJob() throws Exception {
    // 自动取消超时未承接订单
    orderService.autoCancelUnclaimedOrders();
}
```

**输出文档**: `docs/study-notes/scheduler-optimization-guide.md`

---

### 2.6 Week 2 问题修复（6 小时）

#### 任务 2.6.1: RESTful 接口命名修复（2 小时）

**修复清单**:
- [ ] HelpDocController: /add → /, /update/{id} → /{id}, /delete/{id} → /{id}
- [ ] SpeciesController: 同上
- [ ] NoticeController: 同上
- [ ] OrgManageController: /update/{id} → /{id}
- [ ] MessageController: /template/add → /template, /template/update/{id} → /template/{id}

#### 任务 2.6.2: 全局异常处理器实现（2 小时）

**工作内容**:
- [ ] 创建 GlobalExceptionHandler
- [ ] 定义统一错误码
- [ ] 移除 Controller 中的重复异常处理

**代码实现**:
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(RuntimeException.class)
    public R<Void> handleRuntimeException(RuntimeException e) {
        log.error("业务异常", e);
        return R.fail(e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public R<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return R.fail("系统繁忙，请稍后重试");
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public R<Void> handleIllegalArgumentException(IllegalArgumentException e) {
        return R.fail(e.getMessage());
    }
}
```

#### 任务 2.6.3: 参数校验优化（2 小时）

**工作内容**:
- [ ] 添加 JSR-303 校验依赖
- [ ] 在 DTO 上添加校验注解
- [ ] 在 Controller 上添加@Valid 注解

**代码实现**:
```java
public class FeedbackCreateDTO {
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题最多 100 字")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    @Size(max = 1000, message = "内容最多 1000 字")
    private String content;
}

@PostMapping("")
public R<Long> create(@Valid @RequestBody FeedbackCreateDTO dto) {
    // ...
}
```

---

## 三、技术预研输出

### 3.1 文档清单

| 文档名称 | 内容 | 预计字数 |
|---------|------|---------|
| minio-integration-guide.md | MinIO 集成指南 | 3000 |
| redis-message-queue-guide.md | Redis 消息队列指南 | 3000 |
| scheduler-optimization-guide.md | 定时任务优化指南 | 2000 |
| phase2-architecture-design.md | Phase 2 架构设计 | 5000 |

### 3.2 代码 Demo

| Demo 名称 | 功能 | 状态 |
|---------|------|------|
| minio-file-upload-demo | MinIO 文件上传 | 待创建 |
| redis-stream-demo | Redis Stream 消息队列 | 待创建 |
| xxl-job-demo | XXL-JOB 任务调度 | 待创建 |

---

## 四、验收标准

### 4.1 功能验收

- [ ] 内容管理系统：帮助文档、敏感词、公告系统数据库化完成
- [ ] 数据统计 API: N+1 查询优化完成，缓存功能正常
- [ ] 消息推送服务：站内信数据库化，消息发送异步化
- [ ] 用户反馈系统：统计接口、历史查询、图片存储完成

### 4.2 质量验收

- [ ] 代码审查问题修复率 > 90%
- [ ] 单元测试覆盖率 > 80%
- [ ] 接口响应时间 P99 < 500ms
- [ ] 无 P0/P1 级别 Bug

### 4.3 文档验收

- [ ] 技术预研文档完成 4 篇
- [ ] API 文档更新完成
- [ ] 部署文档更新完成

### 4.4 Git 提交

- [ ] Git 提交次数 ≥ 10 次
- [ ] 提交信息规范（feat/fix/docs/refactor）
- [ ] 代码 Review 完成

---

## 五、风险与应对

### 5.1 技术风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| MinIO 集成复杂度高 | 延期 | 中 | 提前调研，准备备选方案（阿里云 OSS） |
| Redis 缓存一致性问题 | 数据错误 | 中 | 设计合理的缓存更新策略 |
| 异步消息丢失 | 用户体验 | 低 | 实现消息持久化和重试机制 |

### 5.2 进度风险

| 风险 | 影响 | 概率 | 应对措施 |
|------|------|------|---------|
| Week 2 问题修复耗时超预期 | 延期 | 中 | 优先修复 P0/P1 问题，P2/P3 延后 |
| 技术预研深度不足 | 质量下降 | 中 | 明确预研目标，控制时间投入 |
| 需求变更 | 延期 | 低 | 与产品确认需求，避免中途变更 |

---

## 六、每日计划

### Day 15（周一）
- [ ] 内容管理系统数据库化（help_doc 表）
- [ ] 敏感词系统数据库化
- [ ] Git 提交 2 次

### Day 16（周二）
- [ ] 公告系统数据库化
- [ ] 内容审核功能
- [ ] 仪表盘数据聚合查询优化
- [ ] Git 提交 2 次

### Day 17（周三）
- [ ] 统计接口缓存实现
- [ ] 新增统计接口
- [ ] 站内信系统数据库化
- [ ] Git 提交 2 次

### Day 18（周四）
- [ ] 消息发送异步化
- [ ] 消息模板管理优化
- [ ] 反馈分类统计
- [ ] Git 提交 2 次

### Day 19（周五）
- [ ] 用户历史反馈查询
- [ ] 反馈图片存储优化
- [ ] RESTful 接口命名修复
- [ ] Git 提交 2 次

### Day 20（周六）
- [ ] 全局异常处理器实现
- [ ] 参数校验优化
- [ ] MinIO 技术预研
- [ ] Git 提交 2 次

### Day 21（周日）
- [ ] Redis 消息队列预研
- [ ] 定时任务优化预研
- [ ] Week 3 总结文档
- [ ] Git 提交 2 次

---

## 七、资源需求

### 7.1 人力资源

| 角色 | 人数 | 职责 |
|------|------|------|
| 后端开发 | 1 | 全部任务执行 |
| 代码 Review | 1 | 代码审查和质量把控 |

### 7.2 环境资源

| 资源 | 规格 | 用途 |
|------|------|------|
| Redis | 2GB | 缓存和消息队列 |
| MinIO | 10GB | 文件存储测试 |
| MySQL | - | 数据库（已有） |

---

## 八、总结

Week 3 是 Phase 1 的收官之周，核心目标是：

1. **完善功能**: 将 Week 2 的内存存储改为数据库存储，确保数据持久化
2. **性能优化**: 解决 N+1 查询问题，实现缓存策略
3. **质量提升**: 修复 Week 2 代码审查发现的问题
4. **技术储备**: 为 Phase 2 进行技术预研和方案设计

预计 Week 3 结束后，系统将具备：
- ✅ 完整的数据持久化能力
- ✅ 良好的性能表现（P99 < 500ms）
- ✅ 规范的代码质量
- ✅ Phase 2 技术方案储备

---

**相关文档**:
- Week 2 代码审查报告：`backend-week2-review.md`
- Week 2 问题清单：`backend-issues-list-week2.md`
- Week 2 性能优化报告：`backend-week2-optimization.md`
- Phase 2 架构设计：`phase2-architecture-design.md`（待创建）
