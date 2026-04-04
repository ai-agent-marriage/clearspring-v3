package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.StatsOverview;
import com.ruoyi.qingru.entity.TodoItem;
import com.ruoyi.qingru.service.AdminDashboardService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 管理后台仪表盘控制器
 */
@RestController
@RequestMapping("/api/admin")
@Slf4j
public class AdminDashboardController {

    @Autowired
    private AdminDashboardService adminDashboardService;

    /**
     * 获取仪表盘数据
     * @return 仪表盘数据
     */
    @GetMapping("/dashboard")
    public R<AdminDashboard> getDashboard() {
        log.info("获取管理后台仪表盘数据");
        try {
            AdminDashboard dashboard = adminDashboardService.getDashboard();
            return R.ok(dashboard, "获取成功");
        } catch (Exception e) {
            log.error("获取管理后台仪表盘数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 获取概览统计
     * @return 概览统计数据
     */
    @GetMapping("/stats/overview")
    public R<StatsOverview> getOverview() {
        log.info("获取概览统计数据");
        try {
            StatsOverview overview = adminDashboardService.getOverview();
            return R.ok(overview, "获取成功");
        } catch (Exception e) {
            log.error("获取概览统计数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }

    /**
     * 获取待办事项
     * @return 待办事项列表
     */
    @GetMapping("/todos")
    public R<List<TodoItem>> getTodos() {
        log.info("获取待办事项列表");
        try {
            List<TodoItem> todos = adminDashboardService.getTodos();
            return R.ok(todos, "获取成功");
        } catch (Exception e) {
            log.error("获取待办事项列表失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
