package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 待办事项实体类
 */
public class TodoItem {
    
    /**
     * 待办 ID
     */
    private Long id;
    
    /**
     * 待办标题
     */
    private String title;
    
    /**
     * 待办描述
     */
    private String description;
    
    /**
     * 待办类型：1-用户反馈 2-内容审核 3-订单处理 4-系统通知
     */
    private Integer type;
    
    /**
     * 优先级：1-低 2-中 3-高
     */
    private Integer priority;
    
    /**
     * 状态：0-待处理 1-处理中 2-已完成
     */
    private Integer status;
    
    /**
     * 关联 ID（如反馈 ID、订单 ID 等）
     */
    private Long relationId;
    
    /**
     * 创建时间
     */
    private Date createTime;
    
    /**
     * 截止时间
     */
    private Date deadline;


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getType() {
        return type;
    }
    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getPriority() {
        return priority;
    }
    public void setPriority(Integer priority) {
        this.priority = priority;
    }

    public Integer getStatus() {
        return status;
    }
    public void setStatus(Integer status) {
        this.status = status;
    }

    public Long getRelationId() {
        return relationId;
    }
    public void setRelationId(Long relationId) {
        this.relationId = relationId;
    }

    public Date getCreateTime() {
        return createTime;
    }
    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Date getDeadline() {
        return deadline;
    }
    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }
}
