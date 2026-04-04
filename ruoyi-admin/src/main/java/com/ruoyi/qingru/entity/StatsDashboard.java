package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 数据统计仪表盘
 */
@Data
public class StatsDashboard {
    
    /**
     * 累计用户数
     */
    private Long totalUsers;
    
    /**
     * 累计订单数
     */
    private Long totalOrders;
    
    /**
     * 累计成交金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 活跃志愿者数
     */
    private Long activeVolunteers;
    
    /**
     * 今日订单数
     */
    private Long todayOrders;
    
    /**
     * 今日成交金额
     */
    private BigDecimal todayAmount;
}
