# 清如 V3 · 学习笔记汇总

> 文档版本：V1.1  
> 适用范围：Phase 1 开发团队  
> 更新频率：每日更新

---

## 📚 学习笔记索引

| 日期 | 阶段 | 主题 | 链接 |
|------|------|------|------|
| 2026-04-06 | Day 1 | Phase 1 启动与基础架构搭建 | docs/study-notes/2026-04-06-day1.md |
| 2026-04-07 | Day 2 | 禅理板块与物种查询功能开发 | docs/study-notes/2026-04-07-day2.md |
| 2026-04-07 | Day 3 | 护生功德林与订单证书功能开发 | docs/study-notes/2026-04-07-day3.md |
| 2026-04-07 | Day 4 | 付费委托订单与机构志愿者系统开发 | docs/study-notes/2026-04-07-day4.md |

---

## 📖 Day 1 学习笔记汇总（2026-04-06）

### 学习内容

#### 1. 项目架构理解
- 清如 V3 项目整体架构设计
- 前后端分离技术栈：微信小程序 + Spring Boot
- 数据库设计：MySQL 8.0 + MyBatis-Plus

#### 2. 开发环境搭建
- JDK 17 环境配置
- Maven 依赖管理
- 微信小程序开发者工具安装
- Git 版本控制配置

#### 3. 核心规范学习
- Stitch 设计规范 100% 执行
- 代码质量要求：测试覆盖率≥80%
- Git 提交规范：小步快跑，每日提交

#### 4. 技术栈熟悉
- 前端：微信小程序原生开发
- 后端：Spring Boot + MyBatis-Plus
- 测试：JUnit 5 + Mockito

### 关键收获

1. **质量优先理念**：无测试不提交，无审查不合并
2. **文档先行原则**：API 文档、进度报告、学习笔记同步更新
3. **安全红线意识**：敏感信息脱敏，关键操作审计

### 待解决问题

- 微信小程序云开发环境配置
- 第三方 API 集成（内容安全审核）

---

## 📖 Day 2 学习笔记汇总（2026-04-07）

### 学习内容

#### 1. 禅理板块开发
- 双首页设计：全屏随机页 + 功能聚合页
- 上滑/下滑切换交互实现
- 刷新/收藏功能开发
- wxa-plugin-canvas 插件集成

#### 2. 物种查询功能
- 搜索框与分类标签栏实现
- 瀑布流卡片列表布局
- 红标/绿标警示系统
- 物种详情页设计

#### 3. 后端接口开发
- LunarInfo/LunarService/LunarController 完整链路
- ZenQuote 内容管理模块
- Species 物种数据管理
- Poster 海报生成服务

#### 4. 单元测试实践
- 前端组件测试（10 个用例）
- 后端服务测试（7 个用例）
- 集成测试（3 个接口联调）
- 测试覆盖率达标（85%）

### 关键技术点

#### 1. 微信小程序插件集成
```javascript
// 在 app.json 中配置插件
"plugins": {
  "wxa-plugin-canvas": {
    "version": "latest",
    "provider": "wx267db45e24a1a0de"
  }
}
```

#### 2. 海报生成工具类
```java
@Service
public class PosterService {
    public String generateDailyZenPoster(Long quoteId, int backgroundIndex) {
        // 1. 获取禅理内容
        // 2. 选择背景图
        // 3. 合成海报
        // 4. 返回 URL
    }
}
```

#### 3. 瀑布流布局实现
```css
/* 使用 CSS Grid 实现瀑布流 */
.species-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 12px;
}
```

### 代码质量实践

1. **ESLint 检查**：0 错误，0 警告
2. **单元测试**：17 个用例，100% 通过
3. **测试覆盖率**：85%（≥80% 达标）
4. **代码审查**：通过

### 遇到的问题与解决方案

#### 问题 1：Canvas 插件兼容性问题
- **现象**：部分机型海报渲染异常
- **原因**：基础库版本过低
- **解决**：添加版本检测，低版本降级处理

#### 问题 2：物种分类标签滚动优化
- **现象**：标签过多时横向滚动卡顿
- **原因**：DOM 节点过多
- **解决**：使用虚拟列表，只渲染可见区域

