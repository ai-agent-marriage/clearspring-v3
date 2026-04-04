// pages/admin/message/subscribe.js
Page({
  data: {
    templates: [
      {
        id: 1,
        name: '订单创建通知',
        templateId: 'ORDER_CREATE',
        enabled: true,
        trigger: 'order_create',
        content: '您有新的护生订单，订单号：{{orderNo}}'
      },
      {
        id: 2,
        name: '订单完成通知',
        templateId: 'ORDER_COMPLETE',
        enabled: true,
        trigger: 'order_complete',
        content: '您的护生订单已完成，感谢您的参与！'
      }
    ],
    showEditDialog: false,
    editingTemplate: null,
    triggerOptions: [
      { label: '订单创建', value: 'order_create' },
      { label: '订单完成', value: 'order_complete' },
      { label: '订单取消', value: 'order_cancel' },
      { label: '系统通知', value: 'system_notify' }
    ]
  },

  onLoad() {
    this.loadTemplates()
  },

  // 加载模板列表
  loadTemplates() {
    // TODO: 从云函数获取真实数据
    // wx.cloud.callFunction({
    //   name: 'getMessageTemplates',
    //   success: (res) => {
    //     this.setData({ templates: res.result.data })
    //   }
    // })
  },

  // 切换启用状态
  toggleEnable(e) {
    const index = e.currentTarget.dataset.index
    const key = `templates[${index}].enabled`
    const newValue = !this.data.templates[index].enabled
    
    this.setData({ [key]: newValue })
    
    // TODO: 调用云函数更新状态
    wx.showToast({
      title: newValue ? '已启用' : '已禁用',
      icon: 'success'
    })
  },

  // 编辑模板
  editTemplate(e) {
    const index = e.currentTarget.dataset.index
    const template = this.data.templates[index]
    
    this.setData({
      editingTemplate: { ...template },
      showEditDialog: true
    })
  },

  // 删除模板
  deleteTemplate(e) {
    const index = e.currentTarget.dataset.index
    const template = this.data.templates[index]
    
    wx.showModal({
      title: '删除模板',
      content: `确定要删除模板"${template.name}"吗？`,
      success: (res) => {
        if (res.confirm) {
          const templates = this.data.templates
          templates.splice(index, 1)
          this.setData({ templates })
          
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          })
          
          // TODO: 调用云函数删除
        }
      }
    })
  },

  // 测试发送
  testSend(e) {
    const index = e.currentTarget.dataset.index
    const template = this.data.templates[index]
    
    wx.showModal({
      title: '测试发送',
      content: `将使用模板"${template.name}"发送测试消息，是否继续？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '发送成功',
            icon: 'success'
          })
        }
      }
    })
  },

  // 新增模板
  addTemplate() {
    const newTemplate = {
      id: Date.now(),
      name: '',
      templateId: '',
      enabled: true,
      trigger: 'order_create',
      content: ''
    }
    
    this.setData({
      editingTemplate: newTemplate,
      showEditDialog: true
    })
  },

  // 保存模板
  saveTemplate() {
    const template = this.data.editingTemplate
    
    if (!template.name || !template.templateId || !template.content) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      })
      return
    }
    
    const templates = [...this.data.templates]
    const existingIndex = templates.findIndex(t => t.id === template.id)
    
    if (existingIndex >= 0) {
      templates[existingIndex] = template
    } else {
      templates.push(template)
    }
    
    this.setData({
      templates,
      showEditDialog: false,
      editingTemplate: null
    })
    
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    })
    
    // TODO: 调用云函数保存
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      showEditDialog: false,
      editingTemplate: null
    })
  },

  // 输入框更新
  onInputChange(e) {
    const field = e.currentTarget.dataset.field
    const value = e.detail.value
    
    this.setData({
      [`editingTemplate.${field}`]: value
    })
  },

  // 触发条件选择
  onTriggerChange(e) {
    const value = e.detail.value
    this.setData({
      'editingTemplate.trigger': value
    })
  }
})
