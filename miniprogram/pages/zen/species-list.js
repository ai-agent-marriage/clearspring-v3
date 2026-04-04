// pages/zen/species-list.js
// 物种查询列表页

Page({
  data: {
    categories: ['全部分类', '鱼类', '鸟类', '两栖类', '爬行类'],
    currentCategory: '全部分类',
    searchKeyword: '',
    speciesList: [
      {
        id: 1,
        name: '鲢鱼',
        scientificName: 'Hypophthalmichthys molitrix',
        type: 1,
        isForbid: 0,
        remark: '原生淡水鱼类，适宜江河湖泊投放，净化水质'
      },
      {
        id: 2,
        name: '清道夫',
        scientificName: 'Pterygoplichthys',
        type: 1,
        isForbid: 1,
        remark: '入侵物种，严禁自然水域投放'
      },
      {
        id: 3,
        name: '鲫鱼',
        scientificName: 'Carassius auratus',
        type: 1,
        isForbid: 0,
        remark: '常见淡水鱼类，适应性强，适宜投放'
      },
      {
        id: 4,
        name: '巴西龟',
        scientificName: 'Trachemys scripta elegans',
        type: 4,
        isForbid: 1,
        remark: '外来入侵物种，严重破坏生态平衡'
      },
      {
        id: 5,
        name: '泥鳅',
        scientificName: 'Misgurnus anguillicaudatus',
        type: 1,
        isForbid: 0,
        remark: '原生底栖鱼类，适宜静水环境'
      },
      {
        id: 6,
        name: '白鹭',
        scientificName: 'Egretta garzetta',
        type: 2,
        isForbid: 0,
        remark: '国家三有保护动物，禁止捕捉和投放'
      }
    ]
  },

  onLoad() {
  },

  /**
   * 搜索输入
   */
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.filterSpecies();
  },

  /**
   * 切换分类
   */
  onCategoryTap(e) {
    const { category } = e.currentTarget.dataset;
    this.setData({
      currentCategory: category
    });
    this.filterSpecies();
  },

  /**
   * 筛选物种
   */
  filterSpecies() {
    const { searchKeyword, currentCategory, speciesList } = this.data;
    
    let filtered = speciesList;

    if (currentCategory !== '全部分类') {
      const typeMap = {
        '鱼类': 1,
        '鸟类': 2,
        '两栖类': 3,
        '爬行类': 4
      };
      const type = typeMap[currentCategory];
      filtered = filtered.filter(item => item.type === type);
    }

    if (searchKeyword) {
      filtered = filtered.filter(item => 
        item.name.includes(searchKeyword) || 
        item.scientificName.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    this.setData({
      speciesList: filtered
    });
  },

  /**
   * 跳转详情页
   */
  onSpeciesTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/zen/species-detail?id=${id}`
    });
  }
});
