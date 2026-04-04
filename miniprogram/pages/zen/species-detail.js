// pages/zen/species-detail.js
// 物种详情页

Page({
  data: {
    species: {
      id: 1,
      name: '鲢鱼',
      scientificName: 'Hypophthalmichthys molitrix',
      protectLevel: '无',
      suitableHabitat: '淡水江河、湖泊、水库',
      bestTime: '每年 3-6 月、9-11 月',
      remark: '原生滤食性鱼类，可有效净化水体富营养化',
      isForbid: 0,
      culture: '鲢鱼寓意"连年有余"，象征富足吉祥',
      requirements: '1. 选择无污染水域\n2. 控制投放密度\n3. 避免高温季节投放',
      warnings: '请勿在饮用水源保护区投放'
    }
  },

  onLoad(options) {
    const { id } = options
    if (id) {
      this.loadSpeciesDetail(id)
    }
  },

  /**
   * 加载物种详情
   */
  loadSpeciesDetail(id) {
    const speciesData = {
      1: {
        id: 1,
        name: '鲢鱼',
        scientificName: 'Hypophthalmichthys molitrix',
        protectLevel: '无',
        suitableHabitat: '淡水江河、湖泊、水库',
        bestTime: '每年 3-6 月、9-11 月',
        remark: '原生滤食性鱼类，可有效净化水体富营养化',
        isForbid: 0,
        culture: '鲢鱼寓意"连年有余"，象征富足吉祥',
        requirements: '1. 选择无污染水域\n2. 控制投放密度\n3. 避免高温季节投放',
        warnings: '请勿在饮用水源保护区投放'
      },
      2: {
        id: 2,
        name: '清道夫',
        scientificName: 'Pterygoplichthys',
        protectLevel: '无',
        suitableHabitat: '无',
        bestTime: '无',
        remark: '入侵物种，严重破坏生态平衡',
        isForbid: 1,
        culture: '',
        requirements: '',
        warnings: '严禁投放！发现请立即上报'
      }
    }

    const species = speciesData[id] || this.data.species
    this.setData({ species })
  },

  /**
   * 去护生
   */
  onReleaseTap() {
    const { isForbid } = this.data.species
    
    if (isForbid) {
      wx.showToast({
        icon: 'none',
        title: '该物种禁止投放'
      })
      return
    }

    wx.navigateTo({
      url: '/pages/release/release'
    })
  }
})
