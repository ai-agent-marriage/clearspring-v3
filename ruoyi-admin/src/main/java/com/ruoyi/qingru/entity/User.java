package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户实体类
 */
public class User {
    /**
     * 用户 ID
     */
    private Long id;
    
    /**
     * 微信 openid
     */
    private String openid;
    
    /**
     * 昵称
     */
    private String nickname;
    
    /**
     * 头像 URL
     */
    private String avatar;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 角色代码
     */
    private String roleCode;
    
    /**
     * 组织 ID
     */
    private Long orgId;
    
    /**
     * 功德值
     */
    private Integer merit;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 更新时间
     */
    private Date updateTime;
    
    /**
     * 用户状态：0-禁用 1-正常
     */
    private Integer status;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getOpenid() {
        return openid;
    }
    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getNickname() {
        return nickname;
    }
    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getAvatar() {
        return avatar;
    }
    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPhone() {
        return phone;
    }
    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getRoleCode() {
        return roleCode;
    }
    public void setRoleCode(String roleCode) {
        this.roleCode = roleCode;
    }

    public Long getOrgId() {
        return orgId;
    }
    public void setOrgId(Long orgId) {
        this.orgId = orgId;
    }

    public Integer getMerit() {
        return merit;
    }
    public void setMerit(Integer merit) {
        this.merit = merit;
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

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }
}
