package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.AdminDashboard;
import com.ruoyi.qingru.entity.TrendData;
import com.ruoyi.qingru.entity.User;
import com.ruoyi.qingru.mapper.UserMapper;
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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Day 18 性能回归测试 - 后端
 * 测试覆盖：接口响应时间、数据库查询性能、并发处理、内存使用等
 */
@ExtendWith(MockitoExtension.class)
class PerformanceRegressionDay18Test {

    @Mock
    private UserMapper userMapper;

    @Mock
    private com.ruoyi.qingru.mapper.OrderProtectMapper orderMapper;

    @Mock
    private com.ruoyi.qingru.mapper.SettlementMapper settlementMapper;

    @InjectMocks
    private AdminService adminService;

    @InjectMocks
    private AdminUserService adminUserService;

    private List<User> testUsers;

    @BeforeEach
    void setUp() {
        testUsers = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            User user = new User();
            user.setId((long) i);
            user.setOpenid("openid_" + i);
            user.setNickname("用户" + i);
            user.setCreateTime(new Date());
            testUsers.add(user);
        }
    }

    @Test
    void testGetDashboard_ResponseTime() throws Exception {
        // 准备测试数据
        when(userMapper.countTotalUsers()).thenReturn(10000);
        when(userMapper.countDailyActiveUsers()).thenReturn(2000);
        when(orderMapper.countTotalOrders()).thenReturn(50000);
        when(settlementMapper.sumTotalRevenue()).thenReturn(new BigDecimal("1000000.00"));

        long startTime = System.currentTimeMillis();

        // 执行测试
        AdminDashboard result = adminService.getAdminDashboard();

        long responseTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        // 响应时间应小于 100ms
        assertTrue(responseTime < 100, "仪表盘接口响应时间应小于 100ms，实际：" + responseTime + "ms");
    }

    @Test
    void testGetTrend_ResponseTime() {
        // 执行测试
        long startTime = System.currentTimeMillis();

        List<TrendData> result = adminService.getTrend("users", "2026-04-01", "2026-04-07");

        long responseTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        assertEquals(7, result.size());
        // 响应时间应小于 50ms
        assertTrue(responseTime < 50, "趋势数据接口响应时间应小于 50ms，实际：" + responseTime + "ms");
    }

    @Test
    void testGetUserList_Performance() {
        // 准备测试数据 - 大数据量
        when(userMapper.selectByCondition(null, null, 0, 100))
            .thenReturn(testUsers);

        long startTime = System.currentTimeMillis();

        // 执行测试
        List<User> result = adminUserService.getList(null, null, 1, 100);

        long responseTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        assertEquals(100, result.size());
        // 100 条数据查询应小于 200ms
        assertTrue(responseTime < 200, "用户列表查询响应时间应小于 200ms，实际：" + responseTime + "ms");
    }

    @Test
    void testGetUserList_LargeDataset() {
        // 准备大数据量测试数据
        List<User> largeUsers = new ArrayList<>();
        for (int i = 0; i < 1000; i++) {
            User user = new User();
            user.setId((long) i);
            user.setNickname("用户" + i);
            largeUsers.add(user);
        }

        when(userMapper.selectByCondition(null, null, 0, 1000))
            .thenReturn(largeUsers);

        long startTime = System.currentTimeMillis();

        // 执行测试
        List<User> result = adminUserService.getList(null, null, 1, 1000);

        long responseTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        assertEquals(1000, result.size());
        // 1000 条数据查询应小于 500ms
        assertTrue(responseTime < 500, "1000 条数据查询应小于 500ms，实际：" + responseTime + "ms");
    }

    @Test
    void testConcurrentDashboardRequests() throws Exception {
        // 准备测试数据
        when(userMapper.countTotalUsers()).thenReturn(10000);
        when(userMapper.countDailyActiveUsers()).thenReturn(2000);
        when(orderMapper.countTotalOrders()).thenReturn(50000);
        when(settlementMapper.sumTotalRevenue()).thenReturn(new BigDecimal("1000000.00"));

        int concurrentRequests = 10;
        ExecutorService executor = Executors.newFixedThreadPool(concurrentRequests);
        List<CompletableFuture<Long>> futures = new ArrayList<>();

        // 并发请求测试
        for (int i = 0; i < concurrentRequests; i++) {
            CompletableFuture<Long> future = CompletableFuture.supplyAsync(() -> {
                long startTime = System.currentTimeMillis();
                adminService.getAdminDashboard();
                return System.currentTimeMillis() - startTime;
            }, executor);
            futures.add(future);
        }

        // 等待所有请求完成
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        executor.shutdown();
        executor.awaitTermination(10, TimeUnit.SECONDS);

        // 验证所有请求响应时间
        for (CompletableFuture<Long> future : futures) {
            long responseTime = future.get();
            assertTrue(responseTime < 200, "并发请求响应时间应小于 200ms，实际：" + responseTime + "ms");
        }
    }

    @Test
    void testGetUserDetail_ResponseTime() {
        // 准备测试数据
        User testUser = testUsers.get(0);
        when(userMapper.selectById(1L)).thenReturn(testUser);

        long startTime = System.currentTimeMillis();

        // 执行测试
        User result = adminUserService.getDetail(1L);

        long responseTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        assertEquals(1L, result.getId());
        // 详情查询应小于 50ms
        assertTrue(responseTime < 50, "用户详情查询应小于 50ms，实际：" + responseTime + "ms");
    }

    @Test
    void testExportUsers_Performance() {
        // 准备测试数据
        when(userMapper.selectByCondition(null, null, 0, 10000))
            .thenReturn(testUsers);

        long startTime = System.currentTimeMillis();

        // 执行测试
        byte[] result = adminUserService.exportUsers(null, null);

        long exportTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        assertTrue(result.length > 0);
        // 100 条数据导出应小于 1000ms
        assertTrue(exportTime < 1000, "数据导出应小于 1000ms，实际：" + exportTime + "ms");
    }

    @Test
    void testRepeatedQueries_Stability() {
        // 准备测试数据
        when(userMapper.countTotalUsers()).thenReturn(10000);
        when(userMapper.countDailyActiveUsers()).thenReturn(2000);
        when(orderMapper.countTotalOrders()).thenReturn(50000);
        when(settlementMapper.sumTotalRevenue()).thenReturn(new BigDecimal("1000000.00"));

        List<Long> responseTimes = new ArrayList<>();

        // 重复查询 10 次
        for (int i = 0; i < 10; i++) {
            long startTime = System.currentTimeMillis();
            adminService.getAdminDashboard();
            responseTimes.add(System.currentTimeMillis() - startTime);
        }

        // 计算平均响应时间
        double avgTime = responseTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        
        // 平均响应时间应小于 100ms
        assertTrue(avgTime < 100, "平均响应时间应小于 100ms，实际：" + avgTime + "ms");

        // 验证响应时间稳定性（最大最小差值）
        long maxTime = responseTimes.stream().mapToLong(Long::longValue).max().orElse(0);
        long minTime = responseTimes.stream().mapToLong(Long::longValue).min().orElse(0);
        assertTrue((maxTime - minTime) < 100, "响应时间波动应小于 100ms");
    }

    @Test
    void testDatabaseQueryEfficiency() {
        // 准备测试数据 - 模拟分页查询
        when(userMapper.selectByCondition(null, null, 0, 50))
            .thenReturn(testUsers.subList(0, 50));

        long startTime = System.currentTimeMillis();

        // 模拟分页查询性能
        int totalPages = 10;
        for (int page = 1; page <= totalPages; page++) {
            int offset = (page - 1) * 50;
            adminUserService.getList(null, null, page, 50);
        }

        long totalTime = System.currentTimeMillis() - startTime;

        // 10 页查询总时间应小于 500ms
        assertTrue(totalTime < 500, "10 页查询总时间应小于 500ms，实际：" + totalTime + "ms");
        
        // 平均每页查询时间应小于 50ms
        assertTrue((totalTime / totalPages) < 50, "平均每页查询时间应小于 50ms");
    }

    @Test
    void testMemoryEfficiency_LargeDataProcessing() {
        // 准备大数据量
        List<User> largeDataset = new ArrayList<>();
        for (int i = 0; i < 5000; i++) {
            User user = new User();
            user.setId((long) i);
            user.setNickname("用户" + i);
            user.setOpenid("openid_" + i);
            largeDataset.add(user);
        }

        when(userMapper.selectByCondition(null, null, 0, 5000))
            .thenReturn(largeDataset);

        long startTime = System.currentTimeMillis();
        Runtime runtime = Runtime.getRuntime();
        long initialMemory = runtime.totalMemory() - runtime.freeMemory();

        // 处理大数据集
        List<User> result = adminUserService.getList(null, null, 1, 5000);

        long finalMemory = runtime.totalMemory() - runtime.freeMemory();
        long memoryUsed = finalMemory - initialMemory;
        long processingTime = System.currentTimeMillis() - startTime;

        // 验证结果
        assertNotNull(result);
        assertEquals(5000, result.size());
        
        // 处理时间应小于 2000ms
        assertTrue(processingTime < 2000, "5000 条数据处理时间应小于 2000ms，实际：" + processingTime + "ms");
        
        // 内存使用应小于 50MB
        assertTrue(memoryUsed < 50 * 1024 * 1024, "内存使用应小于 50MB，实际：" + (memoryUsed / 1024 / 1024) + "MB");
    }
}
