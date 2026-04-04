package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 证书实体类
 */
public class Certificate {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 用户 ID
     */
    private Long userId;
    
    /**
     * 关联订单号
     */
    private String orderNo;
    
    /**
     * 关联免费记录 ID
     */
    private Long recordId;
    
    /**
     * 证书图片地址
     */
    private String certUrl;
    
    /**
     * 证书类型：1 免费证书 2 付费证书
     */
    private Integer certType;
    
    /**
     * 证书编号
     */
    private String certNo;
    
    /**
     * 证书内容
     */
    private String content;
    
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

    public Long getUserId() {
        return userId;
    }
    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getOrderNo() {
        return orderNo;
    }
    public void setOrderNo(String orderNo) {
        this.orderNo = orderNo;
    }

    public Long getRecordId() {
        return recordId;
    }
    public void setRecordId(Long recordId) {
        this.recordId = recordId;
    }

    public String getCertUrl() {
        return certUrl;
    }
    public void setCertUrl(String certUrl) {
        this.certUrl = certUrl;
    }

    public Integer getCertType() {
        return certType;
    }
    public void setCertType(Integer certType) {
        this.certType = certType;
    }

    public String getCertNo() {
        return certNo;
    }
    public void setCertNo(String certNo) {
        this.certNo = certNo;
    }

    public String getContent() {
        return content;
    }
    public void setContent(String content) {
        this.content = content;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
