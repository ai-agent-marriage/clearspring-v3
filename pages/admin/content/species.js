// 清如 ClearSpring - 物种管理页面

Page({
  data: {
    showFilter: false,
    filterType: 'all',
    filterStatus: 'all',
    searchKeyword: '',
    speciesList: [
      {
        id: 1,
        name: '鲢鱼',
        scientificName: 'Hypophthalmichthys molitrix',
        type: 1,
        typeName: '鱼类',
        isForbid: 0,
        statusName: '可投放'
      },
      {
        id: 2,
        name: '清道夫',
        scientificName: 'Pterygoplichthys',
        type: 1,
        typeName: '鱼类',
        isForbid: 1,
        statusName: '禁止投放'
      },
      {
        id: 3,
        name: '麻雀',
        scientificName: 'Passer montanus',
        type: 2,
        typeName: '鸟类',
        isForbid: 0,
        statusName: '可投放'
      },
      {
        id: 4,
        name: '乌龟',
        scientificName: 'Chinemys reevesii',
        type: 3,
        typeName: '其他',
        isForbid: 0,
        statusName: '可投放'
      }
    ],
    // 筛选选项
    typeOptions: [
      { label: '全部', value: 'all' },
      { label: '鱼类', value: '1' },
      { label: '鸟类', value: '2' },
      { label: '其他', value: '3' }
    ],
    statusOptions: [
      { label: '全部', value: 'all' },
      { label: '可投放', value: '0' },
      { label: '禁止投放', value: '1' }
    ]
  },

  onLoad(options) {
    console.log('物种管理页面加载');
    this.loadSpeciesList();
  },

  onShow() {
    this.refreshSpeciesList();
  },

  onPullDownRefresh() {
    this.refreshSpeciesList().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  
  async loadSpeciesList() {
    try {
      // TODO: 实际从云函数获取物种列表
      console.log('加载物种列表');
    } catch (error) {
      console.error('加载物种列表失败:', error);
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    }
  },

  async refreshSpeciesList() {
    try {
      // TODO: 实际从云函数刷新物种列表
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log('物种列表刷新完成');
    } catch (error) {
      console.error('刷新物种列表失败:', error);
    }
  },

  // ========== 事件处理 ==========
  
  // 切换筛选栏
  onToggleFilter() {
    this.setData({
      showFilter: !this.data.showFilter
    });
  },

  // 搜索框输入
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
    this.filterSpecies();
  },

  // 筛选类型变化
  onTypeChange(e) {
    this.setData({
      filterType: e.detail.value
    });
    this.filterSpecies();
  },

  // 筛选状态变化
  onStatusChange(e) {
    this.setData({
      filterStatus: e.detail.value
    });
    this.filterSpecies();
  },

  // 筛选物种列表
  filterSpecies() {
    const { searchKeyword, filterType, filterStatus, speciesList } = this.data;
    
    let filtered = speciesList.filter(item => {
      // 搜索关键词筛选
      if (searchKeyword && !item.name.includes(searchKeyword)) {
        return false;
      }
      
      // 类型筛选
      if (filterType !== 'all' && item.type.toString() !== filterType) {
        return false;
      }
      
      // 状态筛选
      if (filterStatus !== 'all' && item.isForbid.toString() !== filterStatus) {
        return false;
      }
      
      return true;
    });
    
    this.setData({
      speciesList: filtered
    });
  },

  // 点击物种卡片
  onSpeciesTap(e) {
    const { id } = e.currentTarget.dataset;
    console.log('点击物种:', id);
    
    wx.navigateTo({
      url: `/pages/admin/content/species-detail?id=${id}`
    });
  },

  // 编辑物种
  onEditSpecies(e) {
    const { id } = e.currentTarget.dataset;
    console.log('编辑物种:', id);
    
    wx.navigateTo({
      url: `/pages/admin/content/species-edit?id=${id}&action=edit`
    });
  },

  // 删除物种
  onDeleteSpecies(e) {
    const { id, name } = e.currentTarget.dataset;
    console.log('删除物种:', id, name);
    
    wx.showModal({
      title: '确认删除',
      content: `确定要删除物种"${name}"吗？此操作不可恢复。`,
      confirmColor: '#D4B87B',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用删除 API
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
          
          // 从列表中移除
          const newSpeciesList = this.data.speciesList.filter(item => item.id !== id);
          this.setData({
            speciesList: newSpeciesList
          });
        }
      }
    });
  },

  // 新增物种
  onAddSpecies() {
    wx.navigateTo({
      url: '/pages/admin/content/species-edit?action=add'
    });
  },

  // 查看详情
  onViewDetail(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/admin/content/species-detail?id=${id}`
    });
  }
});
