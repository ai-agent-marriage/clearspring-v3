package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Volunteer;
import com.ruoyi.qingru.mapper.VolunteerMapper;
import com.ruoyi.qingru.mapper.TaskExecuteMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Date;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 志愿者服务类
 */
@Service
public class VolunteerService {
    private static final Logger log = LoggerFactory.getLogger(VolunteerService.class);

    
    @Autowired
    private VolunteerMapper volunteerMapper;
    
    @Autowired
    private TaskExecuteMapper taskExecuteMapper;
    
    /**
     * 获取志愿者详情
     * @param volunteerId 志愿者 ID
     * @return 志愿者信息
     */
    public Volunteer getVolunteerDetail(Long volunteerId) {
        log.info("获取志愿者详情，volunteerId={}", volunteerId);
        
        Volunteer volunteer = volunteerMapper.selectById(volunteerId);
        if (volunteer == null) {
            throw new RuntimeException("志愿者不存在");
        }
        
        // 统计数据
        int totalTasks = taskExecuteMapper.countByVolunteerId(volunteerId);
        int serviceHours = taskExecuteMapper.sumServiceHours(volunteerId);
        BigDecimal complianceRate = calculateComplianceRate(volunteerId);
        
        volunteer.setTotalTasks(totalTasks);
        volunteer.setServiceHours(serviceHours);
        volunteer.setComplianceRate(complianceRate);
        
        log.info("获取志愿者详情成功，volunteerId={}, totalTasks={}, serviceHours={}, complianceRate={}", 
                volunteerId, totalTasks, serviceHours, complianceRate);
        
        return volunteer;
    }
    
    /**
     * 更新志愿者信息
     * @param volunteerId 志愿者 ID
     * @param volunteer 志愿者信息
     */
    @Transactional
    public void updateVolunteer(Long volunteerId, Volunteer volunteer) {
        log.info("更新志愿者信息，volunteerId={}", volunteerId);
        
        Volunteer existing = volunteerMapper.selectById(volunteerId);
        if (existing == null) {
            throw new RuntimeException("志愿者不存在");
        }
        
        // 更新允许修改的字段
        if (volunteer.getRealName() != null) {
            existing.setRealName(volunteer.getRealName());
        }
        if (volunteer.getPhone() != null) {
            existing.setPhone(volunteer.getPhone());
        }
        if (volunteer.getStatus() != null) {
            existing.setStatus(volunteer.getStatus());
        }
        
        volunteerMapper.update(existing);
        log.info("志愿者信息更新成功，volunteerId={}", volunteerId);
    }
    
    /**
     * 计算合规执行率
     * @param volunteerId 志愿者 ID
     * @return 合规执行率（百分比）
     */
    private BigDecimal calculateComplianceRate(Long volunteerId) {
        int totalTasks = taskExecuteMapper.countByVolunteerId(volunteerId);
        int compliantTasks = taskExecuteMapper.countCompliantTasks(volunteerId);
        
        if (totalTasks == 0) {
            return BigDecimal.ZERO;
        }
        
        return new BigDecimal(compliantTasks)
                .divide(new BigDecimal(totalTasks), 2, RoundingMode.HALF_UP)
                .multiply(new BigDecimal("100"));
    }
    
    /**
     * 增加志愿者任务计数
     * @param volunteerId 志愿者 ID
     */
    @Transactional
    public void incrementTaskCount(Long volunteerId) {
        log.info("增加志愿者任务计数，volunteerId={}", volunteerId);
        // 实际项目中可能需要更新志愿者表中的统计字段
        // 这里通过统计数据实时计算，无需单独维护
    }
}
