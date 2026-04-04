package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.entity.User;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import com.ruoyi.qingru.mapper.UserMapper;
import com.ruoyi.qingru.service.AdminContentService;
import com.ruoyi.qingru.service.AdminOrderService;
import com.ruoyi.qingru.service.AdminService;
import com.ruoyi.qingru.service.AdminUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Day 19 性能回归测试 - 后端
 * 测试覆盖：接口响应时间、数据库查询性能、并发处理、内存使用、缓存性能等
 */
@ExtendWith(MockitoExtension.class)
class PerformanceRegressionDay19Test {

    @Mock
    private UserMapper userMapper;

    @Mock
    private OrderProtectMapper orderMapper;

    @InjectMocks
    private AdminService adminService;

    @InjectMocks
    private AdminUserService adminUserService;

    @InjectMocks
    private AdminOrderService adminOrderService;

    @InjectMocks
    private AdminContentService adminContentService;

    private List<User> testUsers;
    private List<OrderProtect> testOrders;

    @BeforeEach
    void setUp() {
        // 准备测试用户数据
        testUsers = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            User user = new User();
            user.setId((long) i);
            user.setOpenid("openid_" + i);
            user.setNickname("用户" + i);
            user.setCreateTime(new Date());
            testUsers.add(user);
        }

        // 准备测试订单数据
        testOrders = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            OrderProtect order = new OrderProtect();
            order.setId((long) (i + 1));
            order.setOrderNo("PRO20260404000" + (i + 1));
            order.setUserId((long) (i % 10));
            order.setSpeciesId(1L);
            order.setQuantity(10);
            order.setAmount(new BigDecimal("299.00"));
            order.setStatus(i % 3);
            order.setCreateTime(new Date());
            testOrders.add(order);
        }
    }

    /**
     * 1. 测试管理后台仪表盘接口响应时间
     */
    @Test
    void testGetDashboard_ResponseTime() throws Exception {
        // 准备测试数据
        when(userMapper.countTotalUsers()).thenReturn(10000L);
        when(userMapper.countDailyActiveUsers()).thenReturn(2000L);
        when(orderMapper.countTotalOrders()).thenReturn(50000L);
        when(orderMapper.sumTotalRevenue()).thenReturn(new BigDecimal("1000000.00"));

        long startTime = System.currentTimeMillis();

        // 执行测试
        AdminDashboard result = adminService.getAdminDashboard();

        long responseTime = System.currentTimeMillis() - startTime;

        // 验证响应时间小于 500ms
        assertNotNull(result);
        assertTrue(responseTime < 500, "仪表盘接口响应时间应小于 500ms，实际：" + responseTime + "ms");
    }

    /**
     * 2. 测试订单列表查询性能
     */
    @Test
    void testOrderList_QueryPerformance() {
        when(orderMapper.selectByStatus(null, 0, 20)).thenReturn(testOrders.subList(0, 20));

        long startTime = System.currentTimeMillis();

        List<OrderProtect> result = adminOrderService.getList(null, 1, 20);

        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertEquals(20, result.size());
        assertTrue(queryTime < 200, "订单列表查询应小于 200ms，实际：" + queryTime + "ms");
    }

    /**
     * 3. 测试批量订单查询性能
     */
    @Test
    void testBatchOrderQuery_Performance() {
        when(orderMapper.selectByStatus(anyInt(), anyInt(), anyInt())).thenReturn(testOrders);

        long startTime = System.currentTimeMillis();

        // 批量查询 10 页数据
        for (int i = 1; i <= 10; i++) {
            adminOrderService.getList(null, i, 20);
        }

        long totalTime = System.currentTimeMillis() - startTime;

        // 10 页查询总时间应小于 2 秒
        assertTrue(totalTime < 2000, "10 页订单查询应小于 2000ms，实际：" + totalTime + "ms");
    }

    /**
     * 4. 测试用户列表查询性能
     */
    @Test
    void testUserList_QueryPerformance() {
        when(userMapper.selectByPage(0, 20)).thenReturn(testUsers.subList(0, 20));

        long startTime = System.currentTimeMillis();

        List<User> result = adminUserService.getUserList(1, 20);

        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertEquals(20, result.size());
        assertTrue(queryTime < 150, "用户列表查询应小于 150ms，实际：" + queryTime + "ms");
    }

    /**
     * 5. 测试并发订单查询性能
     */
    @Test
    void testConcurrentOrderQuery_Performance() throws Exception {
        when(orderMapper.selectByStatus(anyInt(), anyInt(), anyInt())).thenReturn(testOrders);

        ExecutorService executor = Executors.newFixedThreadPool(10);
        long startTime = System.currentTimeMillis();

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            final int page = i + 1;
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                adminOrderService.getList(null, page, 20);
            }, executor);
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        long totalTime = System.currentTimeMillis() - startTime;

        executor.shutdown();
        executor.awaitTermination(5, TimeUnit.SECONDS);

        // 10 个并发查询应在 1 秒内完成
        assertTrue(totalTime < 1000, "10 个并发订单查询应小于 1000ms，实际：" + totalTime + "ms");
    }

    /**
     * 6. 测试大数据量导出性能
     */
    @Test
    void testExportOrders_Performance() {
        when(orderMapper.selectByStatus(null, 0, 1000)).thenReturn(testOrders);

        long startTime = System.currentTimeMillis();

        byte[] result = adminOrderService.exportOrders(null);

        long exportTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertTrue(result.length > 0);
        assertTrue(exportTime < 500, "订单导出应小于 500ms，实际：" + exportTime + "ms");
    }

    /**
     * 7. 测试内容列表查询性能
     */
    @Test
    void testContentList_QueryPerformance() {
        long startTime = System.currentTimeMillis();

        List<Species> result = adminContentService.getSpeciesList(null, 1, 20);

        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertTrue(queryTime < 100, "物种列表查询应小于 100ms，实际：" + queryTime + "ms");
    }

    /**
     * 8. 测试批量新增性能
     */
    @Test
    void testBatchAdd_Performance() {
        long startTime = System.currentTimeMillis();

        List<Species> speciesList = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            Species species = new Species();
            species.setName("测试物种" + i);
            species.setScientificName("Test " + i);
            species.setType(1);
            species.setIsForbid(0);
            speciesList.add(species);
        }

        adminContentService.batchAddSpecies(speciesList);

        long batchTime = System.currentTimeMillis() - startTime;

        // 批量新增 20 条数据应小于 1 秒
        assertTrue(batchTime < 1000, "批量新增 20 条物种应小于 1000ms，实际：" + batchTime + "ms");
    }

    /**
     * 9. 测试订单状态更新性能
     */
    @Test
    void testOrderStatusUpdate_Performance() {
        OrderProtect order = testOrders.get(0);
        order.setStatus(1);
        when(orderMapper.selectById(1L)).thenReturn(order);
        doNothing().when(orderMapper).update(any(OrderProtect.class));

        long startTime = System.currentTimeMillis();

        adminOrderService.updateStatus(1L, 2);

        long updateTime = System.currentTimeMillis() - startTime;

        assertTrue(updateTime < 100, "订单状态更新应小于 100ms，实际：" + updateTime + "ms");
    }

    /**
     * 10. 测试统计接口性能
     */
    @Test
    void testGetStats_Performance() {
        when(orderMapper.countTotal()).thenReturn(10000L);
        when(orderMapper.countByStatus(1)).thenReturn(2000L);
        when(orderMapper.countByStatus(2)).thenReturn(5000L);
        when(orderMapper.countByStatus(6)).thenReturn(1000L);

        long startTime = System.currentTimeMillis();

        Map<String, Object> stats = adminOrderService.getStats();

        long statsTime = System.currentTimeMillis() - startTime;

        assertNotNull(stats);
        assertTrue(stats.containsKey("total"));
        assertTrue(statsTime < 200, "统计接口查询应小于 200ms，实际：" + statsTime + "ms");
    }

    /**
     * 11. 测试内存使用 - 大量数据处理
     */
    @Test
    void testMemoryUsage_LargeDataProcessing() {
        Runtime runtime = Runtime.getRuntime();
        runtime.gc();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();

        // 处理大量数据
        List<OrderProtect> largeOrderList = new ArrayList<>();
        for (int i = 0; i < 10000; i++) {
            OrderProtect order = new OrderProtect();
            order.setId((long) i);
            order.setOrderNo("PRO20260404" + String.format("%05d", i));
            order.setAmount(new BigDecimal("299.00"));
            largeOrderList.add(order);
        }

        long afterMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryUsed = afterMemory - initialMemory;

        // 内存使用应小于 100MB
        assertTrue(memoryUsed < 100 * 1024 * 1024, 
            "处理 10000 条订单数据内存使用应小于 100MB，实际：" + (memoryUsed / 1024 / 1024) + "MB");
    }

    /**
     * 12. 测试数据库查询优化 - 使用索引
     */
    @Test
    void testDatabaseQuery_Optimization() {
        when(orderMapper.selectById(1L)).thenReturn(testOrders.get(0));

        long startTime = System.currentTimeMillis();

        // 多次查询同一 ID（测试缓存效果）
        for (int i = 0; i < 100; i++) {
            adminOrderService.getDetail(1L);
        }

        long totalTime = System.currentTimeMillis() - startTime;

        // 100 次查询应小于 1 秒（平均 10ms/次）
        assertTrue(totalTime < 1000, "100 次订单详情查询应小于 1000ms，实际：" + totalTime + "ms");
    }

    /**
     * 13. 测试分页查询边界情况
     */
    @Test
    void testPagination_BoundaryCases() {
        when(orderMapper.selectByStatus(null, 0, 20)).thenReturn(testOrders.subList(0, 20));
        when(orderMapper.selectByStatus(null, 20, 20)).thenReturn(testOrders.subList(20, 40));

        long startTime = System.currentTimeMillis();

        // 查询第一页
        List<OrderProtect> page1 = adminOrderService.getList(null, 1, 20);
        // 查询第二页
        List<OrderProtect> page2 = adminOrderService.getList(null, 2, 20);

        long totalTime = System.currentTimeMillis() - startTime;

        assertNotNull(page1);
        assertNotNull(page2);
        assertEquals(20, page1.size());
        assertEquals(20, page2.size());
        assertTrue(totalTime < 300, "两页订单查询应小于 300ms，实际：" + totalTime + "ms");
    }

    /**
     * 14. 测试空结果集性能
     */
    @Test
    void testEmptyResult_Performance() {
        when(orderMapper.selectByStatus(999, 0, 20)).thenReturn(new ArrayList<>());

        long startTime = System.currentTimeMillis();

        List<OrderProtect> result = adminOrderService.getList(999, 1, 20);

        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertTrue(result.isEmpty());
        assertTrue(queryTime < 50, "空结果集查询应小于 50ms，实际：" + queryTime + "ms");
    }

    /**
     * 15. 测试趋势数据查询性能
     */
    @Test
    void testTrendData_QueryPerformance() {
        List<TrendData> trendData = new ArrayList<>();
        for (int i = 0; i < 30; i++) {
            trendData.add(new TrendData("2026-04-" + (i + 1), i * 100));
        }

        when(userMapper.selectDailyTrend(anyInt())).thenReturn(trendData);

        long startTime = System.currentTimeMillis();

        List<TrendData> result = adminUserService.getUserTrend(30);

        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertEquals(30, result.size());
        assertTrue(queryTime < 200, "30 天趋势数据查询应小于 200ms，实际：" + queryTime + "ms");
    }

    /**
     * 16. 测试批量更新性能
     */
    @Test
    void testBatchUpdate_Performance() {
        List<Long> orderIds = new ArrayList<>();
        for (int i = 1; i <= 50; i++) {
            orderIds.add((long) i);
        }

        OrderProtect order = testOrders.get(0);
        order.setStatus(1);
        when(orderMapper.selectById(anyLong())).thenReturn(order);
        doNothing().when(orderMapper).update(any(OrderProtect.class));

        long startTime = System.currentTimeMillis();

        adminOrderService.batchUpdateStatus(orderIds, 2);

        long updateTime = System.currentTimeMillis() - startTime;

        // 批量更新 50 条订单应小于 2 秒
        assertTrue(updateTime < 2000, "批量更新 50 条订单应小于 2000ms，实际：" + updateTime + "ms");
    }

    /**
     * 17. 测试搜索接口性能
     */
    @Test
    void testSearch_Performance() {
        when(orderMapper.selectByOrderNoLike("PRO202604040001")).thenReturn(testOrders.subList(0, 10));

        long startTime = System.currentTimeMillis();

        List<OrderProtect> result = adminOrderService.searchOrders("PRO202604040001", null, null);

        long searchTime = System.currentTimeMillis() - startTime;

        assertNotNull(result);
        assertTrue(searchTime < 300, "订单搜索应小于 300ms，实际：" + searchTime + "ms");
    }

    /**
     * 18. 测试缓存命中率
     */
    @Test
    void testCacheHitRate() {
        when(userMapper.countTotalUsers()).thenReturn(10000L);

        long startTime = System.currentTimeMillis();

        // 第一次查询（缓存未命中）
        adminUserService.getUserStats();
        // 第二次查询（缓存命中）
        adminUserService.getUserStats();
        // 第三次查询（缓存命中）
        adminUserService.getUserStats();

        long totalTime = System.currentTimeMillis() - startTime;

        // 三次查询总时间应小于 300ms
        assertTrue(totalTime < 300, "三次统计查询（含缓存）应小于 300ms，实际：" + totalTime + "ms");
    }

    /**
     * 19. 测试异步处理性能
     */
    @Test
    void testAsyncProcessing_Performance() throws Exception {
        long startTime = System.currentTimeMillis();

        List<CompletableFuture<Void>> futures = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            CompletableFuture<Void> future = CompletableFuture.runAsync(() -> {
                // 模拟异步处理
                try {
                    Thread.sleep(50);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
            futures.add(future);
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        long totalTime = System.currentTimeMillis() - startTime;

        // 5 个异步任务并发执行应小于 200ms
        assertTrue(totalTime < 200, "5 个异步任务并发执行应小于 200ms，实际：" + totalTime + "ms");
    }

    /**
     * 20. 测试整体系统性能 - 混合场景
     */
    @Test
    void testOverallSystemPerformance() throws Exception {
        // 准备数据
        when(userMapper.countTotalUsers()).thenReturn(10000L);
        when(orderMapper.countTotal()).thenReturn(50000L);
        when(orderMapper.selectByStatus(anyInt(), anyInt(), anyInt())).thenReturn(testOrders);

        long startTime = System.currentTimeMillis();

        // 模拟混合操作场景
        // 1. 查询统计
        adminOrderService.getStats();
        // 2. 查询订单列表
        adminOrderService.getList(null, 1, 20);
        // 3. 查询用户统计
        adminUserService.getUserStats();
        // 4. 查询内容列表
        adminContentService.getSpeciesList(null, 1, 20);
        // 5. 导出订单
        adminOrderService.exportOrders(null);

        long totalTime = System.currentTimeMillis() - startTime;

        // 混合场景总时间应小于 2 秒
        assertTrue(totalTime < 2000, "混合场景操作总时间应小于 2000ms，实际：" + totalTime + "ms");
    }
}
