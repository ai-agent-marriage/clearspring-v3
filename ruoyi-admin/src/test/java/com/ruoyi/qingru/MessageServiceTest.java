package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.InternalMessage;
import com.ruoyi.qingru.entity.MessageTemplate;
import com.ruoyi.qingru.entity.MessageRecord;
import com.ruoyi.qingru.service.MessageService;
import com.ruoyi.qingru.service.MessagePushService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Day 15 消息推送服务测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/MessageServiceTest.java
 * 
 * 测试范围:
 * - 消息推送首页测试
 * - 订阅消息配置测试
 * - 消息记录测试
 * - 消息推送服务测试
 * 
 * 用例数量：20 个
 */
@SpringBootTest
public class MessageServiceTest {

    @Autowired
    private MessageService messageService;

    @Autowired
    private MessagePushService messagePushService;

    // ==================== 消息推送首页测试 (5 个用例) ====================

    /**
     * 测试获取消息统计数据
     */
    @Test
    public void testGetMessageStats_Success() {
        // 获取统计数据
        Map<String, Object> stats = messageService.getMessageStats(null, null);
        
        // 验证结果
        assertNotNull(stats, "统计数据不应为空");
        assertTrue(stats.containsKey("totalMessages"), "应包含总消息数");
        assertTrue(stats.containsKey("todaySent"), "应包含今日发送数");
        assertTrue(stats.containsKey("successRate"), "应包含成功率");
        assertTrue(stats.containsKey("failedCount"), "应包含失败数");
    }

    /**
     * 测试获取今日推送数据
     */
    @Test
    public void testGetTodayStats_Success() {
        // 获取今日统计数据
        Map<String, Object> todayStats = messageService.getTodayStats();
        
        // 验证结果
        assertNotNull(todayStats, "今日统计数据不应为空");
        assertTrue(todayStats.containsKey("sentCount"), "应包含发送数");
        assertTrue(todayStats.containsKey("successCount"), "应包含成功数");
    }

    /**
     * 测试获取功能菜单列表
     */
    @Test
    public void testGetFunctionMenus_Success() {
        // 获取功能菜单
        List<Map<String, Object>> menus = messageService.getFunctionMenus();
        
        // 验证结果
        assertNotNull(menus, "功能菜单不应为空");
        assertTrue(menus.size() >= 4, "应至少包含 4 个功能菜单");
    }

    /**
     * 测试推送成功率计算
     */
    @Test
    public void testCalculateSuccessRate() {
        int total = 1000;
        int success = 985;
        int failed = 15;
        
        double successRate = messageService.calculateSuccessRate(total, success);
        
        assertEquals(98.5, successRate, 0.1, "成功率计算应正确");
        assertEquals(failed, total - success, "失败数应等于总数减成功数");
    }

    /**
     * 测试首页数据加载异常处理
     */
    @Test
    public void testLoadHomeData_ExceptionHandling() {
        // 测试异常情况下的数据处理
        assertDoesNotThrow(() -> {
            messageService.getMessageStats("invalid", "params");
        }, "异常参数不应导致系统崩溃");
    }

    // ==================== 订阅消息配置测试 (5 个用例) ====================

    /**
     * 测试获取模板列表
     */
    @Test
    public void testGetTemplateList_Success() {
        // 获取模板列表
        List<MessageTemplate> templates = messageService.getTemplateList(null, null, 1, 10);
        
        // 验证结果
        assertNotNull(templates, "模板列表不应为空");
    }

    /**
     * 测试启用/禁用模板
     */
    @Test
    public void testToggleTemplateEnabled_Success() {
        // 先获取一个模板
        List<MessageTemplate> templates = messageService.getTemplateList(null, null, 1, 10);
        
        if (!templates.isEmpty()) {
            Long templateId = templates.get(0).getId();
            Integer originalEnabled = templates.get(0).getEnabled();
            
            // 切换状态
            messageService.toggleTemplateEnabled(templateId);
            
            // 验证状态已切换
            MessageTemplate updated = messageService.getTemplateById(templateId);
            assertNotNull(updated, "更新后的模板不应为空");
            assertNotEquals(originalEnabled, updated.getEnabled(), "模板状态应已切换");
        }
    }

    /**
     * 测试获取模板详情
     */
    @Test
    public void testGetTemplateDetail_Success() {
        // 获取模板列表
        List<MessageTemplate> templates = messageService.getTemplateList(null, null, 1, 10);
        
        if (!templates.isEmpty()) {
            Long templateId = templates.get(0).getId();
            
            // 获取详情
            MessageTemplate detail = messageService.getTemplateById(templateId);
            
            // 验证
            assertNotNull(detail, "模板详情不应为空");
            assertEquals(templateId, detail.getId(), "模板 ID 应匹配");
            assertNotNull(detail.getName(), "模板名称不应为空");
        }
    }

    /**
     * 测试保存模板配置
     */
    @Test
    public void testSaveTemplate_Success() {
        // 准备测试数据
        MessageTemplate template = new MessageTemplate();
        template.setName("测试模板-" + System.currentTimeMillis());
        template.setTemplateId("TEST_TEMPLATE_" + System.currentTimeMillis());
        template.setTrigger("测试触发");
        template.setContent("测试内容");
        template.setEnabled(1);
        
        // 保存模板
        Long templateId = messageService.saveTemplate(template);
        
        // 验证结果
        assertNotNull(templateId, "模板 ID 不应为空");
        assertTrue(templateId > 0, "模板 ID 应大于 0");
        
        // 清理测试数据
        messageService.deleteTemplate(templateId);
    }

