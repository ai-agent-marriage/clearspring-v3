# 订单状态流转设计学习笔记

> 学习时间：2026-04-04  
> 学习主题：订单状态机设计与实现  
> 适用范围：护生订单系统

---

## 一、订单状态定义

### 1.1 状态枚举

| 状态值 | 状态名称 | 说明 |
|--------|----------|------|
| 1 | 待承接 | 订单已创建，等待机构承接 |
| 2 | 待执行 | 机构已承接，等待志愿者执行 |
| 3 | 执行中 | 志愿者正在执行护生任务 |
| 4 | 待确认 | 执行完成，等待用户确认 |
| 5 | 已完成 | 用户已确认，订单完成 |
| 6 | 已结算 | 订单已结算（含已取消） |

### 1.2 状态流转图

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│   1 待承接 ──────→ 2 待执行 ──────→ 3 执行中               │
│      │                │                  │                  │
│      │                │                  ↓                  │
│      │                │            4 待确认                 │
│      │                │                  │                  │
│      ↓                ↓                  ↓                  │
│   6 已取消 ←────────────────────── 5 已完成                 │
│      ↑                               │                      │
│      └───────────────────────────────┘                      │
│                    (T+7 自动结算)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 二、状态流转规则

### 2.1 合法流转矩阵

| 从状态 \ 到状态 | 1 | 2 | 3 | 4 | 5 | 6 |
|----------------|---|---|---|---|---|---|
| **1 待承接** | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| **2 待执行** | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ |
| **3 执行中** | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| **4 待确认** | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| **5 已完成** | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| **6 已结算** | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.2 流转说明

1. **待承接 → 待执行**: 机构承接订单
2. **待承接 → 已取消**: 用户取消或 48 小时超时
3. **待执行 → 执行中**: 志愿者开始执行任务
4. **待执行 → 已取消**: 特殊情况取消
5. **执行中 → 待确认**: 志愿者执行完成
6. **待确认 → 已完成**: 用户确认收货
7. **已完成 → 已结算**: T+7 自动结算

---

## 三、核心代码实现

### 3.1 状态流转验证

```java
private boolean isValidStatusTransition(Integer fromStatus, Integer toStatus) {
    Map<Integer, List<Integer>> validTransitions = new HashMap<>();
    validTransitions.put(1, Arrays.asList(2, 6));  // 待承接 → 待执行/已取消
    validTransitions.put(2, Arrays.asList(3, 6));  // 待执行 → 执行中/已取消
    validTransitions.put(3, Arrays.asList(4));     // 执行中 → 待确认
    validTransitions.put(4, Arrays.asList(5));     // 待确认 → 已完成
    validTransitions.put(5, Arrays.asList(6));     // 已完成 → 已结算
    
    return validTransitions.getOrDefault(fromStatus, new ArrayList<>())
                           .contains(toStatus);
}
```

### 3.2 状态更新方法

```java
@Transactional
public void updateOrderStatus(String orderNo, Integer newStatus) {
    OrderProtect order = orderMapper.selectByOrderNo(orderNo);
    if (order == null) {
        throw new RuntimeException("订单不存在");
    }
    
    if (!isValidStatusTransition(order.getStatus(), newStatus)) {
        throw new RuntimeException("订单状态流转不合法");
    }
    
    order.setStatus(newStatus);
    if (newStatus == 5) { // 已完成
        order.setCompleteTime(new Date());
    }
    
    orderMapper.update(order);
}
```

---

## 四、定时任务设计

### 4.1 自动取消未承接订单

**需求**: 订单创建后 48 小时内无机构承接，自动取消并触发退款

**实现**:
```java
@Scheduled(cron = "0 0 * * * ?") // 每小时执行一次
public void autoCancelUnclaimedOrders() {
    List<OrderProtect> orders = orderMapper.selectUnclaimedOrders();
    
    for (OrderProtect order : orders) {
        long hoursSinceCreate = (System.currentTimeMillis() - 
                                  order.getCreateTime().getTime()) / (1000 * 60 * 60);
        if (hoursSinceCreate > 48) {
            updateOrderStatus(order.getOrderNo(), 6);
            refundOrder(order.getOrderNo());
        }
    }
}
```

