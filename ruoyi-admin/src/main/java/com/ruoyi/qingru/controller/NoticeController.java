package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Notice;
import com.ruoyi.qingru.service.NoticeService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 公告管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/content/notice")
public class NoticeController {
    
    @Autowired
    private NoticeService noticeService;
    
    /**
     * 获取公告列表（支持筛选和分页）
     * @param status 状态（1 已发布 2 草稿 3 已下架）
     * @param keyword 关键词
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 公告列表
     */
    @GetMapping("/list")
    public R<List<Notice>> getList(
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取公告列表，status: {}, keyword: {}, pageNum: {}, pageSize: {}", 
                status, keyword, pageNum, pageSize);
        List<Notice> list = noticeService.getNoticeList(status, keyword, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 获取公告详情
     * @param id 公告 ID
     * @return 公告信息
     */
    @GetMapping("/detail/{id}")
    public R<Notice> getDetail(@PathVariable Long id) {
        log.info("获取公告详情，id: {}", id);
        Notice notice = noticeService.getNoticeDetail(id);
        if (notice == null) {
            return R.fail("公告不存在");
        }
        return R.ok(notice);
    }
    
    /**
     * 新增公告
     * @param notice 公告信息
     * @return 操作结果
     */
    @PostMapping("/add")
    public R<Long> add(@RequestBody Notice notice) {
        log.info("新增公告，title: {}", notice.getTitle());
        try {
            Long id = noticeService.addNotice(notice);
            return R.ok(id, "新增成功");
        } catch (Exception e) {
            log.error("新增公告失败", e);
            return R.fail("新增失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新公告
     * @param id 公告 ID
     * @param notice 公告信息
     * @return 操作结果
     */
    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Notice notice) {
        log.info("更新公告，id: {}", id);
        try {
            boolean success = noticeService.updateNotice(id, notice);
            if (success) {
                return R.ok();
            } else {
                return R.fail("公告不存在");
            }
        } catch (Exception e) {
            log.error("更新公告失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除公告
     * @param id 公告 ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public R<Void> delete(@PathVariable Long id) {
        log.info("删除公告，id: {}", id);
        try {
            boolean success = noticeService.deleteNotice(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("公告不存在");
            }
        } catch (Exception e) {
            log.error("删除公告失败", e);
            return R.fail("删除失败：" + e.getMessage());
        }
    }
    
    /**
     * 上架公告
     * @param id 公告 ID
     * @return 操作结果
     */
    @PutMapping("/publish/{id}")
    public R<Void> publish(@PathVariable Long id) {
        log.info("上架公告，id: {}", id);
        try {
            boolean success = noticeService.publishNotice(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("公告不存在");
            }
        } catch (Exception e) {
            log.error("上架公告失败", e);
            return R.fail("上架失败：" + e.getMessage());
        }
    }
    
    /**
     * 下架公告
     * @param id 公告 ID
     * @return 操作结果
     */
    @PutMapping("/unpublish/{id}")
    public R<Void> unpublish(@PathVariable Long id) {
        log.info("下架公告，id: {}", id);
        try {
            boolean success = noticeService.unpublishNotice(id);
            if (success) {
                return R.ok();
            } else {
                return R.fail("公告不存在");
            }
        } catch (Exception e) {
            log.error("下架公告失败", e);
            return R.fail("下架失败：" + e.getMessage());
        }
    }
}
