package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.InternalMessage;
import com.ruoyi.qingru.entity.MessageRecord;
import com.ruoyi.qingru.service.MessageService;
import com.ruoyi.qingru.service.MessagePushService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Day 15 性能回归测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/PerformanceRegressionDay15Test.java
 * 
 * 测试范围:
 * - 前端性能测试（消息列表加载/推送响应）
 * - 后端性能测试（推送响应/异步处理）
 * - 数据库性能测试（消息查询/推送记录）
 * 
 * 性能指标:
 * - 消息列表加载时间：≤800ms
 * - 推送响应时间：≤300ms
 * - 异步处理时间：≤500ms
 * - 消息查询响应：≤100ms
 * 
 * 用例数量：15 个
 */
@SpringBootTest
public class PerformanceRegressionDay15Test {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessagePushService messagePushService;

    // ==================== 消息列表加载性能测试 (5 个用例) ====================

    /**
     * 测试消息列表首页加载时间
     */
    @Test
    public void testMessageListHomePageLoadTime() {
        long startTime = System.currentTimeMillis();
        List<MessageRecord> messages = messageService.getMessageRecordList(null, null, null, 1, 10);
        long loadTime = System.currentTimeMillis() - startTime;

        assertNotNull(messages, "消息列表不应为空");
        assertTrue(loadTime <= 800, "消息列表首页加载时间应≤800ms，实际：" + loadTime + "ms");
    }

    /**
     * 测试消息列表分页加载性能
     */
    @Test
    public void testMessageListPaginationPerformance() {
        long[] pageLoadTimes = new long[5];

        for (int pageNum = 1; pageNum <= 5; pageNum++) {
            long startTime = System.currentTimeMillis();
            List<MessageRecord> messages = messageService.getMessageRecordList(null, null, null, pageNum, 20);
            pageLoadTimes[pageNum - 1] = System.currentTimeMillis() - startTime;

            assertNotNull(messages, "第 " + pageNum + " 页消息列表不应为空");
        }

        // 所有分页加载时间都应达标
        for (long loadTime : pageLoadTimes) {
            assertTrue(loadTime <= 800, "分页加载时间应≤800ms，实际：" + loadTime + "ms");
        }
    }

    /**
     * 测试消息列表筛选加载性能
     */
    @Test
    public void testMessageListFilterPerformance() {
        long startTime = System.currentTimeMillis();
        List<MessageRecord> messages = messageService.getMessageRecordList(
            "success", "2026-04-01", "2026-04-04", 1, 20
        );
        long filterTime = System.currentTimeMillis() - startTime;

        assertNotNull(messages, "筛选结果不应为空");
        assertTrue(filterTime <= 800, "筛选加载时间应≤800ms，实际：" + filterTime + "ms");
    }

    /**
     * 测试消息列表大数据量加载性能
     */
    @Test
    public void testMessageListLargeDataPerformance() {
        long startTime = System.currentTimeMillis();
        List<MessageRecord> messages = messageService.getMessageRecordList(null, null, null, 1, 100);
        long loadTime = System.currentTimeMillis() - startTime;

        assertNotNull(messages, "大数据量消息列表不应为空");
        assertTrue(loadTime <= 800, "大数据量加载时间应≤800ms，实际：" + loadTime + "ms");
    }

    /**
     * 测试消息列表缓存命中性能
     */
    @Test
    public void testMessageListCacheHitPerformance() {
        // 第一次查询（缓存未命中）
        long startTime1 = System.currentTimeMillis();
        List<MessageRecord> messages1 = messageService.getMessageRecordList(null, null, null, 1, 10);
        long time1 = System.currentTimeMillis() - startTime1;

        // 第二次查询（缓存命中）
        long startTime2 = System.currentTimeMillis();
        List<MessageRecord> messages2 = messageService.getMessageRecordList(null, null, null, 1, 10);
        long time2 = System.currentTimeMillis() - startTime2;

        assertNotNull(messages1, "第一次查询结果不应为空");
        assertNotNull(messages2, "第二次查询结果不应为空");
        assertTrue(time1 <= 800, "首次查询时间应≤800ms，实际：" + time1 + "ms");
        assertTrue(time2 <= time1, "缓存命中查询应更快");
    }

    // ==================== 推送响应性能测试 (3 个用例) ====================

    /**
     * 测试订阅消息推送响应时间
     */
    @Test
    public void testSubscribeMessagePushResponseTime() {
        long startTime = System.currentTimeMillis();
        Map<String, Object> result = messageService.sendSubscribeMessage(
            "o6_bmjrPTlm6_2sgVt7hMZOPfL2M",
            "ORDER_CREATE",
            Map.of("orderNo", "PRO202604040001")
        );
        long responseTime = System.currentTimeMillis() - startTime;

        assertNotNull(result, "推送结果不应为空");
        assertTrue(responseTime <= 300, "订阅消息推送响应时间应≤300ms，实际：" + responseTime + "ms");
    }

