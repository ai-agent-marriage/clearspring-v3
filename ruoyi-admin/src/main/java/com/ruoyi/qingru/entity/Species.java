package com.ruoyi.qingru.entity;

/**
 * 物种实体类
 */
public class Species {
    
    private Long id;
    private String name;           // 中文名
    private String scientificName; // 学名
    private Integer type;          // 类型：1=鱼类，2=鸟类，3=哺乳类，4=爬行类，5=两栖类
    private Integer isForbid;      // 是否禁止投放：0=可投放，1=禁止
    private String description;    // 描述

    public Species() {
    }

    public Species(Long id, String name, String scientificName, Integer type, Integer isForbid, String description) {
        this.id = id;
        this.name = name;
        this.scientificName = scientificName;
        this.type = type;
        this.isForbid = isForbid;
        this.description = description;
    }

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

    public String getScientificName() {
        return scientificName;
    }

    public void setScientificName(String scientificName) {
        this.scientificName = scientificName;
    }

    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }

    public Integer getIsForbid() {
        return isForbid;
    }

    public void setIsForbid(Integer isForbid) {
        this.isForbid = isForbid;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
