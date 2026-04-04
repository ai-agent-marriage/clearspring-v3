package com.ruoyi.qingru.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

/**
 * 微信订阅消息模板实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MessageTemplate {
    
    private Long id;               // 模板 ID
    private String name;           // 模板名称
    private String templateId;     // 微信模板 ID
    private String trigger;        // 触发条件
    private String content;        // 消息内容
    private Integer enabled;       // 1 启用 0 禁用
    private Date createTime;       
}
