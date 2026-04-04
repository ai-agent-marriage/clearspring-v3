package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 护生记录实体类
 */
public class ProtectRecord {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 用户 openid（未注册为空）
     */
    private String userOpenid;
    
    /**
     * 物种 ID
     */
    private Long speciesId;
    
    /**
     * 数量
     */
    private Integer quantity;
    
    /**
     * 护生地点
     */
    private String address;
    
    /**
     * 备注
     */
    private String remark;
    
    /**
     * 现场照片（逗号分隔）
     */
    private String images;
    
    /**
     * 状态：1 已完成 2 已驳回
     */
    private Integer status;
    
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

    public String getUserOpenid() {
        return userOpenid;
    }
    public void setUserOpenid(String userOpenid) {
        this.userOpenid = userOpenid;
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

    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }

    public String getRemark() {
        return remark;
    }
    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getImages() {
        return images;
    }
    public void setImages(String images) {
        this.images = images;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
