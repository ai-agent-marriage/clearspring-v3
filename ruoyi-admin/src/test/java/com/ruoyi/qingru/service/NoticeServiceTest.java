package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Notice;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 公告服务测试
 */
@SpringBootTest
class NoticeServiceTest {
    
    @Autowired
    private NoticeService noticeService;
    
    @Test
    void testGetNoticeList_NoFilter() {
        List<Notice> list = noticeService.getNoticeList(null, null, null, null);
        assertNotNull(list);
        assertTrue(list.size() > 0);
    }
    
    @Test
    void testGetNoticeList_ByStatus() {
        List<Notice> list = noticeService.getNoticeList(1, null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(n -> n.getStatus() == 1));
    }
    
    @Test
    void testGetNoticeList_ByKeyword() {
        List<Notice> list = noticeService.getNoticeList(null, "系统", null, null);
        assertNotNull(list);
        assertTrue(list.stream().anyMatch(n -> n.getTitle().contains("系统") || n.getContent().contains("系统")));
    }
    
    @Test
    void testGetNoticeList_WithPagination() {
        List<Notice> list = noticeService.getNoticeList(null, null, 1, 5);
        assertNotNull(list);
        assertTrue(list.size() <= 5);
    }
    
    @Test
    void testGetNoticeDetail() {
        Notice notice = noticeService.getNoticeDetail(1L);
        assertNotNull(notice);
        assertEquals(1L, notice.getId());
    }
    
    @Test
    void testAddNotice() {
        Notice newNotice = new Notice();
        newNotice.setTitle("测试公告");
        newNotice.setContent("测试内容");
        newNotice.setStatus(2);
        
        Long id = noticeService.addNotice(newNotice);
        assertNotNull(id);
        
        Notice saved = noticeService.getNoticeDetail(id);
        assertNotNull(saved);
        assertEquals("测试公告", saved.getTitle());
    }
    
    @Test
    void testUpdateNotice() {
        Notice newNotice = new Notice();
        newNotice.setTitle("更新测试");
        newNotice.setContent("更新内容");
        Long id = noticeService.addNotice(newNotice);
        
        Notice updateData = new Notice();
        updateData.setTitle("已更新标题");
        boolean success = noticeService.updateNotice(id, updateData);
        
        assertTrue(success);
        Notice updated = noticeService.getNoticeDetail(id);
        assertEquals("已更新标题", updated.getTitle());
    }
    
    @Test
    void testDeleteNotice() {
        Notice newNotice = new Notice();
        newNotice.setTitle("删除测试");
        newNotice.setContent("删除内容");
        Long id = noticeService.addNotice(newNotice);
        
        boolean success = noticeService.deleteNotice(id);
        assertTrue(success);
        
        Notice deleted = noticeService.getNoticeDetail(id);
        assertNull(deleted);
    }
    
    @Test
    void testPublishNotice() {
        Notice newNotice = new Notice();
        newNotice.setTitle("上架测试");
        newNotice.setContent("测试内容");
        newNotice.setStatus(2);
        Long id = noticeService.addNotice(newNotice);
        
        boolean success = noticeService.publishNotice(id);
        assertTrue(success);
        
        Notice published = noticeService.getNoticeDetail(id);
        assertEquals(1, published.getStatus());
        assertNotNull(published.getPublishTime());
    }
    
    @Test
    void testUnpublishNotice() {
        Notice newNotice = new Notice();
        newNotice.setTitle("下架测试");
        newNotice.setContent("测试内容");
        newNotice.setStatus(1);
        Long id = noticeService.addNotice(newNotice);
        
        boolean success = noticeService.unpublishNotice(id);
        assertTrue(success);
        
        Notice unpublished = noticeService.getNoticeDetail(id);
        assertEquals(3, unpublished.getStatus());
    }
}
