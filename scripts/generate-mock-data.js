#!/usr/bin/env node
/**
 * 模拟业务数据生成脚本
 * 用于生成祈福放生小程序的测试数据
 */

const fs = require('fs');
const path = require('path');

// ==================== 基础数据 ====================

// 常见中文姓氏
const SURNAMES = ['赵', '钱', '孙', '李', '周', '吴', '郑', '王', '冯', '陈', '褚', '卫', '蒋', '沈', '韩', '杨', '朱', '秦', '尤', '许', '何', '吕', '施', '张', '孔', '曹', '严', '华', '金', '魏', '陶', '姜', '戚', '谢', '邹', '喻', '柏', '水', '窦', '章', '云', '苏', '潘', '葛', '奚', '范', '彭', '郎', '鲁', '韦', '昌', '马', '苗', '凤', '花', '方', '俞', '任', '袁', '柳', '酆', '鲍', '史', '唐', '费', '廉', '岑', '薛', '雷', '贺', '倪', '汤', '滕', '殷', '罗', '毕', '郝', '邬', '安', '常', '乐', '于', '时', '傅', '皮', '卞', '齐', '康', '伍', '余', '元', '卜', '顾', '孟', '平', '黄', '和', '穆', '萧', '尹', '姚', '邵', '湛', '汪', '祁', '毛', '禹', '狄', '米', '贝', '明', '臧', '计', '伏', '成', '戴', '谈', '宋', '茅', '庞', '熊', '纪', '舒', '屈', '项', '祝', '董', '梁', '杜', '阮', '蓝', '闵', '席', '季', '麻', '强', '贾', '路', '娄', '危', '江', '童', '颜', '郭', '梅', '盛', '林', '刁', '钟', '徐', '邱', '骆', '高', '夏', '蔡', '田', '樊', '胡', '凌', '霍', '虞', '万', '支', '柯', '昝', '管', '卢', '莫', '经', '房', '裘', '缪', '干', '解', '应', '宗', '丁', '宣', '邓', '郁', '单', '杭', '洪', '包', '诸', '左', '石', '崔', '吉', '钮', '龚', '程', '嵇', '邢', '滑', '裴', '陆', '荣', '翁', '荀', '羊', '於', '惠', '甄', '曲', '家', '封', '芮', '羿', '储', '晋', '汲', '邴', '糜', '松', '井', '段', '富', '巫', '乌', '焦', '巴', '弓', '牧', '隗', '山', '谷', '车', '侯', '宓', '蓬', '全', '郗', '班', '仰', '秋', '仲', '伊', '宫', '宁', '仇', '栾', '暴', '甘', '钭', '厉', '戎', '祖', '武', '符', '刘', '景', '詹', '束', '龙', '叶', '幸', '司', '韶', '郜', '黎', '蓟', '薄', '印', '宿', '白', '怀', '蒲', '邰', '从', '鄂', '索', '咸', '籍', '赖', '卓', '蔺', '屠', '蒙', '池', '乔', '阴', '郁', '胥', '能', '苍', '双', '闻', '莘', '党', '翟', '谭', '贡', '劳', '逄', '姬', '申', '扶', '堵', '冉', '宰', '郦', '雍', '却', '璩', '桑', '桂', '濮', '牛', '寿', '通', '边', '扈', '燕', '冀', '郏', '浦', '尚', '农', '温', '别', '庄', '晏', '柴', '瞿', '阎', '充', '慕', '连', '茹', '习', '宦', '艾', '鱼', '容', '向', '古', '易', '慎', '戈', '廖', '庾', '终', '暨', '居', '衡', '步', '都', '耿', '满', '弘', '匡', '国', '文', '寇', '广', '禄', '阙', '东', '欧', '殳', '沃', '利', '蔚', '越', '夔', '隆', '师', '巩', '厍', '聂', '晁', '勾', '敖', '融', '冷', '訾', '辛', '阚', '那', '简', '饶', '空', '曾', '毋', '沙', '乜', '养', '鞠', '须', '丰', '巢', '关', '蒯', '相', '查', '后', '荆', '红', '游', '竺', '权', '逯', '盖', '益', '桓', '公'];

