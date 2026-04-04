package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Notice;
import com.ruoyi.qingru.service.NoticeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 公告控制器测试
 */
@ExtendWith(MockitoExtension.class)
class NoticeControllerTest {
    
    @Mock
    private NoticeService noticeService;
    
    @InjectMocks
    private NoticeController noticeController;
    
    private Notice testNotice;
    
    @BeforeEach
    void setUp() {
        testNotice = new Notice();
        testNotice.setId(1L);
        testNotice.setTitle("测试公告");
        testNotice.setContent("测试内容");
        testNotice.setStatus(1);
        testNotice.setPublishTime(new Date());
        testNotice.setCreateTime(new Date());
    }
    
    @Test
    void testGetList_NoFilter() {
        List<Notice> mockList = new ArrayList<>();
        mockList.add(testNotice);
        when(noticeService.getNoticeList(null, null, null, null)).thenReturn(mockList);
        
        R<List<Notice>> result = noticeController.getList(null, null, null, null);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetList_WithFilter() {
        List<Notice> mockList = new ArrayList<>();
        mockList.add(testNotice);
        when(noticeService.getNoticeList(1, "测试", 1, 10)).thenReturn(mockList);
        
        R<List<Notice>> result = noticeController.getList(1, "测试", 1, 10);
        
        assertEquals(200, result.getCode());
        verify(noticeService, times(1)).getNoticeList(1, "测试", 1, 10);
    }
    
    @Test
    void testGetDetail() {
        when(noticeService.getNoticeDetail(1L)).thenReturn(testNotice);
        
        R<Notice> result = noticeController.getDetail(1L);
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(1L, result.getData().getId());
    }
    
    @Test
    void testGetDetail_NotFound() {
        when(noticeService.getNoticeDetail(999L)).thenReturn(null);
        
        R<Notice> result = noticeController.getDetail(999L);
        
        assertNotEquals(200, result.getCode());
    }
    
    @Test
    void testAdd() {
        when(noticeService.addNotice(any(Notice.class))).thenReturn(100L);
        
        R<Long> result = noticeController.add(testNotice);
        
        assertEquals(200, result.getCode());
        assertEquals(100L, result.getData());
    }
    
    @Test
    void testUpdate() {
        when(noticeService.updateNotice(eq(1L), any(Notice.class))).thenReturn(true);
        
        R<Void> result = noticeController.update(1L, testNotice);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testDelete() {
        when(noticeService.deleteNotice(1L)).thenReturn(true);
        
        R<Void> result = noticeController.delete(1L);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testPublish() {
        when(noticeService.publishNotice(1L)).thenReturn(true);
        
        R<Void> result = noticeController.publish(1L);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testUnpublish() {
        when(noticeService.unpublishNotice(1L)).thenReturn(true);
        
        R<Void> result = noticeController.unpublish(1L);
        
        assertEquals(200, result.getCode());
    }
}
