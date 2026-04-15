/**
 * 导航栏组件逻辑 - Stitch V3.0 规范
 * 支持自定义左右侧内容、标题、返回按钮等
 */

Component({
  properties: {
    // 标题文字
    title: {
      type: String,
      value: ''
    },
    // 是否显示返回按钮
    showBack: {
      type: Boolean,
      value: false
    },
    // 返回按钮文字
    backText: {
      type: String,
      value: ''
    },
    // 右侧文字
    rightText: {
      type: String,
      value: ''
    },
    // 标题是否省略显示
    titleEllipsis: {
      type: Boolean,
      value: true
    },
    // 是否显示底部边框
    border: {
      type: Boolean,
      value: true
    },
    // 导航栏变体：default, dark, transparent
    variant: {
      type: String,
      value: 'default'
    },
    // 透明导航栏的文字颜色：light（白色）, dark（深色）
    textTheme: {
      type: String,
      value: 'dark'
    },
    // 自定义样式类
    customClass: {
      type: String,
      value: ''
    },
    // 自定义内联样式
    customStyle: {
      type: String,
      value: ''
    }
  },

  data: {
    statusBarHeight: 20 // 默认状态栏高度（px）
  },

  lifetimes: {
    attached() {
      // 获取系统状态栏高度
      const systemInfo = wx.getSystemInfoSync();
      const statusBarHeight = systemInfo.statusBarHeight || 20;
      
      // 根据 variant 和 textTheme 添加对应的类名
      const variantClass = this.data.variant !== 'default' ? `navbar-${this.data.variant}` : '';
      const textThemeClass = this.data.variant === 'transparent' ? `navbar-${this.data.textTheme}-text` : '';
      
      this.setData({
        statusBarHeight: statusBarHeight,
        customClass: `${this.data.customClass} ${variantClass} ${textThemeClass}`.trim()
      });
    }
  },

  methods: {
    /**
     * 左侧区域点击事件
     */
    onLeftTap() {
      if (this.data.showBack) {
        wx.navigateBack({
          delta: 1,
          fail: () => {
            // [CLEANED] console.log('无法返回上一页');
          }
        });
      }
      this.triggerEvent('lefttap', {}, {
        bubbles: false,
        composed: false
      });
    },

    /**
     * 标题区域点击事件
     */
    onTitleTap() {
      this.triggerEvent('titletap', {}, {
        bubbles: false,
        composed: false
      });
    },

    /**
     * 右侧区域点击事件
     */
    onRightTap() {
      this.triggerEvent('righttap', {}, {
        bubbles: false,
        composed: false
      });
    }
  }
});
