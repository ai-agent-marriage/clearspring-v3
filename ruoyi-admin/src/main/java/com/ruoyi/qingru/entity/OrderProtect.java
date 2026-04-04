package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 护生订单实体类
 */
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


    public String getOrderNo() {
        return orderNo;
    }
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getOrgId() {
        return orgId;
    }
    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Long getVolunteerId() {
        return volunteerId;
    }
    public void setVolunteerId(Long volunteerId) {
        this.volunteerId = volunteerId;
    }

    public Long getSpeciesId() {
        return speciesId;
    }
    public void setSpeciesId(Long speciesId) {
        this.speciesId = speciesId;
    }

    public Integer getQuantity() {
        return quantity;
    }
    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAmount() {
        return amount;
    }
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getExecuteImages() {
        return executeImages;
    }
    public void setExecuteImages(String executeImages) {
        this.executeImages = executeImages;
    }

    public Date getPayTime() {
        return payTime;
    }
    public void setPayTime(Date payTime) {
        this.payTime = payTime;
    }

    public Date getCompleteTime() {
        return completeTime;
    }
    public void setCompleteTime(Date completeTime) {
        this.completeTime = completeTime;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }
    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }
}
