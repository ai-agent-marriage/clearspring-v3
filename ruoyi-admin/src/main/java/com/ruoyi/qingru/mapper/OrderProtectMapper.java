package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.OrderProtect;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 护生订单 Mapper 接口
 */
@Mapper
public interface OrderProtectMapper {
    
    /**
     * 插入护生订单
     * @param order 护生订单
     * @return 影响行数
     */
    int insert(OrderProtect order);
    
    /**
     * 根据订单号查询订单
     * @param orderNo 订单号
     * @return 护生订单
     */
    OrderProtect selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据用户 ID 查询订单列表
     * @param userId 用户 ID
     * @param status 状态（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 订单列表
     */
    List<OrderProtect> selectByUserId(@Param("userId") Long userId,
                                      @Param("status") Integer status,
                                      @Param("offset") Integer offset,
                                      @Param("limit") Integer limit);
    
    /**
     * 更新订单
     * @param order 订单
     * @return 影响行数
     */
    int update(OrderProtect order);
    
    /**
     * 根据用户 ID 统计订单数量
     * @param userId 用户 ID
     * @param status 状态（可选）
     * @return 订单数量
     */
    int countByUserId(@Param("userId") Long userId, @Param("status") Integer status);
    
    /**
     * 查询未承接的订单列表（48 小时自动取消用）
     * @return 未承接订单列表
     */
    List<OrderProtect> selectUnclaimedOrders();
    
    /**
     * 查询可承接的订单列表
     * @param orgId 机构 ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 可承接订单列表
     */
    List<OrderProtect> selectAvailableOrders(@Param("orgId") Long orgId,
                                              @Param("offset") Integer offset,
                                              @Param("limit") Integer limit);
    
    /**
     * 更新订单状态
     * @param orderNo 订单号
     * @param status 新状态
     * @return 影响行数
     */
    int updateStatus(@Param("orderNo") String orderNo, @Param("status") Integer status);
}
