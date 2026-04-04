package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.OrgManage;
import com.ruoyi.qingru.service.OrgManageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 机构管理控制器测试
 */
@ExtendWith(MockitoExtension.class)
class OrgManageControllerTest {
    
    @Mock
    private OrgManageService orgManageService;
    
    @InjectMocks
    private OrgManageController orgManageController;
    
    private OrgManage testOrg;
    
    @BeforeEach
    void setUp() {
        testOrg = new OrgManage();
        testOrg.setId(1L);
        testOrg.setOrgName("测试机构");
        testOrg.setCreditCode("91440300MA5DXXXXX");
        testOrg.setAddress("测试地址");
        testOrg.setContactName("张三");
        testOrg.setContactPhone("13800138000");
        testOrg.setStatus(1);
        testOrg.setTotalOrders(50);
        testOrg.setCreateTime(new Date());
    }
    
    @Test
    void testGetDetail() {
        when(orgManageService.getOrgDetail(1L)).thenReturn(testOrg);
        
        R<OrgManage> result = orgManageController.getDetail(1L);
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals("测试机构", result.getData().getOrgName());
        assertEquals(50, result.getData().getTotalOrders().intValue());
    }
    
    @Test
    void testGetDetail_NotFound() {
        when(orgManageService.getOrgDetail(999L))
            .thenThrow(new RuntimeException("机构不存在"));
        
        R<OrgManage> result = orgManageController.getDetail(999L);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("获取失败"));
    }
    
    @Test
    void testUpdate() {
        doNothing().when(orgManageService).updateOrg(eq(1L), any(OrgManage.class));
        
        R<Void> result = orgManageController.update(1L, testOrg);
        
        assertEquals(200, result.getCode());
        verify(orgManageService, times(1)).updateOrg(eq(1L), any(OrgManage.class));
    }
    
    @Test
    void testUpdate_Failure() {
        doThrow(new RuntimeException("更新失败"))
            .when(orgManageService).updateOrg(eq(1L), any(OrgManage.class));
        
        R<Void> result = orgManageController.update(1L, testOrg);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("更新失败"));
    }
    
    @Test
    void testGetList() {
        List<OrgManage> mockList = new ArrayList<>();
        mockList.add(testOrg);
        when(orgManageService.getOrgList(null, 1, 10)).thenReturn(mockList);
        
        R<List<OrgManage>> result = orgManageController.getList(null, 1, 10);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetList_ByStatus() {
        List<OrgManage> mockList = new ArrayList<>();
        mockList.add(testOrg);
        when(orgManageService.getOrgList(1, 1, 10)).thenReturn(mockList);
        
        R<List<OrgManage>> result = orgManageController.getList(1, 1, 10);
        
        assertEquals(200, result.getCode());
        verify(orgManageService, times(1)).getOrgList(1, 1, 10);
    }
}
