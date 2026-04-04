package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Feedback;
import com.ruoyi.qingru.mapper.FeedbackMapper;
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
 * 用户反馈服务测试
 */
@ExtendWith(MockitoExtension.class)
class FeedbackServiceTest {
    
    @Mock
    private FeedbackMapper feedbackMapper;
    
    @InjectMocks
    private FeedbackService feedbackService;
    
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
        when(feedbackMapper.insert(any(Feedback.class))).thenReturn(1);
        
        Long result = feedbackService.submitFeedback(testFeedback);
        
        assertNotNull(result);
        assertEquals(1L, result);
        assertEquals(1, testFeedback.getStatus());
        verify(feedbackMapper, times(1)).insert(any(Feedback.class));
    }
    
    @Test
    void testSubmitFeedbackWithNullStatus() {
        testFeedback.setStatus(null);
        when(feedbackMapper.insert(any(Feedback.class))).thenReturn(1);
        
        Long result = feedbackService.submitFeedback(testFeedback);
        
        assertNotNull(result);
        assertEquals(1, testFeedback.getStatus()); // 应该被设置为 1
        verify(feedbackMapper, times(1)).insert(any(Feedback.class));
    }
    
    @Test
    void testGetFeedbackDetail() {
        when(feedbackMapper.selectById(1L)).thenReturn(testFeedback);
        
        Feedback result = feedbackService.getFeedbackDetail(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals("测试反馈标题", result.getTitle());
        verify(feedbackMapper, times(1)).selectById(1L);
    }
    
    @Test
    void testGetFeedbackDetailNotFound() {
        when(feedbackMapper.selectById(999L)).thenReturn(null);
        
        Feedback result = feedbackService.getFeedbackDetail(999L);
        
        assertNull(result);
        verify(feedbackMapper, times(1)).selectById(999L);
    }
    
    @Test
    void testGetFeedbackList() {
        List<Feedback> mockList = new ArrayList<>();
        mockList.add(testFeedback);
        when(feedbackMapper.selectByCondition(any(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        List<Feedback> result = feedbackService.getFeedbackList(null, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(feedbackMapper, times(1)).selectByCondition(null, null, 0, 10);
    }
    
    @Test
    void testGetFeedbackListWithFilter() {
        List<Feedback> mockList = new ArrayList<>();
        mockList.add(testFeedback);
        when(feedbackMapper.selectByCondition("功能建议", 1, 0, 10)).thenReturn(mockList);
        
        List<Feedback> result = feedbackService.getFeedbackList("功能建议", 1, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(feedbackMapper, times(1)).selectByCondition("功能建议", 1, 0, 10);
    }
    
    @Test
    void testGetFeedbackListDefaultPage() {
        List<Feedback> mockList = new ArrayList<>();
        when(feedbackMapper.selectByCondition(any(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        // 测试 null 分页参数
        List<Feedback> result = feedbackService.getFeedbackList(null, null, null, null);
        
        assertNotNull(result);
        verify(feedbackMapper, times(1)).selectByCondition(null, null, 0, 10);
    }
    
    @Test
    void testProcessFeedback() {
        when(feedbackMapper.selectById(1L)).thenReturn(testFeedback);
        when(feedbackMapper.update(any(Feedback.class))).thenReturn(1);
        
        feedbackService.processFeedback(1L, "这是回复内容");
        
        assertEquals(2, testFeedback.getStatus());
        assertEquals("这是回复内容", testFeedback.getReply());
        verify(feedbackMapper, times(1)).selectById(1L);
        verify(feedbackMapper, times(1)).update(any(Feedback.class));
    }
    
    @Test
    void testProcessFeedbackNotFound() {
        when(feedbackMapper.selectById(999L)).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            feedbackService.processFeedback(999L, "回复内容");
        });
        
        assertEquals("反馈不存在", exception.getMessage());
        verify(feedbackMapper, times(1)).selectById(999L);
        verify(feedbackMapper, never()).update(any(Feedback.class));
    }
    
    @Test
    void testDeleteFeedback() {
        when(feedbackMapper.selectById(1L)).thenReturn(testFeedback);
        when(feedbackMapper.deleteById(1L)).thenReturn(1);
        
        feedbackService.deleteFeedback(1L);
        
        verify(feedbackMapper, times(1)).selectById(1L);
        verify(feedbackMapper, times(1)).deleteById(1L);
    }
    
    @Test
    void testDeleteFeedbackNotFound() {
        when(feedbackMapper.selectById(999L)).thenReturn(null);
        
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            feedbackService.deleteFeedback(999L);
        });
        
        assertEquals("反馈不存在", exception.getMessage());
        verify(feedbackMapper, times(1)).selectById(999L);
        verify(feedbackMapper, never()).deleteById(anyLong());
    }
}
