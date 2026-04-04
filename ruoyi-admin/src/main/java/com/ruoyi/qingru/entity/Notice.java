package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 公告实体类
 */
@Data
public class Notice {
    
    private Long id;               // 公告 ID
    private String title;          // 公告标题
    private String content;        // 公告内容
    private Integer status;        // 状态：1=已发布，2=草稿，3=已下架
    private Date publishTime;      // 发布时间
    private Date createTime;       // 创建时间

    public Notice() {
    }

    public Notice(Long id, String title, String content, Integer status, Date publishTime, Date createTime) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.status = status;
        this.publishTime = publishTime;
        this.createTime = createTime;
    }

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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getStatus() {
        return status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    public Date getPublishTime() {
        return publishTime;
    }

    public void setPublishTime(Date publishTime) {
        this.publishTime = publishTime;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
