package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Species;
import com.ruoyi.qingru.service.SpeciesService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 物种控制器测试
 */
@ExtendWith(MockitoExtension.class)
class SpeciesControllerTest {
    
    @Mock
    private SpeciesService speciesService;
    
    @InjectMocks
    private SpeciesController speciesController;
    
    private Species testSpecies;
    
    @BeforeEach
    void setUp() {
        testSpecies = new Species();
        testSpecies.setId(1L);
        testSpecies.setName("测试物种");
        testSpecies.setScientificName("Test Species");
        testSpecies.setType(1);
        testSpecies.setIsForbid(0);
    }
    
    @Test
    void testGetList_NoFilter() {
        List<Species> mockList = new ArrayList<>();
        mockList.add(testSpecies);
        when(speciesService.getSpeciesList(null, null, null, null, null)).thenReturn(mockList);
        
        R<List<Species>> result = speciesController.getList(null, null, null, null, null);
        
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetList_WithFilter() {
        List<Species> mockList = new ArrayList<>();
        mockList.add(testSpecies);
        when(speciesService.getSpeciesList(1, 0, "测试", 1, 10)).thenReturn(mockList);
        
        R<List<Species>> result = speciesController.getList(1, 0, "测试", 1, 10);
        
        assertEquals(200, result.getCode());
        verify(speciesService, times(1)).getSpeciesList(1, 0, "测试", 1, 10);
    }
    
    @Test
    void testGetDetail() {
        when(speciesService.getSpeciesDetail(1L)).thenReturn(testSpecies);
        
        R<Species> result = speciesController.getDetail(1L);
        
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        assertEquals(1L, result.getData().getId());
    }
    
    @Test
    void testGetDetail_NotFound() {
        when(speciesService.getSpeciesDetail(999L)).thenReturn(null);
        
        R<Species> result = speciesController.getDetail(999L);
        
        assertNotEquals(200, result.getCode());
        assertTrue(result.getMsg().contains("不存在"));
    }
    
    @Test
    void testAdd() {
        when(speciesService.addSpecies(any(Species.class))).thenReturn(100L);
        
        R<Long> result = speciesController.add(testSpecies);
        
        assertEquals(200, result.getCode());
        assertEquals(100L, result.getData());
    }
    
    @Test
    void testUpdate() {
        when(speciesService.updateSpecies(eq(1L), any(Species.class))).thenReturn(true);
        
        R<Void> result = speciesController.update(1L, testSpecies);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testUpdate_NotFound() {
        when(speciesService.updateSpecies(eq(999L), any(Species.class))).thenReturn(false);
        
        R<Void> result = speciesController.update(999L, testSpecies);
        
        assertNotEquals(200, result.getCode());
    }
    
    @Test
    void testDelete() {
        when(speciesService.deleteSpecies(1L)).thenReturn(true);
        
        R<Void> result = speciesController.delete(1L);
        
        assertEquals(200, result.getCode());
    }
    
    @Test
    void testGetCategories() {
        List<java.util.Map<String, Object>> mockCategories = new ArrayList<>();
        when(speciesService.getCategories()).thenReturn(mockCategories);
        
        R<List<java.util.Map<String, Object>>> result = speciesController.getCategories();
        
        assertEquals(200, result.getCode());
    }
}
