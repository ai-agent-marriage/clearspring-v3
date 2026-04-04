package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 站内信实体类
 */
@Data
public class InternalMessage {
    
    private Long id;               // 消息 ID
    private Long userId;           // 接收用户 ID
    private String title;          // 消息标题
    private String content;        // 消息内容
    private Integer type;          // 1 订单通知 2 系统通知
    private Integer status;        // 1 未读 2 已读
    private Date createTime;       // 创建时间

    public InternalMessage() {
    }

    public InternalMessage(Long id, Long userId, String title, String content, Integer type, Integer status, Date createTime) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.type = type;
        this.status = status;
        this.createTime = createTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
