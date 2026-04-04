package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;
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
}
