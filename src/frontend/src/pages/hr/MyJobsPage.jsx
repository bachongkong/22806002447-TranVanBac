import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlinePlus, HiOutlinePencilSquare, HiOutlineTrash, HiOutlineBriefcase } from 'react-icons/hi2'

import { useDocumentTitle } from '@shared/hooks'
import { LoadingSpinner } from '@shared/components'
import { JOB_STATUS } from '@shared/constants'
import { formatDate, getStatusColor, getStatusLabel } from '@shared/utils'
import { useMyJobs, useDeleteJob, useUpdateJobStatus } from '@features/jobs/hooks/useJobs'
import './MyJobsPage.css'

// Status tabs config
const STATUS_TABS = [
  { key: '', label: 'Tất cả' },
  { key: JOB_STATUS.DRAFT, label: 'Nháp' },
  { key: JOB_STATUS.PENDING, label: 'Chờ duyệt' },
  { key: JOB_STATUS.PUBLISHED, label: 'Đã đăng' },
  { key: JOB_STATUS.REJECTED, label: 'Từ chối' },
  { key: JOB_STATUS.CLOSED, label: 'Đã đóng' },
]

// Allowed status transitions for HR
const STATUS_TRANSITIONS = {
  [JOB_STATUS.DRAFT]: [
    { value: JOB_STATUS.PENDING, label: '→ Gửi duyệt' },
    { value: JOB_STATUS.PUBLISHED, label: '→ Đăng ngay' },
  ],
  [JOB_STATUS.PENDING]: [
    { value: JOB_STATUS.DRAFT, label: '→ Về nháp' },
    { value: JOB_STATUS.PUBLISHED, label: '→ Đăng ngay' },
  ],
  [JOB_STATUS.PUBLISHED]: [
    { value: JOB_STATUS.CLOSED, label: '→ Đóng tin' },
  ],
  [JOB_STATUS.CLOSED]: [
    { value: JOB_STATUS.PUBLISHED, label: '→ Mở lại' },
  ],
}

export default function MyJobsPage() {
  useDocumentTitle('Tin tuyển dụng')
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('')
  const [page, setPage] = useState(1)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const limit = 10
  const params = { page, limit, ...(activeTab && { status: activeTab }) }
  const { data, isLoading } = useMyJobs(params)
  const deleteJob = useDeleteJob()
  const updateJobStatus = useUpdateJobStatus()

  const jobs = data?.data || []
  const total = data?.meta?.total || 0
  const totalPages = Math.ceil(total / limit)

  // -------------------------------------------
  // Handlers
  // -------------------------------------------
  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey)
    setPage(1)
  }

  const handleDelete = (job) => {
    setDeleteTarget(job)
  }

  const confirmDelete = () => {
    if (deleteTarget) {
      deleteJob.mutate(deleteTarget._id, {
        onSuccess: () => setDeleteTarget(null),
      })
    }
  }

  const handleStatusChange = (jobId, newStatus) => {
    updateJobStatus.mutate({ id: jobId, status: newStatus })
  }

  // -------------------------------------------
  // Render
  // -------------------------------------------

  if (isLoading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="my-jobs-page page fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1>Tin tuyển dụng</h1>
          <p className="page-subtitle">
            Quản lý tất cả tin tuyển dụng của bạn
          </p>
        </div>
        <button
          className="btn btn--primary"
          onClick={() => navigate('/hr/jobs/create')}
        >
          <HiOutlinePlus /> Tạo tin mới
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="jobs-filter-tabs">
        {STATUS_TABS.map(({ key, label }) => (
          <button
            key={key}
            className={`jobs-filter-tab ${activeTab === key ? 'jobs-filter-tab--active' : ''}`}
            onClick={() => handleTabChange(key)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      {jobs.length === 0 ? (
        <div className="jobs-empty-state">
          <HiOutlineBriefcase className="jobs-empty-state__icon" />
          <h2 className="jobs-empty-state__title">
            {activeTab ? `Không có tin nào ở trạng thái "${getStatusLabel(activeTab)}"` : 'Chưa có tin tuyển dụng nào'}
          </h2>
          <p className="jobs-empty-state__text">
            {!activeTab && 'Bắt đầu bằng cách tạo tin tuyển dụng đầu tiên để thu hút ứng viên tiềm năng.'}
          </p>
          {!activeTab && (
            <button
              className="btn btn--primary"
              onClick={() => navigate('/hr/jobs/create')}
            >
              <HiOutlinePlus /> Tạo tin tuyển dụng
            </button>
          )}
        </div>
      ) : (
        <div className="jobs-table-wrapper">
          <table className="jobs-table">
            <thead>
              <tr>
                <th>Tiêu đề</th>
                <th>Trạng thái</th>
                <th>Loại hình</th>
                <th>Ngày tạo</th>
                <th>Hạn nộp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <div className="jobs-table__title">
                      <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getStatusColor(job.status)}`}>
                      {getStatusLabel(job.status)}
                    </span>
                  </td>
                  <td>{job.employmentType || '—'}</td>
                  <td>{formatDate(job.createdAt)}</td>
                  <td>{job.expiresAt ? formatDate(job.expiresAt) : '—'}</td>
                  <td>
                    <div className="jobs-table__actions">
                      {/* Edit — only draft */}
                      {job.status === JOB_STATUS.DRAFT && (
                        <button
                          className="action-btn"
                          onClick={() => navigate(`/hr/jobs/${job._id}/edit`)}
                          title="Sửa"
                        >
                          <HiOutlinePencilSquare className="action-btn__icon" />
                        </button>
                      )}

                      {/* Delete — only draft */}
                      {job.status === JOB_STATUS.DRAFT && (
                        <button
                          className="action-btn action-btn--danger"
                          onClick={() => handleDelete(job)}
                          title="Xóa"
                        >
                          <HiOutlineTrash className="action-btn__icon" />
                        </button>
                      )}

                      {/* Status transition dropdown */}
                      {STATUS_TRANSITIONS[job.status]?.length > 0 && (
                        <select
                          className="status-select"
                          defaultValue=""
                          onChange={(e) => {
                            if (e.target.value) {
                              handleStatusChange(job._id, e.target.value)
                              e.target.value = ''
                            }
                          }}
                        >
                          <option value="" disabled>Chuyển...</option>
                          {STATUS_TRANSITIONS[job.status].map(({ value, label }) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="jobs-pagination">
              <span className="jobs-pagination__info">
                Trang {page} / {totalPages} — Tổng {total} tin
              </span>
              <div className="jobs-pagination__buttons">
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page <= 1}
                >
                  ← Trước
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      className={`pagination-btn ${page === pageNum ? 'pagination-btn--active' : ''}`}
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </button>
                  )
                })}
                <button
                  className="pagination-btn"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                >
                  Tiếp →
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirm Modal */}
      {deleteTarget && (
        <div className="confirm-overlay" onClick={() => setDeleteTarget(null)}>
          <div className="confirm-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="confirm-modal__title">Xác nhận xóa</h3>
            <p className="confirm-modal__message">
              Bạn có chắc chắn muốn xóa tin &ldquo;{deleteTarget.title}&rdquo;?
              Hành động này không thể hoàn tác.
            </p>
            <div className="confirm-modal__actions">
              <button className="btn btn--outline" onClick={() => setDeleteTarget(null)}>
                Hủy
              </button>
              <button
                className="btn btn--danger-outline"
                onClick={confirmDelete}
                disabled={deleteJob.isPending}
              >
                {deleteJob.isPending ? 'Đang xóa...' : 'Xóa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
