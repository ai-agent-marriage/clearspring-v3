/**
 * 用户反馈模块集成测试
 * 测试前后端接口的集成情况
 */

// 模拟 wx.request
const mockRequest = jest.fn()
global.wx = {
  request: mockRequest
}

describe('用户反馈集成测试', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('提交反馈成功', async () => {
    // 模拟成功的 API 响应
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          id: 1,
          userId: 1,
          type: 'suggestion',
          title: '测试反馈',
          content: '测试内容',
          status: 1,
          createTime: '2026-04-04 16:00:00'
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/submit',
      method: 'POST',
      data: {
        userId: 1,
        type: 'suggestion',
        title: '测试反馈',
        content: '测试内容'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.id).toBeDefined()
    expect(res.data.data.type).toBe('suggestion')
  })

  test('获取反馈列表成功', async () => {
    // 模拟成功的 API 响应
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          list: [
            {
              id: 1,
              type: 'suggestion',
              title: '反馈 1',
              status: 1,
              createTime: '2026-04-04 10:00:00'
            },
            {
              id: 2,
              type: 'bug',
              title: '反馈 2',
              status: 2,
              createTime: '2026-04-04 11:00:00'
            }
          ],
          total: 2
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/list',
      method: 'GET',
      data: {
        pageNum: 1,
        pageSize: 10
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.list).toBeInstanceOf(Array)
    expect(res.data.data.list.length).toBe(2)
  })

  test('获取反馈详情成功', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          id: 1,
          userId: 1,
          type: 'suggestion',
          title: '测试反馈',
          content: '这是详细的反馈内容',
          status: 1,
          reply: '',
          createTime: '2026-04-04 16:00:00'
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/detail/1',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.id).toBe(1)
  })

  test('处理反馈成功', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: '操作成功'
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/process',
      method: 'POST',
      data: {
        id: 1,
        reply: '已处理，感谢您的反馈'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })

  test('删除反馈成功', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: '删除成功'
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/delete/1',
      method: 'DELETE'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
  })

  test('获取反馈统计成功', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          totalFeedback: 256,
          pendingFeedback: 12,
          processedFeedback: 244,
          todayFeedback: 5
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/stats',
      method: 'GET'
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.totalFeedback).toBe(256)
  })

  test('导出反馈数据成功', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          downloadUrl: 'http://localhost:8080/api/feedback/export/20260404.xlsx'
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/export',
      method: 'POST',
      data: {
        status: 'all',
        startDate: '2026-04-01',
        endDate: '2026-04-04'
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.code).toBe(200)
    expect(res.data.data.downloadUrl).toBeDefined()
  })

  test('提交反馈失败 - 参数校验', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 400,
      data: {
        code: 400,
        msg: '参数错误：标题不能为空'
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/submit',
      method: 'POST',
      data: {
        userId: 1,
        type: 'suggestion',
        title: '',
        content: '测试内容'
      }
    })

    expect(res.statusCode).toBe(400)
    expect(res.data.code).toBe(400)
  })

  test('获取反馈列表 - 按类型筛选', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          list: [
            {
              id: 1,
              type: 'bug',
              title: 'Bug 反馈 1',
              status: 1
            }
          ],
          total: 1
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/list',
      method: 'GET',
      data: {
        type: 'bug',
        pageNum: 1,
        pageSize: 10
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.data.list[0].type).toBe('bug')
  })

  test('获取反馈列表 - 按状态筛选', async () => {
    mockRequest.mockResolvedValue({
      statusCode: 200,
      data: {
        code: 200,
        msg: 'success',
        data: {
          list: [
            {
              id: 1,
              type: 'suggestion',
              title: '待处理反馈',
              status: 1
            }
          ],
          total: 1
        }
      }
    })

    const res = await wx.request({
      url: 'http://localhost:8080/api/feedback/list',
      method: 'GET',
      data: {
        status: 1,
        pageNum: 1,
        pageSize: 10
      }
    })

    expect(res.statusCode).toBe(200)
    expect(res.data.data.list[0].status).toBe(1)
  })
})
