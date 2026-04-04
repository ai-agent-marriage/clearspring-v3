package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.OrgOrder;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 机构承接订单 Mapper 接口
 */
@Mapper
public interface OrgOrderMapper {
    
    /**
     * 插入机构承接订单
     * @param orgOrder 机构承接订单
     * @return 影响行数
     */
    int insert(OrgOrder orgOrder);
    
    /**
     * 根据订单号查询承接记录
     * @param orderNo 订单号
     * @return 机构承接订单
     */
    OrgOrder selectByOrderNo(@Param("orderNo") String orderNo);
    
    /**
     * 根据机构 ID 查询承接记录列表
     * @param orgId 机构 ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 承接记录列表
     */
    List<OrgOrder> selectByOrgId(@Param("orgId") Long orgId,
                                  @Param("offset") Integer offset,
                                  @Param("limit") Integer limit);
    
    /**
     * 更新机构承接订单
     * @param orgOrder 机构承接订单
     * @return 影响行数
     */
    int update(OrgOrder orgOrder);
}
