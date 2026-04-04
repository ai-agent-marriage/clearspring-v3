package com.ruoyi.qingru.mapper;

import com.ruoyi.qingru.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;

/**
 * 用户 Mapper 接口
 */
@Mapper
public interface UserMapper {
    
    /**
     * 根据 openid 查询用户
     * @param openid 微信 openid
     * @return 用户信息
     */
    @Select("SELECT * FROM user WHERE openid = #{openid}")
    User selectByOpenid(@Param("openid") String openid);
    
    /**
     * 插入用户
     * @param user 用户信息
     * @return 影响行数
     */
    @Insert("INSERT INTO user (openid, nickname, avatar, phone, role_code, org_id, merit) " +
            "VALUES (#{openid}, #{nickname}, #{avatar}, #{phone}, #{roleCode}, #{orgId}, #{merit})")
    int insert(User user);
    
    /**
     * 更新用户
     * @param user 用户信息
     * @return 影响行数
     */
    @Update("UPDATE user SET nickname=#{nickname}, avatar=#{avatar}, phone=#{phone}, " +
            "role_code=#{roleCode}, org_id=#{orgId}, merit=#{merit} WHERE id=#{id}")
    int update(User user);
}
