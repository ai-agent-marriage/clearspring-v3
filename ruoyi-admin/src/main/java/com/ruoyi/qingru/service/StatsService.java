package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.*;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.UserMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * 数据统计服务类
 */
@Slf4j
@Service
public class StatsService {
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    @Autowired
    private VolunteerMapper volunteerMapper;
    
    /**
     * 获取仪表盘统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 仪表盘统计数据
     */
    public StatsDashboard getDashboard(String startDate, String endDate) {
        log.info("获取仪表盘统计数据，startDate={}, endDate={}", startDate, endDate);
        
        StatsDashboard dashboard = new StatsDashboard();
        
        dashboard.setTotalUsers((long) userMapper.countTotal());
        dashboard.setTotalOrders((long) orderMapper.countTotal());
        dashboard.setTotalAmount(orderMapper.sumTotalAmount());
        dashboard.setActiveVolunteers((long) volunteerMapper.countActive());
        dashboard.setTodayOrders((long) orderMapper.countToday());
        dashboard.setTodayAmount(orderMapper.sumTodayAmount());
        
        log.info("获取仪表盘统计数据成功，totalUsers={}, totalOrders={}", 
                dashboard.getTotalUsers(), dashboard.getTotalOrders());
        return dashboard;
    }
    
    /**
     * 获取订单趋势数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param groupBy 分组方式 (day/week/month)
     * @return 趋势数据列表
     */
    public List<TrendData> getOrderTrend(String startDate, String endDate, String groupBy) {
        log.info("获取订单趋势数据，startDate={}, endDate={}, groupBy={}", startDate, endDate, groupBy);
        return orderMapper.selectTrend(startDate, endDate, groupBy);
    }
    
    /**
     * 获取物种分布数据
     * @return 物种分布列表
     */
    public List<PieData> getSpeciesDistribution() {
        log.info("获取物种分布数据");
        return orderMapper.selectSpeciesDistribution();
    }
}
