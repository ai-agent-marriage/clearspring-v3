-- 支付系统数据库建表脚本
-- 创建时间：2026-04-05
-- 用途：支付日志表 + 订单保护表创建 + 字段升级

-- 支付日志表
CREATE TABLE IF NOT EXISTS `pay_log` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) NOT NULL,
  `transaction_id` varchar(64) DEFAULT '',
  `out_refund_no` varchar(64) DEFAULT '',
  `amount` decimal(10,2) NOT NULL,
  `type` tinyint NOT NULL COMMENT '1 支付 2 退款 3 结算',
  `status` tinyint NOT NULL COMMENT '1 成功 2 失败 3 处理中',
  `pay_channel` varchar(16) NOT NULL DEFAULT 'wechat',
  `callback_info` text DEFAULT NULL,
  `operator_openid` varchar(64) DEFAULT '',
  `remark` varchar(255) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_transaction_id` (`transaction_id`),
  KEY `idx_order_no` (`order_no`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='支付日志表';

-- 订单保护表（如果不存在则创建）
CREATE TABLE IF NOT EXISTS `order_protect` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_no` varchar(32) NOT NULL COMMENT '订单号',
  `user_id` varchar(64) DEFAULT '' COMMENT '用户 ID',
  `amount` decimal(10,2) NOT NULL COMMENT '订单金额',
  `status` tinyint NOT NULL DEFAULT '1' COMMENT '订单状态：1 待支付 2 已支付 3 已取消 4 已完成',
  `transaction_id` varchar(64) DEFAULT '' COMMENT '微信支付交易号',
  `pay_time` datetime DEFAULT NULL COMMENT '支付时间',
  `expire_time` datetime DEFAULT NULL COMMENT '过期时间',
  `remark` varchar(255) DEFAULT '',
  `create_time` datetime DEFAULT CURRENT_TIMESTAMP,
  `update_time` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单保护表';

-- 如果 order_protect 表已存在，添加 transaction_id 字段
-- 注意：如果字段已存在会报错，需要手动处理
