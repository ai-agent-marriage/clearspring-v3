import React, { useState } from 'react'

/**
 * 申诉仲裁 H5 - 移动应急版
 * 仅仲裁决定功能，简化操作
 */
function AppealArbitrationH5() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [activeTab, setActiveTab] = useState('customer') // 'customer' or 'executor'
  const [arbitrationResult, setArbitrationResult] = useState('')
  const [arbitrationNote, setArbitrationNote] = useState('')
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [completed, setCompleted] = useState(false)

  // 模拟申诉数据
  const appeals = [
    {
      id: 1,
      orderNo: 'ORD202603280005',
      amount: 680,
      customer: {
        name: '杨先生',
        phone: '138****1234',
        claim: '服务未完成，要求全额退款',
        evidenceCount: 2
      },
      executor: {
        name: '刘**',
        phone: '139****5678',
        defense: '已完成服务，客户无理要求退款',
        evidenceCount: 2
      },
      applyTime: '2026-03-28 14:30'
    },
    {
      id: 2,
      orderNo: 'ORD202603270012',
      amount: 450,
      customer: {
        name: '周女士',
        phone: '137****9012',
        claim: '服务质量不达标，要求部分退款',
        evidenceCount: 1
      },
      executor: {
        name: '陈**',
        phone: '136****3456',
        defense: '服务符合标准，客户期望过高',
        evidenceCount: 2
      },
      applyTime: '2026-03-27 16:20'
    },
    {
      id: 3,
      orderNo: 'ORD202603260008',
      amount: 320,
      customer: {
        name: '吴先生',
        phone: '135****7890',
        claim: '执行者迟到超过 1 小时',
        evidenceCount: 1
      },
      executor: {
        name: '杨**',
        phone: '134****2345',
        defense: '因交通意外迟到，已提前告知客户',
        evidenceCount: 1
      },
      applyTime: '2026-03-26 10:15'
    }
  ]

  const currentAppeal = appeals[currentIndex]
  const currentSide = activeTab === 'customer' ? currentAppeal.customer : currentAppeal.executor

  const handleArbitrate = () => {
    if (!arbitrationResult) {
      alert('请选择仲裁结果')
      return
    }
    if (!arbitrationNote.trim()) {
      alert('请填写仲裁说明')
      return
    }
    setShowConfirmModal(true)
  }

  const confirmArbitration = () => {
    // 记录审计日志
    const auditLog = {
      action: 'APPEAL_ARBITRATION_H5',
      appealId: currentAppeal.id,
      orderNo: currentAppeal.orderNo,
      result: arbitrationResult,
      note: arbitrationNote,
      timestamp: new Date().toISOString(),
      operator: 'admin_h5',
      platform: 'mobile'
    }
    // [CLEANED] console.log('Audit Log:', auditLog)// 移动到下一条或完成
    if (currentIndex < appeals.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setArbitrationResult('')
      setArbitrationNote('')
      setActiveTab('customer')
    } else {
      setCompleted(true)
    }
    setShowConfirmModal(false)
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-status-success bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-12 h-12 text-status-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">仲裁完成</h2>
          <p className="text-gray-500 mb-8">已处理 {appeals.length} 个申诉案件</p>
          <button
            onClick={() => {
              setCompleted(false)
              setCurrentIndex(0)
              setArbitrationResult('')
              setArbitrationNote('')
              setActiveTab('customer')
            }}
            className="btn-primary w-full"
          >
            继续仲裁
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <div className="bg-dailv text-white p-4 sticky top-0 z-10">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">申诉仲裁</h1>
          <span className="text-sm opacity-80">
            {currentIndex + 1} / {appeals.length}
          </span>
        </div>
        <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / appeals.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 案件信息 */}
      <div className="p-4 space-y-4">
        {/* 订单信息 */}
        <div className="card">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-900">订单信息</h3>
            <span className="text-sm text-gray-500">{currentAppeal.applyTime}</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">订单号</span>
              <span className="font-mono text-gray-900">{currentAppeal.orderNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">订单金额</span>
              <span className="font-medium text-dailv">¥{currentAppeal.amount}</span>
            </div>
          </div>
        </div>

        {/* 双方信息切换 */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
          <button
            onClick={() => setActiveTab('customer')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'customer'
                ? 'bg-red-50 text-status-error'
                : 'bg-white text-gray-600'
            }`}
          >
            客户方
          </button>
          <button
            onClick={() => setActiveTab('executor')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${
              activeTab === 'executor'
                ? 'bg-dailv-lighter bg-opacity-20 text-dailv'
                : 'bg-white text-gray-600'
            }`}
          >
            执行者方
          </button>
        </div>

        {/* 一方详细信息 */}
        <div className={`card ${
          activeTab === 'customer' ? 'border-red-200 bg-red-50' : 'border-dailv-lighter bg-dailv-lighter bg-opacity-10'
        }`}>
          <div className="flex items-center mb-4">
            <span className={`w-2 h-2 rounded-full mr-2 ${
              activeTab === 'customer' ? 'bg-status-error' : 'bg-dailv'
            }`}></span>
            <h3 className="font-semibold text-gray-900">
              {activeTab === 'customer' ? '客户方' : '执行者方'}
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">姓名</span>
              <span className="text-gray-900">{currentSide.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">手机</span>
              <span className="masked-text text-gray-900">{currentSide.phone}</span>
            </div>
            <div>
              <span className="text-gray-500">{activeTab === 'customer' ? '申诉主张' : '申辩说明'}</span>
              <p className="text-gray-900 mt-1">{activeTab === 'customer' ? currentSide.claim : currentSide.defense}</p>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500">证据材料</span>
              <span className="text-dailv font-medium">{currentSide.evidenceCount} 个</span>
            </div>
          </div>
        </div>

        {/* 仲裁决定 */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">仲裁决定</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                仲裁结果 <span className="text-status-error">*</span>
              </label>
              <select
                value={arbitrationResult}
                onChange={(e) => setArbitrationResult(e.target.value)}
                className="input-field"
              >
                <option value="">请选择仲裁结果</option>
                <option value="full_refund">全额退款</option>
                <option value="partial_refund">部分退款</option>
                <option value="no_refund">不予退款</option>
                <option value="compensate">额外补偿</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                仲裁说明 <span className="text-status-error">*</span>
              </label>
              <textarea
                value={arbitrationNote}
                onChange={(e) => setArbitrationNote(e.target.value)}
                className="input-field h-32 resize-none"
                placeholder="请详细说明仲裁理由和依据..."
              />
            </div>
          </div>
        </div>

        {/* 提交按钮 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 safe-area-pb">
          <button
            onClick={handleArbitrate}
            className="btn-primary w-full max-w-lg mx-auto block"
          >
            提交仲裁决定
          </button>
        </div>

        {/* 底部占位 */}
        <div className="h-24"></div>
      </div>

      {/* 确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">确认仲裁决定</h3>
            
            <div className="mb-4">
              <p className="text-gray-600">
                订单号：<span className="font-mono">{currentAppeal.orderNo}</span>
              </p>
              <p className="text-gray-600 mt-2">
                仲裁结果：<span className="font-medium text-dailv">{
                  { full_refund: '全额退款', partial_refund: '部分退款', no_refund: '不予退款', compensate: '额外补偿' }[arbitrationResult]
                }</span>
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-status-warning">
                ⚠️ 仲裁决定提交后不可更改，将记录审计日志
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary flex-1"
              >
                返回修改
              </button>
              <button
                onClick={confirmArbitration}
                className="btn-primary flex-1"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AppealArbitrationH5
