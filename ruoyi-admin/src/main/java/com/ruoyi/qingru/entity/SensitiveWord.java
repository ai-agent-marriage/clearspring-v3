package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 敏感词实体类
 */
@Data
public class SensitiveWord {
    
    private Long id;               // 敏感词 ID
    private String word;           // 敏感词
    private Integer level;         // 敏感级别：1=低，2=中，3=高
    private Integer status;        // 状态：1=启用，0=禁用
    private Date createTime;       // 创建时间

    public SensitiveWord() {
    }

    public SensitiveWord(Long id, String word, Integer level, Integer status, Date createTime) {
        this.id = id;
        this.word = word;
        this.level = level;
        this.status = status;
        this.createTime = createTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
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
