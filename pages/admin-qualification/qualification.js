// 资质审核页面
Page({
  data: {
    currentTab: 0,
    qualifications: [
      {
        id: 'ORG20240501',
        orgName: '清如公益中心',
        type: '公益组织资质',
        creditCode: '51330000MJ9876543X',
        legalRep: '张静修',
        registeredCapital: '100 万元',
        applyTime: '2024-05-01 10:30',
        status: 'pending',
        documents: [
          '组织机构代码证',
          '法人身份证',
          '银行开户许可证',
          '公益活动记录',
          '年度审计报告'
        ]
      },
      {
        id: 'GOV20240415',
        orgName: '西湖园林局',
        type: '政府机构资质',
        creditCode: '11330100002345678Y',
        legalRep: '李明远',
        applyTime: '2024-04-15 09:00',
        auditTime: '2024-04-16 14:30',
        status: 'approved'
      },
      {
        id: 'REL20240410',
        orgName: '灵隐寺文物保护委员会',
        type: '宗教场所资质',
        creditCode: '51330100MJ1234567Z',
        legalRep: '慧明法师',
        rejectReason: '材料不完整，缺少宗教活动场所登记证',
        status: 'rejected'
      }
    ]
  },

  onLoad() {
    // 加载资质列表
  },

  // 返回上一页
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },

  // 显示筛选
  showFilter() {
    console.log('显示筛选');
  },

  // 搜索输入
  onSearchInput(e) {
    const keyword = e.detail.value;
    console.log('搜索关键词:', keyword);
  },

  // 切换 Tab
  switchTab(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      currentTab: index
    });
  },

  // 通过资质
  approveQualification(e) {
    const qualId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认通过',
      content: '确认通过该资质审核？',
      success: (res) => {
        if (res.confirm) {
          console.log('通过资质:', qualId);
          wx.showToast({
            title: '已通过',
            icon: 'success'
          });
        }
      }
    });
  },

  // 拒绝资质
  rejectQualification(e) {
    const qualId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认拒绝',
      content: '请填写拒绝原因',
      editable: true,
      success: (res) => {
        if (res.confirm) {
          console.log('拒绝资质:', qualId, '原因:', res.content);
          wx.showToast({
            title: '已拒绝',
            icon: 'success'
          });
        }
      }
    });
  },

  // 查看资质详情
  viewQualificationDetail(e) {
    const qualId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-qualification/detail?id=${qualId}`
    });
  }
});
