# 机构系统后端实现学习笔记

**日期**: 2026-04-07  
**阶段**: Phase 1 Week 1 Day 6  
**主题**: 机构端接口、数据统计接口、后台管理接口、报表导出接口

---

## 📚 学习内容

### 1. 机构工作台设计

#### 核心概念
机构工作台是机构用户的首页仪表盘，展示关键业务指标和待办事项。

#### 数据结构设计
```java
// 机构工作台数据
public class OrgDashboard {
    private Integer pendingOrders;      // 待承接订单数
    private Integer todayTasks;         // 今日待执行订单数
    private Integer pendingConfirm;     // 待用户确认订单数
    private Integer completedOrders;    // 累计圆满执行订单数
    private List<OrgTodo> todos;        // 待办事项列表
}

// 机构待办事项
public class OrgTodo {
    private String type;    // audit/settle/dispute
    private String title;   // 待办标题
    private Integer count;  // 待办数量
}
```

#### 业务逻辑
- **待承接订单**: 状态=1 的订单，等待机构承接
- **今日待执行**: 状态=2/3 且创建日期为今日的订单
- **待用户确认**: 状态=4 的订单，等待用户确认完成
- **已完成订单**: 状态=5 的订单，历史累计
- **待办事项**: 
  - 待审核执行材料（task_execute.audit_status=0）
  - 待结算订单（settlement.status=0）
  - 待处理用户异议（order_protect.status=6）

---

### 2. 数据统计设计

#### 统计维度
1. **机构统计**: 按机构维度统计数据
2. **平台统计**: 全平台整体数据

#### 关键指标计算

**合规执行率**:
```java
合规执行率 = (合规任务数 / 总任务数) × 100%
```

**订单完成率**:
```java
订单完成率 = (已完成订单数 / 总订单数) × 100%
```

**内容审核通过率**:
```java
审核通过率 = (审核通过数 / 总审核数) × 100%
```

#### 时间范围处理
- 支持 startDate 和 endDate 参数
- 使用 DATE(create_time) >= startDate AND DATE(create_time) <= endDate
- 空值表示不限制时间范围

---

### 3. 后台管理仪表盘

#### 管理员视角
后台管理仪表盘面向平台管理员，展示平台整体运营情况。

#### 核心指标
- 累计注册用户数
- 今日日活用户数
- 累计委托订单数
- 累计平台营收
- 订单完成率
- 内容审核通过率

#### 数据趋势
支持按时间维度查看指标变化趋势：
- users: 用户增长趋势
- orders: 订单增长趋势
- revenue: 营收增长趋势

---

### 4. 报表导出功能

#### 技术选型
使用 Apache POI 生成 Excel 文件。

#### 实现步骤
1. 查询数据（支持筛选条件）
2. 创建 Workbook 和 Sheet
3. 创建表头并设置样式
4. 填充数据行
5. 自动调整列宽
6. 输出为字节数组

#### 代码示例
```java
// 创建 Excel
Workbook workbook = new XSSFWorkbook();
Sheet sheet = workbook.createSheet("订单报表");

// 创建表头
Row header = sheet.createRow(0);
header.createCell(0).setCellValue("订单号");
// ... 其他列

// 填充数据
int rowNum = 1;
for (OrderExportDTO order : orders) {
    Row row = sheet.createRow(rowNum++);
    row.createCell(0).setCellValue(order.getOrderNo());
    // ... 其他字段
}

// 输出
ByteArrayOutputStream baos = new ByteArrayOutputStream();
workbook.write(baos);
workbook.close();
return baos.toByteArray();
```

---

## 🔧 技术要点

### 1. MyBatis 动态 SQL

**条件查询**:
```xml
<select id="countOrgOrders" resultType="Integer">
    select count(1) from order_protect
    where org_id = #{orgId}
    <if test="startDate != null and startDate != ''">
        and DATE(create_time) &gt;= #{startDate}
    </if>
    <if test="endDate != null and endDate != ''">
        and DATE(create_time) &lt;= #{endDate}
    </if>
</select>
```

**多表联查**:
```xml
<select id="countPendingAudit" resultType="Integer">
    select count(1) from task_execute te
    inner join order_protect op on te.order_no = op.order_no
    where op.org_id = #{orgId} and te.audit_status = 0
</select>
```

### 2. BigDecimal 精度处理

**合规率计算**:
```java
BigDecimal complianceRate = new BigDecimal(compliantTasks)
    .divide(new BigDecimal(totalTasks), 2, RoundingMode.HALF_UP)
    .multiply(new BigDecimal("100"));
```

**注意事项**:
- 除法必须指定精度和舍入模式
- 使用 BigDecimal.ZERO 表示零值
- 避免除零错误（先判断 totalTasks == 0）

### 3. 邀请码生成

**生成规则**:
```java
String timestamp = String.valueOf(System.currentTimeMillis()).substring(5);
String random = String.valueOf((int)(Math.random() * 10000));
String inviteCode = "INV" + orgId + timestamp + random;
```

**格式**: INV + 机构 ID + 时间戳后 6 位 + 随机 4 位

---

## 📊 接口设计

### RESTful 规范

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | /org/manage/dashboard | 获取机构工作台 |
| POST | /org/manage/invite-code | 生成邀请码 |
| GET | /statistics/org | 机构统计 |
| GET | /statistics/platform | 平台统计 |
| GET | /admin/dashboard | 管理仪表盘 |
| GET | /admin/trend | 数据趋势 |
| GET | /export/orders | 导出订单报表 |

### 统一响应格式
```json
{
  "code": 200,
  "msg": "获取成功",
  "data": {}
}
```

---

## ⚠️ 注意事项

### 1. 性能优化
- 统计数据查询可能较慢，建议添加数据库索引
- 大数据量导出时分页处理
- 考虑使用缓存存储统计数据

### 2. 数据准确性
- 时间范围使用 DATE() 函数可能影响索引
- 多表联查注意 JOIN 条件
- 空值处理（IFNULL、默认值）

### 3. 安全性
- 机构数据需要权限校验（只能看自己机构）
- 管理员接口需要角色校验
- 导出接口限制时间范围防止大数据量

---

## 🎓 收获与反思

### 收获
1. 掌握了仪表盘设计的最佳实践
2. 学会了复杂统计 SQL 的编写
3. 熟悉了 Apache POI Excel 导出流程
4. 理解了多维度数据统计的设计思路

### 待改进
1. 趋势数据目前是模拟数据，需要实现真实查询
2. 订单完成率和审核通过率计算逻辑待完善
3. 导出功能支持更多报表类型
4. 添加数据缓存提升性能

---

## 📝 后续计划

1. 实现真实的趋势数据查询（按天/周/月聚合）
2. 完善订单完成率和审核通过率计算逻辑
3. 添加更多报表导出类型（志愿者报表、结算报表）
4. 实现统计数据缓存（Redis）
5. 添加数据可视化图表支持

---

**记录人**: Backend-Agent  
**记录时间**: 2026-04-07
