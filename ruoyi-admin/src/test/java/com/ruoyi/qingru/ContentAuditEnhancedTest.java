package com.ruoyi.qingru;

import com.ruoyi.qingru.domain.ContentAudit;
import com.ruoyi.qingru.domain.AuditResult;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 内容审核增强测试
 * 测试内容审核的高级功能，包括敏感词检测、图片审核、音频审核等
 * 
 * 新增测试用例：12 个
 */
@SpringBootTest
public class ContentAuditEnhancedTest {

    @Autowired
    private ContentAuditService contentAuditService;

    /**
     * 测试敏感词检测 - 精确匹配
     */
    @Test
    public void testSensitiveWordDetection_ExactMatch() {
        String text = "这是一个测试敏感词的文本";
        AuditResult result = contentAuditService.detectSensitiveWords(text);
        assertNotNull(result, "审核结果不应该为 null");
        assertTrue(result.hasSensitiveWords(), "应该检测到敏感词");
    }

    /**
     * 测试敏感词检测 - 模糊匹配
     */
    @Test
    public void testSensitiveWordDetection_FuzzyMatch() {
        String text = "使用变体字测试敏*感*词检测";
        AuditResult result = contentAuditService.detectSensitiveWords(text);
        assertNotNull(result, "审核结果不应该为 null");
    }

    /**
     * 测试敏感词检测 - 拼音变体
     */
    @Test
    public void testSensitiveWordDetection_PinyinVariant() {
        String text = "使用拼音变体 min gan ci 检测";
        AuditResult result = contentAuditService.detectSensitiveWords(text);
        assertNotNull(result, "审核结果不应该为 null");
    }

    /**
     * 测试敏感词检测 - 同音字替换
     */
    @Test
    public void testSensitiveWordDetection_Homophone() {
        String text = "使用同音字替换检测";
        AuditResult result = contentAuditService.detectSensitiveWords(text);
        assertNotNull(result, "审核结果不应该为 null");
    }

