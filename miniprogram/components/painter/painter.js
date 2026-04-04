// components/painter/painter.js
// 海报生成组件

Component({
  properties: {
    config: {
      type: Object,
      value: {},
      observer: 'onConfigChange'
    }
  },

  data: {
    canvasId: 'posterCanvas',
    isReady: false
  },

  ready() {
    this.initCanvas()
  },

  methods: {
    initCanvas() {
      const { config } = this.data
      if (config && config.width && config.height) {
        this.setData({ isReady: true })
      }
    },

    onConfigChange(newVal) {
      if (newVal && newVal.width && newVal.height) {
        this.setData({ isReady: true })
      }
    },

    paint({ config, success, fail }) {
      if (!config) {
        fail && fail(new Error('配置为空'))
        return
      }

      const { width, height, views } = config
      const ctx = wx.createCanvasContext(this.data.canvasId, this)

      ctx.setWidth(width)
      ctx.setHeight(height)

      if (views && Array.isArray(views)) {
        views.forEach(view => {
          this.drawElement(ctx, view)
        })
      }

      ctx.draw(true, () => {
        setTimeout(() => {
          wx.canvasToTempFilePath({
            canvasId: this.data.canvasId,
            success: (res) => {
              success && success(res)
            },
            fail: (err) => {
              fail && fail(err)
            }
          }, this)
        }, 500)
      })
    },

    drawElement(ctx, view) {
      const { type, css } = view

      ctx.save()

      if (type === 'rect') {
        ctx.setFillStyle(css.color)
        ctx.fillRect(css.left, css.top, css.width, css.height)
      } else if (type === 'text') {
        ctx.setFillStyle(css.color)
        ctx.setFontSize(css.fontSize)
        ctx.setTextAlign(css.textAlign || 'left')
        
        if (css.fontWeight === 'bold') {
          ctx.setFontWeight('bold')
        }
        if (css.fontStyle === 'italic') {
          ctx.setFontStyle('italic')
        }

        const text = view.text || ''
        const maxWidth = css.width || 0
        const lineHeight = css.lineHeight || css.fontSize * 1.5
        
        this.wrapText(ctx, text, css.left, css.top, maxWidth, lineHeight)
      } else if (type === 'image') {
        ctx.drawImage(view.url, css.left, css.top, css.width, css.height)
      } else if (type === 'qrcode') {
        ctx.setFillStyle('#000000')
        ctx.fillRect(css.left, css.top, css.width, css.height)
      }

      ctx.restore()
    },

    wrapText(ctx, text, x, y, maxWidth, lineHeight) {
      const characters = text.split('')
      let line = ''
      let currentY = y

      for (let i = 0; i < characters.length; i++) {
        const testLine = line + characters[i]
        const metrics = ctx.measureText(testLine)
        
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, x, currentY)
          line = characters[i]
          currentY += lineHeight
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, x, currentY)
    }
  }
})
