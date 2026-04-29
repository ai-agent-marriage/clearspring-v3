/**
 * Vitest 测试配置文件
 * 用于设置全局测试环境
 */

import { config } from '@vue/test-utils'

// 全局配置
config.global.mocks = {
  $router: {
    push: () => {},
    replace: () => {}
  },
  $route: {
    query: {},
    params: {}
  }
}

// 抑制 Vue 警告
config.global.config.warnHandler = () => {}

// 全局 beforeEach
beforeEach(() => {
  // 清理 localStorage
  localStorage.clear()
})
