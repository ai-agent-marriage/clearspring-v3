package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 志愿者任务实体类
 */
@Data
public class VolunteerTask {
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
     * 任务状态 1 待执行 2 执行中 3 已完成
     */
    private Integer status;
    
    /**
     * 分配时间
     */
    private Date assignTime;
    
    /**
     * 创建时间
     */
    private Date createTime;
}
