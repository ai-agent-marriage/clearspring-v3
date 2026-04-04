package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrgDashboard;
import com.ruoyi.qingru.entity.OrgManage;
import com.ruoyi.qingru.service.OrgManageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 机构管理控制器
 */
@RestController
@RequestMapping("/org/manage")
public class OrgManageController {
    private static final Logger log = LoggerFactory.getLogger(OrgManageController.class);

    
    @Autowired
    private OrgManageService orgManageService;
    
    /**
     * 获取机构工作台数据
     * @param orgId 机构 ID
     * @return 工作台数据
     */
    @GetMapping("/dashboard")
    public R<OrgDashboard> getDashboard(@RequestParam Long orgId) {
        log.info("获取机构工作台数据，orgId={}", orgId);
        try {
            OrgDashboard dashboard = orgManageService.getOrgDashboard(orgId);
            return R.ok(dashboard, "获取成功");
        } catch (Exception e) {
            log.error("获取机构工作台数据失败", e);
            return R.fail("获取失败：" + e.getMessage());
        }
    }
    
    /**
     * 生成志愿者邀请码
     * @param orgId 机构 ID
     * @return 邀请码
     */
    @PostMapping("/invite-code")
    public R<String> generateInviteCode(@RequestParam Long orgId) {
        log.info("生成志愿者邀请码，orgId={}", orgId);
        try {
            String inviteCode = orgManageService.generateInviteCode(orgId);
            return R.ok(inviteCode, "生成成功");
        } catch (Exception e) {
            log.error("生成志愿者邀请码失败", e);
            return R.fail("生成失败：" + e.getMessage());
        }
    }
    
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
