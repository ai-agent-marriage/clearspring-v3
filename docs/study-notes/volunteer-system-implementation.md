# 志愿者系统实现学习笔记

**日期**: 2026-04-07  
**阶段**: Phase 1 Week 1 Day 5  
**主题**: 后端接口开发 - 志愿者、执行结果、机构管理、结算模块

---

## 📚 一、学习内容概述

本日主要完成志愿者系统后端接口的开发，包括：

1. **志愿者接口** - 志愿者详情查询、信息更新
2. **执行结果接口** - 执行结果提交、审核
3. **机构管理接口** - 机构详情查询、信息更新
4. **结算接口** - 结算列表查询（带状态过滤）、批量结算

---

## 🏗️ 二、系统架构设计

### 2.1 分层架构

采用经典三层架构：

```
Controller 层（接口层）
    ↓
Service 层（业务逻辑层）
    ↓
Mapper 层（数据访问层）
```

### 2.2 实体关系

```
User (用户)
  └── Volunteer (志愿者)
        └── TaskExecute (任务执行记录)

OrgManage (机构)
  └── OrderProtect (订单)
        └── Settlement (结算单)
```

---

## 💻 三、核心实现

### 3.1 志愿者模块

#### Entity 设计要点

```java
@Data
public class Volunteer {
    private Long id;
    private Long userId;          // 关联用户
    private String realName;      // 真实姓名
    private String idCard;        // 身份证号
    private String phone;         // 联系电话
    private Long orgId;           // 所属机构
    private Integer status;       // 1 正常 0 禁用
    private Integer totalTasks;   // 累计任务数（统计字段）
    private Integer serviceHours; // 累计服务时长（统计字段）
    private BigDecimal complianceRate; // 合规执行率（统计字段）
}
```

**关键点**:
- 统计字段（totalTasks、serviceHours、complianceRate）不存储在数据库，实时计算
- 合规执行率 = 合规任务数 / 总任务数 × 100%

#### Service 层实现

```java
public Volunteer getVolunteerDetail(Long volunteerId) {
    Volunteer volunteer = volunteerMapper.selectById(volunteerId);
    
    // 实时统计数据
    int totalTasks = taskExecuteMapper.countByVolunteerId(volunteerId);
    int serviceHours = taskExecuteMapper.sumServiceHours(volunteerId);
    BigDecimal complianceRate = calculateComplianceRate(volunteerId);
    
    volunteer.setTotalTasks(totalTasks);
    volunteer.setServiceHours(serviceHours);
    volunteer.setComplianceRate(complianceRate);
    
    return volunteer;
}
```

---

### 3.2 执行结果模块

#### Entity 设计

```java
@Data
public class TaskExecute {
    private Long id;
    private String orderNo;       // 订单号
    private Long volunteerId;     // 志愿者 ID
    private Date executeTime;     // 执行时间
    private String address;       // 实际投放点位
    private Integer realQuantity; // 实际投放数量
    private String images;        // 现场照片（逗号分隔）
    private String videoUrl;      // 执行视频
    private String remark;        // 执行备注
    private Integer status;       // 1 待审核 2 审核通过 3 审核驳回
    private String auditReason;   // 审核驳回原因
}
```

#### 内容安全审核

```java
@Transactional
public void submitExecute(TaskExecute execute) {
    // 图片审核
    if (execute.getImages() != null) {
        String[] images = execute.getImages().split(",");
        for (String image : images) {
            if (!securityCheckService.checkImage(image.trim())) {
                throw new RuntimeException("图片包含违规内容");
            }
        }
    }
    
    // 文本审核
    if (execute.getRemark() != null) {
        if (!securityCheckService.checkText(execute.getRemark())) {
            throw new RuntimeException("文本包含违规内容");
        }
    }
    
    // 插入执行记录
    execute.setStatus(1); // 待审核
    taskExecuteMapper.insert(execute);
    
    // 更新订单状态
    orderService.updateOrderStatus(execute.getOrderNo(), 4);
}
```

---

### 3.3 机构管理模块

#### 统计字段设计

```java
public OrgManage getOrgDetail(Long orgId) {
    OrgManage org = orgManageMapper.selectById(orgId);
    
    // 统计订单数
    int totalOrders = orderMapper.countByOrgId(orgId);
    org.setTotalOrders(totalOrders);
    
    return org;
}
```

---

### 3.4 结算模块增强

#### 批量结算实现

