-- 内容安全审核表 - 三级审核机制
-- 创建时间：2026-04-05
-- 用途：记录所有内容审核请求，支持自动审核 + 人工审核

CREATE TABLE IF NOT EXISTS `content_audit` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '主键 ID',
  `type` tinyint NOT NULL COMMENT '内容类型：1 文本 2 图片 3 视频',
  `content` text DEFAULT NULL COMMENT '文本内容（type=1 时）',
  `file_id` varchar(255) DEFAULT '' COMMENT '云文件 ID（type=2,3 时）',
  `file_url` varchar(255) DEFAULT '' COMMENT '文件访问 URL',
  `user_openid` varchar(64) NOT NULL COMMENT '用户 openid',
  `business_type` varchar(32) NOT NULL COMMENT '业务类型：order/evidence/feedback/comment 等',
  `business_id` varchar(64) NOT NULL COMMENT '业务 ID（订单 ID、证据 ID 等）',
  `auto_audit_result` varchar(16) NOT NULL COMMENT '自动审核结果：pass/block/review',
  `manual_audit_status` varchar(16) NOT NULL DEFAULT 'pending' COMMENT '人工审核状态：pending/passed/rejected',
  `reject_reason` varchar(255) DEFAULT '' COMMENT '驳回原因',
  `audit_time` datetime DEFAULT NULL COMMENT '审核完成时间',
  `auditor_openid` varchar(64) DEFAULT '' COMMENT '审核员 openid',
  `risk_level` varchar(16) DEFAULT 'normal' COMMENT '风险等级：normal/medium/high/critical',
  `violation_type` varchar(64) DEFAULT '' COMMENT '违规类型：porn/politics/violence/ads/illegal/other',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_manual_audit_status` (`manual_audit_status`) COMMENT '人工审核状态索引',
  KEY `idx_create_time` (`create_time`) COMMENT '创建时间索引',
  KEY `idx_user_openid` (`user_openid`) COMMENT '用户索引',
  KEY `idx_business` (`business_type`, `business_id`) COMMENT '业务索引',
  KEY `idx_auto_audit_result` (`auto_audit_result`) COMMENT '自动审核结果索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='内容安全审核记录表';
