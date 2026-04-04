package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.PlatformStatistics;
import com.ruoyi.qingru.entity.Statistics;
import com.ruoyi.qingru.service.StatisticsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 数据统计控制器
 */
@Slf4j
@RestController
@RequestMapping("/statistics")
public class StatisticsController {
    
    @Autowired
    private StatisticsService statisticsService;
    
    /**
     * 获取机构统计数据
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 统计数据
     */
    @GetMapping("/org")
    public R<Statistics> getOrgStatistics(
            @RequestParam Long orgId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取机构统计数据，orgId={}, startDate={}, endDate={}", orgId, startDate, endDate);
        try {
            Statistics stats = statisticsService.getOrgStatistics(orgId, startDate, endDate);
            return R.ok(stats, "获取成功");
        } catch (Exception e) {
            log.error("获取机构统计数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取平台统计数据（管理员）
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 平台统计数据
     */
    @GetMapping("/platform")
    public R<PlatformStatistics> getPlatformStatistics(
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        log.info("获取平台统计数据，startDate={}, endDate={}", startDate, endDate);
        try {
            PlatformStatistics stats = statisticsService.getPlatformStatistics(startDate, endDate);
            return R.ok(stats, "获取成功");
        } catch (Exception e) {
            log.error("获取平台统计数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
