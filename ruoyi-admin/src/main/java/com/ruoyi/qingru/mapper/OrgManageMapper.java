package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.OrgManage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import java.util.List;

/**
 * 机构管理 Mapper 接口
 */
@Mapper
public interface OrgManageMapper {
    
    /**
     * 根据 ID 查询机构
     * @param id 机构 ID
     * @return 机构
     */
    OrgManage selectById(@Param("id") Long id);
    
    /**
     * 插入机构
     * @param org 机构
     * @return 影响行数
     */
    int insert(OrgManage org);
    
    /**
     * 更新机构
     * @param org 机构
     * @return 影响行数
     */
    int update(OrgManage org);
    
    /**
     * 查询机构列表
     * @param status 状态（可选）
     * @param offset 偏移量
     * @param limit 限制数量
     * @return 机构列表
     */
    List<OrgManage> selectList(@Param("status") Integer status,
                                @Param("offset") Integer offset,
                                @Param("limit") Integer limit);
}