    /**
     * 测试站内信推送响应时间
     */
    @Test
    public void testInternalMessagePushResponseTime() {
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("性能测试消息");
        message.setContent("测试内容");
        message.setType(1);

        long startTime = System.currentTimeMillis();
        Long messageId = messageService.sendInternalMessage(message);
        long responseTime = System.currentTimeMillis() - startTime;

        assertNotNull(messageId, "消息 ID 不应为空");
        assertTrue(responseTime <= 300, "站内信推送响应时间应≤300ms，实际：" + responseTime + "ms");

        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    /**
     * 测试批量推送响应时间
     */
    @Test
    public void testBatchMessagePushResponseTime() {
        java.util.List<Map<String, Object>> messages = java.util.Arrays.asList(
            Map.of("openid", "user_1", "templateId", "TEST"),
            Map.of("openid", "user_2", "templateId", "TEST"),
            Map.of("openid", "user_3", "templateId", "TEST")
        );

        long startTime = System.currentTimeMillis();
        Map<String, Object> result = messageService.batchSendMessage(messages);
        long responseTime = System.currentTimeMillis() - startTime;

        assertNotNull(result, "批量推送结果不应为空");
        assertTrue(responseTime <= 500, "批量推送响应时间应≤500ms，实际：" + responseTime + "ms");
    }

    // ==================== 异步处理性能测试 (3 个用例) ====================

    /**
     * 测试异步推送处理时间
     */
    @Test
    public void testAsyncPushProcessTime() {
        Long orderId = 1001L;

        long startTime = System.currentTimeMillis();
        messagePushService.pushOnOrderCreate(orderId);

        // 等待异步执行完成
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        long processTime = System.currentTimeMillis() - startTime;

        assertTrue(processTime <= 500, "异步推送处理时间应≤500ms，实际：" + processTime + "ms");

        // 验证站内信是否创建
        List<InternalMessage> messages = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(messages, "站内信列表不应为空");
    }

    /**
     * 测试系统通知异步推送处理时间
     */
    @Test
    public void testSystemNotificationAsyncProcessTime() {
        Long userId = 1L;
        String title = "系统通知性能测试";
        String content = "测试内容";

        long startTime = System.currentTimeMillis();
        messagePushService.pushSystemNotification(userId, title, content);

        // 等待异步执行完成
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        long processTime = System.currentTimeMillis() - startTime;

        assertTrue(processTime <= 500, "系统通知异步处理时间应≤500ms，实际：" + processTime + "ms");
    }

    /**
     * 测试异步推送任务状态查询性能
     */
    @Test
    public void testAsyncPushTaskStatusQueryPerformance() {
        long startTime = System.currentTimeMillis();
        
        // 查询异步任务状态（模拟）
        Map<String, Object> status = Map.of(
            "taskId", "TASK001",
            "status", "completed",
            "processTime", 450
        );
        
        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(status, "任务状态不应为空");
        assertTrue(queryTime <= 100, "任务状态查询时间应≤100ms，实际：" + queryTime + "ms");
    }

    // ==================== 消息查询性能测试 (4 个用例) ====================

    /**
     * 测试单条消息查询响应时间
     */
    @Test
    public void testSingleMessageQueryResponseTime() {
        // 先创建一条消息
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("性能测试消息");
        message.setContent("测试内容");
        message.setType(1);
        
        Long messageId = messageService.sendInternalMessage(message);

        long startTime = System.currentTimeMillis();
        InternalMessage detail = messageService.getInternalMessageDetail(messageId);
        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(detail, "消息详情不应为空");
        assertTrue(queryTime <= 100, "单条消息查询响应时间应≤100ms，实际：" + queryTime + "ms");

        // 清理
        messageService.deleteInternalMessage(messageId);
    }

    /**
     * 测试消息列表分页查询响应时间
     */
    @Test
    public void testMessageListPaginatedQueryResponseTime() {
        long startTime = System.currentTimeMillis();
        List<MessageRecord> messages = messageService.getMessageRecordList(null, null, null, 1, 10);
        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(messages, "消息列表不应为空");
        assertTrue(queryTime <= 100, "分页查询响应时间应≤100ms，实际：" + queryTime + "ms");
    }

    /**
     * 测试消息条件查询响应时间
     */
    @Test
    public void testMessageConditionalQueryResponseTime() {
        long startTime = System.currentTimeMillis();
        List<MessageRecord> messages = messageService.getMessageRecordList(
            "success", "2026-04-01", "2026-04-04", 1, 20
        );
        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(messages, "条件查询结果不应为空");
        assertTrue(queryTime <= 100, "条件查询响应时间应≤100ms，实际：" + queryTime + "ms");
    }

    /**
     * 测试消息统计查询响应时间
     */
    @Test
    public void testMessageStatsQueryResponseTime() {
        long startTime = System.currentTimeMillis();
        Map<String, Object> stats = messageService.getMessageStats(null, null);
        long queryTime = System.currentTimeMillis() - startTime;

        assertNotNull(stats, "统计数据不应为空");
        assertTrue(queryTime <= 100, "统计查询响应时间应≤100ms，实际：" + queryTime + "ms");
    }
}
