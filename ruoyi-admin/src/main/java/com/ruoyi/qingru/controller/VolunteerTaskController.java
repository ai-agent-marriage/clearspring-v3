package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.VolunteerTask;
import com.ruoyi.qingru.service.VolunteerTaskService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 志愿者任务控制器
 */
@Slf4j
@RestController
@RequestMapping("/volunteer/task")
public class VolunteerTaskController {
    
    @Autowired
    private VolunteerTaskService volunteerTaskService;
    
    /**
     * 分配任务
     * @param orderNo 订单号
     * @param volunteerId 志愿者 ID
     * @return 操作结果
     */
    @PostMapping("/assign")
    public R<Void> assignTask(
            @RequestParam String orderNo,
            @RequestParam Long volunteerId) {
        log.info("分配任务，orderNo={}, volunteerId={}", orderNo, volunteerId);
        try {
            volunteerTaskService.assignTask(orderNo, volunteerId);
            return R.ok(null, "分配成功");
        } catch (Exception e) {
            log.error("分配任务失败", e);
            return R.fail("分配失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取我的任务列表
     * @param volunteerId 志愿者 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 任务列表
     */
    @GetMapping("/my")
    public R<List<VolunteerTask>> getMyTasks(
            @RequestParam Long volunteerId,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取我的任务列表，volunteerId={}, status={}, pageNum={}, pageSize={}", 
                volunteerId, status, pageNum, pageSize);
        List<VolunteerTask> list = volunteerTaskService.getMyTasks(volunteerId, status, pageNum, pageSize);
        return R.ok(list);
    }
}
