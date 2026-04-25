/**
 * 清如 ClearSpring - 虚拟列表组件
 * 
 * 性能优化：只渲染可见区域的列表项，大幅减少 DOM 节点数量
 * 适用于长列表场景（订单列表、消息列表、志愿者列表等）
 * 
 * @version 1.0.0
 * @date 2026-04-15
 */

Component({
  properties: {
    // 列表数据
    list: {
      type: Array,
      value: [],
      observer: '_onListChange'
    },
    // 每个项目的高度（px）
    itemHeight: {
      type: Number,
      value: 100
    },
    // 缓冲区大小（上下各渲染多少屏）
    bufferSize: {
      type: Number,
      value: 1
    },
    // 是否启用虚拟列表（列表长度超过此值时启用）
    threshold: {
      type: Number,
      value: 50
    },
    // 容器高度（px）
    containerHeight: {
      type: Number,
      value: 600
    }
  },

  data: {
    // 可见区域的项目
    visibleItems: [],
    // 总高度
    totalHeight: 0,
    // 偏移量
    offsetTop: 0,
    // 是否启用虚拟列表
    enableVirtual: false,
    // 滚动条位置
    scrollTop: 0
  },

  lifetimes: {
    attached() {
      this._init();
    }
  },

  methods: {
    /**
     * 初始化
     */
    _init() {
      this._updateList();
    },

    /**
     * 列表数据变化监听
     */
    _onListChange(newList) {
      this._updateList();
    },

    /**
     * 更新列表
     */
    _updateList() {
      const { list, itemHeight, threshold, containerHeight } = this.data;
      const totalCount = list.length;
      
      // 判断是否启用虚拟列表
      const enableVirtual = totalCount > threshold;
      
      this.setData({
        enableVirtual: enableVirtual,
        totalHeight: totalCount * itemHeight
      });

      if (enableVirtual) {
        this._calculateVisibleItems(0);
      } else {
        // 不启用虚拟列表，直接渲染全部
        this.setData({
          visibleItems: list,
          offsetTop: 0
        });
      }
    },

    /**
     * 计算可见区域的项目
     * @param {number} scrollTop - 滚动条位置
     */
    _calculateVisibleItems(scrollTop) {
      const { list, itemHeight, bufferSize, containerHeight } = this.data;
      const totalCount = list.length;
      
      if (totalCount === 0) {
        this.setData({ visibleItems: [], offsetTop: 0 });
        return;
      }

      // 计算可见区域的索引范围
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize * Math.ceil(containerHeight / itemHeight));
      const visibleCount = Math.ceil(containerHeight / itemHeight) + 2 * bufferSize * Math.ceil(containerHeight / itemHeight);
      const endIndex = Math.min(totalCount, startIndex + visibleCount);

      // 提取可见区域的数据
      const visibleItems = list.slice(startIndex, endIndex).map((item, index) => ({
        ...item,
        _virtualIndex: startIndex + index
      }));

      // 计算偏移量
      const offsetTop = startIndex * itemHeight;

      this.setData({
        visibleItems,
        offsetTop,
        scrollTop
      });
    },

    /**
     * 滚动事件处理
     */
    _onScroll(e) {
      if (!this.data.enableVirtual) {
        return;
      }

      const scrollTop = e.detail.scrollTop;
      
      // 节流：每 100ms 更新一次
      if (this._scrollTimer) {
        clearTimeout(this._scrollTimer);
      }

      this._scrollTimer = setTimeout(() => {
        this._calculateVisibleItems(scrollTop);
      }, 50);
    },

    /**
     * 滚动到指定位置
     * @param {number} index - 项目索引
     */
    scrollToIndex(index) {
      const { itemHeight } = this.data;
      const scrollTop = index * itemHeight;
      
      this.setData({ scrollTop });
      this._calculateVisibleItems(scrollTop);
    },

    /**
     * 滚动到顶部
     */
    scrollToTop() {
      this.scrollToIndex(0);
    },

    /**
     * 滚动到底部
     */
    scrollToBottom() {
      const { list } = this.data;
      this.scrollToIndex(list.length - 1);
    },

    /**
     * 项目点击事件
     */
    _onItemTap(e) {
      const { index } = e.currentTarget.dataset;
      const item = this.data.visibleItems[index];
      
      this.triggerEvent('itemtap', {
        item: item,
        index: item._virtualIndex
      });
    }
  }
});