```java
@Transactional
public void batchSettle(List<Long> settlementIds) {
    for (Long settlementId : settlementIds) {
        Settlement settlement = settlementMapper.selectById(settlementId);
        
        // 状态校验
        if (settlement.getStatus() != 1) {
            continue; // 跳过非待结算状态
        }
        
        settlement.setStatus(2); // 已结算
        settlement.setSettlementTime(new Date());
        settlementMapper.update(settlement);
        
        // 更新订单状态
        orderMapper.updateStatus(settlement.getOrderNo(), 6);
    }
}
```

---

## 🧪 四、单元测试

### 4.1 测试覆盖

| 模块 | Service 测试 | Controller 测试 |
|------|-------------|-----------------|
| 志愿者 | ✅ VolunteerServiceTest | ✅ VolunteerControllerTest |
| 执行结果 | ✅ TaskExecuteServiceTest | ✅ TaskExecuteControllerTest |
| 机构管理 | ✅ OrgManageServiceTest | ✅ OrgManageControllerTest |
| 结算 | ✅ SettlementServiceTest | ✅ SettlementControllerTest |

### 4.2 测试用例数

- **VolunteerServiceTest**: 6 个测试用例
- **TaskExecuteServiceTest**: 9 个测试用例
- **OrgManageServiceTest**: 8 个测试用例
- **SettlementServiceTest**: 9 个测试用例（新增 2 个）
- **Controller 测试**: 18 个测试用例

**总计**: 50+ 个测试用例

---

## 🔑 五、关键技术点

### 5.1 事务管理

所有涉及数据更新的操作都使用 `@Transactional` 注解：

```java
@Transactional
public void auditExecute(Long executeId, Integer status, String reason) {
    // 更新执行记录
    // 更新志愿者统计
    // 更新订单状态
    // 全部成功才提交，否则回滚
}
```

### 5.2 内容安全审核

集成内容安全审核服务，确保提交的图片和文本符合规范：

```java
// 图片审核
securityCheckService.checkImage(image)

// 文本审核
securityCheckService.checkText(text)
```

### 5.3 统计数据实时计算

统计字段不存储在数据库，而是通过 Mapper 方法实时计算：

```java
// Mapper 接口
int countByVolunteerId(Long volunteerId);
int sumServiceHours(Long volunteerId);
int countCompliantTasks(Long volunteerId);
```

---

## 📝 六、API 接口清单

### 6.1 志愿者接口

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取志愿者详情 | GET | `/api/volunteer/detail/{id}` |
| 更新志愿者信息 | PUT | `/api/volunteer/update/{id}` |

### 6.2 执行结果接口

| 接口 | 方法 | 路径 |
|------|------|------|
| 提交执行结果 | POST | `/api/task/execute/submit` |
| 审核执行结果 | POST | `/api/task/execute/audit/{id}` |

### 6.3 机构管理接口

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取机构详情 | GET | `/api/org/manage/detail/{id}` |
| 更新机构信息 | PUT | `/api/org/manage/update/{id}` |

### 6.4 结算接口

| 接口 | 方法 | 路径 |
|------|------|------|
| 获取机构结算列表 | GET | `/api/settlement/org/list` |
| 批量结算 | POST | `/api/settlement/batch-settle` |

---

## 🎯 七、验收标准完成情况

- ✅ 志愿者接口测试通过
- ✅ 执行结果接口测试通过
- ✅ 机构管理接口测试通过
- ✅ 结算接口测试通过
- ✅ 代码符合 Java 规范
- ✅ 单元测试 ≥ 12 个（实际 50+ 个）
- ✅ Git 提交 ≥ 2 次
- ✅ 创建 Day 5 进度报告

---

## 💡 八、学习心得

1. **分层架构的优势**: 清晰的职责划分，便于维护和测试
2. **事务管理的重要性**: 确保数据一致性，避免部分更新
3. **实时统计 vs 缓存统计**: 实时计算保证数据准确性，但需要考虑性能
4. **内容安全审核**: 用户提交内容必须经过审核，确保合规
5. **单元测试覆盖率**: 高覆盖率的测试可以快速发现问题

---

## 📚 九、参考资料

- 若依框架官方文档
- Spring Boot 事务管理最佳实践
- MyBatis Mapper 设计模式
- RESTful API 设计规范

---

*清如 V3 · Phase 1 Week 1 Day 5 学习笔记* 🌊
