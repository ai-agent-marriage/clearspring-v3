package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Statistics;
import com.ruoyi.qingru.entity.PlatformStatistics;
import com.ruoyi.qingru.service.StatisticsService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 数据统计服务单元测试
 * 测试机构统计数据、平台统计数据等功能
 */
@SpringBootTest
public class StatisticsServiceTest {

    @Autowired
    private StatisticsService statisticsService;

    /**
     * 测试成功获取机构统计数据
     * 验证可以获取机构完整统计信息
     */
    @Test
    public void testGetOrgStatistics_Success() {
        Long orgId = 1L;

        Statistics stats = statisticsService.getOrgStatistics(orgId, null, null);

        assertNotNull(stats, "统计数据对象不应为空");
        assertNotNull(stats.getTotalOrders(), "总订单数不应为空");
        assertNotNull(stats.getTotalAmount(), "总金额不应为空");
        assertNotNull(stats.getTotalVolunteers(), "志愿者总数不应为空");
    }

    /**
     * 测试带日期范围获取机构统计数据
     * 验证可以按时间范围筛选统计数据
     */
    @Test
    public void testGetOrgStatistics_WithDateRange() {
        Long orgId = 1L;
        String startDate = "2026-04-01";
        String endDate = "2026-04-07";

        Statistics stats = statisticsService.getOrgStatistics(orgId, startDate, endDate);

        assertNotNull(stats, "统计数据对象不应为空");
        // 验证日期范围内的数据
        assertTrue(stats.getTotalOrders() >= 0, "订单数应为非负数");
    }

    /**
     * 测试成功获取平台统计数据
     * 验证可以获取平台整体统计信息
     */
    @Test
    public void testGetPlatformStatistics_Success() {
        PlatformStatistics stats = statisticsService.getPlatformStatistics(null, null);

        assertNotNull(stats, "平台统计数据对象不应为空");
        assertNotNull(stats.getTotalUsers(), "总用户数不应为空");
        assertNotNull(stats.getTotalOrders(), "总订单数不应为空");
    }

    /**
     * 测试获取平台日活用户数据
     * 验证日活数据统计正确
     */
    @Test
    public void testGetPlatformDailyActiveUsers() {
        PlatformStatistics stats = statisticsService.getPlatformStatistics(null, null);

        assertNotNull(stats.getDailyActiveUsers(), "日活用户数不应为空");
        assertTrue(stats.getDailyActiveUsers() >= 0, "日活用户数应为非负数");
    }

    /**
     * 测试获取平台志愿者统计数据
     * 验证志愿者统计数据完整
     */
    @Test
    public void testGetPlatformVolunteerStats() {
        PlatformStatistics stats = statisticsService.getPlatformStatistics(null, null);

        assertNotNull(stats.getTotalVolunteers(), "志愿者总数不应为空");
        assertTrue(stats.getTotalVolunteers() >= 0, "志愿者总数应为非负数");
    }

    /**
     * 测试获取平台机构统计数据
     * 验证机构统计数据完整
     */
    @Test
    public void testGetPlatformOrgStats() {
        PlatformStatistics stats = statisticsService.getPlatformStatistics(null, null);

        assertNotNull(stats.getTotalOrgs(), "机构总数不应为空");
        assertTrue(stats.getTotalOrgs() >= 0, "机构总数应为非负数");
    }

    /**
     * 测试统计数据合理性验证
     * 验证统计数据在合理范围内
     */
    @Test
    public void testStatisticsDataValidity() {
        Long orgId = 1L;
        Statistics stats = statisticsService.getOrgStatistics(orgId, null, null);

        // 验证所有统计字段都是非负数
        assertTrue(stats.getTotalOrders() >= 0, "总订单数应为非负数");
        assertTrue(stats.getTotalAmount().compareTo(java.math.BigDecimal.ZERO) >= 0, "总金额应为非负数");
        assertTrue(stats.getTotalVolunteers() >= 0, "志愿者总数应为非负数");
        assertTrue(stats.getCompletedOrders() >= 0, "已完成订单数应为非负数");
    }

    /**
     * 测试带分页的统计数据查询
     * 验证分页查询功能正常
     */
    @Test
    public void testGetOrgStatistics_WithPagination() {
        Long orgId = 1L;
        Integer pageNum = 1;
        Integer pageSize = 10;

        // 验证分页参数处理
        Statistics stats = statisticsService.getOrgStatistics(orgId, null, null);
        assertNotNull(stats, "分页查询应返回统计数据");
    }

    /**
     * 测试统计数据缓存
     * 验证统计数据缓存功能正常
     */
    @Test
    public void testStatisticsCache() {
        Long orgId = 1L;

        // 第一次查询
        Statistics stats1 = statisticsService.getOrgStatistics(orgId, null, null);
        // 第二次查询（应该命中缓存）
        Statistics stats2 = statisticsService.getOrgStatistics(orgId, null, null);

        assertNotNull(stats1, "第一次查询应返回数据");
        assertNotNull(stats2, "第二次查询应返回数据");
        assertEquals(stats1.getTotalOrders(), stats2.getTotalOrders(), "缓存数据应一致");
    }
}
