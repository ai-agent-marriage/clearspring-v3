// 清如 ClearSpring - 机构资质管理页 V-09
/**
 * @file 机构资质管理页面
 * @description 管理机构资质认证、证书上传
 * @version 4.0.0
 */

const ErrorHandler = require('../../utils/error-handler');
const ImageCompress = require('../../utils/image-compress');

Page({
  data: {
    currentStatus: 'verified', statusTitle: '已认证', statusDesc: '您的机构已通过平台认证',
    expireDate: '2027-03-28', showActionButton: false, actionButtonText: '',
    currentStep: 4, submitDate: '2026-03-20', reviewDate: '2026-03-22',
    inspectionDate: '2026-03-25', completeDate: '2026-03-28',
    rejectionReason: '营业执照照片不够清晰', rejectionSuggestions: '请重新拍摄',
    certificates: [],
    requirements: []
  },

  onLoad(options) {
    if (options.status) { this.updateStatus(options.status); }
    this.loadQualificationData();
  },

  onShow() { this.loadQualificationData(); },
  onPullDownRefresh() { this.loadQualificationData().then(() => wx.stopPullDownRefresh()); },

  /**
   * 加载资质数据
   * @async
   */
  async loadQualificationData() {
    try {
      ErrorHandler.showLoading('加载中...');
      // TODO: 调用云函数获取资质数据
      await new Promise((resolve) => setTimeout(() => resolve(), 300));
    } catch (error) {
      console.error('加载资质数据失败:', error);
      ErrorHandler.handleRequestError(error, { page: this.route, action: 'loadQualificationData', showToast: true });
    } finally {
      ErrorHandler.hideLoading();
    }
  },

  updateStatus(status) {
    const statusMap = {
      verified: { title: '已认证', desc: '您的机构已通过平台认证', showAction: false },
      pending: { title: '审核中', desc: '平台正在审核您的资质', showAction: false },
      rejected: { title: '已驳回', desc: '您的资质未通过审核', showAction: true, actionText: '重新提交' },
      expired: { title: '已过期', desc: '您的资质已过期，请重新认证', showAction: true, actionText: '重新认证' }
    };
    const statusInfo = statusMap[status] || statusMap.verified;
    this.setData({
      currentStatus: status, statusTitle: statusInfo.title, statusDesc: statusInfo.desc,
      showActionButton: statusInfo.showAction, actionButtonText: statusInfo.actionText || ''
    });
  },

  onUpdateQualification() { wx.navigateTo({ url: '/pages/org-qualification-apply/org-qualification-apply' }); },

  onAddCertificate() {
    wx.showActionSheet({
      itemList: ['上传营业执照', '上传组织代码证', '上传税务登记证', '上传其他资质'],
      success: (res) => {
        const types = ['business', 'organization', 'tax', 'other'];
        this.onUploadCertificate(types[res.tapIndex]);
      }
    });
  },

  /**
   * 上传证书（使用图片压缩）
   * @async
   * @param {string} type - 证书类型
   */
  async onUploadCertificate(type) {
    try {
      ErrorHandler.showLoading('选择图片...');
      const result = await ImageCompress.chooseAndCompressImages({
        count: 9, quality: 80, sourceType: ['camera', 'album']
      });
      
      console.log('选择的证书图片:', result.tempFiles);
      console.log(`已压缩 ${result.compressedCount}/${result.totalCount} 张图片`);
      
      try {
        // TODO: 上传证书图片到云存储
        wx.showToast({ title: '证书上传成功', icon: 'success' });
      } catch (error) {
        console.error('上传证书图片失败:', error);
        ErrorHandler.handleRequestError(error, { page: this.route, action: 'uploadCertificate', showToast: true });
      } finally {
        ErrorHandler.hideLoading();
      }
    } catch (error) {
      ErrorHandler.hideLoading();
      if (error.message !== '用户取消选择') {
        console.error('上传证书失败:', error);
        ErrorHandler.handleRequestError(error, { page: this.route, action: 'onUploadCertificate' });
      }
    }
  },

  onViewCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    const certificate = this.data.certificates.find(cert => cert.id === certId);
    if (certificate) { wx.navigateTo({ url: `/pages/org-certificate-detail/org-certificate-detail?id=${certId}` }); }
  },

  onEditCertificate() { wx.showToast({ title: '编辑功能开发中', icon: 'none' }); },

  onDeleteCertificate(e) {
    const certId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确认删除', content: '确定要删除这个证书吗？',
      confirmText: '删除', confirmColor: ErrorHandler.COLORS?.error || '#BA1A1A',
      success: (res) => {
        if (res.confirm) {
          const certificates = this.data.certificates.filter(cert => cert.id !== certId);
          this.setData({ certificates });
          wx.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  }
});