// 常见中文名字
const GIVEN_NAMES_MALE = ['伟', '芳', '娜', '秀英', '丽', '强', '磊', '军', '洋', '勇', '艳', '杰', '娟', '涛', '明', '超', '秀兰', '霞', '平', '刚', '桂英', '华', '慧', '建', '玲', '辉', '敏', '静', '丽娟', '鹏', '波', '斌', '浩', '凯', '磊', '俊', '军', '欣', '健', '利', '东', '萍', '燕', '根', '忠', '林', '峰', '波', '红', '成', '龙', '文', '国', '英', '海', '荣', '毅', '飞', '星', '宇', '翔', '阳', '晨', '博', '鑫', '瑞', '泽', '轩', '航', '铭', '睿', '皓', '然', '辰', '逸', '哲', '远', '志', '文', '昊', '天', '翊', '嘉', '乐', '子', '一', '诺', '伊', '可', '欣', '雨', '思', '佳', '梦', '雪', '诗', '雅', '婉', '晴', '月', '瑶', '琳', '琪', '瑶', '璐', '颖', '倩', '婷', '媛', '晶', '晶', '丹', '凤', '梅', '菊', '兰', '荷', '莲', '芝', '芹', '芬', '芳', '菁', '蓉', '薇', '蕾', '蔓', '菲', '萌', '茹', '茵', '荷', '芙', '芸', '芷', '若', '芊', '芃', '茂', '苑', '苔', '芽', '花', '芬', '芳', '芯', '芩', '芪', '芫', '芭', '芮', '花', '芳', '芸', '芹', '芩', '芪', '芫', '芭', '芮', '花', '芬', '芳', '芯', '芩', '芪', '芫', '芭', '芮'];

const GIVEN_NAMES_FEMALE = ['芳', '娜', '秀英', '丽', '艳', '娟', '秀兰', '霞', '桂英', '玲', '静', '丽娟', '萍', '燕', '红', '英', '梅', '菊', '兰', '荷', '莲', '芝', '芹', '芬', '芳', '菁', '蓉', '薇', '蕾', '蔓', '菲', '萌', '茹', '茵', '荷', '芙', '芸', '芷', '若', '芊', '芃', '瑶', '琳', '琪', '瑶', '璐', '颖', '倩', '婷', '媛', '晶', '丹', '凤', '雪', '诗', '雅', '婉', '晴', '月', '梦', '雨', '思', '佳', '可', '欣', '伊', '诺', '一', '子', '乐', '嘉', '翊', '天', '昊', '文', '志', '远', '哲', '逸', '辰', '然', '皓', '睿', '铭', '航', '泽', '瑞', '鑫', '博', '晨', '阳', '翔', '宇', '星', '飞', '毅', '荣', '海', '文', '龙', '成', '波', '林', '忠', '根', '国', '鑫', '磊', '俊', '凯', '浩', '斌', '军', '利', '建', '慧', '华', '平', '刚', '超', '明', '涛', '杰', '勇', '洋', '强', '磊', '芳', '伟'];

