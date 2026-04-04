package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 机构承接订单实体类
 */
@Data
public class OrgOrder {
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
     * 承接状态 1 待承接 2 已承接
     */
    private Integer status;
    
    /**
     * 承接时间
     */
    private Date acceptTime;
    
    /**
     * 创建时间
     */
    private Date createTime;
}