    /**
     * 测试刷新模板列表
     */
    @Test
    public void testRefreshTemplateList_Success() {
        // 刷新模板列表
        List<MessageTemplate> templates = messageService.getTemplateList(null, null, 1, 100);
        
        // 验证
        assertNotNull(templates, "刷新后的模板列表不应为空");
    }

    // ==================== 消息记录测试 (5 个用例) ====================

    /**
     * 测试获取消息记录列表
     */
    @Test
    public void testGetMessageRecordList_Success() {
        // 获取消息记录列表
        List<MessageRecord> records = messageService.getMessageRecordList(null, null, null, 1, 10);
        
        // 验证结果
        assertNotNull(records, "消息记录列表不应为空");
    }

    /**
     * 测试按状态筛选消息记录
     */
    @Test
    public void testGetMessageRecordList_ByStatus() {
        // 按成功状态筛选
        List<MessageRecord> successRecords = messageService.getMessageRecordList("success", null, null, 1, 10);
        
        // 验证
        assertNotNull(successRecords, "成功记录列表不应为空");
        
        // 按失败状态筛选
        List<MessageRecord> failedRecords = messageService.getMessageRecordList("failed", null, null, 1, 10);
        
        // 验证
        assertNotNull(failedRecords, "失败记录列表不应为空");
    }

    /**
     * 测试按日期范围筛选消息记录
     */
    @Test
    public void testGetMessageRecordList_ByDateRange() {
        // 按日期范围筛选
        List<MessageRecord> records = messageService.getMessageRecordList(
            null, "2026-04-01", "2026-04-04", 1, 10
        );
        
        // 验证
        assertNotNull(records, "日期范围筛选结果不应为空");
    }

    /**
     * 测试导出消息记录
     */
    @Test
    public void testExportMessageRecords_Success() {
        // 导出消息记录
        String filePath = messageService.exportMessageRecords(null, null, null);
        
        // 验证
        assertNotNull(filePath, "导出文件路径不应为空");
    }

    /**
     * 测试消息记录分页加载
     */
    @Test
    public void testMessageRecordPagination_Success() {
        // 第一页
        List<MessageRecord> page1 = messageService.getMessageRecordList(null, null, null, 1, 10);
        
        // 第二页
        List<MessageRecord> page2 = messageService.getMessageRecordList(null, null, null, 2, 10);
        
        // 验证
        assertNotNull(page1, "第一页数据不应为空");
        assertNotNull(page2, "第二页数据不应为空");
    }

    // ==================== 消息推送服务测试 (5 个用例) ====================

    /**
     * 测试发送订阅消息
     */
    @Test
    public void testSendSubscribeMessage_Success() {
        // 准备测试数据
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";
        String templateId = "ORDER_CREATE";
        
        // 发送订阅消息
        Map<String, Object> result = messageService.sendSubscribeMessage(
            openid, templateId, Map.of("orderNo", "PRO202604040001")
        );
        
        // 验证
        assertNotNull(result, "发送结果不应为空");
        assertTrue(result.containsKey("messageId"), "应包含消息 ID");
    }

    /**
     * 测试发送站内信
     */
    @Test
    public void testSendInternalMessage_Success() {
        // 准备测试数据
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("测试消息-" + System.currentTimeMillis());
        message.setContent("这是一条测试消息");
        message.setType(1);
        
        // 发送站内信
        Long messageId = messageService.sendInternalMessage(message);
        
        // 验证
        assertNotNull(messageId, "消息 ID 不应为空");
        assertTrue(messageId > 0, "消息 ID 应大于 0");
    }

    /**
     * 测试批量发送消息
     */
    @Test
    public void testBatchSendMessage_Success() {
        // 准备测试数据
        List<Map<String, Object>> messages = List.of(
            Map.of("openid", "user_1", "templateId", "TEST_TEMPLATE"),
            Map.of("openid", "user_2", "templateId", "TEST_TEMPLATE"),
            Map.of("openid", "user_3", "templateId", "TEST_TEMPLATE")
        );
        
        // 批量发送
        Map<String, Object> result = messageService.batchSendMessage(messages);
        
        // 验证
        assertNotNull(result, "批量发送结果不应为空");
        assertTrue(result.containsKey("total"), "应包含总数");
        assertTrue(result.containsKey("success"), "应包含成功数");
    }

    /**
     * 测试消息推送失败重试
     */
    @Test
    public void testSendMessageWithRetry_Success() {
        // 准备测试数据
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";
        String templateId = "TEST_TEMPLATE";
        int maxRetries = 3;
        
        // 发送带重试
        Map<String, Object> result = messageService.sendMessageWithRetry(
            openid, templateId, Map.of(), maxRetries
        );
        
        // 验证
        assertNotNull(result, "重试发送结果不应为空");
    }

    /**
     * 测试查询消息推送状态
     */
    @Test
    public void testQueryMessageStatus_Success() {
        // 先发送一条消息
        InternalMessage message = new InternalMessage();
        message.setUserId(1L);
        message.setTitle("状态查询测试");
        message.setContent("测试内容");
        message.setType(1);
        
        Long messageId = messageService.sendInternalMessage(message);
        
        // 查询状态
        Map<String, Object> status = messageService.queryMessageStatus(messageId);
        
        // 验证
        assertNotNull(status, "消息状态不应为空");
        assertTrue(status.containsKey("status"), "应包含状态字段");
        
        // 清理
        messageService.deleteInternalMessage(messageId);
    }
}
