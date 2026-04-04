package com.ruoyi.qingru;

import com.ruoyi.qingru.domain.ProtectRecord;
import com.ruoyi.qingru.service.ProtectRecordService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 护生记录接口单元测试
 * 测试护生记录创建、查询、更新、删除等功能
 */
@SpringBootTest
public class ProtectRecordServiceTest {

    @Autowired
    private ProtectRecordService protectRecordService;

    @Test
    public void testCreateRecord_Success() {
        ProtectRecord record = new ProtectRecord();
        record.setUserOpenid("o6_bmjrPTlm6_2sgVt7hMZOPfL2M");
        record.setSpeciesId(1L);
        record.setQuantity(100);
        record.setAddress("珠江广州段");
        record.setRemark("平安顺遂");
        record.setImages("img1.jpg,img2.jpg");

        ProtectRecord created = protectRecordService.createRecord(record);

        assertNotNull(created);
        assertNotNull(created.getId());
        assertEquals(1, created.getStatus().intValue()); // 已完成
        assertEquals("o6_bmjrPTlm6_2sgVt7hMZOPfL2M", created.getUserOpenid());
        assertEquals(100, created.getQuantity().intValue());
    }

    @Test
    public void testCreateRecord_WithAllFields() {
        ProtectRecord record = new ProtectRecord();
        record.setUserOpenid("o6_bmjrPTlm6_2sgVt7hMZOPfL2M");
        record.setSpeciesId(1L);
        record.setQuantity(200);
        record.setAddress("珠江广州段");
        record.setRemark("功德回向");
        record.setImages("img1.jpg,img2.jpg,img3.jpg");
        record.setWish("愿家人平安");

        ProtectRecord created = protectRecordService.createRecord(record);

        assertNotNull(created);
        assertEquals(200, created.getQuantity().intValue());
        assertEquals("珠江广州段", created.getAddress());
        assertNotNull(created.getCreateTime());
    }

    @Test
    public void testCreateRecord_ImageAuditFail() {
        ProtectRecord record = new ProtectRecord();
        record.setUserOpenid("o6_bmjrPTlm6_2sgVt7hMZOPfL2M");
        record.setSpeciesId(1L);
        record.setQuantity(100);
        record.setImages("invalid_img.jpg"); // 违规图片

        assertThrows(RuntimeException.class, () -> {
            protectRecordService.createRecord(record);
        });
    }

    @Test
    public void testCreateRecord_TextAuditFail() {
        ProtectRecord record = new ProtectRecord();
        record.setUserOpenid("o6_bmjrPTlm6_2sgVt7hMZOPfL2M");
        record.setSpeciesId(1L);
        record.setQuantity(100);
        record.setRemark("敏感词测试"); // 违规文本

        assertThrows(RuntimeException.class, () -> {
            protectRecordService.createRecord(record);
        });
    }

    @Test
    public void testCreateRecord_MissingRequiredFields() {
        ProtectRecord record = new ProtectRecord();
        // 缺少必填字段

        assertThrows(RuntimeException.class, () -> {
            protectRecordService.createRecord(record);
        });
    }

    @Test
    public void testGetMyRecords_Success() {
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";
        List<ProtectRecord> records = protectRecordService.getMyRecords(openid, 1, 10);

        assertNotNull(records);
        assertTrue(records instanceof List);
    }

    @Test
    public void testGetMyRecords_Pagination() {
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";
        List<ProtectRecord> recordsPage1 = protectRecordService.getMyRecords(openid, 1, 5);
        List<ProtectRecord> recordsPage2 = protectRecordService.getMyRecords(openid, 2, 5);

        assertNotNull(recordsPage1);
        assertNotNull(recordsPage2);
        assertTrue(recordsPage1.size() <= 5);
    }

    @Test
    public void testGetRecordDetail_Success() {
        Long recordId = 1L;
        ProtectRecord record = protectRecordService.getById(recordId);

        assertNotNull(record);
        assertNotNull(record.getSpeciesName());
        assertNotNull(record.getQuantity());
        assertNotNull(record.getAddress());
    }

    @Test
    public void testGetRecordDetail_NotFound() {
        Long recordId = 99999L; // 不存在的记录
        ProtectRecord record = protectRecordService.getById(recordId);

        assertNull(record);
    }

    @Test
    public void testUpdateRecord_Within3Days() {
        Long recordId = 1L;
        ProtectRecord record = new ProtectRecord();
        record.setQuantity(200);
        record.setAddress("新地址");
        record.setRemark("新愿望");

        protectRecordService.updateRecord(recordId, record);

        ProtectRecord updated = protectRecordService.getById(recordId);
        assertEquals(200, updated.getQuantity().intValue());
    }

    @Test
    public void testUpdateRecord_Beyond3Days() {
        Long recordId = 2L; // 4 天前的记录
        ProtectRecord record = new ProtectRecord();
        record.setQuantity(200);

        assertThrows(RuntimeException.class, () -> {
            protectRecordService.updateRecord(recordId, record);
        });
    }

    @Test
    public void testUpdateRecord_PartialUpdate() {
        Long recordId = 1L;
        ProtectRecord record = new ProtectRecord();
        record.setRemark("只更新愿望");

        protectRecordService.updateRecord(recordId, record);

        ProtectRecord updated = protectRecordService.getById(recordId);
        assertNotNull(updated.getRemark());
    }

    @Test
    public void testDeleteRecord_Success() {
        Long recordId = 3L;

        protectRecordService.deleteRecord(recordId);

        ProtectRecord deleted = protectRecordService.getById(recordId);
        assertNull(deleted);
    }

    @Test
    public void testDeleteRecord_NotFound() {
        Long recordId = 99999L; // 不存在的记录

        assertThrows(RuntimeException.class, () -> {
            protectRecordService.deleteRecord(recordId);
        });
    }

    @Test
    public void testGetRecordWithSpeciesInfo() {
        Long recordId = 1L;
        ProtectRecord record = protectRecordService.getById(recordId);

        assertNotNull(record);
        assertNotNull(record.getSpeciesName());
        assertNotNull(record.getSpeciesLatinName());
    }

    @Test
    public void testGetRecordsWithStatusFilter() {
        String openid = "o6_bmjrPTlm6_2sgVt7hMZOPfL2M";
        Integer status = 1; // 已完成
        List<ProtectRecord> records = protectRecordService.getMyRecordsByStatus(openid, status, 1, 10);

        assertNotNull(records);
        for (ProtectRecord record : records) {
            assertEquals(status, record.getStatus());
        }
    }
}
