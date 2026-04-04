package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.OrgDashboard;
import com.ruoyi.qingru.entity.OrgTodo;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 机构管理服务测试
 */
@SpringBootTest
public class OrgManageServiceTest {
    
    @Autowired
    private OrgManageService orgManageService;
    
    @Test
    public void testGetOrgDashboard() {
        // 测试获取机构工作台数据
        OrgDashboard dashboard = orgManageService.getOrgDashboard(1L);
        
        assertNotNull(dashboard);
        assertNotNull(dashboard.getPendingOrders());
        assertNotNull(dashboard.getTodayTasks());
        assertNotNull(dashboard.getPendingConfirm());
        assertNotNull(dashboard.getCompletedOrders());
        assertNotNull(dashboard.getTodos());
    }
    
    @Test
    public void testGenerateInviteCode() {
        // 测试生成邀请码
        String inviteCode = orgManageService.generateInviteCode(1L);
        
        assertNotNull(inviteCode);
        assertTrue(inviteCode.startsWith("INV"));
        assertTrue(inviteCode.length() > 10);
    }
    
    @Test
    public void testGetOrgTodos() {
        // 测试获取待办事项（通过工作台数据间接测试）
        OrgDashboard dashboard = orgManageService.getOrgDashboard(1L);
        List<OrgTodo> todos = dashboard.getTodos();
        
        assertNotNull(todos);
        // 待办事项可能为空（如果没有待办）
    }
    
    @Test
    public void testOrgDashboardNotNull() {
        // 测试工作台数据不为空
        OrgDashboard dashboard = orgManageService.getOrgDashboard(1L);
        
        assertNotNull(dashboard, "工作台数据不应为空");
    }
}
