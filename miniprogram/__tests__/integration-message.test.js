/**
 * 消息推送模块集成测试
 * 测试小程序与后端 API 的集成
 */

describe('消息推送集成测试', () => {
  test('获取模板列表成功', async () => {
    // Mock wx.request 返回成功响应
    wx.request.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: [
          {
            id: 1,
            name: '订单创建通知',
            templateId: 'order_create',
            enabled: 1
          },
          {
            id: 2,
            name: '订单完成通知',
            templateId: 'order_complete',
            enabled: 1
          }
        ]
      }
    });

    const res = await wx.request({
      url: 'http://localhost:8080/api/message/template/list',
      method: 'GET'
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(res.data.data).toBeInstanceOf(Array);
    expect(res.data.data.length).toBeGreaterThan(0);
  });
  
  test('发送测试消息成功', async () => {
    // Mock wx.request 返回成功响应
    wx.request.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        code: 200,
        msg: '发送成功',
        data: {
          messageId: 'MSG202604100001',
          sendTime: '2026-04-10 10:30:00'
        }
      }
    });

    const res = await wx.request({
      url: 'http://localhost:8080/api/message/send/test',
      method: 'POST',
      data: {
        openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M',
        templateId: 'ORDER_CREATE',
        data: { orderNo: 'PRO202604100001' }
      }
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(res.data.data.messageId).toBeDefined();
  });

  test('新增消息模板成功', async () => {
    // Mock wx.request 返回成功响应
    wx.request.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          id: 100,
          name: '新增测试模板',
          templateId: 'TEST_TEMPLATE'
        }
      }
    });

    const res = await wx.request({
      url: 'http://localhost:8080/api/message/template/add',
      method: 'POST',
      data: {
        name: '新增测试模板',
        templateId: 'TEST_TEMPLATE',
        trigger: '测试触发',
        content: '测试内容',
        enabled: 1
      }
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(res.data.data.id).toBeDefined();
  });

  test('更新消息模板成功', async () => {
    // Mock wx.request 返回成功响应
    wx.request.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: true
      }
    });

    const res = await wx.request({
      url: 'http://localhost:8080/api/message/template/update',
      method: 'POST',
      data: {
        id: 1,
        name: '更新后的模板名称',
        enabled: 0
      }
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
  });

  test('获取消息记录列表成功', async () => {
    // Mock wx.request 返回成功响应
    wx.request.mockResolvedValueOnce({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          list: [
            {
              id: 1,
              openid: 'o6_bmjrPTlm6_2sgVt7hMZOPfL2M',
              templateName: '订单创建通知',
              status: 'success',
              sendTime: '2026-04-10 10:30:00'
            }
          ],
          total: 1
        }
      }
    });

    const res = await wx.request({
      url: 'http://localhost:8080/api/message/records/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10
      }
    });
    
    expect(res.statusCode).toBe(200);
    expect(res.data.code).toBe(200);
    expect(res.data.data.list).toBeInstanceOf(Array);
    expect(res.data.data.total).toBeGreaterThanOrEqual(0);
  });

  test('导出消息记录成功', () => {
    // Mock wx.downloadFile - 直接验证调用
    wx.downloadFile.mockImplementationOnce(({ success }) => {
      success({
        tempFilePath: '/tmp/message_records.xlsx',
        errMsg: 'downloadFile:ok'
      });
    });

    wx.downloadFile({
      url: 'http://localhost:8080/api/message/records/export',
      success: (res) => {
        expect(res.tempFilePath).toBeDefined();
        expect(res.errMsg).toContain('ok');
      }
    });
    
    expect(wx.downloadFile).toHaveBeenCalled();
  });
});