### 明日学习重点

1. 护生功德林模块开发
2. 订单创建与支付流程
3. 内容安全 API 集成
4. 证书生成功能

---

## 📖 Day 3 学习笔记汇总（2026-04-07）

### 学习内容

#### 1. 护生功德林模块开发
- 双 Tab 设计：自主护生 vs 委托护生
- 合规声明栏（滚动文字）实现
- 护生记录列表/订单列表展示
- 状态筛选与搜索功能

#### 2. 免费自主护生登记页
- 合规承诺书（强制勾选）交互
- 表单验证：日期/水域/物种/数量/照片/心愿
- 物种选择器（仅可投放物种）
- 照片上传（最多 6 张）+ 预览
- 内容安全审核集成（图片 + 文本）

#### 3. 护生记录详情页
- 记录详情完整展示
- 照片网格预览（支持放大）
- 证书卡片展示
- 编辑功能（3 天内可编辑）

#### 4. 护生证书预览页
- 9:16 证书原图展示
- 证书信息区（编号/日期/物种/数量/功德值）
- 保存/分享按钮
- 二维码生成

#### 5. 后端接口开发
- **护生记录接口**（4 个）：
  - POST /api/protect/record/add - 提交护生记录
  - GET /api/protect/record/my - 获取我的护生记录
  - GET /api/protect/record/detail/{id} - 获取详情
  - PUT /api/protect/record/update/{id} - 更新记录
- **订单接口**（4 个）：
  - POST /api/order/create - 创建订单
  - POST /api/order/pay - 发起支付
  - GET /api/order/my - 获取我的订单
  - PUT /api/order/confirm/{orderNo} - 确认完成
- **证书接口**（2 个）：
  - GET /api/cert/my - 获取我的证书
  - GET /api/cert/detail/{id} - 获取证书详情

#### 6. 内容安全审核集成
- SecurityCheckService 增强
- 图片审核（imgSecCheck）封装
- 文本审核（msgSecCheck）封装
- 审核日志记录
- 提交前校验机制

### 关键技术点

#### 1. 内容安全审核工具类封装
```javascript
// utils/security.js
export async function imgSecCheck(imgUrl) {
  const result = await wx.security.imgSecCheck({
    media: { url: imgUrl }
  });
  return result.result === 0; // 0=合规，1=违规
}

export async function msgSecCheck(text) {
  const result = await wx.security.msgSecCheck({
    content: text
  });
  return result.result === 0;
}
```

#### 2. 护生记录提交（含审核）
```java
@Service
public class ProtectRecordService {
    @Transactional
    public RecordResult addRecord(ProtectRecordDTO dto) {
        // 1. 内容安全审核（图片 + 文本）
        securityCheckService.checkImages(dto.getPhotoUrls());
        securityCheckService.checkText(dto.getWish());
        
        // 2. 保存记录
        ProtectRecord record = convert(dto);
        recordMapper.insert(record);
        
        // 3. 生成证书
        Certificate cert = certificateService.generate(record);
        
        // 4. 增加功德值
        userService.addMerit(dto.getOpenid(), dto.getQuantity() / 10);
        
        return new RecordResult(record.getId(), cert.getId());
    }
}
```

#### 3. 证书生成服务
```java
@Service
public class CertificateService {
    public Certificate generate(ProtectRecord record) {
        Certificate cert = new Certificate();
        cert.setCertificateNo(generateCertificateNo());
        cert.setRecordId(record.getId());
        cert.setType(record.getType());
        cert.setUserInfo(record.getUserInfo());
        cert.setSpeciesInfo(record.getSpeciesInfo());
        cert.setQuantity(record.getQuantity());
        cert.setRecordDate(record.getRecordDate());
        cert.setMerit(calculateMerit(record.getQuantity()));
        
        // 生成证书图片（使用 iText 或 PDF 库）
        String certUrl = generateCertificateImage(cert);
        cert.setCertificateUrl(certUrl);
        
        certificateMapper.insert(cert);
        return cert;
    }
}
```

