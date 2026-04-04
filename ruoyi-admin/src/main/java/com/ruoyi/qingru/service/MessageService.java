package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaSubscribeMessage;
import com.ruoyi.qingru.entity.MessageTemplate;
import lombok.extern.slf4j.Slf4j;
import me.chanjar.weixin.common.error.WxErrorException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 消息服务类
 * 提供微信订阅消息和站内信管理
 */
@Slf4j
@Service
public class MessageService {

    @Autowired(required = false)
    private WxMaService wxMaService;

    // 使用 ConcurrentHashMap 模拟数据库存储 - 消息模板
    private static final Map<Long, MessageTemplate> TEMPLATE_MAP = new ConcurrentHashMap<>();
    private static Long nextTemplateId = 1L;

    // 使用 ConcurrentHashMap 模拟数据库存储 - 站内信
    private static final Map<Long, com.ruoyi.qingru.entity.InternalMessage> MESSAGE_MAP = new ConcurrentHashMap<>();
    private static Long nextMessageId = 1L;

    static {
        // 初始化示例消息模板数据
        Date now = new Date();
        TEMPLATE_MAP.put(1L, new MessageTemplate(1L, "订单创建通知", "order_create", "订单创建时", "您的订单已创建，订单号：{{orderId}}", 1, now));
        TEMPLATE_MAP.put(2L, new MessageTemplate(2L, "订单完成通知", "order_complete", "订单完成时", "您的订单已完成，感谢您的使用！", 1, now));
        TEMPLATE_MAP.put(3L, new MessageTemplate(3L, "系统通知", "system_notice", "系统通知时", "{{content}}", 1, now));
    }

    // ==================== 微信订阅消息模板管理 ====================

    /**
     * 获取模板列表
     * @return 模板列表
     */
    public List<MessageTemplate> getTemplateList() {
        List<MessageTemplate> result = new ArrayList<>(TEMPLATE_MAP.values());
        // 按创建时间倒序排序
        result.sort((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()));
        return result;
    }

    /**
     * 新增模板
     * @param template 模板信息
     * @return 新增的模板 ID
     */
    @Transactional
    public Long addTemplate(MessageTemplate template) {
        Long id = nextTemplateId++;
        template.setId(id);
        template.setCreateTime(new Date());
        if (template.getEnabled() == null) {
            template.setEnabled(1); // 默认为启用
        }
        TEMPLATE_MAP.put(id, template);
        log.info("新增消息模板成功，id: {}, name: {}", id, template.getName());
        return id;
    }

    /**
     * 更新模板
     * @param id 模板 ID
     * @param template 模板信息
     * @return 是否更新成功
     */
    @Transactional
    public boolean updateTemplate(Long id, MessageTemplate template) {
        MessageTemplate existing = TEMPLATE_MAP.get(id);
        if (existing == null) {
            log.warn("更新消息模板失败，模板不存在，id: {}", id);
            return false;
        }
        
        // 更新字段
        if (template.getName() != null) {
            existing.setName(template.getName());
        }
        if (template.getTemplateId() != null) {
            existing.setTemplateId(template.getTemplateId());
        }
        if (template.getTrigger() != null) {
            existing.setTrigger(template.getTrigger());
        }
        if (template.getContent() != null) {
            existing.setContent(template.getContent());
        }
        if (template.getEnabled() != null) {
            existing.setEnabled(template.getEnabled());
        }
        
        log.info("更新消息模板成功，id: {}", id);
        return true;
    }

    /**
     * 删除模板
     * @param id 模板 ID
     * @return 是否删除成功
     */
    @Transactional
    public boolean deleteTemplate(Long id) {
        MessageTemplate removed = TEMPLATE_MAP.remove(id);
        if (removed != null) {
            log.info("删除消息模板成功，id: {}, name: {}", id, removed.getName());
            return true;
        }
        log.warn("删除消息模板失败，模板不存在，id: {}", id);
        return false;
    }

    /**
     * 发送订阅消息
     * @param openid 用户 openid
     * @param templateId 模板 ID
     * @param data 消息数据
     */
    public void sendSubscribeMessage(String openid, String templateId, Map<String, String> data) {
        if (wxMaService == null) {
            log.warn("WxMaService 未配置，跳过发送订阅消息");
            return;
        }

        try {
            // 构建订阅消息
            List<WxMaSubscribeMessage.MsgData> msgDataList = new ArrayList<>();
            if (data != null) {
                for (Map.Entry<String, String> entry : data.entrySet()) {
                    msgDataList.add(new WxMaSubscribeMessage.MsgData(entry.getKey(), entry.getValue()));
                }
            }

            WxMaSubscribeMessage subscribeMessage = WxMaSubscribeMessage.builder()
                    .toUser(openid)
                    .templateId(templateId)
                    .data(msgDataList)
                    .build();

            // 发送消息
            wxMaService.getSubscribeService().sendSubscribeMessage(subscribeMessage);
            log.info("发送订阅消息成功，openid: {}, templateId: {}", openid, templateId);
        } catch (WxErrorException e) {
            log.error("发送订阅消息失败，openid: {}, templateId: {}, error: {}", openid, templateId, e.getMessage(), e);
            throw new RuntimeException("发送订阅消息失败：" + e.getMessage(), e);
        }
    }

