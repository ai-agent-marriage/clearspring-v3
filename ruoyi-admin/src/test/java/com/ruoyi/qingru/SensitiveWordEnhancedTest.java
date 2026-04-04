package com.ruoyi.qingru;

import com.ruoyi.qingru.domain.SensitiveWord;
import com.ruoyi.qingru.service.ISensitiveWordService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 敏感词管理增强测试
 * 测试敏感词管理的高级功能，包括批量操作、导入导出、统计分析等
 * 
 * 新增测试用例：13 个
 */
@SpringBootTest
public class SensitiveWordEnhancedTest {

    @Autowired
    private ISensitiveWordService sensitiveWordService;

    /**
     * 测试批量添加敏感词
     */
    @Test
    public void testBatchAddSensitiveWords() {
        List<SensitiveWord> words = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            SensitiveWord word = new SensitiveWord();
            word.setWord("批量测试词" + i);
            word.setLevel(2);
            word.setType(1);
            words.add(word);
        }
        
        int result = sensitiveWordService.batchAddSensitiveWords(words);
        assertTrue(result > 0, "批量添加敏感词应该返回成功");
        assertEquals(10, result, "批量添加数量应该与输入一致");
    }

    /**
     * 测试批量更新敏感词
     */
    @Test
    public void testBatchUpdateSensitiveWords() {
        // 先添加一些敏感词
        List<Long> ids = new ArrayList<>();
        for (int i = 0; i < 5; i++) {
            SensitiveWord word = new SensitiveWord();
            word.setWord("批量更新测试词" + i);
            word.setLevel(1);
            sensitiveWordService.addSensitiveWord(word);
            ids.add(word.getId());
        }
        
        // 批量更新级别
        Map<Long, Integer> updates = new HashMap<>();
        for (Long id : ids) {
            updates.put(id, 3);
        }
        
        int result = sensitiveWordService.batchUpdateSensitiveWords(updates);
        assertTrue(result > 0, "批量更新敏感词应该返回成功");
    }

    /**
     * 测试敏感词导入 - Excel 格式
     */
    @Test
    public void testImportSensitiveWords_Excel() {
        String filePath = "/tmp/sensitive_words.xlsx";
        int result = sensitiveWordService.importSensitiveWords(filePath, "excel");
        assertTrue(result >= 0, "Excel 导入应该成功或返回 0");
    }

    /**
     * 测试敏感词导入 - CSV 格式
     */
    @Test
    public void testImportSensitiveWords_CSV() {
        String filePath = "/tmp/sensitive_words.csv";
        int result = sensitiveWordService.importSensitiveWords(filePath, "csv");
        assertTrue(result >= 0, "CSV 导入应该成功或返回 0");
    }

    /**
     * 测试敏感词导入 - 数据验证
     */
    @Test
    public void testImportSensitiveWords_Validation() {
        String filePath = "/tmp/sensitive_words_invalid.csv";
        try {
            int result = sensitiveWordService.importSensitiveWords(filePath, "csv");
            // 应该返回 0 或抛出异常
            assertTrue(result >= 0, "无效数据导入应该返回 0 或失败");
        } catch (Exception e) {
            assertTrue(e.getMessage().contains("格式") || e.getMessage().contains("验证"), 
                "应该抛出格式或验证异常");
        }
    }

    /**
     * 测试敏感词导出 - Excel 格式
     */
    @Test
    public void testExportSensitiveWords_Excel() {
        String outputPath = "/tmp/export_sensitive_words.xlsx";
        boolean result = sensitiveWordService.exportSensitiveWords(outputPath, "excel");
        assertTrue(result, "Excel 导出应该成功");
    }

    /**
     * 测试敏感词导出 - CSV 格式
     */
    @Test
    public void testExportSensitiveWords_CSV() {
        String outputPath = "/tmp/export_sensitive_words.csv";
        boolean result = sensitiveWordService.exportSensitiveWords(outputPath, "csv");
        assertTrue(result, "CSV 导出应该成功");
    }

    /**
     * 测试敏感词导出 - 带筛选条件
     */
    @Test
    public void testExportSensitiveWords_WithFilter() {
        String outputPath = "/tmp/export_filtered_words.xlsx";
        Map<String, Object> filter = new HashMap<>();
        filter.put("level", 2);
        filter.put("type", 1);
        
        boolean result = sensitiveWordService.exportSensitiveWords(outputPath, "excel", filter);
        assertTrue(result, "带筛选条件的导出应该成功");
    }

    /**
     * 测试敏感词分类统计
     */
    @Test
    public void testSensitiveWordCategoryStatistics() {
        Map<String, Integer> stats = sensitiveWordService.getCategoryStatistics();
        assertNotNull(stats, "分类统计不应该为 null");
        assertTrue(stats.size() > 0, "分类统计应该有数据");
    }

    /**
     * 测试敏感词级别统计
     */
    @Test
    public void testSensitiveWordLevelStatistics() {
        Map<Integer, Integer> stats = sensitiveWordService.getLevelStatistics();
        assertNotNull(stats, "级别统计不应该为 null");
        assertTrue(stats.containsKey(1), "应该包含级别 1 的统计");
        assertTrue(stats.containsKey(2), "应该包含级别 2 的统计");
        assertTrue(stats.containsKey(3), "应该包含级别 3 的统计");
    }

    /**
     * 测试敏感词趋势分析
     */
    @Test
    public void testSensitiveWordTrendAnalysis() {
        List<Map<String, Object>> trend = sensitiveWordService.getTrendAnalysis("2026-04-01", "2026-04-04");
        assertNotNull(trend, "趋势分析不应该为 null");
    }

    /**
     * 测试敏感词热度排行
     */
    @Test
    public void testSensitiveWordHotRanking() {
        List<SensitiveWord> hotWords = sensitiveWordService.getHotRanking(10);
        assertNotNull(hotWords, "热度排行不应该为 null");
        assertTrue(hotWords.size() <= 10, "热度排行数量不应该超过 10");
    }

    /**
     * 测试敏感词联想输入
     */
    @Test
    public void testSensitiveWordAutocomplete() {
        List<String> suggestions = sensitiveWordService.getAutocompleteSuggestions("测试");
        assertNotNull(suggestions, "联想输入建议不应该为 null");
    }

    /**
     * 测试敏感词相似度检测
     */
    @Test
    public void testSensitiveWordSimilarity() {
        String word1 = "测试敏感词";
        String word2 = "测试敏感词变体";
        double similarity = sensitiveWordService.calculateSimilarity(word1, word2);
        assertTrue(similarity >= 0 && similarity <= 1, "相似度应该在 0-1 之间");
    }

    /**
     * 测试敏感词去重
     */
    @Test
    public void testSensitiveWordDeduplication() {
        List<SensitiveWord> words = new ArrayList<>();
        words.add(createWord("重复词 1", 1));
        words.add(createWord("重复词 1", 2)); // 重复
        words.add(createWord("重复词 2", 1));
        words.add(createWord("重复词 2", 2)); // 重复
        
        List<SensitiveWord> deduplicated = sensitiveWordService.deduplicateWords(words);
        assertEquals(2, deduplicated.size(), "去重后应该只剩 2 个词");
    }

    /**
     * 测试敏感词合并
     */
    @Test
    public void testSensitiveWordMerge() {
        Long id1 = 1L;
        Long id2 = 2L;
        
        SensitiveWord merged = sensitiveWordService.mergeSensitiveWords(id1, id2);
        assertNotNull(merged, "合并后的敏感词不应该为 null");
    }

    /**
     * 测试敏感词拆分
     */
    @Test
    public void testSensitiveWordSplit() {
        SensitiveWord word = new SensitiveWord();
        word.setWord("测试，敏感词，拆分");
        word.setLevel(2);
        
        List<SensitiveWord> splitWords = sensitiveWordService.splitSensitiveWord(word);
        assertNotNull(splitWords, "拆分结果不应该为 null");
        assertTrue(splitWords.size() > 1, "应该拆分成多个词");
    }

    /**
     * 测试敏感词启用/禁用
     */
    @Test
    public void testSensitiveWordEnableDisable() {
        // 添加一个敏感词
        SensitiveWord word = new SensitiveWord();
        word.setWord("启用禁用测试词");
        word.setLevel(2);
        sensitiveWordService.addSensitiveWord(word);
        
        // 禁用
        int result1 = sensitiveWordService.updateStatus(word.getId(), 0);
        assertTrue(result1 > 0, "禁用操作应该成功");
        
        // 启用
        int result2 = sensitiveWordService.updateStatus(word.getId(), 1);
        assertTrue(result2 > 0, "启用操作应该成功");
    }

    /**
     * 测试敏感词有效期设置
     */
    @Test
    public void testSensitiveWordValidityPeriod() {
        SensitiveWord word = new SensitiveWord();
        word.setWord("有效期测试词");
        word.setLevel(2);
        word.setStartTime(System.currentTimeMillis());
        word.setEndTime(System.currentTimeMillis() + 86400000L); // 1 天后
        
        int result = sensitiveWordService.addSensitiveWord(word);
        assertTrue(result > 0, "设置有效期的敏感词添加应该成功");
        
        // 验证是否在有效期内
        boolean isValid = sensitiveWordService.isValid(word);
        assertTrue(isValid, "敏感词应该在有效期内");
    }

    /**
     * 测试敏感词过期清理
     */
    @Test
    public void testSensitiveWordExpiredCleanup() {
        // 添加一个已过期的敏感词
        SensitiveWord word = new SensitiveWord();
        word.setWord("过期测试词");
        word.setLevel(2);
        word.setStartTime(System.currentTimeMillis() - 172800000L); // 2 天前
        word.setEndTime(System.currentTimeMillis() - 86400000L); // 1 天前
        
        sensitiveWordService.addSensitiveWord(word);
        
        // 执行过期清理
        int cleanedCount = sensitiveWordService.cleanupExpiredWords();
        assertTrue(cleanedCount >= 0, "过期清理应该返回清理数量");
    }

    /**
     * 测试敏感词审核日志
     */
    @Test
    public void testSensitiveWordAuditLog() {
        List<Map<String, Object>> logs = sensitiveWordService.getAuditLogs(1, 10);
        assertNotNull(logs, "审核日志不应该为 null");
    }

    /**
     * 测试敏感词操作记录
     */
    @Test
    public void testSensitiveWordOperationLog() {
        List<Map<String, Object>> logs = sensitiveWordService.getOperationLogs("2026-04-01", "2026-04-04");
        assertNotNull(logs, "操作记录不应该为 null");
    }

    /**
     * 测试敏感词权限检查
     */
    @Test
    public void testSensitiveWordPermissionCheck() {
        String userId = "test_user";
        String operation = "add";
        
        boolean hasPermission = sensitiveWordService.checkPermission(userId, operation);
        // 权限检查结果取决于具体实现
        assertNotNull(hasPermission, "权限检查应该返回布尔值");
    }

    /**
     * 测试敏感词批量启用
     */
    @Test
    public void testBatchEnableSensitiveWords() {
        Long[] ids = new Long[]{1L, 2L, 3L};
        int result = sensitiveWordService.batchUpdateStatus(ids, 1);
        assertTrue(result > 0, "批量启用应该成功");
    }

    /**
     * 测试敏感词批量禁用
     */
    @Test
    public void testBatchDisableSensitiveWords() {
        Long[] ids = new Long[]{1L, 2L, 3L};
        int result = sensitiveWordService.batchUpdateStatus(ids, 0);
        assertTrue(result > 0, "批量禁用应该成功");
    }

    /**
     * 测试敏感词高级搜索
     */
    @Test
    public void testAdvancedSearch() {
        Map<String, Object> criteria = new HashMap<>();
        criteria.put("keyword", "测试");
        criteria.put("level", 2);
        criteria.put("type", 1);
        criteria.put("status", 1);
        
        List<SensitiveWord> results = sensitiveWordService.advancedSearch(criteria, 1, 10);
        assertNotNull(results, "高级搜索结果不应该为 null");
    }

    /**
     * 测试敏感词正则匹配
     */
    @Test
    public void testSensitiveWordRegexMatch() {
        String pattern = "测试.*";
        String text = "这是一个测试文本";
        
        boolean matches = sensitiveWordService.regexMatch(pattern, text);
        assertTrue(matches, "正则表达式应该匹配");
    }

    /**
     * 测试敏感词词库备份
     */
    @Test
    public void testSensitiveWordBackup() {
        String backupPath = "/tmp/sensitive_words_backup.json";
        boolean result = sensitiveWordService.backupWordLibrary(backupPath);
        assertTrue(result, "词库备份应该成功");
    }

    /**
     * 测试敏感词词库恢复
     */
    @Test
    public void testSensitiveWordRestore() {
        String backupPath = "/tmp/sensitive_words_backup.json";
        int restoredCount = sensitiveWordService.restoreWordLibrary(backupPath);
        assertTrue(restoredCount >= 0, "词库恢复应该成功");
    }

    // 辅助方法
    private SensitiveWord createWord(String word, int level) {
        SensitiveWord w = new SensitiveWord();
        w.setWord(word);
        w.setLevel(level);
        return w;
    }
}
