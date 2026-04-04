// pages/admin/message/subscribe.js
Page({
  data: {
    templates: [],
    loading: false,
    showEditDialog: false,
    editingTemplate: null,
    isEditing: false,
    triggerOptions: [
      { label: '订单创建', value: 'order_create' },
      { label: '订单完成', value: 'order_complete' },
      { label: '订单取消', value: 'order_cancel' },
      { label: '系统通知', value: 'system_notify' },
      { label: '支付成功', value: 'payment_success' },
      { label: '退款通知', value: 'refund_notify' }
    ],
    formErrors: {},
    searchKeyword: '',
    filteredTemplates: []
  },

  onLoad() {
    this.loadTemplates();
  },

  // 加载模板列表（实时数据接入）
  loadTemplates() {
    this.setData({ loading: true });
    
    // wx.cloud.callFunction({
    //   name: 'getMessageTemplates',
    //   success: (res) => {
    //     const templates = res.result.data || []
    //     this.setData({ 
    //       templates,
    //       filteredTemplates: templates,
    //       loading: false
    //     })
    //   },
    //   fail: () => {
    //     wx.showToast({ title: '加载失败', icon: 'none' })
    //     this.setData({ loading: false })
    //   }
    // })
    
    // 模拟数据
    setTimeout(() => {
      const templates = [
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
        },
        {
          id: 3,
          name: '订单取消通知',
          templateId: 'ORDER_CANCEL',
          enabled: false,
          trigger: 'order_cancel',
          content: '您的订单已取消，订单号：{{orderNo}}'
        }
      ];
      this.setData({ 
        templates,
        filteredTemplates: templates,
        loading: false
      });
    }, 500);
  },

  // 搜索模板
  onSearch(e) {
    const keyword = e.detail.value.trim();
    this.setData({ searchKeyword: keyword });
    
    if (!keyword) {
      this.setData({ filteredTemplates: this.data.templates });
      return;
    }
    
    const filtered = this.data.templates.filter(t => 
      t.name.includes(keyword) || t.templateId.includes(keyword)
    );
    this.setData({ filteredTemplates: filtered });
  },

  // 清空搜索
  clearSearch() {
    this.setData({
      searchKeyword: '',
      filteredTemplates: this.data.templates
    });
  },

  // 切换启用状态（实时同步）
  toggleEnable(e) {
    const index = e.currentTarget.dataset.index;
    const template = this.data.filteredTemplates[index];
    const key = `templates[${this.data.templates.findIndex(t => t.id === template.id)}].enabled`;
    const newValue = !template.enabled;
    
    wx.showLoading({ title: '同步中...' });
    
    this.setData({ [key]: newValue });
    
    // 同步到云端
    // wx.cloud.callFunction({
    //   name: 'updateTemplateStatus',
    //   data: { id: template.id, enabled: newValue },
    //   success: () => {
    //     wx.showToast({ title: newValue ? '已启用' : '已禁用', icon: 'success' })
    //   },
    //   fail: () => {
    //     // 回滚
    //     this.setData({ [key]: !newValue })
    //     wx.showToast({ title: '同步失败', icon: 'none' })
    //   },
    //   complete: () => {
    //     wx.hideLoading()
    //   }
    // })
    
    // 模拟同步
    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({ title: newValue ? '已启用' : '已禁用', icon: 'success' });
    }, 500);
  },

  // 编辑模板
  editTemplate(e) {
    const index = e.currentTarget.dataset.index;
    const template = this.data.filteredTemplates[index];
    
    this.setData({
      editingTemplate: { ...template },
      isEditing: true,
      formErrors: {},
      showEditDialog: true
    });
  },

  // 删除模板
  deleteTemplate(e) {
    const index = e.currentTarget.dataset.index;
    const template = this.data.filteredTemplates[index];
    
    wx.showModal({
      title: '删除模板',
      content: `确定要删除模板"${template.name}"吗？此操作不可恢复。`,
      confirmColor: '#D9534F',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '删除中...' });
          
          // wx.cloud.callFunction({
          //   name: 'deleteTemplate',
          //   data: { id: template.id },
          //   success: () => {
          //     const templates = this.data.templates.filter(t => t.id !== template.id)
          //     this.setData({ templates, filteredTemplates: templates })
          //     wx.showToast({ title: '删除成功', icon: 'success' })
          //   },
          //   fail: () => {
          //     wx.showToast({ title: '删除失败', icon: 'none' })
          //   },
          //   complete: () => {
          //     wx.hideLoading()
          //   }
          // })
          
          // 模拟删除
          setTimeout(() => {
            const templates = this.data.templates.filter(t => t.id !== template.id);
            this.setData({ templates, filteredTemplates: templates });
            wx.hideLoading();
            wx.showToast({ title: '删除成功', icon: 'success' });
          }, 500);
        }
      }
    });
  },

  // 测试发送（结果反馈）
  testSend(e) {
    const index = e.currentTarget.dataset.index;
    const template = this.data.filteredTemplates[index];
    
    wx.vibrateShort({ type: 'light' });
    
    wx.showModal({
      title: '测试发送',
      content: `将使用模板"${template.name}"向测试用户发送消息，是否继续？`,
      confirmColor: '#4A5D4E',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '发送中...', mask: true });
          
          // 模拟发送
          setTimeout(() => {
            wx.hideLoading();
            
            // 随机成功/失败
            const success = Math.random() > 0.2;
            
            if (success) {
              wx.showToast({
                title: '发送成功',
                icon: 'success',
                duration: 2000
              });
            } else {
              wx.showModal({
                title: '发送失败',
                content: '测试用户未订阅该消息模板，请先引导用户订阅。',
                showCancel: false,
                confirmColor: '#D9534F'
              });
            }
          }, 1500);
        }
      }
    });
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
    };
    
    this.setData({
      editingTemplate: newTemplate,
      isEditing: false,
      formErrors: {},
      showEditDialog: true
    });
  },

  // 验证表单
  validateForm() {
    const template = this.data.editingTemplate;
    const errors = {};
    
    if (!template.name || !template.name.trim()) {
      errors.name = '请输入模板名称';
    }
    
    if (!template.templateId || !template.templateId.trim()) {
      errors.templateId = '请输入模板 ID';
    } else if (!/^[A-Z_]+$/.test(template.templateId)) {
      errors.templateId = '模板 ID 只能包含大写字母和下划线';
    }
    
    if (!template.content || !template.content.trim()) {
      errors.content = '请输入消息内容';
    } else if (template.content.length > 200) {
      errors.content = '消息内容不能超过 200 字';
    }
    
    this.setData({ formErrors: errors });
    return Object.keys(errors).length === 0;
  },

  // 保存模板
  saveTemplate() {
    if (!this.validateForm()) {
      wx.showToast({
        title: '请完善表单信息',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '保存中...' });
    
    const template = this.data.editingTemplate;
    const templates = [...this.data.templates];
    
    if (this.data.isEditing) {
      const index = templates.findIndex(t => t.id === template.id);
      if (index >= 0) {
        templates[index] = template;
      }
    } else {
      templates.push(template);
    }
    
    // wx.cloud.callFunction({
    //   name: this.data.isEditing ? 'updateTemplate' : 'createTemplate',
    //   data: { template },
    //   success: () => {
    //     this.setData({
    //       templates,
    //       filteredTemplates: templates,
    //       showEditDialog: false,
    //       editingTemplate: null
    //     })
    //     wx.showToast({ title: '保存成功', icon: 'success' })
    //   },
    //   fail: () => {
    //     wx.showToast({ title: '保存失败', icon: 'none' })
    //   },
    //   complete: () => {
    //     wx.hideLoading()
    //   }
    // })
    
    // 模拟保存
    setTimeout(() => {
      this.setData({
        templates,
        filteredTemplates: templates,
        showEditDialog: false,
        editingTemplate: null
      });
      wx.hideLoading();
      wx.showToast({ title: '保存成功', icon: 'success' });
    }, 500);
  },

  // 取消编辑
  cancelEdit() {
    this.setData({
      showEditDialog: false,
      editingTemplate: null,
      formErrors: {}
    });
  },

  // 输入框更新
  onInputChange(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    
    this.setData({
      [`editingTemplate.${field}`]: value
    });
    
    // 清除对应字段的错误
    if (this.data.formErrors[field]) {
      const errors = { ...this.data.formErrors };
      delete errors[field];
      this.setData({ formErrors: errors });
    }
  },

  // 触发条件选择
  onTriggerChange(e) {
    const value = e.detail.value;
    this.setData({
      'editingTemplate.trigger': value
    });
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.loadTemplates().then(() => {
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    });
  }
});
