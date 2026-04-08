import { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiMapPin, FiBriefcase, FiClock, FiDollarSign,
  FiShare2, FiBookmark, FiSend, FiUsers, FiCalendar,
  FiFileText, FiCheckCircle, FiGift,
} from 'react-icons/fi'

import { useDocumentTitle } from '@shared/hooks'
import { useJob } from '@features/jobs/hooks/useJobs'
import { formatSalary, timeAgo } from '@shared/utils'
import useAuthStore from '@app/store/authStore'
import ApplyJobModal from '@features/applications/components/ApplyJobModal/ApplyJobModal'
import toast from 'react-hot-toast'
import './JobDetailPage.css'

// ============================================
// Skeleton Loading Component
// ============================================
function JobDetailSkeleton() {
  return (
    <div className="job-detail">
      <div className="skeleton-line" style={{ width: 120, height: 20, marginBottom: '1.25rem' }} />
      <div className="job-detail__layout">
        <div className="job-detail__main">
          <div className="job-detail__skeleton">
            <div style={{ display: 'flex', gap: '1.25rem' }}>
              <div className="skeleton-line" style={{ width: 64, height: 64, borderRadius: 12, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--subtitle" />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <div className="skeleton-line skeleton-line--chip" />
                  <div className="skeleton-line skeleton-line--chip" />
                  <div className="skeleton-line skeleton-line--chip" />
                </div>
              </div>
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="job-detail__skeleton">
              <div className="skeleton-line skeleton-line--subtitle" />
              <div className="skeleton-line skeleton-line--full" />
              <div className="skeleton-line skeleton-line--full" />
              <div className="skeleton-line skeleton-line--short" />
            </div>
          ))}
        </div>
        <div className="job-detail__sidebar">
          <div className="job-detail__skeleton" style={{ height: 200 }} />
          <div className="job-detail__skeleton" style={{ height: 160 }} />
        </div>
      </div>
    </div>
  )
}

