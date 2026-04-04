package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 订单导出 DTO
 */
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


    public String getOrderNo() {
        return orderNo;
    }
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public String getSpeciesName() {
        return speciesName;
    }
    public void setSpeciesName(String speciesName) {
        this.speciesName = speciesName;
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

    public String getStatusName() {
        return statusName;
    }
    public void setStatusName(String statusName) {
        this.statusName = statusName;
    }
}
