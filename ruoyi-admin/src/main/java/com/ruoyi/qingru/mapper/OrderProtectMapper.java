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
    
    /**
     * 统计待承接订单数（状态=1）
     * @param orgId 机构 ID
     * @return 订单数量
     */
    int countPendingOrders(@Param("orgId") Long orgId);
    
    /**
     * 统计今日待执行订单数
     * @param orgId 机构 ID
     * @return 订单数量
     */
    int countTodayTasks(@Param("orgId") Long orgId);
    
    /**
     * 统计待用户确认订单数（状态=4）
     * @param orgId 机构 ID
     * @return 订单数量
     */
    int countPendingConfirm(@Param("orgId") Long orgId);
    
    /**
     * 统计累计圆满执行订单数（状态=5）
     * @param orgId 机构 ID
     * @return 订单数量
     */
    int countCompletedOrders(@Param("orgId") Long orgId);
    
    /**
     * 统计待处理用户异议订单数
     * @param orgId 机构 ID
     * @return 订单数量
     */
    int countPendingDispute(@Param("orgId") Long orgId);
    
    /**
     * 统计机构订单总数
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单数量
     */
    int countOrgOrders(@Param("orgId") Long orgId,
                       @Param("startDate") String startDate,
                       @Param("endDate") String endDate);
    
    /**
     * 统计机构订单总金额
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 总金额
     */
    java.math.BigDecimal sumOrgAmount(@Param("orgId") Long orgId,
                                       @Param("startDate") String startDate,
                                       @Param("endDate") String endDate);
    
    /**
     * 统计累计注册用户数
     * @return 用户数量
     */
    int countTotalUsers();
    
    /**
     * 统计今日日活用户数
     * @return 用户数量
     */
    int countDailyActiveUsers();
    
    /**
     * 统计累计委托订单数
     * @return 订单数量
     */
    int countTotalOrders();
    
    /**
     * 导出订单数据
     * @param orgId 机构 ID
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @return 订单列表
     */
    java.util.List<com.ruoyi.qingru.entity.OrderExportDTO> selectForExport(
            @Param("orgId") Long orgId,
            @Param("startDate") String startDate,
            @Param("endDate") String endDate);
    
    /**
     * 统计订单总数
     * @return 订单数量
     */
    @Select("SELECT COUNT(*) FROM order_protect")
    int countTotal();
    
    /**
     * 统计订单总金额
     * @return 总金额
     */
    @Select("SELECT IFNULL(SUM(amount), 0) FROM order_protect")
    java.math.BigDecimal sumTotalAmount();
    
    /**
     * 统计今日订单数
     * @return 订单数量
     */
    @Select("SELECT COUNT(*) FROM order_protect WHERE DATE(create_time) = CURDATE()")
    int countToday();
    
    /**
     * 统计今日成交金额
     * @return 总金额
     */
    @Select("SELECT IFNULL(SUM(amount), 0) FROM order_protect WHERE DATE(create_time) = CURDATE()")
    java.math.BigDecimal sumTodayAmount();
    
    /**
     * 查询订单趋势数据
     * @param startDate 开始日期
     * @param endDate 结束日期
     * @param groupBy 分组方式 (day/week/month)
     * @return 趋势数据列表
     */
    List<com.ruoyi.qingru.entity.TrendData> selectTrend(
            @Param("startDate") String startDate,
            @Param("endDate") String endDate,
            @Param("groupBy") String groupBy);
    
    /**
     * 查询物种分布数据
     * @return 物种分布列表
     */
    List<com.ruoyi.qingru.entity.PieData> selectSpeciesDistribution();
    
    /**
     * 查询机构排行榜（按订单数）
     * @param limit 限制数量
     * @return 排行榜数据
     */
    List<com.ruoyi.qingru.entity.RankData> selectOrgRank(@Param("limit") Integer limit);
}
