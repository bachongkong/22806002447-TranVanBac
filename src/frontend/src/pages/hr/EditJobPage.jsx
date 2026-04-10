import { useParams, useNavigate } from 'react-router-dom'

import { useDocumentTitle } from '@shared/hooks'
import { LoadingSpinner } from '@shared/components'
import { getStatusLabel } from '@shared/utils'
import { useJob } from '@features/jobs/hooks/useJobs'
import JobForm from '@features/jobs/components/JobForm/JobForm'

export default function EditJobPage() {
  useDocumentTitle('Sửa tin tuyển dụng')
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useJob(id)

  // Loading state
  if (isLoading) {
    return (
      <div className="page" style={{ display: 'flex', justifyContent: 'center', paddingTop: '4rem' }}>
        <LoadingSpinner />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="page fade-in">
        <div className="job-readonly-warning">
          <span className="job-readonly-warning__icon">❌</span>
          <h2 className="job-readonly-warning__title">Không thể tải tin tuyển dụng</h2>
          <p className="job-readonly-warning__message">
            {error.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.'}
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/hr/jobs')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  const job = data?.data

  // Non-draft: show read-only warning
  if (job && job.status !== 'draft') {
    return (
      <div className="page fade-in">
        <div className="job-readonly-warning">
          
          <h2 className="job-readonly-warning__title">Không thể chỉnh sửa</h2>
          <p className="job-readonly-warning__message">
            Tin tuyển dụng &ldquo;{job.title}&rdquo; đang ở trạng thái <strong>{getStatusLabel(job.status)}</strong>.
            Chỉ có thể chỉnh sửa tin ở trạng thái <strong>Nháp</strong>.
          </p>
          <button className="btn btn--primary" onClick={() => navigate('/hr/jobs')}>
            Quay lại danh sách
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Sửa tin tuyển dụng</h1>
        <p className="page-subtitle" style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Chỉnh sửa thông tin tin tuyển dụng của bạn
        </p>
      </div>
      <JobForm initialData={job} isEditMode />
    </div>
  )
}
