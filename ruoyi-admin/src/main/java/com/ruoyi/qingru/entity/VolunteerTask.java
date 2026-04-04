package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 志愿者任务实体类
 */
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


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getOrderNo() {
        return orderNo;
    }
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }
    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getAssignTime() {
        return assignTime;
    }
    public void setAssignTime(Date assignTime) {
        this.assignTime = assignTime;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
