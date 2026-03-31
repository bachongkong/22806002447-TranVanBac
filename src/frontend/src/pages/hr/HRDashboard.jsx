import { useDocumentTitle } from '@shared/hooks'

export default function HRDashboard() {
  useDocumentTitle('HR Dashboard')
  return (
    <div className="page">
      <h1>📊 HR Dashboard</h1>
      <p>Tổng quan tuyển dụng</p>
    </div>
  )
}
