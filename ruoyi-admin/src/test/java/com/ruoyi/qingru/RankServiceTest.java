package com.ruoyi.qingru;

import com.ruoyi.qingru.service.RankService;
import com.ruoyi.qingru.domain.RankData;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 排行榜服务测试
 * 测试文件：backend/ruoyi-admin/src/test/java/com/ruoyi/qingru/RankServiceTest.java
 * 
 * 测试范围:
 * - 志愿者排行榜测试
 * - 机构排行榜测试
 * 
 * 用例数量：10 个
 */
@SpringBootTest
public class RankServiceTest {
    
    @Autowired
    private RankService rankService;
    
    // ==================== 志愿者排行榜测试 (5 个用例) ====================
    
    @Test
    public void testGetVolunteerRank_Success() {
        // 获取志愿者排行榜（前 10 名）
        List<RankData> rank = rankService.getVolunteerRank(10);
        
        // 验证排行榜数据不为空
        assertNotNull(rank);
        // 验证排行榜数量不超过 10
        assertTrue(rank.size() <= 10);
    }
    
    @Test
    public void testGetVolunteerRank_Top5() {
        // 测试获取前 5 名志愿者
        List<RankData> rank = rankService.getVolunteerRank(5);
        
        assertNotNull(rank);
        assertTrue(rank.size() <= 5);
        
        // 验证排行榜数据包含必要字段
        if (!rank.isEmpty()) {
            RankData first = rank.get(0);
            assertNotNull(first.getUserId());
            assertNotNull(first.getUserName());
            assertTrue(first.getScore() >= 0);
        }
    }
    
    @Test
    public void testGetVolunteerRank_DataFields() {
        // 测试志愿者排行榜字段完整性
        List<RankData> rank = rankService.getVolunteerRank(10);
        
        assertNotNull(rank);
        if (!rank.isEmpty()) {
            RankData item = rank.get(0);
            assertNotNull(item.getUserId(), "用户 ID 不应为空");
            assertNotNull(item.getUserName(), "用户名称不应为空");
            assertNotNull(item.getScore(), "分数不应为空");
            assertNotNull(item.getOrderCount(), "订单数不应为空");
        }
    }
    
    @Test
    public void testGetVolunteerRank_ScoreDescending() {
        // 测试志愿者排行榜按分数降序排列
        List<RankData> rank = rankService.getVolunteerRank(10);
        
        assertNotNull(rank);
        if (rank.size() > 1) {
            for (int i = 1; i < rank.size(); i++) {
                assertTrue(
                    rank.get(i - 1).getScore() >= rank.get(i).getScore(),
                    "志愿者排行榜应按分数降序排列"
                );
            }
        }
    }
    
    @Test
    public void testGetVolunteerRank_RankOrder() {
        // 测试志愿者排行榜排名顺序
        List<RankData> rank = rankService.getVolunteerRank(10);
        
        assertNotNull(rank);
        for (int i = 0; i < rank.size(); i++) {
            assertEquals(i + 1, rank.get(i).getRank(), 
                "排名应该从 1 开始连续递增");
        }
    }
    
    // ==================== 机构排行榜测试 (5 个用例) ====================
    
    @Test
    public void testGetOrgRank_Success() {
        // 获取组织排行榜（前 10 名）
        List<RankData> rank = rankService.getOrgRank(10);
        
        // 验证排行榜数据不为空
        assertNotNull(rank);
        // 验证排行榜数量不超过 10
        assertTrue(rank.size() <= 10);
    }
    
    @Test
    public void testGetOrgRank_Top20() {
        // 测试获取前 20 名组织
        List<RankData> rank = rankService.getOrgRank(20);
        
        assertNotNull(rank);
        assertTrue(rank.size() <= 20);
        
        // 验证排行榜数据包含必要字段
        if (!rank.isEmpty()) {
            RankData first = rank.get(0);
            assertNotNull(first.getOrgId());
            assertNotNull(first.getOrgName());
            assertTrue(first.getScore() >= 0);
        }
    }
    
    @Test
    public void testGetOrgRank_DataFields() {
        // 测试机构排行榜字段完整性
        List<RankData> rank = rankService.getOrgRank(10);
        
        assertNotNull(rank);
        if (!rank.isEmpty()) {
            RankData item = rank.get(0);
            assertNotNull(item.getOrgId(), "机构 ID 不应为空");
            assertNotNull(item.getOrgName(), "机构名称不应为空");
            assertNotNull(item.getScore(), "分数不应为空");
            assertNotNull(item.getOrderCount(), "订单数不应为空");
        }
    }
    
    @Test
    public void testGetOrgRank_ScoreDescending() {
        // 测试机构排行榜按分数降序排列
        List<RankData> rank = rankService.getOrgRank(10);
        
        assertNotNull(rank);
        if (rank.size() > 1) {
            for (int i = 1; i < rank.size(); i++) {
                assertTrue(
                    rank.get(i - 1).getScore() >= rank.get(i).getScore(),
                    "机构排行榜应按分数降序排列"
                );
            }
        }
    }
    
    @Test
    public void testGetOrgRank_RankOrder() {
        // 测试机构排行榜排名顺序
        List<RankData> rank = rankService.getOrgRank(10);
        
        assertNotNull(rank);
        for (int i = 0; i < rank.size(); i++) {
            assertEquals(i + 1, rank.get(i).getRank(), 
                "排名应该从 1 开始连续递增");
        }
    }
}
