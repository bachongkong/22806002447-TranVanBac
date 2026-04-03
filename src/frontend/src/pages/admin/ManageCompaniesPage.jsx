import PendingCompanyList from '@features/admin/components/PendingCompanyList'
import './ManageCompaniesPage.css'

export default function ManageCompaniesPage() {
  return (
    <div className="manage-companies-page fade-in">
      <div className="page-header">
        <h1 className="page-title">Quản lý duyệt Công ty</h1>
        <p className="page-subtitle">
          Danh sách các công ty đang chờ duyệt, từ chối hoặc khóa để đảm bảo chất lượng hệ thống.
        </p>
      </div>

      <div className="page-content">
        <PendingCompanyList />
      </div>
    </div>
  )
}
