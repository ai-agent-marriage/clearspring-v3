package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Feedback;
import com.ruoyi.qingru.service.FeedbackService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 用户反馈控制器
 */
@Slf4j
@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    
    @Autowired
    private FeedbackService feedbackService;
    
    /**
     * 提交反馈
     * @param feedback 反馈信息
     * @return 反馈 ID
     */
    @PostMapping("/submit")
    public R<Long> submitFeedback(@RequestBody Feedback feedback) {
        log.info("提交反馈，userId={}, type={}, title={}", 
                feedback.getUserId(), feedback.getType(), feedback.getTitle());
        
        try {
            Long feedbackId = feedbackService.submitFeedback(feedback);
            return R.ok(feedbackId, "反馈提交成功");
        } catch (Exception e) {
            log.error("反馈提交失败", e);
            return R.fail("反馈提交失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取反馈详情
     * @param id 反馈 ID
     * @return 反馈
     */
    @GetMapping("/detail/{id}")
    public R<Feedback> getFeedbackDetail(@PathVariable Long id) {
        log.info("获取反馈详情，id={}", id);
        
        Feedback feedback = feedbackService.getFeedbackDetail(id);
        if (feedback == null) {
            return R.fail("反馈不存在");
        }
        
        return R.ok(feedback);
    }
    
    /**
     * 获取反馈列表（支持筛选）
     * @param type 反馈类型
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 反馈列表
     */
    @GetMapping("/list")
    public R<List<Feedback>> getFeedbackList(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取反馈列表，type={}, status={}, pageNum={}, pageSize={}", 
                type, status, pageNum, pageSize);
        
        List<Feedback> list = feedbackService.getFeedbackList(type, status, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 处理反馈
     * @param id 反馈 ID
     * @param reply 回复内容
     * @return 操作结果
     */
    @PostMapping("/process/{id}")
    public R<Void> processFeedback(@PathVariable Long id, 
                                   @RequestParam String reply) {
        log.info("处理反馈，id={}, reply={}", id, reply);
        
        try {
            feedbackService.processFeedback(id, reply);
            return R.ok("反馈处理成功");
        } catch (Exception e) {
            log.error("反馈处理失败", e);
            return R.fail("反馈处理失败：" + e.getMessage());
        }
    }
    
    /**
     * 删除反馈
     * @param id 反馈 ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public R<Void> deleteFeedback(@PathVariable Long id) {
        log.info("删除反馈，id={}", id);
        
        try {
            feedbackService.deleteFeedback(id);
            return R.ok("反馈删除成功");
        } catch (Exception e) {
            log.error("反馈删除失败", e);
            return R.fail("反馈删除失败：" + e.getMessage());
        }
    }
}
