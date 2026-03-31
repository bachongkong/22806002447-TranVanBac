import { useDocumentTitle } from '@shared/hooks'

export default function JobDetailPage() {
  useDocumentTitle('Chi tiết việc làm')

  return (
    <div className="page page--job-detail">
      <h1>📄 Chi tiết việc làm</h1>
      <p>Job detail & apply — sẽ implement ở Sprint 2</p>
    </div>
  )
}
