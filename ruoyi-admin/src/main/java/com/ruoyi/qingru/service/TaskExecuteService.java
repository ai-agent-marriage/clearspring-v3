package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.TaskExecute;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.mapper.TaskExecuteMapper;
import com.ruoyi.qingru.mapper.OrderProtectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 任务执行结果服务类
 */
@Service
public class TaskExecuteService {
    private static final Logger log = LoggerFactory.getLogger(TaskExecuteService.class);

    
    @Autowired
    private TaskExecuteMapper taskExecuteMapper;
    
    @Autowired
    private SecurityCheckService securityCheckService;
    
    @Autowired
    private OrderService orderService;
    
    @Autowired
    private VolunteerService volunteerService;
    
    /**
     * 提交执行结果
     * @param execute 执行结果
     */
    @Transactional
    public void submitExecute(TaskExecute execute) {
        log.info("提交执行结果，orderNo={}, volunteerId={}", execute.getOrderNo(), execute.getVolunteerId());
        
        // 内容安全审核（图片）
        if (execute.getImages() != null && !execute.getImages().isEmpty()) {
            String[] images = execute.getImages().split(",");
            for (String image : images) {
                if (!image.trim().isEmpty() && !securityCheckService.checkImage(image.trim())) {
                    throw new RuntimeException("图片包含违规内容");
                }
            }
        }
        
        // 内容安全审核（文本备注）
        if (execute.getRemark() != null && !execute.getRemark().isEmpty()) {
            if (!securityCheckService.checkText(execute.getRemark())) {
                throw new RuntimeException("文本包含违规内容");
            }
        }
        
        // 插入执行记录
        execute.setStatus(1); // 待审核
        execute.setExecuteTime(new Date());
        execute.setCreateTime(new Date());
        
        taskExecuteMapper.insert(execute);
        
        // 更新订单状态为待确认
        orderService.updateOrderStatus(execute.getOrderNo(), 4);
        
        log.info("执行结果提交成功，executeId={}", execute.getId());
    }
    
    /**
     * 审核执行结果
     * @param executeId 执行记录 ID
     * @param status 审核状态 2 通过 3 驳回
     * @param reason 驳回原因（可选）
     */
    @Transactional
    public void auditExecute(Long executeId, Integer status, String reason) {
        log.info("审核执行结果，executeId={}, status={}", executeId, status);
        
        TaskExecute execute = taskExecuteMapper.selectById(executeId);
        if (execute == null) {
            throw new RuntimeException("执行记录不存在");
        }
        
        if (status != 2 && status != 3) {
            throw new RuntimeException("审核状态无效");
        }
        
        execute.setStatus(status);
        execute.setAuditReason(reason);
        
        taskExecuteMapper.update(execute);
        
        // 如果审核通过，更新志愿者统计数据
        if (status == 2) {
            volunteerService.incrementTaskCount(execute.getVolunteerId());
            // 更新订单状态为已完成
            orderService.updateOrderStatus(execute.getOrderNo(), 5);
        } else {
            // 审核驳回，订单状态回退到待执行
            orderService.updateOrderStatus(execute.getOrderNo(), 3);
        }
        
        log.info("执行结果审核完成，executeId={}, status={}, reason={}", executeId, status, reason);
    }
    
    /**
     * 获取执行记录详情
     * @param executeId 执行记录 ID
     * @return 执行记录
     */
    public TaskExecute getExecuteDetail(Long executeId) {
        log.info("获取执行记录详情，executeId={}", executeId);
        TaskExecute execute = taskExecuteMapper.selectById(executeId);
        if (execute == null) {
            throw new RuntimeException("执行记录不存在");
        }
        return execute;
    }
    
    /**
     * 获取志愿者的执行记录列表
     * @param volunteerId 志愿者 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 执行记录列表
     */
    public List<TaskExecute> getExecutesByVolunteerId(Long volunteerId, Integer status,
                                                       Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取志愿者执行记录列表，volunteerId={}, status={}, pageNum={}, pageSize={}", 
                volunteerId, status, pageNum, pageSize);
        return taskExecuteMapper.selectByVolunteerId(volunteerId, status, offset, pageSize);
    }
}