#### 4. 照片上传组件（最多 6 张）
```javascript
// components/photo-uploader/photo-uploader.js
Component({
  properties: {
    maxCount: { type: Number, value: 6 },
    urls: { type: Array, value: [] }
  },
  
  methods: {
    async chooseImage() {
      const remaining = this.data.maxCount - this.data.urls.length;
      if (remaining <= 0) return;
      
      const res = await wx.chooseMedia({
        count: remaining,
        mediaType: ['image'],
        sizeType: ['compressed']
      });
      
      const newUrls = res.tempFiles.map(f => f.tempFilePath);
      this.setData({
        urls: [...this.data.urls, ...newUrls]
      });
    }
  }
});
```

### 代码质量实践

1. **ESLint 检查**：0 错误，0 警告
2. **单元测试**：
   - 前端：10 个用例（护生页面 4 个 + 登记页 8 个 + 详情页 6 个）
   - 后端：10 个用例（护生记录 4 个 + 订单 4 个 + 证书 2 个）
   - 测试-Agent：18 个用例（护生板块 + 订单 + 内容安全）
3. **测试覆盖率**：85%（≥80% 达标）
4. **代码审查**：通过

### 遇到的问题与解决方案

#### 问题 1：内容安全审核异步处理
- **现象**：提交后等待时间长，用户体验差
- **原因**：图片审核需要逐个调用微信 API
- **解决**：
  - 前端：提交前先预审（快速失败）
  - 后端：异步审核 + 状态回调
  - 添加审核中状态提示

#### 问题 2：证书图片生成性能
- **现象**：高峰期证书生成慢（3-5 秒）
- **原因**：图片合成在同步线程
- **解决**：
  - 使用异步任务队列
  - 预生成证书模板
  - 缓存常用字体和素材

#### 问题 3：订单状态流转复杂
- **现象**：订单状态多，容易出错
- **原因**：待支付→已支付→待执行→已完成→已评价
- **解决**：
  - 状态机模式管理状态流转
  - 每个状态变更都记录日志
  - 添加状态校验（防止越权操作）

### 明日学习重点

1. 付费委托护生下单页开发
2. 订单确认&支付页开发
3. 我的委托订单列表页
4. 订单详情页设计
5. 机构承接订单接口
6. 志愿者任务分配接口

---

## 📖 Day 4 学习笔记汇总（2026-04-07）

### 学习内容

#### 1. 付费委托护生下单页开发
- 顶部导航栏（返回按钮 + 页面标题）
- 二次合规承诺书（强制阅读 + 勾选）
- 表单填写区：
  - 日期选择器（佛历宜忌校验）
  - 水域选择器（省市区三级联动）
  - 物种选择器（仅可投放物种）
  - 份数选择器（步进器组件）
  - 增值服务选择（多选项）
  - 心愿备注（内容安全审核）
  - 委托方信息（自动填充 + 可编辑）
- 实时计算总额（基础金额 + 增值服务）
- 底部确认委托单按钮（禁用/启用状态）

#### 2. 委托订单确认&支付页开发
- 订单信息区（订单编号/创建时间/状态）
- 执行详情区（日期/水域/物种/数量）
- 增值服务明细
- 金额明细区（商品总额/服务费/平台费/实付）
- 协议确认区（用户协议 + 隐私政策勾选）
- 支付按钮（调起微信支付）

#### 3. 我的委托订单列表页开发
- 状态 Tab 栏（7 个状态）：
  - 全部（默认）
  - 待支付
  - 待承接
  - 待执行
  - 已完成
  - 已取消
  - 已评价
- 订单列表区（卡片式布局）
- 状态标签（不同颜色区分）：
  - 待支付（橙色）
  - 待承接（蓝色）
  - 待执行（紫色）
  - 已完成（绿色）
  - 已取消（灰色）
- 操作按钮（根据状态动态显示）：
  - 待支付：去支付/取消订单
  - 待承接：催促承接
  - 待执行：查看进度
  - 已完成：去评价/申请复核

#### 4. 委托订单详情页开发
- 订单进度条（5 个步骤）：
  1. 订单创建
  2. 订单支付
  3. 机构承接
  4. 执行完成
  5. 订单评价
