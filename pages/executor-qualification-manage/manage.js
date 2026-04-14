// 清如 ClearSpring - 资质管理页 (O-10)

Page({
  data: {
    status: {
      verified: true,
      lastCheck: '2024-05-12'
    },
    institution: {
      name: '生态守护（北京）环境科技有限公司',
      code: '91110108MA017XXXXX',
      legal: '张建国 (110108********001X)',
      address: '北京市朝阳区林翠东路甲 1 号院森林公园北区'
    },
    docList: [
      {
        id: 1,
        name: '营业执照',
        thumb: 'https://example.com/doc1.jpg'
      },
      {
        id: 2,
        name: '护生资质证明',
        thumb: 'https://example.com/doc2.jpg'
      },
      {
        id: 3,
        name: '水域合作协议',
        thumb: 'https://example.com/doc3.jpg'
      }
    ]
  },

  onLoad() {
    console.log('资质管理页加载');
    // TODO: 加载资质数据
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onEdit(e) {
    const { field } = e.currentTarget.dataset;
    console.log('编辑字段:', field);
    // TODO: 打开编辑表单
    wx.showToast({ title: '编辑', icon: 'none' });
  },

  onPreview(e) {
    const { id } = e.currentTarget.dataset;
    console.log('预览文档:', id);
    // TODO: 预览文档
    wx.showToast({ title: '预览', icon: 'none' });
  },

  onUpdate(e) {
    const { id } = e.currentTarget.dataset;
    console.log('更新文档:', id);
    // TODO: 更新文档
    wx.showToast({ title: '更新', icon: 'none' });
  }
});
