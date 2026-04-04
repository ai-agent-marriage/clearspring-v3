package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Backup;
import com.ruoyi.qingru.entity.Setting;
import com.ruoyi.qingru.entity.SystemLog;
import com.ruoyi.qingru.service.AdminSettingsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

/**
 * 后台系统设置控制器
 */
@RestController
@RequestMapping("/api/admin/settings")
@Slf4j
public class AdminSettingsController {
    
    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(AdminSettingsController.class);
    
    @Autowired
    private AdminSettingsService adminSettingsService;
    
    /**
     * 获取系统设置列表
     * @return 系统设置列表
     */
    @GetMapping("/list")
    public R<List<Setting>> getSettings() {
        log.info("获取系统设置列表");
        try {
            List<Setting> settings = adminSettingsService.getSettings();
            return R.ok(settings, "获取系统设置列表成功");
        } catch (Exception e) {
            log.error("获取系统设置列表失败", e);
            return R.fail("获取系统设置列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 更新系统设置
     * @param key 设置键
     * @param value 设置值
     * @return 操作结果
     */
    @PutMapping("/update/{key}")
    public R<Void> updateSetting(@PathVariable String key, @RequestParam String value) {
        log.info("更新系统设置，key={}, value={}", key, value);
        try {
            adminSettingsService.updateSetting(key, value);
            return R.ok("更新系统设置成功");
        } catch (Exception e) {
            log.error("更新系统设置失败", e);
            return R.fail("更新系统设置失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取备份列表
     * @return 备份列表
     */
    @GetMapping("/backup")
    public R<List<Backup>> getBackups() {
        log.info("获取备份列表");
        try {
            List<Backup> backups = adminSettingsService.getBackups();
            return R.ok(backups, "获取备份列表成功");
        } catch (Exception e) {
            log.error("获取备份列表失败", e);
            return R.fail("获取备份列表失败：" + e.getMessage());
        }
    }
    
    /**
     * 创建备份
     * @return 备份信息
     */
    @PostMapping("/backup")
    public R<Backup> createBackup() {
        log.info("创建备份");
        try {
            Backup backup = adminSettingsService.createBackup();
            return R.ok(backup, "创建备份成功");
        } catch (Exception e) {
            log.error("创建备份失败", e);
            return R.fail("创建备份失败：" + e.getMessage());
        }
    }
    
    /**
     * 获取系统日志
     * @param level 日志级别
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 系统日志列表
     */
    @GetMapping("/logs")
    public R<List<SystemLog>> getLogs(
            @RequestParam(required = false) Integer level,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "20") Integer pageSize) {
        log.info("获取系统日志，level={}, pageNum={}, pageSize={}", level, pageNum, pageSize);
        try {
            List<SystemLog> logs = adminSettingsService.getLogs(level, pageNum, pageSize);
            return R.ok(logs, "获取系统日志成功");
        } catch (Exception e) {
            log.error("获取系统日志失败", e);
            return R.fail("获取系统日志失败：" + e.getMessage());
        }
    }
    
    /**
     * 清除缓存
     * @return 操作结果
     */
    @PostMapping("/clear")
    public R<Void> clearCache() {
        log.info("清除缓存");
        try {
            adminSettingsService.clearCache();
            return R.ok("清除缓存成功");
        } catch (Exception e) {
            log.error("清除缓存失败", e);
            return R.fail("清除缓存失败：" + e.getMessage());
        }
    }
}
