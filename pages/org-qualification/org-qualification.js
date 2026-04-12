// 清如 ClearSpring - 机构资质管理页 V-09
const ErrorHandler = require('../../utils/error-handler');

Page({
  data: {
    // 当前资质状态: verified, pending, rejected, expired
    currentStatus: 'verified',
    statusTitle: '已认证',
    statusDesc: '您的机构已通过平台认证',
    expireDate: '2027-03-28',
    showActionButton: false,
    actionButtonText: '',
    
    // 审核进度
    currentStep: 4, // 1: 提交申请，2: 平台初审，3: 实地考察，4: 审核完成
    submitDate: '2026-03-20',
    reviewDate: '2026-03-22',
    inspectionDate: '2026-03-25',
    completeDate: '2026-03-28',
    
    // 驳回原因
    rejectionReason: '营业执照照片不够清晰，无法辨认关键信息',
    rejectionSuggestions: '请重新拍摄营业执照照片，确保光线充足、对焦清晰，四个角都拍摄完整',
    
    // 证书列表
    certificates: [
      {
        id: 'cert_001',
        name: '营业执照',
        type: 'business',
        typeText: '营业执照',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2020-06-15',
        validDate: '2040-06-15'
      },
      {
        id: 'cert_002',
        name: '组织机构代码证',
        type: 'organization',
        typeText: '组织代码',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2020-06-15',
        validDate: '长期有效'
      },
      {
        id: 'cert_003',
        name: '税务登记证',
        type: 'tax',
        typeText: '税务登记',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2020-06-20',
        validDate: '长期有效'
      },
      {
        id: 'cert_004',
        name: '环保许可证',
        type: 'environment',
        typeText: '环保许可',
        status: 'pending',
        statusText: '审核中',
        issueDate: '2025-09-20',
        validDate: '2028-09-20'
      }
    ],
    
    // 资质要求
    requirements: [
      {
        id: 'req_001',
        index: '1',
        title: '合法注册的机构',
        desc: '提供有效的营业执照、组织机构代码证',
        completed: true
      },
      {
        id: 'req_002',
        index: '2',
        title: '环保相关资质',
        desc: '提供环保许可证或相关资质证明',
        completed: true
      },
      {
        id: 'req_003',
        index: '3',
        title: '固定的办公场所',
        desc: '提供办公场所租赁合同或产权证明',
        completed: true
      },
      {
        id: 'req_004',
        index: '4',
        title: '专业的执行团队',
        desc: '至少拥有 3 名以上经过培训的执行人员',
        completed: true
      },
      {
        id: 'req_005',
        index: '5',
        index: '5',
        title: '良好的信用记录',
        desc: '无违法违规记录，信用良好',
        completed: true
      }
    ]
  },

  onLoad(options) {
    if (options.status) {
      this.updateStatus(options.status);
    }
    this.loadQualificationData();
  },

  onShow() {
    this.loadQualificationData();
  },

  onPullDownRefresh() {
    this.loadQualificationData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 加载资质数据
  async loadQualificationData() {
    try {
      ErrorHandler.showLoading('加载中...');
      
      // TODO: 调用云函数获取资质数据
      // const res = await wx.cloud.callFunction({
      //   name: 'getOrgQualificationStatus',
      //   data: {}
      // });
      
      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 300);
      });
    } catch (error) {
      console.error('加载资质数据失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'loadQualificationData',
        showToast: true
      });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  // 更新状态显示
  updateStatus(status) {
    const statusMap = {
      verified: {
        title: '已认证',
        desc: '您的机构已通过平台认证',
        showAction: false
      },
      pending: {
        title: '审核中',
        desc: '平台正在审核您的资质',
        showAction: false
      },
      rejected: {
        title: '已驳回',
        desc: '您的资质未通过审核',
        showAction: true,
        actionText: '重新提交'
      },
      expired: {
        title: '已过期',
        desc: '您的资质已过期，请重新认证',
        showAction: true,
        actionText: '重新认证'
      }
    };

    const statusInfo = statusMap[status] || statusMap.verified;
    this.setData({
      currentStatus: status,
      statusTitle: statusInfo.title,
      statusDesc: statusInfo.desc,
      showActionButton: statusInfo.showAction,
      actionButtonText: statusInfo.actionText || ''
    });
  },

  // 更新资质
  onUpdateQualification() {
    wx.navigateTo({
      url: '/pages/org-qualification-apply/org-qualification-apply'
    });
  },

  // 添加证书
  onAddCertificate() {
    wx.showActionSheet({
      itemList: ['上传营业执照', '上传组织代码证', '上传税务登记证', '上传其他资质'],
      success: (res) => {
        const types = ['business', 'organization', 'tax', 'other'];
        this.onUploadCertificate(types[res.tapIndex]);
      }
    });
  },

  // 上传证书
  async onUploadCertificate(type) {
    try {
      ErrorHandler.showLoading('选择图片...');
      
      wx.chooseMedia({
        count: 9,
        mediaType: ['image'],
        sourceType: ['camera', 'album'],
        sizeType: ['compressed'],
        success: async (res) => {
          console.log('选择的证书图片:', res.tempFiles);
          try {
            // TODO: 上传证书图片到云存储
            // await wx.cloud.uploadFile({ ... });
            
            wx.showToast({
              title: '证书上传成功',
              icon: 'success'
            });
          } catch (error) {
            console.error('上传证书图片失败:', error);
            ErrorHandler.handleRequestError(error, {
              page: this.route,
              action: 'uploadCertificate',
              showToast: true
            });
          } finally {
            ErrorHandler.hideLoading();
          }
        },
        fail: (err) => {
          ErrorHandler.hideLoading();
          if (err.errMsg !== 'chooseMedia:fail cancel') {
            console.error('选择图片失败:', err);
            ErrorHandler.showToast(err);
          }
        }
      });
    } catch (error) {
      ErrorHandler.hideLoading();
      console.error('上传证书失败:', error);
      ErrorHandler.handleRequestError(error, {
        page: this.route,
        action: 'onUploadCertificate'
      });
    }
  },

  // 查看证书详情
  onViewCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    const certificate = this.data.certificates.find(cert => cert.id === certId);
    
    if (certificate) {
      wx.navigateTo({
        url: `/pages/org-certificate-detail/org-certificate-detail?id=${certId}`
      });
    }
  },

  // 编辑证书
  onEditCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    wx.showToast({
      title: '编辑功能开发中',
      icon: 'none'
    });
  },

  // 删除证书
  onDeleteCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个证书吗？',
      confirmText: '删除',
      confirmColor: '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          // TODO: 调用云函数删除证书
          const certificates = this.data.certificates.filter(cert => cert.id !== certId);
          this.setData({ certificates });
          wx.showToast({
            title: '删除成功',
            icon: 'success'
          });
        }
      }
    });
  }
});