// 城市列表
const CITIES = [
  { name: '北京', province: '北京', areas: ['朝阳区', '海淀区', '东城区', '西城区', '丰台区', '石景山区', '门头沟区', '房山区', '通州区', '顺义区', '昌平区', '大兴区', '怀柔区', '平谷区', '密云区', '延庆区'] },
  { name: '上海', province: '上海', areas: ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区'] },
  { name: '广州', province: '广东', areas: ['越秀区', '海珠区', '荔湾区', '天河区', '白云区', '黄埔区', '花都区', '番禺区', '南沙区', '从化区', '增城区'] },
  { name: '深圳', province: '广东', areas: ['福田区', '罗湖区', '盐田区', '南山区', '宝安区', '龙岗区', '龙华区', '坪山区', '光明区'] },
  { name: '杭州', province: '浙江', areas: ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区', '萧山区', '余杭区', '富阳区', '临安区'] },
  { name: '南京', province: '江苏', areas: ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区', '雨花台区', '江宁区', '六合区', '溧水区', '高淳区'] },
  { name: '成都', province: '四川', areas: ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区', '青白江区', '新都区', '温江区', '双流区', '郫都区'] },
  { name: '武汉', province: '湖北', areas: ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区', '洪山区', '东西湖区', '汉南区', '蔡甸区', '江夏区', '黄陂区', '新洲区'] },
  { name: '西安', province: '陕西', areas: ['新城区', '碑林区', '莲湖区', '灞桥区', '未央区', '雁塔区', '阎良区', '临潼区', '长安区', '高陵区'] },
  { name: '重庆', province: '重庆', areas: ['万州区', '涪陵区', '渝中区', '大渡口区', '江北区', '沙坪坝区', '九龙坡区', '南岸区', '北碚区', '渝北区', '巴南区'] }
];

// 水域名称
const WATER_AREAS = [
  '水库', '湖泊', '河流', '水域', '江边', '河边', '湖畔', '湿地公园', '自然保护区', 
  '放生池', '观音湖', '莲花湖', '青龙湖', '白龙湖', '翠微湖', '碧波潭', '清水河', 
  '长江', '黄河', '珠江', '淮河', '海河', '松花江', '辽河', '汉江', '湘江', '赣江'
];

// 物种列表
const SPECIES = [
  { name: '鲤鱼', category: '水生动物', minQty: 10, maxQty: 200, basePrice: 10 },
  { name: '鲫鱼', category: '水生动物', minQty: 10, maxQty: 150, basePrice: 8 },
  { name: '泥鳅', category: '水生动物', minQty: 50, maxQty: 500, basePrice: 2 },
  { name: '草鱼', category: '水生动物', minQty: 5, maxQty: 100, basePrice: 15 },
  { name: '青鱼', category: '水生动物', minQty: 5, maxQty: 80, basePrice: 18 },
  { name: '鲢鱼', category: '水生动物', minQty: 10, maxQty: 120, basePrice: 12 },
  { name: '鳙鱼', category: '水生动物', minQty: 5, maxQty: 80, basePrice: 20 },
  { name: '乌龟', category: '水生动物', minQty: 1, maxQty: 20, basePrice: 50 },
  { name: '甲鱼', category: '水生动物', minQty: 1, maxQty: 30, basePrice: 60 },
  { name: '青蛙', category: '水生动物', minQty: 20, maxQty: 200, basePrice: 3 },
  { name: '鸽子', category: '鸟类', minQty: 2, maxQty: 50, basePrice: 25 },
  { name: '麻雀', category: '鸟类', minQty: 10, maxQty: 100, basePrice: 5 },
  { name: '喜鹊', category: '鸟类', minQty: 2, maxQty: 30, basePrice: 30 },
  { name: '斑鸠', category: '鸟类', minQty: 2, maxQty: 40, basePrice: 20 },
  { name: '画眉', category: '鸟类', minQty: 1, maxQty: 20, basePrice: 40 },
  { name: '八哥', category: '鸟类', minQty: 1, maxQty: 30, basePrice: 35 },
  { name: '鹦鹉', category: '鸟类', minQty: 1, maxQty: 10, basePrice: 80 },
  { name: '兔子', category: '其他', minQty: 1, maxQty: 20, basePrice: 30 },
  { name: '松鼠', category: '其他', minQty: 1, maxQty: 10, basePrice: 50 },
  { name: '刺猬', category: '其他', minQty: 1, maxQty: 10, basePrice: 40 }
];

// 服务类型
const SERVICE_TYPES = [
  { name: '放生服务', ratio: 0.6 },
  { name: '代放生', ratio: 0.3 },
  { name: '其他', ratio: 0.1 }
];

// 订单状态
const ORDER_STATUSES = [
  { status: '待接单', ratio: 0.2 },
  { status: '进行中', ratio: 0.3 },
  { status: '已完成', ratio: 0.4 },
  { status: '已取消', ratio: 0.1 }
];

// 用户等级
const USER_LEVELS = ['初级放生者', '中级放生者', '高级放生者', '资深放生者', '护法居士'];

// 执行者专长
const EXECUTOR_SPECIALTIES = [
  ['水生动物'],
  ['鸟类'],
  ['其他'],
  ['水生动物', '鸟类'],
  ['水生动物', '其他'],
  ['鸟类', '其他'],
  ['水生动物', '鸟类', '其他']
];

// 机构类型
const ORG_TYPES = ['放生组织', '佛教协会', '慈善机构', '动物保护组织', '志愿者协会'];

// 评价内容模板
const REVIEW_TEMPLATES = [
  '执行者很专业，放生过程如法如仪，非常满意！',
  '服务态度很好，全程耐心指导，功德无量！',
  '非常专业的放生团队，如理如法，随喜赞叹！',
  '执行者很有爱心，对物命很温柔，感恩！',
  '整个过程很顺利，执行者很负责，阿弥陀佛！',
  '非常满意的服务，放生地点选得很好，功德圆满！',
  '执行者很专业，讲解很详细，学到了很多知识！',
  '态度很好，服务周到，下次还会选择！',
  '放生过程很庄严，执行者很用心，随喜功德！',
  '非常棒的体验，执行者很专业，感恩遇见！',
  '服务很到位，放生如法如仪，非常满意！',
  '执行者很有耐心，全程指导，功德无量！',
  '很好的放生体验，执行者很专业，感恩！',
  '服务态度好，放生过程顺利，随喜赞叹！',
  '非常专业的团队，放生如理如法，满意！'
];

const REPLY_TEMPLATES = [
  '感谢您的认可，阿弥陀佛！',
  '随喜您的功德，祝您福慧增长！',
  '感恩您的信任，我们会继续努力！',
  '阿弥陀佛，祝您吉祥如意！',
  '感谢您的好评，功德回向给您！',
  '随喜赞叹，愿您六时吉祥！',
  '感恩您的支持，阿弥陀佛！',
  '祝您福报增长，吉祥如意！',
  '阿弥陀佛，功德无量！',
  '感谢您的认可，愿您心想事成！'
];

// ==================== 工具函数 ====================

// 随机整数
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 随机选择
function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// 随机生成手机号（脱敏）
function randomPhone() {
  const prefixes = ['138', '139', '136', '137', '135', '134', '150', '151', '152', '157', '158', '159', '182', '183', '187', '188', '147', '178', '130', '131', '132', '155', '156', '185', '186', '145', '176', '133', '153', '180', '181', '189', '177', '173'];
  const prefix = randomChoice(prefixes);
  const middle = randomInt(1000, 9999);
  const last = randomInt(1000, 9999);
  return `${prefix}${middle}****${last}`;
}

// 随机生成姓名
function randomName() {
  const surname = randomChoice(SURNAMES);
  const givenName = Math.random() > 0.5 
    ? randomChoice(GIVEN_NAMES_MALE) 
    : randomChoice(GIVEN_NAMES_FEMALE);
  return surname + givenName;
}

// 随机生成日期
function randomDate(start, end) {
  const startDate = new Date(start).getTime();
  const endDate = new Date(end).getTime();
  const randomTime = startDate + Math.random() * (endDate - startDate);
  return new Date(randomTime);
}

// 格式化日期
function formatDate(date, includeTime = false) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  if (includeTime) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
  return `${year}-${month}-${day}`;
}

// 随机生成地址
function randomAddress() {
  const city = randomChoice(CITIES);
  const area = randomChoice(city.areas);
  const street = randomInt(1, 999) + randomChoice(['路', '街', '道', '巷', '胡同']);
  const number = randomInt(1, 999);
  return `${city.province}${city.name}${area}${street}${number}号`;
}

// 随机生成水域位置
function randomWaterLocation() {
  const city = randomChoice(CITIES);
  const waterType = randomChoice(WATER_AREAS);
  const area = randomChoice(city.areas);
  return `${city.name}${area}${randomInt(1, 10)}号${waterType}`;
}

// 随机生成头像 URL
function randomAvatar(index) {
  return `https://xxx.feishu.cn/avatar/avatar_${index % 20 + 1}.jpg`;
}

// ==================== 数据生成函数 ====================

// 生成用户数据
function generateUsers(count = 80) {
  const users = [];
  for (let i = 1; i <= count; i++) {
    const registerDate = randomDate('2026-03-01', '2026-04-10');
    const totalOrders = randomInt(1, 20);
    const totalMerit = totalOrders * randomInt(10, 50);
    const levelIndex = Math.min(Math.floor(totalOrders / 5), USER_LEVELS.length - 1);
    
    users.push({
      userId: `user_${String(i).padStart(3, '0')}`,
      nickName: randomName(),
      avatarUrl: randomAvatar(i),
      phone: randomPhone(),
      registerDate: formatDate(registerDate),
      totalOrders: totalOrders,
      totalMerit: totalMerit,
      level: USER_LEVELS[levelIndex]
    });
  }
  return users;
}

// 生成执行者数据
function generateExecutors(count = 25) {
  const executors = [];
  for (let i = 1; i <= count; i++) {
    const certDate = randomDate('2026-03-01', '2026-04-01');
    const totalCompleted = randomInt(5, 50);
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    
    executors.push({
      executorId: `exec_${String(i).padStart(3, '0')}`,
      nickName: randomName(),
      avatarUrl: randomAvatar(i + 100),
      phone: randomPhone(),
      qualificationStatus: Math.random() > 0.1 ? '已认证' : '审核中',
      certificationDate: formatDate(certDate),
      totalCompleted: totalCompleted,
      rating: parseFloat(rating),
      specialty: randomChoice(EXECUTOR_SPECIALTIES)
    });
  }
  return executors;
}

// 生成机构数据
function generateOrganizations(count = 8) {
  const orgs = [];
  for (let i = 1; i <= count; i++) {
    const estDate = randomDate('2020-01-01', '2025-12-31');
    const volunteerCount = randomInt(10, 100);
    const totalOrders = randomInt(50, 500);
    const rating = (Math.random() * 1 + 4).toFixed(1);
    
    orgs.push({
      orgId: `org_${String(i).padStart(3, '0')}`,
      orgName: randomChoice(CITIES).name + randomChoice(['放生协会', '慈善会', '护生会', '放生团', '功德林']) ,
      orgType: randomChoice(ORG_TYPES),
      address: randomAddress(),
      contactPerson: randomName(),
      contactPhone: `0${randomInt(10, 99)}****${randomInt(1000, 9999)}`,
      establishmentDate: formatDate(estDate),
      volunteerCount: volunteerCount,
      totalOrders: totalOrders,
      rating: parseFloat(rating)
    });
  }
  return orgs;
}

// 生成志愿者数据
function generateVolunteers(users, organizations, count = 40) {
  const volunteers = [];
  for (let i = 1; i <= count; i++) {
    const joinDate = randomDate('2026-02-01', '2026-04-01');
    const serviceHours = randomInt(10, 200);
    const totalTasks = randomInt(5, 50);
    const rating = (Math.random() * 1 + 3.5).toFixed(1);
    
    volunteers.push({
      volunteerId: `vol_${String(i).padStart(3, '0')}`,
      nickName: randomName(),
      orgId: randomChoice(organizations).orgId,
      phone: randomPhone(),
      joinDate: formatDate(joinDate),
      serviceHours: serviceHours,
      totalTasks: totalTasks,
      rating: parseFloat(rating)
    });
  }
  return volunteers;
}

// 生成订单数据
function generateOrders(users, executors, organizations, count = 150) {
  const orders = [];
  
  for (let i = 1; i <= count; i++) {
    const species = randomChoice(SPECIES);
    const quantity = randomInt(species.minQty, species.maxQty);
    const amount = quantity * species.basePrice * (Math.random() * 0.5 + 0.8);
    
    // 根据状态分布确定订单状态
    let rand = Math.random();
    let statusObj;
    let cumulative = 0;
    for (const s of ORDER_STATUSES) {
      cumulative += s.ratio;
      if (rand < cumulative) {
        statusObj = s;
        break;
      }
    }
    const status = statusObj.status;
    
    // 生成时间线
    const createDate = randomDate('2026-03-01', '2026-04-10');
    let acceptDate, completeDate, reviewDate;
    
    if (status === '待接单') {
      acceptDate = null;
      completeDate = null;
    } else if (status === '进行中') {
      acceptDate = new Date(createDate.getTime() + randomInt(1, 24) * 3600000);
      completeDate = null;
    } else {
      acceptDate = new Date(createDate.getTime() + randomInt(1, 24) * 3600000);
      completeDate = new Date(acceptDate.getTime() + randomInt(1, 48) * 3600000);
      if (status === '已完成' || status === '已评价') {
        reviewDate = new Date(completeDate.getTime() + randomInt(1, 24) * 3600000);
      }
    }
    
    // 服务类型
    let serviceTypeObj;
    rand = Math.random();
    cumulative = 0;
    for (const s of SERVICE_TYPES) {
      cumulative += s.ratio;
      if (rand < cumulative) {
        serviceTypeObj = s;
        break;
      }
    }
    
    // 证据文件
    const evidenceCount = status === '已完成' || status === '已评价' ? randomInt(2, 5) : 0;
    const evidence = [];
    for (let j = 0; j < evidenceCount; j++) {
      if (Math.random() > 0.3) {
        evidence.push(`photo_${i}_${j}.jpg`);
      } else {
        evidence.push(`video_${i}_${j}.mp4`);
      }
    }
    
    orders.push({
      orderId: `order_${String(i).padStart(4, '0')}`,
      userId: randomChoice(users).userId,
      executorId: randomChoice(executors).executorId,
      orgId: randomChoice(organizations).orgId,
      serviceType: serviceTypeObj.name,
      species: species.name,
      quantity: quantity,
      amount: Math.round(amount),
      status: status,
      createDate: formatDate(createDate, true),
      acceptDate: acceptDate ? formatDate(acceptDate, true) : null,
      completeDate: completeDate ? formatDate(completeDate, true) : null,
      location: randomWaterLocation(),
      evidence: evidence
    });
  }
  
  return orders;
}

// 生成评价数据
function generateReviews(users, orders, count = 80) {
  const reviews = [];
  const completedOrders = orders.filter(o => o.status === '已完成' || o.status === '已评价');
  
  // 只对有完成日期的订单生成评价
  const validOrders = completedOrders.filter(o => o.completeDate);
  
  for (let i = 1; i <= Math.min(count, validOrders.length); i++) {
    const order = validOrders[i - 1];
    const rating = randomInt(3, 5); // 大部分是好评
    const completeDate = new Date(order.completeDate);
    const reviewDate = new Date(completeDate.getTime() + randomInt(1, 48) * 3600000);
    
    reviews.push({
      reviewId: `review_${String(i).padStart(4, '0')}`,
      orderId: order.orderId,
      userId: order.userId,
      rating: rating,
      content: randomChoice(REVIEW_TEMPLATES),
      createDate: formatDate(reviewDate, true),
      reply: Math.random() > 0.3 ? randomChoice(REPLY_TEMPLATES) : null
    });
  }
  
  return reviews;
}

// ==================== 数据验证函数 ====================

function validateData(data) {
  const errors = [];
  
  // 验证用户数据
  if (data.users) {
    for (const user of data.users) {
      if (!user.userId || !user.nickName || !user.phone) {
        errors.push(`用户数据错误：${JSON.stringify(user)}`);
      }
      if (!/^\d{3}\d{4}\*\*\*\*\d{4}$/.test(user.phone)) {
        errors.push(`用户手机号格式错误：${user.phone}`);
      }
    }
  }
  
  // 验证订单数据
  if (data.orders) {
    for (const order of data.orders) {
      if (!order.orderId || !order.userId || !order.executorId) {
        errors.push(`订单数据错误：${JSON.stringify(order)}`);
      }
      if (order.createDate && order.completeDate) {
        if (new Date(order.createDate) > new Date(order.completeDate)) {
          errors.push(`订单时间逻辑错误：${order.orderId}`);
        }
      }
    }
  }
  
  // 验证评价数据
  if (data.reviews) {
    for (const review of data.reviews) {
      if (!review.reviewId || !review.orderId || !review.userId) {
        errors.push(`评价数据错误：${JSON.stringify(review)}`);
      }
      if (review.rating < 1 || review.rating > 5) {
        errors.push(`评价评分超出范围：${review.rating}`);
      }
    }
  }
  
  return errors;
}

// ==================== 主函数 ====================

function generateAllData() {
  console.log('🚀 开始生成模拟数据...');
  
  // 生成基础数据
  const users = generateUsers(80);
  console.log(`✅ 生成用户数据：${users.length} 条`);
  
  const executors = generateExecutors(25);
  console.log(`✅ 生成执行者数据：${executors.length} 条`);
  
  const organizations = generateOrganizations(8);
  console.log(`✅ 生成机构数据：${organizations.length} 条`);
  
  const volunteers = generateVolunteers(users, organizations, 40);
  console.log(`✅ 生成志愿者数据：${volunteers.length} 条`);
  
  const orders = generateOrders(users, executors, organizations, 150);
  console.log(`✅ 生成订单数据：${orders.length} 条`);
  
  const reviews = generateReviews(users, orders, 80);
  console.log(`✅ 生成评价数据：${reviews.length} 条`);
  
  // 验证数据
  console.log('\n🔍 验证数据...');
  const errors = validateData({ users, orders, reviews });
  if (errors.length > 0) {
    console.log('❌ 数据验证失败:');
    errors.forEach(e => console.log(`  - ${e}`));
  } else {
    console.log('✅ 数据验证通过');
  }
  
  // 保存数据
  console.log('\n💾 保存数据到文件...');
  const outputDir = path.join(__dirname, '..', 'data', 'mock');
  
  fs.writeFileSync(path.join(outputDir, 'users.json'), JSON.stringify(users, null, 2));
  fs.writeFileSync(path.join(outputDir, 'executors.json'), JSON.stringify(executors, null, 2));
  fs.writeFileSync(path.join(outputDir, 'organizations.json'), JSON.stringify(organizations, null, 2));
  fs.writeFileSync(path.join(outputDir, 'volunteers.json'), JSON.stringify(volunteers, null, 2));
  fs.writeFileSync(path.join(outputDir, 'orders.json'), JSON.stringify(orders, null, 2));
  fs.writeFileSync(path.join(outputDir, 'reviews.json'), JSON.stringify(reviews, null, 2));
  
  console.log('✅ 数据文件保存完成');
  
  // 生成统计信息
  const stats = {
    users: users.length,
    executors: executors.length,
    organizations: organizations.length,
    volunteers: volunteers.length,
    orders: orders.length,
    reviews: reviews.length,
    orderStatuses: {},
    serviceTypes: {},
    species: {}
  };
  
  // 统计订单状态分布
  orders.forEach(o => {
    stats.orderStatuses[o.status] = (stats.orderStatuses[o.status] || 0) + 1;
  });
  
  // 统计服务类型分布
  orders.forEach(o => {
    stats.serviceTypes[o.serviceType] = (stats.serviceTypes[o.serviceType] || 0) + 1;
  });
  
  // 统计物种分布
  orders.forEach(o => {
    stats.species[o.species] = (stats.species[o.species] || 0) + 1;
  });
  
  console.log('\n📊 数据统计:');
  console.log(`  用户总数：${stats.users}`);
  console.log(`  执行者总数：${stats.executors}`);
  console.log(`  机构总数：${stats.organizations}`);
  console.log(`  志愿者总数：${stats.volunteers}`);
  console.log(`  订单总数：${stats.orders}`);
  console.log(`  评价总数：${stats.reviews}`);
  console.log('\n  订单状态分布:');
  Object.entries(stats.orderStatuses).forEach(([status, count]) => {
    console.log(`    ${status}: ${count} (${(count / stats.orders * 100).toFixed(1)}%)`);
  });
  
  console.log('\n  服务类型分布:');
  Object.entries(stats.serviceTypes).forEach(([type, count]) => {
    console.log(`    ${type}: ${count} (${(count / stats.orders * 100).toFixed(1)}%)`);
  });
  
  return { users, executors, organizations, volunteers, orders, reviews, stats };
}

// 运行
if (require.main === module) {
  generateAllData();
}

module.exports = { generateAllData };
