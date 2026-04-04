package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.Date;

/**
 * 物种实体类
 */
@Data
public class Species {
    
    private Long id;
    private String name;           // 物种名称
    private String scientificName; // 学名
    private Integer type;          // 类型：1=鱼类，2=鸟类，3=哺乳类，4=爬行类，5=两栖类
    private Integer isForbid;      // 是否禁止投放：0=可投放，1=禁止
    private String remark;         // 备注
    private Integer sort;          // 排序
    private Date createTime;       // 创建时间

    public Species() {
    }

    public Species(Long id, String name, String scientificName, Integer type, Integer isForbid, String remark, Integer sort, Date createTime) {
        this.id = id;
        this.name = name;
        this.scientificName = scientificName;
        this.type = type;
        this.isForbid = isForbid;
        this.remark = remark;
        this.sort = sort;
        this.createTime = createTime;
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

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getSort() {
        return sort;
    }

    public void setSort(Integer sort) {
        this.sort = sort;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }
}
