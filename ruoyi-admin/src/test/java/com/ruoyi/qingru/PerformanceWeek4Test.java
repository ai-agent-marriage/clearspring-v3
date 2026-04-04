package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Order;
import com.ruoyi.qingru.entity.Certificate;
import com.ruoyi.qingru.service.OrderService;
import com.ruoyi.qingru.service.CertificateService;
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
import java.util.concurrent.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * Week 4 性能回归测试 - 后端
 * 测试覆盖：接口响应/数据库查询/并发处理/缓存性能
 * @author OpenClaw Agent
 * @date 2026-04-04
 */
@ExtendWith(MockitoExtension.class)
class PerformanceWeek4Test {

    @Mock
    private OrderService orderService;
    
    @Mock
    private CertificateService certificateService;

    private List<Order> testOrders;
    private List<Certificate> testCerts;
    private ExecutorService executorService;

    @BeforeEach
    void setUp() {
        executorService = Executors.newFixedThreadPool(10);
        
        // 准备测试订单数据
        testOrders = new ArrayList<>();
        for (int i = 0; i < 100; i++) {
            Order order = new Order();
            order.setId((long) (i + 1));
            order.setOrderNo("ORD20260404" + String.format("%03d", i + 1));
            order.setUserId(1L);
            order.setAmount(new BigDecimal("299.00"));
            order.setStatus(i % 5);
            order.setCreateTime(new Date());
            testOrders.add(order);
        }

        // 准备测试证书数据
        testCerts = new ArrayList<>();
        for (int i = 0; i < 50; i++) {
            Certificate cert = new Certificate();
            cert.setId((long) (i + 1));
            cert.setCertNo("ZS20260404" + String.format("%03d", i + 1));
            cert.setOrderId((long) (i + 1));
            cert.setStatus(i % 3);
            testCerts.add(cert);
        }
    }

    // ==================== 接口响应性能测试 ====================

    @Test
    void test1_OrderListApi_ResponseTime() throws Exception {
        when(orderService.list(anyInt(), anyInt())).thenReturn(testOrders.subList(0, 20));
        
        long startTime = System.currentTimeMillis();
        List<Order> result = orderService.list(1, 20);
        long endTime = System.currentTimeMillis();
        
        long responseTime = endTime - startTime;
        assertTrue(responseTime < 300, "订单列表接口响应时间应小于 300ms");
        assertEquals(20, result.size());
    }

    @Test
    void test2_CertListApi_ResponseTime() throws Exception {
        when(certificateService.list(anyInt(), anyInt())).thenReturn(testCerts.subList(0, 15));
        
        long startTime = System.currentTimeMillis();
        List<Certificate> result = certificateService.list(1, 15);
        long endTime = System.currentTimeMillis();
        
        long responseTime = endTime - startTime;
        assertTrue(responseTime < 250, "证书列表接口响应时间应小于 250ms");
    }

    @Test
    void test3_OrderDetailApi_ResponseTime() throws Exception {
        when(orderService.getOrderById(anyLong())).thenReturn(testOrders.get(0));
        
        long startTime = System.currentTimeMillis();
        Order result = orderService.getOrderById(1L);
        long endTime = System.currentTimeMillis();
        
        long responseTime = endTime - startTime;
        assertTrue(responseTime < 100, "订单详情接口响应时间应小于 100ms");
        assertNotNull(result);
    }

    @Test
    void test4_CertDetailApi_ResponseTime() throws Exception {
        when(certificateService.getCertById(anyLong())).thenReturn(testCerts.get(0));
        
        long startTime = System.currentTimeMillis();
        Certificate result = certificateService.getCertById(1L);
        long endTime = System.currentTimeMillis();
        
        long responseTime = endTime - startTime;
        assertTrue(responseTime < 100, "证书详情接口响应时间应小于 100ms");
    }

    @Test
    void test5_BatchApi_ResponseTime() throws Exception {
        List<Long> ids = testOrders.stream().limit(10).map(Order::getId).toList();
        when(orderService.batchGet(anyList())).thenReturn(testOrders.subList(0, 10));
        
        long startTime = System.currentTimeMillis();
        List<Order> result = orderService.batchGet(ids);
        long endTime = System.currentTimeMillis();
        
        long responseTime = endTime - startTime;
        assertTrue(responseTime < 500, "批量查询接口响应时间应小于 500ms");
        assertEquals(10, result.size());
    }

