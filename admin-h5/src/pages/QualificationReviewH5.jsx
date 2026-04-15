import React, { useState } from 'react'

/**
 * 资质审核 H5 - 移动应急版
 * 仅通过/驳回功能，简化操作
 */
function QualificationReviewH5() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmAction, setConfirmAction] = useState(null)
  const [rejectReason, setRejectReason] = useState('')
  const [completed, setCompleted] = useState(false)

  // 模拟待审核数据
  const reviews = [
    {
      id: 1,
      applicantName: '李**',
      phone: '138****5678',
      idCard: '110101********1234',
      skillType: '心理咨询',
      certificates: ['心理咨询师三级', '心理健康教育'],
      experience: '5 年',
      applyTime: '2026-03-28 09:30'
    },
    {
      id: 2,
      applicantName: '王**',
      phone: '139****1234',
      idCard: '310101********5678',
      skillType: '法律咨询',
      certificates: ['法律职业资格证书', '律师执业证'],
      experience: '8 年',
      applyTime: '2026-03-28 10:15'
    },
    {
      id: 3,
      applicantName: '张**',
      phone: '137****9012',
      idCard: '440101********9012',
      skillType: '财务规划',
      certificates: ['注册会计师', '理财规划师'],
      experience: '10 年',
      applyTime: '2026-03-28 11:00'
    }
  ]

  const currentReview = reviews[currentIndex]

  const handleApprove = () => {
    setConfirmAction('approve')
    setShowConfirmModal(true)
  }

  const handleReject = () => {
    setConfirmAction('reject')
    setRejectReason('')
    setShowConfirmModal(true)
  }

  const confirmActionHandler = () => {
    if (confirmAction === 'reject' && !rejectReason.trim()) {
      alert('请填写驳回原因')
      return
    }

    // 记录审计日志
    const auditLog = {
      action: confirmAction === 'approve' ? 'QUALIFICATION_APPROVE_H5' : 'QUALIFICATION_REJECT_H5',
      applicantId: currentReview.id,
      applicantName: currentReview.applicantName,
      reason: confirmAction === 'reject' ? rejectReason : '',
      timestamp: new Date().toISOString(),
      operator: 'admin_h5',
      platform: 'mobile'
    }
    // [CLEANED] console.log('Audit Log:', auditLog)// 移动到下一条或完成
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1)
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">审核完成</h2>
          <p className="text-gray-500 mb-8">已处理 {reviews.length} 条资质申请</p>
          <button
            onClick={() => { setCompleted(false); setCurrentIndex(0); }}
            className="btn-primary w-full"
          >
            继续审核
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
          <h1 className="text-lg font-bold">资质审核</h1>
          <span className="text-sm opacity-80">
            {currentIndex + 1} / {reviews.length}
          </span>
        </div>
        <div className="mt-3 bg-white bg-opacity-20 rounded-full h-2">
          <div
            className="bg-white h-2 rounded-full transition-all"
            style={{ width: `${((currentIndex + 1) / reviews.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* 审核内容 */}
      <div className="p-4 space-y-4">
        {/* 基本信息 */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">基本信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">姓名</span>
              <span className="text-gray-900 font-medium">{currentReview.applicantName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">手机号</span>
              <span className="masked-text text-gray-900">{currentReview.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">身份证</span>
              <span className="masked-text text-gray-900">{currentReview.idCard}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">技能类型</span>
              <span className="text-gray-900 font-medium">{currentReview.skillType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">从业经验</span>
              <span className="text-gray-900">{currentReview.experience}</span>
            </div>
          </div>
        </div>

        {/* 资质证书 */}
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4">资质证书</h3>
          <div className="flex flex-wrap gap-2">
            {currentReview.certificates.map((cert, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-dailv-lighter bg-opacity-20 text-dailv"
              >
                {cert}
              </span>
            ))}
          </div>
        </div>

        {/* 申请时间 */}
        <div className="card">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 text-sm">申请时间</span>
            <span className="text-gray-900 text-sm">{currentReview.applyTime}</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 safe-area-pb">
          <div className="flex gap-3 max-w-lg mx-auto">
            <button
              onClick={handleReject}
              className="btn-danger flex-1"
            >
              驳回
            </button>
            <button
              onClick={handleApprove}
              className="btn-success flex-1"
            >
              通过
            </button>
          </div>
        </div>

        {/* 底部占位 */}
        <div className="h-24"></div>
      </div>

      {/* 确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              {confirmAction === 'approve' ? '确认通过' : '确认驳回'}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-600">
                申请人：<span className="font-medium">{currentReview.applicantName}</span>
              </p>
              <p className="text-gray-600 mt-2">
                技能类型：<span className="font-medium">{currentReview.skillType}</span>
              </p>
            </div>

            {confirmAction === 'reject' && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  驳回原因 <span className="text-status-error">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="input-field h-24 resize-none"
                  placeholder="请详细说明驳回原因"
                  required
                />
              </div>
            )}

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-xs text-status-warning">
                ⚠️ 此操作将记录审计日志
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn-secondary flex-1"
              >
                取消
              </button>
              <button
                onClick={confirmActionHandler}
                className={confirmAction === 'approve' ? 'btn-success flex-1' : 'btn-danger flex-1'}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QualificationReviewH5
