# 后端代码问题清单

**生成日期**: 2026-04-04  
**优先级说明**: 🔴 高 | 🟡 中 | 🟢 低

---

## 一、事务管理问题（🔴 高优先级）

### Issue #001: OrderService.confirmOrder() 缺少事务
- **文件**: `OrderService.java`
- **方法**: `confirmOrder()`
- **风险**: 订单状态更新和证书生成不在同一事务中，可能导致数据不一致
- **修复**:
```java
@Transactional
public void confirmOrder(String orderNo, Integer score, String comment) {
    // ...
}
```

### Issue #002: OrderService.updateOrderStatus() 缺少事务
- **文件**: `OrderService.java`
- **方法**: `updateOrderStatus()`
- **风险**: 订单状态流转可能部分成功
- **修复**: 添加 `@Transactional` 注解

### Issue #003: SettlementService.createSettlement() 缺少事务
- **文件**: `SettlementService.java`
- **方法**: `createSettlement()`
- **风险**: 结算单创建和订单状态更新可能不一致
- **修复**: 添加 `@Transactional` 注解

### Issue #004: SettlementService.confirmSettlement() 缺少事务
- **文件**: `SettlementService.java`
- **方法**: `confirmSettlement()`
- **风险**: 结算确认和订单状态更新可能不一致
- **修复**: 添加 `@Transactional` 注解

### Issue #005: SettlementService.batchSettle() 缺少事务
- **文件**: `SettlementService.java`
- **方法**: `batchSettle()`
- **风险**: 批量结算部分成功会导致数据不一致
- **修复**: 添加 `@Transactional` 注解

### Issue #006: CertificateService.generatePaidCertificate() 缺少事务
- **文件**: `CertificateService.java`
- **方法**: `generatePaidCertificate()`
- **风险**: 证书生成失败不影响订单状态
- **修复**: 添加 `@Transactional` 注解

---

## 二、数据库索引问题（🔴 高优先级）

### Issue #007: order_protect 表缺少索引
- **表名**: `order_protect`
- **缺失索引**:
  - `idx_order_status` (status, create_time)
  - `idx_org_status` (org_id, status)
- **影响**: 订单列表查询、状态筛选查询慢
- **修复**: 执行 `docs/optimization/database-indexes.sql`

### Issue #008: volunteer 表缺少索引
- **表名**: `volunteer`
- **缺失索引**: `idx_volunteer_org` (org_id, status)
- **影响**: 机构志愿者列表查询慢
- **修复**: 执行索引优化脚本

### Issue #009: settlement 表缺少索引
- **表名**: `settlement`
- **缺失索引**: `idx_settlement_status` (status, org_id)
- **影响**: 结算单列表查询慢
- **修复**: 执行索引优化脚本

### Issue #010: task_execute 表缺少索引
- **表名**: `task_execute`
- **缺失索引**: `idx_task_volunteer` (volunteer_id, status)
- **影响**: 志愿者执行记录查询慢
- **修复**: 执行索引优化脚本

### Issue #011: protect_record 表缺少索引
- **表名**: `protect_record`
- **缺失索引**: `idx_record_user` (user_openid, create_time)
- **影响**: 用户护生记录查询慢
- **修复**: 执行索引优化脚本

---

## 三、性能优化问题（🟡 中优先级）

### Issue #012: VolunteerService 存在 N+1 查询
- **文件**: `VolunteerService.java`
- **方法**: `getVolunteerDetail()`
- **问题**: 每次查询触发 4 次数据库查询
- **修复方案**:
```java
// 方案 1: 使用 JOIN 查询
@Select("SELECT v.*, COUNT(te.id) as totalTasks, SUM(te.service_hours) as serviceHours " +
        "FROM volunteer v " +
        "LEFT JOIN task_execute te ON v.id = te.volunteer_id " +
        "WHERE v.id = #{id}")
Volunteer selectWithStats(Long id);

// 方案 2: 批量查询
List<TaskExecute> tasks = taskExecuteMapper.selectByVolunteerIds(Arrays.asList(volunteerId));
```

