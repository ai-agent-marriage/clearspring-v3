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
 */
@SpringBootTest
public class RankServiceTest {
    
    @Autowired
    private RankService rankService;
    
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
    public void testGetOrgRank_Success() {
        // 获取组织排行榜（前 10 名）
        List<RankData> rank = rankService.getOrgRank(10);
        
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
}
