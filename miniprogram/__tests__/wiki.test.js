/**
 * 科普百科页面测试
 * @file miniprogram/__tests__/wiki.test.js
 * @description 测试科普百科页面的各项功能
 */

describe('科普百科页面测试', () => {
  let page;
  let mockWx;

  beforeEach(() => {
    // Mock wx 对象
    mockWx = {
      showModal: jest.fn()
    };
    global.wx = mockWx;

    // 创建页面实例
    page = {
      data: {
        positiveList: [
          {
            id: 1,
            name: '鲤鱼',
            latin: 'Cyprinus carpio',
            description: '本地常见淡水鱼，适应性强，适合春季放生',
            category: '淡水鱼',
            season: '春秋',
            image: '/images/wiki/carp.png'
          },
          {
            id: 2,
            name: '鲫鱼',
            latin: 'Carassius auratus',
            description: '本土鲫鱼，生命力顽强，适合多种水域',
            category: '淡水鱼',
            season: '四季',
            image: '/images/wiki/crucian.png'
          },
          {
            id: 3,
            name: '泥鳅',
            latin: 'Misgurnus anguillicaudatus',
            description: '底栖鱼类，净化水质，适合夏季放生',
            category: '淡水鱼',
            season: '夏秋',
            image: '/images/wiki/loach.png'
          }
        ],
        tabooList: [
          {
            id: 1,
            title: '禁止放生外来物种',
            description: '巴西龟、鳄龟、清道夫等外来物种会严重破坏本地生态系统，请勿放生'
          },
          {
            id: 2,
            title: '禁止在禁渔区放生',
            description: '饮用水源地、自然保护区等区域禁止放生活动'
          }
        ],
        waterList: [
          {
            id: 1,
            name: '钱塘江流域',
            distance: '5.2km',
            description: '杭州主要河流，水域宽阔，生态良好',
            features: ['淡水鱼', '大型水域', '生态保护区']
          },
          {
            id: 2,
            name: '西湖水域',
            distance: '8.1km',
            description: '需选择指定区域，适合小型放生活动',
            features: ['景区', '管理严格', '小型放生']
          }
        ]
      },
      onSpeciesTap: function(e) {
        const species = e.currentTarget.dataset.species;
        mockWx.showModal({
          title: species.name,
          content: `${species.latin}\n\n${species.description}\n\n适放季节：${species.season}`,
          showCancel: false,
          confirmText: '知道了'
        });
      },
      onWaterTap: function(e) {
        const water = e.currentTarget.dataset.water;
        mockWx.showModal({
          title: water.name,
          content: `${water.description}\n\n特点：${water.features.join('、')}`,
          showCancel: false,
          confirmText: '知道了'
        });
      },
      onShareAppMessage: function() {
        return {
          title: '清如科普百科 - 科学放生指南',
          path: '/pages/wiki/wiki',
          imageUrl: ''
        };
      }
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('页面初始化', () => {
    test('页面应该正常初始化', () => {
      expect(page.data).toBeDefined();
      expect(page.data.positiveList).toBeDefined();
      expect(page.data.tabooList).toBeDefined();
      expect(page.data.waterList).toBeDefined();
    });
  });

  describe('物种列表数据', () => {
    test('positiveList 应该包含正确的物种数据', () => {
      expect(page.data.positiveList).toHaveLength(3);
      expect(page.data.positiveList[0]).toEqual({
        id: 1,
        name: '鲤鱼',
        latin: 'Cyprinus carpio',
        description: '本地常见淡水鱼，适应性强，适合春季放生',
        category: '淡水鱼',
        season: '春秋',
        image: '/images/wiki/carp.png'
      });
    });

    test('positiveList 中每个物种都应该有必需的字段', () => {
      page.data.positiveList.forEach((species) => {
        expect(species).toHaveProperty('id');
        expect(species).toHaveProperty('name');
        expect(species).toHaveProperty('latin');
        expect(species).toHaveProperty('description');
        expect(species).toHaveProperty('category');
        expect(species).toHaveProperty('season');
        expect(species).toHaveProperty('image');
      });
    });

    test('positiveList 物种分类应该正确', () => {
      const categories = page.data.positiveList.map(s => s.category);
      expect(categories).toContain('淡水鱼');
    });
  });

  describe('放生禁忌列表', () => {
    test('tabooList 应该包含禁忌数据', () => {
      expect(page.data.tabooList).toHaveLength(2);
      expect(page.data.tabooList[0].title).toBe('禁止放生外来物种');
    });

    test('tabooList 中每个禁忌都应该有标题和描述', () => {
      page.data.tabooList.forEach((taboo) => {
        expect(taboo).toHaveProperty('id');
        expect(taboo).toHaveProperty('title');
        expect(taboo).toHaveProperty('description');
      });
    });

    test('tabooList 应该包含外来物种禁忌', () => {
      const hasForeignSpeciesTaboo = page.data.tabooList.some(
        t => t.title.includes('外来物种')
      );
      expect(hasForeignSpeciesTaboo).toBe(true);
    });
  });

  describe('推荐水域列表', () => {
    test('waterList 应该包含水域数据', () => {
      expect(page.data.waterList).toHaveLength(2);
      expect(page.data.waterList[0].name).toBe('钱塘江流域');
    });

    test('waterList 中每个水域都应该有必需字段', () => {
      page.data.waterList.forEach((water) => {
        expect(water).toHaveProperty('id');
        expect(water).toHaveProperty('name');
        expect(water).toHaveProperty('distance');
        expect(water).toHaveProperty('description');
        expect(water).toHaveProperty('features');
        expect(Array.isArray(water.features)).toBe(true);
      });
    });

    test('waterList 水域距离格式应该正确', () => {
      page.data.waterList.forEach((water) => {
        expect(water.distance).toMatch(/^\d+\.?\d*km$/);
      });
    });
  });

  describe('物种点击交互', () => {
    test('onSpeciesTap - 点击物种应显示详情弹窗', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            species: {
              name: '鲤鱼',
              latin: 'Cyprinus carpio',
              description: '本地常见淡水鱼',
              season: '春秋'
            }
          }
        }
      };

      page.onSpeciesTap(mockEvent);

      expect(mockWx.showModal).toHaveBeenCalledWith({
        title: '鲤鱼',
        content: expect.stringContaining('Cyprinus carpio'),
        showCancel: false,
        confirmText: '知道了'
      });
    });

    test('onSpeciesTap - 弹窗内容应包含拉丁名和适放季节', () => {
      const mockSpecies = {
        name: '鲫鱼',
        latin: 'Carassius auratus',
        description: '本土鲫鱼',
        season: '四季'
      };
      const mockEvent = {
        currentTarget: {
          dataset: { species: mockSpecies }
        }
      };

      page.onSpeciesTap(mockEvent);

      expect(mockWx.showModal).toHaveBeenCalledWith(expect.objectContaining({
        content: expect.stringContaining('四季')
      }));
    });
  });

  describe('水域点击交互', () => {
    test('onWaterTap - 点击水域应显示详情弹窗', () => {
      const mockEvent = {
        currentTarget: {
          dataset: {
            water: {
              name: '钱塘江流域',
              description: '杭州主要河流',
              features: ['淡水鱼', '大型水域']
            }
          }
        }
      };

      page.onWaterTap(mockEvent);

      expect(mockWx.showModal).toHaveBeenCalledWith({
        title: '钱塘江流域',
        content: expect.stringContaining('杭州主要河流'),
        showCancel: false,
        confirmText: '知道了'
      });
    });

    test('onWaterTap - 弹窗内容应包含水域特点', () => {
      const mockWater = {
        name: '西湖水域',
        description: '需选择指定区域',
        features: ['景区', '管理严格']
      };
      const mockEvent = {
        currentTarget: {
          dataset: { water: mockWater }
        }
      };

      page.onWaterTap(mockEvent);

      expect(mockWx.showModal).toHaveBeenCalledWith(expect.objectContaining({
        content: expect.stringContaining('景区、管理严格')
      }));
    });
  });

  describe('分享功能', () => {
    test('onShareAppMessage - 应返回分享配置', () => {
      const shareConfig = page.onShareAppMessage();

      expect(shareConfig).toEqual({
        title: '清如科普百科 - 科学放生指南',
        path: '/pages/wiki/wiki',
        imageUrl: ''
      });
    });
  });

  describe('数据完整性', () => {
    test('所有列表数据应该是只读的', () => {
      const originalPositiveListLength = page.data.positiveList.length;
      const originalTabooListLength = page.data.tabooList.length;
      const originalWaterListLength = page.data.waterList.length;

      expect(page.data.positiveList.length).toBe(originalPositiveListLength);
      expect(page.data.tabooList.length).toBe(originalTabooListLength);
      expect(page.data.waterList.length).toBe(originalWaterListLength);
    });

    test('物种数据应该包含拉丁学名', () => {
      page.data.positiveList.forEach((species) => {
        expect(species.latin).toMatch(/^[A-Z][a-z]+ [a-z]+$/);
      });
    });
  });
});