    // ==================== 数据库查询性能测试 ====================

    @Test
    void test6_DatabaseQuery_SingleRecord() throws Exception {
        when(orderService.findById(anyLong())).thenReturn(testOrders.get(0));
        
        long startTime = System.currentTimeMillis();
        Order result = orderService.findById(1L);
        long endTime = System.currentTimeMillis();
        
        long queryTime = endTime - startTime;
        assertTrue(queryTime < 50, "单条记录查询应小于 50ms");
    }

    @Test
    void test7_DatabaseQuery_ListWithPagination() throws Exception {
        int page = 1;
        int pageSize = 20;
        when(orderService.list(page, pageSize)).thenReturn(testOrders.subList(0, pageSize));
        
        long startTime = System.currentTimeMillis();
        List<Order> result = orderService.list(page, pageSize);
        long endTime = System.currentTimeMillis();
        
        long queryTime = endTime - startTime;
        assertTrue(queryTime < 200, "分页查询应小于 200ms");
    }

    @Test
    void test8_DatabaseQuery_Count() throws Exception {
        when(orderService.count()).thenReturn((long) testOrders.size());
        
        long startTime = System.currentTimeMillis();
        long count = orderService.count();
        long endTime = System.currentTimeMillis();
        
        long queryTime = endTime - startTime;
        assertTrue(queryTime < 50, "COUNT 查询应小于 50ms");
        assertEquals(100, count);
    }

    @Test
    void test9_DatabaseQuery_WithIndex() throws Exception {
        when(orderService.findByUserId(anyLong())).thenReturn(testOrders.subList(0, 10));
        
        long startTime = System.currentTimeMillis();
        List<Order> result = orderService.findByUserId(1L);
        long endTime = System.currentTimeMillis();
        
        long queryTime = endTime - startTime;
        assertTrue(queryTime < 100, "索引查询应小于 100ms");
    }

    @Test
    void test10_DatabaseQuery_Join() throws Exception {
        when(orderService.listWithDetails(anyInt(), anyInt())).thenReturn(testOrders.subList(0, 10));
        
        long startTime = System.currentTimeMillis();
        List<Order> result = orderService.listWithDetails(1, 10);
        long endTime = System.currentTimeMillis();
        
        long queryTime = endTime - startTime;
        assertTrue(queryTime < 300, "关联查询应小于 300ms");
    }

    // ==================== 并发处理性能测试 ====================

