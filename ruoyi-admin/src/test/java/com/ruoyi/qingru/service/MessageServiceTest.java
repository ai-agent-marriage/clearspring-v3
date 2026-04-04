package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.MessageTemplate;
import com.ruoyi.qingru.entity.InternalMessage;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 消息服务测试
 */
@SpringBootTest
class MessageServiceTest {

    @Autowired
    private MessageService messageService;

    // ==================== 微信订阅消息模板测试 ====================

    @Test
    void testGetTemplateList() {
        List<MessageTemplate> list = messageService.getTemplateList();
        assertNotNull(list);
        assertTrue(list.size() > 0);
    }

    @Test
    void testAddTemplate() {
        MessageTemplate newTemplate = new MessageTemplate();
        newTemplate.setName("测试模板");
        newTemplate.setTemplateId("test_template");
        newTemplate.setTrigger("测试触发");
        newTemplate.setContent("测试内容");
        newTemplate.setEnabled(1);

        Long id = messageService.addTemplate(newTemplate);
        assertNotNull(id);

        List<MessageTemplate> list = messageService.getTemplateList();
        assertTrue(list.stream().anyMatch(t -> t.getId().equals(id)));
    }

    @Test
    void testUpdateTemplate() {
        MessageTemplate newTemplate = new MessageTemplate();
        newTemplate.setName("更新测试模板");
        newTemplate.setTemplateId("update_template");
        newTemplate.setEnabled(1);
        Long id = messageService.addTemplate(newTemplate);

        MessageTemplate updateData = new MessageTemplate();
        updateData.setName("已更新模板名称");
        boolean success = messageService.updateTemplate(id, updateData);

        assertTrue(success);
        List<MessageTemplate> list = messageService.getTemplateList();
        MessageTemplate updated = list.stream().filter(t -> t.getId().equals(id)).findFirst().orElse(null);
        assertNotNull(updated);
        assertEquals("已更新模板名称", updated.getName());
    }

    @Test
    void testDeleteTemplate() {
        MessageTemplate newTemplate = new MessageTemplate();
        newTemplate.setName("删除测试模板");
        newTemplate.setTemplateId("delete_template");
        newTemplate.setEnabled(1);
        Long id = messageService.addTemplate(newTemplate);

        boolean success = messageService.deleteTemplate(id);
        assertTrue(success);

        List<MessageTemplate> list = messageService.getTemplateList();
        assertFalse(list.stream().anyMatch(t -> t.getId().equals(id)));
    }

    @Test
    void testSendSubscribeMessage() {
        // 测试发送订阅消息（由于 WxMaService 可能未配置，这里仅验证方法调用不抛异常）
        Map<String, String> data = new HashMap<>();
        data.put("orderId", "TEST_001");
        
        assertDoesNotThrow(() -> {
            messageService.sendSubscribeMessage("test_openid", "test_template", data);
        });
    }

    // ==================== 站内信测试 ====================

    @Test
    void testGetInternalMessageList_NoFilter() {
        List<InternalMessage> list = messageService.getInternalMessageList(null, null, null, null, null);
        assertNotNull(list);
    }

    @Test
    void testGetInternalMessageList_ByUserId() {
        // 先添加一条测试消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(999L);
        testMessage.setTitle("测试消息");
        testMessage.setContent("测试内容");
        testMessage.setType(1);
        testMessage.setStatus(1);
        Long id = messageService.addInternalMessage(testMessage);

        List<InternalMessage> list = messageService.getInternalMessageList(999L, null, null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().anyMatch(m -> m.getId().equals(id)));

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testGetInternalMessageList_ByType() {
        List<InternalMessage> list = messageService.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(m -> m.getType() == 1 || list.isEmpty()));
    }

    @Test
    void testGetInternalMessageList_ByStatus() {
        List<InternalMessage> list = messageService.getInternalMessageList(null, null, 1, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(m -> m.getStatus() == 1 || list.isEmpty()));
    }

