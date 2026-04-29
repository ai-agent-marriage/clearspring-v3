// 清如 ClearSpring - 执行者资质管理页 O-10
/**
 * @file 执行者资质管理页面
 * @description 管理执行者的资质认证状态、证书上传、擅长领域等
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');
const ImageCompress = require('../../utils/image-compress');

Page({
  data: {
    // 当前资质状态：verified, pending, rejected, expired
    currentStatus: 'verified',
    statusTitle: '已认证',
    statusDesc: '您的资质已通过平台审核',
    expireDate: '2027-03-28',
    showActionButton: false,
    actionButtonText: '',
    
    // 审核进度
    currentStep: 3, // 1: 提交申请，2: 平台审核，3: 审核完成
    submitDate: '2026-03-25',
    reviewDate: '2026-03-26',
    completeDate: '2026-03-27',
    
    // 驳回原因
    rejectionReason: '身份证照片不够清晰，无法辨认关键信息',
    rejectionSuggestions: '请重新拍摄身份证照片，确保光线充足、对焦清晰，四个角都拍摄完整',
    
    // 证书列表
    certificates: [
      {
        id: 'cert_001',
        name: '心理咨询师证书',
        type: 'skill',
        typeText: '技能认证',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2025-06-15',
        validDate: '2028-06-15'
      },

  onUnload() {
    // 清理定时器，防止内存泄漏
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  },
      {
        id: 'cert_002',
        name: '健康管理师证书',
        type: 'skill',
        typeText: '技能认证',
        status: 'pending',
        statusText: '审核中',
        issueDate: '2025-09-20',
        validDate: '2028-09-20'
      },
      {
        id: 'cert_003',
        name: '应急救援员证书',
        type: 'qualification',
        typeText: '资质认证',
        status: 'verified',
        statusText: '已认证',
        issueDate: '2024-12-10',
        validDate: '2027-12-10'
      }
    ],
    
    // 擅长领域标签
    skillTags: [
      { id: 'skill_001', name: '心理咨询', active: true },
      { id: 'skill_002', name: '健康管理', active: true },
      { id: 'skill_003', name: '应急救援', active: true },
      { id: 'skill_004', name: '生活陪伴', active: false },
      { id: 'skill_005', name: '活动组织', active: false },
      { id: 'skill_006', name: '文案写作', active: false },
      { id: 'skill_007', name: '摄影摄像', active: false },
      { id: 'skill_008', name: '翻译服务', active: false }
    ]
  },

  /**
   * 页面加载
   * @param {Object} options - 页面参数
   */
  onLoad(options) {
    // 从上一页获取状态参数
    if (options.status) {
      this.updateStatus(options.status);
    }
    this.loadQualificationData();
  },

  /**
   * 页面显示
   */
  onShow() {
    // 页面显示时刷新数据
    this.loadQualificationData();
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh() {
    this.loadQualificationData().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  /**
   * 加载资质数据
   * @async
   * @returns {Promise<void>}
   */
  async loadQualificationData() {
    try {
      ErrorHandler.showLoading('加载中...');
      
      // TODO: 调用云函数获取资质数据
      // const res = await wx.cloud.callFunction({
      //   name: 'getQualificationStatus',
      //   data: {}
      // });
      
      // 模拟数据
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

  /**
   * 更新状态显示
   * @param {string} status - 资质状态 (verified/pending/rejected/expired)
   */
  updateStatus(status) {
    const statusMap = {
      verified: {
        title: '已认证',
        desc: '您的资质已通过平台审核',
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

  /**
   * 更新资质
   */
  onUpdateQualification() {
    wx.navigateTo({
      url: '/pages/executor-qualification/executor-qualification'
    });
  },

  /**
   * 添加证书
   */
  onAddCertificate() {
    wx.showActionSheet({
      itemList: ['上传技能证书', '上传资质证书'],
      success: (res) => {
        if (res.tapIndex === 0) {
          this.onUploadSkillCertificate();
        } else if (res.tapIndex === 1) {
          this.onUploadQualificationCertificate();
        }
      }
    });
  },

  /**
   * 上传技能证书（使用图片压缩）
   * @async
   */
  async onUploadSkillCertificate() {
    try {
      ErrorHandler.showLoading('选择图片...');
      
      // 使用图片压缩工具选择并压缩图片
      const result = await ImageCompress.chooseAndCompressImages({
        count: 9,
        quality: 80,
        sourceType: ['camera', 'album']
      });
      
      // [CLEANED] console.log('选择的证书图片:', result.tempFiles);
      // [CLEANED] console.log(`已压缩 ${result.compressedCount}/${result.totalCount} 张图片`);
      
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
          action: 'uploadSkillCertificate',
          showToast: true
        });
      } finally {
        ErrorHandler.hideLoading();
      }
    } catch (error) {
      ErrorHandler.hideLoading();
      if (error.message !== '用户取消选择') {
        console.error('上传技能证书失败:', error);
        ErrorHandler.handleRequestError(error, {
          page: this.route,
          action: 'onUploadSkillCertificate'
        });
      }
    }
  },

  /**
   * 上传资质证书（使用图片压缩）
   * @async
   */
  async onUploadQualificationCertificate() {
    try {
      ErrorHandler.showLoading('选择图片...');
      
      // 使用图片压缩工具选择并压缩图片
      const result = await ImageCompress.chooseAndCompressImages({
        count: 9,
        quality: 80,
        sourceType: ['camera', 'album']
      });
      
      // [CLEANED] console.log('选择的资质证书图片:', result.tempFiles);
      // [CLEANED] console.log(`已压缩 ${result.compressedCount}/${result.totalCount} 张图片`);
      
      try {
        // TODO: 上传资质证书图片到云存储
        // await wx.cloud.uploadFile({ ... });
        
        wx.showToast({
          title: '证书上传成功',
          icon: 'success'
        });
      } catch (error) {
        console.error('上传证书图片失败:', error);
        ErrorHandler.handleRequestError(error, {
          page: this.route,
          action: 'uploadQualificationCertificate',
          showToast: true
        });
      } finally {
        ErrorHandler.hideLoading();
      }
    } catch (error) {
      ErrorHandler.hideLoading();
      if (error.message !== '用户取消选择') {
        console.error('上传资质证书失败:', error);
        ErrorHandler.handleRequestError(error, {
          page: this.route,
          action: 'onUploadQualificationCertificate'
        });
      }
    }
  },

  /**
   * 查看证书详情
   * @param {Event} e - 点击事件
   */
  onViewCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    const certificate = this.data.certificates.find(cert => cert.id === certId);
    
    if (certificate) {
      wx.navigateTo({
        url: `/pages/executor-certificate-detail/executor-certificate-detail?id=${certId}`
      });
    }
  },

  /**
   * 删除证书
   * @param {Event} e - 点击事件
   */
  onDeleteCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个证书吗？',
      confirmText: '删除',
      confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
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
  },

  /**
   * 编辑擅长领域
   */
  onEditSkills() {
    wx.showToast({
      title: '点击标签即可编辑',
      icon: 'none'
    });
  },

  /**
   * 切换擅长领域
   * @param {Event} e - 点击事件
   */
  onToggleSkill(e) {
    const skillId = e.currentTarget.dataset.id;
    const skillTags = this.data.skillTags.map(tag => {
      if (tag.id === skillId) {
        return { ...tag, active: !tag.active };
      }
      return tag;
    });
    
    this.setData({ skillTags });
    
    // TODO: 保存到云端
    // [CLEANED] console.log('更新擅长领域:', skillTags.filter(tag => tag.active));
  },

  /**
   * 菜单点击
   * @param {Event} e - 点击事件
   */
  onMenuTap(e) {
    const action = e.currentTarget.dataset.action;
    
    switch (action) {
      case 'rules':
        wx.navigateTo({
          url: '/pages/executor-qualification-rules/executor-qualification-rules'
        });
        break;
      case 'help':
        wx.navigateTo({
          url: '/pages/help/index'
        });
        break;
    }
  }
});
