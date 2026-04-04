package com.ruoyi.qingru.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 机构待办事项
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrgTodo {
    
    /**
     * 待办类型：audit-待审核，settle-待结算，dispute-待处理异议
     */
    private String type;
    
    /**
     * 待办标题
     */
    private String title;
    
    /**
     * 待办数量
     */
    private Integer count;
}
