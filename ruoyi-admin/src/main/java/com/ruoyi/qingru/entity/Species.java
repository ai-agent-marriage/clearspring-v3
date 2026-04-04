package com.ruoyi.qingru.entity;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.Date;

/**
 * 物种实体类
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Species {
    
    private Long id;
    private String name;           // 物种名称
    private String scientificName; // 学名
    private Integer type;          // 类型：1=鱼类，2=鸟类，3=哺乳类，4=爬行类，5=两栖类
    private Integer isForbid;      // 是否禁止投放：0=可投放，1=禁止
    private String remark;         // 备注
    private Integer sort;          // 排序
    private Date createTime;       
}
