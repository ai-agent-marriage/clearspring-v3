/**
 * 内容安全审核工具类
 * 集成微信小程序内容安全 API
 */

/**
 * 图片内容安全审核
 * @param {string} filePath - 图片文件路径
 * @returns {Promise<boolean>} - 审核是否通过
 */
export function checkImage(filePath) {
  return new Promise((resolve, reject) => {
    wx.security.imgSecCheck({
      mediaType: 1, // 1: 图片
      image: filePath,
      success: () => {
        console.log('图片审核通过:', filePath);
        resolve(true);
      },
      fail: (err) => {
        console.error('图片审核失败:', err);
        wx.showToast({
          title: '图片包含违规内容',
          icon: 'none',
          duration: 2000
        });
        resolve(false);
      }
    });
  });
}

/**
 * 文本内容安全审核
 * @param {string} content - 待审核文本内容
 * @returns {Promise<boolean>} - 审核是否通过
 */
export function checkText(content) {
  return new Promise((resolve, reject) => {
    wx.security.msgSecCheck({
      content: content,
      success: () => {
        console.log('文本审核通过');
        resolve(true);
      },
      fail: (err) => {
        console.error('文本审核失败:', err);
        wx.showToast({
          title: '文本包含违规内容',
          icon: 'none',
          duration: 2000
        });
        resolve(false);
      }
    });
  });
}

/**
 * 批量图片审核
 * @param {string[]} filePaths - 图片文件路径数组
 * @returns {Promise<boolean>} - 是否全部通过
 */
export async function checkImagesBatch(filePaths) {
  for (const filePath of filePaths) {
    const pass = await checkImage(filePath);
    if (!pass) {
      return false;
    }
  }
  return true;
}

/**
 * 表单内容综合审核
 * @param {Object} formData - 表单数据
 * @returns {Promise<Object>} - 审核结果
 */
export async function checkFormData(formData) {
  const result = {
    pass: true,
    errors: []
  };

  // 审核文本内容
  if (formData.wish) {
    const textPass = await checkText(formData.wish);
    if (!textPass) {
      result.pass = false;
      result.errors.push('心愿内容包含违规信息');
    }
  }

  // 审核图片
  if (formData.images && formData.images.length > 0) {
    const imagesPass = await checkImagesBatch(formData.images);
    if (!imagesPass) {
      result.pass = false;
      result.errors.push('图片包含违规内容');
    }
  }

  return result;
}
