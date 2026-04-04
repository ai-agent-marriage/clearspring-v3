package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Backup;
import com.ruoyi.qingru.entity.Setting;
import com.ruoyi.qingru.entity.SystemLog;
import com.ruoyi.qingru.service.AdminSettingsService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 后台系统设置服务单元测试
 * 测试系统设置、备份、日志等功能
 */
@SpringBootTest
public class AdminSettingsServiceTest {

    @Autowired
    private AdminSettingsService adminSettingsService;

    /**
     * 测试成功获取系统设置列表
     * 验证可以获取完整的系统设置列表
     */
    @Test
    public void testGetSettings_Success() {
        List<Setting> settings = adminSettingsService.getSettings();

        assertNotNull(settings, "系统设置列表不应为空");
        assertTrue(settings.size() > 0, "系统设置列表应包含至少一条记录");
    }

    /**
     * 测试系统设置列表完整性
     * 验证系统设置包含所有必要字段
     */
    @Test
    public void testSettingsCompleteness() {
        List<Setting> settings = adminSettingsService.getSettings();

        settings.forEach(setting -> {
            assertNotNull(setting.getId(), "设置 ID 不应为空");
            assertNotNull(setting.getKey(), "设置键不应为空");
            assertNotNull(setting.getName(), "设置名称不应为空");
            assertNotNull(setting.getType(), "设置类型不应为空");
            assertNotNull(setting.getValue(), "设置值不应为空");
            assertNotNull(setting.getDescription(), "设置描述不应为空");
            assertNotNull(setting.getGroup(), "分组不应为空");
        });
    }

    /**
     * 测试系统设置分组
     * 验证设置按分组正确分类
     */
    @Test
    public void testSettingsGrouping() {
        List<Setting> settings = adminSettingsService.getSettings();

        // 验证存在不同分组的设置
        boolean hasBasicSettings = settings.stream().anyMatch(s -> "基础设置".equals(s.getGroup()));
        boolean hasUserSettings = settings.stream().anyMatch(s -> "用户设置".equals(s.getGroup()));
        boolean hasOrderSettings = settings.stream().anyMatch(s -> "订单设置".equals(s.getGroup()));

        assertTrue(hasBasicSettings, "应包含基础设置");
        assertTrue(hasUserSettings, "应包含用户设置");
        assertTrue(hasOrderSettings, "应包含订单设置");
    }

    /**
     * 测试系统设置类型
     * 验证设置类型正确
     */
    @Test
    public void testSettingTypes() {
        List<Setting> settings = adminSettingsService.getSettings();

        settings.forEach(setting -> {
            assertNotNull(setting.getType(), "设置类型不应为空");
            assertTrue(setting.getType() >= 1 && setting.getType() <= 4, "设置类型应在 1-4 之间");
        });
    }

    /**
     * 测试更新系统设置
     * 验证可以更新系统设置
     */
    @Test
    public void testUpdateSetting_Success() {
        assertDoesNotThrow(() -> {
            adminSettingsService.updateSetting("site.name", "新平台名称");
        }, "更新系统设置不应抛出异常");
    }

    /**
     * 测试更新系统设置 - 空键
     * 验证空设置键会抛出异常
     */
    @Test
    public void testUpdateSetting_EmptyKey() {
        assertThrows(RuntimeException.class, () -> {
            adminSettingsService.updateSetting("", "值");
        }, "空设置键应抛出异常");
    }

    /**
     * 测试更新系统设置 - 空值
     * 验证空设置值会抛出异常
     */
    @Test
    public void testUpdateSetting_NullValue() {
        assertThrows(RuntimeException.class, () -> {
            adminSettingsService.updateSetting("site.name", null);
        }, "空设置值应抛出异常");
    }

    /**
     * 测试更新系统设置 - 不同键值
     * 验证可以更新不同类型的设置
     */
    @Test
    public void testUpdateSetting_DifferentTypes() {
        assertDoesNotThrow(() -> {
            adminSettingsService.updateSetting("user.register.enabled", "true");
            adminSettingsService.updateSetting("order.auto.cancel.minutes", "30");
            adminSettingsService.updateSetting("site.description", "这是一个测试描述");
        }, "更新不同类型设置不应抛出异常");
    }

    /**
     * 测试获取备份列表
     * 验证可以获取备份列表
     */
    @Test
    public void testGetBackups_Success() {
        List<Backup> backups = adminSettingsService.getBackups();

        assertNotNull(backups, "备份列表不应为空");
        assertTrue(backups.size() > 0, "备份列表应包含至少一条记录");
    }

