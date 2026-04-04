# mall-admin 电商后台学习笔记

## 1. 项目概览

**项目名称**: mall-admin (电商后台管理系统)  
**GitHub 地址**: https://github.com/macrozheng/mall  
**开源协议**: Apache-2.0  
**Stars**: 70000+ (超热门电商项目)  
**作者**: macrozheng  
**系列项目**: mall-learning (学习教程)

### 项目简介

mall 项目是一套**全栈电商系统**，包含前台商城系统和后台管理系统。基于 Spring Boot + MyBatis-Plus + Vue + Element UI 实现，涵盖了电商系统的核心业务模块，是学习电商系统开发的优秀参考项目。

### 完整项目结构

```
mall 项目群/
├── mall                  # 后台管理系统 (Spring Boot)
├── mall-admin            # 后台管理前端 (Vue)
├── mall-portal           # 前台商城系统 (Spring Boot)
├── mall-search           # 搜索服务 (Elasticsearch)
├── mall-common           # 公共模块
└── mall-demo             # 演示模块
```

### 技术栈

**后端**:
- Spring Boot 2.x
- MyBatis-Plus
- Spring Security + JWT
- Redis
- Elasticsearch
- RabbitMQ
- MySQL
- Docker

**前端**:
- Vue 2.x
- Element UI
- Axios
- Vue Router
- Vuex

### 核心功能模块

| 模块 | 功能说明 |
|-----|---------|
| 商品管理 | 商品发布、分类管理、品牌管理、属性管理 |
| 订单管理 | 订单列表、订单详情、订单发货、订单退款 |
| 会员管理 | 会员列表、会员等级、积分管理、成长值 |
| 营销管理 | 优惠券、限时购、推荐品牌、专题推荐 |
| 内容管理 | 专题管理、优选商品、内容分类 |
| 财务管理 | 订单结算、退款记录、对账管理 |
| 数据统计 | 销售统计、商品统计、会员统计 |
| 系统管理 | 用户管理、角色管理、菜单管理、日志管理 |

---

## 2. 安装配置步骤

### 2.1 环境准备

```bash
# 必需环境
- JDK 8+
- Maven 3.6+
- MySQL 5.7+
- Redis 5.0+
- Elasticsearch 7.x (可选，搜索功能需要)
- RabbitMQ 3.x (可选，消息队列需要)
- Node.js 14+ (前端)
```

### 2.2 项目克隆

```bash
# 克隆项目
git clone https://github.com/macrozheng/mall.git
cd mall

# 查看项目结构
mall/
├── mall-admin              # 后台管理系统
├── mall-common             # 公共模块
├── mall-mbg                # MyBatis 生成器
├── mall-portal             # 前台商城系统
├── mall-search             # 搜索服务
└── pom.xml                 # 父 POM
```

### 2.3 数据库配置

```sql
-- 1. 创建数据库
CREATE DATABASE IF NOT EXISTS mall DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;

-- 2. 导入表结构
-- 执行 mall.sql (包含所有表结构和初始数据)

-- 3. 主要数据表
-- pms_* : 商品模块 (Product Management System)
-- oms_* : 订单模块 (Order Management System)
-- ums_* : 会员模块 (User Management System)
-- sms_* : 营销模块 (Sales Management System)
-- cms_* : 内容模块 (Content Management System)
-- sys_* : 系统模块
```

### 2.4 后端配置 (application-dev.yml)

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/mall?useUnicode=true&characterEncoding=utf-8&serverTimezone=Asia/Shanghai&useSSL=false
    username: root
    password: your-password
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  redis:
    host: localhost
    port: 6379
    password: your-redis-password
    database: 0
    timeout: 10000ms
    lettuce:
      pool:
        max-active: 8
        max-wait: -1ms
        max-idle: 8
        min-idle: 0
  
  # RabbitMQ 配置 (可选)
  rabbitmq:
    host: localhost
    port: 5672
    username: guest
    password: guest
    virtual-host: /
    listener:
      simple:
        acknowledge-mode: manual
  
  # Elasticsearch 配置 (可选)
  elasticsearch:
    hosts: localhost:9200

