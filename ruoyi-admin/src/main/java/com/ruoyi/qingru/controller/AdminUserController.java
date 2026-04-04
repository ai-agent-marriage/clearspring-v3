package com.ruoyi.qingru.controller;

import com.ruoyi.common.core.domain.R;
import com.ruoyi.qingru.entity.User;
import com.ruoyi.qingru.service.AdminUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 管理后台用户控制器
 */
@RestController
@RequestMapping("/api/admin/users")
@Slf4j
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    /**
     * 获取用户列表
     * @param role 角色（可选）
     * @param status 状态（可选）
     * @param pageNum 页码
     * @param pageSize 每页数量
     * @return 用户列表
     */
    @GetMapping("/list")
    public R<List<User>> getList(
            @RequestParam(required = false) Integer role,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        log.info("获取用户列表，role={}, status={}, pageNum={}, pageSize={}", role, status, pageNum, pageSize);
        try {
            List<User> users = adminUserService.getList(role, status, pageNum, pageSize);
            return R.ok(users, "获取成功");
        } catch (Exception e) {
            log.error("获取用户列表失败", e);
            return R.fail(null, "获取失败：" + e.getMessage());
        }
    }

    /**
     * 获取用户详情
     * @param id 用户 ID
     * @return 用户详情
     */
    @GetMapping("/detail/{id}")
    public R<User> getDetail(@PathVariable Long id) {
        log.info("获取用户详情，id={}", id);
        try {
            User user = adminUserService.getDetail(id);
            return R.ok(user, "获取成功");
        } catch (Exception e) {
            log.error("获取用户详情失败", e);
            return R.fail(null, "获取失败：" + e.getMessage());
        }
    }

    /**
     * 更新用户状态
     * @param id 用户 ID
     * @param status 新状态
     * @return 操作结果
     */
    @PutMapping("/status/{id}")
    public R<Void> updateStatus(@PathVariable Long id, @RequestParam Integer status) {
        log.info("更新用户状态，id={}, status={}", id, status);
        try {
            adminUserService.updateStatus(id, status);
            return R.ok(null, "更新成功");
        } catch (Exception e) {
            log.error("更新用户状态失败", e);
            return R.fail(null, "更新失败：" + e.getMessage());
        }
    }

    /**
     * 删除用户
     * @param id 用户 ID
     * @return 操作结果
     */
    @DeleteMapping("/delete/{id}")
    public R<Void> delete(@PathVariable Long id) {
        log.info("删除用户，id={}", id);
        try {
            adminUserService.delete(id);
            return R.ok(null, "删除成功");
        } catch (Exception e) {
            log.error("删除用户失败", e);
            return R.fail(null, "删除失败：" + e.getMessage());
        }
    }

    /**
     * 导出用户数据
     * @param role 角色（可选）
     * @param status 状态（可选）
     * @return Excel 文件
     */
    @GetMapping("/export")
    public ResponseEntity<byte[]> exportUsers(
            @RequestParam(required = false) Integer role,
            @RequestParam(required = false) Integer status) {
        log.info("导出用户数据，role={}, status={}", role, status);
        try {
            byte[] data = adminUserService.exportUsers(role, status);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "users_" + System.currentTimeMillis() + ".xlsx");
            
            return new ResponseEntity<>(data, headers, HttpStatus.OK);
        } catch (Exception e) {
            log.error("导出用户数据失败", e);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
