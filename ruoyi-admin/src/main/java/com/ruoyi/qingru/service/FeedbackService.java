package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Feedback;
import com.ruoyi.qingru.mapper.FeedbackMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 用户反馈服务类
 */
@Service
public class FeedbackService {
    private static final Logger log = LoggerFactory.getLogger(FeedbackService.class);

    
    @Autowired
    private FeedbackMapper feedbackMapper;
    
    /**
     * 提交反馈
     * @param feedback 反馈信息
     * @return 反馈 ID
     */
    @Transactional
    public Long submitFeedback(Feedback feedback) {
        log.info("提交反馈，userId={}, type={}, title={}", 
                feedback.getUserId(), feedback.getType(), feedback.getTitle());
        
        // 设置默认状态为待处理
        if (feedback.getStatus() == null) {
            feedback.setStatus(1);
        }
        
        feedbackMapper.insert(feedback);
        log.info("反馈提交成功，id={}", feedback.getId());
        
        return feedback.getId();
    }
    
    /**
     * 获取反馈详情
     * @param id 反馈 ID
     * @return 反馈
     */
    public Feedback getFeedbackDetail(Long id) {
        log.info("获取反馈详情，id={}", id);
        return feedbackMapper.selectById(id);
    }
    
    /**
     * 获取反馈列表（支持筛选）
     * @param type 反馈类型
     * @param status 状态
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 反馈列表
     */
    public List<Feedback> getFeedbackList(String type, Integer status, 
                                          Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取反馈列表，type={}, status={}, pageNum={}, pageSize={}", 
                type, status, pageNum, pageSize);
        
        return feedbackMapper.selectByCondition(type, status, offset, pageSize);
    }
    
    /**
     * 处理反馈
     * @param id 反馈 ID
     * @param reply 回复内容
     */
    @Transactional
    public void processFeedback(Long id, String reply) {
        log.info("处理反馈，id={}, reply={}", id, reply);
        
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            throw new RuntimeException("反馈不存在");
        }
        
        feedback.setReply(reply);
        feedback.setStatus(2); // 设置为已处理
        
        feedbackMapper.update(feedback);
        log.info("反馈处理成功，id={}", id);
    }
    
    /**
     * 删除反馈
     * @param id 反馈 ID
     */
    @Transactional
    public void deleteFeedback(Long id) {
        log.info("删除反馈，id={}", id);
        
        Feedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            throw new RuntimeException("反馈不存在");
        }
        
        feedbackMapper.deleteById(id);
        log.info("反馈删除成功，id={}", id);
    }
}
