package com.ruoyi.qingru.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 备份实体
 */
@Data
public class Backup {
    /**
     * 备份 ID
     */
    private Long id;
    
    /**
     * 备份名称
     */
    private String name;
    
    /**
     * 备份类型 1-数据库备份 2-文件备份 3-全量备份
     */
    private Integer type;
    
    /**
     * 备份文件大小 (字节)
     */
    private Long size;
    
    /**
     * 备份文件路径
     */
    private String filePath;
    
    /**
     * 备份状态 0-进行中 1-成功 2-失败
     */
    private Integer status;
    
    /**
     * 备份描述
     */
    private String description;
    
    /**
     * 备份开始时间
     */
    private LocalDateTime startTime;
    
    /**
     * 备份结束时间
     */
    private LocalDateTime endTime;
    
    /**
     * 创建人
     */
    private String createBy;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
