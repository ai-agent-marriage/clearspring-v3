package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.HelpDoc;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 帮助文档服务测试
 */
@SpringBootTest
class HelpDocServiceTest {
    
    @Autowired
    private HelpDocService helpDocService;
    
    @Test
    void testGetHelpDocList_NoFilter() {
        List<HelpDoc> list = helpDocService.getHelpDocList(null, null, null, null);
        assertNotNull(list);
        assertTrue(list.size() > 0);
    }
    
    @Test
    void testGetHelpDocList_ByCategory() {
        List<HelpDoc> list = helpDocService.getHelpDocList("入门", null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(d -> "入门".equals(d.getCategory())));
    }
    
    @Test
    void testGetHelpDocList_ByKeyword() {
        List<HelpDoc> list = helpDocService.getHelpDocList(null, "新手", null, null);
        assertNotNull(list);
        assertTrue(list.stream().anyMatch(d -> d.getTitle().contains("新手") || d.getContent().contains("新手")));
    }
    
    @Test
    void testGetHelpDocDetail_IncrementsViewCount() {
        HelpDoc doc = helpDocService.getHelpDocDetail(1L);
        assertNotNull(doc);
        Integer initialCount = doc.getViewCount();
        
        HelpDoc doc2 = helpDocService.getHelpDocDetail(1L);
        assertTrue(doc2.getViewCount() > initialCount);
    }
    
    @Test
    void testAddHelpDoc() {
        HelpDoc newDoc = new HelpDoc();
        newDoc.setTitle("测试文档");
        newDoc.setContent("测试内容");
        newDoc.setCategory("测试分类");
        
        Long id = helpDocService.addHelpDoc(newDoc);
        assertNotNull(id);
        
        HelpDoc saved = helpDocService.getHelpDocDetail(id);
        assertNotNull(saved);
        assertEquals("测试文档", saved.getTitle());
    }
    
    @Test
    void testUpdateHelpDoc() {
        HelpDoc newDoc = new HelpDoc();
        newDoc.setTitle("更新测试");
        newDoc.setContent("更新内容");
        Long id = helpDocService.addHelpDoc(newDoc);
        
        HelpDoc updateData = new HelpDoc();
        updateData.setTitle("已更新标题");
        boolean success = helpDocService.updateHelpDoc(id, updateData);
        
        assertTrue(success);
        HelpDoc updated = helpDocService.getHelpDocDetail(id);
        assertEquals("已更新标题", updated.getTitle());
    }
    
    @Test
    void testDeleteHelpDoc() {
        HelpDoc newDoc = new HelpDoc();
        newDoc.setTitle("删除测试");
        newDoc.setContent("删除内容");
        Long id = helpDocService.addHelpDoc(newDoc);
        
        boolean success = helpDocService.deleteHelpDoc(id);
        assertTrue(success);
        
        HelpDoc deleted = helpDocService.getHelpDocDetail(id);
        assertNull(deleted);
    }
    
    @Test
    void testGetCategories() {
        List<String> categories = helpDocService.getCategories();
        assertNotNull(categories);
        assertTrue(categories.size() > 0);
    }
}
