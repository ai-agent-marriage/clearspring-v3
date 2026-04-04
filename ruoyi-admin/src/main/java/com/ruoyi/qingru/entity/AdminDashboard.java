package com.ruoyi.qingru.entity;

import lombok.Data;
import java.math.BigDecimal;

/**
 * 后台管理仪表盘数据
 */
public class AdminDashboard {
    
    /**
     * 累计注册用户数
     */
    private Integer totalUsers;
    
    /**
     * 今日日活用户数
     */
    private Integer dailyActiveUsers;
    
    /**
     * 累计委托订单数
     */
    private Integer totalOrders;
    
    /**
     * 累计平台营收
     */
    private BigDecimal totalRevenue;
    
    /**
     * 订单完成率
     */
    private BigDecimal orderCompletionRate;
    
    /**
     * 内容审核通过率
     */
    private BigDecimal contentAuditRate;


    public Integer getTotalUsers() {
        return totalUsers;
    }
    public void setTotalUsers(Integer totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Integer getDailyActiveUsers() {
        return dailyActiveUsers;
    }
    public void setDailyActiveUsers(Integer dailyActiveUsers) {
        this.dailyActiveUsers = dailyActiveUsers;
    }

    public Integer getTotalOrders() {
        return totalOrders;
    }
    public void setTotalOrders(Integer totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }
    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getOrderCompletionRate() {
        return orderCompletionRate;
    }
    public void setOrderCompletionRate(BigDecimal orderCompletionRate) {
        this.orderCompletionRate = orderCompletionRate;
    }

    public BigDecimal getContentAuditRate() {
        return contentAuditRate;
    }
    public void setContentAuditRate(BigDecimal contentAuditRate) {
        this.contentAuditRate = contentAuditRate;
    }
}
