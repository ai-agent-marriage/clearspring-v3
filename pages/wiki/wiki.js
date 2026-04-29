// pages/wiki/wiki.js

Page({
  data: {
    // 物种正面清单
    positiveList: [
      {
        id: 1,
        name: '鲤鱼',
        latin: 'Cyprinus carpio',
        description: '本地常见淡水鱼，适应性强，适合春季放生',
        category: '淡水鱼',
        season: '春秋',
        image: '/images/wiki/carp.png'
      },
      {
        id: 2,
        name: '鲫鱼',
        latin: 'Carassius auratus',
        description: '本土鲫鱼，生命力顽强，适合多种水域',
        category: '淡水鱼',
        season: '四季',
        image: '/images/wiki/crucian.png'
      },
      {
        id: 3,
        name: '泥鳅',
        latin: 'Misgurnus anguillicaudatus',
        description: '底栖鱼类，净化水质，适合夏季放生',
        category: '淡水鱼',
        season: '夏秋',
        image: '/images/wiki/loach.png'
      },
      {
        id: 4,
        name: '螺蛳',
        latin: 'Cipangopaludina chinensis',
        description: '本土田螺，滤食藻类，有助于水质净化',
        category: '软体动物',
        season: '春夏',
        image: '/images/wiki/snail.png'
      },
      {
        id: 5,
        name: '乌龟',
        latin: 'Mauremys reevesii',
        description: '中华草龟，本土龟种，需选择合适水域',
        category: '爬行动物',
        season: '春夏',
        image: '/images/wiki/turtle.png'
      }
    ],

    // 放生禁忌
    tabooList: [
      {
        id: 1,
        title: '禁止放生外来物种',
        description: '巴西龟、鳄龟、清道夫等外来物种会严重破坏本地生态系统，请勿放生'
      },
      {
        id: 2,
        title: '禁止在禁渔区放生',
        description: '饮用水源地、自然保护区等区域禁止放生活动'
      },
      {
        id: 3,
        title: '禁止放生养殖品种',
        description: '人工养殖的观赏鱼、速生鱼等不适合野外生存，放生等于杀生'
      },
      {
        id: 4,
        title: '禁止过量放生',
        description: '超出水域承载能力的放生会造成生态失衡，应适量适度'
      },
      {
        id: 5,
        title: '禁止在不适宜季节放生',
        description: '冬季水温过低时放生，动物难以存活，应选择适宜季节'
      }
    ],

    // 推荐水域
    waterList: [
      {
        id: 1,
        name: '钱塘江流域',
        distance: '5.2km',
        description: '杭州主要河流，水域宽阔，生态良好',
        features: ['淡水鱼', '大型水域', '生态保护区']
      },
      {
        id: 2,
        name: '西湖水域',
        distance: '8.1km',
        description: '需选择指定区域，适合小型放生活动',
        features: ['景区', '管理严格', '小型放生']
      },
      {
        id: 3,
        name: '富春江',
        distance: '15.3km',
        description: '水质清澈，生态环境优良，适合各类放生',
        features: ['优质水源', '生态良好', '大型水域']
      },
      {
        id: 4,
        name: '京杭大运河',
        distance: '3.5km',
        description: '历史河道，水流平缓，适合螺蛳等底栖生物',
        features: ['水流平缓', '城市河道', '底栖生物']
      }
    ]
  },

  onLoad() {
    // 页面加载
  },

  // 点击物种
  onSpeciesTap(e) {
    const species = e.currentTarget.dataset.species;
    wx.showModal({
      title: species.name,
      content: `${species.latin}\n\n${species.description}\n\n适放季节：${species.season}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 点击水域
  onWaterTap(e) {
    const water = e.currentTarget.dataset.water;
    wx.showModal({
      title: water.name,
      content: `${water.description}\n\n特点：${water.features.join('、')}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '清如科普百科 - 科学放生指南',
      path: '/pages/wiki/wiki',
      imageUrl: ''
    };
  }
});
