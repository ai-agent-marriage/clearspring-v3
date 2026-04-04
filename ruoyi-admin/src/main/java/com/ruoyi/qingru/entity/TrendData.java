package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 运营数据趋势
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TrendData {
    
    /**
     * 日期
     */
    private String date;
    
    /**
     * 指标值
     */
    private Number value;
    
    /**
     * 指标名称
     */
    private String metric;
}
