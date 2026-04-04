package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.Certificate;
import com.ruoyi.qingru.service.CertificateService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * 证书控制器
 */
@Slf4j
@RestController
@RequestMapping("/cert")
public class CertificateController {
    
    @Autowired
    private CertificateService certificateService;
    
    /**
     * 获取我的证书列表
     * @param userId 用户 ID
     * @param certType 证书类型
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 证书列表
     */
    @GetMapping("/my")
    public R<List<Certificate>> getMyCerts(
            @RequestParam Long userId,
            @RequestParam(required = false) Integer certType,
            @RequestParam(required = false) Integer pageNum,
            @RequestParam(required = false) Integer pageSize) {
        log.info("获取证书列表，userId={}, certType={}, pageNum={}, pageSize={}", 
                userId, certType, pageNum, pageSize);
        List<Certificate> list = certificateService.getMyCerts(userId, certType, pageNum, pageSize);
        return R.ok(list);
    }
    
    /**
     * 获取证书详情
     * @param id 证书 ID
     * @return 证书
     */
    @GetMapping("/detail/{id}")
    public R<Certificate> getCertDetail(@PathVariable Long id) {
        log.info("获取证书详情，id={}", id);
        Certificate cert = certificateService.getById(id);
        if (cert == null) {
            return R.fail("证书不存在");
        }
        return R.ok(cert);
    }
}
