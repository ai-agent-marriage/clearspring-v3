package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.TaskExecute;
import com.ruoyi.qingru.service.TaskExecuteService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 任务执行结果控制器
 */
@RestController
@RequestMapping("/task/execute")
public class TaskExecuteController {
    private static final Logger log = LoggerFactory.getLogger(TaskExecuteController.class);

    
    @Autowired
    private TaskExecuteService taskExecuteService;
    
    /**
     * 提交执行结果
     * @param execute 执行结果
     * @return 操作结果
     */
    @PostMapping("/submit")
    public R<Void> submit(@RequestBody TaskExecute execute) {
        log.info("提交执行结果，orderNo={}, volunteerId={}", execute.getOrderNo(), execute.getVolunteerId());
        try {
            taskExecuteService.submitExecute(execute);
            return R.ok(null, "提交成功");
        } catch (Exception e) {
            log.error("提交执行结果失败", e);
            return R.fail("提交失败：" + e.getMessage());
        }
    }
    
    /**
     * 审核执行结果
     * @param id 执行记录 ID
     * @param status 审核状态 2 通过 3 驳回
     * @param reason 驳回原因（可选）
     * @return 操作结果
     */
    @PostMapping("/audit/{id}")
    public R<Void> audit(@PathVariable Long id,
                         @RequestParam Integer status,
                         @RequestParam(required = false) String reason) {
        log.info("审核执行结果，id={}, status={}", id, status);
        try {
            taskExecuteService.auditExecute(id, status, reason);
            return R.ok(null, "审核成功");
        } catch (Exception e) {
            log.error("审核执行结果失败", e);
            return R.fail("审核失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取执行记录详情
     * @param id 执行记录 ID
     * @return 执行记录
     */
    @GetMapping("/detail/{id}")
    public R<TaskExecute> getDetail(@PathVariable Long id) {
        log.info("获取执行记录详情，id={}", id);
        try {
            TaskExecute execute = taskExecuteService.getExecuteDetail(id);
            return R.ok(execute, "获取成功");
        } catch (Exception e) {
            log.error("获取执行记录详情失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取志愿者的执行记录列表
     * @param volunteerId 志愿者 ID
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 执行记录列表
     */
    @GetMapping("/list")
    public R<List<TaskExecute>> getList(@RequestParam Long volunteerId,
                                         @RequestParam(required = false) Integer status,
                                         @RequestParam(required = false) Integer pageNum,
                                         @RequestParam(required = false) Integer pageSize) {
        log.info("获取执行记录列表，volunteerId={}, status={}", volunteerId, status);
        try {
            List<TaskExecute> list = taskExecuteService.getExecutesByVolunteerId(
                    volunteerId, status, pageNum, pageSize);
            return R.ok(list, "获取成功");
        } catch (Exception e) {
            log.error("获取执行记录列表失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
