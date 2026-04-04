package com.ruoyi.qingru.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

/**
 * 敏感词实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SensitiveWord {
    
    private Long id;               // 敏感词 ID
    private String word;           // 敏感词
    private Integer level;         // 敏感级别：1=低，2=中，3=高
    private Integer status;        // 状态：1=启用，0=禁用
    private Date createTime;       
}
