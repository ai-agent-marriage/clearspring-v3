package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.ProtectRecord;
import com.ruoyi.qingru.mapper.ProtectRecordMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * 护生记录服务类
 */
@Slf4j
@Service
public class ProtectRecordService {
    
    @Autowired
    private ProtectRecordMapper protectRecordMapper;
    
    @Autowired
    private SecurityCheckService securityCheckService;
    
    @Autowired
    private CertificateService certificateService;
    
    /**
     * 创建护生记录
     * @param record 护生记录
     * @return 创建后的记录
     */
    public ProtectRecord createRecord(ProtectRecord record) {
        log.info("创建护生记录，userOpenid={}, speciesId={}, quantity={}, address={}", 
                record.getUserOpenid(), record.getSpeciesId(), 
                record.getQuantity(), record.getAddress());
        
        // 内容安全审核（图片）
        if (record.getImages() != null && !record.getImages().trim().isEmpty()) {
            String[] images = record.getImages().split(",");
            for (String image : images) {
                if (!image.trim().isEmpty() && !securityCheckService.checkImage(image.trim())) {
                    log.warn("图片包含违规内容：{}", image);
                    throw new RuntimeException("图片包含违规内容");
                }
            }
        }
        
        // 内容安全审核（文本）
        if (record.getRemark() != null && !record.getRemark().trim().isEmpty()) {
            if (!securityCheckService.checkText(record.getRemark())) {
                log.warn("文本包含违规内容：{}", record.getRemark());
                throw new RuntimeException("文本包含违规内容");
            }
        }
        
        // 插入记录
        record.setStatus(1); // 1=已完成
        protectRecordMapper.insert(record);
        log.info("护生记录创建成功，id={}", record.getId());
        
        // 生成证书
        try {
            certificateService.generateCertificate(record);
            log.info("证书生成成功，recordId={}", record.getId());
        } catch (Exception e) {
            log.error("证书生成失败", e);
            // 证书生成失败不影响记录创建
        }
        
        return record;
    }
    
    /**
     * 获取我的护生记录列表
     * @param openid 用户 openid
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 护生记录列表
     */
    public List<ProtectRecord> getMyRecords(String openid, Integer pageNum, Integer pageSize) {
        if (pageNum == null || pageNum < 1) {
            pageNum = 1;
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10;
        }
        int offset = (pageNum - 1) * pageSize;
        
        log.info("获取护生记录列表，openid={}, pageNum={}, pageSize={}", openid, pageNum, pageSize);
        return protectRecordMapper.selectByOpenid(openid, offset, pageSize);
    }
    
    /**
     * 获取护生记录详情
     * @param id 记录 ID
     * @return 护生记录
     */
    public ProtectRecord getById(Long id) {
        log.info("获取护生记录详情，id={}", id);
        return protectRecordMapper.selectById(id);
    }
    
    /**
     * 更新护生记录
     * @param id 记录 ID
     * @param record 护生记录
     */
    public void updateRecord(Long id, ProtectRecord record) {
        log.info("更新护生记录，id={}", id);
        record.setId(id);
        protectRecordMapper.update(record);
    }
}
