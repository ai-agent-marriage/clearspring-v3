package com.ruoyi.qingru.entity;

import lombok.Data;
import java.util.List;

/**
 * 机构工作台数据
 */
@Data
public class OrgDashboard {
    
    /**
     * 待承接订单数
     */
    private Integer pendingOrders;
    
    /**
     * 今日待执行订单数
     */
    private Integer todayTasks;
    
    /**
     * 待用户确认订单数
     */
    private Integer pendingConfirm;
    
    /**
     * 累计圆满执行订单数
     */
    private Integer completedOrders;
    
    /**
     * 待办事项列表
     */
    private List<OrgTodo> todos;
}
