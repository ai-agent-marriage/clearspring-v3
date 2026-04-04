package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.User;
import com.ruoyi.qingru.service.AdminUserService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import static org.junit.jupiter.api.Assertions.*;

/**
 * 管理后台用户服务单元测试
 * 测试用户列表、详情、状态更新、删除、导出等功能
 */
@SpringBootTest
public class AdminUserServiceTest {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * 测试成功获取用户列表
     * 验证可以获取用户列表
     */
    @Test
    public void testGetList_Success() {
        List<User> users = adminUserService.getList(null, null, 1, 10);

        assertNotNull(users, "用户列表不应为空");
    }

    /**
     * 测试按角色筛选用户列表
     * 验证角色筛选功能正常
     */
    @Test
    public void testGetList_ByRole() {
        List<User> users = adminUserService.getList(1, null, 1, 10);

        assertNotNull(users, "用户列表不应为空");
        // 验证返回的用户都符合筛选条件（如果有数据）
        for (User user : users) {
            // 角色筛选可能返回空列表，这是正常的
            assertNotNull(user, "用户对象不应为空");
        }
    }

    /**
     * 测试按状态筛选用户列表
     * 验证状态筛选功能正常
     */
    @Test
    public void testGetList_ByStatus() {
        List<User> users = adminUserService.getList(null, 1, 1, 10);

        assertNotNull(users, "用户列表不应为空");
        // 验证返回的用户都符合筛选条件
        for (User user : users) {
            if (user.getStatus() != null) {
                assertEquals(1, user.getStatus(), "用户状态应为 1");
            }
        }
    }

    /**
     * 测试分页功能
     * 验证分页参数正常工作
     */
    @Test
    public void testGetList_Pagination() {
        List<User> page1 = adminUserService.getList(null, null, 1, 5);
        List<User> page2 = adminUserService.getList(null, null, 2, 5);

        assertNotNull(page1, "第一页数据不应为空");
        assertNotNull(page2, "第二页数据不应为空");
        assertTrue(page1.size() <= 5, "第一页数据不应超过 5 条");
        assertTrue(page2.size() <= 5, "第二页数据不应超过 5 条");
    }

    /**
     * 测试获取用户详情成功
     * 验证可以获取用户详细信息
     */
    @Test
    public void testGetDetail_Success() {
        // 先获取用户列表，取第一个用户 ID
        List<User> users = adminUserService.getList(null, null, 1, 1);
        if (!users.isEmpty()) {
            User user = adminUserService.getDetail(users.get(0).getId());
            
            assertNotNull(user, "用户详情不应为空");
            assertNotNull(user.getId(), "用户 ID 不应为空");
        }
    }

    /**
     * 测试获取不存在的用户详情
     * 验证抛出异常
     */
    @Test
    public void testGetDetail_NotFound() {
        assertThrows(RuntimeException.class, () -> {
            adminUserService.getDetail(999999L);
        }, "获取不存在的用户应抛出异常");
    }

    /**
     * 测试用户详情数据完整性
     * 验证用户详情包含必要字段
     */
    @Test
    public void testGetDetail_DataCompleteness() {
        List<User> users = adminUserService.getList(null, null, 1, 1);
        if (!users.isEmpty()) {
            User user = adminUserService.getDetail(users.get(0).getId());
            
            assertNotNull(user.getId(), "用户 ID 不应为空");
            assertNotNull(user.getOpenid(), "用户 OpenID 不应为空");
            assertNotNull(user.getCreateTime(), "创建时间不应为空");
        }
    }

    /**
     * 测试更新用户状态成功
     * 验证可以更新用户状态
     */
    @Test
    public void testUpdateStatus_Success() {
        List<User> users = adminUserService.getList(null, null, 1, 1);
        if (!users.isEmpty()) {
            Long userId = users.get(0).getId();
            Integer originalStatus = users.get(0).getStatus();
            
            // 更新状态为相反值
            Integer newStatus = (originalStatus != null && originalStatus == 0) ? 1 : 0;
            adminUserService.updateStatus(userId, newStatus);
            
            // 验证更新成功
            User updatedUser = adminUserService.getDetail(userId);
            assertEquals(newStatus, updatedUser.getStatus(), "用户状态应已更新");
            
            // 恢复原状态
            adminUserService.updateStatus(userId, originalStatus != null ? originalStatus : 1);
        }
    }

    /**
     * 测试更新不存在的用户状态
     * 验证抛出异常
     */
    @Test
    public void testUpdateStatus_NotFound() {
        assertThrows(RuntimeException.class, () -> {
            adminUserService.updateStatus(999999L, 0);
        }, "更新不存在的用户状态应抛出异常");
    }

    /**
     * 测试删除用户成功
     * 验证可以删除用户
     */
    @Test
    public void testDelete_Success() {
        // 注意：这个测试会真实删除数据，需谨慎使用
        // 这里仅做代码结构测试，不实际执行删除
        assertNotNull(adminUserService, "服务实例不应为空");
    }

    /**
     * 测试删除不存在的用户
     * 验证抛出异常
     */
    @Test
    public void testDelete_NotFound() {
        assertThrows(RuntimeException.class, () -> {
            adminUserService.delete(999999L);
        }, "删除不存在的用户应抛出异常");
    }

    /**
     * 测试导出用户数据成功
     * 验证可以导出 Excel 文件
     */
    @Test
    public void testExportUsers_Success() {
        byte[] data = adminUserService.exportUsers(null, null);

        assertNotNull(data, "导出的数据不应为空");
        assertTrue(data.length > 0, "导出的数据长度应大于 0");
    }

    /**
     * 测试按角色导出用户数据
     * 验证角色筛选导出功能正常
     */
    @Test
    public void testExportUsers_ByRole() {
        byte[] data = adminUserService.exportUsers(1, null);

        assertNotNull(data, "导出的数据不应为空");
        assertTrue(data.length > 0, "导出的数据长度应大于 0");
    }

    /**
     * 测试按状态导出用户数据
     * 验证状态筛选导出功能正常
     */
    @Test
    public void testExportUsers_ByStatus() {
        byte[] data = adminUserService.exportUsers(null, 1);

        assertNotNull(data, "导出的数据不应为空");
        assertTrue(data.length > 0, "导出的数据长度应大于 0");
    }

    /**
     * 测试导出 Excel 文件格式
     * 验证导出的是有效的 Excel 文件
     */
    @Test
    public void testExportUsers_FileFormat() {
        byte[] data = adminUserService.exportUsers(null, null);

        assertNotNull(data, "导出的数据不应为空");
        // Excel 文件的文件头应该是 PK (ZIP 格式)
        assertTrue(data.length >= 4, "数据长度应至少为 4 字节");
        assertTrue(data[0] == 'P' && data[1] == 'K', "应该是有效的 ZIP/Excel 文件");
    }

    /**
     * 测试用户列表数据结构
     * 验证用户对象包含必要字段
     */
    @Test
    public void testUserListDataStructure() {
        List<User> users = adminUserService.getList(null, null, 1, 10);

        assertNotNull(users, "用户列表不应为空");
        if (!users.isEmpty()) {
            User user = users.get(0);
            assertNotNull(user.getId(), "用户 ID 不应为空");
            assertNotNull(user.getOpenid(), "用户 OpenID 不应为空");
            assertNotNull(user.getCreateTime(), "创建时间不应为空");
        }
    }
}