# MyBatis 配置
mybatis:
  mapper-locations:
    - classpath:mapper/*.xml
    - classpath*:com/**/mapper/*.xml
  type-aliases-package: com.macro.mall.model
  configuration:
    map-underscore-to-camel-case: true
    cache-enabled: true
    lazy-loading-enabled: true
    aggressive-lazy-loading: false

# JWT 配置
jwt:
  token-header: Authorization
  token-prefix: Bearer 
  secret: mall-admin-secret
  expiration: 604800  # 7 天

# 文件上传配置
aliyun:
  oss:
    enabled: true
    endpoint: oss-cn-shanghai.aliyuncs.com
    access-key-id: your-access-key-id
    access-key-secret: your-access-key-secret
    bucket-name: mall-images
    # 本地文件存储 (开发环境)
    local:
      enabled: false
      path: /tmp/mall/uploads

# 日志配置
logging:
  level:
    com.macro.mall: debug
    org.springframework: warn
  pattern:
    console: '%d{HH:mm:ss.SSS} [%thread] %-5level %logger{36} - %msg%n'
```

### 2.5 前端配置

```bash
# 进入前端目录
cd mall-admin

# 安装依赖
npm install --registry=https://registry.npmmirror.com

# 启动开发服务器
npm run dev

# 访问 http://localhost:80
```

### 2.6 前端环境配置 (.env.development)

```bash
NODE_ENV = development
VUE_APP_BASE_API = 'http://localhost:8080'
```

---

## 3. 订单管理流程

### 3.1 订单表结构

```sql
-- 订单表
oms_order (
  id                    BIGINT PRIMARY KEY,
  order_sn              VARCHAR(64),         -- 订单编号
  member_id             BIGINT,              -- 会员 ID
  coupon_id             BIGINT,              -- 优惠券 ID
  member_username       VARCHAR(64),         -- 会员用户名
  total_amount          DECIMAL(10,2),       -- 订单总金额
  pay_amount            DECIMAL(10,2),       -- 应付金额
  freight_amount        DECIMAL(10,2),       -- 运费
  promotion_amount      DECIMAL(10,2),       -- 促销优惠
  discount_amount       DECIMAL(10,2),       -- 折扣金额
  pay_type              INT,                 -- 支付方式 (0=未支付，1=支付宝，2=微信)
  source_type           INT,                 -- 订单来源 (0=PC, 1=APP)
  status                INT,                 -- 订单状态 (0=待付款，1=待发货，2=已发货，3=已完成，4=已关闭，5=无效)
  delivery_company      VARCHAR(64),         -- 物流公司
  delivery_sn           VARCHAR(64),         -- 物流单号
  auto_confirm_day      INT,                 -- 自动确认收货时间 (天)
  integration           INT,                 -- 获得的积分
  growth                INT,                 -- 获得的成长值
  promotion_info        VARCHAR(100),        -- 促销信息
  confirm_status        INT,                 -- 确认收货状态
  delete_status         INT,                 -- 删除状态
  payment_time          DATETIME,            -- 支付时间
  delivery_time         DATETIME,            -- 发货时间
  receive_time          DATETIME,            -- 确认收货时间
  comment_time          DATETIME,            -- 评价时间
  create_time           DATETIME,            -- 创建时间
  modify_time           DATETIME             -- 修改时间
)

-- 订单商品表
oms_order_item (
  id                    BIGINT PRIMARY KEY,
  order_id              BIGINT,              -- 订单 ID
  order_sn              VARCHAR(64),         -- 订单编号
  product_id            BIGINT,              -- 商品 ID
  product_pic           VARCHAR(500),        -- 商品图片
  product_name          VARCHAR(200),        -- 商品名称
  product_price         DECIMAL(10,2),       -- 商品价格
  product_quantity      INT,                 -- 购买数量
  product_sku_id        BIGINT,              -- 商品 SKU ID
  product_sku_code      VARCHAR(50),         -- 商品 SKU 编码
  product_category_id   BIGINT,              -- 商品分类 ID
  promotion_name        VARCHAR(200),        -- 促销名称
  promotion_amount      DECIMAL(10,2),       -- 促销金额
  coupon_amount         DECIMAL(10,2),       -- 优惠券金额
  integration_amount    DECIMAL(10,2),       -- 积分抵扣金额
  real_amount           DECIMAL(10,2)        -- 实际支付金额
)

-- 订单操作历史记录表
oms_order_operate_history (
  id                    BIGINT PRIMARY KEY,
  order_id              BIGINT,
  operate_man           VARCHAR(100),        -- 操作人
  create_time           DATETIME,
  order_status          INT,                 -- 订单状态
  note                  VARCHAR(500)         -- 备注
)
```

### 3.2 订单状态流转

```
待付款 (0) 
  ↓ (用户支付)
待发货 (1) 
  ↓ (商家发货)
已发货 (2) 
  ↓ (用户确认收货)
已完成 (3)
  ↓ (用户评价)
已评价

待付款 (0)
  ↓ (超时未支付)
已关闭 (4)

待发货/已发货
  ↓ (用户申请退款)
退款中 → 已退款
```

### 3.3 订单管理 Service

```java
package com.macro.mall.service.impl;

import com.github.pagehelper.PageHelper;
import com.macro.mall.dto.*;
import com.macro.mall.mapper.*;
import com.macro.mall.model.*;
import com.macro.mall.service.OmsOrderService;
import com.macro.mall.common.utils.DateUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

/**
 * 订单管理 Service 实现类
 */
