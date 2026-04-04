package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 任务执行结果实体类
 */
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

    public Date getExecuteTime() {
        return executeTime;
    }
    public void setExecuteTime(Date executeTime) {
        this.executeTime = executeTime;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public Integer getRealQuantity() {
        return realQuantity;
    }
    public void setRealQuantity(Integer realQuantity) {
        this.realQuantity = realQuantity;
    }

    public String getImages() {
        return images;
    }
    public void setImages(String images) {
        this.images = images;
    }

    public String getVideoUrl() {
        return videoUrl;
    }
    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getRemark() {
        return remark;
    }
    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getAuditReason() {
        return auditReason;
    }
    public void setAuditReason(String auditReason) {
        this.auditReason = auditReason;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
