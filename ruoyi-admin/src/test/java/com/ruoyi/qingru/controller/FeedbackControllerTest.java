package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Feedback;
import com.ruoyi.qingru.service.FeedbackService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 用户反馈控制器测试
 */
@ExtendWith(MockitoExtension.class)
class FeedbackControllerTest {
    
    @Mock
    private FeedbackService feedbackService;
    
    @InjectMocks
    private FeedbackController feedbackController;
    
    private Feedback testFeedback;
    
    @BeforeEach
    void setUp() {
        testFeedback = new Feedback();
        testFeedback.setId(1L);
        testFeedback.setUserId(1L);
        testFeedback.setType("功能建议");
        testFeedback.setTitle("测试反馈标题");
        testFeedback.setContent("测试反馈内容");
        testFeedback.setStatus(1);
    }
    
    @Test
    void testSubmitFeedback() {
        when(feedbackService.submitFeedback(any(Feedback.class))).thenReturn(1L);
        
        R<Long> result = feedbackController.submitFeedback(testFeedback);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("反馈提交成功", result.getMsg());
        assertEquals(1L, result.getData());
        verify(feedbackService, times(1)).submitFeedback(any(Feedback.class));
    }
    
    @Test
    void testSubmitFeedbackFailure() {
        when(feedbackService.submitFeedback(any(Feedback.class)))
                .thenThrow(new RuntimeException("数据库错误"));
        
        R<Long> result = feedbackController.submitFeedback(testFeedback);
        
        assertNotNull(result);
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("反馈提交失败"));
        verify(feedbackService, times(1)).submitFeedback(any(Feedback.class));
    }
    
    @Test
    void testGetFeedbackDetail() {
        when(feedbackService.getFeedbackDetail(1L)).thenReturn(testFeedback);
        
        R<Feedback> result = feedbackController.getFeedbackDetail(1L);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(1L, result.getData().getId());
        verify(feedbackService, times(1)).getFeedbackDetail(1L);
    }
    
    @Test
    void testGetFeedbackDetailNotFound() {
        when(feedbackService.getFeedbackDetail(999L)).thenReturn(null);
        
        R<Feedback> result = feedbackController.getFeedbackDetail(999L);
        
        assertNotNull(result);
        assertNotEquals(200, result.getCode());
        assertEquals("反馈不存在", result.getMsg());
        verify(feedbackService, times(1)).getFeedbackDetail(999L);
    }
    
    @Test
    void testGetFeedbackList() {
        List<Feedback> mockList = new ArrayList<>();
        mockList.add(testFeedback);
        when(feedbackService.getFeedbackList(null, null, 1, 10)).thenReturn(mockList);
        
        R<List<Feedback>> result = feedbackController.getFeedbackList(null, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(1, result.getData().size());
        verify(feedbackService, times(1)).getFeedbackList(null, null, 1, 10);
    }
    
    @Test
    void testGetFeedbackListWithFilters() {
        List<Feedback> mockList = new ArrayList<>();
        mockList.add(testFeedback);
        when(feedbackService.getFeedbackList("功能建议", 1, 1, 10)).thenReturn(mockList);
        
        R<List<Feedback>> result = feedbackController.getFeedbackList("功能建议", 1, 1, 10);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
        verify(feedbackService, times(1)).getFeedbackList("功能建议", 1, 1, 10);
    }
    
    @Test
    void testGetFeedbackListEmpty() {
        List<Feedback> mockList = new ArrayList<>();
        when(feedbackService.getFeedbackList(null, null, 1, 10)).thenReturn(mockList);
        
        R<List<Feedback>> result = feedbackController.getFeedbackList(null, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertTrue(result.getData().isEmpty());
        verify(feedbackService, times(1)).getFeedbackList(null, null, 1, 10);
    }
    
    @Test
    void testProcessFeedback() {
        doNothing().when(feedbackService).processFeedback(1L, "回复内容");
        
        R<Void> result = feedbackController.processFeedback(1L, "回复内容");
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("反馈处理成功", result.getMsg());
        verify(feedbackService, times(1)).processFeedback(1L, "回复内容");
    }
    
    @Test
    void testProcessFeedbackFailure() {
        doThrow(new RuntimeException("反馈不存在"))
                .when(feedbackService).processFeedback(999L, "回复内容");
        
        R<Void> result = feedbackController.processFeedback(999L, "回复内容");
        
        assertNotNull(result);
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("反馈处理失败"));
        verify(feedbackService, times(1)).processFeedback(999L, "回复内容");
    }
    
    @Test
    void testDeleteFeedback() {
        doNothing().when(feedbackService).deleteFeedback(1L);
        
        R<Void> result = feedbackController.deleteFeedback(1L);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals("反馈删除成功", result.getMsg());
        verify(feedbackService, times(1)).deleteFeedback(1L);
    }
    
    @Test
    void testDeleteFeedbackFailure() {
        doThrow(new RuntimeException("反馈不存在"))
                .when(feedbackService).deleteFeedback(999L);
        
        R<Void> result = feedbackController.deleteFeedback(999L);
        
        assertNotNull(result);
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("反馈删除失败"));
        verify(feedbackService, times(1)).deleteFeedback(999L);
    }
}
