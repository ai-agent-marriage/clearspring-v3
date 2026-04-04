package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 饼图数据
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PieData {
    
    /**
     * 名称
     */
    private String name;
    
    /**
     * 数值
     */
    private Number value;
}
