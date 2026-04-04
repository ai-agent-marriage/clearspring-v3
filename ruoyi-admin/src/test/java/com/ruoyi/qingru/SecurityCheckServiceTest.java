package com.ruoyi.qingru;

import com.ruoyi.qingru.service.SecurityCheckService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 内容安全审核测试
 * 测试图片和文本内容安全审核功能
 */
@SpringBootTest
public class SecurityCheckServiceTest {

    @Autowired
    private SecurityCheckService securityCheckService;

    @Test
    public void testCheckImage_Pass() {
        boolean result = securityCheckService.checkImage("valid_image.jpg");
        assertTrue(result);
    }

    @Test
    public void testCheckImage_Fail() {
        boolean result = securityCheckService.checkImage("invalid_image.jpg");
        assertFalse(result);
    }

    @Test
    public void testCheckImage_NullImage() {
        boolean result = securityCheckService.checkImage(null);
        assertFalse(result);
    }

    @Test
    public void testCheckImage_EmptyImage() {
        boolean result = securityCheckService.checkImage("");
        assertFalse(result);
    }

    @Test
    public void testCheckText_Pass() {
        boolean result = securityCheckService.checkText("正常文本");
        assertTrue(result);
    }

    @Test
    public void testCheckText_Fail() {
        boolean result = securityCheckService.checkText("敏感词测试");
        assertFalse(result);
    }

    @Test
    public void testCheckText_NullText() {
        boolean result = securityCheckService.checkText(null);
        assertFalse(result);
    }

    @Test
    public void testCheckText_EmptyText() {
        boolean result = securityCheckService.checkText("");
        assertTrue(result); // 空文本应该通过
    }

    @Test
    public void testCheckText_LongText() {
        StringBuilder longText = new StringBuilder();
        for (int i = 0; i < 1000; i++) {
            longText.append("正常内容");
        }
        boolean result = securityCheckService.checkText(longText.toString());
        assertTrue(result);
    }

    @Test
    public void testCheckText_ContainsSensitiveWords() {
        boolean result = securityCheckService.checkText("包含敏感词的内容");
        assertFalse(result);
    }

    @Test
    public void testCheckText_PoliticalSensitive() {
        boolean result = securityCheckService.checkText("政治敏感内容");
        assertFalse(result);
    }

    @Test
    public void testCheckText_ViolentContent() {
        boolean result = securityCheckService.checkText("暴力内容");
        assertFalse(result);
    }

    @Test
    public void testCheckText_PornographicContent() {
        boolean result = securityCheckService.checkText("色情内容");
        assertFalse(result);
    }

    @Test
    public void testCheckText_Advertisement() {
        boolean result = securityCheckService.checkText("广告推广内容");
        assertFalse(result);
    }

    @Test
    public void testCheckText_NormalWish() {
        boolean result = securityCheckService.checkText("愿家人平安健康");
        assertTrue(result);
    }

    @Test
    public void testCheckText_NormalRecord() {
        boolean result = securityCheckService.checkText("今日在珠江广州段放生鲢鱼 100 条");
        assertTrue(result);
    }

    @Test
    public void testCheckText_WithEmoji() {
        boolean result = securityCheckService.checkText("平安顺遂🙏");
        assertTrue(result);
    }

    @Test
    public void testCheckText_MixedContent() {
        boolean result = securityCheckService.checkText("正常内容 + 敏感词测试");
        assertFalse(result);
    }

    @Test
    public void testCheckImage_JpegFormat() {
        boolean result = securityCheckService.checkImage("test.jpg");
        assertTrue(result);
    }

    @Test
    public void testCheckImage_PngFormat() {
        boolean result = securityCheckService.checkImage("test.png");
        assertTrue(result);
    }

    @Test
    public void testCheckImage_InvalidFormat() {
        boolean result = securityCheckService.checkImage("test.txt");
        assertFalse(result);
    }

    @Test
    public void testCheckImage_TooLarge() {
        boolean result = securityCheckService.checkImage("too_large_image.jpg");
        assertFalse(result);
    }

    @Test
    public void testCheckText_Performance() {
        long startTime = System.currentTimeMillis();
        
        for (int i = 0; i < 100; i++) {
            securityCheckService.checkText("正常测试文本" + i);
        }
        
        long endTime = System.currentTimeMillis();
        // 100 次审核应该在合理时间内完成
        assertTrue((endTime - startTime) < 5000);
    }
}
