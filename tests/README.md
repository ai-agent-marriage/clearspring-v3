# 清如 ClearSpring - 云函数单元测试

**测试框架**: test-runner  
**编写时间**: 2026-03-29 09:20  
**执行环境**: 微信云开发模拟环境

---

## 测试用例清单

### 1. login 云函数测试

```javascript
// test-login.js

describe('login 云函数', () => {
  
  test('新用户注册成功', async () => {
    const mockCode = 'mock_login_code_123';
    const mockUserInfo = {
      nickName: '测试用户',
      avatarUrl: 'https://example.com/avatar.png',
      gender: 1
    };
    
    const result = await cloud.callFunction({
      name: 'login',
      data: {
        code: mockCode,
        userInfo: mockUserInfo
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.isNewUser).toBe(true);
    expect(result.data.role).toBe('prayer');
    expect(result.data.userInfo.nickName).toBe('测试用户');
  });
  
  test('老用户登录成功', async () => {
    const mockCode = 'mock_login_code_456';
    
    const result = await cloud.callFunction({
      name: 'login',
      data: {
        code: mockCode
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.isNewUser).toBe(false);
    expect(result.data.userInfo).toBeDefined();
  });
  
  test('缺少 code 参数返回错误', async () => {
    const result = await cloud.callFunction({
      name: 'login',
      data: {}
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_CODE');
  });
  
  test('手机号脱敏存储', async () => {
    const mockPhone = '13812345678';
    
    const result = await cloud.callFunction({
      name: 'login',
      data: {
        code: 'mock_code',
        userInfo: { nickName: '测试' },
        phone: mockPhone
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.userInfo.phone).toBe('138****5678'); // 已脱敏
  });
});
```

---

### 2. createOrder 云函数测试

```javascript
// test-createOrder.js

describe('createOrder 云函数', () => {
  
  test('创建订单成功', async () => {
    const mockOrderData = {
      species: {
        id: 'species_001',
        name: '鲫鱼',
        category: '鱼类',
        ecologicalNote: '本地物种，适合淡水放生'
      },
      location: {
        province: '广东省',
        city: '广州市',
        district: '白云区',
        address: '白云山淡水湖',
        latitude: 23.1234,
        longitude: 113.2345
      },
      wish: '愿家人平安健康',
      quantity: 100,
      guidePrice: 299.00
    };
    
    const result = await cloud.callFunction({
      name: 'createOrder',
      data: mockOrderData
    });
    
    expect(result.success).toBe(true);
    expect(result.data.orderId).toMatch(/ORD\d{8}\d{4}/);
    expect(result.data.status).toBe('pending');
    expect(result.data.species.name).toBe('鲫鱼');
  });
  
  test('缺少物种信息返回错误', async () => {
    const result = await cloud.callFunction({
      name: 'createOrder',
      data: {
        location: { latitude: 23.1234, longitude: 113.2345, address: '测试地址' },
        quantity: 100,
        guidePrice: 299
      }
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('VALIDATION_ERROR');
  });
  
  test('数量无效返回错误', async () => {
    const result = await cloud.callFunction({
      name: 'createOrder',
      data: {
        species: { id: 's1', name: '鲫鱼' },
        location: { latitude: 23.1234, longitude: 113.2345, address: '测试' },
        quantity: 0,
        guidePrice: 299
      }
    });
    
    expect(result.success).toBe(false);
    expect(result.message).toContain('数量');
  });
  
  test('订单号格式正确', async () => {
    const result = await cloud.callFunction({
      name: 'createOrder',
      data: {
        species: { id: 's1', name: '鲫鱼' },
        location: { latitude: 23.1234, longitude: 113.2345, address: '测试' },
        quantity: 100,
        guidePrice: 299
      }
    });
    
    // 订单号格式：ORD + 日期 (8 位) + 序列号 (4 位)
    expect(result.data.orderId).toMatch(/^ORD\d{12}$/);
  });
});
```

---

### 3. grabOrder 云函数测试

```javascript
// test-grabOrder.js

describe('grabOrder 云函数', () => {
  
  test('抢单成功', async () => {
    const mockOrderId = 'ORD202603290001';
    
    const result = await cloud.callFunction({
      name: 'grabOrder',
      data: {
        orderId: mockOrderId
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.status).toBe('grabbed');
  });
  
  test('订单不存在返回错误', async () => {
    const result = await cloud.callFunction({
      name: 'grabOrder',
      data: {
        orderId: 'INVALID_ORDER_ID'
      }
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('ORDER_NOT_FOUND');
  });
  
  test('订单已被抢返回错误', async () => {
    // 先抢一次
    await cloud.callFunction({
      name: 'grabOrder',
      data: { orderId: 'ORD202603290002' }
    });
    
    // 再抢一次
    const result = await cloud.callFunction({
      name: 'grabOrder',
      data: { orderId: 'ORD202603290002' }
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('ORDER_NOT_AVAILABLE');
  });
  
  test('非执行者角色返回错误', async () => {
    // 模拟祈福者用户抢单
    const result = await cloud.callFunction({
      name: 'grabOrder',
      data: { orderId: 'ORD202603290003' }
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_ROLE');
  });
  
  test('资质未审核通过返回错误', async () => {
    // 模拟资质 pending 的执行者
    const result = await cloud.callFunction({
      name: 'grabOrder',
      data: { orderId: 'ORD202603290004' }
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('QUALIFICATION_NOT_APPROVED');
  });
});
```

