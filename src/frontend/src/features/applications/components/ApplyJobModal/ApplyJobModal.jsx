import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiEdit3,
  FiFileText,
  FiPlus,
  FiSend,
  FiStar,
  FiUpload,
  FiX,
} from 'react-icons/fi'
import { PiPenNibStraight } from 'react-icons/pi'

import { useGetMyCvs } from '@features/cvs/hooks/useCv'

import { useApplyJob } from '../../hooks/useApplication'

import './ApplyJobModal.css'

export default function ApplyJobModal({ isOpen, onClose, jobId, jobTitle }) {
  const [selectedCvId, setSelectedCvId] = useState(null)
  const [coverLetter, setCoverLetter] = useState('')

  const { data: cvList = [], isLoading: cvLoading } = useGetMyCvs()

  const applyMutation = useApplyJob({
    onSuccess: () => {
      onClose()
      setSelectedCvId(null)
      setCoverLetter('')
    },
  })

  const defaultCvId =
    cvList.find((cv) => cv.isDefault)?._id ||
    cvList[0]?._id ||
    null

  const effectiveSelectedCvId =
    cvList.some((cv) => cv._id === selectedCvId) ? selectedCvId : defaultCvId

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && !applyMutation.isPending) {
        onClose()
      }
    },
    [applyMutation.isPending, onClose]
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
  }, [handleKeyDown, isOpen])

  if (!isOpen) return null

  const handleSubmit = () => {
    if (!effectiveSelectedCvId || applyMutation.isPending) return

    applyMutation.mutate({
      jobId,
      cvId: effectiveSelectedCvId,
      coverLetter: coverLetter.trim(),
    })
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && !applyMutation.isPending) {
      onClose()
    }
  }

  const getSourceIcon = (source) => {
    if (source === 'upload') return <FiUpload />
    if (source === 'builder') return <PiPenNibStraight />
    return <FiFileText />
  }

  const maxCoverLetter = 5000

  return (
    <div className="apply-modal__backdrop" onClick={handleBackdropClick}>
      <div className="apply-modal" role="dialog" aria-modal="true">
        <div className="apply-modal__header">
          <h2 className="apply-modal__title">
            <FiSend className="apply-modal__title-icon" />
            Ứng tuyển
          </h2>
          <button
            type="button"
            className="apply-modal__close"
            onClick={onClose}
            disabled={applyMutation.isPending}
            aria-label="Đóng"
          >
            <FiX />
          </button>
        </div>

        <div className="apply-modal__body">
          <div className="apply-modal__section">
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-dim)' }}>
              Vị trí ứng tuyển
            </p>
            <p
              style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--color-text)',
                marginTop: '0.2rem',
              }}
            >
              {jobTitle}
            </p>
          </div>

          <div className="apply-modal__section">
            <label className="apply-modal__label">
              <FiFileText className="apply-modal__label-icon" />
              Chọn CV để nộp <span style={{ color: 'var(--color-danger, #ef4444)' }}>*</span>
            </label>

            {cvLoading ? (
              <div className="apply-modal__cv-loading">
                {[1, 2, 3].map((index) => (
                  <div key={index} className="apply-modal__cv-skeleton" />
                ))}
              </div>
            ) : cvList.length === 0 ? (
              <div className="apply-modal__empty">
                <FiFileText className="apply-modal__empty-icon" />
                <p className="apply-modal__empty-text">
                  Bạn chưa có CV nào. Hãy tạo hoặc upload CV trước khi ứng tuyển.
                </p>
                <Link
                  to="/candidate/cv"
                  className="apply-modal__empty-link"
                  onClick={onClose}
                >
                  <FiPlus /> Quản lý CV
                </Link>
              </div>
            ) : (
              <div className="apply-modal__cv-list">
                {cvList.map((cv) => (
                  <label
                    key={cv._id}
                    className={`apply-modal__cv-item ${
                      effectiveSelectedCvId === cv._id
                        ? 'apply-modal__cv-item--selected'
                        : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="cv-select"
                      className="apply-modal__cv-radio"
                      checked={effectiveSelectedCvId === cv._id}
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

          <div className="apply-modal__section">
            <label className="apply-modal__label">
              <FiEdit3 className="apply-modal__label-icon" />
              Thư giới thiệu (tùy chọn)
            </label>
            <textarea
              className="apply-modal__textarea"
              placeholder="Viết vài dòng giới thiệu bản thân, lý do bạn phù hợp với vị trí này..."
              value={coverLetter}
              onChange={(event) => setCoverLetter(event.target.value.slice(0, maxCoverLetter))}
              maxLength={maxCoverLetter}
              disabled={applyMutation.isPending}
            />
            <div
              className={`apply-modal__char-count ${
                coverLetter.length > maxCoverLetter * 0.9
                  ? 'apply-modal__char-count--warn'
                  : ''
              }`}
            >
              {coverLetter.length}/{maxCoverLetter}
            </div>
          </div>
        </div>

        <div className="apply-modal__footer">
          <button
            type="button"
            className="apply-modal__btn apply-modal__btn--cancel"
            onClick={onClose}
            disabled={applyMutation.isPending}
          >
            Hủy
          </button>
          <button
            type="button"
            className="apply-modal__btn apply-modal__btn--submit"
            onClick={handleSubmit}
            disabled={!effectiveSelectedCvId || applyMutation.isPending || cvList.length === 0}
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
