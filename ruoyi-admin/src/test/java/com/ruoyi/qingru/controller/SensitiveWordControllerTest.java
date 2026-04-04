package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.SensitiveWord;
import com.ruoyi.qingru.service.SensitiveWordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 敏感词控制器测试
 */
@ExtendWith(MockitoExtension.class)
class SensitiveWordControllerTest {
    
    @Mock
    private SensitiveWordService sensitiveWordService;
    
    @InjectMocks
    private SensitiveWordController sensitiveWordController;
    
    private SensitiveWord testWord;
    
    @BeforeEach
    void setUp() {
        testWord = new SensitiveWord();
        testWord.setId(1L);
        testWord.setWord("测试敏感词");
        testWord.setLevel(2);
        testWord.setStatus(1);
    }
    
    @Test
    void testGetList_NoFilter() {
        List<SensitiveWord> mockList = new ArrayList<>();
        mockList.add(testWord);
        when(sensitiveWordService.getSensitiveWordList(null, null, null, null, null)).thenReturn(mockList);
        
        R<List<SensitiveWord>> result = sensitiveWordController.getList(null, null, null, null, null);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetList_WithFilter() {
        List<SensitiveWord> mockList = new ArrayList<>();
        mockList.add(testWord);
        when(sensitiveWordService.getSensitiveWordList(2, 1, "测试", 1, 10)).thenReturn(mockList);
        
        R<List<SensitiveWord>> result = sensitiveWordController.getList(2, 1, "测试", 1, 10);
        
        assertEquals(200, result.getCode());
        verify(sensitiveWordService, times(1)).getSensitiveWordList(2, 1, "测试", 1, 10);
    }
    
    @Test
    void testAdd() {
        when(sensitiveWordService.addSensitiveWord(any(SensitiveWord.class))).thenReturn(100L);
        
        R<Long> result = sensitiveWordController.add(testWord);
        
        assertEquals(200, result.getCode());
        assertEquals(100L, result.getData());
    }
    
    @Test
    void testAdd_EmptyWord() {
        SensitiveWord emptyWord = new SensitiveWord();
        emptyWord.setWord("");
        
        R<Long> result = sensitiveWordController.add(emptyWord);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("不能为空"));
    }
    
    @Test
    void testDelete() {
        when(sensitiveWordService.deleteSensitiveWord(1L)).thenReturn(true);
        
        R<Void> result = sensitiveWordController.delete(1L);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testBatchDelete() {
        when(sensitiveWordService.batchDeleteSensitiveWord(anyList())).thenReturn(2);
        
        R<Integer> result = sensitiveWordController.batchDelete(Arrays.asList(1L, 2L));
        
        assertEquals(200, result.getCode());
        assertEquals(2, result.getData());
    }
    
    @Test
    void testBatchImport() {
        Map<String, Object> params = new HashMap<>();
        params.put("words", Arrays.asList("导入 1", "导入 2"));
        params.put("level", 2);
        
        when(sensitiveWordService.batchImportSensitiveWord(anyList(), anyInt())).thenReturn(2);
        
        R<Integer> result = sensitiveWordController.batchImport(params);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testUpdateStatus() {
        when(sensitiveWordService.updateSensitiveWordStatus(1L, 0)).thenReturn(true);
        
        R<Void> result = sensitiveWordController.updateStatus(1L, 0);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testGetEnabled() {
        List<String> mockWords = Arrays.asList("敏感词 1", "敏感词 2");
        when(sensitiveWordService.getEnabledSensitiveWords()).thenReturn(mockWords);
        
        R<List<String>> result = sensitiveWordController.getEnabled();
        
        assertEquals(200, result.getCode());
        assertEquals(2, result.getData().size());
    }
}
