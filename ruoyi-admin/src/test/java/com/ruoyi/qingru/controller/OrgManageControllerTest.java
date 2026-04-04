package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrgDashboard;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 机构管理控制器测试
 */
@SpringBootTest
public class OrgManageControllerTest {
    
    @Autowired
    private OrgManageController orgManageController;
    
    @Test
    public void testGetDashboard() {
        // 测试获取工作台数据
        R<OrgDashboard> result = orgManageController.getDashboard(1L);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
    
    @Test
    public void testGenerateInviteCode() {
        // 测试生成邀请码
        R<String> result = orgManageController.generateInviteCode(1L);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertTrue(result.getData().startsWith("INV"));
    }
    
    @Test
    public void testDashboardDataStructure() {
        // 测试工作台数据结构
        R<OrgDashboard> result = orgManageController.getDashboard(1L);
        
        OrgDashboard dashboard = result.getData();
        assertNotNull(dashboard.getPendingOrders());
        assertNotNull(dashboard.getTodayTasks());
        assertNotNull(dashboard.getPendingConfirm());
        assertNotNull(dashboard.getCompletedOrders());
        assertNotNull(dashboard.getTodos());
    }
    
    @Test
    public void testInviteCodeFormat() {
        // 测试邀请码格式
        R<String> result = orgManageController.generateInviteCode(1L);
        
        String inviteCode = result.getData();
        assertTrue(inviteCode.length() > 10, "邀请码长度应大于 10");
        assertTrue(inviteCode.matches("INV\\d+"), "邀请码应以 INV 开头后跟数字");
    }
}