    /**
     * 测试备份列表完整性
     * 验证备份数据包含所有必要字段
     */
    @Test
    public void testBackupCompleteness() {
        List<Backup> backups = adminSettingsService.getBackups();

        backups.forEach(backup -> {
            assertNotNull(backup.getId(), "备份 ID 不应为空");
            assertNotNull(backup.getName(), "备份名称不应为空");
            assertNotNull(backup.getType(), "备份类型不应为空");
            assertNotNull(backup.getSize(), "备份文件大小不应为空");
            assertNotNull(backup.getFilePath(), "备份文件路径不应为空");
            assertNotNull(backup.getStatus(), "备份状态不应为空");
            assertNotNull(backup.getCreateTime(), "创建时间不应为空");
        });
    }

    /**
     * 测试备份类型
     * 验证备份类型正确
     */
    @Test
    public void testBackupTypes() {
        List<Backup> backups = adminSettingsService.getBackups();

        backups.forEach(backup -> {
            assertNotNull(backup.getType(), "备份类型不应为空");
            assertTrue(backup.getType() >= 1 && backup.getType() <= 3, "备份类型应在 1-3 之间");
        });

        // 验证存在不同类型的备份
        boolean hasDbBackup = backups.stream().anyMatch(b -> b.getType() == 1);
        boolean hasFileBackup = backups.stream().anyMatch(b -> b.getType() == 2);
        boolean hasFullBackup = backups.stream().anyMatch(b -> b.getType() == 3);

        assertTrue(hasDbBackup || hasFileBackup || hasFullBackup, "应包含至少一种类型的备份");
    }

    /**
     * 测试备份状态
     * 验证备份状态正确
     */
    @Test
    public void testBackupStatus() {
        List<Backup> backups = adminSettingsService.getBackups();

        backups.forEach(backup -> {
            assertNotNull(backup.getStatus(), "备份状态不应为空");
            assertTrue(backup.getStatus() >= 0 && backup.getStatus() <= 2, "备份状态应在 0-2 之间");
        });
    }

    /**
     * 测试创建备份
     * 验证可以创建备份
     */
    @Test
    public void testCreateBackup_Success() {
        Backup backup = adminSettingsService.createBackup();

        assertNotNull(backup, "备份对象不应为空");
        assertNotNull(backup.getId(), "备份 ID 不应为空");
        assertNotNull(backup.getName(), "备份名称不应为空");
        assertNotNull(backup.getCreateTime(), "创建时间不应为空");
    }

    /**
     * 测试创建备份 - 备份信息
     * 验证创建的备份信息完整
     */
    @Test
    public void testCreateBackupInfo() {
        Backup backup = adminSettingsService.createBackup();

        assertNotNull(backup.getId(), "备份 ID 不应为空");
        assertNotNull(backup.getName(), "备份名称不应为空");
        assertNotNull(backup.getType(), "备份类型不应为空");
        assertEquals(3, backup.getType(), "手动创建的备份应为全量备份");
        assertNotNull(backup.getFilePath(), "备份文件路径不应为空");
        assertNotNull(backup.getStatus(), "备份状态不应为空");
        assertNotNull(backup.getCreateBy(), "创建人不应为空");
        assertEquals("admin", backup.getCreateBy(), "创建人应为 admin");
    }

    /**
     * 测试获取系统日志
     * 验证可以获取系统日志
     */
    @Test
    public void testGetLogs_Success() {
        List<SystemLog> logs = adminSettingsService.getLogs(null, 1, 20);

        assertNotNull(logs, "系统日志列表不应为空");
        assertTrue(logs.size() > 0, "系统日志列表应包含至少一条记录");
    }

    /**
     * 测试按级别获取系统日志
     * 验证可以按级别筛选日志
     */
    @Test
    public void testGetLogsByLevel() {
        List<SystemLog> logs = adminSettingsService.getLogs(1, 1, 20);

        assertNotNull(logs, "系统日志列表不应为空");
        logs.forEach(log -> {
            assertNotNull(log.getId(), "日志 ID 不应为空");
            assertNotNull(log.getMessage(), "日志内容不应为空");
            assertNotNull(log.getCreateTime(), "创建时间不应为空");
        });
    }

    /**
     * 测试系统日志分页
     * 验证分页功能正常
     */
    @Test
    public void testGetLogsPagination() {
        List<SystemLog> page1 = adminSettingsService.getLogs(null, 1, 20);
        List<SystemLog> page2 = adminSettingsService.getLogs(null, 2, 20);

        assertNotNull(page1, "第一页数据不应为空");
        assertNotNull(page2, "第二页数据不应为空");
        assertEquals(20, page1.size(), "第一页应有 20 条记录");
        assertEquals(20, page2.size(), "第二页应有 20 条记录");
    }

