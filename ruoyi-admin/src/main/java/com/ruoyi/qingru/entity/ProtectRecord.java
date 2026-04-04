package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 护生记录实体类
 */
@Data
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
}