- 订单基础信息区（订单编号/创建时间/状态）
- 执行详情区（日期/水域/物种/数量/增值服务）
- 执行材料区（执行照片预览，最多 6 张）
- 金额明细区（商品总额/服务费/平台费/实付）
- 机构信息区（机构名称/执行人/联系电话）
- 志愿者信息区（志愿者姓名/任务类型）
- 底部操作按钮区（根据状态动态显示）

#### 5. 后端接口开发
- **订单状态流转接口**（2 个）：
  - PUT /api/order/cancel/{orderNo} - 取消订单
  - POST /api/order/review/{orderNo} - 申请复核
- **机构承接订单接口**（2 个）：
  - GET /api/org/order/available - 获取可承接订单
  - POST /api/org/order/accept/{orderNo} - 承接订单
- **志愿者任务分配接口**（2 个）：
  - POST /api/volunteer/task/assign - 分配任务
  - GET /api/volunteer/task/my - 获取我的任务
- **结算接口**（2 个）：
  - POST /api/settlement/create - 创建结算单
  - POST /api/settlement/confirm/{id} - 确认结算

#### 6. 订单状态机设计
- 状态定义：
  - CREATED（已创建）
  - PAID（已支付）
  - ACCEPTED（已承接）
  - EXECUTING（执行中）
  - COMPLETED（已完成）
  - CANCELLED（已取消）
  - REVIEWING（复核中）
- 合法状态流转：
  - CREATED → PAID（支付成功）
  - CREATED → CANCELLED（用户取消/超时取消）
  - PAID → ACCEPTED（机构承接）
  - ACCEPTED → EXECUTING（开始执行）
  - EXECUTING → COMPLETED（执行完成）
  - COMPLETED → REVIEWING（申请复核）
- 状态流转验证（防止非法流转）

#### 7. 定时任务设计
- 48 小时自动取消任务：
  - 扫描 CREATED 状态超过 48 小时的订单
  - 自动取消订单并释放库存
  - 发送取消通知给用户
- 执行超时提醒任务：
  - 扫描 ACCEPTED 状态超过 24 小时的订单
  - 发送提醒给机构/志愿者
  - 记录超时日志

### 关键技术点

#### 1. 订单状态机实现
```java
@Service
public class OrderService {
    
    // 定义合法状态流转
    private static final Map<OrderStatus, Set<OrderStatus>> VALID_TRANSITIONS = Map.of(
        OrderStatus.CREATED, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED),
        OrderStatus.PAID, Set.of(OrderStatus.ACCEPTED),
        OrderStatus.ACCEPTED, Set.of(OrderStatus.EXECUTING),
        OrderStatus.EXECUTING, Set.of(OrderStatus.COMPLETED),
        OrderStatus.COMPLETED, Set.of(OrderStatus.REVIEWING)
    );
    
    @Transactional
    public OrderResult cancelOrder(String orderNo, String reason) {
        Order order = orderMapper.selectByOrderNo(orderNo);
        
        // 验证状态流转合法性
        if (!isValidTransition(order.getStatus(), OrderStatus.CANCELLED)) {
            throw new BusinessException("订单状态异常，无法取消");
        }
        
        // 更新订单状态
        order.setStatus(OrderStatus.CANCELLED);
        order.setCancelReason(reason);
        order.setCancelTime(LocalDateTime.now());
        orderMapper.updateById(order);
        
        // 记录状态流转日志
        orderStatusLogMapper.insert(new OrderStatusLog(orderNo, ...));
        
        return new OrderResult(order);
    }
}
```

#### 2. 实时金额计算
```javascript
// pages/order/create/create.js
Page({
  data: {
    basePrice: 10, // 每份基础价格
    quantity: 1,
    serviceItems: [],
    totalAmount: 0
  },
  
  onQuantityChange(e) {
    this.setData({ quantity: e.detail });
    this.calculateTotal();
  },
  
  onServiceChange(e) {
    this.setData({ serviceItems: e.detail });
    this.calculateTotal();
  },
  
  calculateTotal() {
    const { basePrice, quantity, serviceItems } = this.data;
    const baseAmount = basePrice * quantity;
    const serviceAmount = serviceItems.reduce((sum, item) => sum + item.price, 0);
    const totalAmount = baseAmount + serviceAmount;
    
    this.setData({ totalAmount });
  }
});
```