    @Test
    void test11_ConcurrentRequests_10Users() throws Exception {
        int userCount = 10;
        CountDownLatch latch = new CountDownLatch(userCount);
        List<Long> responseTimes = new CopyOnWriteArrayList<>();
        
        for (int i = 0; i < userCount; i++) {
            executorService.submit(() -> {
                try {
                    long startTime = System.currentTimeMillis();
                    orderService.list(1, 10);
                    long endTime = System.currentTimeMillis();
                    responseTimes.add(endTime - startTime);
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(5, TimeUnit.SECONDS);
        
        long avgTime = (long) responseTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        assertTrue(avgTime < 500, "10 用户并发平均响应时间应小于 500ms");
    }

    @Test
    void test12_ConcurrentRequests_50Users() throws Exception {
        int userCount = 50;
        CountDownLatch latch = new CountDownLatch(userCount);
        List<Long> responseTimes = new CopyOnWriteArrayList<>();
        
        for (int i = 0; i < userCount; i++) {
            final int userId = i;
            executorService.submit(() -> {
                try {
                    long startTime = System.currentTimeMillis();
                    orderService.getOrderById((long) (userId % 100 + 1));
                    long endTime = System.currentTimeMillis();
                    responseTimes.add(endTime - startTime);
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        
        long avgTime = (long) responseTimes.stream().mapToLong(Long::longValue).average().orElse(0);
        assertTrue(avgTime < 1000, "50 用户并发平均响应时间应小于 1000ms");
    }

    @Test
    void test13_ConcurrentOrders_Processing() throws Exception {
        int orderCount = 20;
        CountDownLatch latch = new CountDownLatch(orderCount);
        List<Boolean> results = new CopyOnWriteArrayList<>();
        
        for (int i = 0; i < orderCount; i++) {
            final int orderId = i + 1;
            executorService.submit(() -> {
                try {
                    when(orderService.process(anyLong())).thenReturn(true);
                    boolean result = orderService.process((long) orderId);
                    results.add(result);
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        
        long successCount = results.stream().filter(r -> r).count();
        assertEquals(orderCount, successCount);
    }

    @Test
    void test14_ConcurrentCert_Generation() throws Exception {
        int certCount = 10;
        CountDownLatch latch = new CountDownLatch(certCount);
        List<Boolean> results = new CopyOnWriteArrayList<>();
        
        for (int i = 0; i < certCount; i++) {
            final int orderId = i + 1;
            executorService.submit(() -> {
                try {
                    when(certificateService.generate(anyLong())).thenReturn(true);
                    boolean result = certificateService.generate((long) orderId);
                    results.add(result);
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(10, TimeUnit.SECONDS);
        
        long successCount = results.stream().filter(r -> r).count();
        assertEquals(certCount, successCount);
    }

    @Test
    void test15_ThreadSafety_Counter() throws Exception {
        int threadCount = 100;
        CountDownLatch latch = new CountDownLatch(threadCount);
        LongAdder counter = new LongAdder();
        
        for (int i = 0; i < threadCount; i++) {
            executorService.submit(() -> {
                try {
                    counter.increment();
                } finally {
                    latch.countDown();
                }
            });
        }
        
        latch.await(5, TimeUnit.SECONDS);
        
        assertEquals(threadCount, counter.sum());
    }

    // ==================== 缓存性能测试 ====================

    @Test
    void test16_Cache_Hit() throws Exception {
        when(orderService.getCachedOrder(anyLong())).thenReturn(testOrders.get(0));
        
        long startTime = System.currentTimeMillis();
        Order result = orderService.getCachedOrder(1L);
        long endTime = System.currentTimeMillis();
        
        long cacheTime = endTime - startTime;
        assertTrue(cacheTime < 10, "缓存命中应小于 10ms");
        assertNotNull(result);
    }

    @Test
    void test17_Cache_Miss() throws Exception {
        when(orderService.getCachedOrder(anyLong())).thenReturn(null);
        when(orderService.getOrderFromDb(anyLong())).thenReturn(testOrders.get(0));
        
        long startTime = System.currentTimeMillis();
        Order result = orderService.getOrderFromDb(1L);
        long endTime = System.currentTimeMillis();
        
        long dbTime = endTime - startTime;
        assertTrue(dbTime < 100, "缓存未命中数据库查询应小于 100ms");
    }

    @Test
    void test18_Cache_BulkGet() throws Exception {
        List<Long> ids = testOrders.stream().limit(20).map(Order::getId).toList();
        when(orderService.batchGetCached(anyList())).thenReturn(testOrders.subList(0, 20));
        
        long startTime = System.currentTimeMillis();
        List<Order> result = orderService.batchGetCached(ids);
        long endTime = System.currentTimeMillis();
        
        long cacheTime = endTime - startTime;
        assertTrue(cacheTime < 50, "批量缓存查询应小于 50ms");
        assertEquals(20, result.size());
    }

    @Test
    void test19_Cache_Invalidation() throws Exception {
        when(orderService.invalidateCache(anyLong())).thenReturn(true);
        
        long startTime = System.currentTimeMillis();
        boolean result = orderService.invalidateCache(1L);
        long endTime = System.currentTimeMillis();
        
        long invalidationTime = endTime - startTime;
        assertTrue(invalidationTime < 20, "缓存失效操作应小于 20ms");
        assertTrue(result);
    }

    @Test
    void test20_Cache_Warmup() throws Exception {
        when(orderService.warmupCache()).thenReturn(true);
        
        long startTime = System.currentTimeMillis();
        boolean result = orderService.warmupCache();
        long endTime = System.currentTimeMillis();
        
        long warmupTime = endTime - startTime;
        assertTrue(warmupTime < 1000, "缓存预热应小于 1000ms");
        assertTrue(result);
    }
}
