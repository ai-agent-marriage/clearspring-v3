// 机构资质管理
Page({
  data: {
    status: 'all',
    totalOrgs: 156,
    verifiedOrgs: 128,
    pendingOrgs: 24,
    expiredOrgs: 4,
    pendingList: [
      {
        id: 1,
        name: '慈心公益志愿协会',
        creditCode: '91330000MA2XXXXX',
        submitTime: '10 分钟前',
        documents: [
          { id: 1, name: '营业执照' },
          { id: 2, name: '组织机构代码证' },
          { id: 3, name: '公益资质证明' }
        ]
      },
      {
        id: 2,
        name: '清如生态公益中心',
        creditCode: '91330000MA2YYYYY',
        submitTime: '1 小时前',
        documents: [
          { id: 1, name: '营业执照' },
          { id: 2, name: '法人身份证' }
        ]
      }
    ],
    orgList: [
      {
        id: 1,
        name: '慈心公益志愿协会',
        logoColor: '#D3E8D5',
        creditCode: '91330000MA2XXXXX',
        contact: '张先生',
        status: 'verified',
        statusText: '已认证',
        executorCount: 256,
        taskCount: 128,
        completeRate: 98
      },
      {
        id: 2,
        name: '清如生态公益中心',
        logoColor: '#FEE264',
        creditCode: '91330000MA2YYYYY',
        contact: '李女士',
        status: 'verified',
        statusText: '已认证',
        executorCount: 189,
        taskCount: 96,
        completeRate: 96
      },
      {
        id: 3,
        name: '西湖护生志愿者联盟',
        logoColor: '#D3E8D5',
        creditCode: '91330000MA2ZZZZZ',
        contact: '王先生',
        status: 'pending',
        statusText: '待审核',
        executorCount: 0,
        taskCount: 0,
        completeRate: 0
      }
    ]
  },

  onLoad() {
    this.loadOrgData();
  },

  // 加载机构数据
  loadOrgData() {
    // [CLEANED] console.log('加载机构数据');
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value;
    // [CLEANED] console.log('搜索关键词', keyword);
  },

  // 切换状态筛选
  changeStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ status });
    this.loadOrgData();
  },

  // 通过审核
  approveOrg(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认通过',
      content: '确认通过该机构的资质审核？',
      success: (res) => {
        if (res.confirm) {
          // [CLEANED] console.log('通过审核', id);
        }
      }
    });
  },

  // 拒绝审核
  rejectOrg(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '拒绝审核',
      content: '请填写拒绝原因',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          // [CLEANED] console.log('拒绝审核', id, res.content);
        }
      }
    });
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-qualification-org-detail/detail?id=${id}`
    });
  },

  // 编辑机构
  editOrg(e) {
    const id = e.currentTarget.dataset.id;
    // [CLEANED] console.log('编辑机构', id);
  },

  // 管理执行者
  manageExecutors(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-executor?orgId=${id}`
    });
  },

  // 排序
  sortBy() {
    wx.showActionSheet({
      itemList: ['按执行者数量排序', '按任务数量排序', '按完成率排序', '按提交时间排序'],
      success: (res) => {
        // [CLEANED] console.log('排序方式', res.tapIndex);
      }
    });
  },

  // 添加机构
  addOrganization() {
    wx.navigateTo({
      url: '/pages/admin-qualification-org-add/add'
    });
  },

  // 切换菜单
  toggleMenu() {
    // [CLEANED] console.log('切换菜单');
  }
});
