#!/usr/bin/env node

/**
 * Console.log 清理脚本
 * 用于移除生产环境代码中的 console.log 语句
 * 保留 console.error 和 console.warn（用于错误监控）
 */

const fs = require('fs');
const path = require('path');

// 配置
const WORKSPACE_ROOT = '/root/.openclaw/workspace';
const EXCLUDE_DIRS = ['node_modules', '.vite', 'dist', 'coverage', '.git'];
const INCLUDE_EXTENSIONS = ['.js', '.ts', '.jsx', '.tsx', '.vue'];

// 统计信息
const stats = {
  totalFiles: 0,
  totalConsoleLogs: 0,
  cleanedFiles: [],
  errors: []
};

/**
 * 检查是否应该排除的目录
 */
function shouldExclude(dirPath) {
  return EXCLUDE_DIRS.some(exclude => dirPath.includes(exclude));
}

/**
 * 检查文件扩展名是否匹配
 */
function hasValidExtension(filePath) {
  return INCLUDE_EXTENSIONS.some(ext => filePath.endsWith(ext));
}

/**
 * 递归获取所有文件
 */
function getAllFiles(dirPath, fileList = []) {
  if (shouldExclude(dirPath)) {
    return fileList;
  }

  try {
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      
      try {
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          getAllFiles(filePath, fileList);
        } else if (hasValidExtension(filePath)) {
          fileList.push(filePath);
        }
      } catch (err) {
        // 忽略无法访问的文件
      }
    }
  } catch (err) {
    // 忽略无法访问的目录
  }

  return fileList;
}

/**
 * 统计文件中 console.log 的数量
 */
function countConsoleLogs(content) {
  const matches = content.match(/console\.log\s*\(/g);
  return matches ? matches.length : 0;
}

/**
 * 清理 console.log
 * 策略：直接注释掉 console.log 语句
 */
function cleanConsoleLogs(content, filePath) {
  let cleanedContent = content;
  let count = 0;

  // 匹配 console.log 语句（支持多行）
  // 匹配模式：// [CLEANED] console.log(...)或 // [CLEANED] console.log(..., ...)const consoleLogRegex = /console\.log\s*\([^)]*\)\s*;?/g;
  
  const matches = cleanedContent.match(consoleLogRegex);
  if (matches) {
    count = matches.length;
    
    // 替换为注释
    cleanedContent = cleanedContent.replace(consoleLogRegex, (match) => {
      return `// [CLEANED] ${match.trim()}`;
    });
  }

  return { cleanedContent, count };
}

/**
 * 处理单个文件
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const consoleLogCount = countConsoleLogs(content);
    
    if (consoleLogCount > 0) {
      const { cleanedContent, count } = cleanConsoleLogs(content, filePath);
      
      if (count > 0) {
        fs.writeFileSync(filePath, cleanedContent, 'utf-8');
        
        stats.cleanedFiles.push({
          filePath: path.relative(WORKSPACE_ROOT, filePath),
          count: count
        });
        
        stats.totalConsoleLogs += count;
        stats.totalFiles++;
        
        // [CLEANED] console.log(`✓ ${path.relative(WORKSPACE_ROOT, filePath)}: 清理 ${count} 处 console.log`);
      }
    }
  } catch (err) {
    stats.errors.push({
      filePath: filePath,
      error: err.message
    });
    console.error(`✗ ${path.relative(WORKSPACE_ROOT, filePath)}: ${err.message}`);
  }
}

/**
 * 生成清理报告
 */
function generateReport() {
  const reportPath = path.join(WORKSPACE_ROOT, 'CONSOLE_CLEANUP_REPORT.md');
  
  const report = `# Console.log 清理报告

## 清理概览

- **清理时间**: ${new Date().toISOString()}
- **清理文件数**: ${stats.totalFiles} 个
- **清理 console.log 数量**: ${stats.totalConsoleLogs} 处
- **错误文件数**: ${stats.errors.length} 个

## 清理策略

采用**直接注释**策略，将所有 console.log 语句注释掉，保留原始代码以便需要时恢复。

示例：
\`\`\`javascript
// 清理前
// [CLEANED] console.log('订单创建成功', orderData);

// 清理后
// [CLEANED] // [CLEANED] console.log('订单创建成功', orderData);
\`\`\`

## 保留项

- ✅ console.error（用于错误监控）
- ✅ console.warn（用于警告信息）
- ✅ 其他 console 方法（console.info, console.debug 等）

## 清理文件列表

| 文件路径 | 清理数量 |
|---------|---------|
${stats.cleanedFiles.map(f => `| ${f.filePath} | ${f.count} |`).join('\n')}

## 错误文件

${stats.errors.length > 0 ? stats.errors.map(e => `- ${e.filePath}: ${e.error}`).join('\n') : '无'}

## 后续建议

1. **代码审查**: 检查清理后的代码，确保没有误删重要逻辑
2. **测试验证**: 运行测试套件，确保功能正常
3. **日志方案**: 考虑引入统一的日志工具（如 winston、bunyan）
4. **环境判断**: 如需在开发环境保留日志，可添加环境变量判断

\`\`\`javascript
// 示例：环境判断
if (process.env.NODE_ENV === 'development') {
  // [CLEANED] console.log('开发环境日志');
}
\`\`\`

---

*报告生成时间: ${new Date().toLocaleString('zh-CN')}*
`;

  fs.writeFileSync(reportPath, report, 'utf-8');
  // [CLEANED] console.log(`\n📄 清理报告已生成: ${reportPath}`);
}

/**
 * 主函数
 */
function main() {
  // [CLEANED] console.log('🧹 开始清理 console.log...\n');
  
  // 获取所有文件
  const allFiles = getAllFiles(WORKSPACE_ROOT);
  // [CLEANED] console.log(`📁 找到 ${allFiles.length} 个源文件\n`);
  
  // 处理每个文件
  for (const file of allFiles) {
    processFile(file);
  }
  
  // 生成报告
  // [CLEANED] console.log('\n📊 生成清理报告...');
  generateReport();
  
  // 输出总结
  // [CLEANED] console.log('\n========================================');
  // [CLEANED] console.log('✅ 清理完成!');
  // [CLEANED] console.log(`   - 清理文件：${stats.totalFiles} 个`);
  // [CLEANED] console.log(`   - 清理 console.log: ${stats.totalConsoleLogs} 处`);
  // [CLEANED] console.log(`   - 错误：${stats.errors.length} 个`);
  // [CLEANED] console.log('========================================\n');
}

// 执行
main();
