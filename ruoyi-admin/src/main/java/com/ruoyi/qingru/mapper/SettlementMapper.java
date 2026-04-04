package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.Settlement;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 结算单 Mapper 接口
 */
@Mapper
public interface SettlementMapper {
    
    /**
     * 插入结算单
     * @param settlement 结算单
     * @return 影响行数
     */
    int insert(Settlement settlement);
    
    /**
     * 根据 ID 查询结算单
     * @param id 结算单 ID
     * @return 结算单
     */
    Settlement selectById(@Param("id") Long id);
    
    /**
     * 根据订单号查询结算单
     * @param orderNo 订单号
     * @return 结算单
     */
    Settlement selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据机构 ID 查询结算单列表
     * @param orgId 机构 ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 结算单列表
     */
    List<Settlement> selectByOrgId(@Param("orgId") Long orgId,
                                    @Param("offset") Integer offset,
                                    @Param("limit") Integer limit);
    
    /**
     * 更新结算单
     * @param settlement 结算单
     * @return 影响行数
     */
    int update(Settlement settlement);
    
    /**
     * 根据机构 ID 和状态查询结算单列表
     * @param orgId 机构 ID
     * @param status 状态（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 结算单列表
     */
    List<Settlement> selectByOrgIdAndStatus(@Param("orgId") Long orgId,
                                             @Param("status") Integer status,
                                             @Param("offset") Integer offset,
                                             @Param("limit") Integer limit);
}
