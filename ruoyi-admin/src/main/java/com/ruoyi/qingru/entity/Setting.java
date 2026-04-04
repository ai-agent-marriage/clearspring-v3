package com.ruoyi.qingru.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统设置实体
 */
@Data
public class Setting {
    /**
     * 设置 ID
     */
    private Long id;
    
    /**
     * 设置键
     */
    private String key;
    
    /**
     * 设置值
     */
    private String value;
    
    /**
     * 设置类型 1-字符串 2-数字 3-布尔 4-JSON
     */
    private Integer type;
    
    /**
     * 设置名称
     */
    private String name;
    
    /**
     * 设置描述
     */
    private String description;
    
    /**
     * 是否可修改 0-否 1-是
     */
    private Integer editable;
    
    /**
     * 分组
     */
    private String group;
    
    /**
     * 排序
     */
    private Integer sort;
    
    /**
     * 更新时间
     */
    private LocalDateTime updateTime;
    
    /**
     * 更新人
     */
    private String updateBy;
}
