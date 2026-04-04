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
    
    // 手动添加构造函数
    public OrgDashboard() {}
    
    public OrgDashboard(Integer pendingOrders, Integer todayTasks, Integer pendingConfirm, 
                        Integer completedOrders, List<OrgTodo> todos) {
        this.pendingOrders = pendingOrders;
        this.todayTasks = todayTasks;
        this.pendingConfirm = pendingConfirm;
        this.completedOrders = completedOrders;
        this.todos = todos;
    }
    
    // 手动添加 setter 方法（确保 Lombok 正确生成）
    public void setPendingOrders(Integer pendingOrders) {
        this.pendingOrders = pendingOrders;
    }
    
    public void setTodayTasks(Integer todayTasks) {
        this.todayTasks = todayTasks;
    }
    
    public void setPendingConfirm(Integer pendingConfirm) {
        this.pendingConfirm = pendingConfirm;
    }
    
    public void setCompletedOrders(Integer completedOrders) {
        this.completedOrders = completedOrders;
    }
    
    public void setTodos(List<OrgTodo> todos) {
        this.todos = todos;
    }
}
