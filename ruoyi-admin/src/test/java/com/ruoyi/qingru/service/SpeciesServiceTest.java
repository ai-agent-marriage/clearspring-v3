package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Species;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 物种服务测试
 */
@SpringBootTest
class SpeciesServiceTest {
    
    @Autowired
    private SpeciesService speciesService;
    
    @BeforeEach
    void setUp() {
        // 清理测试数据（如果需要）
    }
    
    @Test
    void testGetSpeciesList_NoFilter() {
        List<Species> list = speciesService.getSpeciesList(null, null, null, null, null);
        assertNotNull(list);
        assertTrue(list.size() > 0);
    }
    
    @Test
    void testGetSpeciesList_ByType() {
        List<Species> list = speciesService.getSpeciesList(1, null, null, null, null);
        assertNotNull(list);
        assertTrue(list.stream().allMatch(s -> s.getType() == 1));
    }
    
    @Test
    void testGetSpeciesList_ByKeyword() {
        List<Species> list = speciesService.getSpeciesList(null, null, "鱼", null, null);
        assertNotNull(list);
        assertTrue(list.stream().anyMatch(s -> s.getName().contains("鱼")));
    }
    
    @Test
    void testGetSpeciesList_WithPagination() {
        List<Species> list = speciesService.getSpeciesList(null, null, null, 1, 5);
        assertNotNull(list);
        assertTrue(list.size() <= 5);
    }
    
    @Test
    void testGetSpeciesDetail() {
        Species species = speciesService.getSpeciesDetail(1L);
        assertNotNull(species);
        assertEquals(1L, species.getId());
    }
    
    @Test
    void testAddSpecies() {
        Species newSpecies = new Species();
        newSpecies.setName("测试物种");
        newSpecies.setScientificName("Test Species");
        newSpecies.setType(1);
        newSpecies.setIsForbid(0);
        newSpecies.setRemark("测试备注");
        newSpecies.setSort(100);
        
        Long id = speciesService.addSpecies(newSpecies);
        assertNotNull(id);
        
        Species saved = speciesService.getSpeciesDetail(id);
        assertNotNull(saved);
        assertEquals("测试物种", saved.getName());
    }
    
    @Test
    void testUpdateSpecies() {
        Species newSpecies = new Species();
        newSpecies.setName("更新测试");
        newSpecies.setScientificName("Update Test");
        newSpecies.setType(2);
        Long id = speciesService.addSpecies(newSpecies);
        
        Species updateData = new Species();
        updateData.setName("已更新名称");
        boolean success = speciesService.updateSpecies(id, updateData);
        
        assertTrue(success);
        Species updated = speciesService.getSpeciesDetail(id);
        assertEquals("已更新名称", updated.getName());
    }
    
    @Test
    void testDeleteSpecies() {
        Species newSpecies = new Species();
        newSpecies.setName("删除测试");
        newSpecies.setScientificName("Delete Test");
        newSpecies.setType(1);
        Long id = speciesService.addSpecies(newSpecies);
        
        boolean success = speciesService.deleteSpecies(id);
        assertTrue(success);
        
        Species deleted = speciesService.getSpeciesDetail(id);
        assertNull(deleted);
    }
    
    @Test
    void testGetCategories() {
        List<java.util.Map<String, Object>> categories = speciesService.getCategories();
        assertNotNull(categories);
        assertTrue(categories.size() > 0);
    }
}
