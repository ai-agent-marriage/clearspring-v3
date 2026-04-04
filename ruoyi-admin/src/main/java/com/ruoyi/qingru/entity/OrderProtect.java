package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 护生订单实体类
 */
@Data
public class OrderProtect {
    /**
     * 订单号（主键）
     */
    private String orderNo;
    
    /**
     * 下单用户 ID
     */
    private Long userId;
    
    /**
     * 承接机构 ID
     */
    private Long orgId;
    
    /**
     * 执行志愿者 ID
     */
    private Long volunteerId;
    
    /**
     * 物种 ID
     */
    private Long speciesId;
    
    /**
     * 数量
     */
    private Integer quantity;
    
    /**
     * 订单金额
     */
    private BigDecimal amount;
    
    /**
     * 状态：1 待承接 2 待执行 3 执行中 4 待确认 5 已完成 6 已取消
     */
    private Integer status;
    
    /**
     * 护生地点
     */
    private String address;
    
    /**
     * 执行照片/视频
     */
    private String executeImages;
    
    /**
     * 支付时间
     */
    private Date payTime;
    
    /**
     * 完成时间
     */
    private Date completeTime;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 更新时间
     */
    private Date updateTime;
}
