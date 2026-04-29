/**
 * 按钮组件逻辑 - Stitch V3.0 规范
 * 支持多种类型、尺寸、状态
 */

Component({
  properties: {
    // 按钮文字
    text: {
      type: String,
      value: '按钮'
    },
    // 按钮类型：primary, success, warning, danger, default, ghost, text
    type: {
      type: String,
      value: 'primary'
    },
    // 按钮尺寸：small, medium, large
    size: {
      type: String,
      value: 'medium'
    },
    // 按钮形状：default, round, square
    shape: {
      type: String,
      value: 'default'
    },
    // 按钮图标（支持 emoji 或 Unicode）
    icon: {
      type: String,
      value: ''
    },
    // 禁用状态
    disabled: {
      type: Boolean,
      value: false
    },
    // 加载状态
    loading: {
      type: Boolean,
      value: false
    },
    // 块级按钮（占满宽度）
    block: {
      type: Boolean,
      value: false
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
    },
    // 是否启用插槽
    slot: {
      type: Boolean,
      value: false
    }
  },

  data: {
    shapeClass: ''
  },

  lifetimes: {
    attached() {
      // 根据 shape 添加对应的类名
      const shapeClass = this.data.shape !== 'default' ? `btn-${this.data.shape}` : '';
      const blockClass = this.data.block ? 'btn-block' : '';
      this.setData({
        shapeClass: `${shapeClass} ${blockClass}`.trim(),
        customClass: `${this.data.customClass} ${blockClass}`.trim()
      });
    }
  },

  methods: {
    /**
     * 按钮点击事件处理
     * @param {Object} e - 事件对象
     */
    onTap(e) {
      // 禁用或加载状态下不触发
      if (this.data.disabled || this.data.loading) {
        return;
      }
      
      this.triggerEvent('tap', {
        originalEvent: e
      }, {
        bubbles: false,
        composed: false
      });
    }
  }
});
