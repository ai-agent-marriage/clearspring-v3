// pages/species/list.js
Page({
  data: {
    speciesList: [
      {
        id: 1,
        name: '红锦鲤',
        latinName: 'Cyprinus rubrofuscus',
        description: '常见观赏鱼，适宜淡水环境。具有极高的观赏价值，且在我国大部分淡水水系中均能自然生存。',
        image: 'https://example.com/koi.jpg',
        badge: 'allowed',
        badgeText: '可合规投放',
        tag: '淡水物种',
        tagIcon: 'water_drop'
      },
      {
        id: 2,
        name: '巴西龟',
        latinName: 'Trachemys scripta elegans',
        description: '外来入侵物种，严禁自然水域投放。其适应性强，会排挤本土龟类，破坏生态平衡。',
        image: 'https://example.com/turtle.jpg',
        badge: 'forbidden',
        badgeText: '禁止投放',
        tag: '生态威胁',
        tagIcon: 'warning'
      },
      {
        id: 3,
        name: '白鹭',
        latinName: 'Egretta garzetta',
        description: '国家二级保护动物，适宜湿地环境。放生需遵循相关野生动物保护法律法规。',
        image: 'https://example.com/egret.jpg',
        badge: 'allowed',
        badgeText: '可合规投放',
        tag: '湿地物种',
        tagIcon: 'forest'
      }
    ],
    categories: ['全部分类', '鱼类', '鸟类', '爬行类', '两栖类'],
    activeCategory: 0
  },

  onSearchInput(e) {
    console.log('Search:', e.detail.value);
  },

  onCategoryTap(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      activeCategory: index
    });
  },

  onCardTap(e) {
    const speciesId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/species/detail?id=${speciesId}`
    });
  },

  onLoad() {
    console.log('Species list page loaded');
  }
});
