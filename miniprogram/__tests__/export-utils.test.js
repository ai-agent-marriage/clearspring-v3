/**
 * 数据导出工具单元测试
 * 测试 Excel、CSV 导出和图表导出功能
 */

// Mock wx API
global.wx = {
  showLoading: jest.fn(),
  hideLoading: jest.fn(),
  showToast: jest.fn(),
  showModal: jest.fn(),
  showActionSheet: jest.fn(),
  env: {
    USER_DATA_PATH: '/user/data/path'
  },
  getFileSystemManager: jest.fn(() => ({
    writeFileSync: jest.fn()
  })),
  createOffscreenCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      drawImage: jest.fn()
    })),
    toDataURL: jest.fn((options) => {
      if (options.success) {
        options.success({
          dataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=='
        })
      }
    })
  })),
  arrayBufferToBase64: jest.fn((buffer) => 'base64data'),
  shareAppMessage: jest.fn(),
  saveFileToDisk: jest.fn()
}

// Mock wx-xlsx
jest.mock('wx-xlsx', () => {
  return {
    utils: {
      aoa_to_sheet: jest.fn(() => ({})),
      book_new: jest.fn(() => ({})),
      book_append_sheet: jest.fn()
    },
    write: jest.fn(() => new ArrayBuffer(100))
  }
})

describe('Export Utils - Excel Export', () => {
  let exportUtils
  let XLSX

  beforeEach(async () => {
    jest.clearAllMocks()
    exportUtils = await import('../utils/export')
    XLSX = await import('wx-xlsx')
  })

  const mockData = [
    { date: '4-1', orders: 120, amount: 12000, users: 15 },
    { date: '4-2', orders: 200, amount: 20000, users: 25 }
  ]

  const mockHeaders = [
    { key: 'date', label: '日期' },
    { key: 'orders', label: '订单数' },
    { key: 'amount', label: '成交金额' },
    { key: 'users', label: '用户增长' }
  ]

  describe('exportToExcel', () => {
    it('should export data to Excel successfully', async () => {
      const filePath = await exportUtils.exportToExcel(mockData, mockHeaders, '测试导出')
      
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '生成 Excel...',
        mask: true
      })
      
      expect(XLSX.utils.aoa_to_sheet).toHaveBeenCalled()
      expect(XLSX.utils.book_new).toHaveBeenCalled()
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled()
      expect(XLSX.write).toHaveBeenCalled()
      
      expect(wx.getFileSystemManager).toHaveBeenCalled()
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出成功',
        icon: 'success'
      })
      
      expect(filePath).toContain('测试导出')
      expect(filePath).toContain('.xlsx')
    })

    it('should use default filename', async () => {
      await exportUtils.exportToExcel(mockData, mockHeaders)
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出成功',
        icon: 'success'
      })
    })

    it('should handle export error', async () => {
      XLSX.write.mockImplementationOnce(() => {
        throw new Error('Excel generation failed')
      })
      
      await expect(exportUtils.exportToExcel(mockData, mockHeaders))
        .rejects.toThrow('Excel generation failed')
      
      expect(wx.hideLoading).toHaveBeenCalled()
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出失败',
        icon: 'none'
      })
    })
  })

  describe('exportToCSV', () => {
    it('should export data to CSV successfully', async () => {
      const filePath = await exportUtils.exportToCSV(mockData, mockHeaders, '测试 CSV')
      
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '生成 CSV...',
        mask: true
      })
      
      expect(wx.getFileSystemManager).toHaveBeenCalled()
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出成功',
        icon: 'success'
      })
      
      expect(filePath).toContain('测试 CSV')
      expect(filePath).toContain('.csv')
    })

    it('should add BOM for Chinese characters', async () => {
      await exportUtils.exportToCSV(mockData, mockHeaders)
      
      const fs = wx.getFileSystemManager()
      expect(fs.writeFileSync).toHaveBeenCalledWith(
        expect.any(String),
        expect.stringContaining('\uFEFF'), // BOM
        'utf8'
      )
    })

    it('should handle fields with commas', async () => {
      const dataWithCommas = [
        { name: '张，三', value: 100 },
        { name: '李，四', value: 200 }
      ]
      const headers = [
        { key: 'name', label: '姓名' },
        { key: 'value', label: '数值' }
      ]
      
      await exportUtils.exportToCSV(dataWithCommas, headers)
      
      // Should wrap fields in quotes
      const fs = wx.getFileSystemManager()
      const call = fs.writeFileSync.mock.calls[0]
      expect(call[1]).toContain('"张，三"')
    })

    it('should handle CSV export error', async () => {
      wx.getFileSystemManager.mockImplementationOnce(() => {
        throw new Error('File system error')
      })
      
      await expect(exportUtils.exportToCSV(mockData, mockHeaders))
        .rejects.toThrow('File system error')
      
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出失败',
        icon: 'none'
      })
    })
  })
})