    /**
     * 测试文本审核 - 长文本处理
     */
    @Test
    public void testAuditText_LongText() {
        StringBuilder longText = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            longText.append("正常文本内容");
        }
        boolean result = contentAuditService.auditText(longText.toString());
        assertTrue(result, "长文本应该正常处理");
    }

    /**
     * 测试文本审核 - 多语言混合
     */
    @Test
    public void testAuditText_MultiLanguage() {
        String text = "This is a mixed language text 这是中文混合测试";
        boolean result = contentAuditService.auditText(text);
        assertTrue(result, "多语言混合文本应该正常处理");
    }

    /**
     * 测试文本审核 - 特殊字符处理
     */
    @Test
    public void testAuditText_SpecialCharacters() {
        String text = "测试特殊字符：@#$%^&*()_+-=[]{}|;':\",./<>?";
        boolean result = contentAuditService.auditText(text);
        assertTrue(result, "包含特殊字符的文本应该正常处理");
    }

    /**
     * 测试文本审核 - emoji 表情处理
     */
    @Test
    public void testAuditText_Emoji() {
        String text = "测试 emoji 表情😀😁😂🤣😃😄😅😆";
        boolean result = contentAuditService.auditText(text);
        assertTrue(result, "包含 emoji 的文本应该正常处理");
    }

    /**
     * 测试图片审核 - 有效图片
     */
    @Test
    public void testAuditImage_ValidImage() {
        String imagePath = "/tmp/test_valid_image.jpg";
        AuditResult result = contentAuditService.auditImage(imagePath);
        assertNotNull(result, "图片审核结果不应该为 null");
    }

    /**
     * 测试图片审核 - 无效图片格式
     */
    @Test
    public void testAuditImage_InvalidFormat() {
        String imagePath = "/tmp/test_invalid.xyz";
        AuditResult result = contentAuditService.auditImage(imagePath);
        assertNotNull(result, "图片审核结果不应该为 null");
        assertFalse(result.isPassed(), "无效格式图片应该不通过审核");
    }

    /**
     * 测试图片审核 - 图片大小超限
     */
    @Test
    public void testAuditImage_SizeExceeded() {
        // 模拟超大图片
        String imagePath = "/tmp/test_large_image.jpg";
        AuditResult result = contentAuditService.auditImage(imagePath);
        assertNotNull(result, "图片审核结果不应该为 null");
    }

    /**
     * 测试音频审核 - 有效音频
     */
    @Test
    public void testAuditAudio_ValidAudio() {
        String audioPath = "/tmp/test_valid_audio.mp3";
        AuditResult result = contentAuditService.auditAudio(audioPath);
        assertNotNull(result, "音频审核结果不应该为 null");
    }

    /**
     * 测试音频审核 - 音频转文本
     */
    @Test
    public void testAuditAudio_SpeechToText() {
        String audioPath = "/tmp/test_audio.mp3";
        String transcript = contentAuditService.transcribeAudio(audioPath);
        assertNotNull(transcript, "音频转文本结果不应该为 null");
    }

    /**
     * 测试批量审核 - 混合内容
     */
    @Test
    public void testBatchAudit_MixedContent() {
        List<Map<String, String>> contents = new ArrayList<>();
        contents.add(createContentItem("text", "正常文本 1"));
        contents.add(createContentItem("text", "正常文本 2"));
        contents.add(createContentItem("image", "/tmp/image1.jpg"));
        
        Map<String, AuditResult> results = contentAuditService.batchAuditMixed(contents);
        assertEquals(3, results.size(), "批量审核结果数量应该与输入数量一致");
    }

    /**
     * 测试内容审核 - URL 检测
     */
    @Test
    public void testAuditText_URLDetection() {
        String text = "请访问 https://example.com 和 http://test.com 获取信息";
        AuditResult result = contentAuditService.detectURLs(text);
        assertNotNull(result, "URL 检测结果不应该为 null");
        assertEquals(2, result.getUrlCount(), "应该检测到 2 个 URL");
    }

    /**
     * 测试内容审核 - 黑名单 URL 检测
     */
    @Test
    public void testAuditText_BlacklistURL() {
        String text = "请访问 http://blacklisted-site.com 获取信息";
        AuditResult result = contentAuditService.detectURLs(text);
        assertNotNull(result, "URL 检测结果不应该为 null");
        assertTrue(result.hasBlacklistedURL(), "应该检测到黑名单 URL");
    }

    /**
     * 测试内容审核 - 电话号码检测
     */
    @Test
    public void testAuditText_PhoneNumberDetection() {
        String text = "联系电话：13800138000 或 010-12345678";
        AuditResult result = contentAuditService.detectPhoneNumbers(text);
        assertNotNull(result, "电话号码检测结果不应该为 null");
        assertTrue(result.hasPhoneNumbers(), "应该检测到电话号码");
    }

    /**
     * 测试内容审核 - 邮箱地址检测
     */
    @Test
    public void testAuditText_EmailDetection() {
        String text = "联系邮箱：test@example.com 和 support@test.org";
        AuditResult result = contentAuditService.detectEmails(text);
        assertNotNull(result, "邮箱检测结果不应该为 null");
        assertEquals(2, result.getEmailCount(), "应该检测到 2 个邮箱");
    }

    /**
     * 测试审核结果缓存
     */
    @Test
    public void testAuditResultCache() {
        String text = "缓存测试文本";
        // 第一次审核
        AuditResult result1 = contentAuditService.auditTextWithCache(text);
        assertNotNull(result1, "第一次审核结果不应该为 null");
        
        // 第二次审核（应该命中缓存）
        AuditResult result2 = contentAuditService.auditTextWithCache(text);
        assertNotNull(result2, "第二次审核结果不应该为 null");
        assertEquals(result1.isPassed(), result2.isPassed(), "缓存结果应该一致");
    }

    /**
     * 测试审核历史记录
     */
    @Test
    public void testAuditHistory() {
        String text = "历史记录测试文本";
        contentAuditService.auditText(text);
        
        List<ContentAudit> history = contentAuditService.getAuditHistory(1, 10);
        assertNotNull(history, "审核历史记录不应该为 null");
    }

    /**
     * 测试审核统计
     */
    @Test
    public void testAuditStatistics() {
        Map<String, Object> stats = contentAuditService.getAuditStatistics("2026-04-01", "2026-04-04");
        assertNotNull(stats, "审核统计不应该为 null");
        assertTrue(stats.containsKey("total"), "统计应该包含总数");
        assertTrue(stats.containsKey("passed"), "统计应该包含通过数");
        assertTrue(stats.containsKey("rejected"), "统计应该包含拒绝数");
    }

    /**
     * 测试审核规则配置
     */
    @Test
    public void testAuditRuleConfig() {
        Map<String, Object> config = contentAuditService.getAuditRules();
        assertNotNull(config, "审核规则配置不应该为 null");
        assertTrue(config.containsKey("sensitiveWords"), "配置应该包含敏感词规则");
        assertTrue(config.containsKey("blacklistURLs"), "配置应该包含黑名单 URL 规则");
    }

    /**
     * 测试自定义审核规则
     */
    @Test
    public void testCustomAuditRule() {
        String ruleName = "自定义规则测试";
        String pattern = "测试.*模式";
        contentAuditService.addCustomRule(ruleName, pattern);
        
        String text = "测试自定义模式匹配";
        AuditResult result = contentAuditService.auditWithCustomRules(text);
        assertNotNull(result, "自定义规则审核结果不应该为 null");
    }

    /**
     * 测试审核级别配置
     */
    @Test
    public void testAuditLevelConfig() {
        // 测试严格级别
        contentAuditService.setAuditLevel("strict");
        String text = "边界测试文本";
        AuditResult strictResult = contentAuditService.auditText(text);
        assertNotNull(strictResult, "严格级别审核结果不应该为 null");
        
        // 测试宽松级别
        contentAuditService.setAuditLevel("loose");
        AuditResult looseResult = contentAuditService.auditText(text);
        assertNotNull(looseResult, "宽松级别审核结果不应该为 null");
    }

    /**
     * 测试异步审核
     */
    @Test
    public void testAsyncAudit() throws InterruptedException {
        String text = "异步审核测试文本";
        String taskId = contentAuditService.submitAsyncAudit(text);
        assertNotNull(taskId, "异步审核任务 ID 不应该为 null");
        
        // 等待审核完成
        Thread.sleep(1000);
        
        AuditResult result = contentAuditService.getAsyncAuditResult(taskId);
        assertNotNull(result, "异步审核结果不应该为 null");
    }

    /**
     * 测试审核回调
     */
    @Test
    public void testAuditCallback() {
        String text = "回调测试文本";
        TestAuditCallback callback = new TestAuditCallback();
        contentAuditService.auditWithCallback(text, callback);
        assertTrue(callback.isCalled(), "回调应该被调用");
    }

    // 辅助方法
    private Map<String, String> createContentItem(String type, String content) {
        Map<String, String> item = new HashMap<>();
        item.put("type", type);
        item.put("content", content);
        return item;
    }

    // 测试回调类
    static class TestAuditCallback implements AuditCallback {
        private boolean called = false;
        
        @Override
        public void onAuditComplete(AuditResult result) {
            called = true;
        }
        
        public boolean isCalled() {
            return called;
        }
    }
}
