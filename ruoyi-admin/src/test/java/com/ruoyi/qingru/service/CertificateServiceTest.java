package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.Certificate;
import com.ruoyi.qingru.entity.ProtectRecord;
import com.ruoyi.qingru.mapper.CertificateMapper;
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
 * 证书服务测试
 */
@ExtendWith(MockitoExtension.class)
class CertificateServiceTest {
    
    @Mock
    private CertificateMapper certificateMapper;
    
    @InjectMocks
    private CertificateService certificateService;
    
    private ProtectRecord testRecord;
    private Certificate testCert;
    
    @BeforeEach
    void setUp() {
        testRecord = new ProtectRecord();
        testRecord.setId(1L);
        testRecord.setAddress("测试地点");
        
        testCert = new Certificate();
        testCert.setId(1L);
        testCert.setRecordId(1L);
        testCert.setCertType(1);
        testCert.setCertNo("QR202604040001");
        testCert.setCertUrl("/certificates/QR202604040001.jpg");
    }
    
    @Test
    void testGenerateCertificate() {
        when(certificateMapper.insert(any(Certificate.class))).thenReturn(1);
        
        Certificate result = certificateService.generateCertificate(testRecord);
        
        assertNotNull(result);
        assertNotNull(result.getCertNo());
        assertTrue(result.getCertNo().startsWith("QR"));
        assertEquals(1, result.getCertType());
        verify(certificateMapper, times(1)).insert(any(Certificate.class));
    }
    
    @Test
    void testGetMyCerts() {
        List<Certificate> mockList = new ArrayList<>();
        mockList.add(testCert);
        when(certificateMapper.selectByUserId(anyLong(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        List<Certificate> result = certificateService.getMyCerts(1L, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(certificateMapper, times(1)).selectByUserId(1L, null, 0, 10);
    }
    
    @Test
    void testGetById() {
        when(certificateMapper.selectById(1L)).thenReturn(testCert);
        
        Certificate result = certificateService.getById(1L);
        
        assertNotNull(result);
        assertEquals(1L, result.getId());
        verify(certificateMapper, times(1)).selectById(1L);
    }
}
