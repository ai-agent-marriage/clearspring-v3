/**
 * ClearSpring V3 API - 生产环境（完整版）
 * 包含：认证、控制台、订单、执行者、资质审核等接口
 */

const http = require('http');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const VERSION = '3.0.0';

const users = new Map([
  ['admin', { id: '1', username: 'admin', nickname: '超级管理员', role: 'super_admin', permissions: ['*'], passwordHash: crypto.pbkdf2Sync('admin123', 'salt', 1000, 64, 'sha512').toString('hex') }],
  ['operator', { id: '2', username: 'operator', nickname: '运营管理员', role: 'operator', permissions: ['order:read', 'order:write'], passwordHash: crypto.pbkdf2Sync('operator123', 'salt', 1000, 64, 'sha512').toString('hex') }]
]);

const tokens = new Map();

// 模拟业务数据
const mockData = {
  dashboard: { totalOrders: 156, totalExecutors: 25, totalRevenue: 78500, pendingAppeals: 3 },
  orders: [
    { id: '1', orderNo: 'ORD20260413001', requesterName: '张三', executorName: '李四', status: 'pending', amount: 500, createTime: '2026-04-13 10:00:00' },
    { id: '2', orderNo: 'ORD20260413002', requesterName: '王五', executorName: '赵六', status: 'completed', amount: 800, createTime: '2026-04-13 11:00:00' }
  ],
  executors: [
    { id: '1', name: '李四', phone: '138****1234', status: 'active', level: 'gold', orderCount: 156, completionRate: 98.5 },
    { id: '2', name: '赵六', phone: '139****5678', status: 'active', level: 'silver', orderCount: 89, completionRate: 95.2 }
  ],
  qualifications: [
    { id: '1', executorName: '李四', type: '身份证', status: 'pending', submitTime: '2026-04-13 09:00:00', remark: '' },
    { id: '2', executorName: '赵六', type: '健康证', status: 'approved', submitTime: '2026-04-12 15:00:00', remark: '审核通过' }
  ]
};

