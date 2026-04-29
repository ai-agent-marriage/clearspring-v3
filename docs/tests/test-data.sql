-- 插入测试用户
INSERT INTO sys_user (openid, nickname, role_code, merit, create_time) VALUES
('o6_bmjrPTlm6_2sgVt7hMZOPfL2M', '测试用户 1', 'user', 100, NOW()),
('o6_bmjrPTlm6_2sgVt7hMZOPfL2N', '测试用户 2', 'user', 50, NOW());

-- 插入测试志愿者
INSERT INTO volunteer (real_name, id_card, phone, org_id, status, total_tasks, service_hours, compliance_rate, create_time) VALUES
('张三', '440100199001011234', '13800138000', 1, 1, 15, 48, 98.00, NOW()),
('李四', '440100199001011235', '13800138001', 1, 1, 10, 30, 95.00, NOW());

-- 插入测试机构
INSERT INTO org_info (org_name, contact, address, status, create_time) VALUES
('XX 生态护生协会', '13800138002', '广州市天河区', 1, NOW());

-- 插入测试订单
INSERT INTO order_protect (order_no, user_id, org_id, volunteer_id, species_id, quantity, amount, status, address, create_time) VALUES
('PRO202604070001', 1, 1, 1, 1, 10, 299.00, 2, '珠江广州段', NOW()),
('PRO202604070002', 1, 1, 1, 1, 20, 598.00, 3, '珠江广州段', NOW()),
('PRO202604070003', 2, 1, 2, 1, 10, 299.00, 4, '东江东莞段', NOW());

-- 插入测试执行记录
INSERT INTO task_execute (order_no, volunteer_id, execute_time, address, real_quantity, images, status, create_time) VALUES
('PRO202604070001', 1, NOW(), '珠江广州段', 10, 'img1.jpg,img2.jpg,img3.jpg', 2, NOW());

-- 插入测试结算单
INSERT INTO settlement (order_no, org_id, amount, platform_fee, status, create_time) VALUES
('PRO202604070001', 1, 269.10, 29.90, 2, NOW()),
('PRO202604070002', 1, 538.20, 59.80, 1, NOW());
