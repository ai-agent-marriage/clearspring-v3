package com.ruoyi.qingru;

import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.service.SpeciesService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.beans.factory.annotation.Autowired;
import static org.junit.jupiter.api.Assertions.*;

import java.util.List;
import java.util.Map;

/**
 * 物种服务单元测试
 * 测试物种信息查询功能
 */
@SpringBootTest
public class SpeciesServiceTest {

    @Autowired
    private SpeciesService speciesService;

    /**
     * 测试获取物种列表成功
     * 验证返回的物种列表非空
     */
    @Test
    public void testGetSpeciesList_Success() {
        List<Species> list = speciesService.getSpeciesList(null, null);
        assertTrue(list.size() > 0, "物种列表应包含内容");
    }

    /**
     * 测试按类型筛选物种
     * 验证筛选结果正确
     */
    @Test
    public void testGetSpeciesList_ByType() {
        List<Species> list = speciesService.getSpeciesList(1, null); // 鱼类
        assertTrue(list.size() > 0, "鱼类物种列表应包含内容");
        list.forEach(s -> assertEquals(1, s.getType().intValue(), 
            "筛选结果应该都是鱼类"));
    }

    /**
     * 测试获取物种详情成功
     * 验证返回的物种信息完整
     */
    @Test
    public void testGetSpeciesDetail_Success() {
        Species species = speciesService.getSpeciesDetail(1L);
        
        assertNotNull(species, "物种对象不应为空");
        assertNotNull(species.getName(), "物种名称不应为空");
        assertNotNull(species.getScientificName(), "物种学名不应为空");
    }

    /**
     * 测试按关键词搜索物种
     * 验证搜索结果正确
     */
    @Test
    public void testGetSpeciesList_ByKeyword() {
        List<Species> list = speciesService.getSpeciesList(null, "鲢鱼");
        assertTrue(list.size() > 0, "搜索结果应包含内容");
        list.forEach(s -> assertTrue(s.getName().contains("鲢鱼"), 
            "搜索结果应包含关键词"));
    }

    /**
     * 测试获取分类列表
     * 验证分类信息正确
     */
    @Test
    public void testGetCategories_NotEmpty() {
        List<Map<String, Object>> categories = speciesService.getCategories();
        
        assertNotNull(categories, "分类列表不应为空");
        assertTrue(categories.size() > 1, "分类列表应包含多个分类");
        
        // 验证包含"全部"分类
        boolean hasAll = categories.stream()
            .anyMatch(c -> "全部".equals(c.get("name")));
        assertTrue(hasAll, "分类列表应包含'全部'");
    }

    /**
     * 测试物种对象结构完整
     * 验证所有必要字段都存在
     */
    @Test
    public void testSpeciesStructure_Complete() {
        List<Species> list = speciesService.getSpeciesList(null, null);
        Species species = list.get(0);
        
        assertNotNull(species.getId(), "物种 ID 不应为空");
        assertNotNull(species.getName(), "物种名称不应为空");
        assertNotNull(species.getScientificName(), "物种学名不应为空");
        assertNotNull(species.getType(), "物种类型不应为空");
        assertNotNull(species.getIsForbid(), "是否禁止字段不应为空");
    }

    /**
     * 测试禁止投放物种标识
     * 验证 isForbid 字段正确
     */
    @Test
    public void testSpecies_IsForbidFlag() {
        List<Species> list = speciesService.getSpeciesList(null, null);
        
        // 验证存在禁止投放的物种
        boolean hasForbid = list.stream().anyMatch(s -> s.getIsForbid() == 1);
        assertTrue(hasForbid, "应存在禁止投放的物种");
        
        // 验证存在可投放的物种
        boolean hasAllow = list.stream().anyMatch(s -> s.getIsForbid() == 0);
        assertTrue(hasAllow, "应存在可投放的物种");
    }

    /**
     * 测试组合筛选（类型 + 关键词）
     * 验证组合筛选结果正确
     */
    @Test
    public void testGetSpeciesList_CombinedFilter() {
        List<Species> list = speciesService.getSpeciesList(1, "鱼");
        assertTrue(list.size() > 0, "组合筛选应返回结果");
        list.forEach(s -> {
            assertEquals(1, s.getType().intValue(), "类型应为鱼类");
            assertTrue(s.getName().contains("鱼"), "名称应包含'鱼'");
        });
    }
}
