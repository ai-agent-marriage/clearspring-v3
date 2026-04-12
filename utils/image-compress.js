/**
 * 图片压缩工具函数
 * 用于微信小程序图片压缩处理
 * @module utils/image-compress
 */

const { promisify } = require('./cloud.js');

/**
 * 压缩单张图片
 * @function compressImage
 * @param {string} src - 图片路径（临时路径或云文件 ID）
 * @param {number} quality - 压缩质量（1-100），默认 80
 * @returns {Promise<{compressedPath: string, originalSize: number, compressedSize: number}>}
 * 
 * @example
 * // 压缩上传的图片
 * const compressAndUpload = async (tempFilePath) => {
 *   try {
 *     const result = await compressImage(tempFilePath, 80);
 *     console.log(`压缩成功：${result.originalSize}KB -> ${result.compressedSize}KB`);
 *     // 上传压缩后的图片
 *     await wx.cloud.uploadFile({
 *       cloudPath: 'images/cert.jpg',
 *       filePath: result.compressedPath
 *     });
 *   } catch (error) {
 *     console.error('压缩失败:', error);
 *   }
 * };
 */
async function compressImage(src, quality = 80) {
  return new Promise((resolve, reject) => {
    // 获取图片信息
    wx.getImageInfo({
      src,
      success: (infoRes) => {
        const originalWidth = infoRes.width;
        const originalHeight = infoRes.height;
        
        // 压缩图片
        wx.compressImage({
          src,
          quality,
          success: (compressRes) => {
            resolve({
              compressedPath: compressRes.tempFilePath,
              originalWidth,
              originalHeight,
              // 注意：wx.compressImage 不返回具体大小，需要自行估算
              estimatedCompression: `${quality}%`
            });
          },
          fail: (compressErr) => {
            // 如果压缩失败，返回原图
            console.warn('图片压缩失败，使用原图:', compressErr);
            resolve({
              compressedPath: src,
              originalWidth,
              originalHeight,
              estimatedCompression: '100% (未压缩)'
            });
          }
        });
      },
      fail: (infoErr) => {
        reject(new Error(`获取图片信息失败：${infoErr.errMsg}`));
      }
    });
  });
}

/**
 * 批量压缩图片
 * @function compressImages
 * @param {string[]} srcList - 图片路径数组
 * @param {number} quality - 压缩质量（1-100），默认 80
 * @returns {Promise<Array<{src: string, compressedPath: string, originalWidth: number, originalHeight: number}>>}
 * 
 * @example
 * // 批量压缩证书图片
 * const compressCertificates = async (tempFiles) => {
 *   const paths = tempFiles.map(f => f.tempFilePath);
 *   const results = await compressImages(paths, 75);
 *   
 *   results.forEach((result, index) => {
 *     console.log(`图片${index + 1}: ${result.src} -> ${result.compressedPath}`);
 *   });
 *   
 *   return results;
 * };
 */
async function compressImages(srcList, quality = 80) {
  const results = [];
  
  for (const src of srcList) {
    try {
      const result = await compressImage(src, quality);
      results.push({
        src,
        ...result
      });
    } catch (error) {
      console.error(`图片压缩失败：${src}`, error);
      // 失败时返回原图
      results.push({
        src,
        compressedPath: src,
        error: error.message
      });
    }
  }
  
  return results;
}

/**
 * 选择并压缩图片
 * 封装 wx.chooseMedia 和压缩流程
 * @function chooseAndCompressImages
 * @param {Object} options - 选择配置
 * @param {number} options.count - 最大选择数量，默认 9
 * @param {number} options.quality - 压缩质量，默认 80
 * @param {string[]} options.sourceType - 来源类型，默认 ['camera', 'album']
 * @returns {Promise<{tempFiles: Array<{tempFilePath: string, compressedPath: string}>, compressedCount: number}>}
 * 
 * @example
 * // 上传资质证书
 * const uploadCertificates = async () => {
 *   const result = await chooseAndCompressImages({
 *     count: 9,
 *     quality: 75
 *   });
 *   
 *   console.log(`已选择并压缩 ${result.compressedCount} 张图片`);
 *   
 *   // 上传压缩后的图片
 *   for (const file of result.tempFiles) {
 *     await wx.cloud.uploadFile({
 *       cloudPath: `certs/${Date.now()}_${Math.random()}.jpg`,
 *       filePath: file.compressedPath
 *     });
 *   }
 * };
 */
async function chooseAndCompressImages(options = {}) {
  const {
    count = 9,
    quality = 80,
    sourceType = ['camera', 'album']
  } = options;
  
  return new Promise((resolve, reject) => {
    wx.chooseMedia({
      count,
      mediaType: ['image'],
      sourceType,
      sizeType: ['compressed'],
      success: async (chooseRes) => {
        const tempFiles = chooseRes.tempFiles;
        const compressedFiles = [];
        let compressedCount = 0;
        
        // 批量压缩
        for (const file of tempFiles) {
          try {
            const compressed = await compressImage(file.tempFilePath, quality);
            compressedFiles.push({
              ...file,
              compressedPath: compressed.compressedPath
            });
            compressedCount++;
          } catch (error) {
            console.error('图片压缩失败:', error);
            compressedFiles.push(file);
          }
        }
        
        resolve({
          tempFiles: compressedFiles,
          compressedCount,
          totalCount: tempFiles.length
        });
      },
      fail: (err) => {
        if (err.errMsg !== 'chooseMedia:fail cancel') {
          reject(new Error(`选择图片失败：${err.errMsg}`));
        } else {
          reject(new Error('用户取消选择'));
        }
      }
    });
  });
}

/**
 * 计算图片压缩后的尺寸
 * 根据目标宽度等比例缩放
 * @function calculateScaledDimensions
 * @param {number} originalWidth - 原始宽度
 * @param {number} originalHeight - 原始高度
 * @param {number} maxWidth - 最大宽度，默认 1920
 * @returns {{width: number, height: number}}
 */
function calculateScaledDimensions(originalWidth, originalHeight, maxWidth = 1920) {
  if (originalWidth <= maxWidth) {
    return { width: originalWidth, height: originalHeight };
  }
  
  const ratio = maxWidth / originalWidth;
  return {
    width: maxWidth,
    height: Math.round(originalHeight * ratio)
  };
}

module.exports = {
  compressImage,
  compressImages,
  chooseAndCompressImages,
  calculateScaledDimensions
};
