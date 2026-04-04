package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Backup;
import com.ruoyi.qingru.entity.Setting;
import com.ruoyi.qingru.entity.SystemLog;
import java.util.List;

/**
 * 后台系统设置服务接口
 */
public interface AdminSettingsService {
    
    /**
     * 获取系统设置列表
     * @return 系统设置列表
     */
    List<Setting> getSettings();
    
    /**
     * 更新系统设置
     * @param key 设置键
     * @param value 设置值
     */
    void updateSetting(String key, String value);
    
    /**
     * 获取备份列表
     * @return 备份列表
     */
    List<Backup> getBackups();
    
    /**
     * 创建备份
     * @return 备份信息
     */
    Backup createBackup();
    
    /**
     * 获取系统日志
     * @param level 日志级别
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 系统日志列表
     */
    List<SystemLog> getLogs(Integer level, Integer pageNum, Integer pageSize);
    
    /**
     * 清除缓存
     */
    void clearCache();
}
