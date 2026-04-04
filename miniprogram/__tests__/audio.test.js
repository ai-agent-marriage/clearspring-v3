/**
 * 梵音首页单元测试
 * 测试音频页面数据初始化和功能
 */

describe('梵音首页测试', () => {
  
  test('音频列表数据正确', () => {
    const page = getPage('/pages/audio/index')
    expect(page.data.audioList).toBeInstanceOf(Array)
    expect(page.data.audioList.length).toBe(9)
  })
  
  test('禅理短句存在', () => {
    const page = getPage('/pages/audio/index')
    expect(page.data.zenQuote).toBeTruthy()
  })
  
  test('音频对象结构正确', () => {
    const page = getPage('/pages/audio/index')
    const audio = page.data.audioList[0]
    expect(audio).toHaveProperty('id')
    expect(audio).toHaveProperty('title')
    expect(audio).toHaveProperty('listenCount')
  })
  
  test('音频对象包含完整属性', () => {
    const page = getPage('/pages/audio/index')
    const audio = page.data.audioList[0]
    expect(audio).toHaveProperty('id')
    expect(audio).toHaveProperty('title')
    expect(audio).toHaveProperty('listenCount')
    expect(audio).toHaveProperty('duration')
    expect(audio).toHaveProperty('url')
  })
  
  test('所有音频对象结构一致', () => {
    const page = getPage('/pages/audio/index')
    page.data.audioList.forEach((audio, index) => {
      expect(audio).toHaveProperty('id')
      expect(audio).toHaveProperty('title')
      expect(audio).toHaveProperty('listenCount')
      expect(audio).toHaveProperty('duration')
      expect(audio).toHaveProperty('url')
      // 验证类型
      expect(typeof audio.id).toBe('number')
      expect(typeof audio.title).toBe('string')
      expect(typeof audio.listenCount).toBe('number')
    })
  })
  
  test('音频播放次数为正整数', () => {
    const page = getPage('/pages/audio/index')
    page.data.audioList.forEach(audio => {
      expect(audio.listenCount).toBeGreaterThanOrEqual(0)
      expect(Number.isInteger(audio.listenCount)).toBe(true)
    })
  })
  
  test('禅语内容有效', () => {
    const page = getPage('/pages/audio/index')
    expect(page.data.zenQuote).toBeTruthy()
    expect(page.data.zenQuote.length).toBeGreaterThan(0)
    expect(typeof page.data.zenQuote).toBe('string')
  })
  
  test('音频 ID 唯一', () => {
    const page = getPage('/pages/audio/index')
    const ids = page.data.audioList.map(audio => audio.id)
    const uniqueIds = [...new Set(ids)]
    expect(ids.length).toBe(uniqueIds.length)
  })
})
