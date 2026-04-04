/**
 * ECharts 工具类单元测试
 */

import {
  disposeChart,
  updateChart,
  resizeChart,
  createDarkTheme,
  createPrimaryTheme,
  createGradient
} from '../utils/echarts'

describe('ECharts Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createDarkTheme', () => {
    it('should return dark theme configuration', () => {
      const theme = createDarkTheme()

      expect(theme.backgroundColor).toBe('#1a1a2e')
      expect(theme.textStyle.color).toBe('#ffffff')
      expect(theme.axisLine.lineStyle.color).toBe('rgba(255, 255, 255, 0.3)')
      expect(theme.splitLine.lineStyle.color).toBe('rgba(255, 255, 255, 0.1)')
    })
  })

  describe('createPrimaryTheme', () => {
    it('should return primary theme configuration', () => {
      const theme = createPrimaryTheme()

      expect(theme.primaryColor).toBe('#4A5D4E')
      expect(theme.secondaryColor).toBe('#FFA500')
      expect(theme.accentColor).toBe('#409EFF')
    })
  })

  // Note: createGradient requires echarts instance, skipped in unit tests
  // Integration tests cover this functionality

  describe('disposeChart', () => {
    it('should dispose chart instance', () => {
      const mockChart = { dispose: jest.fn() }
      disposeChart(mockChart)
      expect(mockChart.dispose).toHaveBeenCalled()
    })

    it('should handle null chart', () => {
      expect(() => disposeChart(null)).not.toThrow()
    })

    it('should handle chart without dispose method', () => {
      expect(() => disposeChart({})).not.toThrow()
    })
  })

  describe('updateChart', () => {
    it('should update chart with new option', () => {
      const mockChart = { setOption: jest.fn() }
      const newOption = { series: [{ data: [1, 2, 3] }] }
      updateChart(mockChart, newOption)

      expect(mockChart.setOption).toHaveBeenCalledWith(newOption, false)
    })

    it('should update chart with notMerge option', () => {
      const mockChart = { setOption: jest.fn() }
      updateChart(mockChart, {}, true)
      expect(mockChart.setOption).toHaveBeenCalledWith({}, true)
    })

    it('should handle null chart', () => {
      expect(() => updateChart(null, {})).not.toThrow()
    })
  })

  describe('resizeChart', () => {
    it('should resize chart', () => {
      const mockChart = { resize: jest.fn() }
      resizeChart(mockChart)
      expect(mockChart.resize).toHaveBeenCalled()
    })

    it('should handle null chart', () => {
      expect(() => resizeChart(null)).not.toThrow()
    })
  })
})
