package com.ruoyi.qingru.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockHttpServletResponse;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 报表导出控制器测试
 */
@SpringBootTest
public class ExportControllerTest {
    
    @Autowired
    private ExportController exportController;
    
    @Test
    public void testExportOrders() throws Exception {
        // 测试导出订单报表
        MockHttpServletResponse response = new MockHttpServletResponse();
        
        exportController.exportOrders(1L, "2026-04-01", "2026-04-30", response);
        
        assertEquals(200, response.getStatus());
        assertNotNull(response.getContentAsByteArray());
        assertTrue(response.getContentAsByteArray().length > 0);
        assertEquals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                response.getContentType());
    }
    
    @Test
    public void testExportWithNullParams() throws Exception {
        // 测试空参数导出
        MockHttpServletResponse response = new MockHttpServletResponse();
        
        exportController.exportOrders(null, null, null, response);
        
        assertEquals(200, response.getStatus());
        assertNotNull(response.getContentAsByteArray());
    }
}
