package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.MessageTemplate;
import com.ruoyi.qingru.entity.TestMessageRequest;
import com.ruoyi.qingru.entity.InternalMessage;
import com.ruoyi.qingru.service.MessageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 消息管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/message")
public class MessageController {

    @Autowired
    private MessageService messageService;

    // ==================== 微信订阅消息模板管理 ====================

    /**
     * 获取模板列表
     * @return 模板列表
     */
    @GetMapping("/template/list")
    public R<List<MessageTemplate>> getTemplateList() {
        log.info("获取消息模板列表");
        List<MessageTemplate> list = messageService.getTemplateList();
        return R.ok(list);
    }

    /**
     * 新增模板
     * @param template 模板信息
     * @return 操作结果
     */
    @PostMapping("/template/add")
    public R<Long> addTemplate(@RequestBody MessageTemplate template) {
        log.info("新增消息模板，name: {}", template.getName());
        try {
            Long id = messageService.addTemplate(template);
            return R.ok(id, "新增成功");
        } catch (Exception e) {
            log.error("新增消息模板失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }

    /**
     * 更新模板
     * @param id 模板 ID
     * @param template 模板信息
     * @return 操作结果
     */
    @PutMapping("/template/update/{id}")
    public R<Void> updateTemplate(@PathVariable Long id, @RequestBody MessageTemplate template) {
        log.info("更新消息模板，id: {}", id);
        try {
            boolean success = messageService.updateTemplate(id, template);
            if (success) {
                return R.ok();
            } else {
                return R.fail("模板不存在");
            }
        } catch (Exception e) {
            log.error("更新消息模板失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }

    /**
     * 删除模板
     * @param id 模板 ID
     * @return 操作结果
     */
    @DeleteMapping("/template/delete/{id}")
    public R<Void> deleteTemplate(@PathVariable Long id) {
        log.info("删除消息模板，id: {}", id);
        try {
            boolean success = messageService.deleteTemplate(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("模板不存在");
            }
        } catch (Exception e) {
            log.error("删除消息模板失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }

    /**
     * 发送测试消息
     * @param request 测试消息请求
     * @return 操作结果
     */
    @PostMapping("/send/test")
    public R<Void> sendTestMessage(@RequestBody TestMessageRequest request) {
        log.info("发送测试消息，openid: {}, templateId: {}", request.getOpenid(), request.getTemplateId());
        try {
            messageService.sendSubscribeMessage(request.getOpenid(), request.getTemplateId(), request.getData());
            return R.ok("发送成功");
        } catch (Exception e) {
            log.error("发送测试消息失败", e);
            return R.fail("发送失败：" + e.getMessage());
        }
    }

    // ==================== 站内信管理 ====================

    /**
     * 获取站内信列表（支持筛选和分页）
     * @param userId 用户 ID
     * @param type 类型（1 订单通知 2 系统通知）
     * @param status 状态（1 未读 2 已读）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 站内信列表
     */
    @GetMapping("/internal/list")
    public R<List<InternalMessage>> getInternalMessageList(
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) Integer type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取站内信列表，userId: {}, type: {}, status: {}, pageNum: {}, pageSize: {}",
                userId, type, status, pageNum, pageSize);
        List<InternalMessage> list = messageService.getInternalMessageList(userId, type, status, pageNum, pageSize);
        return R.ok(list);
    }

    /**
     * 获取站内信详情
     * @param id 消息 ID
     * @return 消息信息
     */
    @GetMapping("/internal/detail/{id}")
    public R<InternalMessage> getInternalMessageDetail(@PathVariable Long id) {
        log.info("获取站内信详情，id: {}", id);
        InternalMessage message = messageService.getInternalMessageDetail(id);
        if (message == null) {
            return R.fail("消息不存在");
        }
        return R.ok(message);
    }

    /**
     * 新增站内信
     * @param message 消息信息
     * @return 操作结果
     */
    @PostMapping("/internal/add")
    public R<Long> addInternalMessage(@RequestBody InternalMessage message) {
        log.info("新增站内信，userId: {}, title: {}", message.getUserId(), message.getTitle());
        try {
            Long id = messageService.addInternalMessage(message);
            return R.ok(id, "新增成功");
        } catch (Exception e) {
            log.error("新增站内信失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }

    /**
     * 标记为已读
     * @param id 消息 ID
     * @return 操作结果
     */
    @PutMapping("/internal/read/{id}")
    public R<Void> markAsRead(@PathVariable Long id) {
        log.info("标记站内信已读，id: {}", id);
        try {
            boolean success = messageService.markAsRead(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("消息不存在");
            }
        } catch (Exception e) {
            log.error("标记站内信已读失败", e);
            return R.fail("标记失败：" + e.getMessage());
        }
    }

    /**
     * 批量标记为已读
     * @param ids 消息 ID 列表
     * @return 操作结果
     */
    @PutMapping("/internal/read/batch")
    public R<Integer> batchMarkAsRead(@RequestBody List<Long> ids) {
        log.info("批量标记站内信已读，ids: {}", ids);
        try {
            int count = messageService.batchMarkAsRead(ids);
            return R.ok(count, "操作成功");
        } catch (Exception e) {
            log.error("批量标记站内信已读失败", e);
            return R.fail("操作失败：" + e.getMessage());
        }
    }

    /**
     * 删除站内信
     * @param id 消息 ID
     * @return 操作结果
     */
    @DeleteMapping("/internal/delete/{id}")
    public R<Void> deleteInternalMessage(@PathVariable Long id) {
        log.info("删除站内信，id: {}", id);
        try {
            boolean success = messageService.deleteInternalMessage(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("消息不存在");
            }
        } catch (Exception e) {
            log.error("删除站内信失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }

    /**
     * 批量删除站内信
     * @param ids 消息 ID 列表
     * @return 操作结果
     */
    @DeleteMapping("/internal/delete/batch")
    public R<Integer> batchDeleteInternalMessage(@RequestBody List<Long> ids) {
        log.info("批量删除站内信，ids: {}", ids);
        try {
            int count = messageService.batchDeleteInternalMessage(ids);
            return R.ok(count, "操作成功");
        } catch (Exception e) {
            log.error("批量删除站内信失败", e);
            return R.fail("操作失败：" + e.getMessage());
        }
    }

    /**
     * 获取未读消息数量
     * @param userId 用户 ID
     * @return 未读数量
     */
    @GetMapping("/internal/unread/count")
    public R<Integer> getUnreadCount(@RequestParam Long userId) {
        log.info("获取未读消息数量，userId: {}", userId);
        int count = messageService.getUnreadCount(userId);
        return R.ok(count);
    }
}
