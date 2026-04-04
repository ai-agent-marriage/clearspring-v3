package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Map;

/**
 * 测试消息请求实体类
 */
@Data
public class TestMessageRequest {
    
    private String openid;                    // 用户 openid
    private String templateId;                // 模板 ID
    private Map<String, String> data;         // 消息数据
    private String page;                      // 跳转页面（可选）

    public TestMessageRequest() {
    }

    public TestMessageRequest(String openid, String templateId, Map<String, String> data, String page) {
        this.openid = openid;
        this.templateId = templateId;
        this.data = data;
        this.page = page;
    }

    public String getOpenid() {
        return openid;
    }

    public void setOpenid(String openid) {
        this.openid = openid;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setTemplateId(String templateId) {
        this.templateId = templateId;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    public String getPage() {
        return page;
    }

    public void setPage(String page) {
        this.page = page;
    }
}
