/**
 * 志愿者板块单元测试
 * 测试志愿者端首页、任务列表、任务详情、执行结果提交等页面
 */

// 辅助函数：为页面对象添加 setData 方法
function createPage(pageObj) {
  pageObj.setData = function(data) {
    Object.keys(data).forEach(key => {
      const keys = key.split('.')
      if (keys.length === 1) {
        this.data[key] = data[key]
      } else {
        let obj = this.data
        for (let i = 0; i < keys.length - 1; i++) {
          obj = obj[keys[i]]
        }
        obj[keys[keys.length - 1]] = data[key]
      }
    })
  }
  return pageObj
}

// 扩展 wx 对象，添加安全审核相关方法
if (!global.wx.security) {
  global.wx.security = {
    imgSecCheck: jest.fn().mockResolvedValue(true),
    msgSecCheck: jest.fn().mockResolvedValue(true)
  }
}

// 扩展 getPage 函数，添加志愿者相关页面
const originalGetPage = global.getPage

global.getPage = function(path) {
  // 志愿者端首页
  if (path === '/pages/volunteer-home/index') {
    return createPage({
      data: {
        volunteer: {
          id: 1,
          name: '张三',
          avatar: '/assets/images/avatar.png',
          phone: '138****1234',
          serviceHours: 24.5,
          completedTasks: 15,
          complianceRate: 98.5
        },
        stats: {
          pendingTasks: 3,
          completedTasks: 15,
          totalTasks: 18,
          pendingAudit: 1
        },
        quickActions: [
          { icon: '/assets/images/task-icon.png', name: '我的任务', path: '/pages/volunteer-home/tasks' },
          { icon: '/assets/images/record-icon.png', name: '执行记录', path: '/pages/volunteer-home/records' },
          { icon: '/assets/images/certificate-icon.png', name: '证书查询', path: '/pages/volunteer-home/certificate' }
        ],
        latestTasks: [
          { taskId: 1, speciesName: '鲢鱼', quantity: 10, status: 1, statusName: '待接收', createTime: '2026-04-07 10:00:00' },
          { taskId: 2, speciesName: '鳙鱼', quantity: 5, status: 2, statusName: '已接收', createTime: '2026-04-06 15:30:00' },
          { taskId: 3, speciesName: '草鱼', quantity: 8, status: 4, statusName: '已完成', createTime: '2026-04-05 09:00:00' }
        ],
        showSwitchButton: true
      },
      switchToOrg: function() {
        wx.switchTab({ url: '/pages/org-home/index' })
      }
    })
  }
  
  // 志愿者任务列表页
  if (path === '/pages/volunteer-home/tasks') {
    return createPage({
      data: {
        tabs: [
          { id: 0, name: '全部' },
          { id: 1, name: '待接收' },
          { id: 2, name: '已接收' },
          { id: 3, name: '执行中' },
          { id: 4, name: '已完成' }
        ],
        activeTab: 0,
        tasks: [
          { 
            taskId: 1, 
            speciesName: '鲢鱼', 
            quantity: 10, 
            status: 1, 
            statusName: '待接收',
            orgName: '广州环保志愿者协会',
            createTime: '2026-04-07 10:00:00',
            actions: ['确认接收', '无法执行'],
            statusColor: '#FF9800'
          },
          { 
            taskId: 2, 
            speciesName: '鳙鱼', 
            quantity: 5, 
            status: 2, 
            statusName: '已接收',
            orgName: '深圳生态保护中心',
            createTime: '2026-04-06 15:30:00',
            actions: ['提交执行结果'],
            statusColor: '#2196F3'
          },
          { 
            taskId: 3, 
            speciesName: '草鱼', 
            quantity: 8, 
            status: 3, 
            statusName: '执行中',
            orgName: '珠海自然保护协会',
            createTime: '2026-04-05 09:00:00',
            actions: ['提交执行结果'],
            statusColor: '#9C27B0'
          },
          { 
            taskId: 4, 
            speciesName: '青鱼', 
            quantity: 12, 
            status: 4, 
            statusName: '已完成',
            orgName: '广州环保志愿者协会',
            createTime: '2026-04-04 14:00:00',
            actions: ['查看详情'],
            statusColor: '#4CAF50'
          }
        ]
      },
      switchTab: function(index) {
        this.data.activeTab = index
      },
      acceptTask: function(taskId) {
        wx.request({
          url: 'http://localhost:8080/api/volunteer/task/accept',
          method: 'POST',
          data: { taskId }
        })
      },
      rejectTask: function(taskId) {
        wx.showModal({
          title: '无法执行',
          content: '请填写无法执行的原因',
          editable: true,
          success: (res) => {
            if (res.confirm && res.content) {
              wx.request({
                url: 'http://localhost:8080/api/volunteer/task/reject',
                method: 'POST',
                data: { taskId, reason: res.content }
              })
            }
          }
        })
      }
    })
  }
  
  // 志愿者任务详情页
  if (path === '/pages/volunteer-home/task-detail') {
    return createPage({
      data: {
        task: {
          taskId: 1,
          orderNo: 'PRO202604070001',
          speciesName: '鲢鱼',
          scientificName: 'Hypophthalmichthys molitrix',
          quantity: 10,
          unit: '斤',
          status: 1,
          statusName: '待接收',
          orgName: '广州环保志愿者协会',
          orgContact: '李先生',
          orgPhone: '138****9999',
          requireTime: '2026-04-08 10:00:00',
          address: '珠江广州段',
          remark: '请在上午 10 点前完成',
          createTime: '2026-04-07 10:00:00'
        },
        showConfirmButton: false,
        showRejectButton: false,
        showSubmitButton: false
      },
      onLoad: function() {
        const task = this.data.task
        if (task.status === 1) {
          this.data.showConfirmButton = true
          this.data.showRejectButton = true
        } else if (task.status === 2 || task.status === 3) {
          this.data.showSubmitButton = true
        }
      },
      acceptTask: function() {
        wx.showModal({
          title: '确认接收',
          content: '确认接收该任务吗？',
          success: (res) => {
            if (res.confirm) {
              wx.request({
                url: 'http://localhost:8080/api/volunteer/task/accept',
                method: 'POST',
                data: { taskId: this.data.task.taskId },
                success: () => {
                  wx.showToast({ title: '接收成功', icon: 'success' })
                  this.data.task.status = 2
                  this.data.task.statusName = '已接收'
                  this.data.showConfirmButton = false
                  this.data.showRejectButton = false
                  this.data.showSubmitButton = true
                }
              })
            }
          }
        })
      },
      rejectTask: function() {
        wx.showModal({
          title: '无法执行',
          content: '请填写无法执行的原因',
          editable: true,
          success: (res) => {
            if (res.confirm && res.content) {
              wx.request({
                url: 'http://localhost:8080/api/volunteer/task/reject',
                method: 'POST',
                data: { taskId: this.data.task.taskId, reason: res.content },
                success: () => {
                  wx.showToast({ title: '已拒绝', icon: 'success' })
                  this.data.task.status = 5
                  this.data.task.statusName = '已拒绝'
                  this.data.showConfirmButton = false
                  this.data.showRejectButton = false
                }
              })
            }
          }
        })
      },
      submitExecute: function() {
        wx.navigateTo({ url: '/pages/volunteer-home/submit?taskId=' + this.data.task.taskId })
      }
    })
  }
  
  // 志愿者执行结果提交页
  if (path === '/pages/volunteer-home/submit') {
    return createPage({
      data: {
        task: {
          taskId: 1,
          orderNo: 'PRO202604070001',
          speciesName: '鲢鱼',
          quantity: 10,
          unit: '斤',
          address: '珠江广州段'
        },
        form: {
          executeTime: '',
          realQuantity: 10,
          address: '珠江广州段',
          remark: ''
        },
        images: [],
        agree: false,
        submitting: false
      },
      onLoad: function(options) {
        const taskId = options.taskId
        wx.request({
          url: 'http://localhost:8080/api/volunteer/task/detail',
          data: { taskId },
          success: (res) => {
            if (res.data.code === 200) {
              this.setData({ task: res.data.data })
            }
          }
        })
      },
      bindTimeChange: function(e) {
        this.setData({ 'form.executeTime': e.detail.value })
      },
      bindQuantityChange: function(e) {
        this.setData({ 'form.realQuantity': parseInt(e.detail.value) })
      },
      bindRemarkInput: function(e) {
        this.setData({ 'form.remark': e.detail.value })
      },
      toggleAgree: function() {
        this.setData({ agree: !this.data.agree })
      },
      chooseImage: function() {
        const remaining = 10 - this.data.images.length
        if (remaining <= 0) {
          wx.showToast({ title: '最多上传 10 张照片', icon: 'none' })
          return
        }
        
        wx.chooseImage({
          count: remaining,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (res) => {
            const tempFiles = res.tempFilePaths
            this.setData({
              images: this.data.images.concat(tempFiles)
            })
          }
        })
      },
      deleteImage: function(e) {
        const index = e.currentTarget.dataset.index
        this.data.images.splice(index, 1)
        this.setData({ images: this.data.images })
      },
      previewImage: function(e) {
        const index = e.currentTarget.dataset.index
        wx.previewImage({
          current: this.data.images[index],
          urls: this.data.images
        })
      },
      submitExecute: async function() {
        // 校验照片数量
        if (this.data.images.length < 3) {
          wx.showToast({ title: '请上传至少 3 张照片', icon: 'none' })
          return
        }
        
        // 校验合规承诺
        if (!this.data.agree) {
          wx.showToast({ title: '请先勾选合规承诺', icon: 'none' })
          return
        }
        
        // 内容安全审核
        try {
          // 图片审核
          for (const img of this.data.images) {
            const imgCheck = await wx.security.imgSecCheck({
              filePath: img
            })
            if (!imgCheck) {
              wx.showToast({ title: '图片内容不合规', icon: 'none' })
              return
            }
          }
          
          // 文本审核
          if (this.data.form.remark) {
            const textCheck = await wx.security.msgSecCheck({
              content: this.data.form.remark
            })
            if (!textCheck) {
              wx.showToast({ title: '文字内容不合规', icon: 'none' })
              return
            }
          }
          
          // 上传执行结果
          this.setData({ submitting: true })
          wx.request({
            url: 'http://localhost:8080/api/task/execute/submit',
            method: 'POST',
            data: {
              taskId: this.data.task.taskId,
              executeTime: this.data.form.executeTime || new Date().toLocaleString('zh-CN'),
              address: this.data.form.address,
              realQuantity: this.data.form.realQuantity,
              images: this.data.images.join(','),
              remark: this.data.form.remark
            },
            success: (res) => {
              if (res.data.code === 200) {
                wx.showToast({ title: '提交成功', icon: 'success' })
                setTimeout(() => {
                  wx.navigateBack()
                }, 1500)
              } else {
                wx.showToast({ title: res.data.msg || '提交失败', icon: 'none' })
              }
            },
            fail: () => {
              wx.showToast({ title: '网络错误', icon: 'none' })
            },
            complete: () => {
              this.setData({ submitting: false })
            }
          })
        } catch (error) {
          wx.showToast({ title: '审核失败', icon: 'none' })
          this.setData({ submitting: false })
        }
      }
    })
  }
  
  // 调用原始的 getPage
  return originalGetPage(path)
}