@Slf4j
@Service
public class OmsOrderServiceImpl implements OmsOrderService {
    
    @Autowired
    private OmsOrderMapper orderMapper;
    
    @Autowired
    private OmsOrderItemMapper orderItemMapper;
    
    @Autowired
    private OmsOrderOperateHistoryMapper operateHistoryMapper;
    
    @Autowired
    private UmsMemberMapper memberMapper;
    
    /**
     * 查询订单列表
     */
    @Override
    public List<OmsOrder> list(OmsOrderQueryParams params, Integer pageSize, Integer pageNum) {
        PageHelper.startPage(pageNum, pageSize);
        return orderMapper.getList(params);
    }
    
    /**
     * 批量发货
     */
    @Override
    @Transactional
    public int delivery(List<OmsOrderDeliveryParams> deliveryParamsList) {
        int count = 0;
        for (OmsOrderDeliveryParams deliveryParams : deliveryParamsList) {
            OmsOrder order = new OmsOrder();
            order.setId(deliveryParams.getOrderId());
            order.setDeliveryCompany(deliveryParams.getDeliveryCompany());
            order.setDeliverySn(deliveryParams.getDeliverySn());
            order.setStatus(2); // 已发货
            order.setDeliveryTime(new Date());
            
            count += orderMapper.updateByPrimaryKeySelective(order);
            
            // 记录操作日志
            addOrderOperateHistory(deliveryParams.getOrderId(), "发货", "物流公司：" + 
                deliveryParams.getDeliveryCompany() + "，物流单号：" + deliveryParams.getDeliverySn());
        }
        return count;
    }
    
    /**
     * 批量关闭订单
     */
    @Override
    @Transactional
    public int close(List<Long> ids, String note) {
        int count = 0;
        for (Long id : ids) {
            OmsOrder order = new OmsOrder();
            order.setId(id);
            order.setStatus(4); // 已关闭
            count += orderMapper.updateByPrimaryKeySelective(order);
            
            addOrderOperateHistory(id, "关闭订单", note);
        }
        return count;
    }
    
