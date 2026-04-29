# Week 2 后端问题清单

**生成日期**: 2026-04-04  
**优先级说明**: 
- 🔴 P0 - 严重问题，需立即修复
- 🟠 P1 - 重要问题，建议本周修复
- 🟡 P2 - 一般问题，可下周修复
- 🟢 P3 - 优化建议，有空时处理

---

## 一、RESTful 规范问题（12 处）

### P1 - 接口路径命名不规范

| 序号 | 文件 | 当前路径 | 建议路径 | 说明 |
|------|------|---------|---------|------|
| 1 | HelpDocController | `@PostMapping("/add")` | `@PostMapping("")` | 新增资源 |
| 2 | HelpDocController | `@PutMapping("/update/{id}")` | `@PutMapping("/{id}")` | 更新资源 |
| 3 | HelpDocController | `@DeleteMapping("/delete/{id}")` | `@DeleteMapping("/{id}")` | 删除资源 |
| 4 | SpeciesController | `@PostMapping("/add")` | `@PostMapping("")` | 新增资源 |
| 5 | SpeciesController | `@PutMapping("/update/{id}")` | `@PutMapping("/{id}")` | 更新资源 |
| 6 | SpeciesController | `@DeleteMapping("/delete/{id}")` | `@DeleteMapping("/{id}")` | 删除资源 |
| 7 | NoticeController | `@PostMapping("/add")` | `@PostMapping("")` | 新增资源 |
| 8 | NoticeController | `@PutMapping("/update/{id}")` | `@PutMapping("/{id}")` | 更新资源 |
| 9 | NoticeController | `@DeleteMapping("/delete/{id}")` | `@DeleteMapping("/{id}")` | 删除资源 |
| 10 | OrgManageController | `@PutMapping("/update/{id}")` | `@PutMapping("/{id}")` | 更新资源 |
| 11 | MessageController | `@PostMapping("/template/add")` | `@PostMapping("/template")` | 新增资源 |
| 12 | MessageController | `@PutMapping("/template/update/{id}")` | `@PutMapping("/template/{id}")` | 更新资源 |

**修复建议**:
```java
// 修改前
@PostMapping("/add")
public R<Long> add(@RequestBody HelpDoc helpDoc) { ... }

// 修改后
@PostMapping("")
public R<Long> create(@RequestBody HelpDoc helpDoc) { ... }
```

---

## 二、事务管理问题（3 处）

### P2 - 事务注解使用不当

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | HelpDocService | `addHelpDoc()` | 内存存储不需要事务 | 移除 `@Transactional` |
| 2 | HelpDocService | `updateHelpDoc()` | 内存存储不需要事务 | 移除 `@Transactional` |
| 3 | HelpDocService | `deleteHelpDoc()` | 内存存储不需要事务 | 移除 `@Transactional` |

**修复建议**:
```java
// HelpDocService.java - 移除事务注解
// 原因：使用 ConcurrentHashMap 存储，非数据库操作
public Long addHelpDoc(HelpDoc helpDoc) { ... }
```

---

## 三、性能问题（5 处）

### P1 - 潜在 N+1 查询风险

| 序号 | 文件 | 方法 | 问题描述 | 影响 |
|------|------|------|---------|------|
| 1 | OrgManageService | `getOrgDashboard()` | 多次调用 Mapper 统计方法 | 5 次独立查询 |
| 2 | OrgManageService | `getOrgTodos()` | 多次调用 Mapper 统计方法 | 3 次独立查询 |

**修复建议**:
```java
// 优化前 - 8 次独立查询
dashboard.setPendingOrders(orderMapper.countPendingOrders(orgId));
dashboard.setTodayTasks(orderMapper.countTodayTasks(orgId));
dashboard.setPendingConfirm(orderMapper.countPendingConfirm(orgId));
dashboard.setCompletedOrders(orderMapper.countCompletedOrders(orgId));
// ...

// 优化后 - 1 次聚合查询
OrgDashboard dashboard = orderMapper.getOrgDashboardStats(orgId);
```

### P2 - 缺少缓存机制

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | StatsController | `getDashboard()` | 仪表盘数据频繁查询 | 添加 Redis 缓存（5 分钟） |
| 2 | StatsController | `getTrend()` | 趋势数据计算复杂 | 添加 Redis 缓存（1 小时） |
| 3 | StatsController | `getSpeciesDistribution()` | 物种分布数据稳定 | 添加 Redis 缓存（24 小时） |

### P2 - 导出功能内存风险

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | StatsExportController | `exportOrders()` | 大数据量可能导致 OOM | 限制最大导出行数（如 10000） |

---

## 四、异常处理问题（4 处）

### P1 - 缺少全局异常处理器

**问题描述**: 各 Controller 自行捕获异常，代码重复，错误格式不统一

