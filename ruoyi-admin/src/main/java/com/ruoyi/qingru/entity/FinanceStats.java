package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 财务统计实体
 */
@Data
public class FinanceStats {
    /**
     * 总营收
     */
    private BigDecimal totalRevenue;
    
    /**
     * 待结算金额
     */
    private BigDecimal pendingSettlement;
    
    /**
     * 已结算金额
     */
    private BigDecimal settledAmount;
    
    /**
     * 待开票金额
     */
    private BigDecimal pendingInvoice;
    
    /**
     * 已开票金额
     */
    private BigDecimal invoicedAmount;
    
    /**
     * 订单总数
     */
    private Integer totalOrders;
    
    /**
     * 退款金额
     */
    private BigDecimal refundAmount;
    
    /**
     * 退款率
     */
    private Double refundRate;
    
    /**
     * 毛利率
     */
    private Double profitMargin;
}