---

### 4. uploadEvidence 云函数测试

```javascript
// test-uploadEvidence.js

describe('uploadEvidence 云函数', () => {
  
  test('初始化上传成功', async () => {
    const result = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'init',
        orderId: 'ORD202603290001',
        fileName: 'test_video.mp4',
        fileSize: 10485760, // 10MB
        fileType: 'video/mp4'
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.evidenceId).toBeDefined();
    expect(result.data.chunkCount).toBeGreaterThan(0);
  });
  
  test('上传分片成功', async () => {
    // 先初始化
    const initResult = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'init',
        orderId: 'ORD202603290002',
        fileName: 'test.mp4',
        fileSize: 1048576,
        fileType: 'video/mp4'
      }
    });
    
    // 上传第一个分片
    const mockChunk = Buffer.from('mock video data').toString('base64');
    const result = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'upload',
        evidenceId: initResult.data.evidenceId,
        chunkIndex: 0,
        chunkData: mockChunk
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.uploadedChunks).toBe(1);
  });
  
  test('查询上传进度', async () => {
    const initResult = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'init',
        orderId: 'ORD202603290003',
        fileName: 'test.mp4',
        fileSize: 2097152,
        fileType: 'video/mp4'
      }
    });
    
    const result = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'progress',
        evidenceId: initResult.data.evidenceId
      }
    });
    
    expect(result.success).toBe(true);
    expect(result.data.progress).toBeGreaterThanOrEqual(0);
    expect(result.data.totalChunks).toBeGreaterThan(0);
  });
  
  test('不支持的文件类型返回错误', async () => {
    const result = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'init',
        orderId: 'ORD202603290004',
        fileName: 'test.exe',
        fileSize: 1024,
        fileType: 'application/octet-stream'
      }
    });
    
    expect(result.success).toBe(false);
    expect(result.errorCode).toBe('INVALID_FILE_TYPE');
  });
});
```

---

## 集成测试用例

```javascript
// test-integration.js

describe('完整业务流程集成测试', () => {
  
  test('完整放生流程', async () => {
    // 1. 用户登录
    const loginResult = await cloud.callFunction({
      name: 'login',
      data: {
        code: 'mock_code',
        userInfo: { nickName: '祈福者测试' }
      }
    });
    expect(loginResult.success).toBe(true);
    const prayerId = loginResult.data.userId;
    
    // 2. 创建订单
    const orderResult = await cloud.callFunction({
      name: 'createOrder',
      data: {
        species: { id: 's1', name: '鲫鱼' },
        location: { latitude: 23.1234, longitude: 113.2345, address: '测试' },
        quantity: 100,
        guidePrice: 299
      }
    });
    expect(orderResult.success).toBe(true);
    const orderId = orderResult.data.orderId;
    
    // 3. 执行者登录
    const executorLogin = await cloud.callFunction({
      name: 'login',
      data: {
        code: 'mock_code_2',
        userInfo: { nickName: '执行者测试' }
      }
    });
    expect(executorLogin.success).toBe(true);
    
    // 4. 抢单
    const grabResult = await cloud.callFunction({
      name: 'grabOrder',
      data: { orderId }
    });
    expect(grabResult.success).toBe(true);
    
    // 5. 上传证据
    const uploadInit = await cloud.callFunction({
      name: 'uploadEvidence',
      data: {
        action: 'init',
        orderId,
        fileName: 'evidence.mp4',
        fileSize: 1048576,
        fileType: 'video/mp4'
      }
    });
    expect(uploadInit.success).toBe(true);
    
    console.log('✅ 完整流程测试通过');
    console.log('订单 ID:', orderId);
  });
});
```

---

## 测试执行命令

```bash
# 运行所有测试
test-runner run tests/

# 运行单个测试
test-runner run tests/test-login.js
test-runner run tests/test-createOrder.js
test-runner run tests/test-grabOrder.js
test-runner run tests/test-uploadEvidence.js

# 运行集成测试
test-runner run tests/test-integration.js

# 生成测试报告
test-runner report --output coverage.html
```

---

## 测试覆盖率目标

| 云函数 | 目标覆盖率 | 当前覆盖率 |
|--------|-----------|-----------|
| login | 90% | 待测试 |
| createOrder | 90% | 待测试 |
| grabOrder | 95% | 待测试 |
| uploadEvidence | 85% | 待测试 |

---

**测试状态**: 用例已编写，等待云函数部署后执行  
**下一步**: 部署云函数 → 运行测试 → 修复问题