    @Test
    void testGetInternalMessageList_WithPagination() {
        List<InternalMessage> list = messageService.getInternalMessageList(null, null, null, 1, 5);
        assertNotNull(list);
        assertTrue(list.size() <= 5);
    }

    @Test
    void testGetInternalMessageDetail() {
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(1L);
        testMessage.setTitle("详情测试");
        testMessage.setContent("测试内容");
        Long id = messageService.addInternalMessage(testMessage);

        InternalMessage message = messageService.getInternalMessageDetail(id);
        assertNotNull(message);
        assertEquals(id, message.getId());

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testAddInternalMessage() {
        InternalMessage newMessage = new InternalMessage();
        newMessage.setUserId(1L);
        newMessage.setTitle("新增测试");
        newMessage.setContent("测试内容");
        newMessage.setType(1);
        newMessage.setStatus(1);

        Long id = messageService.addInternalMessage(newMessage);
        assertNotNull(id);

        InternalMessage saved = messageService.getInternalMessageDetail(id);
        assertNotNull(saved);
        assertEquals("新增测试", saved.getTitle());

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testMarkAsRead() {
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(1L);
        testMessage.setTitle("已读测试");
        testMessage.setContent("测试内容");
        testMessage.setStatus(1); // 未读
        Long id = messageService.addInternalMessage(testMessage);

        boolean success = messageService.markAsRead(id);
        assertTrue(success);

        InternalMessage message = messageService.getInternalMessageDetail(id);
        assertEquals(2, message.getStatus());

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testBatchMarkAsRead() {
        // 创建多条测试消息
        Long id1 = messageService.addInternalMessage(createTestMessage(1L, "测试 1"));
        Long id2 = messageService.addInternalMessage(createTestMessage(1L, "测试 2"));
        Long id3 = messageService.addInternalMessage(createTestMessage(1L, "测试 3"));

        List<Long> ids = List.of(id1, id2, id3);
        int count = messageService.batchMarkAsRead(ids);
        assertEquals(3, count);

        // 清理
        messageService.deleteInternalMessage(id1);
        messageService.deleteInternalMessage(id2);
        messageService.deleteInternalMessage(id3);
    }

    @Test
    void testDeleteInternalMessage() {
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(1L);
        testMessage.setTitle("删除测试");
        testMessage.setContent("测试内容");
        Long id = messageService.addInternalMessage(testMessage);

        boolean success = messageService.deleteInternalMessage(id);
        assertTrue(success);

        InternalMessage deleted = messageService.getInternalMessageDetail(id);
        assertNull(deleted);
    }

    @Test
    void testBatchDeleteInternalMessage() {
        // 创建多条测试消息
        Long id1 = messageService.addInternalMessage(createTestMessage(1L, "批量删除 1"));
        Long id2 = messageService.addInternalMessage(createTestMessage(1L, "批量删除 2"));
        Long id3 = messageService.addInternalMessage(createTestMessage(1L, "批量删除 3"));

        List<Long> ids = List.of(id1, id2, id3);
        int count = messageService.batchDeleteInternalMessage(ids);
        assertEquals(3, count);
    }

    @Test
    void testGetUnreadCount() {
        // 创建一条未读消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(888L);
        testMessage.setTitle("未读计数测试");
        testMessage.setContent("测试内容");
        testMessage.setStatus(1); // 未读
        Long id = messageService.addInternalMessage(testMessage);

        int count = messageService.getUnreadCount(888L);
        assertTrue(count >= 1);

        // 清理
        messageService.deleteInternalMessage(id);
    }

    // 辅助方法：创建测试消息
    private InternalMessage createTestMessage(Long userId, String title) {
        InternalMessage message = new InternalMessage();
        message.setUserId(userId);
        message.setTitle(title);
        message.setContent("测试内容");
        message.setType(1);
        message.setStatus(1);
        return message;
    }
}
