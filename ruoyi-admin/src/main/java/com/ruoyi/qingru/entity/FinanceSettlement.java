package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 结算实体
 */
@Data
public class Settlement {
    /**
     * 结算 ID
     */
    private Long settlementId;
    
    /**
     * 结算单号
     */
    private String settlementNo;
    
    /**
     * 结算类型 1-机构结算 2-志愿者结算 3-供应商结算
     */
    private Integer settlementType;
    
    /**
     * 结算对象 ID
     */
    private Long targetId;
    
    /**
     * 结算对象名称
     */
    private String targetName;
    
    /**
     * 结算金额
     */
    private BigDecimal amount;
    
    /**
     * 手续费
     */
    private BigDecimal fee;
    
    /**
     * 实际到账
     */
    private BigDecimal actualAmount;
    
    /**
     * 结算状态 0-待确认 1-已确认 2-已打款 3-已完成
     */
    private Integer status;
    
    /**
     * 结算周期开始
     */
    private LocalDateTime periodStart;
    
    /**
     * 结算周期结束
     */
    private LocalDateTime periodEnd;
    
    /**
     * 确认时间
     */
    private LocalDateTime confirmTime;
    
    /**
     * 打款时间
     */
    private LocalDateTime payTime;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
