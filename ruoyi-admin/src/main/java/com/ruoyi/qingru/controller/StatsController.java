package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.PieData;
import com.ruoyi.qingru.entity.StatsDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.service.StatsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 数据统计控制器
 */
@Slf4j
@RestController
@RequestMapping("/stats")
public class StatsController {
    
    @Autowired
    private StatsService statsService;
    
    /**
     * 获取仪表盘统计数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 仪表盘统计数据
     */
    @GetMapping("/dashboard")
    public R<StatsDashboard> getDashboard(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取仪表盘统计数据，startDate={}, endDate={}", startDate, endDate);
        try {
            StatsDashboard dashboard = statsService.getDashboard(startDate, endDate);
            return R.ok(dashboard, "获取成功");
        } catch (Exception e) {
            log.error("获取仪表盘统计数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取订单趋势数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param groupBy 分组方式 (day/week/month)
     * @return 趋势数据列表
     */
    @GetMapping("/trend")
    public R<List<TrendData>> getTrend(
            @RequestParam String startDate,
            @RequestParam String endDate,
            @RequestParam(defaultValue = "day") String groupBy) {
        log.info("获取订单趋势数据，startDate={}, endDate={}, groupBy={}", startDate, endDate, groupBy);
        try {
            List<TrendData> trendData = statsService.getOrderTrend(startDate, endDate, groupBy);
            return R.ok(trendData, "获取成功");
        } catch (Exception e) {
            log.error("获取订单趋势数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取物种分布数据
     * @return 物种分布列表
     */
    @GetMapping("/species-distribution")
    public R<List<PieData>> getSpeciesDistribution() {
        log.info("获取物种分布数据");
        try {
            List<PieData> pieData = statsService.getSpeciesDistribution();
            return R.ok(pieData, "获取成功");
        } catch (Exception e) {
            log.error("获取物种分布数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
