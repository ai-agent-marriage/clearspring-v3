package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 统计数据实体类
 */
@Data
public class Statistics {
    
    /**
     * 机构 ID
     */
    private Long orgId;
    
    /**
     * 总订单数
     */
    private Integer totalOrders;
    
    /**
     * 总金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 志愿者总数
     */
    private Integer totalVolunteers;
    
    /**
     * 活跃志愿者数
     */
    private Integer activeVolunteers;
    
    /**
     * 合规执行率
     */
    private BigDecimal complianceRate;
    
    /**
     * 统计日期
     */
    private Date statisticsDate;
}
