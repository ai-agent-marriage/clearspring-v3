package com.ruoyi.qingru.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 内容审核服务测试
 */
@SpringBootTest
class ContentAuditServiceTest {
    
    @Autowired
    private ContentAuditService contentAuditService;
    
    @Test
    void testAuditText_ValidContent() {
        boolean result = contentAuditService.auditText("这是一段正常的文本内容");
        assertTrue(result);
    }
    
    @Test
    void testAuditText_EmptyContent() {
        boolean result = contentAuditService.auditText("");
        assertFalse(result);
    }
    
    @Test
    void testAuditText_NullContent() {
        boolean result = contentAuditService.auditText(null);
        assertFalse(result);
    }
    
    @Test
    void testAuditImage_ValidUrl() {
        boolean result = contentAuditService.auditImage("https://example.com/image.jpg");
        assertTrue(result);
    }
    
    @Test
    void testAuditImage_EmptyUrl() {
        boolean result = contentAuditService.auditImage("");
        assertFalse(result);
    }
    
    @Test
    void testBatchAudit() {
        List<String> contents = Arrays.asList("内容 1", "内容 2", "内容 3");
        Map<String, Boolean> results = contentAuditService.batchAudit(contents);
        
        assertNotNull(results);
        assertEquals(3, results.size());
        assertTrue(results.values().stream().allMatch(b -> b));
    }
    
    @Test
    void testBatchAudit_EmptyList() {
        List<String> contents = Arrays.asList();
        Map<String, Boolean> results = contentAuditService.batchAudit(contents);
        
        assertNotNull(results);
        assertTrue(results.isEmpty());
    }
    
    @Test
    void testAddAndRemoveSensitiveWord() {
        String testWord = "测试敏感词";
        contentAuditService.addSensitiveWord(testWord);
        
        assertTrue(contentAuditService.getSensitiveWords().contains(testWord));
        
        contentAuditService.removeSensitiveWord(testWord);
        assertFalse(contentAuditService.getSensitiveWords().contains(testWord));
    }
}
