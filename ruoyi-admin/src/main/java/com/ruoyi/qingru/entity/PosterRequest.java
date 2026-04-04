package com.ruoyi.qingru.entity;

import lombok.Data;

/**
 * 海报生成请求实体类
 */
@Data
public class PosterRequest {
    /**
     * 禅理内容
     */
    private String zenQuote;
    
    /**
     * 背景图 URL
     */
    private String bgUrl;
}
