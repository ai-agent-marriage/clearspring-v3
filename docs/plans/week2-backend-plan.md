# Week 2 后端开发计划

**制定日期**: 2026-04-04  
**执行周期**: 2026-04-05 ~ 2026-04-11  
**负责人**: 后端开发团队

---

## 一、Week 1 回顾

### 1.1 完成情况
- ✅ 代码审查完成（41 个接口）
- ✅ 问题清单整理（30 个 Issue）
- ✅ 数据库索引优化脚本创建
- ✅ 连接池配置优化

### 1.2 遗留问题
- 🔴 高优先级 Issue 11 个（待修复）
- 🟡 中优先级 Issue 11 个（计划 Week 2 修复）
- 🟢 低优先级 Issue 8 个（计划 Week 3 修复）

---

## 二、Week 2 核心任务

### 2.1 内容管理系统开发（3 天）

#### 任务描述
开发后台内容管理功能，支持运营人员管理物种信息、公告、帮助文档等。

#### 功能清单
| 模块 | 功能 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 物种管理 | 物种列表查询 | 🔴 高 | 2h |
| 物种管理 | 物种详情查看 | 🔴 高 | 1h |
| 物种管理 | 物种创建/编辑 | 🔴 高 | 3h |
| 物种管理 | 物种上架/下架 | 🔴 高 | 2h |
| 物种管理 | 物种图片管理 | 🟡 中 | 2h |
| 公告管理 | 公告列表查询 | 🔴 高 | 1h |
| 公告管理 | 公告发布/编辑 | 🔴 高 | 2h |
| 公告管理 | 公告删除/恢复 | 🟡 中 | 1h |
| 帮助文档 | 文档分类管理 | 🟡 中 | 2h |
| 帮助文档 | 文档 CRUD | 🟡 中 | 3h |

#### 技术实现
- **框架**: Spring Boot + MyBatis
- **权限**: 基于角色的访问控制（RBAC）
- **缓存**: Redis 缓存物种列表
- **图片**: 本地存储（Week 3 迁移到 MinIO）

#### 输出物
- `SpeciesAdminController.java` - 物种管理 Controller
- `SpeciesAdminService.java` - 物种管理 Service
- `NoticeController.java` - 公告管理 Controller
- `HelpDocController.java` - 帮助文档 Controller
- 数据库表：`admin_notice`, `admin_help_doc`

---

### 2.2 数据统计 API 完善（2 天）

#### 任务描述
完善数据统计接口，支持多维度数据分析和可视化展示。

#### 功能清单
| 模块 | 功能 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 仪表盘 | 核心指标统计 | 🔴 高 | 3h |
| 仪表盘 | 实时数据更新 | 🟡 中 | 2h |
| 趋势分析 | 订单趋势（日/周/月） | 🔴 高 | 3h |
| 趋势分析 | 用户增长趋势 | 🔴 高 | 2h |
| 趋势分析 | 收入趋势 | 🔴 高 | 2h |
| 排行统计 | 机构排行 | 🟡 中 | 2h |
| 排行统计 | 志愿者排行 | 🟡 中 | 2h |
| 地域分析 | 用户地域分布 | 🟢 低 | 2h |

#### 技术实现
- **缓存策略**: 统计数据缓存 5 分钟
- **定时任务**: 每小时预计算统计数据
- **SQL 优化**: 使用物化视图或中间表

#### 输出物
- `StatisticsAdminController.java` - 后台统计 Controller
- `StatisticsAdminService.java` - 后台统计 Service
- `admin_statistics_daily` - 每日统计表
- `admin_statistics_monthly` - 每月统计表

---

### 2.3 消息推送服务（1.5 天）

#### 任务描述
实现统一消息推送服务，支持微信模板消息、短信、站内信。

#### 功能清单
| 模块 | 功能 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 模板消息 | 订单状态变更通知 | 🔴 高 | 3h |
| 模板消息 | 支付成功通知 | 🔴 高 | 2h |
| 模板消息 | 任务提醒通知 | 🟡 中 | 2h |
| 站内信 | 站内信发送 | 🟡 中 | 2h |
| 站内信 | 站内信列表 | 🟡 中 | 1h |
| 站内信 | 站内信已读标记 | 🟡 中 | 1h |

#### 技术实现
- **消息队列**: Redis List 实现简单队列
- **模板管理**: 数据库存储消息模板
- **推送记录**: 记录推送历史和状态

#### 输出物
- `MessagePushService.java` - 消息推送 Service
- `MessageTemplate.java` - 消息模板实体
- `UserMessage.java` - 站内信实体
- `message_template` - 消息模板表
- `user_message` - 站内信表

---

### 2.4 文件上传服务（1.5 天）

#### 任务描述
实现文件上传服务，支持图片、视频上传，为 Week 3 MinIO 迁移做准备。

#### 功能清单
| 模块 | 功能 | 优先级 | 预计工时 |
|------|------|--------|----------|
| 本地上传 | 图片上传 | 🔴 高 | 2h |
| 本地上传 | 图片压缩 | 🟡 中 | 2h |
| 本地上传 | 图片水印 | 🟢 低 | 2h |
| 本地上传 | 视频上传 | 🟡 中 | 2h |
| 文件管理 | 文件列表查询 | 🟡 中 | 1h |
| 文件管理 | 文件删除 | 🟡 中 | 1h |

#### 技术实现
- **存储**: 本地文件系统（Week 3 迁移 MinIO）
- **压缩**: Thumbnailator 图片压缩
- **安全**: 文件类型校验、大小限制

