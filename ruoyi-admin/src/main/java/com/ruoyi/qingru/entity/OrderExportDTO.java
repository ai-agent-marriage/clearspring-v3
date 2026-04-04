package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 订单导出 DTO
 */
@Data
public class OrderExportDTO {
    
    /**
     * 订单号
     */
    private String orderNo;
    
    /**
     * 下单时间
     */
    private Date createTime;
    
    /**
     * 护生物种
     */
    private String speciesName;
    
    /**
     * 数量
     */
    private Integer quantity;
    
    /**
     * 金额
     */
    private BigDecimal amount;
    
    /**
     * 状态名称
     */
    private String statusName;
}
