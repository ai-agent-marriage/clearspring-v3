package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 排行榜数据
 */
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


    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public Integer getValue() {
        return value;
    }
    public void setValue(Integer value) {
        this.value = value;
    }

    public Integer getRank() {
        return rank;
    }
    public void setRank(Integer rank) {
        this.rank = rank;
    }
}
