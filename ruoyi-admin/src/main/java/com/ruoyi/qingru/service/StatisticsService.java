package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.PlatformStatistics;
import com.ruoyi.qingru.entity.Statistics;
import com.ruoyi.qingru.mapper.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 统计服务类
 */
@Service
public class StatisticsService {
    private static final Logger log = LoggerFactory.getLogger(StatisticsService.class);

    
    @Autowired
    private OrderProtectMapper orderMapper;
    
    @Autowired
    private VolunteerMapper volunteerMapper;
    
    @Autowired
    private TaskExecuteMapper taskExecuteMapper;
    
    @Autowired
    private UserMapper userMapper;
    
    @Autowired
    private SettlementMapper settlementMapper;
    
    /**
     * 获取机构统计数据
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 统计数据
     */
    public Statistics getOrgStatistics(Long orgId, String startDate, String endDate) {
        log.info("获取机构统计数据，orgId={}, startDate={}, endDate={}", orgId, startDate, endDate);
        
        Statistics stats = new Statistics();
        stats.setOrgId(orgId);
        
        // 统计总订单数
        stats.setTotalOrders(orderMapper.countOrgOrders(orgId, startDate, endDate));
        
        // 统计总金额
        stats.setTotalAmount(orderMapper.sumOrgAmount(orgId, startDate, endDate));
        
        // 统计志愿者总数
        stats.setTotalVolunteers(volunteerMapper.countByOrgId(orgId));
        
        // 统计活跃志愿者数
        stats.setActiveVolunteers(volunteerMapper.countActiveByOrgId(orgId, startDate, endDate));
        
        // 计算合规执行率
        stats.setComplianceRate(calculateComplianceRate(orgId, startDate, endDate));
        
        // 设置统计日期
        stats.setStatisticsDate(new Date());
        
        log.info("获取机构统计数据成功，orgId={}, totalOrders={}", orgId, stats.getTotalOrders());
        return stats;
    }
    
    /**
     * 获取平台统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 平台统计数据
     */
    public PlatformStatistics getPlatformStatistics(String startDate, String endDate) {
        log.info("获取平台统计数据，startDate={}, endDate={}", startDate, endDate);
        
        PlatformStatistics stats = new PlatformStatistics();
        
        // 统计累计注册用户数
        stats.setTotalUsers(userMapper.countTotalUsers());
        
        // 统计今日日活
        stats.setDailyActiveUsers(userMapper.countDailyActiveUsers());
        
        // 统计累计委托订单数
        stats.setTotalOrders(orderMapper.countTotalOrders());
        
        // 统计累计平台营收
        stats.setTotalRevenue(settlementMapper.sumTotalRevenue());
        
        // 统计订单完成率
        stats.setOrderCompletionRate(calculateOrderCompletionRate(startDate, endDate));
        
        // 统计内容审核通过率
        stats.setContentAuditRate(calculateContentAuditRate(startDate, endDate));
        
        // 设置统计日期
        stats.setStatisticsDate(new Date());
        
        log.info("获取平台统计数据成功，totalUsers={}, totalOrders={}", 
                stats.getTotalUsers(), stats.getTotalOrders());
        return stats;
    }
    
    /**
     * 计算合规执行率
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 合规执行率（百分比）
     */
    private BigDecimal calculateComplianceRate(Long orgId, String startDate, String endDate) {
        int totalTasks = taskExecuteMapper.countByOrgId(orgId, startDate, endDate);
        int compliantTasks = taskExecuteMapper.countCompliantByOrgId(orgId, startDate, endDate);
        
        if (totalTasks == 0) {
            return BigDecimal.ZERO;
        }
        
        return new BigDecimal(compliantTasks)
                .divide(new BigDecimal(totalTasks), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }
    
    /**
     * 计算订单完成率
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单完成率（百分比）
     */
    private BigDecimal calculateOrderCompletionRate(String startDate, String endDate) {
        // TODO: 实现订单完成率计算逻辑
        // 这里暂时返回一个默认值
        return new BigDecimal("85.00");
    }
    
    /**
     * 计算内容审核通过率
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 内容审核通过率（百分比）
     */
    private BigDecimal calculateContentAuditRate(String startDate, String endDate) {
        // TODO: 实现内容审核通过率计算逻辑
        // 这里暂时返回一个默认值
        return new BigDecimal("95.00");
    }
}
