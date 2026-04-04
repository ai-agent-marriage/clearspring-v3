package com.ruoyi.qingru.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 结算单实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Settlement {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 订单号
     */
    private String orderNo;
    
    /**
     * 机构 ID
     */
    private Long orgId;
    
    /**
     * 结算金额
     */
    private BigDecimal amount;
    
    /**
     * 平台服务费
     */
    private BigDecimal platformFee;
    
    /**
     * 结算状态 1 待结算 2 已结算
     */
    private Integer status;
    
    /**
     * 结算时间
     */
    private Date settlementTime;
    
    /**
     * 创建时间
     */
    private Date createTime;
}
