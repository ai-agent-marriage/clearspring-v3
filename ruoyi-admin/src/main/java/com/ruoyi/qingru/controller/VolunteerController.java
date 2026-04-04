package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Volunteer;
import com.ruoyi.qingru.service.VolunteerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 志愿者控制器
 */
@Slf4j
@RestController
@RequestMapping("/volunteer")
public class VolunteerController {
    
    @Autowired
    private VolunteerService volunteerService;
    
    /**
     * 获取志愿者详情
     * @param id 志愿者 ID
     * @return 志愿者信息
     */
    @GetMapping("/detail/{id}")
    public R<Volunteer> getDetail(@PathVariable Long id) {
        log.info("获取志愿者详情，id={}", id);
        try {
            Volunteer volunteer = volunteerService.getVolunteerDetail(id);
            return R.ok(volunteer, "获取成功");
        } catch (Exception e) {
            log.error("获取志愿者详情失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新志愿者信息
     * @param id 志愿者 ID
     * @param volunteer 志愿者信息
     * @return 操作结果
     */
    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody Volunteer volunteer) {
        log.info("更新志愿者信息，id={}", id);
        try {
            volunteerService.updateVolunteer(id, volunteer);
            return R.ok(null, "更新成功");
        } catch (Exception e) {
            log.error("更新志愿者信息失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }
}