### Issue #013: 未使用 PageHelper 统一管理分页
- **文件**: 多个 Service
- **问题**: 手动计算 offset，代码重复
- **修复**:
```java
// 引入 PageHelper
PageHelper.startPage(pageNum, pageSize);
List<OrderProtect> list = orderMapper.selectByUserId(userId, status);
PageInfo<OrderProtect> pageInfo = new PageInfo<>(list);
```

### Issue #014: Redis 缓存使用不足
- **文件**: 多个 Service
- **问题**: 频繁查询数据库，未利用 Redis 缓存
- **建议缓存的数据**:
  - 用户信息（30 分钟）
  - 志愿者信息（30 分钟）
  - 订单详情（10 分钟）
  - 统计数据（5 分钟）

### Issue #015: 定时任务频率过高
- **文件**: `OrderService.java`
- **方法**: `autoCancelUnclaimedOrders()`
- **问题**: 每小时执行一次，频率过高
- **修复**:
```java
@Scheduled(cron = "0 0 */4 * * ?") // 每 4 小时执行一次
```

---

## 四、异常处理问题（🟡 中优先级）

### Issue #016: 缺少全局异常处理器
- **文件**: 不存在
- **问题**: 每个 Controller 都重复 try-catch
- **修复**: 创建全局异常处理器
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(BusinessException.class)
    public R<Void> handleBusinessException(BusinessException e) {
        log.error("业务异常", e);
        return R.fail(e.getMessage());
    }
    
    @ExceptionHandler(Exception.class)
    public R<Void> handleException(Exception e) {
        log.error("系统异常", e);
        return R.fail("系统错误，请稍后重试");
    }
}
```

### Issue #017: 缺少自定义异常类
- **文件**: 不存在
- **问题**: 使用 RuntimeException 不够语义化
- **修复**: 创建自定义异常类
```java
public class BusinessException extends RuntimeException {
    public BusinessException(String message) {
        super(message);
    }
}

public class OrderNotFoundException extends BusinessException {
    public OrderNotFoundException(String orderNo) {
        super("订单不存在：" + orderNo);
    }
}
```

### Issue #018: 异常日志不完整
- **文件**: 多个 Controller
- **问题**: 部分异常未记录堆栈信息
- **修复**: 确保所有 catch 块都记录完整异常
```java
catch (Exception e) {
    log.error("操作失败，param={}", param, e); // 记录参数和堆栈
    return R.fail("失败：" + e.getMessage());
}
```

---

## 五、代码规范问题（🟢 低优先级）

### Issue #019: 硬编码魔法值
- **文件**: 多个 Service
- **问题**: 订单状态使用数字硬编码
- **修复**: 创建枚举类
```java
public enum OrderStatus {
    PENDING_ACCEPT(1, "待承接"),
    PENDING_EXECUTE(2, "待执行"),
    EXECUTING(3, "执行中"),
    PENDING_CONFIRM(4, "待确认"),
    COMPLETED(5, "已完成"),
    CANCELLED(6, "已取消");
    
