package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.HelpDoc;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 帮助文档服务类
 * 提供帮助文档管理
 */
@Service
public class HelpDocService {
    private static final Logger log = LoggerFactory.getLogger(HelpDocService.class);


    // 使用 ConcurrentHashMap 模拟数据库存储
    private static final Map<Long, HelpDoc> HELP_DOC_MAP = new ConcurrentHashMap<>();
    private static Long nextId = 1L;

    static {
        // 初始化示例数据
        Date now = new Date();
        HELP_DOC_MAP.put(1L, new HelpDoc(1L, "新手入门指南", "欢迎使用本系统，本文档将帮助您快速上手...", "入门", 1, 100, now));
        HELP_DOC_MAP.put(2L, new HelpDoc(2L, "物种投放流程", "投放物种前请阅读本指南，了解相关注意事项...", "操作指南", 2, 85, now));
        HELP_DOC_MAP.put(3L, new HelpDoc(3L, "常见问题解答", "汇总了用户常见的问题及解决方案...", "FAQ", 3, 120, now));
    }

    /**
     * 获取帮助文档列表（支持筛选和分页）
     * @param category 分类（可选）
     * @param keyword 关键词（可选）
     * @param pageNum 页码（可选）
     * @param pageSize 每页数量（可选）
     * @return 帮助文档列表
     */
    public List<HelpDoc> getHelpDocList(String category, String keyword, Integer pageNum, Integer pageSize) {
        List<HelpDoc> result = new ArrayList<>(HELP_DOC_MAP.values());
        
        // 按分类筛选
        if (category != null && !category.trim().isEmpty()) {
            String cat = category.trim();
            result = result.stream()
                .filter(d -> d.getCategory() != null && d.getCategory().equals(cat))
                .collect(Collectors.toList());
        }
        
        // 按关键词搜索
        if (keyword != null && !keyword.trim().isEmpty()) {
            String kw = keyword.trim();
            result = result.stream()
                .filter(d -> d.getTitle().contains(kw) || d.getContent().contains(kw))
                .collect(Collectors.toList());
        }
        
        // 按 sort 排序
        result.sort(Comparator.comparing(HelpDoc::getSort));
        
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
     * 获取帮助文档详情（增加浏览次数）
     * @param id 文档 ID
     * @return 帮助文档对象
     */
    public HelpDoc getHelpDocDetail(Long id) {
        HelpDoc doc = HELP_DOC_MAP.get(id);
        if (doc != null) {
            // 增加浏览次数
            doc.setViewCount(doc.getViewCount() + 1);
        }
        return doc;
    }

    /**
     * 新增帮助文档
     * @param helpDoc 帮助文档信息
     * @return 新增的文档 ID
     */
    @Transactional
    public Long addHelpDoc(HelpDoc helpDoc) {
        Long id = nextId++;
        helpDoc.setId(id);
        helpDoc.setCreateTime(new Date());
        if (helpDoc.getSort() == null) {
            helpDoc.setSort(id.intValue());
        }
        if (helpDoc.getViewCount() == null) {
            helpDoc.setViewCount(0);
        }
        HELP_DOC_MAP.put(id, helpDoc);
        log.info("新增帮助文档成功，id: {}, title: {}", id, helpDoc.getTitle());
        return id;
    }

    /**
     * 更新帮助文档
     * @param id 文档 ID
     * @param helpDoc 帮助文档信息
     * @return 是否更新成功
     */
    @Transactional
    public boolean updateHelpDoc(Long id, HelpDoc helpDoc) {
        HelpDoc existing = HELP_DOC_MAP.get(id);
        if (existing == null) {
            log.warn("更新帮助文档失败，文档不存在，id: {}", id);
            return false;
        }
        
        // 更新字段
        if (helpDoc.getTitle() != null) {
            existing.setTitle(helpDoc.getTitle());
        }
        if (helpDoc.getContent() != null) {
            existing.setContent(helpDoc.getContent());
        }
        if (helpDoc.getCategory() != null) {
            existing.setCategory(helpDoc.getCategory());
        }
        if (helpDoc.getSort() != null) {
            existing.setSort(helpDoc.getSort());
        }
        
        log.info("更新帮助文档成功，id: {}", id);
        return true;
    }

    /**
     * 删除帮助文档
     * @param id 文档 ID
     * @return 是否删除成功
     */
    @Transactional
    public boolean deleteHelpDoc(Long id) {
        HelpDoc removed = HELP_DOC_MAP.remove(id);
        if (removed != null) {
            log.info("删除帮助文档成功，id: {}, title: {}", id, removed.getTitle());
            return true;
        }
        log.warn("删除帮助文档失败，文档不存在，id: {}", id);
        return false;
    }

    /**
     * 获取所有分类
     * @return 分类列表
     */
    public List<String> getCategories() {
        return HELP_DOC_MAP.values().stream()
            .map(HelpDoc::getCategory)
            .filter(Objects::nonNull)
            .distinct()
            .collect(Collectors.toList());
    }
}
