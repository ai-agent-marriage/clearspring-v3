package com.ruoyi.qingru.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

/**
 * 帮助文档实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class HelpDoc {
    
    private Long id;               // 文档 ID
    private String title;          // 文档标题
    private String content;        // 文档内容
    private String category;       // 分类
    private Integer sort;          // 排序
    private Integer viewCount;     // 浏览次数
    private Date createTime;       
}
