# 清如 V3 · Phase 1 学习笔记汇总（Day 1-5）

> 文档版本：V1.0  
> 汇总范围：Phase 1 Week 1 Day 1 - Day 5  
> 创建日期：2026-04-07

---

## 📚 目录

1. [Day 1 学习笔记](#day-1-学习笔记)
2. [Day 2 学习笔记](#day-2-学习笔记)
3. [Day 3 学习笔记](#day-3-学习笔记)
4. [Day 4 学习笔记](#day-4-学习笔记)
5. [Day 5 学习笔记](#day-5-学习笔记)
6. [关键技术点汇总](#关键技术点汇总)
7. [问题与解决方案](#问题与解决方案)

---

## Day 1 学习笔记

**日期**: 2026-04-03  
**主题**: 项目启动与基础架构设计

### 学习内容

1. **项目背景理解**
   - 清如 V3 定位：护生放生全流程管理平台
   - 核心角色：用户、机构、志愿者、管理员
   - 业务流程：用户下单 → 机构承接 → 志愿者执行 → 结算

2. **技术栈确认**
   - 前端：微信小程序（原生）+ Web 管理后台（Vue3）
   - 后端：Spring Boot 3.x + MyBatis Plus
   - 数据库：MySQL 8.0
   - 缓存：Redis
   - 部署：Docker + K8s

3. **数据库设计**
   - 核心表：用户表、订单表、机构表、志愿者表、结算表
   - 设计规范：遵循第三范式，预留扩展字段
   - 索引策略：高频查询字段建立索引

### 关键产出

- 项目启动文档：`docs/PROJECT_KICKOFF_V3.md`
- 数据库设计文档：`docs/DATABASE_DESIGN_V1.md`
- 开发计划文档：`docs/DEVELOPMENT_PLAN_V1.md`

---

## Day 2 学习笔记

**日期**: 2026-04-04  
**主题**: 前端基础框架搭建

### 学习内容

1. **小程序项目结构**
   ```
   miniprogram/
   ├── pages/          # 页面目录
   ├── components/     # 公共组件
   ├── utils/          # 工具函数
   ├── assets/         # 静态资源
   └── app.js/wxss     # 全局配置
   ```

2. **组件化开发**
   - 基础组件：Button、Input、Card、Modal
   - 业务组件：OrderCard、SpeciesSelector、LocationPicker
   - 组件通信：properties、events、behaviors

3. **状态管理**
   - 使用全局 data 管理用户状态
   - 封装 wx.request 统一接口调用
   - 错误处理与 loading 状态管理

### 关键产出

- 小程序基础框架完成
- 首页、订单页、个人中心页骨架
- 组件库 V1.0

---

## Day 3 学习笔记

**日期**: 2026-04-04  
**主题**: 后端基础架构与用户模块

### 学习内容

1. **Spring Boot 项目结构**
   ```
   src/main/java/com/qingru/
   ├── controller/     # 控制器层
   ├── service/        # 服务层
   ├── mapper/         # 数据访问层
   ├── entity/         # 实体类
   ├── dto/            # 数据传输对象
   └── config/         # 配置类
   ```

2. **统一响应体设计**
   ```java
   @Data
   public class Result<T> {
       private Integer code;
       private String msg;
       private T data;
       private Long timestamp;
   }
   ```

3. **微信登录集成**
   - wx.login() 获取 code
   - 后端调用 auth.code2Session 获取 openid
   - JWT token 生成与验证
   - 用户自动注册逻辑

### 关键产出

- 后端基础框架完成
- 用户登录接口完成
- 统一异常处理机制

---

## Day 4 学习笔记

**日期**: 2026-04-04  
**主题**: 订单模块与机构模块

### 学习内容

1. **订单状态机设计**
   ```
   1 待承接 → 2 待执行 → 3 执行中 → 4 待确认 → 5 已完成 → 6 已结算
         ↓          ↓
         └──── 6 已取消 ────┘
   ```

2. **机构承接逻辑**
   - 订单池设计：已支付未承接的订单进入公共池
   - 智能匹配：根据机构资质、距离、评分排序
   - 承接锁定：防止多机构同时承接

3. **定时任务**
   - 自动取消未承接订单（48 小时）
   - 自动结算已完成订单（T+7）
   - Cron 表达式配置

### 关键产出

- 订单 CRUD 接口完成
- 机构承接接口完成
- 定时任务配置完成

---

## Day 5 学习笔记

**日期**: 2026-04-07  
**主题**: 志愿者模块与执行结果提交

### 学习内容

1. **志愿者任务管理**
   - 任务分配：机构将订单分配给绑定志愿者
   - 任务状态：待执行 → 执行中 → 待审核 → 已完成
   - 任务提醒：即将到期任务推送

2. **执行结果提交**
   - 表单字段：执行时间、地点、数量、备注
   - 材料上传：照片 3-10 张、视频可选
   - 合规承诺：必须勾选确认
   - 内容审核：调用微信内容安全 API

3. **审核流程**
   - 机构初审：核实执行真实性
   - 管理员复审：抽查审核
   - 审核通过：任务完成，触发结算
   - 审核拒绝：退回重新执行

### 关键产出

- 志愿者接口完成（2 个）
- 执行结果接口完成（2 个）
- 机构管理接口完成（2 个）
- 结算接口增强（2 个）

---

## 关键技术点汇总

### 1. 微信生态集成

**小程序登录**:
```javascript
// 前端
wx.login({
  success: (res) => {
    if (res.code) {
      // 发送 code 到后端
      request('/user/login', { code: res.code })
    }
  }
})
```

**内容安全审核**:
```java
// 后端调用微信内容安全 API
@PostMapping("/content/check")
public Result<Boolean> checkContent(@RequestBody String content) {
    // 调用微信接口
    // 返回 true/false
}
```

---

### 2. 状态机设计

**订单状态枚举**:
```java
public enum OrderStatus {
    PENDING_ACCEPT(1, "待承接"),
    PENDING_EXECUTION(2, "待执行"),
    EXECUTING(3, "执行中"),
    PENDING_CONFIRM(4, "待确认"),
    COMPLETED(5, "已完成"),
    CANCELLED(6, "已取消"),
    SETTLED(7, "已结算");
}
```

**状态流转校验**:
```java
// 确保状态合法流转
if (!OrderStatusFlow.canFlow(currentStatus, targetStatus)) {
    throw new BusinessException("订单状态异常");
}
```

---

### 3. 定时任务配置

**自动取消未承接订单**:
```java
@Scheduled(cron = "0 0 * * * ?") // 每小时执行
public void autoCancelOrders() {
    // 查询创建时间超过 48 小时且状态为待承接的订单
    // 执行取消逻辑
}
```

**自动结算已完成订单**:
```java
@Scheduled(cron = "0 0 2 * * ?") // 每天凌晨 2 点执行
public void autoSettleOrders() {
    // 查询完成时间超过 7 天的订单
    // 执行结算逻辑
}
```

---

### 4. 统一响应体

**Result 工具类**:
```java
public class Result<T> {
    public static <T> Result<T> success(T data) {
        Result<T> r = new Result<>();
        r.setCode(200);
        r.setMsg("操作成功");
        r.setData(data);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
    
    public static <T> Result<T> error(String msg) {
        Result<T> r = new Result<>();
        r.setCode(500);
        r.setMsg(msg);
        r.setData(null);
        r.setTimestamp(System.currentTimeMillis());
        return r;
    }
}
```

---

### 5. 接口鉴权

**JWT Token 验证**:
```java
@Component
public class JwtInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, 
                            HttpServletResponse response, 
                            Object handler) {
        // 从 Header 获取 token
        // 验证 token 有效性
        // 解析用户信息放入 request
    }
}
```

---

## 问题与解决方案

### 问题 1: 多机构同时承接同一订单

**问题描述**: 在高并发场景下，多个机构可能同时点击承接同一订单，导致数据不一致。

**解决方案**:
1. 数据库层面：使用乐观锁（version 字段）
2. 代码层面：承接前加分布式锁（Redis）
3. 业务层面：承接后快速失败，提示"订单已被承接"

```java
@Transactional
public void acceptOrder(String orderNo, Long orgId) {
    // 1. 加分布式锁
    RLock lock = redissonClient.getLock("order:" + orderNo);
    lock.lock();
    try {
        // 2. 查询订单状态
        Order order = orderMapper.selectByOrderNo(orderNo);
        if (order.getStatus() != OrderStatus.PENDING_ACCEPT) {
            throw new BusinessException("订单已被承接");
        }
        
        // 3. 更新订单状态
        order.setStatus(OrderStatus.PENDING_EXECUTION);
        order.setOrgId(orgId);
        orderMapper.updateById(order);
    } finally {
        lock.unlock();
    }
}
```

---

### 问题 2: 执行结果照片上传失败

**问题描述**: 志愿者提交执行结果时，照片上传失败或超时。

**解决方案**:
1. 前端：分片上传 + 断点续传
2. 后端：异步处理，先返回提交成功，后台处理图片
3. CDN：使用 CDN 加速图片访问

```javascript
// 前端分片上传
function uploadPhotos(photos) {
  const chunks = splitPhotos(photos, 3); // 每次上传 3 张
  chunks.forEach(chunk => {
    uploadChunk(chunk);
  });
}
```

---

### 问题 3: 定时任务重复执行

**问题描述**: 在集群部署场景下，定时任务可能在多个节点同时执行。

**解决方案**:
1. 使用分布式任务调度（XXL-JOB）
2. 数据库层面：使用唯一索引防止重复处理
3. 代码层面：执行前加分布式锁

```java
@Scheduled(cron = "0 0 * * * ?")
public void autoCancelOrders() {
    // 尝试获取分布式锁
    RLock lock = redissonClient.getLock("job:autoCancelOrders");
    if (lock.tryLock()) {
        try {
            // 执行任务逻辑
        } finally {
            lock.unlock();
        }
    }
}
```

---

### 问题 4: 内容审核延迟

**问题描述**: 微信内容安全 API 调用耗时较长，影响用户体验。

**解决方案**:
1. 异步审核：先提交，后台审核，审核结果推送
2. 预审核：前端提交前做敏感词初步过滤
3. 降级策略：审核服务不可用时，转人工审核

```java
// 异步审核
@Async
public void submitExecuteResult(TaskExecute execute) {
    // 1. 保存执行结果，状态设为"待审核"
    executeMapper.insert(execute);
    
    // 2. 异步调用内容安全 API
    boolean passed = contentService.check(execute.getRemark());
    
    // 3. 更新审核状态
    execute.setAuditResult(passed ? 1 : 0);
    executeMapper.updateById(execute);
    
    // 4. 推送审核结果通知
    notifyService.push(execute.getVolunteerId(), "审核结果通知");
}
```

---

## 总结与展望

### Phase 1 Week 1 完成情况

- ✅ 前端基础框架搭建完成
- ✅ 后端基础架构搭建完成
- ✅ 用户模块完成
- ✅ 订单模块完成
- ✅ 机构模块完成
- ✅ 志愿者模块完成
- ✅ 执行结果模块完成
- ✅ 结算模块完成

### 下周计划（Week 2）

1. **机构端功能完善**
   - 机构端首页
   - 订单管理页
   - 志愿者管理页
   - 结算管理页

2. **数据统计与报表**
   - 数据统计接口
   - 报表导出功能
   - 可视化图表

3. **后台管理功能**
   - 用户管理
   - 机构审核
   - 订单监管
   - 数据统计

### 技术债务

1. 单元测试覆盖率需提升至 90%
2. 接口文档需同步更新
3. 性能优化：数据库查询优化、缓存策略优化
4. 安全加固：SQL 注入防护、XSS 防护

---

*清如 V3 · Phase 1 学习笔记汇总* 🌊

**文档版本**: V1.0  
**创建日期**: 2026-04-07  
**最后更新**: 2026-04-07