    // ==================== 站内信管理 ====================

    /**
     * 获取站内信列表（支持筛选和分页）
     * @param userId 用户 ID（可选）
     * @param type 类型（可选）
     * @param status 状态（可选）
     * @param pageNum 页码（可选）
     * @param pageSize 每页数量（可选）
     * @return 站内信列表
     */
    public List<com.ruoyi.qingru.entity.InternalMessage> getInternalMessageList(Long userId, Integer type, Integer status, Integer pageNum, Integer pageSize) {
        List<com.ruoyi.qingru.entity.InternalMessage> result = new ArrayList<>(MESSAGE_MAP.values());
        
        // 按用户 ID 筛选
        if (userId != null && userId > 0) {
            result = result.stream()
                .filter(m -> m.getUserId().equals(userId))
                .collect(Collectors.toList());
        }
        
        // 按类型筛选
        if (type != null && type > 0) {
            result = result.stream()
                .filter(m -> m.getType().equals(type))
                .collect(Collectors.toList());
        }
        
        // 按状态筛选
        if (status != null && status > 0) {
            result = result.stream()
                .filter(m -> m.getStatus().equals(status))
                .collect(Collectors.toList());
        }
        
        // 按创建时间倒序排序
        result.sort((a, b) -> b.getCreateTime().compareTo(a.getCreateTime()));
        
        // 分页
        if (pageNum != null && pageNum > 0 && pageSize != null && pageSize > 0) {
            int fromIndex = (pageNum - 1) * pageSize;
            int toIndex = Math.min(fromIndex + pageSize, result.size());
            if (fromIndex < result.size()) {
                result = result.subList(fromIndex, toIndex);
            } else {
                result = new ArrayList<>();
            }
        }
        
        return result;
    }

    /**
     * 获取站内信详情
     * @param id 消息 ID
     * @return 消息对象
     */
    public com.ruoyi.qingru.entity.InternalMessage getInternalMessageDetail(Long id) {
        return MESSAGE_MAP.get(id);
    }

    /**
     * 新增站内信
     * @param message 消息信息
     * @return 新增的消息 ID
     */
    @Transactional
    public Long addInternalMessage(com.ruoyi.qingru.entity.InternalMessage message) {
        Long id = nextMessageId++;
        message.setId(id);
        message.setCreateTime(new Date());
        if (message.getStatus() == null) {
            message.setStatus(1); // 默认为未读
        }
        MESSAGE_MAP.put(id, message);
        log.info("新增站内信成功，id: {}, userId: {}, title: {}", id, message.getUserId(), message.getTitle());
        return id;
    }

    /**
     * 标记为已读
     * @param id 消息 ID
     * @return 是否操作成功
     */
    @Transactional
    public boolean markAsRead(Long id) {
        com.ruoyi.qingru.entity.InternalMessage message = MESSAGE_MAP.get(id);
        if (message == null) {
            log.warn("标记站内信已读失败，消息不存在，id: {}", id);
            return false;
        }
        message.setStatus(2);
        log.info("标记站内信已读成功，id: {}", id);
        return true;
    }

    /**
     * 批量标记为已读
     * @param ids 消息 ID 列表
     * @return 成功数量
     */
    @Transactional
    public int batchMarkAsRead(List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            if (markAsRead(id)) {
                count++;
            }
        }
        log.info("批量标记站内信已读成功，成功数量：{}", count);
        return count;
    }

    /**
     * 删除站内信
     * @param id 消息 ID
     * @return 是否删除成功
     */
    @Transactional
    public boolean deleteInternalMessage(Long id) {
        com.ruoyi.qingru.entity.InternalMessage removed = MESSAGE_MAP.remove(id);
        if (removed != null) {
            log.info("删除站内信成功，id: {}, title: {}", id, removed.getTitle());
            return true;
        }
        log.warn("删除站内信失败，消息不存在，id: {}", id);
        return false;
    }

    /**
     * 批量删除站内信
     * @param ids 消息 ID 列表
     * @return 成功数量
     */
    @Transactional
    public int batchDeleteInternalMessage(List<Long> ids) {
        int count = 0;
        for (Long id : ids) {
            if (deleteInternalMessage(id)) {
                count++;
            }
        }
        log.info("批量删除站内信成功，成功数量：{}", count);
        return count;
    }

    /**
     * 获取未读消息数量
     * @param userId 用户 ID
     * @return 未读数量
     */
    public int getUnreadCount(Long userId) {
        return (int) MESSAGE_MAP.values().stream()
            .filter(m -> m.getUserId().equals(userId) && m.getStatus() == 1)
            .count();
    }
}