#### 输出物
- `FileUploadController.java` - 文件上传 Controller
- `FileUploadService.java` - 文件上传 Service
- `system_file` - 文件记录表

---

## 三、技术预研任务

### 3.1 MinIO 文件存储服务（2 小时）

#### 预研内容
1. MinIO 部署方案（Docker/独立部署）
2. Java SDK 集成
3. 权限配置（Bucket Policy）
4. 图片处理（缩略图、水印）

#### 输出物
- `docs/research/minio-integration-plan.md` - MinIO 集成方案

#### 参考代码
```java
// MinIO 配置
@Configuration
public class MinioConfig {
    @Value("${minio.endpoint}")
    private String endpoint;
    
    @Value("${minio.accessKey}")
    private String accessKey;
    
    @Value("${minio.secretKey}")
    private String secretKey;
    
    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(endpoint)
                .credentials(accessKey, secretKey)
                .build();
    }
}
```

---

### 3.2 Redis 消息队列（2 小时）

#### 预研内容
1. Redis List 实现简单队列
2. Redis Stream 实现可靠队列
3. 消息重试机制
4. 死信队列处理

#### 输出物
- `docs/research/redis-queue-plan.md` - Redis 队列方案

#### 参考代码
```java
// Redis 消息推送
@Service
public class RedisMessageQueue {
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    // 发送消息
    public void send(String queue, String message) {
        redisTemplate.opsForList().rightPush(queue, message);
    }
    
    // 消费消息
    public String receive(String queue) {
        return redisTemplate.opsForList().leftPop(queue);
    }
}
```

---

### 3.3 定时任务优化（2 小时）

#### 预研内容
1. Spring @Scheduled 优化
2. XXL-JOB 分布式任务调度
3. 任务执行日志
4. 任务失败告警

#### 输出物
- `docs/research/scheduled-task-plan.md` - 定时任务优化方案

#### 当前问题
- 订单自动取消任务每小时执行，频率过高
- 缺少任务执行日志
- 缺少失败重试机制

#### 优化建议
```java
// 优化后
@Scheduled(cron = "0 0 */4 * * ?") // 每 4 小时执行
@Transactional
public void autoCancelUnclaimedOrders() {
    log.info("开始执行自动取消未承接订单任务");
    try {
        // 业务逻辑
    } catch (Exception e) {
        log.error("自动取消订单失败", e);
        // 发送告警
    }
}
```

---

## 四、Week 1 遗留 Issue 修复计划

### 4.1 高优先级 Issue（必须修复）

| Issue | 内容 | 预计工时 | 负责人 |
|-------|------|----------|--------|
| #001-#006 | 添加事务注解 | 2h | 后端团队 |
| #007-#011 | 创建数据库索引 | 1h | DBA |
| #012 | 优化 N+1 查询 | 3h | 后端团队 |

### 4.2 中优先级 Issue（计划修复）

| Issue | 内容 | 预计工时 | 负责人 |
|-------|------|----------|--------|
| #016-#018 | 完善异常处理 | 3h | 后端团队 |
| #013-#014 | 性能优化 | 2h | 后端团队 |
| #025-#027 | 补充单元测试 | 4h | 测试团队 |

---

## 五、里程碑

| 日期 | 里程碑 | 交付物 |
|------|--------|--------|
| 04-06 | 内容管理系统完成 | Species/Notice/HelpDoc API |
| 04-08 | 数据统计 API 完成 | Statistics API + 统计表 |
| 04-09 | 消息推送服务完成 | MessagePush Service |
| 04-10 | 文件上传服务完成 | FileUpload API |
| 04-11 | 技术预研完成 | 3 份预研文档 |

---

## 六、风险与应对

### 6.1 技术风险
| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| MinIO 集成复杂 | 中 | 中 | 提前预研，准备备选方案（阿里云 OSS） |
| 消息推送延迟 | 中 | 高 | 使用可靠队列，增加重试机制 |
| 统计数据不准确 | 低 | 高 | 增加数据校验，定时对账 |

### 6.2 进度风险
| 风险 | 概率 | 影响 | 应对措施 |
|------|------|------|----------|
| 需求变更 | 中 | 中 | 每日站会同步进度，及时调整 |
| 人员请假 | 低 | 中 | 交叉培训，确保多人熟悉模块 |

---

## 七、资源需求

### 7.1 人力资源
- 后端开发：2 人
- 测试：1 人
- DBA：0.5 人

### 7.2 服务器资源
- 开发环境：1 台（已有）
- 测试环境：1 台（已有）
- MinIO 服务器：1 台（新增）

---

## 八、验收标准

### 8.1 功能验收
- ✅ 所有 API 接口通过 Postman 测试
- ✅ 前端联调通过
- ✅ 核心业务流程跑通

### 8.2 质量验收
- ✅ 单元测试覆盖率 > 70%
- ✅ 代码审查通过
- ✅ 无高优先级 Bug

### 8.3 性能验收
- ✅ API 响应时间 < 500ms
- ✅ 数据库查询使用索引
- ✅ Redis 缓存命中率 > 80%

---

## 九、附录

### 9.1 相关文档
- [Week 1 代码审查报告](./review/backend-week1-review.md)
- [后端问题清单](./review/backend-issues-list.md)
- [数据库索引优化脚本](./optimization/database-indexes.sql)

### 9.2 技术文档
- [MinIO 官方文档](https://min.io/docs/minio/linux/index.html)
- [Redis 官方文档](https://redis.io/documentation)
- [Spring Boot 官方文档](https://spring.io/projects/spring-boot)

---

**计划制定时间**: 2026-04-04 15:45  
**计划审核**: 待审核  
**计划状态**: 草稿
