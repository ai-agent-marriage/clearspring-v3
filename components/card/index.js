/**
 * 卡片组件逻辑 - Stitch V3.0 规范
 * 支持自定义标题、内容、底部区域
 */

Component({
  options: {
    multipleSlots: true // 启用多插槽支持
  },
  
  properties: {
    // 卡片标题
    title: {
      type: String,
      value: ''
    },
    // 卡片副标题
    subtitle: {
      type: String,
      value: ''
    },
    // 是否显示头部插槽
    headerSlot: {
      type: Boolean,
      value: false
    },
    // 是否显示底部插槽
    footerSlot: {
      type: Boolean,
      value: false
    },
    // 额外内容区域
    extra: {
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
    // 卡片变体：default, borderless, shadow-lg, compact
    variant: {
      type: String,
      value: 'default'
    }
  },

  data: {
    // 内部状态
  },

  lifetimes: {
    attached() {
      // 根据 variant 添加对应的类名
      const variantClass = this.data.variant !== 'default' ? `card-${this.data.variant}` : '';
      this.setData({
        customClass: `${this.data.customClass} ${variantClass}`.trim()
      });
    }
  },

  methods: {
    /**
     * 卡片点击事件
     */
    onTap() {
      this.triggerEvent('tap', {}, {
        bubbles: false,
        composed: false
      });
    }
  }
});
