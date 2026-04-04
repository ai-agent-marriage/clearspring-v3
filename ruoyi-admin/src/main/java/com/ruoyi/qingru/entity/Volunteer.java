package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 志愿者实体类
 */
public class Volunteer {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 用户 ID
     */
    private Long userId;
    
    /**
     * 真实姓名
     */
    private String realName;
    
    /**
     * 身份证号
     */
    private String idCard;
    
    /**
     * 联系电话
     */
    private String phone;
    
    /**
     * 所属机构 ID
     */
    private Long orgId;
    
    /**
     * 状态 1 正常 0 禁用
     */
    private Integer status;
    
    /**
     * 累计完成任务数
     */
    private Integer totalTasks;
    
    /**
     * 累计公益服务时长
     */
    private Integer serviceHours;
    
    /**
     * 合规执行率
     */
    private BigDecimal complianceRate;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 更新时间
     */
    private Date updateTime;


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

    public String getRealName() {
        return realName;
    }
    public void setRealName(String realName) {
        this.realName = realName;
    }

    public String getIdCard() {
        return idCard;
    }
    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Long getOrgId() {
        return orgId;
    }
    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public Integer getTotalTasks() {
        return totalTasks;
    }
    public void setTotalTasks(Integer totalTasks) {
        this.totalTasks = totalTasks;
    }

    public Integer getServiceHours() {
        return serviceHours;
    }
    public void setServiceHours(Integer serviceHours) {
        this.serviceHours = serviceHours;
    }

    public BigDecimal getComplianceRate() {
        return complianceRate;
    }
    public void setComplianceRate(BigDecimal complianceRate) {
        this.complianceRate = complianceRate;
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
