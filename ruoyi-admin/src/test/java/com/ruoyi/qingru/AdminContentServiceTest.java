package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.entity.ZenQuote;
import com.ruoyi.qingru.service.AdminContentService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;

/**
 * 管理后台内容服务单元测试
 */
@SpringBootTest
public class AdminContentServiceTest {

    @Autowired
    private AdminContentService adminContentService;

    // ==================== 物种管理测试 ====================

    /**
     * 测试获取物种列表成功
     * 验证返回的物种列表非空
     */
    @Test
    public void testGetSpeciesList_Success() {
        List<Species> list = adminContentService.getSpeciesList(null, 1, 10);
        assertNotNull(list, "物种列表不应为空");
        assertTrue(list.size() > 0, "物种列表应包含内容");
    }

    /**
     * 测试按类型筛选物种
     * 验证筛选结果正确
     */
    @Test
    public void testGetSpeciesList_ByType() {
        List<Species> list = adminContentService.getSpeciesList(1, 1, 10); // 鱼类
        assertNotNull(list, "物种列表不应为空");
        assertTrue(list.size() > 0, "鱼类物种列表应包含内容");
        list.forEach(s -> assertEquals(1, s.getType().intValue(), 
            "筛选结果应该都是鱼类"));
    }

    /**
     * 测试分页获取物种
     * 验证分页参数生效
     */
    @Test
    public void testGetSpeciesList_WithPagination() {
        List<Species> page1 = adminContentService.getSpeciesList(null, 1, 5);
        List<Species> page2 = adminContentService.getSpeciesList(null, 2, 5);
        
        assertNotNull(page1, "第一页不应为空");
        assertTrue(page1.size() <= 5, "第一页数量不应超过 5");
    }

    /**
     * 测试新增物种成功
     * 验证物种被添加
     */
    @Test
    public void testAddSpecies_Success() {
        Species species = new Species();
        species.setName("测试物种");
        species.setScientificName("Test Species");
        species.setType(3);
        species.setIsForbid(0);
        species.setRemark("测试备注");
        
        adminContentService.addSpecies(species);
        assertNotNull(species.getId(), "新增后物种 ID 不应为空");
        assertTrue(species.getId() > 0, "物种 ID 应大于 0");
    }

    /**
     * 测试新增物种-名称为空
     * 验证抛出异常
     */
    @Test
    public void testAddSpecies_EmptyName() {
        Species species = new Species();
        species.setName("");
        
        assertThrows(IllegalArgumentException.class, () -> {
            adminContentService.addSpecies(species);
        }, "名称为空的物种应抛出异常");
    }

    /**
     * 测试新增物种-名称为 null
     * 验证抛出异常
     */
    @Test
    public void testAddSpecies_NullName() {
        Species species = new Species();
        
        assertThrows(IllegalArgumentException.class, () -> {
            adminContentService.addSpecies(species);
        }, "名称为 null 的物种应抛出异常");
    }

    /**
     * 测试更新物种成功
     * 验证物种信息被更新
     */
    @Test
    public void testUpdateSpecies_Success() {
        List<Species> list = adminContentService.getSpeciesList(null, 1, 1);
        if (!list.isEmpty()) {
            Species species = list.get(0);
            String originalName = species.getName();
            
            Species updateData = new Species();
            updateData.setName("更新后的名称");
            adminContentService.updateSpecies(species.getId(), updateData);
            
            List<Species> updatedList = adminContentService.getSpeciesList(null, 1, 100);
            Species updated = updatedList.stream()
                .filter(s -> s.getId().equals(species.getId()))
                .findFirst()
                .orElse(null);
            
            assertNotNull(updated, "更新后的物种应存在");
            assertEquals("更新后的名称", updated.getName(), "名称应被更新");
            
            // 恢复原名
            updateData.setName(originalName);
            adminContentService.updateSpecies(species.getId(), updateData);
        }
    }

    /**
     * 测试更新不存在的物种
     * 验证抛出异常
     */
    @Test
    public void testUpdateSpecies_NotFound() {
        Species updateData = new Species();
        updateData.setName("测试");
        
        assertThrows(RuntimeException.class, () -> {
            adminContentService.updateSpecies(999999L, updateData);
        }, "更新不存在的物种应抛出异常");
    }

    /**
     * 测试删除物种成功
     * 验证物种被删除
     */
    @Test
    public void testDeleteSpecies_Success() {
        // 先新增一个物种用于删除
        Species species = new Species();
        species.setName("待删除物种");
        species.setScientificName("ToDelete Species");
        species.setType(3);
        adminContentService.addSpecies(species);
        
        Long id = species.getId();
        
        // 删除
        adminContentService.deleteSpecies(id);
        
        // 验证删除后查询不到
        List<Species> list = adminContentService.getSpeciesList(null, 1, 100);
        boolean exists = list.stream().anyMatch(s -> s.getId().equals(id));
        assertFalse(exists, "删除后物种不应存在");
    }

    /**
     * 测试删除不存在的物种
     * 验证抛出异常
     */
    @Test
    public void testDeleteSpecies_NotFound() {
        assertThrows(RuntimeException.class, () -> {
            adminContentService.deleteSpecies(999999L);
        }, "删除不存在的物种应抛出异常");
    }

    /**
     * 测试物种对象结构完整
     * 验证所有必要字段都存在
     */
    @Test
    public void testSpeciesStructure_Complete() {
        List<Species> list = adminContentService.getSpeciesList(null, 1, 1);
        if (!list.isEmpty()) {
            Species species = list.get(0);
            
            assertNotNull(species.getId(), "物种 ID 不应为空");
            assertNotNull(species.getName(), "物种名称不应为空");
            assertNotNull(species.getScientificName(), "物种学名不应为空");
            assertNotNull(species.getType(), "物种类型不应为空");
            assertNotNull(species.getIsForbid(), "是否禁止字段不应为空");
        }
    }

