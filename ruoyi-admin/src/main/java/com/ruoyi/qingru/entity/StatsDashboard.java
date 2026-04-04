package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 数据统计仪表盘
 */
public class StatsDashboard {
    
    /**
     * 累计用户数
     */
    private Long totalUsers;
    
    /**
     * 累计订单数
     */
    private Long totalOrders;
    
    /**
     * 累计成交金额
     */
    private BigDecimal totalAmount;
    
    /**
     * 活跃志愿者数
     */
    private Long activeVolunteers;
    
    /**
     * 今日订单数
     */
    private Long todayOrders;
    
    /**
     * 今日成交金额
     */
    private BigDecimal todayAmount;


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

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }
    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Long getActiveVolunteers() {
        return activeVolunteers;
    }
    public void setActiveVolunteers(Long activeVolunteers) {
        this.activeVolunteers = activeVolunteers;
    }

    public Long getTodayOrders() {
        return todayOrders;
    }
    public void setTodayOrders(Long todayOrders) {
        this.todayOrders = todayOrders;
    }

    public BigDecimal getTodayAmount() {
        return todayAmount;
    }
    public void setTodayAmount(BigDecimal todayAmount) {
        this.todayAmount = todayAmount;
    }
}