    /**
     * 批量删除订单
     */
    @Override
    @Transactional
    public int delete(List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            OmsOrder order = new OmsOrder();
            order.setId(id);
            order.setDeleteStatus(1); // 标记删除
            count += orderMapper.updateByPrimaryKeySelective(order);
        }
        return count;
    }
    
    /**
     * 获取订单详情
     */
    @Override
    public OmsOrderDetail detail(Long id) {
        OmsOrder order = orderMapper.selectByPrimaryKey(id);
        List<OmsOrderItem> orderItems = getOrderItems(id);
        
        OmsOrderDetail detail = new OmsOrderDetail();
        detail.setOrder(order);
        detail.setOrderItemList(orderItems);
        
        return detail;
    }
    
    /**
     * 修改订单收货人信息
     */
    @Override
    @Transactional
    public int updateReceiverInfo(OmsReceiverInfoParams params) {
        OmsOrder order = new OmsOrder();
        order.setId(params.getOrderId());
        order.setReceiverName(params.getReceiverName());
        order.setReceiverPhone(params.getReceiverPhone());
        order.setReceiverPostCode(params.getReceiverPostCode());
        order.setReceiverDetailAddress(params.getReceiverDetailAddress());
        order.setReceiverProvince(params.getReceiverProvince());
        order.setReceiverCity(params.getReceiverCity());
        order.setReceiverRegion(params.getReceiverRegion());
        
        int count = orderMapper.updateByPrimaryKeySelective(order);
        
        addOrderOperateHistory(params.getOrderId(), "修改收货人信息", 
            "收货人：" + params.getReceiverName() + "，电话：" + params.getReceiverPhone());
        
        return count;
    }
    
    /**
     * 订单备注
     */
    @Override
    @Transactional
    public int updateNote(Long id, String note, Integer status) {
        OmsOrder order = new OmsOrder();
        order.setId(id);
        order.setNote(note);
        order.setStatus(status);
        
        int count = orderMapper.updateByPrimaryKeySelective(order);
        
        addOrderOperateHistory(id, "修改备注", "备注：" + note + "，状态：" + status);
        
        return count;
    }
    
    /**
     * 添加订单操作历史记录
     */
    private void addOrderOperateHistory(Long orderId, String operateMan, String note) {
        OmsOrderOperateHistory history = new OmsOrderOperateHistory();
        history.setOrderId(orderId);
        history.setOperateMan(operateMan);
        history.setCreateTime(new Date());
        history.setNote(note);
        
        // 获取当前订单状态
        OmsOrder order = orderMapper.selectByPrimaryKey(orderId);
        if (order != null) {
            history.setOrderStatus(order.getStatus());
        }
        
        operateHistoryMapper.insert(history);
    }
    
    /**
     * 获取订单项列表
     */
    private List<OmsOrderItem> getOrderItems(Long orderId) {
        OmsOrderItemExample example = new OmsOrderItemExample();
        example.createCriteria().andOrderIdEqualTo(orderId);
        return orderItemMapper.selectByExample(example);
    }
}
```

### 3.4 订单管理 Controller

```java
package com.macro.mall.controller;

import com.macro.mall.common.api.CommonPage;
import com.macro.mall.common.api.CommonResult;
import com.macro.mall.dto.*;
import com.macro.mall.model.OmsOrder;
import com.macro.mall.service.OmsOrderService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 订单管理 Controller
 */
@Controller
@Api(tags = "OmsOrderController", description = "订单管理")
@RequestMapping("/oms/order")
public class OmsOrderController {
    
    @Autowired
    private OmsOrderService orderService;
    
    @ApiOperation("查询订单列表")
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    @ResponseBody
    public CommonResult<CommonPage<OmsOrder>> list(OmsOrderQueryParams params,
                                                    @RequestParam(value = "pageSize", defaultValue = "5") Integer pageSize,
                                                    @RequestParam(value = "pageNum", defaultValue = "1") Integer pageNum) {
        List<OmsOrder> result = orderService.list(params, pageSize, pageNum);
        return CommonResult.success(CommonPage.restPage(result));
    }
    
