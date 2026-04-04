package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.SettlementMapper;
import com.ruoyi.qingru.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 后台管理服务类
 */
@Slf4j
@Service
public class AdminService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    @Autowired
    private SettlementMapper settlementMapper;
    
    /**
     * 获取后台管理仪表盘数据
     * @return 仪表盘数据
     */
    public AdminDashboard getAdminDashboard() {
        log.info("获取后台管理仪表盘数据");
        
        AdminDashboard dashboard = new AdminDashboard();
        
        // 统计累计注册用户数
        dashboard.setTotalUsers(userMapper.countTotalUsers());
        
        // 统计今日日活
        dashboard.setDailyActiveUsers(userMapper.countDailyActiveUsers());
        
        // 统计累计委托订单数
        dashboard.setTotalOrders(orderMapper.countTotalOrders());
        
        // 统计累计平台营收
        dashboard.setTotalRevenue(settlementMapper.sumTotalRevenue());
        
        // 统计订单完成率
        dashboard.setOrderCompletionRate(calculateOrderCompletionRate());
        
        // 统计内容审核通过率
        dashboard.setContentAuditRate(calculateContentAuditRate());
        
        log.info("获取后台管理仪表盘数据成功，totalUsers={}, totalOrders={}", 
                dashboard.getTotalUsers(), dashboard.getTotalOrders());
        return dashboard;
    }
    
    /**
     * 获取运营数据趋势
     * @param metric 指标名称
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 趋势数据列表
     */
    public List<TrendData> getTrend(String metric, String startDate, String endDate) {
        log.info("获取运营数据趋势，metric={}, startDate={}, endDate={}", metric, startDate, endDate);
        
        List<TrendData> trend = new ArrayList<>();
        
        // TODO: 实现真实的趋势数据查询
        // 这里返回模拟数据用于演示
        Random random = new Random();
        String[] dates = generateDateRange(startDate, endDate);
        
        for (String date : dates) {
            Number value;
            if ("users".equals(metric)) {
                value = 100 + random.nextInt(50);
            } else if ("orders".equals(metric)) {
                value = 50 + random.nextInt(30);
            } else if ("revenue".equals(metric)) {
                value = new BigDecimal(1000 + random.nextInt(500));
            } else {
                value = random.nextInt(100);
            }
            trend.add(new TrendData(date, value, metric));
        }
        
        log.info("获取运营数据趋势成功，metric={}, count={}", metric, trend.size());
        return trend;
    }
    
    /**
     * 计算订单完成率
     * @return 订单完成率（百分比）
     */
    private BigDecimal calculateOrderCompletionRate() {
        // TODO: 实现真实的订单完成率计算
        return new BigDecimal("85.00");
    }
    
    /**
     * 计算内容审核通过率
     * @return 内容审核通过率（百分比）
     */
    private BigDecimal calculateContentAuditRate() {
        // TODO: 实现真实的内容审核通过率计算
        return new BigDecimal("95.00");
    }
    
    /**
     * 生成日期范围
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 日期数组
     */
    private String[] generateDateRange(String startDate, String endDate) {
        // 简单实现，返回 7 天数据
        return new String[]{"2026-04-01", "2026-04-02", "2026-04-03", 
                           "2026-04-04", "2026-04-05", "2026-04-06", "2026-04-07"};
    }
}
