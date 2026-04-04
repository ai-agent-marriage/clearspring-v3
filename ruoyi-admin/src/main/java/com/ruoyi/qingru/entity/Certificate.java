package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 证书实体类
 */
@Data
public class Certificate {
    /**
     * 主键 ID
     */
    private Long id;
    
    /**
     * 用户 ID
     */
    private Long userId;
    
    /**
     * 关联订单号
     */
    private String orderNo;
    
    /**
     * 关联免费记录 ID
     */
    private Long recordId;
    
    /**
     * 证书图片地址
     */
    private String certUrl;
    
    /**
     * 证书类型：1 免费证书 2 付费证书
     */
    private Integer certType;
    
    /**
     * 证书编号
     */
    private String certNo;
    
    /**
     * 证书内容
     */
    private String content;
    
    /**
     * 创建时间
     */
    private Date createTime;
}
