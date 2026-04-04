package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.ProtectRecord;
import com.ruoyi.qingru.mapper.ProtectRecordMapper;
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
 * 护生记录服务测试
 */
@ExtendWith(MockitoExtension.class)
class ProtectRecordServiceTest {
    
    @Mock
    private ProtectRecordMapper protectRecordMapper;
    
    @Mock
    private SecurityCheckService securityCheckService;
    
    @Mock
    private CertificateService certificateService;
    
    @InjectMocks
    private ProtectRecordService protectRecordService;
    
    private ProtectRecord testRecord;
    
    @BeforeEach
    void setUp() {
        testRecord = new ProtectRecord();
        testRecord.setId(1L);
        testRecord.setUserOpenid("test_openid_123");
        testRecord.setSpeciesId(1L);
        testRecord.setQuantity(10);
        testRecord.setAddress("测试地点");
        testRecord.setRemark("测试备注");
        testRecord.setImages("/tmp/test1.jpg,/tmp/test2.jpg");
    }
    
    @Test
    void testCreateRecord_Success() {
        // 模拟内容审核通过
        when(securityCheckService.checkImage(anyString())).thenReturn(true);
        when(securityCheckService.checkText(anyString())).thenReturn(true);
        when(protectRecordMapper.insert(any(ProtectRecord.class))).thenReturn(1);
        
        // 执行测试
        ProtectRecord result = protectRecordService.createRecord(testRecord);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.getStatus());
        verify(protectRecordMapper, times(1)).insert(any(ProtectRecord.class));
        verify(certificateService, times(1)).generateCertificate(any(ProtectRecord.class));
    }
    
    @Test
    void testCreateRecord_ImageCheckFailed() {
        // 模拟图片审核失败
        when(securityCheckService.checkImage(anyString())).thenReturn(false);
        
        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            protectRecordService.createRecord(testRecord);
        });
        
        assertEquals("图片包含违规内容", exception.getMessage());
        verify(protectRecordMapper, never()).insert(any(ProtectRecord.class));
    }
    
    @Test
    void testCreateRecord_TextCheckFailed() {
        // 模拟图片审核通过，文本审核失败
        when(securityCheckService.checkImage(anyString())).thenReturn(true);
        when(securityCheckService.checkText(anyString())).thenReturn(false);
        
        // 执行测试并验证异常
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            protectRecordService.createRecord(testRecord);
        });
        
        assertEquals("文本包含违规内容", exception.getMessage());
        verify(protectRecordMapper, never()).insert(any(ProtectRecord.class));
    }
    
    @Test
    void testGetMyRecords() {
        // 模拟数据
        List<ProtectRecord> mockList = new ArrayList<>();
        mockList.add(testRecord);
        when(protectRecordMapper.selectByOpenid(anyString(), anyInt(), anyInt())).thenReturn(mockList);
        
        // 执行测试
        List<ProtectRecord> result = protectRecordService.getMyRecords("test_openid_123", 1, 10);
        
        // 验证结果
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(protectRecordMapper, times(1)).selectByOpenid("test_openid_123", 0, 10);
    }
    
    @Test
    void testGetById() {
        when(protectRecordMapper.selectById(1L)).thenReturn(testRecord);
        
        ProtectRecord result = protectRecordService.getById(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(protectRecordMapper, times(1)).selectById(1L);
    }
    
    @Test
    void testUpdateRecord() {
        when(protectRecordMapper.update(any(ProtectRecord.class))).thenReturn(1);
        
        protectRecordService.updateRecord(1L, testRecord);
        
        verify(protectRecordMapper, times(1)).update(any(ProtectRecord.class));
    }
}
