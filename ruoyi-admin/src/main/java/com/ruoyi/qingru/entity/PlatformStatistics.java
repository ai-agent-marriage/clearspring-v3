package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 平台统计数据实体类
 */
@Data
public class PlatformStatistics {
    
    /**
     * 累计注册用户数
     */
    private Integer totalUsers;
    
    /**
     * 今日日活用户数
     */
    private Integer dailyActiveUsers;
    
    /**
     * 累计委托订单数
     */
    private Integer totalOrders;
    
    /**
     * 累计平台营收
     */
    private BigDecimal totalRevenue;
    
    /**
     * 订单完成率
     */
    private BigDecimal orderCompletionRate;
    
    /**
     * 内容审核通过率
     */
    private BigDecimal contentAuditRate;
    
    /**
     * 统计日期
     */
    private Date statisticsDate;
}
