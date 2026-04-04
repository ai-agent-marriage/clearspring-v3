package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 排行榜数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RankData {
    
    /**
     * ID
     */
    private Long id;
    
    /**
     * 名称
     */
    private String name;
    
    /**
     * 数值
     */
    private Integer value;
    
    /**
     * 排名
     */
    private Integer rank;
}
