package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.PieData;
import com.ruoyi.qingru.entity.RankData;
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
@RequestMapping("/api/stats")
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
            @RequestParam(required = false, defaultValue = "") String startDate,
            @RequestParam(required = false, defaultValue = "") String endDate,
            @RequestParam(defaultValue = "day") String groupBy) {
        log.info("获取订单趋势数据，startDate={}, endDate={}, groupBy={}", startDate, endDate, groupBy);
        try {
            List<TrendData> trendData = statsService.getTrend(startDate, endDate, groupBy);
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
    
    /**
     * 获取志愿者排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @GetMapping("/rank/volunteer")
    public R<List<RankData>> getVolunteerRank(
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取志愿者排行榜，limit={}", limit);
        try {
            List<RankData> rankList = statsService.getVolunteerRank(limit);
            return R.ok(rankList, "获取成功");
        } catch (Exception e) {
            log.error("获取志愿者排行榜失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取机构排行榜
     * @param limit 限制数量
     * @return 排行榜数据列表
     */
    @GetMapping("/rank/org")
    public R<List<RankData>> getOrgRank(
            @RequestParam(defaultValue = "10") Integer limit) {
        log.info("获取机构排行榜，limit={}", limit);
        try {
            List<RankData> rankList = statsService.getOrgRank(limit);
            return R.ok(rankList, "获取成功");
        } catch (Exception e) {
            log.error("获取机构排行榜失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
