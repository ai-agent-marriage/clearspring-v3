package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.*;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.UserMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 数据统计服务类
 */
@Service
public class StatsService {
    private static final Logger log = LoggerFactory.getLogger(StatsService.class);

    
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
    @Cacheable(value = "stats:dashboard", key = "#startDate + '-' + #endDate", unless = "#result == null")
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
    @Cacheable(value = "stats:trend", key = "#startDate + '-' + #endDate + '-' + #groupBy", unless = "#result == null")
    public List<TrendData> getTrend(String startDate, String endDate, String groupBy) {
        log.info("获取订单趋势数据，startDate={}, endDate={}, groupBy={}", startDate, endDate, groupBy);
        return orderMapper.selectTrend(startDate, endDate, groupBy);
    }
    
    /**
     * 获取物种分布数据
     * @return 物种分布列表
     */
    @Cacheable(value = "stats:species", unless = "#result == null")
    public List<PieData> getSpeciesDistribution() {
        log.info("获取物种分布数据");
        return orderMapper.selectSpeciesDistribution();
    }
    
    /**
     * 获取志愿者排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @Cacheable(value = "stats:rank:volunteer", key = "#limit", unless = "#result == null")
    public List<RankData> getVolunteerRank(Integer limit) {
        log.info("获取志愿者排行榜，limit={}", limit);
        List<RankData> rankList = volunteerMapper.selectRank(limit);
        for (int i = 0; i < rankList.size(); i++) {
            rankList.get(i).setRank(i + 1);
        }
        return rankList;
    }
    
    /**
     * 获取机构排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @Cacheable(value = "stats:rank:org", key = "#limit", unless = "#result == null")
    public List<RankData> getOrgRank(Integer limit) {
        log.info("获取机构排行榜，limit={}", limit);
        List<RankData> rankList = orderMapper.selectOrgRank(limit);
        for (int i = 0; i < rankList.size(); i++) {
            rankList.get(i).setRank(i + 1);
        }
        return rankList;
    }
}
