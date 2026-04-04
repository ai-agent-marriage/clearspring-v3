package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 财务订单实体
 */
@Data
public class FinanceOrder {
    /**
     * 订单 ID
     */
    private Long orderId;
    
    /**
     * 订单号
     */
    private String orderNo;
    
    /**
     * 用户 ID
     */
    private Long userId;
    
    /**
     * 用户姓名
     */
    private String userName;
    
    /**
     * 订单金额
     */
    private BigDecimal amount;
    
    /**
     * 支付金额
     */
    private BigDecimal payAmount;
    
    /**
     * 退款金额
     */
    private BigDecimal refundAmount;
    
    /**
     * 实际收入
     */
    private BigDecimal revenue;
    
    /**
     * 订单状态 0-待支付 1-已支付 2-已完成 3-已退款 4-已取消
     */
    private Integer status;
    
    /**
     * 支付时间
     */
    private LocalDateTime payTime;
    
    /**
     * 结算状态 0-未结算 1-已结算
     */
    private Integer settlementStatus;
    
    /**
     * 结算时间
     */
    private LocalDateTime settlementTime;
    
    /**
     * 发票状态 0-未开票 1-已开票 2-已寄出
     */
    private Integer invoiceStatus;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
