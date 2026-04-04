package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrgManage;
import com.ruoyi.qingru.service.OrgManageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 机构管理控制器
 */
@Slf4j
@RestController
@RequestMapping("/org/manage")
public class OrgManageController {
    
    @Autowired
    private OrgManageService orgManageService;
    
    /**
     * 获取机构详情
     * @param id 机构 ID
     * @return 机构信息
     */
    @GetMapping("/detail/{id}")
    public R<OrgManage> getDetail(@PathVariable Long id) {
        log.info("获取机构详情，id={}", id);
        try {
            OrgManage org = orgManageService.getOrgDetail(id);
            return R.ok(org, "获取成功");
        } catch (Exception e) {
            log.error("获取机构详情失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新机构信息
     * @param id 机构 ID
     * @param org 机构信息
     * @return 操作结果
     */
    @PutMapping("/update/{id}")
    public R<Void> update(@PathVariable Long id, @RequestBody OrgManage org) {
        log.info("更新机构信息，id={}", id);
        try {
            orgManageService.updateOrg(id, org);
            return R.ok(null, "更新成功");
        } catch (Exception e) {
            log.error("更新机构信息失败", e);
            return R.fail("更新失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取机构列表
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 机构列表
     */
    @GetMapping("/list")
    public R<List<OrgManage>> getList(@RequestParam(required = false) Integer status,
                                       @RequestParam(required = false) Integer pageNum,
                                       @RequestParam(required = false) Integer pageSize) {
        log.info("获取机构列表，status={}", status);
        try {
            List<OrgManage> list = orgManageService.getOrgList(status, pageNum, pageSize);
            return R.ok(list, "获取成功");
        } catch (Exception e) {
            log.error("获取机构列表失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
}