**修复建议**:
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
}
```

### P2 - 异常信息泄露风险

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | OrgManageController | 所有方法 | 异常信息包含详细错误 | 生产环境隐藏堆栈信息 |
| 2 | HelpDocController | add/update/delete | 直接返回 e.getMessage() | 使用友好错误提示 |
| 3 | FeedbackController | submitFeedback | 直接返回 e.getMessage() | 使用友好错误提示 |

---

## 五、安全性问题（6 处）

### P1 - 缺少参数校验

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | FeedbackController | `submitFeedback()` | 未校验 title/content 长度 | 添加@NotBlank 注解 |
| 2 | SensitiveWordController | `batchImport()` | 未校验导入数量上限 | 限制最大 1000 条 |
| 3 | MessageController | `sendTestMessage()` | 未校验 openid 格式 | 添加格式校验 |

### P2 - 缺少权限控制

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | 所有 Controller | 管理接口 | 未使用权限注解 | 添加@PreAuthorize |
| 2 | OrgManageController | `update()` | 未校验机构权限 | 验证操作人是否有权限 |
| 3 | FeedbackController | `process()` | 未校验管理员权限 | 验证操作人是否为管理员 |

### P3 - 日志敏感信息

| 序号 | 文件 | 方法 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | MessageController | `sendTestMessage()` | 日志记录 openid | openid 脱敏处理 |
| 2 | FeedbackController | `submitFeedback()` | 日志记录用户信息 | 使用 userId 替代详细信息 |

---

## 六、代码质量问题（8 处）

### P2 - 代码注释不完整

| 序号 | 文件 | 位置 | 问题描述 |
|------|------|------|---------|
| 1 | OrgManageService | `getOrgTodos()` | 私有方法缺少注释 |
| 2 | MessageService | 站内信管理方法 | 部分方法缺少参数说明 |
| 3 | StatsService | 未审查 | 需要补充业务逻辑说明 |

### P3 - 魔法数字

| 序号 | 文件 | 位置 | 问题描述 | 建议 |
|------|------|------|---------|------|
| 1 | OrgManageController | `getList()` | 默认页码 1、 pageSize 10 | 定义为常量 |
| 2 | FeedbackService | `getFeedbackList()` | 默认页码 1、pageSize 10 | 定义为常量 |
| 3 | MessageService | 状态值 | 1=未读，2=已读 | 使用枚举 |

### P3 - 重复代码

| 序号 | 文件 | 描述 | 建议 |
|------|------|------|------|
| 1 | 所有 Controller | 异常处理逻辑重复 | 使用全局异常处理器 |
| 2 | 所有 Controller | 日志记录模式重复 | 使用 AOP 统一日志 |
| 3 | 所有 Service | 分页逻辑重复 | 封装通用分页方法 |

---

## 七、架构问题（3 处）

### P1 - 存储策略不统一

**问题描述**: 
- HelpDocService、MessageService 使用 `ConcurrentHashMap` 内存存储
- FeedbackService、OrgManageService 使用 MyBatis 数据库存储

**影响**:
- 开发环境和生产环境行为不一致
- 数据持久化无法保证
- 单元测试困难

**建议**:
```java
// 方案 1: 统一使用数据库（推荐）
// 创建对应的表和 Mapper

// 方案 2: 使用 H2 内存数据库（开发环境）
// 配置 H2 数据源，保持代码不变

// 方案 3: 使用 Repository 模式抽象
interface HelpDocRepository {
    List<HelpDoc> findAll();
    HelpDoc save(HelpDoc doc);
    void deleteById(Long id);
}
```

### P2 - 缺少数据验证层

**问题描述**: 实体类缺少 JSR-303 校验注解

**建议**:
```java
public class Feedback {
    @NotBlank(message = "标题不能为空")
    @Size(max = 100, message = "标题最多 100 字")
    private String title;
    
    @NotBlank(message = "内容不能为空")
    @Size(max = 1000, message = "内容最多 1000 字")
    private String content;
}
```

### P3 - 缺少 DTO/VO 分层

**问题描述**: Controller 直接使用 Entity 作为请求/响应对象

**建议**:
```java
// 请求 DTO
public class FeedbackCreateDTO {
    private String title;
    private String content;
    private String type;
}

// 响应 VO
public class FeedbackVO {
    private Long id;
    private String title;
    private String content;
    private Integer status;
    private Date createTime;
}
```

---

## 八、待补充功能（5 处）

### P2 - 缺失的接口

| 序号 | 模块 | 缺失功能 | 建议 |
|------|------|---------|------|
| 1 | 用户反馈 | 反馈分类统计 | `GET /feedback/statistics` |
| 2 | 用户反馈 | 用户历史反馈查询 | `GET /feedback/user/{userId}` |
| 3 | 消息推送 | 消息发送记录查询 | `GET /message/send-history` |
| 4 | 数据统计 | 导出 CSV 格式 | `GET /export/orders?format=csv` |
| 5 | 内容管理 | 帮助文档搜索 | `GET /content/help/search?q=xxx` |

---

## 九、修复计划

### 第一阶段（Week 3 前完成）- P0/P1 问题

- [ ] 修复 12 处 RESTful 接口命名问题
- [ ] 实现全局异常处理器
- [ ] 优化 OrgManageService 的 N+1 查询
- [ ] 添加关键接口参数校验

### 第二阶段（Week 3 完成）- P2 问题

- [ ] 统一存储策略（数据库或 H2）
- [ ] 添加统计接口缓存
- [ ] 补充缺失的 5 个接口
- [ ] 完善代码注释

### 第三阶段（Week 4 完成）- P3 问题

- [ ] 提取魔法数字为常量/枚举
- [ ] 使用 AOP 统一日志
- [ ] 添加 DTO/VO 分层
- [ ] 补充单元测试

---

## 十、问题统计

| 优先级 | 数量 | 占比 |
|--------|------|------|
| P0 | 0 | 0% |
| P1 | 12 | 26% |
| P2 | 18 | 39% |
| P3 | 16 | 35% |
| **总计** | **46** | **100%** |

---

**负责人**: 待分配  
**预计修复时间**: 6-8 小时  
**实际开始日期**: 待确定  
**实际完成日期**: 待确定