    @ApiOperation("批量发货")
    @RequestMapping(value = "/delivery", method = RequestMethod.POST)
    @ResponseBody
    public CommonResult<Integer> delivery(@RequestBody List<OmsOrderDeliveryParams> deliveryParamsList) {
        int count = orderService.delivery(deliveryParamsList);
        if (count > 0) {
            return CommonResult.success(count);
        }
        return CommonResult.failed();
    }
    
    @ApiOperation("批量关闭订单")
    @RequestMapping(value = "/close", method = RequestMethod.POST)
    @ResponseBody
    public CommonResult<Integer> close(@RequestParam("ids") List<Long> ids,
                                        @RequestParam("note") String note) {
        int count = orderService.close(ids, note);
        if (count > 0) {
            return CommonResult.success(count);
        }
        return CommonResult.failed();
    }
    
    @ApiOperation("批量删除订单")
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public CommonResult<Integer> delete(@RequestParam("ids") List<Long> ids) {
        int count = orderService.delete(ids);
        if (count > 0) {
            return CommonResult.success(count);
        }
        return CommonResult.failed();
    }
    
    @ApiOperation("获取订单详情")
    @RequestMapping(value = "/{id}", method = RequestMethod.GET)
    @ResponseBody
    public CommonResult<OmsOrderDetail> detail(@PathVariable Long id) {
        OmsOrderDetail detail = orderService.detail(id);
        return CommonResult.success(detail);
    }
    
    @ApiOperation("修改订单收货人信息")
    @RequestMapping(value = "/updateReceiverInfo", method = RequestMethod.POST)
    @ResponseBody
    public CommonResult<Integer> updateReceiverInfo(@RequestBody OmsReceiverInfoParams params) {
        int count = orderService.updateReceiverInfo(params);
        if (count > 0) {
            return CommonResult.success(count);
        }
        return CommonResult.failed();
    }
    
    @ApiOperation("订单备注")
    @RequestMapping(value = "/updateNote/{id}", method = RequestMethod.POST)
    @ResponseBody
    public CommonResult<Integer> updateNote(@PathVariable Long id,
                                             @RequestParam("note") String note,
                                             @RequestParam("status") Integer status) {
        int count = orderService.updateNote(id, note, status);
        if (count > 0) {
            return CommonResult.success(count);
        }
        return CommonResult.failed();
    }
}
```

---

## 4. 财务结算逻辑

### 4.1 结算表结构

```sql
-- 结算单表
oms_settlement (
  id                    BIGINT PRIMARY KEY,
  settlement_sn         VARCHAR(64),         -- 结算单号
  order_sn              VARCHAR(64),         -- 关联订单号
  member_id             BIGINT,              -- 会员 ID
  member_username       VARCHAR(64),         -- 会员用户名
  total_amount          DECIMAL(10,2),       -- 订单总金额
  commission_amount     DECIMAL(10,2),       -- 佣金金额
  platform_amount       DECIMAL(10,2),       -- 平台金额
  settlement_amount     DECIMAL(10,2),       -- 结算金额
  status                INT,                 -- 结算状态 (0=待结算，1=结算中，2=已结算，3=已取消)
  commission_rate       DECIMAL(5,4),        -- 佣金比例
  platform_rate         DECIMAL(5,4),        -- 平台比例
  settlement_time       DATETIME,            -- 结算时间
  remark                VARCHAR(500),        -- 备注
  create_time           DATETIME,
  modify_time           DATETIME
)

-- 结算明细表
oms_settlement_item (
  id                    BIGINT PRIMARY KEY,
  settlement_id         BIGINT,              -- 结算单 ID
  product_id            BIGINT,              -- 商品 ID
  product_name          VARCHAR(200),        -- 商品名称
  quantity              INT,                 -- 数量
  price                 DECIMAL(10,2),       -- 单价
  amount                DECIMAL(10,2),       -- 金额
  commission_amount     DECIMAL(10,2),       -- 佣金
  platform_amount       DECIMAL(10,2)        -- 平台费
)

