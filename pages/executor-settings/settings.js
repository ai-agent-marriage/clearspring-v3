// 清如 ClearSpring - 机构账户设置页 (O-12)

Page({
  data: {
    userList: [
      {
        id: 1,
        name: '李明德 (管理者)',
        email: 'limingde@temple-institute.org',
        avatar: 'https://example.com/avatar1.jpg',
        role: 'admin',
        roleText: 'ADMIN',
        status: 'active'
      },
      {
        id: 2,
        name: '陈静 (禅理研究)',
        email: 'chen.jing@zen-flow.com',
        avatar: 'https://example.com/avatar2.jpg',
        role: 'editor',
        roleText: 'Editor',
        status: 'offline'
      },
      {
        id: 3,
        name: '王志远',
        email: 'wang.zy@meditation-labs.cn',
        avatar: 'https://example.com/avatar3.jpg',
        role: 'viewer',
        roleText: 'Viewer',
        status: 'active'
      },
      {
        id: 4,
        name: '赵一凡',
        email: 'yifan.zhao@digital-zen.net',
        avatar: 'https://example.com/avatar4.jpg',
        role: 'admin',
        roleText: 'ADMIN',
        status: 'active'
      },
      {
        id: 5,
        name: '孙晓晓',
        email: 'xiaoxiao.sun@outlook.com',
        avatar: null,
        role: 'viewer',
        roleText: 'Member',
        status: 'offline'
      }
    ],
    quota: {
      seats: 12,
      maxSeats: 20,
      seatsPercent: 60,
      storage: 78
    }
  },

  onLoad() {
    // [CLEANED] console.log('机构账户设置页加载');
    // TODO: 加载账户列表
  },

  onBack() {
    wx.navigateBack({ delta: 1 });
  },

  onAddAccount() {
    // TODO: 跳转到添加账户页面
    wx.showToast({ title: '添加账户', icon: 'none' });
  },

  onUserSettings(e) {
    const { id } = e.currentTarget.dataset;
    // [CLEANED] console.log('用户设置:', id);
    // TODO: 打开用户设置
    wx.showToast({ title: '设置', icon: 'none' });
  },

  onLoadMore() {
    // TODO: 加载更多成员
    wx.showToast({ title: '加载更多', icon: 'none' });
  },

  onUpgrade() {
    // TODO: 跳转到升级页面
    wx.showToast({ title: '升级席位', icon: 'none' });
  }
});