// ============================================
// Main Component
// ============================================
export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, isError, error } = useJob(id)
  const auth = useAuthStore()

  // --- Apply Modal state ---
  const [showApplyModal, setShowApplyModal] = useState(false)

  const job = data?.data
  const company = job?.companyId || {}

  useDocumentTitle(job ? `${job.title} | SmartHire` : 'Chi tiết việc làm')

  // --- Handle Apply ---
  const handleApply = () => {
    if (!auth?.isAuthenticated) {
    if (!auth?.user) {
      toast('Vui lòng đăng nhập để ứng tuyển', { icon: '🔒' })
      navigate('/login', { state: { from: `/jobs/${id}` } })
      return
    }
    setShowApplyModal(true)
    toast.success('Tính năng ứng tuyển sắp ra mắt! 🚀')
  }

  // --- Handle Share ---
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Đã sao chép liên kết!')
  }

  // --- Handle Bookmark ---
  const handleBookmark = () => {
    toast('Tính năng lưu tin sắp ra mắt!', { icon: '🔖' })
  }

  // --- Loading ---
  if (isLoading) return <JobDetailSkeleton />

  // --- Error ---
  if (isError || !job) {
    return (
      <div className="job-detail">
        <Link to="/jobs" className="job-detail__back">
          <FiArrowLeft /> Quay lại danh sách
        </Link>
        <div className="job-detail__error">
          <FiBriefcase className="job-detail__error-icon" />
          <h2 className="job-detail__error-title">Không tìm thấy việc làm</h2>
          <p className="job-detail__error-text">
            {error?.response?.data?.message || 'Tin tuyển dụng không tồn tại hoặc đã bị xóa.'}
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/jobs')}>
            Quay lại tìm kiếm
          </button>
        </div>
      </div>
    )
  }

  // --- Computed ---
  const companyInitial = (company.name || 'C').charAt(0).toUpperCase()

  return (
    <div className="job-detail">
      {/* Back */}
      <Link to="/jobs" className="job-detail__back">
        <FiArrowLeft /> Quay lại danh sách
      </Link>

      <div className="job-detail__layout">
        {/* ===== LEFT: Main Content ===== */}
        <div className="job-detail__main">
          {/* Header */}
          <div className="job-detail__header">
            <div className="job-detail__header-top">
              <div className="job-detail__logo">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} />
                ) : (
                  <div className="job-detail__logo-placeholder">{companyInitial}</div>
                )}
              </div>
              <div className="job-detail__header-info">
                <h1 className="job-detail__title">{job.title}</h1>
                <p className="job-detail__company-name">{company.name || 'Công ty'}</p>

                <div className="job-detail__meta">
                  {job.employmentType && (
                    <span className="job-detail__chip">
                      <FiBriefcase className="job-detail__chip-icon" />
                      {job.employmentType}
                    </span>
                  )}
                  {job.experienceLevel && (
                    <span className="job-detail__chip">
                      <FiClock className="job-detail__chip-icon" />
                      {job.experienceLevel}
                    </span>
                  )}
                  {job.location && (
                    <span className="job-detail__chip">
                      <FiMapPin className="job-detail__chip-icon" />
                      {job.location}
                    </span>
                  )}
                  {job.expiresAt && (
                    <span className="job-detail__chip">
                      <FiCalendar className="job-detail__chip-icon" />
                      Hạn: {new Date(job.expiresAt).toLocaleDateString('vi-VN')}
                    </span>
                  )}
                </div>

                <p className="job-detail__posted">
                  Đăng {timeAgo(job.createdAt)}
                  {job.createdByHR?.profile?.fullName && (
                    <> · bởi {job.createdByHR.profile.fullName}</>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Skills */}
          {job.skills?.length > 0 && (
            <div className="job-detail__section">
              <h2 className="job-detail__section-title">
                <FiCheckCircle className="job-detail__section-icon" />
                Kỹ năng yêu cầu
              </h2>
              <div className="job-detail__skills">
                {job.skills.map((skill, i) => (
                  <span key={i} className="job-detail__skill-tag">{skill}</span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="job-detail__section">
            <h2 className="job-detail__section-title">
              <FiFileText className="job-detail__section-icon" />
              Mô tả công việc
            </h2>
            <div className={`job-detail__text ${!job.description ? 'job-detail__text--empty' : ''}`}>
              {job.description || 'Chưa có mô tả chi tiết.'}
            </div>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="job-detail__section">
              <h2 className="job-detail__section-title">
                <FiCheckCircle className="job-detail__section-icon" />
                Yêu cầu ứng viên
              </h2>
              <div className="job-detail__text">{job.requirements}</div>
            </div>
          )}

          {/* Benefits */}
          {job.benefits && (
            <div className="job-detail__section">
              <h2 className="job-detail__section-title">
                <FiGift className="job-detail__section-icon" />
                Phúc lợi & Chế độ
              </h2>
              <div className="job-detail__text">{job.benefits}</div>
            </div>
          )}
        </div>

        {/* ===== RIGHT: Sidebar ===== */}
        <div className="job-detail__sidebar">
          {/* CTA Card */}
          <div className="job-detail__cta-card">
            <div className="job-detail__salary-display">
              <FiDollarSign style={{ verticalAlign: 'middle' }} />
              {' '}{formatSalary(job.salaryRange?.min, job.salaryRange?.max)}
            </div>
            <p className="job-detail__salary-label">Mức lương</p>

            <button
              className="job-detail__apply-btn"
              onClick={handleApply}
            >
              <FiSend />
              Ứng tuyển ngay
            </button>

            <div className="job-detail__action-row">
              <button className="job-detail__action-btn" onClick={handleShare}>
                <FiShare2 /> Chia sẻ
              </button>
              <button className="job-detail__action-btn" onClick={handleBookmark}>
                <FiBookmark /> Lưu tin
              </button>
            </div>
          </div>

          {/* Company Card */}
          <div className="job-detail__company-card">
            <div className="job-detail__company-header">
              <div className="job-detail__company-logo">
                {company.logo ? (
                  <img src={company.logo} alt={company.name} />
                ) : (
                  <div className="job-detail__company-logo-sm">{companyInitial}</div>
                )}
              </div>
              <div>
                <h3 className="job-detail__company-title">{company.name || 'Công ty'}</h3>
                {company.industry && (
                  <p className="job-detail__company-industry">{company.industry}</p>
                )}
              </div>
            </div>

            <div className="job-detail__company-info">
              {company.location && (
                <div className="job-detail__company-info-item">
                  <FiMapPin className="job-detail__company-info-icon" />
                  {company.location}
                </div>
              )}
              {company.companySize && (
                <div className="job-detail__company-info-item">
                  <FiUsers className="job-detail__company-info-icon" />
                  {company.companySize} nhân viên
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ===== Apply Modal ===== */}
      <ApplyJobModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        jobId={id}
        jobTitle={job.title}
      />
    </div>
  )
}
