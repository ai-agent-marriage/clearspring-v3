package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.ProtectRecord;
import com.ruoyi.qingru.service.ProtectRecordService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

/**
 * 护生记录控制器测试
 */
@ExtendWith(MockitoExtension.class)
class ProtectRecordControllerTest {
    
    @Mock
    private ProtectRecordService protectRecordService;
    
    @InjectMocks
    private ProtectRecordController protectRecordController;
    
    private MockMvc mockMvc;
    private ProtectRecord testRecord;
    
    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(protectRecordController).build();
        
        testRecord = new ProtectRecord();
        testRecord.setId(1L);
        testRecord.setUserOpenid("test_openid");
        testRecord.setSpeciesId(1L);
        testRecord.setQuantity(10);
    }
    
    @Test
    void testAddRecord_Success() {
        when(protectRecordService.createRecord(any(ProtectRecord.class))).thenReturn(testRecord);
        
        R<ProtectRecord> result = protectRecordController.addRecord(testRecord);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
        verify(protectRecordService, times(1)).createRecord(any(ProtectRecord.class));
    }
    
    @Test
    void testAddRecord_Failed() {
        when(protectRecordService.createRecord(any(ProtectRecord.class)))
                .thenThrow(new RuntimeException("图片包含违规内容"));
        
        R<ProtectRecord> result = protectRecordController.addRecord(testRecord);
        
        assertNotNull(result);
        assertEquals(500, result.getCode());
    }
    
    @Test
    void testGetMyRecords() {
        List<ProtectRecord> mockList = new ArrayList<>();
        mockList.add(testRecord);
        when(protectRecordService.getMyRecords(anyString(), anyInt(), anyInt())).thenReturn(mockList);
        
        R<List<ProtectRecord>> result = protectRecordController.getMyRecords("test_openid", 1, 10);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetRecordDetail() {
        when(protectRecordService.getById(1L)).thenReturn(testRecord);
        
        R<ProtectRecord> result = protectRecordController.getRecordDetail(1L);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
    
    @Test
    void testGetRecordDetail_NotFound() {
        when(protectRecordService.getById(999L)).thenReturn(null);
        
        R<ProtectRecord> result = protectRecordController.getRecordDetail(999L);
        
        assertNotNull(result);
        assertEquals(500, result.getCode());
    }
    
    @Test
    void testUpdateRecord() {
        doNothing().when(protectRecordService).updateRecord(anyLong(), any(ProtectRecord.class));
        
        R<Void> result = protectRecordController.updateRecord(1L, testRecord);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
    }
}
