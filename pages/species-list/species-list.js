// pages/species-list/species-list.js
const app = getApp();

Page({
  data: {
    keyword: '',
    currentCategory: 'all',
    categories: [
      { label: '全部', value: 'all' },
      { label: '鱼类', value: 'fish' },
      { label: '鸟类', value: 'bird' },
      { label: '两栖', value: 'amphibian' },
      { label: '爬行', value: 'reptile' }
    ],
    speciesList: [],
    page: 1,
    pageSize: 20,
    total: 0,
    hasMore: true,
    loading: false,
    loadingMore: false
  },

  onLoad() {
    this.loadSpeciesList();
  },

  onPullDownRefresh() {
    this.refresh();
  },

  // 加载物种列表
  async loadSpeciesList(isRefresh = false) {
    if (this.data.loading || (this.data.loadingMore && !isRefresh)) return;

    if (isRefresh) {
      this.setData({ loading: true });
    } else {
      this.setData({ loadingMore: true });
    }

    try {
      const { keyword, currentCategory, page, pageSize } = this.data;
      
      const res = await app.api.request({
        url: '/api/v1/species/list',
        method: 'GET',
        data: {
          category: currentCategory === 'all' ? '' : currentCategory,
          keyword,
          page: isRefresh ? 1 : page,
          page_size: pageSize
        }
      });

      if (res.code === 200) {
        const { list, total } = res.data;
        const newPage = isRefresh ? 1 : page + 1;
        
        this.setData({
          speciesList: isRefresh ? list : [...this.data.speciesList, ...list],
          page: newPage,
          total,
          hasMore: (newPage * pageSize) < total,
          loading: false,
          loadingMore: false
        });
      } else {
        this.handleError(res.message);
      }
    } catch (error) {
      console.error('加载物种列表失败:', error);
      this.handleError('网络异常，请稍后重试');
    }
  },

  // 刷新
  refresh() {
    this.setData({ page: 1, speciesList: [] });
    this.loadSpeciesList(true).then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载更多
  loadMore() {
    if (this.data.hasMore && !this.data.loadingMore) {
      this.loadSpeciesList(false);
    }
  },

  // 关键词输入
  onKeywordInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  // 清空搜索
  onClear() {
    this.setData({ keyword: '' });
    this.refresh();
  },

  // 搜索
  onSearch() {
    this.refresh();
  },

  // 分类切换
  onCategoryChange(e) {
    const value = e.currentTarget.dataset.value;
    if (value !== this.data.currentCategory) {
      this.setData({ currentCategory: value });
      this.refresh();
    }
  },

  // 点击物种
  onSpeciesTap(e) {
    const species = e.currentTarget.dataset.species;
    wx.navigateTo({
      url: `/pages/species-detail/species-detail?species_id=${species.species_id}`
    });
  },

  // 错误处理
  handleError(message) {
    this.setData({ loading: false, loadingMore: false });
    wx.showToast({ title: message || '加载失败', icon: 'none' });
  },

  // 分享给好友
  onShareAppMessage() {
    return {
      title: '护生物种查询 - 清如',
      path: '/pages/species-list/species-list'
    };
  }
});