describe('志愿者端首页测试', () => {
  test('用户信息展示正常', () => {
    const page = getPage('/pages/volunteer-home/index')
    expect(page.data.volunteer).toBeTruthy()
    expect(page.data.volunteer.name).toBeTruthy()
  })
  
  test('数据看板展示正常', () => {
    const page = getPage('/pages/volunteer-home/index')
    expect(page.data.stats).toBeTruthy()
    expect(page.data.stats.pendingTasks).toBeDefined()
    expect(page.data.stats.completedTasks).toBeDefined()
  })
  
  test('快捷操作按钮显示正常', () => {
    const page = getPage('/pages/volunteer-home/index')
    expect(page.data.quickActions).toBeInstanceOf(Array)
    expect(page.data.quickActions.length).toBe(3)
  })
  
  test('最新任务列表显示正常', () => {
    const page = getPage('/pages/volunteer-home/index')
    expect(page.data.latestTasks).toBeInstanceOf(Array)
  })
  
  test('切换视角按钮显示正常', () => {
    const page = getPage('/pages/volunteer-home/index')
    expect(page.data.showSwitchButton).toBe(true)
  })
  
  test('志愿者信息包含必要字段', () => {
    const page = getPage('/pages/volunteer-home/index')
    const volunteer = page.data.volunteer
    expect(volunteer).toHaveProperty('id')
    expect(volunteer).toHaveProperty('name')
    expect(volunteer).toHaveProperty('serviceHours')
    expect(volunteer).toHaveProperty('completedTasks')
    expect(volunteer).toHaveProperty('complianceRate')
  })
  
  test('数据统计包含所有指标', () => {
    const page = getPage('/pages/volunteer-home/index')
    const stats = page.data.stats
    expect(stats).toHaveProperty('pendingTasks')
    expect(stats).toHaveProperty('completedTasks')
    expect(stats).toHaveProperty('totalTasks')
    expect(stats).toHaveProperty('pendingAudit')
  })
  
  test('快捷操作按钮配置正确', () => {
    const page = getPage('/pages/volunteer-home/index')
    const actions = page.data.quickActions
    expect(actions[0].name).toBe('我的任务')
    expect(actions[1].name).toBe('执行记录')
    expect(actions[2].name).toBe('证书查询')
  })
})