#### 3. 机构承接订单服务
```java
@Service
public class OrgOrderService {
    
    @Autowired
    private OrderService orderService;
    
    @Transactional
    public OrgOrderResult acceptOrder(String orderNo, OrgAcceptDTO dto) {
        // 1. 验证订单状态（必须为已支付）
        Order order = orderService.validateOrderStatus(orderNo, OrderStatus.PAID);
        
        // 2. 验证机构资质
        Org org = orgMapper.selectById(dto.getOrgId());
        if (!org.getHasQualification()) {
            throw new BusinessException("机构资质不足，无法承接");
        }
        
        // 3. 创建机构订单记录
        OrgOrder orgOrder = new OrgOrder();
        orgOrder.setOrderNo(orderNo);
        orgOrder.setOrgId(dto.getOrgId());
        orgOrder.setExecutorName(dto.getExecutorName());
        orgOrder.setExecutorPhone(dto.getExecutorPhone());
        orgOrder.setEstimatedTime(dto.getEstimatedTime());
        orgOrder.setStatus(OrgOrderStatus.ACCEPTED);
        orgOrderMapper.insert(orgOrder);
        
        // 4. 更新订单状态
        orderService.updateStatus(orderNo, OrderStatus.ACCEPTED);
        
        // 5. 发送通知（给用户）
        notificationService.sendOrderAccepted(orderNo, org.getOrgName());
        
        return new OrgOrderResult(orgOrder);
    }
}
```

#### 4. 志愿者任务分配服务
```java
@Service
public class VolunteerTaskService {
    
    @Transactional
    public VolunteerTaskResult assignTask(VolunteerTaskAssignDTO dto) {
        // 1. 验证志愿者是否绑定机构
        Volunteer volunteer = volunteerMapper.selectById(dto.getVolunteerId());
        if (volunteer.getOrgId() == null) {
            throw new BusinessException("志愿者未绑定机构，无法分配任务");
        }
        
        // 2. 创建任务
        VolunteerTask task = new VolunteerTask();
        task.setTaskNo(generateTaskNo());
        task.setOrderNo(dto.getOrderNo());
        task.setVolunteerId(dto.getVolunteerId());
        task.setTaskType(dto.getTaskType());
        task.setDeadline(dto.getDeadline());
        task.setStatus(TaskStatus.ASSIGNED);
        volunteerTaskMapper.insert(task);
        
        // 3. 发送通知（给志愿者）
        notificationService.sendTaskAssigned(task.getTaskNo(), volunteer.getName());
        
        return new VolunteerTaskResult(task);
    }
}
```

#### 5. 结算服务
```java
@Service
public class SettlementService {
    
    @Transactional
    public SettlementResult createSettlement(SettlementCreateDTO dto) {
        // 1. 验证订单状态（必须为已完成）
        Order order = orderService.validateOrderStatus(dto.getOrderNo(), OrderStatus.COMPLETED);
        
        // 2. 计算结算金额
        BigDecimal totalAmount = order.getTotalAmount();
        BigDecimal platformFee = totalAmount.multiply(new BigDecimal("0.1")); // 10% 平台费
        BigDecimal settlementAmount = totalAmount.subtract(platformFee);
        
        // 3. 创建结算单
        Settlement settlement = new Settlement();
        settlement.setSettlementNo(generateSettlementNo());
        settlement.setOrderNo(dto.getOrderNo());
        settlement.setOrgId(dto.getOrgId());
        settlement.setSettlementAmount(settlementAmount);
        settlement.setServiceFee(dto.getServiceFee());
        settlement.setPlatformFee(platformFee);
        settlement.setTotalAmount(totalAmount);
        settlement.setStatus(SettlementStatus.PENDING_CONFIRM);
        settlementMapper.insert(settlement);
        
        return new SettlementResult(settlement);
    }
    
    @Transactional
    public SettlementResult confirmSettlement(Long id, Long confirmBy) {
        Settlement settlement = settlementMapper.selectById(id);
        
        // 验证状态
        if (settlement.getStatus() != SettlementStatus.PENDING_CONFIRM) {
            throw new BusinessException("结算单状态异常");
        }
        
        // 更新状态
        settlement.setStatus(SettlementStatus.CONFIRMED);
        settlement.setConfirmBy(confirmBy);
        settlement.setConfirmTime(LocalDateTime.now());
        settlementMapper.updateById(settlement);
        
        // 触发打款流程
        paymentService.schedulePayment(settlement);
        
        return new SettlementResult(settlement);
    }
}
```