-- 退款记录表
oms_refund_history (
  id                    BIGINT PRIMARY KEY,
  order_id              BIGINT,
  order_sn              VARCHAR(64),
  refund_sn             VARCHAR(64),         -- 退款单号
  member_id             BIGINT,
  refund_amount         DECIMAL(10,2),       -- 退款金额
  refund_type           INT,                 -- 退款类型 (1=仅退款，2=退货退款)
  refund_reason         VARCHAR(500),        -- 退款原因
  refund_status         INT,                 -- 退款状态 (0=待处理，1=同意，2=拒绝，3=已退款)
  refund_time           DATETIME,            -- 退款时间
  handle_time           DATETIME,            -- 处理时间
  handle_man            VARCHAR(100),        -- 处理人
  handle_note           VARCHAR(500)         -- 处理备注
)
```

### 4.2 结算 Service

```java
package com.macro.mall.service.impl;

import com.macro.mall.dto.*;
import com.macro.mall.mapper.*;
import com.macro.mall.model.*;
import com.macro.mall.service.OmsSettlementService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

/**
 * 结算管理 Service 实现类
 */
@Slf4j
@Service
public class OmsSettlementServiceImpl implements OmsSettlementService {
    
    @Autowired
    private OmsSettlementMapper settlementMapper;
    
    @Autowired
    private OmsSettlementItemMapper settlementItemMapper;
    
    @Autowired
    private OmsOrderMapper orderMapper;
    
    @Autowired
    private OmsRefundHistoryMapper refundHistoryMapper;
    
    /**
     * 创建结算单
     */
    @Override
    @Transactional
    public OmsSettlement createSettlement(Long orderId) {
        // 1. 查询订单
        OmsOrder order = orderMapper.selectByPrimaryKey(orderId);
        if (order == null || order.getStatus() != 3) {
            throw new BusinessException("订单不存在或未完成，无法结算");
        }
        
        // 2. 检查是否已结算
        OmsSettlementExample example = new OmsSettlementExample();
        example.createCriteria().andOrderSnEqualTo(order.getOrderSn());
        List<OmsSettlement> existSettlements = settlementMapper.selectByExample(example);
        if (!existSettlements.isEmpty()) {
            throw new BusinessException("订单已结算");
        }
        
        // 3. 计算结算金额
        BigDecimal totalAmount = order.getPayAmount();
        BigDecimal commissionRate = new BigDecimal("0.05"); // 5% 佣金
        BigDecimal platformRate = new BigDecimal("0.02");   // 2% 平台费
        
        BigDecimal commissionAmount = totalAmount.multiply(commissionRate);
        BigDecimal platformAmount = totalAmount.multiply(platformRate);
        BigDecimal settlementAmount = totalAmount.subtract(commissionAmount).subtract(platformAmount);
        
        // 4. 创建结算单
        OmsSettlement settlement = new OmsSettlement();
        settlement.setSettlementSn(generateSettlementSn());
        settlement.setOrderSn(order.getOrderSn());
        settlement.setMemberId(order.getMemberId());
        settlement.setMemberUsername(order.getMemberUsername());
        settlement.setTotalAmount(totalAmount);
        settlement.setCommissionAmount(commissionAmount);
        settlement.setPlatformAmount(platformAmount);
        settlement.setSettlementAmount(settlementAmount);
        settlement.setCommissionRate(commissionRate);
        settlement.setPlatformRate(platformRate);
        settlement.setStatus(0); // 待结算
        settlement.setCreateTime(new Date());
        
        settlementMapper.insert(settlement);
        
        // 5. 创建结算明细
        createSettlementItems(settlement.getId(), orderId);
        
        log.info("创建结算单成功：{}", settlement.getSettlementSn());
        return settlement;
    }
    
