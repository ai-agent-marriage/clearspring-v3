// 清如 ClearSpring - 机构结算管理页
const Validator = require('../../utils/validator');
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // Tab 配置
    tabs: ['待结算订单', '结算记录', '发票管理'],
    activeTab: 0,
    
    // 顶部数据卡片
    stats: {
      totalSettled: 45680,
      pendingSettle: 2990,
      settledOrders: 150
    },
    
    // 待结算订单
    pendingSettlements: [
      {
        orderNo: 'PRO202604010001',
        completeTime: '2026-04-01 15:00:00',
        amount: 598,
        settleDeadline: '2026-04-08'
      },
      {
        orderNo: 'PRO202604010002',
        completeTime: '2026-04-02 10:30:00',
        amount: 899,
        settleDeadline: '2026-04-09'
      },
      {
        orderNo: 'PRO202604010003',
        completeTime: '2026-04-02 14:20:00',
        amount: 1493,
        settleDeadline: '2026-04-09'
      }
    ],
    
    // 结算记录
    settlementRecords: [
      {
        settleNo: 'S202604010001',
        settleTime: '2026-04-02',
        amount: 5680,
        invoiceStatus: '已开票',
        transferStatus: '已转账'
      },
      {
        settleNo: 'S202603280001',
        settleTime: '2026-03-28',
        amount: 12560,
        invoiceStatus: '已开票',
        transferStatus: '已转账'
      },
      {
        settleNo: 'S202603150001',
        settleTime: '2026-03-15',
        amount: 8900,
        invoiceStatus: '已开票',
        transferStatus: '已转账'
      }
    ],
    
    // 发票信息
    invoiceInfo: {
      company: '',
      taxNo: '',
      address: '',
      phone: '',
      bank: '',
      bankAccount: '',
      status: '未提交'
    },
    
    // 历史发票记录
    invoiceHistory: [
      {
        invoiceNo: 'INV202604010001',
        invoiceTime: '2026-04-01',
        amount: 5680,
        status: '审核通过'
      }
    ],
    
    // 发票表单显示
    showInvoiceForm: false
  },

  onLoad(options) {
    console.log('结算管理页加载');
    this.loadSettlementData();
  },

  onShow() {
    this.refreshSettlementData();
  },

  onPullDownRefresh() {
    this.refreshSettlementData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // ========== 数据加载 ==========
  async loadSettlementData() {
    try {
      wx.showLoading({ title: '加载中...' });
      
      const res = await wx.cloud.callFunction({
        name: 'settlement-list',
        data: { 
          orgId: this.data.orgId || 'org_001',
          tabType: this.data.activeTab,
          timestamp: Date.now()
        }
      });
      
      if (res.result && res.result.code === 0 && res.result.data) {
        const data = res.result.data;
        this.setData({ 
          stats: data.stats || this.data.stats,
          pendingSettlements: data.pendingSettlements || [],
          settlementRecords: data.settlementRecords || [],
          invoiceInfo: data.invoiceInfo || this.data.invoiceInfo,
          invoiceHistory: data.invoiceHistory || [],
          loading: false
        });
        wx.hideLoading();
      } else {
        throw new Error(res.result?.msg || '结算数据加载失败');
      }
    } catch (error) {
      console.error('加载结算数据失败:', error);
      wx.hideLoading();
      wx.showToast({
        title: error.message || '加载失败，请重试',
        icon: 'none',
        duration: 2000
      });
      
      // 记录错误日志
      wx.cloud.callFunction({
        name: 'log-error',
        data: { 
          error: error.message, 
          page: 'org-home-settlement',
          timestamp: Date.now()
        }
      });
      
      this.setData({ loading: false });
    }
  },

  async refreshSettlementData() {
    try {
      wx.showLoading({ title: '刷新中...' });
      await this.loadSettlementData();
      wx.hideLoading();
      console.log('结算数据刷新完成');
    } catch (error) {
      wx.hideLoading();
      console.error('刷新结算数据失败:', error);
      wx.showToast({
        title: '刷新失败',
        icon: 'none'
      });
    }
  },

  // ========== Tab 切换 ==========
  onTabChange(e) {
    const { index } = e.currentTarget.dataset;
    this.setData({ activeTab: index });
  },

  // ========== 待结算订单操作 ==========
  onViewSettlementDetail(e) {
    const { order } = e.currentTarget.dataset;
    console.log('查看结算详情:', order);
    
    wx.navigateTo({
      url: `/pages/org-home/settlement-detail?orderNo=${order.orderNo}`
    });
  },

  onBatchSettle() {
    wx.showModal({
      title: '批量结算',
      content: `确定要对 ${this.data.pendingSettlements.length} 个订单进行结算吗？`,
      success: (res) => {
        if (res.confirm) {
          wx.showToast({
            title: '结算申请已提交',
            icon: 'success'
          });
        }
      }
    });
  },

  // ========== 结算记录操作 ==========
  onExportSettlement(e) {
    const { record } = e.currentTarget.dataset;
    console.log('导出结算单:', record);
    
    wx.showToast({
      title: '正在生成结算单',
      icon: 'loading',
      duration: 2000
    });
    
    // TODO: 实际导出结算单
    setTimeout(() => {
      wx.showToast({
        title: '导出成功',
        icon: 'success'
      });
    }, 2000);
  },

  onViewSettlementRecord(e) {
    const { record } = e.currentTarget.dataset;
    console.log('查看结算记录:', record);
    
    wx.navigateTo({
      url: `/pages/org-home/settlement-record?settleNo=${record.settleNo}`
    });
  },

  // ========== 发票管理操作 ==========
  onEditInvoice() {
    this.setData({ showInvoiceForm: true });
  },

  onSaveInvoice() {
    const { invoiceInfo } = this.data;
    
    // 1. 必填项验证
    const companyResult = Validator.validateCompany(invoiceInfo.company);
    if (!companyResult.valid) {
      wx.showToast({ title: companyResult.message, icon: 'none' });
      return;
    }
    
    const taxNoResult = Validator.validateTaxNo(invoiceInfo.taxNo);
    if (!taxNoResult.valid) {
      wx.showToast({ title: taxNoResult.message, icon: 'none' });
      return;
    }
    
    const amountResult = Validator.validateAmount(invoiceInfo.amount);
    if (!amountResult.valid) {
      wx.showToast({ title: amountResult.message, icon: 'none' });
      return;
    }
    
    // 2. 可选字段格式验证
    const phoneResult = Validator.validatePhone(invoiceInfo.phone);
    if (!phoneResult.valid) {
      wx.showToast({ title: phoneResult.message, icon: 'none' });
      return;
    }
    
    const addressResult = Validator.validateAddress(invoiceInfo.address);
    if (!addressResult.valid) {
      wx.showToast({ title: addressResult.message, icon: 'none' });
      return;
    }
    
    const bankAccountResult = Validator.validateBankAccount(invoiceInfo.bankAccount);
    if (!bankAccountResult.valid) {
      wx.showToast({ title: bankAccountResult.message, icon: 'none' });
      return;
    }
    
    // 3. 验证通过，保存数据
    console.log('发票信息验证通过:', invoiceInfo);
    
    // TODO: 调用实际保存接口
    wx.showToast({
      title: '保存成功',
      icon: 'success'
    });
    
    this.setData({
      showInvoiceForm: false,
      'invoiceInfo.status': '审核中'
    });
  },

  onCancelInvoice() {
    this.setData({ showInvoiceForm: false });
  },

  onUploadInvoice() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log('选择发票图片:', res.tempFiles[0].tempFilePath);
        wx.showToast({
          title: '上传成功',
          icon: 'success'
        });
      }
    });
  },

  onViewInvoice(e) {
    const { invoice } = e.currentTarget.dataset;
    console.log('查看发票:', invoice);
    
    wx.showToast({
      title: '查看发票详情',
      icon: 'none'
    });
  },

  // ========== 表单输入 ==========
  onInvoiceInputChange(e) {
    const { field } = e.currentTarget.dataset;
    const value = e.detail.value;
    
    this.setData({
      [`invoiceInfo.${field}`]: value
    });
  },

  // ========== 分享 ==========
  onShareAppMessage() {
    return {
      title: '清如结算管理',
      path: '/pages/org-home/settlement'
    };
  }
});
