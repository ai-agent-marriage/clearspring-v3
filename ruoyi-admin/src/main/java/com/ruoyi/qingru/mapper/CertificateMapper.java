package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.Certificate;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 证书 Mapper 接口
 */
@Mapper
public interface CertificateMapper {
    
    /**
     * 插入证书
     * @param cert 证书
     * @return 影响行数
     */
    int insert(Certificate cert);
    
    /**
     * 根据 ID 查询证书
     * @param id 主键 ID
     * @return 证书
     */
    Certificate selectById(@Param("id") Long id);
    
    /**
     * 根据用户 ID 查询证书列表
     * @param userId 用户 ID
     * @param certType 证书类型（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 证书列表
     */
    List<Certificate> selectByUserId(@Param("userId") Long userId,
                                     @Param("certType") Integer certType,
                                     @Param("offset") Integer offset,
                                     @Param("limit") Integer limit);
    
    /**
     * 根据订单号查询证书
     * @param orderNo 订单号
     * @return 证书
     */
    Certificate selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据用户 ID 统计证书数量
     * @param userId 用户 ID
     * @param certType 证书类型（可选）
     * @return 证书数量
     */
    int countByUserId(@Param("userId") Long userId, @Param("certType") Integer certType);
}
