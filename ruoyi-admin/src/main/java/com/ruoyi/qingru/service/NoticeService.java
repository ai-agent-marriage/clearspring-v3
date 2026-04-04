package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Notice;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

/**
 * 公告服务类
 * 提供公告信息管理
 */
@Slf4j
@Service
public class NoticeService {

    // 使用 ConcurrentHashMap 模拟数据库存储
    private static final Map<Long, Notice> NOTICE_MAP = new ConcurrentHashMap<>();
    private static Long nextId = 1L;

    static {
        // 初始化示例数据
        Date now = new Date();
        NOTICE_MAP.put(1L, new Notice(1L, "系统维护通知", "系统将于本周六凌晨 2:00-4:00 进行维护，请提前保存数据。", 1, now, now));
        NOTICE_MAP.put(2L, new Notice(2L, "新功能上线", "新增物种管理功能，支持物种信息的增删改查。", 1, now, now));
        NOTICE_MAP.put(3L, new Notice(3L, "版本更新公告", "V2.0 版本已上线，优化了用户体验。", 2, null, now));
    }

    /**
     * 获取公告列表（支持筛选和分页）
     * @param status 状态（可选）
     * @param keyword 关键词（可选）
     * @param pageNum 页码（可选）
     * @param pageSize 每页数量（可选）
     * @return 公告列表
     */
    public List<Notice> getNoticeList(Integer status, String keyword, Integer pageNum, Integer pageSize) {
        List<Notice> result = new ArrayList<>(NOTICE_MAP.values());
        
        // 按状态筛选
        if (status != null && status > 0) {
            result = result.stream()
                .filter(n -> n.getStatus().equals(status))
                .collect(Collectors.toList());
        }
        
        // 按关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            result = result.stream()
                .filter(n -> n.getTitle().contains(kw) || n.getContent().contains(kw))
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
     * 获取公告详情
     * @param id 公告 ID
     * @return 公告对象
     */
    public Notice getNoticeDetail(Long id) {
        return NOTICE_MAP.get(id);
    }

    /**
     * 新增公告
     * @param notice 公告信息
     * @return 新增的公告 ID
     */
    @Transactional
    public Long addNotice(Notice notice) {
        Long id = nextId++;
        notice.setId(id);
        notice.setCreateTime(new Date());
        if (notice.getStatus() == null) {
            notice.setStatus(2); // 默认为草稿
        }
        if (notice.getStatus() == 1 && notice.getPublishTime() == null) {
            notice.setPublishTime(new Date());
        }
        NOTICE_MAP.put(id, notice);
        log.info("新增公告成功，id: {}, title: {}", id, notice.getTitle());
        return id;
    }

    /**
     * 更新公告
     * @param id 公告 ID
     * @param notice 公告信息
     * @return 是否更新成功
     */
    @Transactional
    public boolean updateNotice(Long id, Notice notice) {
        Notice existing = NOTICE_MAP.get(id);
        if (existing == null) {
            log.warn("更新公告失败，公告不存在，id: {}", id);
            return false;
        }
        
        // 更新字段
        if (notice.getTitle() != null) {
            existing.setTitle(notice.getTitle());
        }
        if (notice.getContent() != null) {
            existing.setContent(notice.getContent());
        }
        if (notice.getStatus() != null) {
            existing.setStatus(notice.getStatus());
            // 如果状态变为已发布，设置发布时间
            if (notice.getStatus() == 1 && existing.getPublishTime() == null) {
                existing.setPublishTime(new Date());
            }
        }
        
        log.info("更新公告成功，id: {}", id);
        return true;
    }

    /**
     * 删除公告
     * @param id 公告 ID
     * @return 是否删除成功
     */
    @Transactional
    public boolean deleteNotice(Long id) {
        Notice removed = NOTICE_MAP.remove(id);
        if (removed != null) {
            log.info("删除公告成功，id: {}, title: {}", id, removed.getTitle());
            return true;
        }
        log.warn("删除公告失败，公告不存在，id: {}", id);
        return false;
    }

    /**
     * 上架公告
     * @param id 公告 ID
     * @return 是否操作成功
     */
    @Transactional
    public boolean publishNotice(Long id) {
        Notice notice = NOTICE_MAP.get(id);
        if (notice == null) {
            log.warn("上架公告失败，公告不存在，id: {}", id);
            return false;
        }
        notice.setStatus(1);
        notice.setPublishTime(new Date());
        log.info("上架公告成功，id: {}", id);
        return true;
    }

    /**
     * 下架公告
     * @param id 公告 ID
     * @return 是否操作成功
     */
    @Transactional
    public boolean unpublishNotice(Long id) {
        Notice notice = NOTICE_MAP.get(id);
        if (notice == null) {
            log.warn("下架公告失败，公告不存在，id: {}", id);
            return false;
        }
        notice.setStatus(3);
        log.info("下架公告成功，id: {}", id);
        return true;
    }
}
