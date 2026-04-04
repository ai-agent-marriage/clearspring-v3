// utils/poster.js
// 海报生成工具类
/* global getCurrentPages */

import { dailyZenPoster, speciesPoster } from './poster-template'

export function generateDailyZenPoster(zenQuote, author, bgUrl, qrcodeContent) {
  return new Promise((resolve, reject) => {
    try {
      const posterConfig = {
        ...dailyZenPoster,
        views: dailyZenPoster.views.map(view => {
          if (view.type === 'image' && view.css.top === 0) {
            return { ...view, url: bgUrl || view.url }
          }
          if (view.type === 'text' && view.css.top === 400) {
            return { ...view, text: zenQuote }
          }
          if (view.type === 'text' && view.css.top === 700) {
            return { ...view, text: `—— ${author}` }
          }
          if (view.type === 'qrcode') {
            return { ...view, content: qrcodeContent || view.content }
          }
          return view
        })
      }

      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const painter = currentPage.selectComponent('#painter')

      if (!painter) {
        reject(new Error('未找到 painter 组件'))
        return
      }

      painter.paint({
        config: posterConfig,
        success: (res) => {
          resolve(res.tempFilePath)
        },
        fail: (err) => {
          reject(err)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function generateSpeciesPoster(species, bgUrl, qrcodeContent) {
  return new Promise((resolve, reject) => {
    try {
      const posterConfig = {
        ...speciesPoster,
        views: speciesPoster.views.map(view => {
          if (view.type === 'image' && view.css.top === 0) {
            return { ...view, url: bgUrl || view.url }
          }
          if (view.type === 'text' && view.css.top === 300) {
            return { ...view, text: species.name }
          }
          if (view.type === 'text' && view.css.top === 400) {
            return { ...view, text: species.scientificName }
          }
          if (view.type === 'text' && view.css.top === 550) {
            return { ...view, text: species.remark }
          }
          if (view.type === 'qrcode') {
            return { ...view, content: qrcodeContent || view.content }
          }
          return view
        })
      }

      const pages = getCurrentPages()
      const currentPage = pages[pages.length - 1]
      const painter = currentPage.selectComponent('#painter')

      if (!painter) {
        reject(new Error('未找到 painter 组件'))
        return
      }

      painter.paint({
        config: posterConfig,
        success: (res) => {
          resolve(res.tempFilePath)
        },
        fail: (err) => {
          reject(err)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}

export function savePosterToAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => doSave(),
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '需要相册权限才能保存海报，是否前往设置？',
                success: (modalRes) => {
                  if (modalRes.confirm) {
                    wx.openSetting()
                  }
                }
              })
              reject(new Error('未授权'))
            }
          })
        } else {
          doSave()
        }
      }
    })

    function doSave() {
      wx.saveImageToPhotosAlbum({
        filePath: filePath,
        success: () => {
          wx.showToast({ title: '已保存到相册', icon: 'success' })
          resolve(true)
        },
        fail: (err) => {
          reject(err)
        }
      })
    }
  })
}

export default { generateDailyZenPoster, generateSpeciesPoster, savePosterToAlbum }
