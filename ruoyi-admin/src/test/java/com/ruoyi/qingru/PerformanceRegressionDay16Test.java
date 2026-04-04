package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Feedback;
import com.ruoyi.qingru.service.FeedbackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.util.StopWatch;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Day 16 性能回归测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/PerformanceRegressionDay16Test.java
 * 
 * 测试范围:
 * - 反馈查询性能
 * - 反馈处理性能
 * - 数据库查询性能
 * 
 * 性能指标要求:
 * - 反馈列表查询：≤150ms
 * - 反馈详情查询：≤100ms
 * - 反馈统计查询：≤150ms
 * - 反馈提交：≤300ms
 * - 反馈处理：≤200ms
 * 
 * 用例数量：10 个
 */
@SpringBootTest
public class PerformanceRegressionDay16Test {

    @Autowired
    private FeedbackService feedbackService;

    /**
     * 测试 1: 反馈列表查询性能
     * 要求：≤150ms
     */
    @Test
    public void testFeedbackListQuery_Performance() {
        StopWatch stopWatch = new StopWatch("反馈列表查询");
        stopWatch.start();

        var feedbackList = feedbackService.getFeedbackList(null, null, 1, 20);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(feedbackList, "反馈列表不应为空");
        assertTrue(totalTime <= 150, "反馈列表查询时间应≤150ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 2: 反馈详情查询性能
     * 要求：≤100ms
     */
    @Test
    public void testFeedbackDetailQuery_Performance() {
        // 先创建一个反馈
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("suggestion");
        feedback.setTitle("性能测试反馈");
        feedback.setContent("测试内容");
        feedbackService.submitFeedback(feedback);
        Long feedbackId = feedback.getId();

        StopWatch stopWatch = new StopWatch("反馈详情查询");
        stopWatch.start();

        Feedback detail = feedbackService.getFeedbackDetail(feedbackId);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(detail, "反馈详情不应为空");
        assertTrue(totalTime <= 100, "反馈详情查询时间应≤100ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 3: 反馈统计查询性能
     * 要求：≤150ms
     */
    @Test
    public void testFeedbackStatsQuery_Performance() {
        StopWatch stopWatch = new StopWatch("反馈统计查询");
        stopWatch.start();

        var stats = feedbackService.getFeedbackStats();

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(stats, "统计数据不应为空");
        assertTrue(totalTime <= 150, "反馈统计查询时间应≤150ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 4: 反馈提交性能
     * 要求：≤300ms
     */
    @Test
    public void testFeedbackSubmit_Performance() {
        StopWatch stopWatch = new StopWatch("反馈提交");
        stopWatch.start();

        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("suggestion");
        feedback.setTitle("性能测试 - 提交");
        feedback.setContent("这是性能测试的反馈内容");
        feedback.setContact("test@example.com");

        Long feedbackId = feedbackService.submitFeedback(feedback);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(feedbackId, "反馈提交应成功");
        assertTrue(totalTime <= 300, "反馈提交时间应≤300ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 5: 反馈处理性能
     * 要求：≤200ms
     */
    @Test
    public void testFeedbackProcess_Performance() {
        // 先创建一个反馈
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("bug");
        feedback.setTitle("性能测试 - 处理");
        feedback.setContent("需要处理的问题");
        feedbackService.submitFeedback(feedback);
        Long feedbackId = feedback.getId();

        StopWatch stopWatch = new StopWatch("反馈处理");
        stopWatch.start();

        String reply = "已处理，感谢您的反馈";
        feedbackService.processFeedback(feedbackId, reply);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertTrue(totalTime <= 200, "反馈处理时间应≤200ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 6: 反馈列表分页查询性能
     * 要求：≤150ms
     */
    @Test
    public void testFeedbackListPagination_Performance() {
        StopWatch stopWatch = new StopWatch("反馈分页查询");
        stopWatch.start();

        var page1 = feedbackService.getFeedbackList(null, null, 1, 20);
        var page2 = feedbackService.getFeedbackList(null, null, 2, 20);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(page1, "第 1 页不应为空");
        assertNotNull(page2, "第 2 页不应为空");
        assertTrue(totalTime <= 150, "反馈分页查询时间应≤150ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 7: 反馈列表按类型筛选性能
     * 要求：≤150ms
     */
    @Test
    public void testFeedbackListFilterByType_Performance() {
        StopWatch stopWatch = new StopWatch("反馈类型筛选");
        stopWatch.start();

        var suggestionList = feedbackService.getFeedbackList("suggestion", null, 1, 20);
        var bugList = feedbackService.getFeedbackList("bug", null, 1, 20);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(suggestionList, "建议列表不应为空");
        assertNotNull(bugList, "Bug 列表不应为空");
        assertTrue(totalTime <= 150, "反馈类型筛选时间应≤150ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 8: 反馈列表按状态筛选性能
     * 要求：≤150ms
     */
    @Test
    public void testFeedbackListFilterByStatus_Performance() {
        StopWatch stopWatch = new StopWatch("反馈状态筛选");
        stopWatch.start();

        var pendingList = feedbackService.getFeedbackList(null, 1, 1, 20);
        var processedList = feedbackService.getFeedbackList(null, 2, 1, 20);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertNotNull(pendingList, "待处理列表不应为空");
        assertNotNull(processedList, "已处理列表不应为空");
        assertTrue(totalTime <= 150, "反馈状态筛选时间应≤150ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 9: 批量反馈查询性能
     * 要求：≤200ms
     */
    @Test
    public void testBatchFeedbackQuery_Performance() {
        StopWatch stopWatch = new StopWatch("批量反馈查询");
        stopWatch.start();

        // 查询多个 ID 的反馈
        for (int i = 1; i <= 10; i++) {
            try {
                feedbackService.getFeedbackDetail((long) i);
            } catch (Exception e) {
                // 忽略不存在的反馈
            }
        }

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertTrue(totalTime <= 200, "批量反馈查询时间应≤200ms，实际：" + totalTime + "ms");
    }

    /**
     * 测试 10: 反馈删除性能
     * 要求：≤200ms
     */
    @Test
    public void testFeedbackDelete_Performance() {
        // 先创建一个反馈
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("other");
        feedback.setTitle("性能测试 - 删除");
        feedback.setContent("测试内容");
        feedbackService.submitFeedback(feedback);
        Long feedbackId = feedback.getId();

        StopWatch stopWatch = new StopWatch("反馈删除");
        stopWatch.start();

        feedbackService.deleteFeedback(feedbackId);

        stopWatch.stop();
        long totalTime = stopWatch.getTotalTimeMillis();

        assertTrue(totalTime <= 200, "反馈删除时间应≤200ms，实际：" + totalTime + "ms");
    }
}
