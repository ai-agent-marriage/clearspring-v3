package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.HelpDoc;
import com.ruoyi.qingru.service.HelpDocService;
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
 * 帮助文档控制器测试
 */
@ExtendWith(MockitoExtension.class)
class HelpDocControllerTest {
    
    @Mock
    private HelpDocService helpDocService;
    
    @InjectMocks
    private HelpDocController helpDocController;
    
    private HelpDoc testDoc;
    
    @BeforeEach
    void setUp() {
        testDoc = new HelpDoc();
        testDoc.setId(1L);
        testDoc.setTitle("测试文档");
        testDoc.setContent("测试内容");
        testDoc.setCategory("测试分类");
        testDoc.setSort(1);
        testDoc.setViewCount(0);
        testDoc.setCreateTime(new Date());
    }
    
    @Test
    void testGetList_NoFilter() {
        List<HelpDoc> mockList = new ArrayList<>();
        mockList.add(testDoc);
        when(helpDocService.getHelpDocList(null, null, null, null)).thenReturn(mockList);
        
        R<List<HelpDoc>> result = helpDocController.getList(null, null, null, null);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetList_WithFilter() {
        List<HelpDoc> mockList = new ArrayList<>();
        mockList.add(testDoc);
        when(helpDocService.getHelpDocList("测试", "文档", 1, 10)).thenReturn(mockList);
        
        R<List<HelpDoc>> result = helpDocController.getList("测试", "文档", 1, 10);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testGetDetail() {
        when(helpDocService.getHelpDocDetail(1L)).thenReturn(testDoc);
        
        R<HelpDoc> result = helpDocController.getDetail(1L);
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
    
    @Test
    void testGetDetail_NotFound() {
        when(helpDocService.getHelpDocDetail(999L)).thenReturn(null);
        
        R<HelpDoc> result = helpDocController.getDetail(999L);
        
        assertNotEquals(200, result.getCode());
    }
    
    @Test
    void testAdd() {
        when(helpDocService.addHelpDoc(any(HelpDoc.class))).thenReturn(100L);
        
        R<Long> result = helpDocController.add(testDoc);
        
        assertEquals(200, result.getCode());
        assertEquals(100L, result.getData());
    }
    
    @Test
    void testUpdate() {
        when(helpDocService.updateHelpDoc(eq(1L), any(HelpDoc.class))).thenReturn(true);
        
        R<Void> result = helpDocController.update(1L, testDoc);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testDelete() {
        when(helpDocService.deleteHelpDoc(1L)).thenReturn(true);
        
        R<Void> result = helpDocController.delete(1L);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testGetCategories() {
        List<String> mockCategories = new ArrayList<>();
        mockCategories.add("入门");
        when(helpDocService.getCategories()).thenReturn(mockCategories);
        
        R<List<String>> result = helpDocController.getCategories();
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
}
