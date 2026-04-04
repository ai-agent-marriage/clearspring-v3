package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 用户反馈实体类
 */
@Data
public class Feedback {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 提交用户 ID
     */
    private Long userId;
    
    /**
     * 反馈类型：功能建议/Bug 反馈/其他
     */
    private String type;
    
    /**
     * 反馈标题
     */
    private String title;
    
    /**
     * 反馈内容
     */
    private String content;
    
    /**
     * 图片（逗号分隔）
     */
    private String images;
    
    /**
     * 联系方式
     */
    private String contact;
    
    /**
     * 状态：1 待处理 2 已处理
     */
    private Integer status;
    
    /**
     * 回复内容
     */
    private String reply;
    
    /**
     * 创建时间
     */
    private Date createTime;
}
