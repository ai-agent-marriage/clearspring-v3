package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 任务执行结果实体类
 */
@Data
public class TaskExecute {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 订单号
     */
    private String orderNo;
    
    /**
     * 志愿者 ID
     */
    private Long volunteerId;
    
    /**
     * 执行时间
     */
    private Date executeTime;
    
    /**
     * 实际投放点位
     */
    private String address;
    
    /**
     * 实际投放数量
     */
    private Integer realQuantity;
    
    /**
     * 现场照片（逗号分隔）
     */
    private String images;
    
    /**
     * 执行视频
     */
    private String videoUrl;
    
    /**
     * 执行备注
     */
    private String remark;
    
    /**
     * 审核状态 1 待审核 2 审核通过 3 审核驳回
     */
    private Integer status;
    
    /**
     * 审核驳回原因
     */
    private String auditReason;
    
    /**
     * 创建时间
     */
    private Date createTime;
}
