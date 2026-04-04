package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.ProtectRecord;
import com.ruoyi.qingru.service.ProtectRecordService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 护生记录控制器
 */
@Slf4j
@RestController
@RequestMapping("/protect")
public class ProtectRecordController {
    
    @Autowired
    private ProtectRecordService protectRecordService;
    
    /**
     * 创建护生记录
     * @param record 护生记录
     * @return 创建后的记录
     */
    @PostMapping("/record/add")
    public R<ProtectRecord> addRecord(@RequestBody ProtectRecord record) {
        log.info("创建护生记录，userOpenid={}, speciesId={}", 
                record.getUserOpenid(), record.getSpeciesId());
        try {
            ProtectRecord created = protectRecordService.createRecord(record);
            return R.ok(created, "护生记录创建成功");
        } catch (RuntimeException e) {
            return R.fail(e.getMessage());
        } catch (Exception e) {
            log.error("创建护生记录失败", e);
            return R.fail("创建失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取我的护生记录列表
     * @param openid 用户 openid
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 护生记录列表
     */
    @GetMapping("/record/my")
    public R<List<ProtectRecord>> getMyRecords(
            @RequestParam String openid,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取护生记录列表，openid={}, pageNum={}, pageSize={}", 
                openid, pageNum, pageSize);
        List<ProtectRecord> list = protectRecordService.getMyRecords(openid, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 获取护生记录详情
     * @param id 记录 ID
     * @return 护生记录
     */
    @GetMapping("/record/detail/{id}")
    public R<ProtectRecord> getRecordDetail(@PathVariable Long id) {
        log.info("获取护生记录详情，id={}", id);
        ProtectRecord record = protectRecordService.getById(id);
        if (record == null) {
            return R.fail("记录不存在");
        }
        return R.ok(record);
    }
    
    /**
     * 更新护生记录
     * @param id 记录 ID
     * @param record 护生记录
     * @return 操作结果
     */
    @PutMapping("/record/update/{id}")
    public R<Void> updateRecord(
            @PathVariable Long id,
            @RequestBody ProtectRecord record) {
        log.info("更新护生记录，id={}", id);
        try {
            protectRecordService.updateRecord(id, record);
            return R.ok(null, "更新成功");
        } catch (Exception e) {
            log.error("更新护生记录失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }
}
