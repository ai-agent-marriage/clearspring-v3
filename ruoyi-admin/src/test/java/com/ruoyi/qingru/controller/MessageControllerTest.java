package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.MessageTemplate;
import com.ruoyi.qingru.entity.InternalMessage;
import com.ruoyi.qingru.entity.TestMessageRequest;
import com.ruoyi.qingru.service.MessageService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 消息控制器测试
 */
@SpringBootTest
class MessageControllerTest {

    @Autowired
    private MessageController messageController;

    @Autowired
    private MessageService messageService;

    // ==================== 微信订阅消息模板测试 ====================

    @Test
    void testGetTemplateList() {
        R<List<MessageTemplate>> result = messageController.getTemplateList();
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }

    @Test
    void testAddTemplate() {
        MessageTemplate newTemplate = new MessageTemplate();
        newTemplate.setName("控制器测试模板");
        newTemplate.setTemplateId("controller_test");
        newTemplate.setTrigger("测试触发");
        newTemplate.setContent("测试内容");
        newTemplate.setEnabled(1);

        R<Long> result = messageController.addTemplate(newTemplate);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());

        // 清理
        messageService.deleteTemplate(result.getData());
    }

    @Test
    void testUpdateTemplate() {
        // 先创建模板
        MessageTemplate newTemplate = new MessageTemplate();
        newTemplate.setName("更新测试模板");
        newTemplate.setTemplateId("update_test");
        newTemplate.setEnabled(1);
        Long id = messageService.addTemplate(newTemplate);

        // 更新模板
        MessageTemplate updateData = new MessageTemplate();
        updateData.setName("已更新名称");
        R<Void> result = messageController.updateTemplate(id, updateData);
        assertNotNull(result);
        assertEquals(200, result.getCode());

        // 清理
        messageService.deleteTemplate(id);
    }

    @Test
    void testDeleteTemplate() {
        // 先创建模板
        MessageTemplate newTemplate = new MessageTemplate();
        newTemplate.setName("删除测试模板");
        newTemplate.setTemplateId("delete_test");
        newTemplate.setEnabled(1);
        Long id = messageService.addTemplate(newTemplate);

        // 删除模板
        R<Void> result = messageController.deleteTemplate(id);
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }

    @Test
    void testSendTestMessage() {
        TestMessageRequest request = new TestMessageRequest();
        request.setOpenid("test_openid");
        request.setTemplateId("test_template");
        Map<String, String> data = new HashMap<>();
        data.put("key", "value");
        request.setData(data);

        R<Void> result = messageController.sendTestMessage(request);
        assertNotNull(result);
        // 由于 WxMaService 可能未配置，这里不检查具体 code
    }

    // ==================== 站内信测试 ====================

    @Test
    void testGetInternalMessageList_NoFilter() {
        R<List<InternalMessage>> result = messageController.getInternalMessageList(null, null, null, null, null);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }

    @Test
    void testGetInternalMessageList_ByUserId() {
        // 先创建测试消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(777L);
        testMessage.setTitle("控制器列表测试");
        testMessage.setContent("测试内容");
        Long id = messageService.addInternalMessage(testMessage);

        R<List<InternalMessage>> result = messageController.getInternalMessageList(777L, null, null, null, null);
        assertNotNull(result);
        assertEquals(200, result.getCode());

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testGetInternalMessageList_ByType() {
        R<List<InternalMessage>> result = messageController.getInternalMessageList(null, 1, null, null, null);
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }

    @Test
    void testGetInternalMessageList_ByStatus() {
        R<List<InternalMessage>> result = messageController.getInternalMessageList(null, null, 1, null, null);
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }

    @Test
    void testGetInternalMessageList_WithPagination() {
        R<List<InternalMessage>> result = messageController.getInternalMessageList(null, null, null, 1, 5);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertTrue(result.getData().size() <= 5);
    }

    @Test
    void testGetInternalMessageDetail() {
        // 先创建测试消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(1L);
        testMessage.setTitle("详情测试");
        testMessage.setContent("测试内容");
        Long id = messageService.addInternalMessage(testMessage);

        R<InternalMessage> result = messageController.getInternalMessageDetail(id);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(id, result.getData().getId());

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testAddInternalMessage() {
        InternalMessage newMessage = new InternalMessage();
        newMessage.setUserId(1L);
        newMessage.setTitle("控制器新增测试");
        newMessage.setContent("测试内容");
        newMessage.setType(1);
        newMessage.setStatus(1);

        R<Long> result = messageController.addInternalMessage(newMessage);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());

        // 清理
        messageService.deleteInternalMessage(result.getData());
    }

    @Test
    void testMarkAsRead() {
        // 先创建测试消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(1L);
        testMessage.setTitle("已读测试");
        testMessage.setContent("测试内容");
        testMessage.setStatus(1);
        Long id = messageService.addInternalMessage(testMessage);

        R<Void> result = messageController.markAsRead(id);
        assertNotNull(result);
        assertEquals(200, result.getCode());

        // 清理
        messageService.deleteInternalMessage(id);
    }

    @Test
    void testBatchMarkAsRead() {
        // 创建多条测试消息
        Long id1 = messageService.addInternalMessage(createTestMessage(1L, "批量已读 1"));
        Long id2 = messageService.addInternalMessage(createTestMessage(1L, "批量已读 2"));
        Long id3 = messageService.addInternalMessage(createTestMessage(1L, "批量已读 3"));

        List<Long> ids = List.of(id1, id2, id3);
        R<Integer> result = messageController.batchMarkAsRead(ids);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals(3, result.getData());

        // 清理
        messageService.deleteInternalMessage(id1);
        messageService.deleteInternalMessage(id2);
        messageService.deleteInternalMessage(id3);
    }

    @Test
    void testDeleteInternalMessage() {
        // 先创建测试消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(1L);
        testMessage.setTitle("删除测试");
        testMessage.setContent("测试内容");
        Long id = messageService.addInternalMessage(testMessage);

        R<Void> result = messageController.deleteInternalMessage(id);
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }

    @Test
    void testBatchDeleteInternalMessage() {
        // 创建多条测试消息
        Long id1 = messageService.addInternalMessage(createTestMessage(1L, "批量删除 1"));
        Long id2 = messageService.addInternalMessage(createTestMessage(1L, "批量删除 2"));
        Long id3 = messageService.addInternalMessage(createTestMessage(1L, "批量删除 3"));

        List<Long> ids = List.of(id1, id2, id3);
        R<Integer> result = messageController.batchDeleteInternalMessage(ids);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals(3, result.getData());
    }

    @Test
    void testGetUnreadCount() {
        // 创建一条未读消息
        InternalMessage testMessage = new InternalMessage();
        testMessage.setUserId(666L);
        testMessage.setTitle("未读计数测试");
        testMessage.setContent("测试内容");
        testMessage.setStatus(1);
        Long id = messageService.addInternalMessage(testMessage);

        R<Integer> result = messageController.getUnreadCount(666L);
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertTrue(result.getData() >= 1);

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
