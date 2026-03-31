import { useDocumentTitle } from '@shared/hooks'

export default function CandidateDashboard() {
  useDocumentTitle('Dashboard')
  return (
    <div className="page">
      <h1>📊 Candidate Dashboard</h1>
      <p>Tổng quan tình hình ứng tuyển</p>
    </div>
  )
}
