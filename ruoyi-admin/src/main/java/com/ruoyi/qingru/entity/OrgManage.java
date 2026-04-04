package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 机构管理实体类
 */
@Data
public class OrgManage {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 机构名称
     */
    private String orgName;
    
    /**
     * 统一社会信用代码
     */
    private String creditCode;
    
    /**
     * 机构地址
     */
    private String address;
    
    /**
     * 联系人姓名
     */
    private String contactName;
    
    /**
     * 联系电话
     */
    private String contactPhone;
    
    /**
     * 状态 1 正常 0 禁用
     */
    private Integer status;
    
    /**
     * 累计执行订单数
     */
    private Integer totalOrders;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 更新时间
     */
    private Date updateTime;
}
