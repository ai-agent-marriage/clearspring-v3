package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 订单统计实体类
 */
@Data
public class OrderStats {
    
    /**
     * 订单总数
     */
    private Integer totalOrders;
    
    /**
     * 待承接订单数
     */
    private Integer pendingOrders;
    
    /**
     * 待执行订单数
     */
    private Integer waitingOrders;
    
    /**
     * 执行中订单数
     */
    private Integer executingOrders;
    
    /**
     * 待确认订单数
     */
    private Integer confirmingOrders;
    
    /**
     * 已完成订单数
     */
    private Integer completedOrders;
    
    /**
     * 已取消订单数
     */
    private Integer cancelledOrders;
    
    /**
     * 订单总金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 已完成订单金额
     */
    private BigDecimal completedAmount;
}
