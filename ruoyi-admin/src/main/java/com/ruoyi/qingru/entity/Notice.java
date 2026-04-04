package com.ruoyi.qingru.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

/**
 * 公告实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Notice {
    
    private Long id;               // 公告 ID
    private String title;          // 公告标题
    private String content;        // 公告内容
    private Integer status;        // 状态：1=已发布，2=草稿，3=已下架
    private Date publishTime;      // 发布时间
    private Date createTime;       
}