function generateToken(userId) { const token = crypto.randomBytes(32).toString('hex'); tokens.set(token, { userId, expiresAt: Date.now() + 604800000 }); return token; }
function verifyToken(token) { const tokenData = tokens.get(token); if (!tokenData || tokenData.expiresAt < Date.now()) { if (tokenData) tokens.delete(token); return null; } return users.get(tokenData.userId); }
function parseJsonBody(req) { return new Promise((resolve, reject) => { let body = ''; req.on('data', chunk => body += chunk); req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch (e) { reject(new Error('Invalid JSON')); } }); req.on('error', reject); }); }
function sendJson(res, statusCode, data) { res.writeHead(statusCode, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(data)); }
function sendError(res, statusCode, message) { sendJson(res, statusCode, { code: statusCode, message: message || 'Request failed', timestamp: new Date().toISOString() }); }
function parseQuery(url) { const query = {}; const qIndex = url.indexOf('?'); if (qIndex === -1) return query; const queryString = url.substring(qIndex + 1); queryString.split('&').forEach(pair => { const [key, value] = pair.split('='); query[decodeURIComponent(key)] = decodeURIComponent(value || ''); }); return query; }

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  
  const query = parseQuery(req.url);
  const urlPath = req.url.split('?')[0];
  
  try {
    // ===== 认证接口 =====
    if (req.url === '/health' && req.method === 'GET') { sendJson(res, 200, { status: 'ok', service: 'clearspring-v3-api', version: VERSION, timestamp: new Date().toISOString() }); return; }
    if (req.url === '/api/auth/login' && req.method === 'POST') {
      const body = await parseJsonBody(req);
      const { username, password } = body;
      if (!username || !password) { sendError(res, 400, '用户名和密码不能为空'); return; }
      const user = users.get(username);
      if (!user) { sendError(res, 401, '用户名或密码错误'); return; }
      const passwordHash = crypto.pbkdf2Sync(password, 'salt', 1000, 64, 'sha512').toString('hex');
      if (passwordHash !== user.passwordHash) { sendError(res, 401, '用户名或密码错误'); return; }
      const token = generateToken(user.id);
      sendJson(res, 200, { code: 200, message: '登录成功', data: { token, expiresIn: 7200, user: { id: user.id, username: user.username, nickname: user.nickname, role: user.role, permissions: user.permissions } } }); return;
    }
    if (urlPath === '/api/auth/me' && req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) { sendError(res, 401, '未授权'); return; }
      const token = authHeader.substring(7);
      const user = verifyToken(token);
      if (!user) { sendError(res, 401, 'Token 无效或已过期'); return; }
      sendJson(res, 200, { code: 200, data: { id: user.id, username: user.username, nickname: user.nickname, role: user.role, permissions: user.permissions } }); return;
    }
    if (urlPath === '/api/auth/logout' && req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) { const token = authHeader.substring(7); tokens.delete(token); }
      sendJson(res, 200, { code: 200, message: '登出成功' }); return;
    }
    
    // ===== 控制台接口 =====
    if (urlPath === '/api/dashboard/stats' && req.method === 'GET') {
      sendJson(res, 200, { code: 200, message: 'success', data: mockData.dashboard }); return;
    }
    if (urlPath.startsWith('/api/dashboard/order-trend') && req.method === 'GET') {
      sendJson(res, 200, { code: 200, message: 'success', data: { dates: ['2026-04-07', '2026-04-08', '2026-04-09', '2026-04-10', '2026-04-11', '2026-04-12', '2026-04-13'], orderCount: [12, 19, 15, 22, 18, 25, 20], completedCount: [10, 17, 14, 20, 16, 23, 18] } }); return;
    }
    if (urlPath.startsWith('/api/dashboard/executor-ranking') && req.method === 'GET') {
      sendJson(res, 200, { code: 200, message: 'success', data: [ { id: '1', name: '李四', orderCount: 156, completionRate: 98.5 }, { id: '2', name: '赵六', orderCount: 89, completionRate: 95.2 }, { id: '3', name: '钱七', orderCount: 67, completionRate: 94.1 } ] }); return;
    }
    
    // ===== 订单管理接口 =====
    if (urlPath === '/api/orders' && req.method === 'GET') {
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      sendJson(res, 200, { code: 200, message: 'success', data: { list: mockData.orders.slice(start, end), total: mockData.orders.length, page, pageSize } }); return;
    }
    if (urlPath === '/api/orders/stats' && req.method === 'GET') {
      sendJson(res, 200, { code: 200, message: 'success', data: { total: mockData.orders.length, pending: 1, completed: 1, cancelled: 0 } }); return;
    }
    
    // ===== 执行者管理接口 =====
    if (urlPath === '/api/executors' && req.method === 'GET') {
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      sendJson(res, 200, { code: 200, message: 'success', data: { list: mockData.executors.slice(start, end), total: mockData.executors.length, page, pageSize } }); return;
    }
    if (urlPath === '/api/executors/stats' && req.method === 'GET') {
      sendJson(res, 200, { code: 200, message: 'success', data: { total: mockData.executors.length, active: 2, inactive: 0, pending: 0 } }); return;
    }
    
    // ===== 资质审核接口 =====
    if (urlPath === '/api/qualifications' && req.method === 'GET') {
      const page = parseInt(query.page) || 1;
      const pageSize = parseInt(query.pageSize) || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      sendJson(res, 200, { code: 200, message: 'success', data: { list: mockData.qualifications.slice(start, end), total: mockData.qualifications.length, page, pageSize } }); return;
    }
    if (urlPath === '/api/qualifications/stats' && req.method === 'GET') {
      sendJson(res, 200, { code: 200, message: 'success', data: { total: mockData.qualifications.length, pending: 1, approved: 1, rejected: 0 } }); return;
    }
    
    // ===== 默认接口 =====
    if (req.url === '/' || req.url === '/api') { sendJson(res, 200, { service: 'ClearSpring V3 API', version: VERSION, status: 'running', endpoints: { health: '/health', login: '/api/auth/login', dashboard: '/api/dashboard/stats' } }); return; }
    
    sendError(res, 404, '接口不存在：' + req.url);
  } catch (error) {
    console.error('API Error:', error);
    sendError(res, 500, '服务器内部错误');
  }
});

server.listen(PORT, () => { // [CLEANED] console.log('🚀 ClearSpring V3 API running on port ' + PORT); // [CLEANED] console.log('📊 Dashboard: GET /api/dashboard/stats'); // [CLEANED] console.log('📦 Orders: GET /api/orders'); // [CLEANED] console.log('👥 Executors: GET /api/executors'); // [CLEANED] console.log('✅ Qualifications: GET /api/qualifications'); });
process.on('SIGTERM', () => { server.close(() => process.exit(0)); });
process.on('SIGINT', () => { server.close(() => process.exit(0)); });
