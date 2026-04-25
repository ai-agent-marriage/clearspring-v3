/**
 * 清如 ClearSpring - 图片懒加载占位图组件
 * 
 * 功能：
 * - 图片加载前显示占位图
 * - 图片加载失败显示错误图
 * - 支持渐变加载效果
 * 
 * @version 1.0.0
 * @date 2026-04-15
 */

Component({
  properties: {
    // 图片 URL
    src: {
      type: String,
      value: '',
      observer: '_onSrcChange'
    },
    // 图片模式
    mode: {
      type: String,
      value: 'aspectFill'
    },
    // 自定义类名
    className: {
      type: String,
      value: ''
    },
    // 占位图类型（avatar, image, default）
    placeholderType: {
      type: String,
      value: 'default'
    },
    // 是否显示加载动画
    showAnimation: {
      type: Boolean,
      value: true
    },
    // 圆角
    borderRadius: {
      type: String,
      value: '8px'
    }
  },

  data: {
    // 加载状态
    isLoading: true,
    // 加载失败
    hasError: false,
    // 图片已加载
    loaded: false
  },

  methods: {
    /**
     * src 变化时重置状态
     */
    _onSrcChange(newSrc) {
      if (newSrc !== this.data.src) {
        this.setData({
          isLoading: true,
          hasError: false,
          loaded: false
        });
      }
    },

    /**
     * 图片加载成功
     */
    onLoad(e) {
      // [CLEANED] console.log('[LazyImage] 加载成功:', this.data.src);
      this.setData({
        isLoading: false,
        loaded: true
      });
      
      this.triggerEvent('load', {
        detail: e.detail
      });
    },

    /**
     * 图片加载失败
     */
    onError(e) {
      console.warn('[LazyImage] 加载失败:', this.data.src);
      this.setData({
        isLoading: false,
        hasError: true
      });
      
      this.triggerEvent('error', {
        detail: e.detail
      });
    },

    /**
     * 点击图片
     */
    onTap(e) {
      this.triggerEvent('tap', {
        src: this.data.src
      });
    },

    /**
     * 获取占位图类名
     */
    _getPlaceholderClass() {
      const type = this.data.placeholderType;
      return `placeholder-${type}`;
    }
  }
});
