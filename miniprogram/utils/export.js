/**
 * 数据导出工具类
 * 支持 Excel 和 CSV 格式导出
 */

/**
 * 导出为 Excel 文件
 * @param {array} data - 数据数组
 * @param {array} headers - 表头配置 [{key: 'name', label: '姓名'}]
 * @param {string} filename - 文件名
 * @returns {Promise<string>} 文件路径
 */
export async function exportToExcel(data, headers, filename = 'export') {
  try {
    // 显示加载提示
    wx.showLoading({
      title: '生成 Excel...',
      mask: true
    });

    // 使用 wx-xlsx 库生成 Excel
    const XLSX = require('wx-xlsx');
    
    // 准备工作表数据
    const wsData = [
      headers.map(h => h.label) // 表头
    ];
    
    // 添加数据行
    data.forEach(row => {
      const rowData = headers.map(h => row[h.key] || '');
      wsData.push(rowData);
    });
    
    // 创建工作表
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // 创建工作簿
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    
    // 生成文件
    const fileName = `${filename}_${getDateStr()}.xlsx`;
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    // 写入文件
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'arraybuffer' });
    
    // 保存到本地
    const fs = wx.getFileSystemManager();
    fs.writeFileSync(filePath, wbout);
    
    wx.hideLoading();
    
    // 提示用户
    wx.showToast({
      title: '导出成功',
      icon: 'success'
    });
    
    return filePath;
  } catch (error) {
    console.error('Export to Excel error:', error);
    wx.hideLoading();
    wx.showToast({
      title: '导出失败',
      icon: 'none'
    });
    throw error;
  }
}

/**
 * 导出为 CSV 文件
 * @param {array} data - 数据数组
 * @param {array} headers - 表头配置
 * @param {string} filename - 文件名
 * @returns {Promise<string>} 文件路径
 */
export async function exportToCSV(data, headers, filename = 'export') {
  try {
    wx.showLoading({
      title: '生成 CSV...',
      mask: true
    });

    // 生成 CSV 内容
    let csvContent = headers.map(h => h.label).join(',') + '\n';
    
    data.forEach(row => {
      const rowData = headers.map(h => {
        const value = row[h.key] || '';
        // 处理包含逗号的字段
        return `"${value}"`;
      }).join(',');
      csvContent += rowData + '\n';
    });
    
    // 添加 BOM 头（解决 Excel 中文乱码）
    const BOM = '\uFEFF';
    csvContent = BOM + csvContent;
    
    // 保存文件
    const fileName = `${filename}_${getDateStr()}.csv`;
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    const fs = wx.getFileSystemManager();
    fs.writeFileSync(filePath, csvContent, 'utf8');
    
    wx.hideLoading();
    
    wx.showToast({
      title: '导出成功',
      icon: 'success'
    });
    
    return filePath;
  } catch (error) {
    console.error('Export to CSV error:', error);
    wx.hideLoading();
    wx.showToast({
      title: '导出失败',
      icon: 'none'
    });
    throw error;
  }
}

/**
 * 导出图表数据
 * @param {object} chart - ECharts 实例
 * @param {string} filename - 文件名
 * @returns {Promise<string>} 图片路径
 */
export async function exportChartToImage(chart, filename = 'chart') {
  try {
    wx.showLoading({
      title: '生成图片...',
      mask: true
    });

    // 获取图表的 base64 数据
    const canvasId = chart._dom.id;
    const query = wx.createSelectorQuery();
    
    const canvasInfo = await new Promise((resolve, reject) => {
      query.select(`#${canvasId}`)
        .fields({ node: true })
        .exec((res) => {
          if (res[0]) {
            resolve(res[0]);
          } else {
            reject(new Error('Canvas not found'));
          }
        });
    });
    
    const canvas = canvasInfo.node;
    
    // 创建临时 Canvas 用于导出
    const tempCanvas = wx.createOffscreenCanvas({
      type: '2d',
      width: canvas.width,
      height: canvas.height
    });
    
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(canvas, 0, 0);
    
    // 导出为图片
    const fileName = `${filename}_${getDateStr()}.png`;
    const filePath = `${wx.env.USER_DATA_PATH}/${fileName}`;
    
    // 使用 Canvas 的 toDataURL 方法
    const res = await new Promise((resolve, reject) => {
      tempCanvas.toDataURL({
        success: resolve,
        fail: reject
      });
    });
    
    // 保存文件
    const fs = wx.getFileSystemManager();
    const base64Data = res.dataURL.replace(/^data:image\/\w+;base64,/, '');
    const buffer = wx.arrayBufferToBase64(base64Data);
    fs.writeFileSync(filePath, buffer, 'base64');
    
    wx.hideLoading();
    
    wx.showToast({
      title: '导出成功',
      icon: 'success'
    });
    
    return filePath;
  } catch (error) {
    console.error('Export chart error:', error);
    wx.hideLoading();
    wx.showToast({
      title: '导出失败',
      icon: 'none'
    });
    throw error;
  }
}

/**
 * 批量导出数据（带进度提示）
 * @param {array} dataList - 数据列表
 * @param {function} exportFn - 导出函数
 * @param {object} options - 导出选项
 */
export async function exportBatch(dataList, exportFn, options = {}) {
  const { filename = 'batch_export' } = options;
  const total = dataList.length;
  
  for (let i = 0; i < total; i++) {
    const progress = Math.round(((i + 1) / total) * 100);
    
    wx.showLoading({
      title: `导出中 ${progress}%`,
      mask: true
    });
    
    try {
      await exportFn(dataList[i], `${filename}_${i + 1}`);
    } catch (error) {
      console.error(`Export item ${i + 1} failed:`, error);
      wx.hideLoading();
      wx.showModal({
        title: '导出失败',
        content: `第 ${i + 1} 条数据导出失败，是否继续？`,
        success: (res) => {
          if (res.cancel) {
            return;
          }
        }
      });
    }
  }
  
  wx.hideLoading();
  wx.showToast({
    title: '批量导出完成',
    icon: 'success'
  });
}

/**
 * 获取日期字符串
 * @returns {string} 格式化日期
 */
function getDateStr() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}${month}${day}_${hours}${minutes}`;
}

/**
 * 分享文件到微信
 * @param {string} filePath - 文件路径
 */
export function shareFile(filePath) {
  wx.showShareMenu({
    withShareTicket: true,
    menus: ['shareAppMessage', 'shareTimeline']
  });
  
  // 保存到相册或分享
  wx.saveFileToDisk({
    filePath,
    success: () => {
      wx.showToast({
        title: '已保存到相册',
        icon: 'success'
      });
    },
    fail: (error) => {
      console.error('Save file error:', error);
    }
  });
}
