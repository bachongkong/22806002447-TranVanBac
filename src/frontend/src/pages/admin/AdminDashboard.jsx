import { useDocumentTitle } from '@shared/hooks'

export default function AdminDashboard() {
  useDocumentTitle('Admin Dashboard')
  return (
    <div className="page">
      <h1>🛡️ Admin Dashboard</h1>
      <p>Tổng quan hệ thống</p>
    </div>
  )
}
