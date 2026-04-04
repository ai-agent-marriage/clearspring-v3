package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Feedback;
import com.ruoyi.qingru.service.FeedbackService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 用户反馈服务测试类
 * 测试 FeedbackService 的核心功能
 */
@SpringBootTest
public class FeedbackServiceTest {

    @Autowired
    private FeedbackService feedbackService;

    /**
     * 测试提交反馈成功
     */
    @Test
    public void testSubmitFeedback_Success() {
        // 准备测试数据
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("suggestion");
        feedback.setTitle("测试反馈");
        feedback.setContent("这是测试反馈的内容");
        feedback.setContact("test@example.com");

        // 执行提交
        Long feedbackId = feedbackService.submitFeedback(feedback);

        // 验证结果
        assertNotNull(feedbackId, "反馈 ID 不应为空");
        assertTrue(feedbackId > 0, "反馈 ID 应大于 0");
        assertNotNull(feedback.getId(), "反馈对象的 ID 应被设置");
        assertEquals(1, feedback.getStatus().intValue(), "默认状态应为待处理 (1)");
    }

    /**
     * 测试提交反馈 - 不同类型
     */
    @Test
    public void testSubmitFeedback_DifferentTypes() {
        String[] types = {"suggestion", "bug", "complaint", "other"};

        for (String type : types) {
            Feedback feedback = new Feedback();
            feedback.setUserId(1L);
            feedback.setType(type);
            feedback.setTitle("测试反馈-" + type);
            feedback.setContent("测试内容");

            Long feedbackId = feedbackService.submitFeedback(feedback);
            assertNotNull(feedbackId, "类型 " + type + " 的反馈提交应成功");
        }
    }

    /**
     * 测试获取反馈详情
     */
    @Test
    public void testGetFeedbackDetail_Success() {
        // 先创建一个反馈
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("suggestion");
        feedback.setTitle("测试反馈详情");
        feedback.setContent("测试内容");
        
        feedbackService.submitFeedback(feedback);
        Long feedbackId = feedback.getId();

        // 获取详情
        Feedback detail = feedbackService.getFeedbackDetail(feedbackId);

        // 验证
        assertNotNull(detail, "反馈详情不应为空");
        assertEquals(feedbackId, detail.getId(), "反馈 ID 应匹配");
        assertEquals("测试反馈详情", detail.getTitle(), "标题应匹配");
        assertEquals("suggestion", detail.getType(), "类型应匹配");
    }

    /**
     * 测试处理反馈成功
     */
    @Test
    public void testProcessFeedback_Success() {
        // 先创建一个反馈
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("bug");
        feedback.setTitle("需要处理的反馈");
        feedback.setContent("发现了一个问题");
        
        feedbackService.submitFeedback(feedback);
        Long feedbackId = feedback.getId();

        // 处理反馈
        String reply = "已处理，感谢您的反馈";
        feedbackService.processFeedback(feedbackId, reply);

        // 验证处理结果
        Feedback processedFeedback = feedbackService.getFeedbackDetail(feedbackId);
        assertNotNull(processedFeedback, "处理后的反馈不应为空");
        assertEquals(2, processedFeedback.getStatus().intValue(), "状态应变为已处理 (2)");
        assertEquals(reply, processedFeedback.getReply(), "回复内容应匹配");
    }

    /**
     * 测试获取反馈列表
     */
    @Test
    public void testGetFeedbackList_Success() {
        // 创建多个反馈
        for (int i = 0; i < 5; i++) {
            Feedback feedback = new Feedback();
            feedback.setUserId(1L);
            feedback.setType("suggestion");
            feedback.setTitle("测试反馈-" + i);
            feedback.setContent("内容-" + i);
            feedbackService.submitFeedback(feedback);
        }

        // 获取列表
        var feedbackList = feedbackService.getFeedbackList(null, null, 1, 10);

        // 验证
        assertNotNull(feedbackList, "反馈列表不应为空");
        assertTrue(feedbackList.size() >= 5, "反馈列表应至少包含 5 条记录");
    }

