// pages/species-detail/species-detail.js
const app = getApp();

Page({
  data: {
    loading: true,
    species_id: '',
    species: {
      species_id: '',
      name: '',
      scientific_name: '',
      common_names: [],
      category: '',
      category_text: '',
      protection_level: '',
      is_releasable: false,
      cover_url: '',
      images: [],
      description: '',
      cultural_meaning: '',
      suitable_habitat: '',
      best_release_season: '',
      release_requirements: [],
      warnings: [],
      legal_basis: ''
    },
    currentImageIndex: 0
  },

  onLoad(options) {
    if (options.species_id) {
      this.setData({ species_id: options.species_id });
      this.fetchSpeciesDetail();
    } else {
      wx.showToast({ title: '参数错误', icon: 'none' });
      setTimeout(() => wx.navigateBack(), 1500);
    }
  },

  // 获取物种详情
  async fetchSpeciesDetail() {
    try {
      const res = await app.api.request({
        url: '/api/v1/species/detail',
        method: 'GET',
        data: {
          species_id: this.data.species_id
        }
      });

      if (res.code === 200) {
        const species = res.data;
        // 分类文本映射
        const categoryMap = {
          fish: '鱼类',
          bird: '鸟类',
          amphibian: '两栖类',
          reptile: '爬行类'
        };
        species.category_text = categoryMap[species.category] || species.category;

        this.setData({ 
          species,
          loading: false
        });
        wx.setNavigationBarTitle({ title: species.name });
      } else {
        this.handleError(res.message || '加载失败');
      }
    } catch (error) {
      console.error('获取物种详情失败:', error);
      this.handleError('网络异常，请稍后重试');
    }
  },

  // 预览图片
  onPreviewImage(e) {
    const index = e.currentTarget.dataset.index;
    wx.previewImage({
      urls: this.data.species.images,
      current: index
    });
  },

  // 点击护生按钮
  onProtectTap() {
    const species = this.data.species;
    wx.navigateTo({
      url: `/pages/protect-self-register/protect-self-register?species_id=${species.species_id}&species_name=${species.name}`
    });
  },

  // 错误处理
  handleError(message) {
    this.setData({ loading: false });
    wx.showModal({
      title: '加载失败',
      content: message,
      showCancel: false,
      confirmText: '返回',
      success: () => {
        wx.navigateBack();
      }
    });
  },

  // 分享给好友
  onShareAppMessage() {
    const species = this.data.species;
    return {
      title: `${species.name} - 护生物种详情`,
      path: `/pages/species-detail/species-detail?species_id=${species.species_id}`,
      imageUrl: species.cover_url
    };
  }
});
