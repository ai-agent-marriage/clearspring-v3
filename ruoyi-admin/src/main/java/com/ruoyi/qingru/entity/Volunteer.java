package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 志愿者实体类
 */
@Data
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
     * 机构 ID
     */
    private Long orgId;
    
    /**
     * 志愿者姓名
     */
    private String name;
    
    /**
     * 手机号
     */
    private String phone;
    
    /**
     * 状态 1 可用 0 禁用
     */
    private Integer status;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 更新时间
     */
    private Date updateTime;
}
