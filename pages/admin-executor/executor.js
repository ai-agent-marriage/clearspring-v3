// 执行者管理
Page({
  data: {
    status: 'all',
    totalExecutors: 1256,
    verifiedCount: 1089,
    pendingCount: 142,
    activeCount: 856,
    pendingList: [
      {
        id: 1,
        name: '林清泉',
        avatar: '',
        organization: '慈心公益志愿协会',
        submitTime: '10 分钟前'
      },
      {
        id: 2,
        name: '陈静修',
        avatar: '',
        organization: '清如生态公益中心',
        submitTime: '30 分钟前'
      },
      {
        id: 3,
        name: '王志明',
        avatar: '',
        organization: '西湖护生志愿者联盟',
        submitTime: '1 小时前'
      }
    ],
    executorList: [
      {
        id: 1,
        name: '张志愿',
        avatar: '',
        organization: '慈心公益志愿协会',
        phone: '138****0001',
        status: 'verified',
        statusText: '已认证',
        completedTasks: 128,
        serviceHours: 352,
        rating: '4.9'
      },
      {
        id: 2,
        name: '李公益',
        avatar: '',
        organization: '清如生态公益中心',
        phone: '138****0002',
        status: 'verified',
        statusText: '已认证',
        completedTasks: 96,
        serviceHours: 268,
        rating: '4.8'
      },
      {
        id: 3,
        name: '王护生',
        avatar: '',
        organization: '西湖护生志愿者联盟',
        phone: '138****0003',
        status: 'pending',
        statusText: '待审核',
        completedTasks: 0,
        serviceHours: 0,
        rating: '--'
      }
    ]
  },

  onLoad() {
    this.loadExecutorData();
  },

  // 加载执行者数据
  loadExecutorData() {
    // TODO: 调用云函数获取执行者数据
    console.log('加载执行者数据');
  },

  // 搜索
  onSearch(e) {
    const keyword = e.detail.value;
    console.log('搜索关键词', keyword);
    // TODO: 实现搜索逻辑
  },

  // 切换状态筛选
  changeStatus(e) {
    const status = e.currentTarget.dataset.status;
    this.setData({ status });
    this.loadExecutorData();
  },

  // 通过审核
  approveExecutor(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认通过',
      content: '确认通过该执行者的资质审核？',
      success: (res) => {
        if (res.confirm) {
          console.log('通过审核', id);
          // TODO: 调用云函数更新状态
        }
      }
    });
  },

  // 拒绝审核
  rejectExecutor(e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '拒绝审核',
      content: '请填写拒绝原因',
      editable: true,
      success: (res) => {
        if (res.confirm && res.content) {
          console.log('拒绝审核', id, res.content);
          // TODO: 调用云函数更新状态
        }
      }
    });
  },

  // 查看详情
  viewDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/admin-executor-detail/detail?id=${id}`
    });
  },

  // 编辑执行者
  editExecutor(e) {
    const id = e.currentTarget.dataset.id;
    console.log('编辑执行者', id);
  },

  // 排序
  sortBy() {
    wx.showActionSheet({
      itemList: ['按完成任务排序', '按服务时长排序', '按评分排序', '按提交时间排序'],
      success: (res) => {
        console.log('排序方式', res.tapIndex);
      }
    });
  },

  // 添加执行者
  addExecutor() {
    wx.navigateTo({
      url: '/pages/admin-executor-add/add'
    });
  },

  // 切换菜单
  toggleMenu() {
    console.log('切换菜单');
  }
});