**注意事项**:
1. 定时任务需要幂等性，避免重复执行
2. 退款逻辑需要事务保证
3. 需要记录取消原因，便于后续追踪

---

## 五、数据库设计

### 5.1 订单表核心字段

```sql
CREATE TABLE order_protect (
    order_no VARCHAR(32) PRIMARY KEY COMMENT '订单号',
    user_id BIGINT NOT NULL COMMENT '用户 ID',
    org_id BIGINT COMMENT '承接机构 ID',
    volunteer_id BIGINT COMMENT '执行志愿者 ID',
    species_id BIGINT NOT NULL COMMENT '物种 ID',
    quantity INT NOT NULL COMMENT '数量',
    amount DECIMAL(10,2) NOT NULL COMMENT '订单金额',
    status INT NOT NULL DEFAULT 1 COMMENT '状态：1 待承接 2 待执行 3 执行中 4 待确认 5 已完成 6 已结算',
    address VARCHAR(255) COMMENT '护生地点',
    pay_time DATETIME COMMENT '支付时间',
    complete_time DATETIME COMMENT '完成时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 5.2 机构承接记录表

```sql
CREATE TABLE org_order (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    org_id BIGINT NOT NULL COMMENT '机构 ID',
    status INT NOT NULL DEFAULT 1 COMMENT '承接状态 1 待承接 2 已承接',
    accept_time DATETIME COMMENT '承接时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_no (order_no),
    INDEX idx_org_id (org_id)
);
```

### 5.3 志愿者任务表

```sql
CREATE TABLE volunteer_task (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    volunteer_id BIGINT NOT NULL COMMENT '志愿者 ID',
    status INT NOT NULL DEFAULT 1 COMMENT '任务状态 1 待执行 2 执行中 3 已完成',
    assign_time DATETIME COMMENT '分配时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_volunteer_id (volunteer_id),
    INDEX idx_order_no (order_no)
);
```

### 5.4 结算单表

```sql
CREATE TABLE settlement (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    order_no VARCHAR(32) NOT NULL COMMENT '订单号',
    org_id BIGINT NOT NULL COMMENT '机构 ID',
    amount DECIMAL(10,2) NOT NULL COMMENT '结算金额',
    platform_fee DECIMAL(10,2) NOT NULL COMMENT '平台服务费',
    status INT NOT NULL DEFAULT 1 COMMENT '结算状态 1 待结算 2 已结算',
    settlement_time DATETIME COMMENT '结算时间',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_order_no (order_no),
    INDEX idx_org_id (org_id)
);
```

---

## 六、异常处理

### 6.1 常见异常场景

1. **订单不存在**: 抛出 `RuntimeException("订单不存在")`
2. **状态流转不合法**: 抛出 `RuntimeException("订单状态流转不合法")`
3. **重复结算**: 抛出 `RuntimeException("订单已结算")`
4. **志愿者未绑定机构**: 抛出 `RuntimeException("志愿者未绑定机构")`

### 6.2 事务管理

所有状态流转操作必须使用 `@Transactional` 注解，保证数据一致性：

```java
@Transactional
public void acceptOrder(String orderNo, Long orgId) {
    // 1. 验证订单状态
    // 2. 创建承接记录
    // 3. 更新订单状态
    // 4. 更新订单机构 ID
}
```

---

## 七、测试要点

### 7.1 单元测试覆盖

1. 合法状态流转测试
2. 非法状态流转测试
3. 订单不存在测试
4. 定时任务自动取消测试
5. 结算金额计算测试

### 7.2 集成测试要点

1. 完整订单流程测试（创建→承接→执行→确认→结算）
2. 超时自动取消测试
3. 并发承接测试（防止超卖）

---

## 八、经验总结

1. **状态机设计**: 使用 Map 定义状态流转规则，代码清晰易维护
2. **事务边界**: 涉及多表更新的操作必须加事务
3. **定时任务**: 注意幂等性和执行频率，避免对数据库造成压力
4. **异常处理**: 业务异常要明确提示，便于前端展示
5. **数据一致性**: 订单状态、承接记录、任务记录要保持一致

---

*学习笔记完成于 2026-04-04*
