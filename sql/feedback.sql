-- ----------------------------
-- 用户反馈表
-- ----------------------------
DROP TABLE IF EXISTS `feedback`;
CREATE TABLE `feedback` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `user_id` bigint(20) DEFAULT NULL COMMENT '提交用户 ID',
  `type` varchar(50) DEFAULT NULL COMMENT '反馈类型：功能建议/Bug 反馈/其他',
  `title` varchar(200) DEFAULT NULL COMMENT '反馈标题',
  `content` text COMMENT '反馈内容',
  `images` varchar(1000) DEFAULT NULL COMMENT '图片（逗号分隔）',
  `contact` varchar(100) DEFAULT NULL COMMENT '联系方式',
  `status` tinyint(1) DEFAULT '1' COMMENT '状态：1 待处理 2 已处理',
  `reply` text COMMENT '回复内容',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`),
  KEY `idx_type` (`type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户反馈表';

-- ----------------------------
-- 初始化 - 用户反馈表数据（测试数据）
-- ----------------------------
INSERT INTO `feedback` VALUES (1, 1, '功能建议', '希望增加夜间模式', '建议小程序增加夜间模式，晚上使用更舒适', NULL, '13800138000', 1, NULL, sysdate());
INSERT INTO `feedback` VALUES (2, 2, 'Bug 反馈', '提交反馈时图片上传失败', '上传超过 3 张图片时会报错', 'image1.jpg,image2.jpg,image3.jpg', '13900139000', 2, '已修复，感谢反馈', sysdate());
INSERT INTO `feedback` VALUES (3, 1, '其他', '谢谢你们的產品', '用了一段时间，感觉很好，继续加油', NULL, NULL, 2, '感谢您的支持！', sysdate());