    /**
     * 确认结算
     */
    @Override
    @Transactional
    public int confirmSettlement(Long settlementId, String remark) {
        OmsSettlement settlement = new OmsSettlement();
        settlement.setId(settlementId);
        settlement.setStatus(2); // 已结算
        settlement.setSettlementTime(new Date());
        settlement.setRemark(remark);
        
        int count = settlementMapper.updateByPrimaryKeySelective(settlement);
        
        log.info("确认结算成功：{}", settlementId);
        return count;
    }
    
    /**
     * 处理退款申请
     */
    @Override
    @Transactional
    public int handleRefund(RefundHandleParams params) {
        OmsRefundHistory refund = new OmsRefundHistory();
        refund.setId(params.getRefundId());
        refund.setRefundStatus(params.getStatus()); // 1=同意，2=拒绝
        refund.setHandleTime(new Date());
        refund.setHandleMan(params.getHandleMan());
        refund.setHandleNote(params.getHandleNote());
        
        int count = refundHistoryMapper.updateByPrimaryKeySelective(refund);
        
        // 如果同意退款，更新订单状态
        if (params.getStatus() == 1) {
            OmsOrder order = new OmsOrder();
            order.setId(params.getOrderId());
            order.setStatus(5); // 无效订单
            orderMapper.updateByPrimaryKeySelective(order);
            
            // 记录操作日志
            addOrderOperateHistory(params.getOrderId(), "退款处理", "同意退款");
        }
        
        log.info("处理退款申请：{}，结果：{}", params.getRefundId(), params.getStatus());
        return count;
    }
    
    /**
     * 创建结算明细
     */
    private void createSettlementItems(Long settlementId, Long orderId) {
        OmsOrderItemExample itemExample = new OmsOrderItemExample();
        itemExample.createCriteria().andOrderIdEqualTo(orderId);
        List<OmsOrderItem> orderItems = orderItemMapper.selectByExample(itemExample);
        
        BigDecimal commissionRate = new BigDecimal("0.05");
        BigDecimal platformRate = new BigDecimal("0.02");
        
        for (OmsOrderItem item : orderItems) {
            OmsSettlementItem settlementItem = new OmsSettlementItem();
            settlementItem.setSettlementId(settlementId);
            settlementItem.setProductId(item.getProductId());
            settlementItem.setProductName(item.getProductName());
            settlementItem.setQuantity(item.getProductQuantity());
            settlementItem.setPrice(item.getProductPrice());
            settlementItem.setAmount(item.getRealAmount());
            settlementItem.setCommissionAmount(item.getRealAmount().multiply(commissionRate));
            settlementItem.setPlatformAmount(item.getRealAmount().multiply(platformRate));
            
            settlementItemMapper.insert(settlementItem);
        }
    }
    
    /**
     * 生成结算单号
     */
    private String generateSettlementSn() {
        return "S" + System.currentTimeMillis() + (int)(Math.random() * 10000);
    }
    
    /**
     * 添加订单操作历史
     */
    private void addOrderOperateHistory(Long orderId, String operateMan, String note) {
        OmsOrderOperateHistory history = new OmsOrderOperateHistory();
        history.setOrderId(orderId);
        history.setOperateMan(operateMan);
        history.setCreateTime(new Date());
        history.setNote(note);
        
        OmsOrder order = orderMapper.selectByPrimaryKey(orderId);
        if (order != null) {
            history.setOrderStatus(order.getStatus());
        }
        
        operateHistoryMapper.insert(history);
    }
}
```

---

## 5. 数据报表设计

### 5.1 销售统计

```java
/**
 * 销售统计 Service
 */
@Service
public class OmsStatisticsService {
    
    @Autowired
    private OmsOrderMapper orderMapper;
    
    /**
     * 获取销售统计数据
     */
    public SalesStatisticsVO getSalesStatistics(Date startDate, Date endDate) {
        SalesStatisticsVO stats = new SalesStatisticsVO();
        
        // 订单总数
        stats.setOrderCount(orderMapper.countByExample(createExample(startDate, endDate)));
        
        // 销售总额
        stats.setTotalAmount(orderMapper.sumTotalAmount(createExample(startDate, endDate)));
        
        // 实际支付金额
        stats.setPayAmount(orderMapper.sumPayAmount(createExample(startDate, endDate)));
        
        // 客单价
        if (stats.getOrderCount() > 0) {
            stats.setAvgAmount(stats.getPayAmount().divide(
                new BigDecimal(stats.getOrderCount()), 2, BigDecimal.ROUND_HALF_UP));
        }
        
        return stats;
    }
    