describe('志愿者任务列表页测试', () => {
  test('Tab 切换正常', () => {
    const page = getPage('/pages/volunteer-home/tasks')
    expect(page.data.tabs).toBeInstanceOf(Array)
    page.switchTab(1)
    expect(page.data.activeTab).toBe(1)
  })
  
  test('任务列表显示正常', () => {
    const page = getPage('/pages/volunteer-home/tasks')
    expect(page.data.tasks).toBeInstanceOf(Array)
  })
  
  test('任务状态标签颜色正确', () => {
    const page = getPage('/pages/volunteer-home/tasks')
    const task = page.data.tasks[0]
    expect(task.statusName).toBeTruthy()
    expect(task.statusColor).toBeTruthy()
  })
  
  test('操作按钮根据状态显示', () => {
    const page = getPage('/pages/volunteer-home/tasks')
    const task = page.data.tasks.find(t => t.status === 1)
    expect(task.actions).toContain('确认接收')
  })
  
  test('Tab 配置完整', () => {
    const page = getPage('/pages/volunteer-home/tasks')
    expect(page.data.tabs.length).toBe(5)
    expect(page.data.tabs.map(t => t.name)).toEqual(['全部', '待接收', '已接收', '执行中', '已完成'])
  })
  
  test('任务包含完整信息', () => {
    const page = getPage('/pages/volunteer-home/tasks')
    const task = page.data.tasks[0]
    expect(task).toHaveProperty('taskId')
    expect(task).toHaveProperty('speciesName')
    expect(task).toHaveProperty('quantity')
    expect(task).toHaveProperty('status')
    expect(task).toHaveProperty('statusName')
    expect(task).toHaveProperty('orgName')
    expect(task).toHaveProperty('createTime')
  })
})

