package com.ruoyi.qingru;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 内容审核服务测试
 * 测试内容审核功能，包括文本审核、图片审核和批量审核
 */
@SpringBootTest
public class ContentAuditServiceTest {

    @Autowired
    private ContentAuditService contentAuditService;

    /**
     * 测试正常文本审核通过
     */
    @Test
    public void testAuditText_Pass() {
        boolean result = contentAuditService.auditText("正常文本");
        assertTrue(result, "正常文本应该通过审核");
    }

    /**
     * 测试包含敏感词的文本审核不通过
     */
    @Test
    public void testAuditText_Fail() {
        boolean result = contentAuditService.auditText("敏感词测试");
        assertFalse(result, "包含敏感词的文本应该不通过审核");
    }

    /**
     * 测试空文本审核
     */
    @Test
    public void testAuditText_Empty() {
        boolean result = contentAuditService.auditText("");
        assertFalse(result, "空文本应该不通过审核");
    }

    /**
     * 测试 null 文本审核
     */
    @Test
    public void testAuditText_Null() {
        boolean result = contentAuditService.auditText(null);
        assertFalse(result, "null 文本应该不通过审核");
    }

    /**
     * 测试有效图片审核通过
     */
    @Test
    public void testAuditImage_Pass() {
        boolean result = contentAuditService.auditImage("valid_image.jpg");
        assertTrue(result, "有效图片应该通过审核");
    }

    /**
     * 测试无效图片审核不通过
     */
    @Test
    public void testAuditImage_Fail() {
        boolean result = contentAuditService.auditImage("invalid_image.jpg");
        assertFalse(result, "无效图片应该不通过审核");
    }

    /**
     * 测试批量审核成功
     */
    @Test
    public void testBatchAudit_Success() {
        List<String> contents = Arrays.asList("正常文本 1", "正常文本 2");
        Map<String, Boolean> results = contentAuditService.batchAudit(contents);
        assertEquals(2, results.size(), "批量审核结果数量应该与输入数量一致");
    }

    /**
     * 测试批量审核部分通过
     */
    @Test
    public void testBatchAudit_PartialPass() {
        List<String> contents = Arrays.asList("正常文本", "敏感词测试");
        Map<String, Boolean> results = contentAuditService.batchAudit(contents);
        assertEquals(2, results.size(), "批量审核结果数量应该与输入数量一致");
        assertTrue(results.get("正常文本"), "正常文本应该通过审核");
        assertFalse(results.get("敏感词测试"), "包含敏感词的文本应该不通过审核");
    }

    /**
     * 测试空列表批量审核
     */
    @Test
    public void testBatchAudit_EmptyList() {
        List<String> contents = Arrays.asList();
        Map<String, Boolean> results = contentAuditService.batchAudit(contents);
        assertEquals(0, results.size(), "空列表批量审核应该返回空结果");
    }

    /**
     * 测试文本审核包含特殊字符
     */
    @Test
    public void testAuditText_SpecialChars() {
        boolean result = contentAuditService.auditText("测试@#$%特殊字符");
        assertTrue(result, "包含特殊字符的正常文本应该通过审核");
    }

    /**
     * 测试文本审核包含链接
     */
    @Test
    public void testAuditText_WithLink() {
        boolean result = contentAuditService.auditText("请访问 https://example.com 获取更多信息");
        assertTrue(result, "包含合法链接的文本应该通过审核");
    }

    /**
     * 测试文本审核包含违规链接
     */
    @Test
    public void testAuditText_WithInvalidLink() {
        boolean result = contentAuditService.auditText("请访问 http://spam-site.com 获取更多信息");
        assertFalse(result, "包含违规链接的文本应该不通过审核");
    }
}
