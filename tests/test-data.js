// 清如 ClearSpring - 测试数据
// 用于单元测试和集成测试的模拟数据

module.exports = {
  // 测试用户数据
  users: {
    prayer: {
      openid: 'oTest_Prayer_OpenID_12345',
      nickName: '祈福者测试',
      avatarUrl: 'https://example.com/prayer-avatar.png',
      gender: 1,
      phone: '13812345678',
      role: 'prayer'
    },
    executor: {
      openid: 'oTest_Executor_OpenID_67890',
      nickName: '执行者测试',
      avatarUrl: 'https://example.com/executor-avatar.png',
      gender: 2,
      phone: '13987654321',
      role: 'executor',
      executorProfile: {
        realName: '张*三',
        idCard: '4401********1234',
        qualificationStatus: 'approved',
        rating: 4.9,
        totalOrders: 127,
        totalIncome: 12580.00
      }
    },
    admin: {
      openid: 'oTest_Admin_OpenID_11111',
      nickName: '管理员',
      role: 'admin'
    }
  },

  // 测试物种数据
  species: [
    {
      id: 'species_001',
      name: '鲫鱼',
      latin: 'Carassius auratus',
      category: '淡水鱼',
      ecologicalNote: '本地物种，生命力顽强，适合多种水域',
      season: '四季',
      recommended: true
    },
    {
      id: 'species_002',
      name: '鲤鱼',
      latin: 'Cyprinus carpio',
      category: '淡水鱼',
      ecologicalNote: '本地常见淡水鱼，适应性强，适合春季放生',
      season: '春秋',
      recommended: true
    },
    {
      id: 'species_003',
      name: '泥鳅',
      latin: 'Misgurnus anguillicaudatus',
      category: '淡水鱼',
      ecologicalNote: '底栖鱼类，净化水质，适合夏季放生',
      season: '夏秋',
      recommended: true
    },
    {
      id: 'species_004',
      name: '螺蛳',
      latin: 'Cipangopaludina chinensis',
      category: '软体动物',
      ecologicalNote: '本土田螺，滤食藻类，有助于水质净化',
      season: '春夏',
      recommended: true
    },
    {
      id: 'species_005',
      name: '乌龟',
      latin: 'Mauremys reevesii',
      category: '爬行动物',
      ecologicalNote: '中华草龟，本土龟种，需选择合适水域',
      season: '春夏',
      recommended: true
    }
  ],

  // 测试订单数据
  orders: [
    {
      orderId: 'ORD202603290001',
      species: {
        id: 'species_001',
        name: '鲫鱼',
        category: '淡水鱼'
      },
      location: {
        province: '广东省',
        city: '广州市',
        district: '白云区',
        address: '白云山淡水湖',
        latitude: 23.1234,
        longitude: 113.2345,
        verified: true
      },
      wish: '愿家人平安健康',
      quantity: 100,
      guidePrice: 299.00,
      actualPrice: 299.00,
      status: 'pending',
      prayerId: 'oTest_Prayer_OpenID_12345',
      executorId: null
    },
    {
      orderId: 'ORD202603290002',
      species: {
        id: 'species_002',
        name: '鲤鱼',
        category: '淡水鱼'
      },
      location: {
        province: '广东省',
        city: '深圳市',
        district: '南山区',
        address: '深圳湾公园',
        latitude: 22.4833,
        longitude: 113.9167,
        verified: true
      },
      wish: '愿事业顺利',
      quantity: 50,
      guidePrice: 199.00,
      actualPrice: 199.00,
      status: 'grabbed',
      prayerId: 'oTest_Prayer_OpenID_12345',
      executorId: 'oTest_Executor_OpenID_67890'
    },
    {
      orderId: 'ORD202603290003',
      species: {
        id: 'species_003',
        name: '泥鳅',
        category: '淡水鱼'
      },
      location: {
        province: '广东省',
        city: '广州市',
        district: '天河区',
        address: '天河公园',
        latitude: 23.1333,
        longitude: 113.3667,
        verified: true
      },
      wish: '愿学业进步',
      quantity: 200,
      guidePrice: 399.00,
      actualPrice: 399.00,
      status: 'executing',
      prayerId: 'oTest_Prayer_OpenID_12345',
      executorId: 'oTest_Executor_OpenID_67890'
    }
  ],

  // 测试证据数据
  evidence: [
    {
      orderId: 'ORD202603290002',
      type: 'video',
      fileName: 'evidence_video.mp4',
      fileSize: 10485760, // 10MB
      fileType: 'video/mp4',
      duration: 15.5,
      watermark: {
        enabled: true,
        gps: '22.4833, 113.9167',
        timestamp: Date.now(),
        taskId: 'ORD202603290002'
      }
    },
    {
      orderId: 'ORD202603290002',
      type: 'photo',
      fileName: 'evidence_photo1.jpg',
      fileSize: 2097152, // 2MB
      fileType: 'image/jpeg',
      watermark: {
        enabled: true,
        gps: '22.4833, 113.9167',
        timestamp: Date.now(),
        taskId: 'ORD202603290002'
      }
    }
  ],

  // 测试推荐水域
  waterLocations: [
    {
      id: 'water_001',
      name: '钱塘江流域',
      distance: '5.2km',
      description: '杭州主要河流，水域宽阔，生态良好',
      features: ['淡水鱼', '大型水域', '生态保护区'],
      latitude: 30.2592,
      longitude: 120.1694
    },
    {
      id: 'water_002',
      name: '西湖水域',
      distance: '8.1km',
      description: '需选择指定区域，适合小型放生活动',
      features: ['景区', '管理严格', '小型放生'],
      latitude: 30.2441,
      longitude: 120.1488
    },
    {
      id: 'water_003',
      name: '富春江',
      distance: '15.3km',
      description: '水质清澈，生态环境优良，适合各类放生',
      features: ['优质水源', '生态良好', '大型水域'],
      latitude: 29.7658,
      longitude: 119.6742
    }
  ],

  // 测试时间戳
  timestamps: {
    now: Date.now(),
    yesterday: Date.now() - 24 * 60 * 60 * 1000,
    lastWeek: Date.now() - 7 * 24 * 60 * 60 * 1000,
    lastMonth: Date.now() - 30 * 24 * 60 * 60 * 1000
  },

  // 辅助函数：生成测试订单号
  generateOrderId: function(date = new Date()) {
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `ORD${dateStr}${random}`;
  },

  // 辅助函数：生成测试用户
  generateUser: function(role = 'prayer') {
    const random = Math.random().toString(36).slice(2, 8);
    return {
      openid: `oTest_${role.toUpperCase()}_OpenID_${random}`,
      nickName: `${role}测试${random}`,
      avatarUrl: `https://example.com/${role}-avatar.png`,
      role: role
    };
  }
};
