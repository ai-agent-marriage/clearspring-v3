package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户实体类
 */
@Data
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
}
