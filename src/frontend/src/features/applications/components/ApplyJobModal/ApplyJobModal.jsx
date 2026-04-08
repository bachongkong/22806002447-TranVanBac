import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  FiSend, FiX, FiFileText, FiEdit3,
  FiUpload, FiPenTool, FiStar, FiPlus,
} from 'react-icons/fi'

import { useGetMyCvs } from '@features/cvs/hooks/useCv'
import { useApplyJob } from '../../hooks/useApplication'
import './ApplyJobModal.css'

/**
 * ApplyJobModal — Modal overlay cho candidate ứng tuyển
 * @param {Object} props
 * @param {boolean} props.isOpen - Hiển thị modal
 * @param {Function} props.onClose - Đóng modal
 * @param {string} props.jobId - ID của job
 * @param {string} props.jobTitle - Tên job (hiển thị header)
 */
export default function ApplyJobModal({ isOpen, onClose, jobId, jobTitle }) {
  const [selectedCvId, setSelectedCvId] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')

  // Fetch danh sách CV
  const { data: cvList = [], isLoading: cvLoading } = useGetMyCvs()

  // Mutation ứng tuyển
  const applyMutation = useApplyJob({
    onSuccess: () => {
      onClose()
      setSelectedCvId(null)
      setCoverLetter('')
    },
  })

  // Auto-chọn CV mặc định khi danh sách load xong
  useEffect(() => {
    if (cvList.length > 0 && !selectedCvId) {
      const defaultCv = cvList.find((cv) => cv.isDefault)
      setSelectedCvId(defaultCv ? defaultCv._id : cvList[0]._id)
    }
  }, [cvList, selectedCvId])

  // Đóng modal bằng Escape
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && !applyMutation.isPending) onClose()
    },
    [onClose, applyMutation.isPending]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  if (!isOpen) return null

  // Submit handler
  const handleSubmit = () => {
    if (!selectedCvId || applyMutation.isPending) return
    applyMutation.mutate({
      jobId,
      cvId: selectedCvId,
      coverLetter: coverLetter.trim(),
    })
  }

  // Click backdrop
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && !applyMutation.isPending) {
      onClose()
    }
  }

  // CV source icon
  const getSourceIcon = (source) => {
    if (source === 'upload') return <FiUpload />
    if (source === 'builder') return <FiPenTool />
    return <FiFileText />
  }

  const MAX_COVER_LETTER = 5000

  return (
    <div className="apply-modal__backdrop" onClick={handleBackdropClick}>
      <div className="apply-modal" role="dialog" aria-modal="true">
        {/* Header */}
        <div className="apply-modal__header">
          <h2 className="apply-modal__title">
            <FiSend className="apply-modal__title-icon" />
            Ứng tuyển
          </h2>
          <button
            className="apply-modal__close"
            onClick={onClose}
            disabled={applyMutation.isPending}
            aria-label="Đóng"
          >
            <FiX />
          </button>
        </div>

        {/* Body */}
        <div className="apply-modal__body">
          {/* Job name */}
          <div className="apply-modal__section">
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>
              Vị trí ứng tuyển
            </p>
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-text)', marginTop: '0.2rem' }}>
              {jobTitle}
            </p>
          </div>

          {/* CV Selection */}
          <div className="apply-modal__section">
            <label className="apply-modal__label">
              <FiFileText className="apply-modal__label-icon" />
              Chọn CV để nộp <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
            </label>

            {cvLoading ? (
              <div className="apply-modal__cv-loading">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="apply-modal__cv-skeleton" />
                ))}
              </div>
            ) : cvList.length === 0 ? (
              <div className="apply-modal__empty">
                <FiFileText className="apply-modal__empty-icon" />
                <p className="apply-modal__empty-text">
                  Bạn chưa có CV nào. Hãy tạo hoặc upload CV trước khi ứng tuyển.
                </p>
                <Link to="/candidate/cv" className="apply-modal__empty-link" onClick={onClose}>
                  <FiPlus /> Quản lý CV
                </Link>
              </div>
            ) : (
              <div className="apply-modal__cv-list">
                {cvList.map((cv) => (
                  <label
                    key={cv._id}
                    className={`apply-modal__cv-item ${
                      selectedCvId === cv._id ? 'apply-modal__cv-item--selected' : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="cv-select"
                      className="apply-modal__cv-radio"
                      checked={selectedCvId === cv._id}
                      onChange={() => setSelectedCvId(cv._id)}
                    />
                    <div className="apply-modal__cv-info">
                      <div className="apply-modal__cv-name">
                        {cv.title || cv.fileName || 'CV không tiêu đề'}
                      </div>
                      <div className="apply-modal__cv-meta">
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          {getSourceIcon(cv.source)}
                          {cv.source === 'upload' ? 'Upload' : 'Builder'}
                        </span>
                        <span>·</span>
                        <span>
                          {cv.createdAt
                            ? new Date(cv.createdAt).toLocaleDateString('vi-VN')
                            : ''}
                        </span>
                      </div>
                    </div>
                    {cv.isDefault && (
                      <span className="apply-modal__cv-badge">
                        <FiStar /> Mặc định
                      </span>
                    )}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Cover Letter */}
          <div className="apply-modal__section">
            <label className="apply-modal__label">
              <FiEdit3 className="apply-modal__label-icon" />
              Thư giới thiệu (tùy chọn)
            </label>
            <textarea
              className="apply-modal__textarea"
              placeholder="Viết vài dòng giới thiệu bản thân, lý do bạn phù hợp với vị trí này..."
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value.slice(0, MAX_COVER_LETTER))}
              maxLength={MAX_COVER_LETTER}
              disabled={applyMutation.isPending}
            />
            <div
              className={`apply-modal__char-count ${
                coverLetter.length > MAX_COVER_LETTER * 0.9
                  ? 'apply-modal__char-count--warn'
                  : ''
              }`}
            >
              {coverLetter.length}/{MAX_COVER_LETTER}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="apply-modal__footer">
          <button
            className="apply-modal__btn apply-modal__btn--cancel"
            onClick={onClose}
            disabled={applyMutation.isPending}
          >
            Hủy
          </button>
          <button
            className="apply-modal__btn apply-modal__btn--submit"
            onClick={handleSubmit}
            disabled={!selectedCvId || applyMutation.isPending || cvList.length === 0}
          >
            {applyMutation.isPending ? (
              <>
                <span className="apply-modal__spinner" />
                Đang nộp...
              </>
            ) : (
              <>
                <FiSend />
                Nộp đơn ứng tuyển
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
