package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.VolunteerTask;
import com.ruoyi.qingru.entity.Volunteer;
import com.ruoyi.qingru.mapper.VolunteerTaskMapper;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Date;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 志愿者任务服务类
 */
@Service
public class VolunteerTaskService {
    private static final Logger log = LoggerFactory.getLogger(VolunteerTaskService.class);

    
    @Autowired
    private VolunteerTaskMapper volunteerTaskMapper;
    
    @Autowired
    private VolunteerMapper volunteerMapper;
    
    /**
     * 分配任务给志愿者
     * @param orderNo 订单号
     * @param volunteerId 志愿者 ID
     */
    @Transactional
    public void assignTask(String orderNo, Long volunteerId) {
        log.info("分配任务给志愿者，orderNo={}, volunteerId={}", orderNo, volunteerId);
        
        // 验证志愿者是否绑定机构
        Volunteer volunteer = volunteerMapper.selectById(volunteerId);
        if (volunteer == null) {
            throw new RuntimeException("志愿者不存在");
        }
        if (volunteer.getOrgId() == null) {
            throw new RuntimeException("志愿者未绑定机构");
        }
        
        // 创建任务记录
        VolunteerTask task = new VolunteerTask();
        task.setOrderNo(orderNo);
        task.setVolunteerId(volunteerId);
        task.setStatus(1); // 待执行
        task.setAssignTime(new Date());
        
        volunteerTaskMapper.insert(task);
        log.info("任务分配成功，orderNo={}, volunteerId={}", orderNo, volunteerId);
    }
    
    /**
     * 获取志愿者的任务列表
     * @param volunteerId 志愿者 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 任务列表
     */
    public List<VolunteerTask> getMyTasks(Long volunteerId, Integer status, 
                                           Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取志愿者任务列表，volunteerId={}, status={}, pageNum={}, pageSize={}", 
                volunteerId, status, pageNum, pageSize);
        return volunteerTaskMapper.selectByVolunteerId(volunteerId, status, offset, pageSize);
    }
    
    /**
     * 更新任务状态
     * @param orderNo 订单号
     * @param status 新状态
     */
    @Transactional
    public void updateTaskStatus(String orderNo, Integer status) {
        log.info("更新任务状态，orderNo={}, status={}", orderNo, status);
        
        VolunteerTask task = volunteerTaskMapper.selectByOrderNo(orderNo);
        if (task == null) {
            throw new RuntimeException("任务不存在");
        }
        
        task.setStatus(status);
        volunteerTaskMapper.update(task);
        
        log.info("任务状态更新成功，orderNo={}, status={}", orderNo, status);
    }
}
