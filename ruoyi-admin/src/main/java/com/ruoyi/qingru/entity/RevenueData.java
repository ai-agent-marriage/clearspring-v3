package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.List;

/**
 * 营收数据实体
 */
@Data
public class RevenueData {
    /**
     * 总营收
     */
    private BigDecimal totalRevenue;
    
    /**
     * 今日营收
     */
    private BigDecimal todayRevenue;
    
    /**
     * 昨日营收
     */
    private BigDecimal yesterdayRevenue;
    
    /**
     * 环比增长率
     */
    private Double growthRate;
    
    /**
     * 本月营收
     */
    private BigDecimal monthRevenue;
    
    /**
     * 上月营收
     */
    private BigDecimal lastMonthRevenue;
    
    /**
     * 本月同比增长
     */
    private Double monthGrowthRate;
    
    /**
     * 各分类营收列表
     */
    private List<CategoryRevenue> categoryList;
    
    /**
     * 分类营收
     */
    @Data
    public static class CategoryRevenue {
        /**
         * 分类名称
         */
        private String categoryName;
        
        /**
         * 分类营收
         */
        private BigDecimal amount;
        
        /**
         * 占比
         */
        private Double percentage;
    }
}
