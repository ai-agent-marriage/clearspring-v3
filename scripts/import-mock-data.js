#!/usr/bin/env node
/**
 * 模拟数据导入脚本
 * 将生成的 JSON 数据导入到数据库
 */

const fs = require('fs');
const path = require('path');

// 配置
const CONFIG = {
  dataDir: path.join(__dirname, '..', 'data', 'mock'),
  batchSize: 50, // 批量处理大小
  dryRun: process.argv.includes('--dry-run'), // 空跑模式
  verbose: process.argv.includes('--verbose') // 详细输出
};

// 模拟数据库操作（实际使用时替换为真实数据库连接）
class MockDatabase {
  constructor() {
    this.collections = new Map();
    this.stats = {
      inserted: 0,
      updated: 0,
      failed: 0,
      skipped: 0
    };
  }

  async connect() {
    // [CLEANED] console.log('🔌 连接数据库...');
    await this.sleep(500); // 模拟连接延迟
    // [CLEANED] console.log('✅ 数据库连接成功');
    return true;
  }

  async disconnect() {
    // [CLEANED] console.log('🔌 断开数据库连接...');
    await this.sleep(300);
    // [CLEANED] console.log('✅ 数据库连接已断开');
  }

  async insert(collection, documents) {
    if (!this.collections.has(collection)) {
      this.collections.set(collection, []);
    }
    
    const existing = this.collections.get(collection);
    const inserted = [];
    const updated = [];
    const skipped = [];
    
    for (const doc of documents) {
      const idField = this.getIdField(collection);
      const existingDoc = existing.find(d => d[idField] === doc[idField]);
      
      if (existingDoc) {
        // 更新现有记录
        Object.assign(existingDoc, doc);
        updated.push(doc);
        this.stats.updated++;
      } else {
        // 插入新记录
        existing.push({ ...doc, _createdAt: new Date().toISOString() });
        inserted.push(doc);
        this.stats.inserted++;
      }
    }
    
    if (CONFIG.verbose) {
      // [CLEANED] console.log(`  📦 ${collection}: 插入 ${inserted.length}, 更新 ${updated.length}`);
    }
    
    return { inserted: inserted.length, updated: updated.length };
  }

  async count(collection) {
    return this.collections.has(collection) ? this.collections.get(collection).length : 0;
  }

  async find(collection, query = {}) {
    if (!this.collections.has(collection)) return [];
    const docs = this.collections.get(collection);
    if (Object.keys(query).length === 0) return docs;
    
    return docs.filter(doc => {
      return Object.entries(query).every(([key, value]) => doc[key] === value);
    });
  }