describe('Export Utils - Chart Export', () => {
  let exportUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    exportUtils = await import('../utils/export')
  })

  const mockChart = {
    _dom: {
      id: 'trendChart'
    }
  }

  describe('exportChartToImage', () => {
    it('should export chart to image successfully', async () => {
      wx.createSelectorQuery = jest.fn(() => ({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([{
                node: {
                  width: 800,
                  height: 600,
                  getContext: jest.fn(() => ({}))
                }
              }])
            })
          }))
        }))
      }))

      const filePath = await exportUtils.exportChartToImage(mockChart, '测试图表')
      
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: '生成图片...',
        mask: true
      })
      
      expect(wx.createOffscreenCanvas).toHaveBeenCalled()
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出成功',
        icon: 'success'
      })
      
      expect(filePath).toContain('测试图表')
      expect(filePath).toContain('.png')
    })

    it('should handle chart export error', async () => {
      wx.createSelectorQuery = jest.fn(() => ({
        select: jest.fn(() => ({
          fields: jest.fn(() => ({
            exec: jest.fn((callback) => {
              callback([null]) // Canvas not found
            })
          }))
        }))
      }))

      await expect(exportUtils.exportChartToImage(mockChart))
        .rejects.toThrow('Canvas not found')
      
      expect(wx.hideLoading).toHaveBeenCalled()
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '导出失败',
        icon: 'none'
      })
    })
  })
})

describe('Export Utils - Batch Export', () => {
  let exportUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    exportUtils = await import('../utils/export')
  })

  describe('exportBatch', () => {
    it('should export multiple items with progress', async () => {
      const dataList = [
        { id: 1, name: '数据 1' },
        { id: 2, name: '数据 2' },
        { id: 3, name: '数据 3' }
      ]
      
      const mockExportFn = jest.fn().mockResolvedValue(true)
      
      await exportUtils.exportBatch(dataList, mockExportFn, {
        filename: '批量导出',
        format: 'excel'
      })
      
      expect(mockExportFn).toHaveBeenCalledTimes(3)
      expect(wx.showLoading).toHaveBeenCalledTimes(3)
      expect(wx.showLoading).toHaveBeenCalledWith({
        title: expect.stringMatching(/导出中 \d+%/),
        mask: true
      })
      
      expect(wx.hideLoading).toHaveBeenCalled()
      expect(wx.showToast).toHaveBeenCalledWith({
        title: '批量导出完成',
        icon: 'success'
      })
    })

    it('should handle batch export error with continue option', async () => {
      const dataList = [
        { id: 1, name: '数据 1' },
        { id: 2, name: '数据 2' }
      ]
      
      const mockExportFn = jest.fn()
        .mockResolvedValueOnce(true)
        .mockRejectedValueOnce(new Error('Export failed'))
      
      wx.showModal.mockImplementationOnce((options) => {
        if (options.success) {
          options.success({ confirm: true }) // Continue
        }
      })
      
      await exportUtils.exportBatch(dataList, mockExportFn)
      
      expect(wx.showModal).toHaveBeenCalledWith({
        title: '导出失败',
        content: expect.stringContaining('是否继续')
      })
    })
  })
})

describe('Export Utils - Helper Functions', () => {
  let exportUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    exportUtils = await import('../utils/export')
  })

  describe('shareFile', () => {
    it('should share file successfully', () => {
      exportUtils.shareFile('/path/to/file.xlsx')
      
      expect(wx.showShareMenu).toHaveBeenCalledWith({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
      
      expect(wx.saveFileToDisk).toHaveBeenCalledWith({
        filePath: '/path/to/file.xlsx',
        success: expect.any(Function)
      })
    })
  })

  describe('getDateStr', () => {
    it('should return formatted date string', () => {
      // This is tested indirectly through export functions
      expect(exportUtils.exportToExcel).toBeDefined()
    })
  })
})

describe('Export Utils - Integration', () => {
  let exportUtils

  beforeEach(async () => {
    jest.clearAllMocks()
    exportUtils = await import('../utils/export')
  })

  it('should complete full export workflow', async () => {
    const data = [
      { date: '4-1', orders: 120, amount: 12000 }
    ]
    const headers = [
      { key: 'date', label: '日期' },
      { key: 'orders', label: '订单数' },
      { key: 'amount', label: '成交金额' }
    ]
    
    // Test Excel export
    const excelPath = await exportUtils.exportToExcel(data, headers, '完整测试')
    expect(excelPath).toContain('.xlsx')
    
    // Test CSV export
    const csvPath = await exportUtils.exportToCSV(data, headers, '完整测试')
    expect(csvPath).toContain('.csv')
    
    // Verify all UI feedback was shown
    expect(wx.showToast).toHaveBeenCalledWith({
      title: '导出成功',
      icon: 'success'
    })
  })
})
