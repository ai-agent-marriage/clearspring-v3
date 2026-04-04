package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.Volunteer;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 志愿者 Mapper 接口
 */
@Mapper
public interface VolunteerMapper {
    
    /**
     * 根据 ID 查询志愿者
     * @param id 志愿者 ID
     * @return 志愿者
     */
    Volunteer selectById(@Param("id") Long id);
    
    /**
     * 根据用户 ID 查询志愿者
     * @param userId 用户 ID
     * @return 志愿者
     */
    Volunteer selectByUserId(@Param("userId") Long userId);
    
    /**
     * 插入志愿者
     * @param volunteer 志愿者
     * @return 影响行数
     */
    int insert(Volunteer volunteer);
    
    /**
     * 更新志愿者
     * @param volunteer 志愿者
     * @return 影响行数
     */
    int update(Volunteer volunteer);
    
    /**
     * 根据机构 ID 查询志愿者列表
     * @param orgId 机构 ID
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 志愿者列表
     */
    List<Volunteer> selectByOrgId(@Param("orgId") Long orgId,
                                   @Param("offset") Integer offset,
                                   @Param("limit") Integer limit);
    
    /**
     * 更新志愿者
     * @param id 志愿者 ID
     * @param volunteer 志愿者信息
     * @return 影响行数
     */
    int updateById(@Param("id") Long id, @Param("volunteer") Volunteer volunteer);
}