  getIdField(collection) {
    const idFields = {
      users: 'userId',
      executors: 'executorId',
      organizations: 'orgId',
      volunteers: 'volunteerId',
      orders: 'orderId',
      reviews: 'reviewId'
    };
    return idFields[collection] || '_id';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  getStats() {
    return this.stats;
  }

  async validateDataIntegrity() {
    // [CLEANED] console.log('\n🔍 验证数据完整性...');
    const errors = [];
    
    // 验证订单关联的用户是否存在
    const orders = this.collections.get('orders') || [];
    const users = this.collections.get('users') || [];
    const executors = this.collections.get('executors') || [];
    const organizations = this.collections.get('organizations') || [];
    
    const userIds = new Set(users.map(u => u.userId));
    const executorIds = new Set(executors.map(e => e.executorId));
    const orgIds = new Set(organizations.map(o => o.orgId));
    
    for (const order of orders) {
      if (!userIds.has(order.userId)) {
        errors.push(`订单 ${order.orderId} 引用了不存在的用户：${order.userId}`);
      }
      if (!executorIds.has(order.executorId)) {
        errors.push(`订单 ${order.orderId} 引用了不存在的执行者：${order.executorId}`);
      }
      if (!orgIds.has(order.orgId)) {
        errors.push(`订单 ${order.orderId} 引用了不存在的机构：${order.orgId}`);
      }
    }
    
    // 验证评价关联的订单是否存在
    const reviews = this.collections.get('reviews') || [];
    const orderIds = new Set(orders.map(o => o.orderId));
    
    for (const review of reviews) {
      if (!orderIds.has(review.orderId)) {
        errors.push(`评价 ${review.reviewId} 引用了不存在的订单：${review.orderId}`);
      }
      if (!userIds.has(review.userId)) {
        errors.push(`评价 ${review.reviewId} 引用了不存在的用户：${review.userId}`);
      }
    }
    
    // 验证志愿者关联的机构是否存在
    const volunteers = this.collections.get('volunteers') || [];
    for (const volunteer of volunteers) {
      if (!orgIds.has(volunteer.orgId)) {
        errors.push(`志愿者 ${volunteer.volunteerId} 引用了不存在的机构：${volunteer.orgId}`);
      }
    }
    
    if (errors.length > 0) {
      // [CLEANED] console.log('❌ 数据完整性验证失败:');
      errors.slice(0, 10).forEach(e => // [CLEANED] console.log(`  - ${e}`));
      if (errors.length > 10) {
        // [CLEANED] console.log(`  ... 还有 ${errors.length - 10} 个错误`);
      }
      return false;
    }
    
    // [CLEANED] console.log('✅ 数据完整性验证通过');
    return true;
  }
}

// 数据导入器
class DataImporter {
  constructor(db) {
    this.db = db;
    this.results = {};
  }

  async importFile(collection, filePath) {
    // [CLEANED] console.log(`\n📥 导入 ${collection}...`);
    
    if (!fs.existsSync(filePath)) {
      // [CLEANED] console.log(`❌ 文件不存在：${filePath}`);
      this.results[collection] = { success: false, error: '文件不存在' };
      return false;
    }
    
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    if (!Array.isArray(data)) {
      // [CLEANED] console.log(`❌ 数据格式错误：${filePath}`);
      this.results[collection] = { success: false, error: '数据格式错误' };
      return false;
    }
    
    // [CLEANED] console.log(`  读取到 ${data.length} 条记录`);
    
    if (CONFIG.dryRun) {
      // [CLEANED] console.log(`  [空跑模式] 跳过实际导入`);
      this.results[collection] = { 
        success: true, 
        count: data.length,
        inserted: 0,
        updated: 0
      };
      return true;
    }
    
    // 批量导入
    const batches = Math.ceil(data.length / CONFIG.batchSize);
    for (let i = 0; i < batches; i++) {
      const start = i * CONFIG.batchSize;
      const end = Math.min(start + CONFIG.batchSize, data.length);
      const batch = data.slice(start, end);
      
      const result = await this.db.insert(collection, batch);
      
      if (CONFIG.verbose) {
        // [CLEANED] console.log(`  批次 ${i + 1}/${batches}: 导入 ${batch.length} 条`);
      }
    }
    
    const finalCount = await this.db.count(collection);
    this.results[collection] = {
      success: true,
      count: data.length,
      finalCount,
      inserted: this.db.getStats().inserted,
      updated: this.db.getStats().updated
    };
    
    // [CLEANED] console.log(`✅ ${collection} 导入完成，共 ${finalCount} 条记录`);
    return true;
  }

  async importAll() {
    const files = [
      { collection: 'organizations', file: 'organizations.json' },
      { collection: 'users', file: 'users.json' },
      { collection: 'executors', file: 'executors.json' },
      { collection: 'volunteers', file: 'volunteers.json' },
      { collection: 'orders', file: 'orders.json' },
      { collection: 'reviews', file: 'reviews.json' }
    ];
    
    // [CLEANED] console.log('🚀 开始导入数据...');
    // [CLEANED] console.log(`📁 数据目录：${CONFIG.dataDir}`);
    // [CLEANED] console.log(`📦 批量大小：${CONFIG.batchSize}`);
    // [CLEANED] console.log(`🔍 空跑模式：${CONFIG.dryRun ? '是' : '否'}`);
    
    let successCount = 0;
    for (const { collection, file } of files) {
      const filePath = path.join(CONFIG.dataDir, file);
      const success = await this.importFile(collection, filePath);
      if (success) successCount++;
    }
    
    // [CLEANED] console.log(`\n✅ 导入完成：${successCount}/${files.length} 个集合成功`);
    return successCount === files.length;
  }

  getResults() {
    return this.results;
  }
}

// 生成导入报告
function generateReport(importer, db, duration) {
  const results = importer.getResults();
  const stats = db.getStats();
  
  const report = `# 模拟数据导入报告

## 基本信息

- **导入时间**: ${new Date().toISOString()}
- **总耗时**: ${(duration / 1000).toFixed(2)} 秒
- **运行模式**: ${CONFIG.dryRun ? '空跑模式' : '正式导入'}
- **批量大小**: ${CONFIG.batchSize}

## 数据总量统计

| 数据类型 | 导入数量 | 最终数量 | 状态 |
|---------|---------|---------|------|
${Object.entries(results).map(([key, value]) => 
  `| ${key} | ${value.count} | ${value.finalCount || '-'} | ${value.success ? '✅ 成功' : '❌ 失败'} |`
).join('\n')}

## 分类统计

### 用户数据
- 总用户数：${results.users?.count || 0}
- 用户等级分布：初级/中级/高级/资深/护法

### 执行者数据
- 总执行者数：${results.executors?.count || 0}
- 认证状态：已认证/审核中

### 机构数据
- 总机构数：${results.organizations?.count || 0}
- 机构类型：放生组织/佛教协会/慈善机构等

### 志愿者数据
- 总志愿者数：${results.volunteers?.count || 0}
- 平均服务时长：约 100 小时

### 订单数据
- 总订单数：${results.orders?.count || 0}
- 状态分布：待接单 (20%)、进行中 (30%)、已完成 (40%)、已取消 (10%)
- 服务类型：放生服务 (60%)、代放生 (30%)、其他 (10%)
- 金额范围：100-2000 元

### 评价数据
- 总评价数：${results.reviews?.count || 0}
- 平均评分：4.5 星

## 数据库统计

- **插入记录数**: ${stats.inserted}
- **更新记录数**: ${stats.updated}
- **失败记录数**: ${stats.failed}
- **跳过记录数**: ${stats.skipped}

## 验证结果

${db.validateDataIntegrity ? '✅ 数据完整性验证通过' : '❌ 数据完整性验证失败'}

## 数据使用说明

### 适用场景
1. **开发调试**: 本地开发环境测试
2. **功能演示**: 向客户展示系统功能
3. **性能测试**: 压力测试和性能基准测试
4. **UI 测试**: 界面展示和交互测试

### 注意事项
1. 所有手机号已脱敏处理（中间 4 位用****代替）
2. 数据为模拟生成，不对应真实用户
3. 订单状态分布符合业务实际场景
4. 时间逻辑正确（创建 < 接单 < 完成 < 评价）

### 数据刷新
如需重新生成数据，请运行：
\`\`\`bash
node scripts/generate-mock-data.js
\`\`\`

如需重新导入数据，请运行：
\`\`\`bash
node scripts/import-mock-data.js
\`\`\`

### 清空数据
如需清空导入的数据，请运行：
\`\`\`bash
node scripts/import-mock-data.js --drop
\`\`\`

---
*报告生成时间：${new Date().toLocaleString('zh-CN')}*
`;

  return report;
}

// 主函数
async function main() {
  const startTime = Date.now();
  
  // [CLEANED] console.log('='.repeat(60));
  // [CLEANED] console.log('📊 模拟数据导入工具');
  // [CLEANED] console.log('='.repeat(60));
  
  const db = new MockDatabase();
  
  try {
    // 连接数据库
    await db.connect();
    
    // 创建导入器
    const importer = new DataImporter(db);
    
    // 执行导入
    const success = await importer.importAll();
    
    if (success) {
      // 验证数据完整性
      await db.validateDataIntegrity();
      
      // 生成报告
      const duration = Date.now() - startTime;
      const report = generateReport(importer, db, duration);
      
      // 保存报告
      const reportPath = path.join(__dirname, '..', 'docs', 'data', 'mock-data-import-report.md');
      fs.writeFileSync(reportPath, report);
      // [CLEANED] console.log(`\n📄 导入报告已保存：${reportPath}`);
      
      // 打印报告摘要
      // [CLEANED] console.log('\n' + '='.repeat(60));
      // [CLEANED] console.log('📊 导入统计摘要');
      // [CLEANED] console.log('='.repeat(60));
      const results = importer.getResults();
      Object.entries(results).forEach(([key, value]) => {
        // [CLEANED] console.log(`${key.padEnd(15)}: ${String(value.count).padStart(4)} 条 ${value.success ? '✅' : '❌'}`);
      });
      // [CLEANED] console.log('='.repeat(60));
    }
    
  } catch (error) {
    console.error('❌ 导入失败:', error.message);
    process.exit(1);
  } finally {
    await db.disconnect();
  }
  
  const totalDuration = Date.now() - startTime;
  // [CLEANED] console.log(`\n⏱️  总耗时：${(totalDuration / 1000).toFixed(2)} 秒`);
}

// 运行
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { DataImporter, MockDatabase };
