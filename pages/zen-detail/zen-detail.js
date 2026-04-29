// 每日一禅详情&分享页
const app = getApp();

Page({
  data: {
    // 当前禅理
    wisdom: {
      id: 'wisdom_001',
      category: '金刚经',
      text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。',
      source: '金刚经·第三十二品',
      isCollected: false
    },
    // 收藏状态
    isCollected: false,
    // 相关禅理
    relatedWisdoms: [
      { id: 'wisdom_002', text: '菩提本无树，明镜亦非台，本来无一物，何处惹尘埃。', source: '六祖坛经' },
      { id: 'wisdom_003', text: '色不异空，空不异色，色即是空，空即是色。', source: '心经' },
      { id: 'wisdom_004', text: '人生得意须尽欢，莫使金樽空对月。', source: '李白' },
      { id: 'wisdom_005', text: '行到水穷处，坐看云起时。', source: '王维' }
    ],
    // 海报弹窗
    showPosterModal: false,
    posterImageUrl: ''
  },

  onLoad(options) {
    // 获取传递的禅理ID
    const wisdomId = options.id || 'wisdom_001';
    this.loadWisdom(wisdomId);
    
    // 检查收藏状态
    this.checkCollectStatus();
  },

  onShow() {
    // 页面显示时刷新数据
    this.checkCollectStatus();
  },

  // 加载禅理内容
  loadWisdom(wisdomId) {
    // 从云函数或本地存储加载禅理
    const allWisdoms = [
      { id: 'wisdom_001', category: '金刚经', text: '一切有为法，如梦幻泡影，如露亦如电，应作如是观。', source: '金刚经·第三十二品' },
      { id: 'wisdom_002', category: '六祖坛经', text: '菩提本无树，明镜亦非台，本来无一物，何处惹尘埃。', source: '六祖坛经' },
      { id: 'wisdom_003', category: '心经', text: '色不异空，空不异色，色即是空，空即是色。', source: '心经' },
      { id: 'wisdom_004', category: '唐诗', text: '人生得意须尽欢，莫使金樽空对月。', source: '李白·将进酒' },
      { id: 'wisdom_005', category: '唐诗', text: '行到水穷处，坐看云起时。', source: '王维·终南别业' }
    ];
    
    const wisdom = allWisdoms.find(w => w.id === wisdomId);
    if (wisdom) {
      this.setData({ wisdom });
    }
  },

  // 检查收藏状态
  checkCollectStatus() {
    const collectedIds = wx.getStorageSync('collectedWisdomIds') || [];
    const isCollected = collectedIds.includes(this.data.wisdom.id);
    this.setData({ isCollected });
  },

  // 收藏禅理
  collectWisdom() {
    const wisdomId = this.data.wisdom.id;
    let collectedIds = wx.getStorageSync('collectedWisdomIds') || [];
    
    if (this.data.isCollected) {
      // 取消收藏
      collectedIds = collectedIds.filter(id => id !== wisdomId);
      wx.showToast({ title: '已取消收藏', icon: 'none' });
    } else {
      // 添加收藏
      collectedIds.push(wisdomId);
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }
    
    wx.setStorageSync('collectedWisdomIds', collectedIds);
    this.setData({ isCollected: !this.data.isCollected });
  },

  // 复制文本
  copyText() {
    const wisdom = this.data.wisdom;
    const text = `${wisdom.text} —— ${wisdom.source}`;
    wx.setClipboardData({
      data: text,
      success: () => {
        wx.showToast({ title: '已复制到剪贴板', icon: 'success' });
      }
    });
  },

  // 分享给朋友
  shareWechat() {
    const wisdom = this.data.wisdom;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage']
    });
    
    wx.setShareInfo({
      title: `每日一禅：${wisdom.source}`,
      content: wisdom.text,
      imageUrl: '/images/share-wisdom.png'
    });
  },

  // 分享到朋友圈
  shareTimeline() {
    const wisdom = this.data.wisdom;
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareTimeline']
    });
    
    wx.setShareInfo({
      title: `每日一禅：${wisdom.source}`,
      query: `id=${wisdom.id}`,
      imageUrl: '/images/share-wisdom-timeline.png'
    });
  },

  // 分享海报
  sharePoster() {
    // 生成海报图片
    this.generatePoster();
  },

  // 生成海报
  generatePoster() {
    wx.showLoading({ title: '生成海报中...' });
    
    // 模拟海报生成（实际项目中需要使用 Canvas 或后端生成）
    setTimeout(() => {
      wx.hideLoading();
      this.setData({ 
        showPosterModal: true,
        posterImageUrl: '/images/wisdom-poster.png' // 实际应该是生成的海报路径
      });
    }, 1000);
  },

  // 保存海报
  savePoster() {
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImageUrl,
      success: () => {
        wx.showToast({ title: '已保存到相册', icon: 'success' });
        this.closePosterModal();
      },
      fail: (err) => {
        console.error('保存失败:', err);
        wx.showToast({ title: '保存失败', icon: 'none' });
      }
    });
  },

  // 关闭海报弹窗
  closePosterModal() {
    this.setData({ showPosterModal: false });
  },

  // 防止弹窗滚动穿透
  preventMove() {
    return;
  },

  // 选择相关禅理
  selectRelated(e) {
    const wisdomId = e.currentTarget.dataset.id;
    this.loadWisdom(wisdomId);
    this.checkCollectStatus();
  },

  // 查看全部
  viewAll() {
    wx.navigateTo({ url: '/pages/wisdom-list/wisdom-list' });
  },

  // 返回上一页
  goBack() {
    wx.navigateBack();
  }
});
