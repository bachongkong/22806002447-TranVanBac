import { useDocumentTitle } from '@shared/hooks'
import JobForm from '@features/jobs/components/JobForm/JobForm'

export default function CreateJobPage() {
  useDocumentTitle('Tạo tin tuyển dụng')

  return (
    <div className="page fade-in">
      <div className="page-header">
        <h1>Tạo tin tuyển dụng</h1>
        <p className="page-subtitle" style={{ color: 'var(--color-text-muted)', marginTop: '0.25rem' }}>
          Điền thông tin để đăng tin tuyển dụng mới cho công ty của bạn
        </p>
      </div>
      <JobForm />
    </div>
  )
}
