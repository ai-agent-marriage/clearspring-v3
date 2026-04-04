package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 微信订阅消息模板实体类
 */
@Data
public class MessageTemplate {
    
    private Long id;               // 模板 ID
    private String name;           // 模板名称
    private String templateId;     // 微信模板 ID
    private String trigger;        // 触发条件
    private String content;        // 消息内容
    private Integer enabled;       // 1 启用 0 禁用
    private Date createTime;       // 创建时间

    public MessageTemplate() {
    }

    public MessageTemplate(Long id, String name, String templateId, String trigger, String content, Integer enabled, Date createTime) {
        this.id = id;
        this.name = name;
        this.templateId = templateId;
        this.trigger = trigger;
        this.content = content;
        this.enabled = enabled;
        this.createTime = createTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public String getTrigger() {
        return trigger;
    }

    public void setTrigger(String trigger) {
        this.trigger = trigger;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getEnabled() {
        return enabled;
    }

    public void setEnabled(Integer enabled) {
        this.enabled = enabled;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
