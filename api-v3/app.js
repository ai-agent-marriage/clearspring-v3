/**
 * ClearSpring V3 API - 生产环境
 * 
 * 功能：
 * - Health Check 端点
 * - 版本信息
 * - API 路由占位符
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const VERSION = '3.0.0';
const ENV = process.env.NODE_ENV || 'production';

const server = http.createServer((req, res) => {
  // CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  // 处理 OPTIONS 预检请求
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  
  // Health Check
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      service: 'clearspring-v3-api',
      version: VERSION,
      environment: ENV,
      timestamp: new Date().toISOString()
    }));
    return;
  }
  
  // API 版本信息
  if (req.url === '/api/version') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      version: VERSION,
      build: process.env.GITHUB_SHA || 'local',
      deployed: new Date().toISOString()
    }));
    return;
  }
  
  // API 根路径
  if (req.url === '/' || req.url === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      service: 'ClearSpring V3 API',
      version: VERSION,
      status: 'running',
      endpoints: {
        health: '/health',
        version: '/api/version',
        documentation: '/api/docs'
      }
    }));
    return;
  }
  
  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    message: `Endpoint ${req.url} not found`,
    version: VERSION
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 ClearSpring V3 API running on port ${PORT}`);
  console.log(`📊 Environment: ${ENV}`);
  console.log(`🏷️  Version: ${VERSION}`);
  console.log(`💚 Health: http://localhost:${PORT}/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('👋 SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
    process.exit(0);
  });
});