    /**
     * 测试禁止投放物种标识
     * 验证 isForbid 字段正确
     */
    @Test
    public void testSpecies_IsForbidFlag() {
        List<Species> list = adminContentService.getSpeciesList(null, 1, 100);
        
        // 验证存在禁止投放的物种
        boolean hasForbid = list.stream().anyMatch(s -> s.getIsForbid() == 1);
        assertTrue(hasForbid, "应存在禁止投放的物种");
        
        // 验证存在可投放的物种
        boolean hasAllow = list.stream().anyMatch(s -> s.getIsForbid() == 0);
        assertTrue(hasAllow, "应存在可投放的物种");
    }

    /**
     * 测试组合筛选（类型 + 分页）
     * 验证组合筛选结果正确
     */
    @Test
    public void testGetSpeciesList_CombinedFilter() {
        List<Species> list = adminContentService.getSpeciesList(1, 1, 10);
        assertTrue(list.size() > 0, "筛选应返回结果");
        list.forEach(s -> assertEquals(1, s.getType().intValue(), "类型应为鱼类"));
    }

    // ==================== 禅理管理测试 ====================

    /**
     * 测试获取禅理列表成功
     * 验证返回的禅理列表非空
     */
    @Test
    public void testGetZenList_Success() {
        List<ZenQuote> list = adminContentService.getZenList(1, 10);
        assertNotNull(list, "禅理列表不应为空");
        assertTrue(list.size() > 0, "禅理列表应包含内容");
    }

    /**
     * 测试分页获取禅理
     * 验证分页参数生效
     */
    @Test
    public void testGetZenList_WithPagination() {
        List<ZenQuote> page1 = adminContentService.getZenList(1, 5);
        List<ZenQuote> page2 = adminContentService.getZenList(2, 5);
        
        assertNotNull(page1, "第一页不应为空");
        assertTrue(page1.size() <= 5, "第一页数量不应超过 5");
    }

    /**
     * 测试新增禅理成功
     * 验证禅理被添加
     */
    @Test
    public void testAddZenQuote_Success() {
        ZenQuote zenQuote = new ZenQuote();
        zenQuote.setContent("测试禅理内容");
        zenQuote.setAuthor("测试作者");
        
        adminContentService.addZenQuote(zenQuote);
        assertNotNull(zenQuote.getId(), "新增后禅理 ID 不应为空");
        assertTrue(zenQuote.getId() > 0, "禅理 ID 应大于 0");
    }

    /**
     * 测试新增禅理-内容为空
     * 验证抛出异常
     */
    @Test
    public void testAddZenQuote_EmptyContent() {
        ZenQuote zenQuote = new ZenQuote();
        zenQuote.setContent("");
        
        assertThrows(IllegalArgumentException.class, () -> {
            adminContentService.addZenQuote(zenQuote);
        }, "内容为空的禅理应抛出异常");
    }

    /**
     * 测试新增禅理-内容为 null
     * 验证抛出异常
     */
    @Test
    public void testAddZenQuote_NullContent() {
        ZenQuote zenQuote = new ZenQuote();
        
        assertThrows(IllegalArgumentException.class, () -> {
            adminContentService.addZenQuote(zenQuote);
        }, "内容为 null 的禅理应抛出异常");
    }

    /**
     * 测试禅理对象结构完整
     * 验证所有必要字段都存在
     */
    @Test
    public void testZenQuoteStructure_Complete() {
        List<ZenQuote> list = adminContentService.getZenList(1, 1);
        if (!list.isEmpty()) {
            ZenQuote quote = list.get(0);
            
            assertNotNull(quote.getId(), "禅理 ID 不应为空");
            assertNotNull(quote.getContent(), "禅理内容不应为空");
            assertNotNull(quote.getAuthor(), "禅理作者不应为空");
        }
    }

    /**
     * 测试禅理列表排序
     * 验证按 ID 排序
     */
    @Test
    public void testGetZenList_Sorted() {
        List<ZenQuote> list = adminContentService.getZenList(1, 100);
        if (list.size() > 1) {
            for (int i = 1; i < list.size(); i++) {
                assertTrue(list.get(i).getId() >= list.get(i-1).getId(), 
                    "禅理应按照 ID 升序排列");
            }
        }
    }

    /**
     * 测试新增多个禅理
     * 验证批量添加功能
     */
    @Test
    public void testAddZenQuote_Multiple() {
        String[] contents = {"禅理测试 1", "禅理测试 2", "禅理测试 3"};
        
        for (String content : contents) {
            ZenQuote zenQuote = new ZenQuote();
            zenQuote.setContent(content);
            zenQuote.setAuthor("测试");
            adminContentService.addZenQuote(zenQuote);
            assertNotNull(zenQuote.getId(), "新增后禅理 ID 不应为空");
        }
    }

    /**
     * 测试物种类型完整性
     * 验证所有类型都存在
     */
    @Test
    public void testSpeciesTypes_Complete() {
        List<Species> list = adminContentService.getSpeciesList(null, 1, 100);
        
        boolean hasFish = list.stream().anyMatch(s -> s.getType() == 1);
        boolean hasBird = list.stream().anyMatch(s -> s.getType() == 2);
        boolean hasMammal = list.stream().anyMatch(s -> s.getType() == 3);
        
        assertTrue(hasFish, "应存在鱼类物种");
        assertTrue(hasBird, "应存在鸟类物种");
        assertTrue(hasMammal, "应存在哺乳类物种");
    }
}
