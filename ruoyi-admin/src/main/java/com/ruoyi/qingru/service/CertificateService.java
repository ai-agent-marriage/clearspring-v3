package com.ruoyi.qingru.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import com.ruoyi.qingru.entity.Certificate;
import com.ruoyi.qingru.entity.OrderProtect;
import com.ruoyi.qingru.entity.ProtectRecord;
import com.ruoyi.qingru.mapper.CertificateMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import org.slf4j.LoggerFactory;
import org.slf4j.Logger;

/**
 * 证书服务类
 */
@Service
public class CertificateService {
    private static final Logger log = LoggerFactory.getLogger(CertificateService.class);

    
    @Autowired
    private CertificateMapper certificateMapper;
    
    @Autowired
    private WxMaService wxMaService;
    
    /**
     * 生成免费证书（基于护生记录）
     * @param record 护生记录
     * @return 证书
     */
    public Certificate generateCertificate(ProtectRecord record) {
        log.info("生成免费证书，recordId={}", record.getId());
        
        Certificate cert = new Certificate();
        cert.setRecordId(record.getId());
        cert.setCertType(1); // 1=免费证书
        cert.setCertNo(generateCertNo());
        cert.setContent(String.format(
            "于%s在%s完成科学护生行动，特发此证",
            record.getAddress(),
            LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy 年 MM 月 dd 日"))
        ));
        
        // 生成证书图片（调用海报生成接口）
        String certUrl = generateCertImage(cert);
        cert.setCertUrl(certUrl);
        
        certificateMapper.insert(cert);
        log.info("免费证书生成成功，certNo={}", cert.getCertNo());
        
        return cert;
    }
    
    /**
     * 生成付费证书（基于订单）
     * @param order 订单
     * @return 证书
     */
    public Certificate generatePaidCertificate(OrderProtect order) {
        log.info("生成付费证书，orderNo={}", order.getOrderNo());
        
        Certificate cert = new Certificate();
        cert.setOrderNo(order.getOrderNo());
        cert.setCertType(2); // 2=付费证书
        cert.setCertNo(generateCertNo());
        cert.setContent(String.format(
            "于%s在%s完成科学护生行动，特发此证",
            order.getAddress(),
            LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy 年 MM 月 dd 日"))
        ));
        
        // 生成证书图片
        String certUrl = generateCertImage(cert);
        cert.setCertUrl(certUrl);
        
        certificateMapper.insert(cert);
        log.info("付费证书生成成功，certNo={}", cert.getCertNo());
        
        return cert;
    }
    
    /**
     * 获取我的证书列表
     * @param userId 用户 ID
     * @param certType 证书类型（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 证书列表
     */
    public List<Certificate> getMyCerts(Long userId, Integer certType, 
                                        Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取证书列表，userId={}, certType={}, pageNum={}, pageSize={}", 
                userId, certType, pageNum, pageSize);
        return certificateMapper.selectByUserId(userId, certType, offset, pageSize);
    }
    
    /**
     * 获取证书详情
     * @param id 证书 ID
     * @return 证书
     */
    public Certificate getById(Long id) {
        log.info("获取证书详情，id={}", id);
        return certificateMapper.selectById(id);
    }
    
    /**
     * 生成证书编号
     * @return 证书编号
     */
    private String generateCertNo() {
        String date = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return "QR" + date + random;
    }
    
    /**
     * 生成证书图片
     * @param cert 证书
     * @return 证书图片路径
     */
    private String generateCertImage(Certificate cert) {
        // TODO: 调用海报生成接口生成证书图片
        // 这里暂时返回一个占位路径
        String certPath = "/certificates/" + cert.getCertNo() + ".jpg";
        log.info("证书图片生成，path={}", certPath);
        return certPath;
    }
}