    /**
     * 测试系统日志数据结构
     * 验证日志数据包含所有必要字段
     */
    @Test
    public void testSystemLogStructure() {
        List<SystemLog> logs = adminSettingsService.getLogs(null, 1, 10);

        logs.forEach(log -> {
            assertNotNull(log.getId(), "日志 ID 不应为空");
            assertNotNull(log.getLevel(), "日志级别不应为空");
            assertNotNull(log.getSource(), "日志来源不应为空");
            assertNotNull(log.getMessage(), "日志内容不应为空");
            assertNotNull(log.getIp(), "请求 IP 不应为空");
            assertNotNull(log.getUrl(), "请求 URL 不应为空");
            assertNotNull(log.getMethod(), "请求方法不应为空");
            assertNotNull(log.getCreateTime(), "创建时间不应为空");
        });
    }

    /**
     * 测试系统日志级别
     * 验证日志级别正确
     */
    @Test
    public void testSystemLogLevels() {
        List<SystemLog> logs = adminSettingsService.getLogs(null, 1, 50);

        logs.forEach(log -> {
            assertNotNull(log.getLevel(), "日志级别不应为空");
            assertTrue(log.getLevel() >= 1 && log.getLevel() <= 5, "日志级别应在 1-5 之间");
        });
    }

    /**
     * 测试清除缓存
     * 验证可以清除缓存
     */
    @Test
    public void testClearCache_Success() {
        assertDoesNotThrow(() -> {
            adminSettingsService.clearCache();
        }, "清除缓存不应抛出异常");
    }

    /**
     * 测试清除缓存 - 多次调用
     * 验证可以多次清除缓存
     */
    @Test
    public void testClearCache_MultipleTimes() {
        assertDoesNotThrow(() -> {
            adminSettingsService.clearCache();
            adminSettingsService.clearCache();
            adminSettingsService.clearCache();
        }, "多次清除缓存不应抛出异常");
    }

    /**
     * 测试系统日志来源
     * 验证日志来源多样性
     */
    @Test
    public void testSystemLogSources() {
        List<SystemLog> logs = adminSettingsService.getLogs(null, 1, 50);

        // 验证存在不同来源的日志
        long uniqueSources = logs.stream()
            .map(SystemLog::getSource)
            .distinct()
            .count();

        assertTrue(uniqueSources >= 3, "应包含至少 3 种不同来源的日志");
    }

    /**
     * 测试系统日志请求方法
     * 验证请求方法正确
     */
    @Test
    public void testSystemLogMethods() {
        List<SystemLog> logs = adminSettingsService.getLogs(null, 1, 50);

        logs.forEach(log -> {
            assertNotNull(log.getMethod(), "请求方法不应为空");
            assertTrue("GET".equals(log.getMethod()) || "POST".equals(log.getMethod()), 
                "请求方法应为 GET 或 POST");
        });
    }

    /**
     * 测试系统日志执行时长
     * 验证执行时长合理
     */
    @Test
    public void testSystemLogDuration() {
        List<SystemLog> logs = adminSettingsService.getLogs(null, 1, 50);

        logs.forEach(log -> {
            assertNotNull(log.getDuration(), "执行时长不应为空");
            assertTrue(log.getDuration() >= 0, "执行时长应为非负数");
        });
    }

    /**
     * 测试系统设置可编辑性
     * 验证可编辑标志正确
     */
    @Test
    public void testSettingEditable() {
        List<Setting> settings = adminSettingsService.getSettings();

        settings.forEach(setting -> {
            assertNotNull(setting.getEditable(), "可编辑标志不应为空");
            assertTrue(setting.getEditable() == 0 || setting.getEditable() == 1, 
                "可编辑标志应为 0 或 1");
        });
    }

    /**
     * 测试系统设置排序
     * 验证排序字段存在
     */
    @Test
    public void testSettingSort() {
        List<Setting> settings = adminSettingsService.getSettings();

        settings.forEach(setting -> {
            assertNotNull(setting.getSort(), "排序字段不应为空");
            assertTrue(setting.getSort() >= 0, "排序应为非负数");
        });
    }

    /**
     * 测试备份文件大小
     * 验证备份文件大小合理
     */
    @Test
    public void testBackupSize() {
        List<Backup> backups = adminSettingsService.getBackups();

        backups.forEach(backup -> {
            assertNotNull(backup.getSize(), "备份文件大小不应为空");
            assertTrue(backup.getSize() >= 0, "备份文件大小应为非负数");
        });
    }

    /**
     * 测试备份时间范围
     * 验证备份时间在合理范围内
     */
    @Test
    public void testBackupTimeRange() {
        List<Backup> backups = adminSettingsService.getBackups();

        backups.forEach(backup -> {
            assertNotNull(backup.getStartTime(), "备份开始时间不应为空");
            assertNotNull(backup.getCreateTime(), "备份创建时间不应为空");
            // 验证结束时间在开始时间之后 (如果已完成)
            if (backup.getStatus() == 1 && backup.getEndTime() != null) {
                assertTrue(!backup.getEndTime().isBefore(backup.getStartTime()), 
                    "备份结束时间应在开始时间之后");
            }
        });
    }
}