    /**
     * 测试获取反馈列表 - 按类型筛选
     */
    @Test
    public void testGetFeedbackList_ByType() {
        // 创建不同类型的反馈
        Feedback feedback1 = new Feedback();
        feedback1.setUserId(1L);
        feedback1.setType("bug");
        feedback1.setTitle("Bug 反馈");
        feedback1.setContent("Bug 内容");
        feedbackService.submitFeedback(feedback1);

        Feedback feedback2 = new Feedback();
        feedback2.setUserId(1L);
        feedback2.setType("suggestion");
        feedback2.setTitle("建议反馈");
        feedback2.setContent("建议内容");
        feedbackService.submitFeedback(feedback2);

        // 按类型筛选
        var bugList = feedbackService.getFeedbackList("bug", null, 1, 10);
        var suggestionList = feedbackService.getFeedbackList("suggestion", null, 1, 10);

        // 验证
        assertNotNull(bugList, "Bug 类型列表不应为空");
        assertNotNull(suggestionList, "建议类型列表不应为空");
    }

    /**
     * 测试获取反馈列表 - 按状态筛选
     */
    @Test
    public void testGetFeedbackList_ByStatus() {
        // 按状态筛选（待处理）
        var pendingList = feedbackService.getFeedbackList(null, 1, 1, 10);

        // 验证
        assertNotNull(pendingList, "待处理列表不应为空");
    }

    /**
     * 测试处理反馈 - 反馈不存在
     */
    @Test
    public void testProcessFeedback_NotFound() {
        // 使用不存在的 ID
        Long nonExistentId = 999999L;
        String reply = "测试回复";

        // 应该抛出异常
        assertThrows(RuntimeException.class, () -> {
            feedbackService.processFeedback(nonExistentId, reply);
        }, "处理不存在的反馈应抛出异常");
    }

    /**
     * 测试删除反馈
     */
    @Test
    public void testDeleteFeedback_Success() {
        // 先创建一个反馈
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("other");
        feedback.setTitle("待删除的反馈");
        feedback.setContent("测试内容");
        
        feedbackService.submitFeedback(feedback);
        Long feedbackId = feedback.getId();

        // 删除反馈
        feedbackService.deleteFeedback(feedbackId);

        // 验证删除成功
        Feedback deletedFeedback = feedbackService.getFeedbackDetail(feedbackId);
        assertNull(deletedFeedback, "删除后的反馈应为空");
    }

    /**
     * 测试删除反馈 - 反馈不存在
     */
    @Test
    public void testDeleteFeedback_NotFound() {
        Long nonExistentId = 999999L;

        // 应该抛出异常
        assertThrows(RuntimeException.class, () -> {
            feedbackService.deleteFeedback(nonExistentId);
        }, "删除不存在的反馈应抛出异常");
    }

    /**
     * 测试提交反馈 - 带图片
     */
    @Test
    public void testSubmitFeedback_WithImages() {
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("bug");
        feedback.setTitle("带图片的反馈");
        feedback.setContent("问题描述");
        feedback.setImages("/tmp/img1.jpg,/tmp/img2.jpg");

        Long feedbackId = feedbackService.submitFeedback(feedback);

        assertNotNull(feedbackId, "带图片的反馈提交应成功");
        assertNotNull(feedback.getImages(), "图片字段应被保存");
    }

    /**
     * 测试提交反馈 - 带联系方式
     */
    @Test
    public void testSubmitFeedback_WithContact() {
        Feedback feedback = new Feedback();
        feedback.setUserId(1L);
        feedback.setType("suggestion");
        feedback.setTitle("带联系方式的反馈");
        feedback.setContent("建议内容");
        feedback.setContact("user@example.com");

        Long feedbackId = feedbackService.submitFeedback(feedback);

        assertNotNull(feedbackId, "带联系方式的反馈提交应成功");
        assertEquals("user@example.com", feedback.getContact(), "联系方式应被保存");
    }
}
