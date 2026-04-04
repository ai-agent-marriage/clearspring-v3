// utils/poster-template.js
// 海报模板配置

export const dailyZenPoster = {
  width: 1080,
  height: 1920,
  views: [
    {
      type: 'image',
      url: 'https://picsum.photos/1080/1920',
      css: { top: 0, left: 0, width: 1080, height: 1920 }
    },
    {
      type: 'rect',
      css: { top: 0, left: 0, width: 1080, height: 1920, color: 'rgba(0, 0, 0, 0.4)' }
    },
    {
      type: 'text',
      text: '今日禅理',
      css: { top: 200, left: 100, width: 880, fontSize: 48, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }
    },
    {
      type: 'text',
      text: '心无挂碍',
      css: { top: 400, left: 100, width: 880, fontSize: 56, color: '#ffffff', textAlign: 'center', lineHeight: 80, fontFamily: 'Noto Serif SC' }
    },
    {
      type: 'text',
      text: '—— 心经',
      css: { top: 700, left: 100, width: 880, fontSize: 40, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', fontStyle: 'italic' }
    },
    {
      type: 'qrcode',
      content: 'https://example.com',
      css: { top: 1600, left: 440, width: 200, height: 200 }
    },
    {
      type: 'text',
      text: '扫码进入小程序',
      css: { top: 1820, left: 440, width: 200, fontSize: 28, color: '#ffffff', textAlign: 'center' }
    }
  ]
}

export const speciesPoster = {
  width: 1080,
  height: 1920,
  views: [
    {
      type: 'image',
      url: 'https://picsum.photos/1080/1920',
      css: { top: 0, left: 0, width: 1080, height: 1920 }
    },
    {
      type: 'rect',
      css: { top: 0, left: 0, width: 1080, height: 1920, color: 'rgba(74, 93, 78, 0.8)' }
    },
    {
      type: 'text',
      text: '护生物种科普',
      css: { top: 100, left: 100, width: 880, fontSize: 52, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }
    },
    {
      type: 'text',
      text: '物种名称',
      css: { top: 300, left: 100, width: 880, fontSize: 64, color: '#ffffff', textAlign: 'center', fontWeight: 'bold' }
    },
    {
      type: 'text',
      text: 'Scientific Name',
      css: { top: 400, left: 100, width: 880, fontSize: 36, color: 'rgba(255, 255, 255, 0.8)', textAlign: 'center', fontStyle: 'italic' }
    },
    {
      type: 'text',
      text: '物种简介内容',
      css: { top: 550, left: 100, width: 880, fontSize: 36, color: '#ffffff', textAlign: 'center', lineHeight: 56 }
    },
    {
      type: 'qrcode',
      content: 'https://example.com',
      css: { top: 1600, left: 440, width: 200, height: 200 }
    }
  ]
}

export default { dailyZenPoster, speciesPoster }
