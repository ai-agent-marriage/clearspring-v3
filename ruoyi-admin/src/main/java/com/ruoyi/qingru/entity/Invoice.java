package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 发票实体
 */
@Data
public class Invoice {
    /**
     * 发票 ID
     */
    private Long id;
    
    /**
     * 发票号
     */
    private String invoiceNo;
    
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
     * 发票抬头
     */
    private String title;
    
    /**
     * 纳税人识别号
     */
    private String taxNo;
    
    /**
     * 发票类型 1-普通发票 2-专用发票
     */
    private Integer type;
    
    /**
     * 发票金额
     */
    private BigDecimal amount;
    
    /**
     * 发票内容
     */
    private String content;
    
    /**
     * 发票状态 0-待开票 1-已开票 2-已寄出 3-已签收 4-已驳回
     */
    private Integer status;
    
    /**
     * 快递单号
     */
    private String expressNo;
    
    /**
     * 快递公司
     */
    private String expressCompany;
    
    /**
     * 开票时间
     */
    private LocalDateTime issueTime;
    
    /**
     * 寄出时间
     */
    private LocalDateTime sendTime;
    
    /**
     * 签收时间
     */
    private LocalDateTime receiveTime;
    
    /**
     * 驳回原因
     */
    private String rejectReason;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
