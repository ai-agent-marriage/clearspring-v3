package com.ruoyi.qingru.service;

import com.ruoyi.qingru.entity.User;
import com.ruoyi.qingru.mapper.UserMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * 管理后台用户服务类
 */
@Service
@Slf4j
public class AdminUserService {

    @Autowired
    private UserMapper userMapper;

    /**
     * 获取用户列表
     * @param role 角色（可选）
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 用户列表
     */
    public List<User> getList(Integer role, Integer status, Integer pageNum, Integer pageSize) {
        log.info("获取用户列表，role={}, status={}, pageNum={}, pageSize={}", role, status, pageNum, pageSize);
        
        int offset = (pageNum - 1) * pageSize;
        List<User> users = userMapper.selectByCondition(role, status, offset, pageSize);
        
        log.info("获取用户列表成功，count={}", users.size());
        return users;
    }

    /**
     * 获取用户详情
     * @param id 用户 ID
     * @return 用户详情
     */
    public User getDetail(Long id) {
        log.info("获取用户详情，id={}", id);
        
        User user = userMapper.selectById(id);
        
        if (user == null) {
            log.warn("用户不存在，id={}", id);
            throw new RuntimeException("用户不存在");
        }
        
        log.info("获取用户详情成功，id={}, nickname={}", id, user.getNickname());
        return user;
    }

    /**
     * 更新用户状态
     * @param id 用户 ID
     * @param status 新状态
     */
    public void updateStatus(Long id, Integer status) {
        log.info("更新用户状态，id={}, status={}", id, status);
        
        User user = userMapper.selectById(id);
        if (user == null) {
            log.warn("用户不存在，id={}", id);
            throw new RuntimeException("用户不存在");
        }
        
        user.setStatus(status);
        user.setUpdateTime(new Date());
        userMapper.update(user);
        
        log.info("更新用户状态成功，id={}, status={}", id, status);
    }

    /**
     * 删除用户
     * @param id 用户 ID
     */
    public void delete(Long id) {
        log.info("删除用户，id={}", id);
        
        User user = userMapper.selectById(id);
        if (user == null) {
            log.warn("用户不存在，id={}", id);
            throw new RuntimeException("用户不存在");
        }
        
        userMapper.deleteById(id);
        
        log.info("删除用户成功，id={}", id);
    }

    /**
     * 导出用户数据
     * @param role 角色（可选）
     * @param status 状态（可选）
     * @return Excel 文件字节数组
     */
    public byte[] exportUsers(Integer role, Integer status) {
        log.info("导出用户数据，role={}, status={}", role, status);
        
        List<User> users = userMapper.selectByCondition(role, status, 0, 10000);
        
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            
            Sheet sheet = workbook.createSheet("用户数据");
            
            // 创建表头
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "微信 OpenID", "昵称", "头像", "手机号", "角色", "组织 ID", "功德值", "状态", "创建时间", "更新时间"};
            
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                CellStyle style = workbook.createCellStyle();
                Font font = workbook.createFont();
                font.setBold(true);
                style.setFont(font);
                cell.setCellStyle(style);
            }
            
            // 填充数据
            int rowNum = 1;
            for (User user : users) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(user.getId());
                row.createCell(1).setCellValue(user.getOpenid() != null ? user.getOpenid() : "");
                row.createCell(2).setCellValue(user.getNickname() != null ? user.getNickname() : "");
                row.createCell(3).setCellValue(user.getAvatar() != null ? user.getAvatar() : "");
                row.createCell(4).setCellValue(user.getPhone() != null ? user.getPhone() : "");
                row.createCell(5).setCellValue(user.getRoleCode() != null ? user.getRoleCode() : "");
                row.createCell(6).setCellValue(user.getOrgId() != null ? user.getOrgId() : 0);
                row.createCell(7).setCellValue(user.getMerit() != null ? user.getMerit() : 0);
                row.createCell(8).setCellValue(user.getStatus() != null ? user.getStatus() : 1);
                row.createCell(9).setCellValue(user.getCreateTime() != null ? user.getCreateTime().toString() : "");
                row.createCell(10).setCellValue(user.getUpdateTime() != null ? user.getUpdateTime().toString() : "");
            }
            
            // 自动调整列宽
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }
            
            workbook.write(baos);
            
            log.info("导出用户数据成功，count={}", users.size());
            return baos.toByteArray();
            
        } catch (IOException e) {
            log.error("导出用户数据失败", e);
            throw new RuntimeException("导出失败：" + e.getMessage());
        }
    }
}