    private final int code;
    private final String desc;
}
```

### Issue #020: Controller 中定义内嵌请求类
- **文件**: `OrderController.java`
- **问题**: `PayRequest`, `ConfirmRequest` 定义为静态内部类
- **修复**: 提取为独立 DTO 类
```
com.ruoyi.qingru.dto.OrderPayRequest
com.ruoyi.qingru.dto.OrderConfirmRequest
```

### Issue #021: TODO 注释未处理
- **文件**: `OrderService.java`
- **位置**: 
  - `refundOrder()` - 退款逻辑
  - `applyReview()` - 复核记录创建
- **修复**: 实现待办功能或创建 Issue 跟踪

### Issue #022: 缺少参数验证
- **文件**: 多个 Controller
- **问题**: 未使用 `@Validated` 验证请求参数
- **修复**:
```java
@PostMapping("/create")
public R<OrderProtect> createOrder(@Validated @RequestBody OrderProtect order) {
    // ...
}
```

---

## 六、日志问题（🟢 低优先级）

### Issue #023: 缺少关键业务日志
- **文件**: `OrderService.java`
- **缺失日志**:
  - 订单状态流转详情（从 X 到 Y）
  - 支付金额日志
  - 证书生成文件路径
- **修复**: 补充详细日志

### Issue #024: 日志级别使用不当
- **文件**: 多个 Service
- **问题**: 所有日志都用 info 级别
- **修复**:
```java
log.debug("调试信息");  // 详细调试
log.info("业务操作");   // 关键业务节点
log.warn("警告信息");   // 可恢复的异常
log.error("错误信息");  // 不可恢复的异常
```

---

## 七、单元测试问题（🟡 中优先级）

### Issue #025: Service 层测试覆盖率低
- **当前覆盖率**: ~40%
- **缺失测试**:
  - OrderService 核心方法
  - 事务回滚测试
  - 异常场景测试
- **建议**: 补充至少 10 个 Service 测试用例

### Issue #026: 缺少集成测试
- **问题**: 未测试完整的业务流程
- **建议**: 创建集成测试
```java
@SpringBootTest
public class OrderIntegrationTest {
    @Test
    public void testCompleteOrderFlow() {
        // 创建订单 -> 支付 -> 承接 -> 执行 -> 确认 -> 结算
    }
}
```

### Issue #027: 缺少 Mock 测试
- **问题**: 测试依赖真实数据库
- **建议**: 使用 Mockito Mock 外部依赖
```java
@MockBean
private WxMaService wxMaService;

@Test
public void testPayOrder() {
    when(wxMaService.createOrder(any())).thenReturn(payParams);
    // ...
}
```

---

## 八、安全问题（🟡 中优先级）

### Issue #028: 敏感信息日志泄露风险
- **文件**: 多个 Service
- **问题**: 可能记录用户敏感信息（手机号、身份证）
- **修复**: 敏感信息脱敏
```java
log.info("用户下单，userId={}, phone={}", userId, mask(phone));

private String mask(String phone) {
    return phone.replaceAll("(\\d{3})\\d{4}(\\d{4})", "$1****$2");
}
```

### Issue #029: 缺少接口权限验证
- **文件**: 多个 Controller
- **问题**: 未验证用户权限
- **修复**: 添加权限注解
```java
@RequiresPermissions("order:create")
@PostMapping("/create")
public R<OrderProtect> createOrder(...) {
    // ...
}
```

---

## 九、配置问题（🟢 低优先级）

### Issue #030: 数据库连接池配置待优化
- **文件**: `application-druid.yml`
- **当前配置**:
  - initialSize: 5
  - minIdle: 10
  - maxActive: 20
- **建议**: 根据实际负载调整
  - 开发环境：maxActive=20
  - 生产环境：maxActive=100+

### Issue #031: Redis 连接池配置待优化
- **文件**: `application.yml`
- **当前配置**:
  - max-active: 8
  - max-idle: 8
  - min-idle: 0
- **建议**: 生产环境增加连接数

---

## 十、问题统计

| 优先级 | 数量 | 占比 |
|--------|------|------|
| 🔴 高 | 11 | 37% |
| 🟡 中 | 11 | 37% |
| 🟢 低 | 8 | 26% |
| **总计** | **30** | 100% |

---

## 十一、修复计划

### Week 1 修复（高优先级）
- [ ] Issue #001-#006: 添加事务注解
- [ ] Issue #007-#011: 创建数据库索引
- [ ] Issue #012: 优化 N+1 查询

### Week 2 修复（中优先级）
- [ ] Issue #016-#018: 完善异常处理
- [ ] Issue #013-#014: 性能优化
- [ ] Issue #025-#027: 补充单元测试

### Week 3 修复（低优先级）
- [ ] Issue #019-#022: 代码规范优化
- [ ] Issue #023-#024: 日志优化
- [ ] Issue #030-#031: 配置优化

---

**清单生成时间**: 2026-04-04 15:35  
**负责人**: 后端开发团队
