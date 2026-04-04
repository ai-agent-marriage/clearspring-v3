package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 帮助文档实体类
 */
@Data
public class HelpDoc {
    
    private Long id;               // 文档 ID
    private String title;          // 文档标题
    private String content;        // 文档内容
    private String category;       // 分类
    private Integer sort;          // 排序
    private Integer viewCount;     // 浏览次数
    private Date createTime;       // 创建时间

    public HelpDoc() {
    }

    public HelpDoc(Long id, String title, String content, String category, Integer sort, Integer viewCount, Date createTime) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.sort = sort;
        this.viewCount = viewCount;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Integer getViewCount() {
        return viewCount;
    }

    public void setViewCount(Integer viewCount) {
        this.viewCount = viewCount;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