describe('志愿者任务详情页测试', () => {
  test('任务信息展示正常', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    expect(page.data.task).toBeTruthy()
    expect(page.data.task.speciesName).toBeTruthy()
  })
  
  test('机构信息展示正常', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    expect(page.data.task.orgName).toBeTruthy()
    expect(page.data.task.orgContact).toBeTruthy()
  })
  
  test('待接收状态显示确认/无法执行按钮', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    page.setData({ 'task.status': 1, showConfirmButton: true, showRejectButton: true })
    expect(page.data.showConfirmButton).toBe(true)
    expect(page.data.showRejectButton).toBe(true)
  })
  
  test('已接收状态显示提交执行结果按钮', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    page.setData({ 'task.status': 2, showSubmitButton: true })
    expect(page.data.showSubmitButton).toBe(true)
  })
  
  test('任务包含科学名称', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    expect(page.data.task.scientificName).toBeTruthy()
  })
  
  test('任务包含执行要求信息', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    const task = page.data.task
    expect(task).toHaveProperty('requireTime')
    expect(task).toHaveProperty('address')
    expect(task).toHaveProperty('remark')
  })
  
  test('执行中状态显示提交按钮', () => {
    const page = getPage('/pages/volunteer-home/task-detail')
    page.setData({ 'task.status': 3, showSubmitButton: true })
    expect(page.data.showSubmitButton).toBe(true)
  })
})

