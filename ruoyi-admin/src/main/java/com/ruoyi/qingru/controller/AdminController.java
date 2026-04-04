package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.service.AdminService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 后台管理控制器
 */
@RestController
@RequestMapping("/admin")
public class AdminController {
    private static final Logger log = LoggerFactory.getLogger(AdminController.class);

    
    @Autowired
    private AdminService adminService;
    
    /**
     * 获取后台管理仪表盘数据
     * @return 仪表盘数据
     */
    @GetMapping("/dashboard")
    public R<AdminDashboard> getDashboard() {
        log.info("获取后台管理仪表盘数据");
        try {
            AdminDashboard dashboard = adminService.getAdminDashboard();
            return R.ok(dashboard, "获取成功");
        } catch (Exception e) {
            log.error("获取后台管理仪表盘数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取运营数据趋势
     * @param metric 指标名称
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 趋势数据列表
     */
    @GetMapping("/trend")
    public R<List<TrendData>> getTrend(
            @RequestParam String metric,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        log.info("获取运营数据趋势，metric={}, startDate={}, endDate={}", metric, startDate, endDate);
        try {
            List<TrendData> trend = adminService.getTrend(metric, startDate, endDate);
            return R.ok(trend, "获取成功");
        } catch (Exception e) {
            log.error("获取运营数据趋势失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
