/**
 * Q-17 订单评价页测试用例
 * 文件：__tests__/q-17-order-review.test.js
 */

describe('Q-17 订单评价页测试', () => {
  beforeEach(() => {
    wx.clearStorageSync();
  });

  test('1. 页面正常加载', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    expect(page).toBeDefined();
    expect(page.data.overallRating).toBe(0);
  });

  test('2. 加载订单信息', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    page.loadOrderInfo('ORDER001');
    expect(page.data.orderInfo.orderNo).toBe('CR202604110001');
  });

  test('3. 整体评分点击', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.onOverallRatingTap({ currentTarget: { dataset: { index: 4 } } });
    expect(page.data.overallRating).toBe(5);
    expect(page.data.overallRatingText).toBe('非常满意');
  });

  test('4. 服务态度评分', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.onServiceRatingTap({ currentTarget: { dataset: { index: 3 } } });
    expect(page.data.serviceRating).toBe(4);
  });

  test('5. 服务质量评分', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.onQualityRatingTap({ currentTarget: { dataset: { index: 2 } } });
    expect(page.data.qualityRating).toBe(3);
  });

  test('6. 评价标签选择', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.onTagTap({ currentTarget: { dataset: { id: 1 } } });
    expect(page.data.reviewTags[0].active).toBe(true);
    
    page.onTagTap({ currentTarget: { dataset: { id: 1 } } });
    expect(page.data.reviewTags[0].active).toBe(false);
  });

  test('7. 评价内容输入', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.onReviewInput({ detail: { value: '非常好的服务！' } });
    expect(page.data.reviewContent).toBe('非常好的服务！');
    expect(page.data.reviewContent.length).toBe(7);
  });

  test('8. 上传图片', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    wx.chooseMedia.mockResolvedValue({
      tempFiles: [{ tempFilePath: '/tmp/image1.jpg' }]
    });
    
    page.onUploadImage();
    expect(page.data.reviewImages.length).toBe(1);
  });

  test('9. 删除图片', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    page.data.reviewImages = ['/tmp/image1.jpg', '/tmp/image2.jpg'];
    
    page.onDeleteImage({ currentTarget: { dataset: { index: 0 } } });
    expect(page.data.reviewImages.length).toBe(1);
    expect(page.data.reviewImages[0]).toBe('/tmp/image2.jpg');
  });

  test('10. 匿名评价开关', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.onAnonymousChange({ detail: { value: true } });
    expect(page.data.isAnonymous).toBe(true);
  });

  test('11. 提交验证 - 未评分', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    page.data.overallRating = 0;
    
    page.submitReview();
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '请完成评分',
      icon: 'none'
    });
  });

  test('12. 提交评价成功', async () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    page.data.overallRating = 5;
    page.data.serviceRating = 5;
    page.data.qualityRating = 5;
    page.data.canSubmit = true;
    
    await page.submitReview();
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '评价提交成功',
      icon: 'success'
    });
  });

  test('13. 检查提交条件', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    
    page.data.overallRating = 0;
    page.data.serviceRating = 5;
    page.data.qualityRating = 5;
    page.checkCanSubmit();
    expect(page.data.canSubmit).toBe(false);
    
    page.data.overallRating = 5;
    page.checkCanSubmit();
    expect(page.data.canSubmit).toBe(true);
  });

  test('14. 返回功能', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    page.goBack();
    expect(wx.navigateBack).toHaveBeenCalledWith({ delta: 1 });
  });

  test('15. 字符计数', () => {
    const page = getInstance('/pages/q-17-order-review/q-17-order-review');
    page.onReviewInput({ detail: { value: '这是一段测试文本'.repeat(50) } });
    expect(page.data.reviewContent.length).toBeLessThanOrEqual(500);
  });
});
