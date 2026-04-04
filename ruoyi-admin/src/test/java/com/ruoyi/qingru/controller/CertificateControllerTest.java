package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Certificate;
import com.ruoyi.qingru.service.CertificateService;
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
 * 证书控制器测试
 */
@ExtendWith(MockitoExtension.class)
class CertificateControllerTest {
    
    @Mock
    private CertificateService certificateService;
    
    @InjectMocks
    private CertificateController certificateController;
    
    private Certificate testCert;
    
    @BeforeEach
    void setUp() {
        testCert = new Certificate();
        testCert.setId(1L);
        testCert.setUserId(1L);
        testCert.setCertType(1);
        testCert.setCertNo("QR202604040001");
        testCert.setCertUrl("/certificates/QR202604040001.jpg");
    }
    
    @Test
    void testGetMyCerts() {
        List<Certificate> mockList = new ArrayList<>();
        mockList.add(testCert);
        when(certificateService.getMyCerts(anyLong(), any(), anyInt(), anyInt())).thenReturn(mockList);
        
        R<List<Certificate>> result = certificateController.getMyCerts(1L, null, 1, 10);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertEquals(1, result.getData().size());
    }
    
    @Test
    void testGetCertDetail() {
        when(certificateService.getById(1L)).thenReturn(testCert);
        
        R<Certificate> result = certificateController.getCertDetail(1L);
        
        assertNotNull(result);
        assertEquals(200, result.getCode());
        assertNotNull(result.getData());
    }
    
    @Test
    void testGetCertDetail_NotFound() {
        when(certificateService.getById(999L)).thenReturn(null);
        
        R<Certificate> result = certificateController.getCertDetail(999L);
        
        assertNotNull(result);
        assertEquals(500, result.getCode());
    }
}
