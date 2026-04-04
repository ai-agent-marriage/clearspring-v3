package com.ruoyi.qingru.entity;

import lombok.Data;
import java.time.LocalDateTime;

/**
 * 系统日志实体
 */
@Data
public class SystemLog {
    /**
     * 日志 ID
     */
    private Long id;
    
    /**
     * 日志级别 1-DEBUG 2-INFO 3-WARN 4-ERROR 5-FATAL
     */
    private Integer level;
    
    /**
     * 日志来源
     */
    private String source;
    
    /**
     * 日志内容
     */
    private String message;
    
    /**
     * 异常信息
     */
    private String exception;
    
    /**
     * 请求 IP
     */
    private String ip;
    
    /**
     * 请求 URL
     */
    private String url;
    
    /**
     * 请求方法
     */
    private String method;
    
    /**
     * 用户 ID
     */
    private Long userId;
    
    /**
     * 用户姓名
     */
    private String userName;
    
    /**
     * 执行时长 (毫秒)
     */
    private Long duration;
    
    /**
     * 创建时间
     */
    private LocalDateTime createTime;
}
