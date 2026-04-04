package com.ruoyi.qingru.entity;

import lombok.Data;

/**
 * 海报生成请求实体类
 */
public class PosterRequest {
    /**
     * 禅理内容
     */
    private String zenQuote;
    
    /**
     * 背景图 URL
     */
    private String bgUrl;


    public String getZenQuote() {
        return zenQuote;
    }
    public void setZenQuote(String zenQuote) {
        this.zenQuote = zenQuote;
    }

    public String getBgUrl() {
        return bgUrl;
    }
    public void setBgUrl(String bgUrl) {
        this.bgUrl = bgUrl;
    }
}
