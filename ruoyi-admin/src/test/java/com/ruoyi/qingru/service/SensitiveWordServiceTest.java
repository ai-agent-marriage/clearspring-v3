package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.SensitiveWord;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 敏感词服务测试
 */
@SpringBootTest
class SensitiveWordServiceTest {
    
    @Autowired
    private SensitiveWordService sensitiveWordService;
    
    @Test
    void testGetSensitiveWordList_NoFilter() {
        List<SensitiveWord> list = sensitiveWordService.getSensitiveWordList(null, null, null, null, null);
        assertNotNull(list);
        assertTrue(list.size() > 0);
    }
    
    @Test
    void testGetSensitiveWordList_ByLevel() {
        List<SensitiveWord> list = sensitiveWordService.getSensitiveWordList(2, null, null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(w -> w.getLevel() == 2));
    }
    
    @Test
    void testGetSensitiveWordList_ByStatus() {
        List<SensitiveWord> list = sensitiveWordService.getSensitiveWordList(null, 1, null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(w -> w.getStatus() == 1));
    }
    
    @Test
    void testAddSensitiveWord() {
        SensitiveWord newWord = new SensitiveWord();
        newWord.setWord("测试敏感词");
        newWord.setLevel(2);
        newWord.setStatus(1);
        
        Long id = sensitiveWordService.addSensitiveWord(newWord);
        assertNotNull(id);
    }
    
    @Test
    void testDeleteSensitiveWord() {
        SensitiveWord newWord = new SensitiveWord();
        newWord.setWord("删除测试");
        newWord.setLevel(1);
        Long id = sensitiveWordService.addSensitiveWord(newWord);
        
        boolean success = sensitiveWordService.deleteSensitiveWord(id);
        assertTrue(success);
    }
    
    @Test
    void testBatchDeleteSensitiveWord() {
        SensitiveWord word1 = new SensitiveWord();
        word1.setWord("批量删除 1");
        Long id1 = sensitiveWordService.addSensitiveWord(word1);
        
        SensitiveWord word2 = new SensitiveWord();
        word2.setWord("批量删除 2");
        Long id2 = sensitiveWordService.addSensitiveWord(word2);
        
        int count = sensitiveWordService.batchDeleteSensitiveWord(Arrays.asList(id1, id2));
        assertEquals(2, count);
    }
    
    @Test
    void testBatchImportSensitiveWord() {
        List<String> words = Arrays.asList("导入测试 1", "导入测试 2", "导入测试 3");
        int count = sensitiveWordService.batchImportSensitiveWord(words, 2);
        assertTrue(count > 0);
    }
    
    @Test
    void testUpdateSensitiveWordStatus() {
        SensitiveWord newWord = new SensitiveWord();
        newWord.setWord("状态更新测试");
        newWord.setLevel(2);
        newWord.setStatus(1);
        Long id = sensitiveWordService.addSensitiveWord(newWord);
        
        boolean success = sensitiveWordService.updateSensitiveWordStatus(id, 0);
        assertTrue(success);
        
        List<SensitiveWord> list = sensitiveWordService.getSensitiveWordList(null, 0, null, null, null);
        assertTrue(list.stream().anyMatch(w -> w.getId().equals(id)));
    }
    
    @Test
    void testGetEnabledSensitiveWords() {
        List<String> words = sensitiveWordService.getEnabledSensitiveWords();
        assertNotNull(words);
    }
}