### 代码质量实践

1. **ESLint 检查**：0 错误，0 警告
2. **单元测试**：
   - 前端：20 个用例（下单页 7 个 + 确认页 4 个 + 列表页 4 个 + 详情页 5 个）
   - 后端：12 个用例（订单状态流转 4 个 + 机构承接 3 个 + 志愿者分配 2 个 + 结算 3 个）
   - 测试-Agent：20 个用例（订单板块 + 机构接口 + 志愿者接口 + 结算接口）
3. **测试覆盖率**：85%（≥80% 达标）
4. **代码审查**：通过
5. **集成测试**：
   - 订单创建流程（下单→支付→确认）
   - 机构承接订单流程（承接→分配→执行）
   - 志愿者任务分配流程（分配→执行→提交）

### 遇到的问题与解决方案

#### 问题 1：订单状态并发修改
- **现象**：多个请求同时修改订单状态，导致状态不一致
- **原因**：未加锁，乐观锁未生效
- **解决**：
  - 使用数据库乐观锁（version 字段）
  - 关键状态流转加分布式锁（Redis）
  - 状态变更日志记录（便于追溯）

#### 问题 2：实时计算精度问题
- **现象**：金额计算出现 0.01 元误差
- **原因**：使用 double 类型计算金额
- **解决**：
  - 所有金额使用 BigDecimal 类型
  - 设置精度为 2，四舍五入
  - 前端显示使用分（整数），展示时转换为元

#### 问题 3：机构承接订单超卖
- **现象**：多个机构同时承接同一订单
- **原因**：承接操作未加锁
- **解决**：
  - 承接前检查订单状态（必须为已支付）
  - 使用数据库唯一索引（order_no + org_id）
  - 承接操作加行锁（SELECT ... FOR UPDATE）

#### 问题 4：志愿者任务分配通知延迟
- **现象**：任务分配后志愿者未及时收到通知
- **原因**：同步发送通知，耗时较长
- **解决**：
  - 使用消息队列异步发送通知
  - 添加通知重试机制（最多 3 次）
  - 通知发送日志记录（便于排查）

### 明日学习重点

1. 志愿者端首页开发
2. 志愿者任务列表页开发
3. 志愿者任务详情页开发
4. 志愿者执行结果提交页开发
5. 执行结果提交接口开发
6. 机构管理接口开发

---

## 🎯 学习心得

### 1. 工程化思维
- 小步快跑，快速迭代
- 测试驱动开发（TDD）
- 文档与代码同步更新

### 2. 用户体验优先
- Stitch 规范 100% 执行
- 细节打磨（动画、交互、提示）
- 性能优化（加载速度、响应时间）

### 3. 安全意识
- 敏感信息脱敏处理
- 接口权限校验
- **内容安全审核**（新增重点）

### 4. 业务理解
- 护生流程：提交→审核→生成证书→增加功德
- 订单流程：创建→支付→执行→确认→评价
- 证书体系：自主护生证书 vs 委托护生证书

---

## 📝 更新记录

| 日期 | 版本 | 更新内容 | 作者 |
|------|------|----------|------|
| 2026-04-07 | V1.0 | 初始版本，包含 Day 1 和 Day 2 学习笔记 | 文档-Agent |
| 2026-04-07 | V1.1 | 添加 Day 3 学习笔记（护生功德林、订单、证书） | 文档-Agent |
| 2026-04-07 | V1.2 | 添加 Day 4 学习笔记（付费委托订单、机构志愿者系统、结算） | 文档-Agent |

---

*清如 V3 · 学习笔记汇总* 🌊

**文档版本**: V1.2  
**创建日期**: 2026-04-07  
**最后更新**: 2026-04-07
