import { useDocumentTitle } from '@shared/hooks'

export default function JobListPage() {
  useDocumentTitle('Việc làm')

  return (
    <div className="page page--jobs">
      <h1>💼 Danh sách việc làm</h1>
      <p>Job search & filter — sẽ implement ở Sprint 2</p>
    </div>
  )
}