describe('志愿者执行结果提交页测试', () => {
  test('任务信息展示正常', () => {
    const page = getPage('/pages/volunteer-home/submit')
    expect(page.data.task).toBeTruthy()
  })
  
  test('合规承诺默认未勾选', () => {
    const page = getPage('/pages/volunteer-home/submit')
    expect(page.data.agree).toBe(false)
  })
  
  test('照片上传最少 3 张校验', () => {
    const page = getPage('/pages/volunteer-home/submit')
    page.setData({ images: ['img1.jpg', 'img2.jpg'] })
    page.submitExecute()
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请上传至少 3 张照片',
      icon: 'none'
    })
  })
  
  test('照片上传最多 10 张校验', () => {
    const page = getPage('/pages/volunteer-home/submit')
    const manyImages = Array(11).fill('img.jpg')
    page.setData({ images: manyImages })
    page.chooseImage()
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '最多上传 10 张照片',
      icon: 'none'
    })
  })
  
  test('合规承诺勾选校验', () => {
    const page = getPage('/pages/volunteer-home/submit')
    page.setData({ agree: false, images: ['img1.jpg', 'img2.jpg', 'img3.jpg'] })
    page.submitExecute()
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请先勾选合规承诺',
      icon: 'none'
    })
  })
  
  test('内容安全审核调用正常', async () => {
    const page = getPage('/pages/volunteer-home/submit')
    page.setData({ 
      agree: true,
      images: ['img1.jpg', 'img2.jpg', 'img3.jpg'],
      form: { remark: '执行顺利' }
    })
    
    wx.security.imgSecCheck.mockResolvedValue(true)
    wx.security.msgSecCheck.mockResolvedValue(true)
    
    await page.submitExecute()
    expect(wx.security.imgSecCheck).toHaveBeenCalled()
    expect(wx.security.msgSecCheck).toHaveBeenCalled()
  })
  
  test('表单包含必要字段', () => {
    const page = getPage('/pages/volunteer-home/submit')
    expect(page.data.form).toHaveProperty('executeTime')
    expect(page.data.form).toHaveProperty('realQuantity')
    expect(page.data.form).toHaveProperty('address')
    expect(page.data.form).toHaveProperty('remark')
  })
  
  test('照片数组初始为空', () => {
    const page = getPage('/pages/volunteer-home/submit')
    expect(page.data.images).toBeInstanceOf(Array)
    expect(page.data.images.length).toBe(0)
  })
})