    /**
     * 获取每日销售趋势
     */
    public List<DailySalesVO> getDailySalesTrend(Date startDate, Date endDate) {
        return orderMapper.getDailySalesTrend(startDate, endDate);
    }
    
    /**
     * 获取商品销售排行
     */
    public List<ProductSalesVO> getProductSalesRank(Integer limit) {
        return orderMapper.getProductSalesRank(limit);
    }
}
```

### 5.2 统计 SQL 示例

```xml
<!-- OmsOrderMapper.xml -->
<mapper namespace="com.macro.mall.mapper.OmsOrderMapper">
    
    <!-- 获取每日销售趋势 -->
    <select id="getDailySalesTrend" resultType="com.macro.mall.dto.DailySalesVO">
        SELECT 
            DATE(create_time) AS date,
            COUNT(*) AS order_count,
            SUM(pay_amount) AS total_amount
        FROM oms_order
        WHERE delete_status = 0
          AND create_time BETWEEN #{startDate} AND #{endDate}
        GROUP BY DATE(create_time)
        ORDER BY date
    </select>
    
    <!-- 获取商品销售排行 -->
    <select id="getProductSalesRank" resultType="com.macro.mall.dto.ProductSalesVO">
        SELECT 
            product_id,
            product_name,
            SUM(product_quantity) AS total_quantity,
            SUM(real_amount) AS total_amount
        FROM oms_order_item
        WHERE order_id IN (
            SELECT id FROM oms_order 
            WHERE status IN (2, 3) AND delete_status = 0
        )
        GROUP BY product_id, product_name
        ORDER BY total_amount DESC
        LIMIT #{limit}
    </select>
    
</mapper>
```

---

## 6. 可复用模块

### 6.1 推荐复用模块

1. **商品管理模块**: 完整的商品 CRUD、分类、品牌、属性管理
2. **订单管理模块**: 订单流程、发货、退款处理
3. **会员管理模块**: 会员等级、积分、成长值体系
4. **营销模块**: 优惠券、限时购、推荐系统
5. **权限管理**: 基于 RBAC 的权限控制

### 6.2 清如项目适配建议

1. **内容管理**: 复用商品管理结构，改为内容管理
2. **评论管理**: 参考订单评价功能
3. **审核管理**: 参考订单审核流程
4. **用户管理**: 复用会员管理模块

---

## 7. 踩坑记录

### 7.1 常见问题及解决方案

| 问题 | 原因 | 解决方案 |
|-----|------|---------|
| 订单超时未关闭 | 定时任务未执行 | 检查 RabbitMQ 延迟队列配置 |
| 库存扣减错误 | 并发问题 | 使用乐观锁或分布式锁 |
| 支付回调失败 | 签名验证失败 | 检查支付密钥配置 |
| 搜索功能不可用 | ES 未启动 | 检查 Elasticsearch 服务状态 |
| 文件上传失败 | OSS 配置错误 | 检查阿里云 OSS 配置 |

### 7.2 性能优化建议

1. **数据库优化**: 添加索引，分表分库
2. **缓存优化**: 热点数据使用 Redis 缓存
3. **异步处理**: 订单创建、发货通知使用消息队列
4. **搜索优化**: 使用 Elasticsearch 替代数据库模糊查询

---

## 参考资源

- **GitHub**: https://github.com/macrozheng/mall
- **学习教程**: https://github.com/macrozheng/mall-learning
- **官方文档**: https://macrozheng.github.io/mall-learning/

---

*笔记创建时间：2026-04-04*  
*mall 版本：latest*
