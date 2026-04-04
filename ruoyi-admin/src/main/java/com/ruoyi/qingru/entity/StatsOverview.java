package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 概览统计实体类
 */
public class StatsOverview {
    
    /**
     * 累计用户数
     */
    private Long totalUsers;
    
    /**
     * 累计订单数
     */
    private Long totalOrders;
    
    /**
     * 累计营收
     */
    private BigDecimal totalRevenue;
    
    /**
     * 今日新增用户
     */
    private Integer todayNewUsers;
    
    /**
     * 今日订单数
     */
    private Integer todayOrders;
    
    /**
     * 今日营收
     */
    private BigDecimal todayRevenue;
    
    /**
     * 活跃志愿者数
     */
    private Integer activeVolunteers;
    
    /**
     * 待处理事项数
     */
    private Integer pendingTodos;


    public Long getTotalUsers() {
        return totalUsers;
    }
    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }
    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public Integer getTodayNewUsers() {
        return todayNewUsers;
    }
    public void setTodayNewUsers(Integer todayNewUsers) {
        this.todayNewUsers = todayNewUsers;
    }

    public Integer getTodayOrders() {
        return todayOrders;
    }
    public void setTodayOrders(Integer todayOrders) {
        this.todayOrders = todayOrders;
    }

    public BigDecimal getTodayRevenue() {
        return todayRevenue;
    }
    public void setTodayRevenue(BigDecimal todayRevenue) {
        this.todayRevenue = todayRevenue;
    }

    public Integer getActiveVolunteers() {
        return activeVolunteers;
    }
    public void setActiveVolunteers(Integer activeVolunteers) {
        this.activeVolunteers = activeVolunteers;
    }

    public Integer getPendingTodos() {
        return pendingTodos;
    }
    public void setPendingTodos(Integer pendingTodos) {
        this.pendingTodos = pendingTodos;
    }
}
