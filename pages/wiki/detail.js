// pages/wiki/detail.js

Page({
  data: {
    // 详情类型：species(物种) | knowledge(知识) | guide(指南)
    detailType: 'species',
    
    // 物种详情数据
    speciesData: {
      id: 1,
      name: '鲤鱼',
      latin: 'Cyprinus carpio',
      category: '淡水鱼',
      season: '春秋',
      habitat: '江河、湖泊、水库等淡水水域',
      diet: '杂食性，以水生昆虫、藻类、植物碎屑为食',
      features: ['适应性强', '生命力顽强', '本地原生物种'],
      description: '鲤鱼是本地常见淡水鱼，适应性强，适合春季放生。鲤鱼属于杂食性鱼类，容易存活，是放生的理想选择。',
      image: '/images/wiki/carp.png',
      tips: [
        '选择水温适宜的季节（15-25℃）',
        '避免在污染水域放生',
        '放生时轻缓放入水中，避免高空抛掷',
        '选择流动水域，避免静水池塘'
      ],
      warnings: [
        '不要放生到饮用水源地',
        '避免过量放生造成生态压力',
        '不要放生人工培育的观赏品种'
      ]
    },

    // 护生知识详情
    knowledgeData: {
      id: 1,
      title: '科学放生的意义',
      author: '清如生态研究中心',
      publishDate: '2024-01-15',
      readCount: 1256,
      content: `科学放生是指遵循生态学原理，选择本地原生物种，在合适的时间、地点进行适量放生的行为。

**为什么要科学放生？**

1. 保护本地生态系统：外来物种可能破坏本地生态平衡
2. 提高放生动物存活率：合适的季节和水域能让动物更好地生存
3. 避免法律风险：某些放生行为可能违反野生动物保护法规

**如何做到科学放生？**

- 选择本地原生物种
- 咨询专业人士或机构
- 选择合适的水域和季节
- 控制放生数量，避免过量
- 采用正确的放生方法

**放生的真正意义**

放生不仅是宗教仪式，更是对生命的尊重和对生态环境的保护。每一次如法的放生，都是在积累福德，也是在为地球生态做出贡献。`,
      tags: ['科学放生', '生态保护', '护生知识']
    },

    // 合规指南详情
    guideData: {
      id: 1,
      title: '放生活动法律法规指南',
      category: '法律法规',
      updateTime: '2024-01-01',
      content: `**相关法律法规**

1. 《中华人民共和国野生动物保护法》
   - 禁止随意放生外来物种
   - 放生应当选择适合放生地野外生存的当地物种
   - 不得干扰当地居民的正常生活、生产

2. 《水生生物增殖放流管理规定》
   - 放生应当符合水生生物增殖放流发展规划
   - 不得使用有性杂交种、转基因种等
   - 应当采取适当措施防止对捕捞者造成损害

3. 《生物安全法》
   - 防范外来物种入侵
   - 保护生物多样性

**违规处罚**

- 擅自释放或丢弃外来物种：处 1-5 万元罚款
- 造成生态损害的：承担修复和赔偿责任
- 情节严重的：追究刑事责任

**合规建议**

1. 提前向当地渔业部门咨询
2. 选择合法的放生场所
3. 使用本地原生物种
4. 控制放生规模
5. 做好放生记录`,
      references: [
        '《中华人民共和国野生动物保护法》',
        '《水生生物增殖放流管理规定》',
        '《中华人民共和国生物安全法》'
      ]
    },

    // 收藏状态
    isFavorite: false,
    
    // 分享数据
    shareData: {
      title: '',
      path: '',
      imageUrl: ''
    }
  },

  onLoad(options) {
    const { type, id } = options;
    this.setData({ detailType: type || 'species' });
    
    // 根据类型加载数据
    this.loadDetailData(type, id);
  },

  // 加载详情数据
  loadDetailData(type, id) {
    // 这里应该调用 API 获取数据，暂时使用 mock 数据
    let shareTitle = '';
    
    switch(type) {
      case 'species':
        shareTitle = `物种百科 - ${this.data.speciesData.name}`;
        break;
      case 'knowledge':
        shareTitle = `护生知识 - ${this.data.knowledgeData.title}`;
        break;
      case 'guide':
        shareTitle = `合规指南 - ${this.data.guideData.title}`;
        break;
    }
    
    this.setData({
      'shareData.title': shareTitle,
      'shareData.path': `/pages/wiki/detail?type=${type}&id=${id}`
    });
  },

  // 收藏/取消收藏
  toggleFavorite() {
    const isFavorite = !this.data.isFavorite;
    this.setData({ isFavorite });
    
    wx.showToast({
      title: isFavorite ? '已收藏' : '已取消收藏',
      icon: 'none'
    });
  },

  // 分享
  onShareAppMessage() {
    return {
      title: this.data.shareData.title,
      path: this.data.shareData.path,
      imageUrl: this.data.shareData.imageUrl
    };
  },

  // 返回首页
  goHome() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  },

  // 返回列表
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  }
});
