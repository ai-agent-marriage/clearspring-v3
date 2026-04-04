package com.ruoyi.qingru;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.transaction.Transactional;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.startsWith;

/**
 * 集成测试 - 使用真实数据库测试完整业务流程
 * 测试覆盖率目标：85%+
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class IntegrationTest {
    
    @Autowired
    private MockMvc mockMvc;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    /**
     * 测试机构工作台数据获取（真实数据库）
     * 验证机构能够正确获取待处理订单和今日任务统计
     */
    @Test
    public void testGetOrgDashboard_RealData() throws Exception {
        mockMvc.perform(get("/api/org/manage/dashboard")
                .param("orgId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.pendingOrders").exists())
                .andExpect(jsonPath("$.data.todayTasks").exists());
    }
    
    /**
     * 测试志愿者邀请码生成（真实数据库）
     * 验证机构能够为志愿者生成唯一邀请码
     */
    @Test
    public void testGenerateInviteCode_RealData() throws Exception {
        mockMvc.perform(post("/api/org/manage/invite-code")
                .param("orgId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data").value(startsWith("VOL")));
    }
    
    /**
     * 测试机构统计数据获取（真实数据库）
     * 验证机构能够获取正确的订单和金额统计
     */
    @Test
    public void testGetOrgStatistics_RealData() throws Exception {
        mockMvc.perform(get("/api/statistics/org")
                .param("orgId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andExpect(jsonPath("$.data.totalOrders").exists())
                .andExpect(jsonPath("$.data.totalAmount").exists());
    }
    
    /**
     * 测试订单报表导出（真实数据库）
     * 验证机构能够导出 Excel 格式的订单报表
     */
    @Test
    public void testExportOrderReport_RealData() throws Exception {
        mockMvc.perform(get("/api/export/orders")
                .param("orgId", "1")
                .param("startDate", "2026-04-01")
                .param("endDate", "2026-04-07"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", 
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
    }
    
    /**
     * 测试完整订单流程（真实数据库）
     * 端到端测试：创建订单 → 机构承接 → 分配志愿者 → 提交执行结果
     */
    @Test
    public void testFullOrderFlow_RealData() throws Exception {
        // 1. 创建订单
        String orderJson = objectMapper.writeValueAsString(Map.of(
            "userId", 1,
            "speciesId", 1,
            "quantity", 10,
            "amount", 299.00,
            "address", "珠江广州段",
            "executeDate", "2026-04-15"
        ));
        
        MvcResult result = mockMvc.perform(post("/api/order/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(orderJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200))
                .andReturn();
        
        String orderNo = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("data").get("orderNo").asText();
        
        // 2. 机构承接订单
        mockMvc.perform(post("/api/org/order/accept/" + orderNo)
                .param("orgId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
        
        // 3. 分配任务给志愿者
        mockMvc.perform(post("/api/volunteer/task/assign")
                .param("orderNo", orderNo)
                .param("volunteerId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
        
        // 4. 提交执行结果
        String executeJson = objectMapper.writeValueAsString(Map.of(
            "orderNo", orderNo,
            "executeTime", "2026-04-15 15:00:00",
            "address", "珠江广州段",
            "realQuantity", 10,
            "images", "img1.jpg,img2.jpg,img3.jpg"
        ));
        
        mockMvc.perform(post("/api/task/execute/submit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(executeJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(200));
    }
}
