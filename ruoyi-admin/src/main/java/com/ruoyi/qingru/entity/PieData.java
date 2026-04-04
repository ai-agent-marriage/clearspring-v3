package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 饼图数据
 */
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


    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Number getValue() {
        return value;
    }
    public void setValue(Number value) {
        this.value = value;
    }
}
